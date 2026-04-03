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
const sendEntrepriseStatusEmail = async (email, username, status) => {

  let subject = "";
  let message = "";

  if (status === "ACCEPTE") {
    subject = "Votre compte entreprise a été accepté";
    message = `
      <p>Bonne nouvelle !</p>
      <p>Votre compte entreprise a été <b>accepté</b>.</p>
      <p>Vous pouvez maintenant vous connecter et publier vos offres d'emploi.</p>
      <a href="${config.get("frontendUrl") || "http://localhost:3000"}"
      style="display:inline-block;padding:10px 20px;background:#22c55e;color:white;text-decoration:none;border-radius:5px;">
      Se connecter
      </a>
    `;
  } else {
    subject = "Votre demande de compte entreprise a été refusée";
    message = `
      <p>Nous sommes désolés.</p>
      <p>Votre demande de création de compte entreprise a été <b>refusée</b>.</p>
      <p>Vous pouvez contacter l'administration pour plus d'informations.</p>
    `;
  }

  const mailOptions = {
    from: '"Plateforme Recrutement" <noreply@recrutement.com>',
    to: email,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Validation du compte entreprise</h2>
        <p>Bonjour ${username},</p>
        ${message}
        <br/>
        <p>Cordialement,<br/>Plateforme Recrutement</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email statut entreprise envoyé à:", email);
    return true;
  } catch (error) {
    console.error("Erreur email entreprise:", error);
    return false;
  }
};

module.exports = {
  sendResetPasswordEmail,
  sendEntrepriseStatusEmail
};