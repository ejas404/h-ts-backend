import admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FB_PROJECT_ID as string,
        clientEmail: process.env.FB_CLIENT_EMAIL as string,
        privateKey: (process.env.FB_PRIVATE_KEY as string)?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FB_DATABASE_URL as string
});
