
// // const admin = require("firebase-admin");

// // const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// // if (!admin.apps.length) {
// //     admin.initializeApp({
// //         credential: admin.credential.cert(serviceAccount),
// //     });
// // }

// // module.exports = async function handler(req, res) {
// //     try {
// //         if (req.method !== "POST") {
// //             return res.status(405).json({ message: "Only POST allowed" });
// //         }

// //         const { title, body, realestateId } = req.body;

// //         if (!title || !body) {
// //             return res.status(400).json({
// //                 error: "title and body required",
// //             });
// //         }

// //         const message = {
// //             topic: "realestate",
// //             notification: {
// //                 title: title,
// //                 body: body,
// //             },
// //             data: {
// //                 realestateId: realestateId ? String(realestateId) : "",
// //             },
// //         };

// //         const response = await admin.messaging().send(message);

// //         return res.status(200).json({
// //             success: true,
// //             messageId: response,
// //         });
// //     } catch (error) {
// //         console.error(error);

// //         return res.status(500).json({
// //             success: false,
// //             error: error.message,
// //         });
// //     }
// // };
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

//             data: {
//                 title: String(title),
//                 body: String(body),
//                 realestateId: realestateId ? String(realestateId) : "",
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

        const { title, body, realestateId, imageUrl } = req.body;

        if (!title || !body) {
            return res.status(400).json({
                error: "title and body required",
            });
        }

        // const message = {
        //     topic: "realestate",

        //     notification: {
        //         title: title,
        //         body: body,
        //     },

        //     data: {
        //         realestateId: realestateId ? String(realestateId) : "",
        //     },

        //     android: {
        //         priority: "high",
        //         notification: {
        //             channelId: "realestate_channel",
        //         },
        //     },

        //     apns: {
        //         payload: {
        //             aps: {
        //                 contentAvailable: true,
        //             },
        //         },
        //     },
        // };
        const message = {
            topic: "realestate",

            notification: {
                title: title,
                body: body,
                imageUrl: imageUrl, // السطر ده أساسي عشان الصورة تظهر (FCM v1 API)
            },

            data: {
                realestateId: realestateId ? String(realestateId) : "",
            },

            android: {
                priority: "high",
                notification: {
                    channelId: "realestate_channel",
                    imageUrl: imageUrl, // تأكيد إضافي للأندرويد
                },
            },

            apns: {
                payload: {
                    aps: {
                        contentAvailable: true,
                        mutableContent: true, // مهم جداً للأيفون عشان يعالج الصور
                    },
                },
                fcmOptions: {
                    imageUrl: imageUrl, // تأكيد إضافي للأيفون
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