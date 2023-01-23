import { initializeApp } from "firebase/app";
import { Firestore } from "../src";

function test() {
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    };

    const app = initializeApp(firebaseConfig);
    const db = new Firestore(app, {
        alwaysOn: true
    });

    const members = db.Schema("voidpkg-test", {
        id: {
            type: "string",
            required: true,
            unique: true
        },
        name: "string",
        age: "number",
        banned: "boolean",
        views: "array"
    }, {
        timestamps: true, // default: false (createdAt, updatedAt)
        disableEvents: false // if true, events will not be emitted and on methods will not work throw errors if used (default: false)
    });

    // members.on("create", (data) => {
    //     console.log("Created", data);
    // });

    // members.on("update", (data) => {
    //     console.log("Updated", data);
    // });

    // members.on("delete", (data) => {
    //     console.log("Deleted", data);
    // });

    // members.on("warning", (data) => {
    //     console.log("Warning", data);
    // });

    // members.onSnapshot((data) => {
    //     console.log("Snapshot", data);
    // });


    for (let i = 0; i < 10; i++) {
        // members.create({
        //     id: `voidpkg-${i}`,
        //     name: "Void Development",
        //     age: 16,
        //     banned: false,
        //     views: [`voidpkg-${i + 5}`, `voidpkg-${i + 3}`]
        // });

        // members.update({ id: `voidpkg-${i}` }, {
        //     $set: {
        //         name: "Void Development"
        //     },
        //     $inc: {
        //         age: 1
        //     },
        //     $push: {
        //         views: `voidpkg-${i + 1}`
        //     },
        //     $pull: {
        //         views: `voidpkg-${i + 5}`
        //     }
        // });

        // setTimeout(() => {
        //     members.findOne({ id: `voidpkg-${i}` })
        //         .then((data) => {
        //             console.log(data);
        //         });
        // }, 1000);
    }
}

test();