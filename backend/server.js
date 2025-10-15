const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 📧 Configuración del transporter (remitente = tu Gmail)
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pablito.elchicodelbarrio9@gmail.com",  // 👈 tu Gmail real
    pass: "dsqeyhblpbctwiny"                      // 👈 clave de aplicación
  },
  tls: {
    rejectUnauthorized: false
  },
  logger: true,
  debug: true
});

// 📤 Ruta para enviar código
app.post("/send-code", async (req, res) => {
  const { correo, codigo } = req.body;

  try {
    console.log("📧 Enviando a:", correo);

    let info = await transporter.sendMail({
      from: '"Carga Horaria - Colegio Adventista" <pablito.elchicodelbarrio9@gmail.com>',
      to: correo,
      subject: "Bienvenido a Carga Horaria - Verificación de Cuenta",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 10px; background: #f4f6f9; border: 1px solid #ddd; max-width: 600px; margin: auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="assets/img/logo.webp" alt="Logo Colegio" style="height: 60px; margin-bottom: 10px;">
            <h2 style="color:#0056b3; margin: 0;">Bienvenido a <span style="color:#003f7f;">Carga Horaria</span> 🎉</h2>
          </div>
          <p>Hola <b>${correo}</b>,</p>
          <p>Tu cuenta ha sido creada con éxito. Aquí están tus credenciales:</p>
          <ul style="background:#fff; padding:15px; border-radius:8px; border:1px solid #ccc;">
            <li><b>Usuario:</b> ${correo}</li>
            <li><b>Contraseña:</b> (la que definiste en el registro)</li>
          </ul>
          <p>Por favor introduce este código de verificación para activar tu cuenta:</p>
          <div style="text-align:center; margin:20px 0;">
            <span style="font-size: 28px; font-weight:bold; color:#0056b3; letter-spacing:4px;">${codigo}</span>
          </div>
          <p style="font-size:14px; color:#555;">🚀 Gracias por unirte a <b>Carga Horaria</b>. Estamos felices de tenerte con nosotros.</p>
          <hr style="margin: 20px 0;">
          <p style="font-size:12px; color:#999; text-align:center;">
            Si no solicitaste esta cuenta, ignora este correo.
          </p>
        </div>
      `
    });

    console.log("✅ Gmail respondió:", info.response);
    res.json({ success: true });

  } catch (error) {
    console.error("❌ Error al enviar:", error);
    res.json({ success: false, error: error.message });
  }
});

// 🌐 Ruta de prueba
app.get("/", (req, res) => {
  res.send("🚀 Servidor de Carga Horaria corriendo correctamente");
});

// 🚀 Levantar el servidor
app.listen(3000, () =>
  console.log("✅ Servidor corriendo en http://localhost:3000")
);
