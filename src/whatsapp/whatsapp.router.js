const router = require("express").Router();
const passport = require("passport");

require("../middlewares/auth.middleware")(passport);

// Inicializa WhatsApp Client
require("./whatsappClient");

// Define la ruta para enviar mensajes

module.exports = router;
