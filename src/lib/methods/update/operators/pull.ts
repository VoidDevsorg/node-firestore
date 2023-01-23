export default function PULL(docData: any, data: any) {
    if (typeof data !== "object") throw new Error("Data must be an object.");
    if (Array.isArray(data)) throw new Error("Data must be an object.");

    let newData: any = {};

    for (const key in data) {
        let dataKey = data[key];
        if (!Array.isArray(dataKey)) dataKey = [dataKey];

        newData[key] = docData[key].filter((item: any) => {
            for (const itemKey in dataKey) {
                if (item === dataKey[itemKey]) return false;
            }
            return true;
        });
    }

    return newData;
}