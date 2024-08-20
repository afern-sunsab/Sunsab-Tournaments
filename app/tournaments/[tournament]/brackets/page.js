"use client"

import { getTournamentBrackets, convertBrackets } from "@utils/bracket_services";
import { getTournamentByDocId} from "@utils/tournament_services";
import { useState, useEffect } from "react";
import SingleElimination from "@components/brackets/single_elimination/single-elim";
import Match from "@components/brackets/match";
import { forEachRound } from "@utils/bracket_services";
import Single from "@components/brackets/single/single";
import { createBracketListener, isBracketInRTDB } from "@utils/bracket_services";
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
			//console.log(data)
		}
		fetchTournament()
	}, [params])

	//Fetch brackets
	useEffect(() => {
		const fetchBrackets = async () => {
			if (tournament) {
				const data = await getTournamentBrackets(tournament);
				//console.log(data);
				setBrackets(data);

				//Create listener for each bracket
				data.forEach(async (bracket) => {
					const inRTDB = await isBracketInRTDB(bracket);
					if (inRTDB) {
						createBracketListener(bracket, (data) => {
							//console.log("Bracket listener data: ")
							//console.log(data);
							//Get index of modified bracket
							//This is a function within setBrackets because of state weirdery
							setBrackets(prevBrackets => {
								// Get index of modified bracket
								const index = prevBrackets.findIndex(b => b.docId === data.docId);
								console.log("Index: " + index);
	
								// Update bracket
								if (index !== -1) {
									const newBrackets = [...prevBrackets];
									newBrackets[index] = data;
									return newBrackets;
								} else {
									//console.error("Bracket not found in the list");
									return prevBrackets;
								}
							});
						})
					}
				})
			}
		}
		fetchBrackets()
	}, [tournament]);

    // useEffect(() => {
    //     if (brackets.length > 0) {
    //         const converted = convertBrackets(brackets);
	// 		//console.log(converted);
    //         setConvertedBrackets(converted);
    //     }
    // }, [brackets]);

	return (
		<main className="bg-gray-100 text-gray-900 p-8">
		  {tournament ? (
			<div>
			  <h1 className="text-3xl font-extrabold mb-6 text-center text-sunsab-yellow">{tournament.name} Brackets</h1>
			  {brackets.length > 0 ? (
				<div>
				  {brackets.map((bracket, index) => (
					<div key={index} className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-100 shadow-md">
					  <Single bracket={bracket} />
					</div>
				  ))}
				</div>
			  ) : (
				<div className="text-gray-600 text-center">No brackets available</div>
			  )}
			</div>
		  ) : (
			<div className="text-gray-600 text-center">No tournament available</div>
		  )}
		</main>
	  );
	}