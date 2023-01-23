import { doc, setDoc, collection, getDoc, addDoc, query, getDocs, where, orderBy, limit, startAt, deleteDoc } from "@firebase/firestore";

export default async function find(spesicifData: {
    [key: string]: any
}, options?: {
    limit?: number,
    orderBy?: string,
    order?: "asc" | "desc",
    skip?: number
}) {
    let wheres: any[] = [];
    for (const key in spesicifData) {
        let isOperator = false;
        const value = spesicifData[key];

        if (typeof value !== "string" && Object.keys(value || {}).length >= 1 && Object.keys(value || {})?.[0].startsWith("$")) {
            isOperator = true;
            let operator = Object.keys(value || {})?.[0].replace("$", "");
            const operators: any = {
                eq: "==",
                ne: "!=",
                gt: ">",
                gte: ">=",
                lt: "<",
                lte: "<=",
                in: "in",
                nin: "not-in",
                contains: "array-contains",
                containsAny: "array-contains-any",
                notContains: "not-in",
                notContainsAny: "not-in",
                includes: "custom-functions"
            }

            if (!operators[operator]) throw new Error(`Operator ${operator} is not valid. Valid operators: ${Object.keys(operators).join(", ")}`);
            const operatorValue = value[Object.keys(value || {})?.[0]];
            const operatorSymbol = operators[operator];

            if (operatorSymbol !== "custom-functions") wheres.push(where(key, operatorSymbol, operatorValue));
            else {
                if (operator === "includes") {
                    wheres.push(where(key, "<=", operatorValue + "\uf8ff"));
                }
            }
        }
        if (!isOperator)
            wheres.push(where(key, "==", spesicifData[key]));
    }

    if (options?.orderBy) {
        wheres.push(orderBy(options.orderBy, options.order || "asc"));
    }

    if (options?.limit) {
        wheres.push(limit(options.limit));
    }

    if (options?.skip) {
        wheres.push(startAt(options.skip));
    }

    const q = query(collection(this.database, this.collection), ...wheres);

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return [];
    let data: any[] = [];

    querySnapshot.forEach((doc) => {
        data.push(doc.data());
        deleteDoc(doc.ref);
    });

    this.eventTrigger("delete", data);

    return data;
}