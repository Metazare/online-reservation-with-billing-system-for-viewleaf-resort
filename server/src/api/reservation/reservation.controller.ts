import { BodyRequest, QueryRequest, RequestHandler } from 'express';
import { CheckData } from '../../utilities/checkData';
import { Conflict, NotFound, UnprocessableEntity } from '../../utilities/errors';
import {
    AddExtras,
    CreateReservation,
    GetReservations,
    PayReservation,
    ReservationDocument,
    ReservationStatus,
    ReservationInfo,
    UpdateStatus,
    PopulatedInvoice,
    RescheduleReservation
} from './reservation.types';
import { InvoiceDocument, InvoicePopulatedDocument } from '../invoice/invoice.types';
import { Shift } from '../accommodation/accommodation.types';
import AccommodationModel from '../accommodation/accommodation.model';
import InvoiceModel from '../invoice/invoice.model';
import ReservationModel from './reservation.model';
import receiptModel from '../receipt/receipt.model';
import feedbackModel from '../feedback/feedback.model';
import { CreateFeedback } from '../feedback/feedback.types';

const openReservationStatuses = [
    ReservationStatus.CANCELLED,
    ReservationStatus.DECLINED,
    ReservationStatus.REFUNDED,
    ReservationStatus.CHECKED_OUT
];

export const getReservations: RequestHandler = async (req: QueryRequest<GetReservations>, res) => {
    const { reservationId, status } = req.query;

    const checker = new CheckData();
    const reservationQuery: Record<string, unknown> = {};

    if (reservationId) {
        checker.checkType(reservationId, 'string', 'reservationId');
        if (checker.size() > 0) throw new UnprocessableEntity(checker.errors);

        reservationQuery.reservationId = reservationId;
    }

    if (status) {
        checker.checkType(status, 'string', 'status');
        if (checker.size() > 0) throw new UnprocessableEntity(checker.errors);

        reservationQuery.status = status;
    }

    const reservations: ReservationDocument[] = await ReservationModel.find(reservationQuery).exec();
    if (!reservations) throw new NotFound('Reservation');

    const reservationWithInvoices: ReservationInfo[] = await Promise.all(
        reservations.map(async (reservation) => {
            // Get the invoices of each reservation found
            const invoices = await InvoiceModel.find({ reservation: reservation._id }, { reservation: 0 }).exec();

            const populatedInvoices: ReservationInfo['invoices'] = await Promise.all(
                invoices.map(async (invoice) => {
                    let accommodationId: string;
                    let restInvoice: PopulatedInvoice;

                    ({ accommodationId, ...restInvoice } = invoice.toJSON());
                    const accommodation = await AccommodationModel.findOne({ accommodationId }).exec();
                    restInvoice.accommodation = accommodation;
                    return restInvoice;
                })
            );

            // Get receipts of reservation
            const receipts = await receiptModel.find({ reservation: reservation._id }).exec();

            // Get feedbacks of reservation
            const feedbacks = await feedbackModel.find({ reservation: reservation._id }).exec();

            return {
                ...reservation.toJSON(),
                invoices: populatedInvoices,
                receipts: receipts.map((receipt) => receipt.image),
                feedbacks: feedbacks.map((feedback) => {
                    const { reservation, ...rest } = feedback.toJSON();
                    return rest;
                })
            };
        })
    );

    res.json(reservationWithInvoices);
};

