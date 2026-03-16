
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

// //             android: {
// //                 priority: "high",
// //                 notification: {
// //                     channelId: "realestate_channel",
// //                 },
// //             },

// //             apns: {
// //                 payload: {
// //                     aps: {
// //                         contentAvailable: true,
// //                     },
// //                 },
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

// const db = admin.firestore();

// module.exports = async function handler(req, res) {

//     try {

//         if (req.method !== "POST") {
//             return res.status(405).json({ message: "Only POST allowed" });
//         }

//         const { title, body, type, realestateId } = req.body;

//         if (!title || !body) {
//             return res.status(400).json({
//                 error: "title and body required"
//             });
//         }

//         /// 1️⃣ store notification in firestore

//         const notificationDoc = await db.collection("notifications").add({
//             type: type || "realestate",
//             title: title,
//             body: body,
//             data: {
//                 realestateId: realestateId || null
//             },
//             createdAt: admin.firestore.FieldValue.serverTimestamp(),
//             isRead: false
//         });

//         /// 2️⃣ send push notification

//         const message = {
//             topic: "realestate",

//             notification: {
//                 title: title,
//                 body: body
//             },

//             data: {
//                 notificationId: notificationDoc.id,
//                 type: type || "realestate",
//                 realestateId: realestateId ? String(realestateId) : ""
//             },

//             android: {
//                 priority: "high",
//                 notification: {
//                     channelId: "realestate_channel"
//                 }
//             }
//         };

//         const response = await admin.messaging().send(message);

//         return res.status(200).json({
//             success: true,
//             messageId: response,
//             notificationId: notificationDoc.id
//         });

//     } catch (error) {

//         console.error(error);

//         return res.status(500).json({
//             success: false,
//             error: error.message
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

        const { title, body, type, realestateId } = req.body;

        if (!title || !body || !type) {
            return res.status(400).json({ error: "title, body and type required" });
        }

        // 🔹 1. إنشاء docRef مع id محدد تلقائيًا
        const notificationsRef = admin.firestore().collection("notifications");
        const newNotificationRef = notificationsRef.doc(); // توليد doc id جديد
        const notificationId = newNotificationRef.id;

        // 🔹 2. حفظ الإشعار في Firestore
        await newNotificationRef.set({
            title,
            body,
            type,
            data: { realestateId: realestateId || "" },
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            isRead: false,
        });

        // 🔹 3. إرسال FCM بنفس الـ id
        const message = {
            topic: "realestate",
            notification: { title, body },
            data: {
                notificationId, // نفس id المستند
                type,
                realestateId: realestateId || "",
            },
            android: {
                priority: "high",
                notification: { channelId: "realestate_channel" },
            },
            apns: {
                payload: { aps: { contentAvailable: true } },
            },
        };

        const response = await admin.messaging().send(message);

        return res.status(200).json({
            success: true,
            messageId: response,
            notificationId,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
};