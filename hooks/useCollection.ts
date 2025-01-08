// useCollection.ts
import { useEffect, useState } from "react";
import { collection, onSnapshot, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase/config";


const useCollection = (collectionName: string) => {
  const [documents, setDocuments] = useState<{ future: DocumentData[]; active: DocumentData[]; done: DocumentData[] }>({
    future: [],
    active: [],
    done: [],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const collectionRef = collection(db, collectionName);

    // onSnapshot(doc(db, "cities", "SF"), (doc) => {
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const docs: DocumentData[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const sortedDocs = {
          future: docs.filter((doc) => doc.status === "future"),
          active: docs.filter((doc) => doc.status === "active"),
          done: docs.filter((doc) => doc.status === "done"),
        }
        setDocuments(sortedDocs);
        setError(null);
      },
      (error) => {
        console.error("Error fetching collection: ", error);
        setError("Failed to fetch data");
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionName]);

  return { documents, error };
};

export default useCollection;
