# [@voidpkg/firestore](https://npmjs.com/package/@voidpkg/firestore)
[Do you need my help? Visit our Discord server.](https://voiddevs.org/discord)

![NPM Downloads](https://img.shields.io/npm/dm/@voidpkg/firestore?style=for-the-badge)
![License](https://img.shields.io/npm/l/@voidpkg/firestore?style=for-the-badge)

### Installation
```bash
npm i @voidpkg/firestore --save
# or
yarn add @voidpkg/firestore
```

### Documentation
[Click here to view the documentation.](https://firestore.voiddevs.org)

<br>

### Importing

```js
import { initializeApp } from "firebase/app";
import { Firestore } from "@voidpkg/firestore";

const firebaseConfig = {
    // ...
};

const app = initializeApp(firebaseConfig);
const db = new Firestore(app);
```

<br>

# Usage

```js
// db.Schema(name, schema, options?);
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

members.on("load", (data) => {
    console.log("Loaded", data);
});

members.on("warning", (data) => {
    console.log("Warning", data);
});

members.onSnapshot((data) => {
    console.log("Snapshot", data);
});


for (let i = 0; i < 10; i++) {
    members.create({
        id: `voidpkg-${i}`,
        name: "Void Development",
        age: 16,
        banned: false,
        views: [`voidpkg-${i + 5}`, `voidpkg-${i + 3}`]
    })
        .then((data) => {
            console.log("Created", data);
        });

    members.update({ id: `voidpkg-${i}` }, {
        $set: {
            name: "Void Development"
        },
        $inc: {
            age: 1
        },
        $push: {
            views: `voidpkg-${i + 1}`
        },
        $pull: {
            views: `voidpkg-${i + 5}`
        }
    })
        .then((data) => {
            console.log("Updated", data);
        });

    members.findOne({ id: `voidpkg-${i}` })
        .then((data) => {
            console.log(data);
        });
}

["json", "yaml", "xml"].forEach((format) => {
    members.export({
        format,
        path: `./my-output/`
    })
        .then((data) => {
            console.log(`Exported to ${format}`);
        });
});

members.reset("voidpkg-test") // collection name (string)
    .then((data) => {
        console.log(`Database resetted`);
    });
```

<br>

---
<h6 align="center">Developed with ❤️ by Void Development</h6>
