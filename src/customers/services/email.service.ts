import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
  }

  async sendEmail(to: string, subject: string, body: string) {
    const mailOptions = {
      from: 'Bookbix solo20113@gmail.com',
      to,
      subject,
      html: body,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
