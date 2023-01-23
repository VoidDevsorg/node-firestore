export default function INC(docData: any, data: any) {
    if (typeof data !== "object") throw new Error("Data must be an object.");
    if (Array.isArray(data)) throw new Error("Data must be an object.");

    let newData: any = {};

    for (const key in data) {
        if (typeof data[key] !== "number") throw new Error(`Value of ${key} must be a number.`);
        newData[key] = docData[key] + data[key];
    }

    return newData;
}