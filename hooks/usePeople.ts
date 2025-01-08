// useCollection.ts
import { useEffect, useState } from "react";
import { collection, QuerySnapshot, DocumentData, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

// db.collection("users").doc("frank").update({
// favorites: {
// food: "Ice Cream"
// })

const usePeople = (collectionName: string, action: "resetAll" | "markDone" | "markActive", id: string) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const collectionRef = collection(db, collectionName);

    // "resetAll | markDone | markActive"
      // reset all items in collection to status "future"
      onSnapshot(
            collectionRef,
            (snapshot: QuerySnapshot<DocumentData>) => {
              if(action === "resetAll"){
                snapshot.docs.forEach(async (doc) => {
                  await updateDoc(doc.ref, {
                    status: "future"
                  })
                })
              }

              if(action === "markDone"){
                snapshot.docs.filter((doc) => doc.data().status === "active").forEach(async (doc) => {
                  await updateDoc(doc.ref, {
                    status: "done"
                  })
                })
              }

              if(action === "markActive"){
                snapshot.docs.forEach(async (doc) => {
                  if(doc.data().status === "active"){
                    await updateDoc(doc.ref, {
                      status: "done"
                    })
                  }
                })
                snapshot.docs.forEach(async (doc) => {
                  if(doc.id === id){
                    await updateDoc(doc.ref, {
                      status: "active"
                    })
                  }
                })

              }

              setError(null);
            },
            (error) => {
              console.error("Error fetching collection: ", error);
              setError("Failed to fetch data");
            }
          );
  })
  return { error };
};

export default usePeople;
