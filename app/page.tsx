"use client";
import { Particles } from "@/components/ui/particles";
import useCollection from "@/hooks/useCollection";

import Image from "next/image";
import { useEffect } from "react";
import { movePeople } from "./actions";

export default function Home() {
  const { documents } = useCollection("people");

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "n" && documents.future.length > 0) {
        const randomIndex = Math.floor(Math.random() * documents.future.length);
        const randomPerson = documents.future[randomIndex];
        movePeople("people", "markActive", randomPerson.id);
      }
      if (
        event.key.toLowerCase() === "b" &&
        documents.done.length > 0 &&
        documents.active.length > 0
      ) {
        movePeople("people", "back", documents.active.map((doc) => doc.id)[0]);
      }
      if (event.key.toLowerCase() === "r" && documents.future.length === 0) {
        movePeople("people", "resetAll", "");
      }
      if (event.key === "®") {
        movePeople("people", "resetAll", "");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [documents.future, documents.active, documents.done]);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background gap-8 sm:gap-16">
      <div className="flex max-w-xl gap-2 flex-wrap justify-center z-50 relative">
        {documents.future.map((doc) => (
          <button
            type="button"
            key={doc.id}
            className="size-12 sm:size-24 rounded-full opacity-70 hover:opacity-100 transition-opacity"
            title={doc.name}
            aria-label={doc.name}
            onClick={() => movePeople("people", "markActive", doc.id)}
          >
            <Image
              src={`/${doc.name.toLowerCase()}.png`}
              width={100}
              height={100}
              alt=""
              className="rounded-full border-2 border-slate-600"
            />
          </button>
        ))}
      </div>

      <div className="flex flex-col max-w-xl gap-2 flex-wrap items-center justify-center z-50 relative">
        <p className="uppercase font-semibold text-foreground tracking-wide px-3 py-1 rounded-full border-zinc-400 text-zinc-500 border-2">
          Up next
        </p>
        {documents.future.slice(0, 1).map((doc) => (
          <button
            type="button"
            key={doc.id}
            className="size-12 sm:size-24 rounded-full opacity-70 hover:opacity-100 transition-opacity"
            title={doc.name}
            aria-label={doc.name}
            onClick={() => movePeople("people", "markActive", doc.id)}
          >
            <Image
              src={`/${doc.name.toLowerCase()}.png`}
              width={100}
              height={100}
              alt=""
              className="rounded-full border-2 border-slate-600"
            />
          </button>
        ))}
      </div>

      <div className="flex max-w-xl gap-2 flex-wrap justify-center z-50 relative size-24 sm:size-48">
        {documents.active.map((doc) => (
          <button
            type="button"
            key={doc.id}
            className="size-24 sm:size-48 rounded-full opacity-100 hover:opacity-100 transition-opacity ring-8 animate-pulseScale"
            title={doc.name}
            aria-label={doc.name}
            onClick={() => movePeople("people", "markDone", doc.id)}
          >
            <Image
              src={`/${doc.name.toLowerCase()}.png`}
              width={192}
              height={192}
              alt=""
              className="rounded-full border-2 border-slate-600"
            />
          </button>
        ))}
      </div>

      <div className="flex max-w-xl gap-2 flex-wrap justify-center z-50 relative">
        {documents.done.map((doc) => (
          <div
            key={doc.id}
            className="size-12 sm:size-24 rounded-full opacity-20"
            title={doc.name}
            aria-label={doc.name}
          >
            <Image
              src={`/${doc.name.toLowerCase()}.png`}
              width={100}
              height={100}
              alt=""
              className="rounded-full border-2 border-slate-600"
            />
          </div>
        ))}
      </div>

      {documents.future.length > 0 ? (
        <div className="flex gap-4 items-center">
          {documents.done.length > 0 && (
            <button
              type="button"
              className="uppercase text-lg font-bold px-4 py-2 bg-background text-foreground tracking-wide flex items-center gap-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => {
                if (documents.active.length > 0) {
                  movePeople(
                    "people",
                    "back",
                    documents.active.map((doc) => doc.id)[0]
                  );
                }
              }}
            >
              <span>Back</span>
              <strong className="lowercase p-2 rounded-md border size-9 leading-none grid place-items-center">
                b
              </strong>
            </button>
          )}

          <button
            type="button"
            className="uppercase text-lg font-bold px-4 py-2 text-background tracking-wide flex items-center gap-2 bg-foreground rounded-md hover:bg-foreground/80 transition-opacity"
            onClick={() => {
              const randomIndex = Math.floor(
                Math.random() * documents.future.length
              );
              const randomPerson = documents.future[randomIndex];
              movePeople("people", "markActive", randomPerson.id);
            }}
          >
            <span>Next</span>
            <strong className="lowercase p-2 rounded-md border size-9 leading-none grid place-items-center">
              n
            </strong>
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="uppercase text-lg font-bold px-4 py-2 bg-background text-foreground tracking-wide flex items-center gap-2"
          onClick={() => movePeople("people", "resetAll", "")}
        >
          <span>Reset</span>
          <strong className="lowercase p-2 rounded-md border size-9 leading-none grid place-items-center">
            r
          </strong>
        </button>
      )}

      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color="#000"
        refresh
      />
    </div>
  );
}
