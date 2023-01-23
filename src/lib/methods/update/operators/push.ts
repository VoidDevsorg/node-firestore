export default function PUSH(docData: any, data: any) {
    if (typeof data !== "object") throw new Error("Data must be an object.");
    if (Array.isArray(data)) throw new Error("Data must be an object.");

    let newData: any = {};

    for (const key in data) {
        let dataKey = data[key];
        if (!Array.isArray(dataKey)) dataKey = [dataKey];
        newData[key] = [...docData[key], ...dataKey];
    }

    return newData;
}