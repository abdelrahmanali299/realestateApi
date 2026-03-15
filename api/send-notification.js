
// const admin = require("firebase-admin");

// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// if (!admin.apps.length) {
//     admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount),
//     });
// }

// module.exports = async function handler(req, res) {
//     try {
//         if (req.method !== "POST") {
//             return res.status(405).json({ message: "Only POST allowed" });
//         }

//         const { title, body, realestateId } = req.body;

//         if (!title || !body) {
//             return res.status(400).json({
//                 error: "title and body required",
//             });
//         }

//         const message = {
//             topic: "realestate",

//             notification: {
//                 title: title,
//                 body: body,
//             },

//             data: {
//                 realestateId: realestateId ? String(realestateId) : "",
//             },

//             android: {
//                 priority: "high",
//                 notification: {
//                     channelId: "realestate_channel",
//                 },
//             },

//             apns: {
//                 payload: {
//                     aps: {
//                         contentAvailable: true,
//                     },
//                 },
//             },
//         };

//         const response = await admin.messaging().send(message);

//         return res.status(200).json({
//             success: true,
//             messageId: response,
//         });
//     } catch (error) {
//         console.error(error);

//         return res.status(500).json({
//             success: false,
//             error: error.message,
//         });
//     }
// };
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

        const { title, body, realestate } = req.body;

        if (!title || !body || !realestate) {
            return res.status(400).json({
                error: "title , body , realestate required",
            });
        }

        const message = {
            topic: "realestate",

            notification: {
                title: title,
                body: body,
            },

            data: {
                realestate: JSON.stringify(realestate) // 👈 ارسال الموديل
            },

            android: {
                priority: "high",
                notification: {
                    channelId: "realestate_channel",
                },
            },

            apns: {
                payload: {
                    aps: {
                        contentAvailable: true,
                    },
                },
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