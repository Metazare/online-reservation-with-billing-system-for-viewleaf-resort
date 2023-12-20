const {
    SEMAPHORE_KEY,
    SEMPAHORE_SENDER,
} = process.env;

import axios from 'axios';

export const send: (number: string, message: string) => Promise<unknown> = async (number, message) => {
    const url = 'https://api.semaphore.co/api/v4/messages';
    const data: Record<string, string> = {
        apikey: String(SEMAPHORE_KEY),
        number,
        message,
        sendername: String(SEMPAHORE_SENDER),
    };

    return axios.post(url, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).then(e => e.data);
}

export default send;