const nodemailer = require("nodemailer");
const { config } = require("../../../../config");
const path = require('path');
const handlebars = require('nodemailer-express-handlebars');

module.exports = async function (
  to,
  subject,
  template,
  context
){
  try {
    const transporter = nodemailer.createTransport({
      service: this.service,
      host: this.host,
      port: this.port,
      secureConnection: this.secure,
      auth: {
        user: this.auth.user,
        pass: this.auth.pass,
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    transporter.use('compile', handlebars({
      viewEngine: {
        layoutsDir: path.resolve(__dirname, '../../../../../templates/email/layouts'),
        partialsDir: path.resolve(__dirname, '../../../../../templates/email/partials'),
        defaultLayout: 'main',
      },
      viewPath: path.resolve(__dirname, '../../../../../templates/email'),
    }));

    const mailOptions = {
      from: this.auth.user,
      to,
      subject,
      template: template,
      context: {
        year: new Date().getFullYear(),
        ...context
      },
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


