
const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

module.exports = async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ message: "Only POST allowed" });
        }

        const { title, body, realestateId } = req.body;

        if (!title || !body) {
            return res.status(400).json({
                error: "title and body required",
            });
        }

        const message = {
            topic: "realestate",
            notification: {
                title: title,
                body: body,
            },
            data: {
                realestateId: realestateId ? String(realestateId) : "",
            },
        };

        const response = await admin.messaging().send(message);

        return res.status(200).json({
            success: true,
            messageId: response,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};