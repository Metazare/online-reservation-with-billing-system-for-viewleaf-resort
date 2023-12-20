import { BodyRequest, RequestHandler } from 'express';
import { SMS } from './sms.types';
import semaphore_send from '../../utilities/semaphore';

export const sendSMS: RequestHandler = async (req: BodyRequest<SMS>, res) => {
  const { phone, content } = req.body;

  try {
    const info = await semaphore_send(phone, content);
    res.json(info);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: 'Error sending email', message: error.message });
  }
};

