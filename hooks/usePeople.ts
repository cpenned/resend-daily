// useCollection.ts
import { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc } from "firebase/firestore";
import type { QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const usePeople = (
	collectionName: string,
	action: "resetAll" | "markDone" | "markActive",
	id: string,
) => {
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const collectionRef = collection(db, collectionName);

		onSnapshot(
			collectionRef,
			async (snapshot: QuerySnapshot<DocumentData>) => {
				if (action === "resetAll") {
					for (const doc of snapshot.docs) {
						await updateDoc(doc.ref, {
							status: "future",
						});
					}
				}

				if (action === "markDone") {
					const activeDocs = snapshot.docs.filter(
						(doc) => doc.data().status === "active",
					);
					for (const doc of activeDocs) {
						await updateDoc(doc.ref, {
							status: "done",
						});
					}
				}

				if (action === "markActive") {
					for (const doc of snapshot.docs) {
						if (doc.data().status === "active") {
							await updateDoc(doc.ref, {
								status: "done",
							});
						}
					}

					for (const doc of snapshot.docs) {
						if (doc.id === id) {
							await updateDoc(doc.ref, {
								status: "active",
							});
						}
					}
				}

				setError(null);
			},
			(error) => {
				console.error("Error fetching collection: ", error);
				setError("Failed to fetch data");
			},
		);
	});
	return { error };
};

export default usePeople;
