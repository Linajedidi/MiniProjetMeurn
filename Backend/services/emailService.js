const nodemailer = require("nodemailer");
const config = require("config");

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: config.get("mailtrapUser"),
    pass: config.get("mailtrapPassword")
  }
});

const sendResetPasswordEmail = async (email, resetToken, username) => {
  const resetUrl = `${config.get("frontendUrl") || "http://localhost:3000"}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: '"Plateforme Recrutement" <noreply@recrutement.com>',
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Réinitialisation du mot de passe</h2>
        <p>Bonjour ${username || 'Utilisateur'},</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous :</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">
          Réinitialiser mon mot de passe
        </a>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès à:', email);
    return true;
  } catch (error) {
    console.error('Erreur d\'envoi d\'email:', error);
    return false;
  }
};

module.exports = { sendResetPasswordEmail };