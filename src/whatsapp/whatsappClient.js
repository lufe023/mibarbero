const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const fs = require("fs");
const path = require("path");

let client; // Declaramos la variable client fuera de las funciones para que sea accesible en todo el módulo
client = new Client();
// Función para inicializar WhatsApp y devolver el código QR
async function iniciarWhatsApp() {
    return new Promise((resolve, reject) => {
        client.on("qr", async (qr) => {
            // Genera el código QR y lo guarda en un archivo
            const qrFilePath = path.join(__dirname, "./qr/qr.png");
            await qrcode.toFile(qrFilePath, qr);
            console.log("Código QR guardado en:", qrFilePath);
        });
        client.on("ready", () => {
            console.log("WhatsApp Client está listo");
            resolve(client); // Resolvemos la promesa con el cliente WhatsApp
        });
        client.initialize();
    });
}

// Función para cerrar la sesión de WhatsApp
async function cerrarWhatsApp() {
    try {
        if (client) {
            await client.logout(); // Utilizamos el objeto client para cerrar la sesión
            console.log("Sesión de WhatsApp cerrada correctamente.");
        } else {
            console.log("El cliente de WhatsApp no está inicializado.");
        }
    } catch (error) {
        console.error("Error al cerrar la sesión de WhatsApp:", error);
    }
}

module.exports = { iniciarWhatsApp, cerrarWhatsApp };
