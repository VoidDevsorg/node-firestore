import { doc, setDoc, collection, getDoc, addDoc, query, getDocs, where, orderBy, limit, startAt } from "@firebase/firestore";
import INC from "./operators/inc";
import PULL from "./operators/pull";
import PUSH from "./operators/push";
import SET from "./operators/set";
import UNSET from "./operators/unset";

export default async function updateAll(spesicifData: {
    [key: string]: any
}, data: {
    [key: string]: any
}): Promise<any> {
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

    const q = query(collection(this.database, this.collection), ...wheres);

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const includedOperators = Object.keys(data).filter(key => key.startsWith("$"));

    let updatedData: any = {};
    if (querySnapshot.size > 1) this.eventTrigger("warning", `updateOne() returned more than one document. Only the first document will be updated. (collection: ${this.collection})`);
    const dc = querySnapshot.docs[0];
    const docData = dc.data();
    const inc = includedOperators.includes("$inc") ? INC(docData, data["$inc"]) : null;
    const set = includedOperators.includes("$set") ? SET(docData, data["$set"]) : null;
    const unset = includedOperators.includes("$unset") ? UNSET(docData, data["$unset"]) : null;
    const push = includedOperators.includes("$push") ? PUSH(docData, data["$push"]) : null;
    const pull = includedOperators.includes("$pull") ? PULL(docData, data["$pull"]) : null;

    for (const key in docData) {
        if (inc && inc[key]) updatedData[key] = inc[key];
        else if (set && set[key]) updatedData[key] = set[key];
        else if (unset && unset[key]) updatedData[key] = unset[key];
        else if (push && push[key]) updatedData[key] = push[key];
        else if (pull && pull[key]) updatedData[key] = pull[key];
        else updatedData[key] = docData[key];
    }

    await setDoc(doc(this.database, this.collection, dc.id), {
        ...updatedData,
        updatedAt: new Date()
    });
    

    this.eventTrigger("update", updatedData);

    return updatedData;
}