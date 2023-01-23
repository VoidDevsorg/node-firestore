import { doc, setDoc, collection, getDoc, addDoc, query, getDocs, where } from "@firebase/firestore";
import fs from "fs";

export default async function exportData({ path  = "./_voidpkg", format = "json" } : {
    path: string;
    format: "json" | "yaml" | "xml" | "yml";
}) {
    const q = query(collection(this.database, this.collection));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const fileName = `${this.collection}.${format || "json"}`;
    const filePath = path ? `${path}/${fileName}` : './_voidpkg/' + fileName;

    try {
        fs.mkdirSync(path || './_voidpkg');
    } catch (error) {};

    function write(content: string) {
        fs.writeFileSync(filePath, content);
    }

    let data: any = [];
    querySnapshot.forEach((doc) => {
        data.push(doc.data());
    });

    if (format === "json") {
        write(JSON.stringify(data, null, 4));
    } else if (format === "yaml" || format === "yml") {
        write(require("js-yaml").dump(data));
    } else if (format === "xml") {
        write(require("xml-js").js2xml(data, { compact: true, spaces: 4 }));
    }

    return data;
}