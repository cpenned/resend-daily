"use client";

import { useState, useCallback } from "react";

// Define a type for the person object (ensure this matches data.json structure)
interface Person {
	id: string;
	first_name: string;
	image_512: string;
	status: "future" | "active" | "upNext" | "done";
}

interface PeopleState {
	future: Person[];
	active: Person[];
	upNext: Person[];
	done: Person[];
}

export const usePeople = (initialData: Person[]) => {
	// Initialize state using the useState initializer function (runs once)
	const [documents, setDocuments] = useState<PeopleState>(() => {
		const categorized: PeopleState = {
			future: initialData.filter((p) => p.status === "future"),
			active: initialData.filter((p) => p.status === "active"),
			upNext: initialData.filter((p) => p.status === "upNext"),
			done: initialData.filter((p) => p.status === "done"),
		};
		return categorized;
	});

	const markDone = useCallback((personId: string) => {
		setDocuments((prevDocs) => {
			let personToMove: Person | undefined;
			let sourceKey: keyof Omit<PeopleState, "done"> | undefined;

			// Find the person in future, active, or upNext lists
			personToMove = prevDocs.future.find((p) => p.id === personId);
			if (personToMove) {
				sourceKey = "future";
			} else {
				personToMove = prevDocs.active.find((p) => p.id === personId);
				if (personToMove) {
					sourceKey = "active";
				} else {
					personToMove = prevDocs.upNext.find((p) => p.id === personId);
					if (personToMove) {
						sourceKey = "upNext";
					}
				}
			}

			// If the person wasn't found in future, active, or upNext,
			// they might be already 'done' or the ID is invalid. In either case, no state change needed.
			if (!personToMove || !sourceKey) {
				return prevDocs;
			}

			// Create the updated person object with 'done' status
			const movedPerson = { ...personToMove, status: "done" as const };
			const newState: PeopleState = {
				future: prevDocs.future.filter((p) => p.id !== personId),
				active: prevDocs.active.filter((p) => p.id !== personId),
				upNext: prevDocs.upNext.filter((p) => p.id !== personId),
				done: [...prevDocs.done.filter((p) => p.id !== personId), movedPerson],
			};

			return newState;
		});
	}, []);

	const markFuture = useCallback((personId: string) => {
		setDocuments((prevDocs) => {
			const donePersonIndex = prevDocs.done.findIndex((p) => p.id === personId);
			if (donePersonIndex === -1) return prevDocs;
			const person = prevDocs.done[donePersonIndex];
			const movedPerson = { ...person, status: "future" as const };
			return {
				...prevDocs,
				done: prevDocs.done.filter((p) => p.id !== personId),
				future: [...prevDocs.future, movedPerson],
			};
		});
	}, []);

	const markActive = useCallback((personId: string) => {
		setDocuments((prevDocs) => {
			let personToActivate: Person | undefined;
			let sourceList: keyof PeopleState | undefined;

			const futureIndex = prevDocs.future.findIndex((p) => p.id === personId);
			if (futureIndex > -1) {
				personToActivate = prevDocs.future[futureIndex];
				sourceList = "future";
			} else {
				const upNextIndex = prevDocs.upNext.findIndex((p) => p.id === personId);
				if (upNextIndex > -1) {
					personToActivate = prevDocs.upNext[upNextIndex];
					sourceList = "upNext";
				}
			}

			if (!personToActivate || !sourceList) {
				return prevDocs;
			}

			let newFuture = [...prevDocs.future];
			let newActive = [...prevDocs.active];
			let newUpNext = [...prevDocs.upNext];
			const newDone = [...prevDocs.done];

			if (newActive.length > 0) {
				const currentActive = newActive[0];
				newDone.push({ ...currentActive, status: "done" });
				newActive = [];
			}

			if (sourceList === "future") {
				newFuture = newFuture.filter((p) => p.id !== personId);
			} else {
				newUpNext = newUpNext.filter((p) => p.id !== personId);
			}

			newActive.push({ ...personToActivate, status: "active" });

			return {
				future: newFuture,
				active: newActive,
				upNext: newUpNext,
				done: newDone,
			};
		});
	}, []);

	const markUpNext = useCallback((personId: string) => {
		setDocuments((prevDocs) => {
			const futurePersonIndex = prevDocs.future.findIndex(
				(p) => p.id === personId,
			);
			if (futurePersonIndex === -1) return prevDocs;
			const person = prevDocs.future[futurePersonIndex];
			const newUpNextPerson = { ...person, status: "upNext" as const };
			const newFuture = prevDocs.future.filter((p) => p.id !== personId);
			const newUpNextList = [newUpNextPerson];
			if (prevDocs.upNext.length > 0) {
				const currentUpNext = prevDocs.upNext[0];
				newFuture.push({ ...currentUpNext, status: "future" });
			}
			return {
				...prevDocs,
				future: newFuture,
				upNext: newUpNextList,
			};
		});
	}, []);

	const setNextPerson = useCallback(() => {
		const { upNext, future, active } = documents;
		const randomIndex = () => Math.floor(Math.random() * future.length);

		if (future.length === 0) {
			markActive(upNext[0].id);
			markDone(active[0].id);
		} else if (upNext.length > 0) {
			markActive(upNext[0].id);
			if (future.length > 0) {
				const randomFutureIndex = randomIndex();
				markUpNext(future[randomFutureIndex].id);
			}
		} else if (future.length > 0) {
			const randomFutureIndexActive = randomIndex();
			markActive(future[randomFutureIndexActive].id);
			const remainingFuture = future.filter(
				(p) => p.id !== future[randomFutureIndexActive].id,
			);
			if (remainingFuture.length > 0) {
				const randomFutureIndexUpNext = Math.floor(
					Math.random() * remainingFuture.length,
				);
				markUpNext(remainingFuture[randomFutureIndexUpNext].id);
			}
		}
	}, [documents, markActive, markUpNext, markDone]);

	return {
		documents,
		setNextPerson,
		markDone,
		markFuture,
		markActive,
		markUpNext,
	};
};
