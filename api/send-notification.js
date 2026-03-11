const admin = require("firebase-admin");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            type: process.env.FIREBASE_TYPE,
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: process.env.FIREBASE_AUTH_URI,
            token_uri: process.env.FIREBASE_TOKEN_URI,
            auth_provider_x509_cert_url:
                process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
            client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
            universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
        }),
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