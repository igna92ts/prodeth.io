const nodemailer = require('nodemailer'),
  path = require('path'),
  ejs = require('ejs');

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

const renderConfirmEmail = url => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.resolve('../views/confirm_email.ejs'),
      {
        confirmation_url: url
      },
      (err, data, data2) => {
        if (err) reject(err);
        resolve(data);
      }
    );
  });
};

exports.sendAirdropRegistrationEmail = (email, token) => {
  const baseUrl = process.env.API_BASE_URL;
  const confirmationUrl = `${baseUrl}/airdrop/register?token=${token}`;
  return renderConfirmEmail(confirmationUrl).then(html => {
    const mailOptions = {
      from: '"Prodeth Team" <team@prodeth.io>',
      to: email,
      subject: 'Prodeth Airdrop',
      html
    };
    return sendEmail(mailOptions);
  });
};
