import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
    try {

        const { publicId, resourceType } = req.body;

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType || "image",
        });

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}