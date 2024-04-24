const { sendMessage } = require("./whatsapp.controller");
const router = require("express").Router();
const passport = require("passport");
const whatsappClient = require("./whatsappClient");
const fs = require("fs");
const path = require("path");

require("../middlewares/auth.middleware")(passport);

// // Inicializa WhatsApp Client
// require("./whatsappClient");

// Ruta para iniciar WhatsApp y devolver el código QR
router.get("/iniciar", async (req, res) => {
    try {
        whatsappClient
            .iniciarWhatsApp()
            .then((client) => {
                console.log("llegamos aqui almenos");
                const qrFilePath = path.join(__dirname, "./qr/qr.png");
                res.sendFile(qrFilePath);
            })
            .catch((error) => {
                console.error("Error al iniciar WhatsApp:", error);
                res.status(500).send("Error al iniciar WhatsApp.");
            });
    } catch (error) {
        console.error("Error al leer el código QR:", error);
        res.status(500).send("Error al leer el código QR.");
    }
});

// Ruta para cerrar la sesión de WhatsApp
router.get("/cerrar", (req, res) => {
    // Cierra la sesión de WhatsApp
    whatsappClient.cerrarWhatsApp();
    res.send("Sesión de WhatsApp cerrada correctamente.");
});

// Define la ruta para enviar mensajes
router.route("/send-message").post(sendMessage);

module.exports = router;