const reservationTimeLimitInMinutes = 15;
export const createReservation: RequestHandler = async (req: BodyRequest<CreateReservation>, res) => {
    const { name, phone, email, schedule } = req.body;
    let { accommodations } = req.body;

    const checker = new CheckData();

    checker.checkType(name, 'string', 'name');
    checker.checkType(phone, 'string', 'phone');
    checker.checkType(email, 'string', 'email');
    checker.checkType(schedule, 'number', 'schedule');
    checker.checkArray(accommodations, 1, 'accommodations');
    if (checker.size() > 0) throw new UnprocessableEntity(checker.errors);

    for (let i = 0; i < accommodations.length; i++) {
        const { accommodationId, shift, guests, inclusions = [], total, minimum } = accommodations[i];

        checker.checkType(accommodationId, 'string', `accommodations.${i}.accommodationId`);
        checker.checkType(shift, 'string', `accommodations.${i}.shift`);
        checker.checkType(guests, 'object', `accommodations.${i}.guests`);
        checker.checkType(total, 'number', `accommodations.${i}.total`);
        checker.checkType(minimum, 'number', `accommodations.${i}.minimum`);
        if (checker.size() > 0) continue;

        const { adult = 0, kids = 0, senior = 0, pwd = 0 } = guests;

        checker.checkType(adult, 'number', `accommodations.${i}.guests.adult`);
        checker.checkType(kids, 'number', `accommodations.${i}.guests.kids`);
        checker.checkType(senior, 'number', `accommodations.${i}.guests.senior`);
        checker.checkType(pwd, 'number', `accommodations.${i}.guests.pwd`);
        checker.checkArray(inclusions, 0, `accommodations.${i}.inclusions`);
        if (checker.size() > 0) continue;

        for (let j = 0; j < inclusions.length; j++) {
            const { name, quantity } = inclusions[j];

            checker.checkType(name, 'string', `accommodations.${i}.inclusions.${j}.name`);
            checker.checkType(quantity, 'number', `accommodations.${i}.inclusions.${j}.quantity`);
        }
    }

    if (checker.size() > 0) throw new UnprocessableEntity(checker.errors);

    // Filter duplicate accommodations
    const accommodationIds: string[] = [...new Set(accommodations.map(({ accommodationId }) => accommodationId))];

    const reservation = new ReservationModel({
        customer: {
            name,
            phone,
            email
        },
        schedule
    });
    const invoices: InvoiceDocument[] = [];

    for (const accommodationId of accommodationIds) {
        const accommodation = accommodations.find(({ accommodationId: id }) => id === accommodationId);
        if (!accommodation) continue;

        const { shift, guests, inclusions, total, minimum } = accommodation;

        let shiftQuery = { $in: [shift, Shift.WHOLE] };
        if (shift === Shift.WHOLE) shiftQuery = { $in: [Shift.WHOLE, Shift.DAY, Shift.NIGHT] };

        // Find invoices whose accommodationId is the same
        const existingInvoices: InvoicePopulatedDocument[] = await InvoiceModel.find({
            accommodationId,
            shift: shiftQuery
        })
            .populate('reservation')
            .exec();

        // Get the bounds of the schedule
        const minSchedule = new Date(schedule);
        minSchedule.setHours(0, 0, 0, 0);

        const maxSchedule = new Date(schedule);
        maxSchedule.setHours(23, 59, 59, 999);

        // Check if the reservation status is not an "open" status for the given schedule
        if (
            existingInvoices.some(
                ({ reservation }) =>
                    !openReservationStatuses.includes(reservation.status) &&
                    reservation.schedule >= minSchedule &&
                    reservation.schedule <= maxSchedule
            )
        ) {
            // This means that there an reservation where the status is not available.
            // Accommodations from the said reservation is not available
            // Therefore, throw error
            throw new Conflict(`Reservation for the accommodation ${accommodationId}`);
        }

        const accommodationDocument = await AccommodationModel.findOne({ accommodationId }).exec();
        if (!accommodationDocument) throw new NotFound('Accommodation');

        const fee = accommodationDocument.fees.find((fee) => fee.shift === shift);
        if (!fee) throw new NotFound('Shift');

        invoices.push(
            new InvoiceModel({
                reservation: reservation._id,
                accommodationId,
                shift,
                rate: fee.rate,
                guestFee: fee.guestFee,
                inclusions: accommodationDocument.inclusions.map((inclusion) => {
                    const foundInclusion = inclusions.find(({ name }) => name === inclusion.name);
                    if (!foundInclusion) return { ...inclusion, quantity: 0 };
                    return { ...inclusion, quantity: foundInclusion.quantity };
                }),
                guests,
                total,
                minimum
            })
        );
    }

    await reservation.save();
    await Promise.all(invoices.map((invoice) => invoice.save()));

    setTimeout(() => {
        if (reservation.status === ReservationStatus.PENDING) {
            reservation.status = ReservationStatus.CANCELLED;
            reservation.save();
        }
    }, 1000 * 60 * reservationTimeLimitInMinutes);

    res.status(201).json({ reservationId: reservation.reservationId });
};

export const addExtras: RequestHandler = async (_req: BodyRequest<AddExtras>, _res) => {

};

export const updateStatus: RequestHandler = async (req: BodyRequest<UpdateStatus>, res) => {
    const { reservationId, status, note } = req.body;

    const checker = new CheckData();
    checker.checkType(reservationId, 'string', 'reservationId');
    checker.checkType(status, 'string', 'status');
    checker.checkType(note, 'string', 'note');

    if (checker.size() > 0) throw new UnprocessableEntity(checker.errors);

    const reservation = await ReservationModel.findOne({ reservationId }).exec();
    if (!reservation) throw new NotFound('Reservation');

    reservation.status = status;
    reservation.notes = [...reservation.notes, { status, note }];
    await reservation.save();

    res.sendStatus(204);
};

export const payReservation: RequestHandler = async (req: BodyRequest<PayReservation>, res) => {
    const { reservationId, receipt } = req.body;

    const checker = new CheckData();
    checker.checkType(reservationId, 'string', 'reservationId');
    checker.checkType(receipt, 'string', 'receipt');

    if (checker.size() > 0) throw new UnprocessableEntity(checker.errors);

    const reservation = await ReservationModel.findOne({ reservationId }).exec();
    if (!reservation) throw new NotFound('Reservation');

    await receiptModel.create({
        reservation: reservation._id,
        image: receipt
    });

    reservation.status = ReservationStatus.PAID;

    res.sendStatus(204);
};

export const rescheduleReservation: RequestHandler = async (req: BodyRequest<RescheduleReservation>, res) => {
    const { reservationId, schedule } = req.body;

    const checker = new CheckData();
    checker.checkType(reservationId, 'string', 'reservationId');
    checker.checkType(schedule, 'string', 'schedule');

    if (checker.size() > 0) throw new UnprocessableEntity(checker.errors);

    const reservation = await ReservationModel.findOne({ reservationId }).exec();
    if (!reservation) throw new NotFound('Reservation');

    reservation.schedule = new Date(schedule);
    await reservation.save();

    res.sendStatus(204);
};

export const addFeedbcak: RequestHandler = async (req: BodyRequest<CreateFeedback>, res) => {
    const { reservationId, rating, review } = req.body;

    const checker = new CheckData();
    checker.checkType(rating, 'number', 'rating');
    checker.checkType(reservationId, 'string', 'reservationId');

    if (checker.size() > 0) throw new UnprocessableEntity(checker.errors);

    if (review) {
        checker.checkType(review, 'string', 'review');
        if (checker.size() > 0) throw new UnprocessableEntity(checker.errors);
    }

    const reservation = await ReservationModel.findOne({ reservationId }).exec();
    if (!reservation) throw new NotFound('Reservation');

    await feedbackModel.create({
        reservation: reservation._id,
        rating,
        review
    });

    res.sendStatus(201);
};
