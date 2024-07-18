"use client"

import { getTournamentBrackets, convertBrackets } from "@utils/bracket_services";
import { getTournamentByDocId} from "@utils/tournament_services";
import { useState, useEffect } from "react";
import SingleElimination from "@components/brackets/single_elimination/single-elim";
// import LoadingBracket, { RenderLoadingSeed } from "./loading";

export default function Page({ params }){
	const [tournament, setTournament] = useState();
	const [brackets, setBrackets] = useState([]);
	const [convertedBrackets, setConvertedBrackets] = useState([])

	useEffect(() => {
		const fetchTournament = async () => {
			const data = await getTournamentByDocId(params.tournament);
			if (data.name)
				document.title = "Tournaments - " + data.name + " Brackets";
			else
				document.title = "Tournaments - Tournament";
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

    useEffect(() => {
        if (brackets.length > 0) {
            const converted = convertBrackets(brackets);
			console.log(converted);
            setConvertedBrackets(converted);
        }
    }, [brackets]);

	return(
		<main className="bg-white text-black p-6">
			{tournament ? (
				<div>
					<h1 className="text-2xl font-bold mb-4">{tournament.name} Brackets</h1>
					{brackets.length > 0 ? (
						<div>
							{convertedBrackets.map((bracket, index) => (
								<div key={index} className="border rounded-md p-4 mb-4 hover:bg-gray-100">
									<h2 className="text-xl font-bold mb-2">{bracket.name}</h2>
									<h3 className="text-lg mb-4">Bracket Type: {bracket.type}</h3>
									<SingleElimination rounds={bracket.rounds} />
								</div>
							))}
						</div>
					) : (
						<div className="text-gray-600">No brackets</div>
					)}
				</div>
			) : (
				<div className="text-gray-600">No tournament</div>
			)}
		</main>
	)
}