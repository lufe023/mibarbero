const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const { deleteQrImage } = require("./deleteQrImage.whatsapp");
const path = require("path");
const fs = require("fs-extra");

const generateQRImage = async (text, filePath) => {
  try {
    await qrcode.toFile(filePath, text);
    return true;
  } catch (error) {
    console.error("Error al generar el archivo de código QR:", error);
    return false;
  }
};

const client = new Client({
  authStrategy: new LocalAuth(), // Usando LocalAuth para la autenticación
});

client.on("qr", (qr) => {
  const qrFilePath = path.join(__dirname, "./qr/qr.png");
  generateQRImage(qr, qrFilePath).then((success) => {
    if (success) {
      console.log("Código QR guardado en:", qrFilePath);
    } else {
      console.log("Error al guardar el código QR");
    }
  });
});

client.on("ready", () => {
  console.log("Client is ready!");
  deleteQrImage("../whatsapp/qr", "qr.png");
});

// Listener de mensajes
const chatStates = {};

client.on("message", async (message) => {
  const chatId = message.from;
  const msgText = message.body;

  // Inicializa el estado del chat si no existe
  if (!chatStates[chatId]) {
    chatStates[chatId] = { stage: 0 };
  }

  // Manejo del flujo de conversación
  switch (chatStates[chatId].stage) {
    case 0:
      if (msgText.toLowerCase() != null) {
        await message.reply(
          "Saludos, soy el bot de MiElector y estoy aquí para ayudarte. 🤖\nElige un número de esta lista:\n\n" +
            "1️⃣ Consultar Cédula.\n" +
            "2️⃣ Recibir mi Padroncillo."
        );
        chatStates[chatId].stage = 1; // Avanza al siguiente estado
      }
      break;

    case 1:
      if (msgText === "1") {
        await message.reply("Indíqueme el número de cédula, por favor.");
        chatStates[chatId].stage = 2; // Avanza al estado de consulta de cédula
      } else if (msgText === "2") {
        // Aquí manejas la lógica para el Padroncillo
        await message.reply("Indíqueme el número de cédula, por favor.");
        chatStates[chatId].stage = 3; // avanza a caso 3
      }
      break;
  }
});

client.initialize();

module.exports = client;
