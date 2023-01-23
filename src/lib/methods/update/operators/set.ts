export default function SET(docData: any, data: any) {
    if (typeof data !== "object") throw new Error("Data must be an object.");
    if (Array.isArray(data)) throw new Error("Data must be an object.");

    let newData: any = {};

    for (const key in data) {
        newData[key] = data[key];
    }

    return newData;
}