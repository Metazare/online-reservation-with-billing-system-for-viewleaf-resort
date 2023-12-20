import { BodyRequest, RequestHandler } from 'express';
import { Email } from './email.types';
import envs from '../../utilities/envs';

const nodemailer = require('nodemailer');
const { NODEMAILER_EMAIL, NODEMAILER_PASSWORD } = envs;


export const sendEmail: RequestHandler = async (req: BodyRequest<Email>, res) => {
  const { to, subject, content } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: NODEMAILER_EMAIL,
      pass: NODEMAILER_PASSWORD,
    },
  });

  try {
    // Send email
    const info = await transporter.sendMail({
      from: NODEMAILER_EMAIL, // Sender address
      to: to, // Recipient address
      subject: subject, // Subject line
      html: content // HTML body
    });

    res.json(info);

  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: 'Error sending email', message: error.message });
  }

};

