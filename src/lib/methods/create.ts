import { ICreate } from "../../types/Schema";

import { doc, setDoc, collection, getDoc, addDoc, query, getDocs, where } from "@firebase/firestore";

export default async function create(data: ICreate) {

    if (typeof data !== "object") throw new Error("Data must be an object.");
    if (Array.isArray(data)) throw new Error("Data must be an object.");

    for (const key in this.schema) {
        let schema = this.schema[key];
        let dataKey = data[key];

        if (typeof schema === "object") {
            if (schema.required) {
                if (schema.default !== undefined) {
                    if (dataKey === undefined || dataKey === null) data[key] = schema.default;
                } else if (dataKey === undefined || dataKey === null) throw new Error(`Key ${key} is required.`);
            }
        }
    }

    for (const key in data) {
        if (!this.schema[key]) throw new Error(`Key ${key} is not in schema.`);
        let schema = this.schema[key];
        let dataKey = data[key];

        if (typeof schema === "object") {
            if (schema.required) {
                if (dataKey === undefined || dataKey === null) throw new Error(`Key ${key} is required.`);
            }

            if (schema.unique) {
                const q = query(collection(this.database, this.collection), where(key, "==", dataKey));
                const querySnapshot = await getDocs(q);
                if (querySnapshot.size > 0) throw new Error(`Key ${key} must be unique.`);
            }

            if (schema.default) {
                if (dataKey === undefined || dataKey === null) data[key] = schema.default;
            }

            if (schema.type) {
                if (schema.type === "array") {
                    if (!Array.isArray(dataKey)) throw new Error(`Key ${key} must be type array.`);
                } else {
                    if (typeof dataKey !== schema.type) throw new Error(`Key ${key} must be type ${schema.type}.`);
                }
            }
        } else {
            if (schema === "array") {
                if (!Array.isArray(dataKey)) throw new Error(`Key ${key} must be type array.`);
            } else if (typeof dataKey !== schema) throw new Error(`Key ${key} must be type ${schema}.`);
        }
    }

    const createdData = Object.assign(data, this.options?.timestamps ? {
        createdAt: new Date(),
        updatedAt: null
    } : {});

    const my = await addDoc(collection(this.database, this.collection), createdData);
    const docRef = doc(this.database, this.collection, my.id);
    const docSnap = await getDoc(docRef);

    this.eventTrigger("create", docSnap.data());

    return docSnap.data();
}