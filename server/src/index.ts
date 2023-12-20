import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import cron from 'node-cron';

// Cronjob Requirements
import {
    ReservationDocument,
    ReservationStatus,
} from './api/reservation/reservation.types';
import ReservationModel from './api/reservation/reservation.model';
import { send as sendSMS } from './utilities/semaphore';
import { retrieve as retrievePaymongoInvoice } from './utilities/paymongo';

// Middlewares
import errorHandler from './middlewares/errorHandler';

import staffRoute from './api/staff/staff.route';
import accommodationRoute from './api/accommodation/accommodation.route';
import reservationRoute from './api/reservation/reservation.route';

// Utilities
import { NotFound } from './utilities/errors';
import { Role } from './api/staff/staff.types';
import envs from './utilities/envs';
import StaffModel from './api/staff/staff.model';


// Routes
import faqRoute from './api/faq/faq.route';
import contentRoute from './api/content/content.route';
import emailRoute from './api/email/email.route';
import smsRoute from './api/sms/sms.route';

// Environment Variables
const { PORT, MONGO_URI, CORS_ORIGIN, USERNAME, PASSWORD, EMAIL } = envs;

const app = express();

cron.schedule('*/10 * * * * *', async () => {
    var reservations: ReservationDocument[] = await ReservationModel.find({ 'paymongo.status': 'unpaid' }).exec();
    if (!reservations) return;
    for (let i = 0; i < reservations.length; i++) {
        const dt = new Date().toLocaleString();
        const reservation = reservations[i];
        if (reservation?.paymongo?.status === 'unpaid') {
            reservation.paymongo = await retrievePaymongoInvoice(reservation?.paymongo?.id);
            if (reservation?.paymongo?.status === 'paid') {
                reservation.status = ReservationStatus.PAID;
            }

            await reservation.save();
            console.log(`[${dt}] Cronjob: Updated reservation #${reservation.reservationId} to ${reservation.status}`);
            if (reservation?.paymongo?.status === 'paid') {
                const sms_phone = reservation?.customer?.phone;
                const sms_content = `Thank you! we received your payment for reservation #${reservation?.reservationId} and currently verifying it. We'll update you shortly!`;
                await sendSMS(sms_phone, sms_content)
                    .then(() => console.log(`[${dt}] Cronjob: Sent SMS to ${sms_phone}`))
                    .catch(() => console.log(`[${dt}] Cronjob: Error sending SMS to ${sms_phone}`));
            }
        }
    }
});

app.use(cors({ credentials: true, origin: CORS_ORIGIN }));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());

app.use('/emails', emailRoute);
app.use('/sms', smsRoute);
app.use('/faqs', faqRoute);
app.use('/contents', contentRoute);
app.use('/staffs', staffRoute);
app.use('/email', emailRoute);
app.use('/accommodations', accommodationRoute);
app.use('/reservations', reservationRoute);
app.use('/staffs', staffRoute);

app.use((_req, _res, next) => next(new NotFound()));
app.use(errorHandler);

mongoose
    .connect(MONGO_URI)
    .then(() => StaffModel.findOne({ role: Role.ADMIN }).exec())
    .then((admin) =>
        admin
            ? admin
            : StaffModel.create({
                username: USERNAME,
                credentials: {
                    email: EMAIL,
                    password: PASSWORD
                },
                role: Role.ADMIN
            })
    )
    .then(() => {
        console.log('Connected to database');
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    })
    .catch(console.error);

