import { ISchema } from "../../types/Schema";
import { collection, onSnapshot } from "@firebase/firestore";

// Methods
import create from "../methods/create";
import update from "../methods/update";
import updateOne from "../methods/update/updateOne";
import find from "../methods/find/find";
import findOne from "../methods/find/findOne";
import deleteAll from "../methods/delete/delete";
import deleteOne from "../methods/delete/deleteOne";

import exportData from "../methods/export";
import reset from "../methods/reset";

export function Schema(name: string, schema: ISchema, options?: any) {
    if (typeof name !== "string") throw new Error("Name must be a string.");
    if (typeof schema !== "object") throw new Error("Schema must be an object.");
    if (Array.isArray(schema)) throw new Error("Schema must be an object.");

    this.collection = name;
    this.schema = schema;
    this.options = options;
    this.eventTrigger = eventTrigger.bind(this);

    for (const key in schema) {
        let schemaKey = schema[key];

        if (typeof schemaKey === "object") {
            if (schemaKey.type) {
                if (typeof schemaKey.type !== "string") throw new Error(`Key ${key} must be a string type. e.g. "string", "number", "boolean", "object", "array"`);
            }
        } else if (typeof schemaKey !== "string") throw new Error(`Key ${key} must be a string.`);
    }

    if (Array.isArray(this.options?.disableEvents) && !this.options?.disableEvents.includes("load") || this.options?.disableEvents === false) {
        onSnapshot(collection(this.database, this.collection), (doc) => {
            this.emit("load", doc.docs.map((doc) => doc.data()));
        });
    }

    return Object.assign({
        onSnapshot: (callback: any) => onSnapshot(collection(this.database, this.collection), (doc) => callback(doc.docs.map((doc) => {
            return {
                metadata: doc.metadata,
                data: doc.data()
            }
        }))),
        create: create.bind(this),
        update: update.bind(this),
        updateOne: updateOne.bind(this),
        find: find.bind(this),
        findOne: findOne.bind(this),
        delete: deleteAll.bind(this),
        deleteOne: deleteOne.bind(this),
        export: exportData.bind(this),
        reset: reset.bind(this)
    }, this.options?.disableEvents === true ? {} : {
        on: this.on.bind(this),
        off: this.off.bind(this),
        once: this.once.bind(this)
    });

    function eventTrigger(event: string, data: any) {
        if (Array.isArray(this.options?.disableEvents) && !this.options?.disableEvents.includes(event) || this.options?.disableEvents === false) {
            this.emit(event, data);
        }
    }
}