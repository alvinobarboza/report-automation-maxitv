import nodemailer from 'nodemailer';
import { FILENAMES, loadEmailTemplate } from '../utils/fileHandler.js';

const EMAIL = process.env.EMAIL;
const PASSWD = process.env.PASSWORD;

export async function sendEmail() {
    try {
        const date = new Date().toLocaleString();
        console.log(FILENAMES);

        const emails = [
            'alvino.barboza@youcast.tv.br',
            'daniel.campos@youcast.tv.br',
            'vinicius.okaeda@youcast.tv.br',
            'carlos.salce@youcast.tv.br',
            'joao.kentaro@youcast.tv.br',
        ];
        const bodyPlainText = `
        Email enviado automáticamente,
        Segue relatório gerados às ${date}.
        `;

        let transporter = nodemailer.createTransport({
            host: 'mail.youcast.tv.br',
            port: 465,
            auth: {
                user: EMAIL,
                pass: PASSWD,
            },
        });

        const TEMPLATE = loadEmailTemplate();

        let info = await transporter.sendMail({
            from: 'noreply2@mail.youcast.tv.br',
            to: emails,
            subject: 'Relatório MaxiTV',
            text: bodyPlainText,
            html: TEMPLATE,
            attachments: FILENAMES,
        });
    } catch (error) {
        console.log(error);
    }
}
