"use client";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@utils/firebase";
import React, { useEffect, useState } from "react";
import { Bracket, Seed, SeedItem, SeedTeam, SeedTime } from "react-brackets";
import { RenderLoadingSeed } from "../loading";
import Modal from "react-modal";

const customStyles = {
	overlay: {
		backgroundColor: "rgba(0, 0, 0, 0.1)",
	},
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
	},
};

export default function SingleElimination({ rounds }) {
	const [isOpen, setIsOpen] = useState(false);

	const RenderSeed = ({ breakpoint, seed }) => {
		return (
			<Seed mobileBreakpoint={breakpoint}>
				<SeedItem className="hover:bg-slate-400" style={{ width: "100%" }}>
					<button onClick={() => setIsOpen(true)}>
						<SeedTeam>
							{seed.teams?.[0].name || "-----------"} -{" "}
							{seed.teams?.[0].score || " "}
						</SeedTeam>
						<div style={{ height: 1, backgroundColor: "#707070" }}></div>
						<SeedTeam>
							{seed.teams?.[1].name || "-----------"} -{" "}
							{seed.teams?.[1].score || " "}
						</SeedTeam>
					</button>
					<Modal
						isOpen={isOpen}
						onRequestClose={() => setIsOpen(false)}
						style={customStyles}
					>
						<h1 className="text-black">This is where the match data would go</h1>
						<button className="text-black" onClick={() => setIsOpen(false)}>Close</button>
					</Modal>
				</SeedItem>
				<SeedTime mobileBreakpoint={breakpoint} style={{ fontSize: 9 }}>
					{seed.date}
				</SeedTime>
			</Seed>
		);
	};

	return (
		<Bracket
			mobileBreakpoint={767}
			rounds={rounds}
			renderSeedComponent={rounds ? RenderSeed : RenderLoadingSeed}
			swipeableProps={{ enableMouseEvents: true, animateHeight: true }}
		/>
	);
}