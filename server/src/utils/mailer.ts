import config from "config";
import path from "path";
import hbs from "nodemailer-express-handlebars";
import { createTransport } from "nodemailer";
import { smtpEmailTypesParams } from "../types/user.type";

const smtp = config.get<smtpEmailTypesParams>("mail");

export const sendEmail = async () => {
    let transporter = createTransport({
        ...smtp,
        auth: {
            user: smtp.email,
            pass: smtp.password
        }
    });

    const __dirname = path.resolve();

    const handlebarOptions = {
        viewEngine: {
          extname: '.hbs',
          layoutsDir: path.join(__dirname, 'src', 'public', 'views'),
          defaultLayout: false,
        },
        viewPath: path.join(__dirname, 'src', 'public', 'views'),
        extName: '.hbs',
    };

    transporter.use("compile", hbs(handlebarOptions as any));

    const mailOptions = {
        from: "klajdixhafkollari36@gmail.com",
        to: "klajdixhafkollari36@gmail.com",
        subject: `OTP Code`,
        template: "OTP",
        context: {
          title: "OTP Code",
          name: "Test",
          url: "12345"
        },
        html: ""
    };

    const info = await transporter.sendMail(mailOptions);
};
