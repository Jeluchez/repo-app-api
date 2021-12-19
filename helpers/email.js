const { transporter } = require("../mailer/config")
const Email = require('email-templates');

const email = new Email();

const renderHtml = async (name, url,id) => {
    try {
        
        return await email.render('../mailer/verificationEmail', {
            name,
            url,
            id
        })

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }

}

module.exports.sendEmail = async ({ name, email, url, id }) => {

    const html = await renderHtml(name,url,id);

    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: 'Verification email',
            html: html
        }

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log("Error " + err);
                reject(true);
            } else {
                console.log("Email sent successfully");
                resolve(false)
            }
        });
    })

}