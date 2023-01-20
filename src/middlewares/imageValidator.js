export const imageValidator = async (req, res, next) => {
  try {
    const validExtensions = ["jpg", "jpeg", "png"];
    const { image } = req.body;
    const base64Validation = await image.substring(0, 24).includes("base64");
    const imageValidation = await image.substring(0, 24).includes("image");
    const imageExtensionValidation = await validExtensions.some((extension) => {
      if (image.substring(0, 24).includes(extension)) {
        return true;
      }
      return false;
    });
    if (base64Validation && imageValidation && imageExtensionValidation) {
      return next();
    }
    return res.status(401).json({ error: "Imagen no valida" });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};
