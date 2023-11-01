const nodemailer = require("nodemailer");
const { config } = require("../../../../config");
const path = require('path');
const handlebars = require('nodemailer-express-handlebars');

const EMAIL = config.nodemailer;

module.exports = async (
  to,
  subject,
  template = 'Information',
  context
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: EMAIL.service,
      host: EMAIL.host,
      port: EMAIL.port,
      secureConnection: "false",
      auth: {
        user: EMAIL.auth.user,
        pass: EMAIL.auth.password,
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    transporter.use('compile', handlebars({
      viewEngine: {
        layoutsDir: path.resolve(__dirname, '../../../../../templates/email'),
        partialsDir: path.resolve(__dirname, '../../../../../templates/email/partials'),
        defaultLayout: 'information',
      },
      viewPath: path.resolve(__dirname, '../../../../../templates/email'),
    }));

    const mailOptions = {
      from: EMAIL.auth.user,
      to,
      subject,
      template: checkTemplate(template),
      context: {
        year: new Date().getFullYear(),
        ...context
      }
    };

    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        throw error;
      } 
    });
  } catch (err) {
    throw err;
  }
};


