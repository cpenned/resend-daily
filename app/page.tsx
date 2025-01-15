"use client";
import { Particles } from "@/components/ui/particles";
import useCollection from "@/hooks/useCollection";

import Image from "next/image";
import { movePeople } from "./actions";

export default function Home() {
	const { documents } = useCollection("people");

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

			<div className="flex max-w-xl gap-2 flex-wrap justify-center z-50 relative">
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
				<button
					type="button"
					className="uppercase text-lg font-bold px-4 py-2 bg-background text-foreground tracking-wide"
					onClick={() => {
						const randomIndex = Math.floor(
							Math.random() * documents.future.length,
						);
						const randomPerson = documents.future[randomIndex];
						movePeople("people", "markActive", randomPerson.id);
					}}
				>
					Next
				</button>
			) : (
				<button
					type="button"
					className="uppercase text-sm font-bold px-4 py-2 bg-background text-foreground rounded-full tracking-wide"
					onClick={() => movePeople("people", "resetAll", "")}
				>
					reset
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
