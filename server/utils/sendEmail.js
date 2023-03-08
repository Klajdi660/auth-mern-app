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
          reject(err)
        } else {
          resolve(info)
        }
      });
    });
};

const sendConfirmationEmail = ({ username, text }) => {
    const message = {
        from: "klajdixhafkollari36@gmail.com",
        to: "klajdixhafkollari36@gmail.com",
        subject: 'Your App - Activate Account',
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

// {/* <p>To activate your account please follow this link: <a target="_" href="${process.env.DOMAIN}/api/activate/user/">${process.env.DOMAIN}/activate </a></p> */}  