const {
    PAYMONGO_SECRET,
} = process.env;

import axios from 'axios';

export type PaymentData = {
    amount: number;
    description: string;
    remarks?: string;
};

export const create = async (attr: PaymentData): Promise<{
    id: string;
    url: string;
    ref: string;
    status: string;
}> => {
    const url = 'https://api.paymongo.com/v1/links';
    attr.amount = (Math.round((Number(attr.amount) + Number.EPSILON) * 100) / 100) * 100;
    const payload = {
        data: {
            attributes: attr,
        },
    };

    return axios.post(url, payload, {
        headers: {
            'Authorization': `Basic ${Buffer.from(`${PAYMONGO_SECRET}:`).toString('base64')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    })
        .then(e => e.data)
        .then(e => ({
            id: e.data.id,
            url: e.data.attributes.checkout_url,
            ref: e.data.attributes.reference_number,
            status: e.data.attributes.status,
        }))
};

export const retrieve = async (id: string): Promise<{
    id: string;
    url: string;
    ref: string;
    status: string;
}> => {
    const url = `https://api.paymongo.com/v1/links/${id}`;

    return axios.get(url, {
        headers: {
            'Authorization': `Basic ${Buffer.from(`${PAYMONGO_SECRET}:`).toString('base64')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    })
        .then(e => e.data)
        .then(e => ({
            id: e.data.id,
            url: e.data.attributes.checkout_url,
            ref: e.data.attributes.reference_number,
            status: e.data.attributes.status,
        }))
}