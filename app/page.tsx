"use client";
import useCollection from "@/app/hooks/useCollection";

import Image from "next/image";
import { movePeople } from "./actions";
import { useCallback, useEffect } from "react";

export default function Home() {
	const { documents } = useCollection("people");

	const setNextPerson = useCallback(() => {
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
	}, [documents.future, documents.upNext]);

	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.key.toLowerCase() === "n" && documents.future.length > 0) {
				setNextPerson();
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
	}, [documents, setNextPerson]);

	return (
		<div className="relative grid grid-rows-[1fr_2fr_1fr_30px] py-20 h-screen w-full place-items-center overflow-hidden rounded-lg border bg-background gap-8 sm:gap-16">
			<div className="flex max-w-5xl gap-2 flex-wrap justify-center z-50 relative">
				{documents.future.map((doc) => (
					<button
						type="button"
						key={doc.id}
						className="size-12 sm:size-24 rounded-full opacity-70 hover:opacity-100 transition-opacity"
						title={doc.name}
						aria-label={doc.name}
						onClick={() => movePeople("people", "markActive", doc.id)}
						onContextMenu={(e) => {
							e.preventDefault();
							movePeople("people", "markDone", doc.id);
						}}
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

			<div className="grid gap-4 place-items-center">
				<div
					className={`z-50 relative size-12 sm:size-24 grid gap-2 items-start justify-center ${
						documents.upNext.length > 0 ? "opacity-100" : "opacity-0"
					}`}
				>
					<p className="text-sm text-foreground/50 uppercase font-bold text-center">
						On Deck: {documents.upNext[0].name}
					</p>

					<div
						className="size-16 sm:size-20 rounded-full opacity-60"
						title={documents.upNext[0].name}
						aria-label={documents.upNext[0].name}
					>
						<Image
							src={`/${documents.upNext[0].name.toLowerCase()}.png`}
							width={80}
							height={80}
							alt=""
							className="rounded-full size-16 sm:size-20"
						/>
					</div>
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
			</div>

			<div className="flex max-w-5xl gap-2 flex-wrap justify-center z-50 relative">
				{documents.done.map((doc) => (
					<div
						key={doc.id}
						className="size-12 sm:size-14 rounded-full opacity-20"
						title={doc.name}
						aria-label={doc.name}
						onContextMenu={(e) => {
							e.preventDefault();
							movePeople("people", "markFuture", doc.id);
						}}
					>
						<Image
							src={`/${doc.name.toLowerCase()}.png`}
							width={60}
							height={60}
							alt=""
							className="rounded-full border-2 border-slate-600"
						/>
					</div>
				))}
			</div>

			<div>
				{documents.future.length > 0 || documents.upNext.length > 0 ? (
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
											documents.active.map((doc) => doc.id)[0],
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
							onClick={setNextPerson}
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
			</div>
		</div>
	);
}
