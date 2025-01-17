"use server";
// useCollection.ts
import { db } from "@/lib/firebase/config";
import {
	arrayRemove,
	arrayUnion,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	updateDoc,
	where,
	setDoc,
} from "firebase/firestore";

export const movePeople = async (
	collectionName: string,
	action: "resetAll" | "markDone" | "markActive" | "back",
	id: string,
) => {
	const collectionRef = collection(db, collectionName);

	if (action === "back") {
		await updateDoc(doc(db, collectionName, id), {
			status: "future",
		});
		await updateDoc(doc(db, "cue", "order"), {
			order: arrayRemove(id),
		});
		const lastItem = (await getDoc(doc(db, "cue", "order"))).data()?.order;
		if (lastItem.length > 0) {
			const lastItemId = lastItem[lastItem.length - 1];
			await updateDoc(doc(db, collectionName, lastItemId), {
				status: "active",
			});
		}
	}

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

		await updateDoc(doc(db, "cue", "order"), {
			order: arrayUnion(id),
		});
	}

	if (action === "resetAll") {
		const querySnapshot = await getDocs(collectionRef);
		for (const doc of querySnapshot.docs) {
			await updateDoc(doc.ref, {
				status: "future",
			});
		}
		await updateDoc(doc(db, "cue", "order"), {
			order: [],
		});
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

// Initialize the order document (run this once when setting up)
await setDoc(doc(db, "cue", "order"), {
	order: [],
});
