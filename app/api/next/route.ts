import { NextResponse } from "next/server";
import { movePeople } from "@/app/actions";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/config";

export async function POST() {
	try {
		const collectionRef = collection(db, "people");
		const snapshot = await getDocs(collectionRef);
		const docs = snapshot.docs.map((doc) => ({
			id: doc.id,
			status: doc.data().status,
			...doc.data(),
		}));
		const documents = {
			future: docs.filter((doc) => doc.status === "future"),
			active: docs.filter((doc) => doc.status === "active"),
			done: docs.filter((doc) => doc.status === "done"),
			upNext: docs.filter((doc) => doc.status === "upNext"),
		};

		const setNextPerson = () => {
			const randomIndex = () =>
				Math.floor(Math.random() * documents.future.length);

			if (documents.upNext.length > 1) {
				movePeople("people", "markActive", documents.upNext[0].id);
				return movePeople("people", "markUpNext", documents.upNext[1].id);
			}
			if (documents.future.length === 1) {
				movePeople("people", "markActive", documents.upNext[0].id);
				return movePeople("people", "markUpNext", documents.future[0].id);
			}
			if (documents.upNext.length === 1 && documents.future.length === 0) {
				return movePeople("people", "markActive", documents.upNext[0].id);
			}
			if (documents.upNext.length === 0) {
				movePeople("people", "markActive", documents.future[randomIndex()].id);
				movePeople("people", "markUpNext", documents.future[randomIndex()].id);
			} else {
				movePeople("people", "markActive", documents.upNext[0].id);
				movePeople("people", "markUpNext", documents.future[randomIndex()].id);
			}
		};

		setNextPerson();

		// Set CORS headers
		const headers = new Headers();
		headers.append("Access-Control-Allow-Origin", "*"); // Allow all origins
		headers.append("Access-Control-Allow-Methods", "POST, OPTIONS");
		headers.append("Access-Control-Allow-Headers", "Content-Type");

		return new NextResponse(JSON.stringify({ success: true }), {
			status: 200,
			headers: headers,
		});
	} catch (error) {
		console.error("Failed to set next person:", error);

		// Set CORS headers for error response as well
		const headers = new Headers();
		headers.append("Access-Control-Allow-Origin", "*");
		headers.append("Access-Control-Allow-Methods", "POST, OPTIONS");
		headers.append("Access-Control-Allow-Headers", "Content-Type");

		return new NextResponse(
			JSON.stringify({ error: "Failed to set next person" }),
			{ status: 500, headers: headers },
		);
	}
}
