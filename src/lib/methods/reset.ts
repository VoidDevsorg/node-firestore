import { doc, setDoc, collection, getDoc, addDoc, query, getDocs, where, deleteDoc } from "@firebase/firestore";

export default async function reset(collectionName: string) {
    if (!collectionName) throw new Error("Collection name is required for confirmation of reset.");
    if (typeof collectionName !== "string") throw new Error("Collection name must be a string.");

    if (collectionName !== this.collection) throw new Error("Collection name does not match collection name in database.");

    const q = query(collection(this.database, this.collection));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size === 0) throw new Error("Collection is already empty.");

    querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
    });

    return true;
}