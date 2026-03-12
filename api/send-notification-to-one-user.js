const admin = require("firebase-admin");

if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

module.exports = async function handler(req, res) {
    try {
        const { token, title, body, realestateId } = req.body;

        if (!token) {
            return res.status(400).json({ error: "Token required" });
        }

        const message = {
            token: token,
            notification: {
                title: title,
                body: body,
            },
            data: {
                realestateId: realestateId || "",
            },
        };

        const response = await admin.messaging().send(message);

        res.status(200).json({
            success: true,
            messageId: response,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};