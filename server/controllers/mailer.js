import config from "config";
import { createTransport } from "nodemailer";

const { SERVICE, HOST, PORT, SECURE, EMAIL, PASSWORD } = config.get("mailerConfig");

let nodeConfig = {
  service: SERVICE,
  host: HOST,
  port: PORT,
  secure: SECURE,
  auth: {
    user: EMAIL,
    pass: PASSWORD
  }
};

const sendEmail = (message) => {
  return new Promise((resolve, reject) => {
    const transporter = createTransport(nodeConfig);
  
    transporter.sendMail(message, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};

const sendConfirmationEmail = ({ username, subject, link }) => {
  const message = {
    from: "klajdixhafkollari36@gmail.com",
    to: "klajdixhafkollari36@gmail.com",
    subject: subject,
    html: `
      <h3> Hello ${username} </h3>
      <p>Thank you for registering into our Application. Much Appreciated! Just one last step is laying ahead of you...</p>
      <p>To activate your account please follow this link: <a target="_" href="${link}">${link}</a></p>.
      <p>Cheers</p>
      <p>Your Application Team</p>
    `
  };
  
  return sendEmail(message);
};

export default sendConfirmationEmail;
