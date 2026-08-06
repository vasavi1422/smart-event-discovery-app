import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          return res.status(500).json({ msg: "Upload failed", error });
        }

        res.json({ url: result.secure_url });
      }
    );

    stream.end(req.file.buffer);

  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};