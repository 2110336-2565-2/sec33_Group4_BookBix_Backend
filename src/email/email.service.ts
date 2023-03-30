import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
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
