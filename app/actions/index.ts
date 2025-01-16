"use server";
// useCollection.ts
import { db } from "@/lib/firebase/config";
import {
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";

export const movePeople = async (
	collectionName: string,
	action: "resetAll" | "markDone" | "markActive",
	id: string,
) => {
	const collectionRef = collection(db, collectionName);

	if (action === "markActive") {
		const q = query(collectionRef, where("status", "==", "active"));
		const querySnapshot = await getDocs(q);

		for (const doc of querySnapshot.docs) {
			await updateDoc(doc.ref, {
				status: "done",
			});
		}

		await updateDoc(doc(db, collectionName, id), {
			status: "active",
		});
	}

	if (action === "resetAll") {
		const querySnapshot = await getDocs(collectionRef);
		for (const doc of querySnapshot.docs) {
			await updateDoc(doc.ref, {
				status: "future",
			});
		}
	}

	if (action === "markDone") {
		const q = query(collectionRef, where("status", "==", "active"));
		const querySnapshot = await getDocs(q);
		for (const doc of querySnapshot.docs) {
			await updateDoc(doc.ref, {
				status: "done",
			});
		}
	}
};
