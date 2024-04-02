const path = require("path");
const fs = require("fs-extra");

const deleteQrImage = async (folder, imageName) => {
  console.log(`Antes de borrar la imagen: ${folder}/${imageName}`);
  try {
    const imagePath = path.resolve(__dirname, `${folder}/${imageName}`);

    if (await fs.existsSync(imagePath)) {
      // Borra la imagen
      await fs.unlink(imagePath);
      return { success: true, message: "Imagen borrada correctamente" };
    } else {
      return { success: false, message: "La imagen no existe" };
    }
  } catch (error) {
    return { success: false, message: "Error al borrar la imagen" };
  }
};

module.exports = {
  deleteQrImage,
};
