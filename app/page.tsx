"use client";

import { usePeople } from "@/app/hooks/usePeople";
import initialPeopleData from "@/app/data.json";

import Image from "next/image";
import { useEffect } from "react";
import Confetti from "react-confetti-boom";
import glasses from "./glasses.png";
import jazz from "./jazz.webp";

const theme = {
	bu: "dark",
	jonni: "purple",
	cassio: "dracula",
	anna: "rainbow",
};

const jonniQuotes = [
	"it's all good",
	"all good in the hood",
	"It's a good day",
	"It's another good day",
];

export default function Home() {
	const { documents, setNextPerson, markDone, markFuture, markActive } =
		usePeople(
			initialPeopleData.map((person) => ({ ...person, status: "future" })),
		);

	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.key.toLowerCase() === "n") {
				setNextPerson();
			}
		};
		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [setNextPerson]);

	return (
		<>
			{documents.active[0]?.first_name === "Brian" ? (
				<Image
					src={jazz}
					alt=""
					className="absolute top-0 left-0 w-full h-full z-10 opacity-25"
				/>
			) : null}
			<div
				className={`relative grid grid-rows-[1fr_2fr_1fr_30px] py-12 h-screen w-full place-items-center overflow-hidden rounded-lg border bg-background gap-8 sm:gap-16 ${
					documents.active.length &&
					theme[
						documents.active[0].first_name.toLowerCase() as keyof typeof theme
					]
						? theme[
								documents.active[0].first_name.toLowerCase() as keyof typeof theme
							]
						: null
				}`}
			>
				{documents.upNext.length === 0 &&
				documents.done.length > 0 &&
				documents.active.length === 1 ? (
					<Confetti mode="fall" particleCount={500} />
				) : null}
				<div className="flex max-w-7xl gap-2 flex-wrap justify-center z-50 relative">
					{documents.future.map((doc) => (
						<button
							type="button"
							key={doc.id}
							className="size-10 sm:size-12 rounded-full opacity-70 hover:opacity-100 hover:scale-150 transition-all hover:z-50"
							title={doc.first_name}
							aria-label={doc.first_name}
							onClick={() => markActive(doc.id)}
							onContextMenu={(e) => {
								e.preventDefault();
								markDone(doc.id);
							}}
						>
							<Image
								src={doc.image_512}
								width={100}
								height={100}
								alt=""
								priority
								className="rounded-full border-2 border-chart-1 object-cover aspect-square"
							/>
						</button>
					))}
				</div>
				<div className="flex gap-16 items-center justify-center">
					{documents.upNext.length > 0 && (
						<div className="z-50 relative grid gap-2 place-items-center">
							<p className="text-sm text-foreground/50 uppercase font-bold text-center grid">
								Who&apos;s next{" "}
								<span className="text-foreground font-bold text-4xl">
									{documents.upNext.length > 0
										? documents.upNext[0].first_name
										: "None"}
								</span>
							</p>
							{documents.upNext.length > 0 && (
								<div
									className="size-24 sm:size-64 rounded-full opacity-30"
									title={documents.upNext[0].first_name}
									aria-label={documents.upNext[0].first_name}
								>
									<Image
										src={documents.upNext[0].image_512}
										width={256}
										height={256}
										alt=""
										className="rounded-full size-24 sm:size-64 aspect-square"
									/>
								</div>
							)}
						</div>
					)}
					<div className="flex max-w-xl gap-2 flex-wrap justify-center z-50 relative">
						{documents.active.map((doc) => (
							<div className="grid gap-4" key={doc.id}>
								<p className="text-sm text-foreground/50 uppercase font-bold text-center grid">
									{documents.upNext.length === 0
										? "The Closer™"
										: doc.first_name === "Jonni"
											? jonniQuotes[
													Math.floor(Math.random() * jonniQuotes.length)
												]
											: "Speaker"}
									<span className="text-foreground font-bold text-4xl">
										{doc.first_name}
									</span>
								</p>
								<button
									type="button"
									key={doc.id}
									className={
										"size-24 sm:size-64 rounded-full opacity-100 hover:opacity-100 transition-opacity ring-8 ring-chart-2 relative"
									}
									title={doc.first_name}
									aria-label={doc.first_name}
								>
									{doc.first_name === "Anna" ? (
										<Image
											src={glasses}
											width={100}
											alt=""
											className="absolute top-16 left-12 animate-down"
										/>
									) : null}
									<Image
										src={doc.image_512}
										width={256}
										height={256}
										alt=""
										className="rounded-full border-2 border-chart-1 aspect-square object-cover"
									/>
								</button>
							</div>
						))}
					</div>
				</div>
				<div className="flex max-w-5xl gap-2 flex-wrap justify-center z-50 relative">
					{documents.done.map((doc) => (
						<div
							key={doc.id}
							className="size-12 sm:size-14 rounded-full opacity-20"
							title={doc.first_name}
							aria-label={doc.first_name}
							onContextMenu={(e) => {
								e.preventDefault();
								markFuture(doc.id);
							}}
						>
							<Image
								src={doc.image_512}
								width={60}
								height={60}
								alt=""
								className="rounded-full border-2 border-chart-1 object-cover aspect-square"
							/>
						</div>
					))}
				</div>
				<div>
					{documents.future.length > 0 || documents.upNext.length > 0 ? (
						<div className="flex gap-4 items-center">
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
					) : null}
				</div>
			</div>
		</>
	);
}
