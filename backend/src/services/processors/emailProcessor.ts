import { Job } from 'bullmq';
import logger from '../../config/logger';
import { EmailJobData } from '../queue.service';

export async function processEmailJob(job: Job): Promise<void> {
  const data = job.data as EmailJobData;
  logger.info('Processing email job', { to: data.to, subject: data.subject });

  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });

    logger.info('Email sent successfully', { to: data.to });
  } catch (err) {
    logger.error('Email job failed', {
      to: data.to,
      err: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}
