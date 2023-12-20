import { sendSMS } from './sms.controller';
import { Router } from 'express';
import asynchronousHandler from '../../middlewares/asynchronousHandler';

const router: Router = Router();

router.post('/', asynchronousHandler(sendSMS));

export default router;
