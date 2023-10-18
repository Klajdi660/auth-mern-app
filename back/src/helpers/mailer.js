import config from "config";
import { createTransport } from "nodemailer";

const { service, host, port, email, password } = config.get("mailer");

const sendConfirmationEmail = ({ name, subject, link }) => {
  const transporter = createTransport({
    service: service,
    host: host,
    port: port,
    secure: false,
    auth: {
      user: email,
      pass: password
    }
  });
  
  const mailOptions = {
    from: email,
    to: "klajdixhafkollari36@gmail.com",
    subject: subject,
    html: `
      <h3> Hello ${name} </h3>
      <p>Thank you for registering into our Application. Much Appreciated! Just one last step is laying ahead of you...</p>
      <p>To activate your account please follow this link: <a target="_" href="${link}">${link}</a></p>.
      <p>Cheers</p>
      <p>Your Application Team</p>
    `,
  };

  const info = transporter.sendMail(mailOptions);
  
  return info;
};

export default sendConfirmationEmail;
