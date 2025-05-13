const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryFile = async (req) => {
  const mimeType = req.file.mimetype;
  const base64Image = req.file.buffer.toString("base64");

  const result = await cloudinary.uploader.upload(
    `data:${mimeType};base64,${base64Image}`,
    {
      folder: "rmt-60",
      public_id: req.file.originalname,
    }
  );

  return result.secure_url;
};

module.exports = cloudinaryFile;
