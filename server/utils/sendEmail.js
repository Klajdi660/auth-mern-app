import { createTransport } from "nodemailer";

const sendEmail = (message) => {
  return new Promise((resolve, reject) => {
    const transporter = createTransport({
      service: "gmail",
		  host: "smtp.gmail.com",
      auth: {
			  user: "klajdixhafkollari36@gmail.com",
        pass: "qejogblzqwvvimac"
      }
    });
  
    transporter.sendMail(message, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};

const sendConfirmationEmail = ({ username, text }) => {
  const message = {
    from: "klajdixhafkollari36@gmail.com",
    to: "klajdixhafkollari36@gmail.com",
    subject: "Verify Email",
    html: `
      <h3> Hello ${username} </h3>
      <p>Thank you for registering into our Application. Much Appreciated! Just one last step is laying ahead of you...</p>
      <p>To activate your account please follow this link: <a target="_" href="${text}">${text}</a></p>.
      <p>Cheers</p>
      <p>Your Application Team</p>
    `
  }
  
  return sendEmail(message);
};

export default sendConfirmationEmail;


const nodemailer = require("nodemailer");

async function send_email(find, replace, email_validation) {
    const transporter = nodemailer.createTransport({
        host: email_validation.host,
        port: email_validation.port,
        secure: email_validation.secure,
        auth: {
            user: email_validation.username,
            pass: email_validation.password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: email_validation.username,
        to: email,
        subject: `E-mail validation for ${domain} account`,
        html: get_email_template(find, configs.skin_path, lang)
    };

    let template;
    const emailTemplate = await get_email_template(find, configs.skin_path, lang);

    if (emailTemplate !== "404") {
        template = emailTemplate.replace(find, replace);
    } else {
        if (find === "%activation_link%") {
            template = `<a href="${activation_link}">Proceed with account activation</a>`;
        } else {
            template = replace;
        }
    }

    mailOptions.html = template;

    return transporter.sendMail(mailOptions);
}

