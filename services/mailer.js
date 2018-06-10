const nodemailer = require('nodemailer');

const sendEmail = mailOptions => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SMTP_HOST,
    port: process.env.MAIL_SMTP_PORT,
    secureConnection: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PWD
    }
  });
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) reject(err);
      else resolve(info);
    });
  });
};

exports.sendAirdropRegistrationEmail = (email, token) => {
  const baseUrl = process.env.API_BASE_URL;
  const confirmationUrl = `${baseUrl}/airdrop/register?token=${token}`;
  const mailOptions = {
    from: 'team@prodeth.io',
    to: email,
    subject: 'Prodeth Airdrop',
    html: `<body><a href="${confirmationUrl}">Test Button</a></body>`
  };
  return sendEmail(mailOptions);
};
