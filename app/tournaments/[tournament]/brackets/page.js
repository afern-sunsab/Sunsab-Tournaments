"use client"

import { getTournamentBrackets } from "@utils/bracket_services";
import { getTournament } from "@utils/firebase_services";
import { useState, useEffect } from "react";
import { Bracket, Seed, SeedItem, SeedTeam, SeedTime } from "react-brackets";
// import LoadingBracket, { RenderLoadingSeed } from "./loading";

export default function Page({ params }){
	const [tournament, setTournament] = useState();
	const [brackets, setBrackets] = useState([]);

	useEffect(() => {
		const fetchTournament = async () => {
			const data = await getTournament(params.tournament);
			setTournament(data);
			console.log(data)
		}
		fetchTournament()
	}, [params])

	useEffect(() => {
		const fetchBrackets = async () => {
			if (tournament) {
				const data = await getTournamentBrackets(tournament);
				console.log(data);
				setBrackets(data);
			}
		}
		fetchBrackets()
	}, [tournament]);

	return(
		<main className="bg-white text-black p-6">
			{tournament ? (
				<div>
					<h1>{tournament.name} Brackets</h1>
					{brackets.length > 0 ? (
						<div>
							{brackets.map((bracket) => (
								<div>
									<h1>{bracket.name}</h1>
									<h2>Bracket Type: {bracket.type}</h2>
								</div>
							))}
						</div>	
					) : (
						<div>No brackets</div>
					)}
				</div>
			) : (
				<div>No tournament</div>
			)}
		</main>
	)
}