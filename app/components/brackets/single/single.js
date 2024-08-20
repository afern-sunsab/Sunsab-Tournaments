import { forEachMatch, forEachRound } from "@utils/bracket_services";
import Match from "../match";
import { declareWinner, setScore } from "@utils/bracket_services";
import { useEffect } from "react";
import { convertBracketToUserData } from "@utils/bracket_services";

export default function Single({ bracket }) {

	// const populateMatches = async () => {
	// 	await forEachMatch(bracket, async (match) => {

	// 	})
	// }

	// Test: Output bracket data when it changes
	useEffect(() => {
		console.log("Bracket changed:")
		console.log(bracket);
	}, [bracket])

	const forEachMatch = async (round) => {
		await Promise.all(Object.keys(round).map(async (match) => {
			await callback(round[match]);
		}));
	}

	const capitalize = (string) => {
		return string.charAt(0).toUpperCase() + string.slice(1)
	}

	const handleWinner = async (round, match, player) => {
		console.log("SINGLE.JS: Declaring winner: " + player + " in " + round + " of " + match);
		await declareWinner(bracket, round, match, player);
		//console.log("New bracket:")
		//console.log(bracket);
		//Reconvert bracket to user data even thought it shouldn't be changing in the first place
		bracket = await convertBracketToUserData(bracket);
	}

	const handleChangeScore = async (round, match, player, score) => {
		await setScore(bracket, round, match, player, score);
		//Again, reconvert bracket to user data despite setScore supposedly not changing the bracket
		bracket = await convertBracketToUserData(bracket);
	}

	return (
		<div className="text-gray-900">
		  <div className="flex overflow-x-auto space-x-4">
			{bracket ? (
			  Object.entries(bracket.matches).map(([roundName, round], index) => (
				<div key={index} className="flex-shrink-0 w-80 p-4 bg-white">
				  <div className="font-bold text-xl mb-4 text-center text-sunsab-yellow">{capitalize(roundName)}</div>
				  <div className="space-y-4 flex flex-col justify-evenly h-full">
					{Object.entries(round).map(([matchName, match], matchIndex) => (
					  <Match
						key={matchIndex}
						match={match}
						handleWinner={(playerName) => handleWinner(roundName, matchName, playerName)}
						handleScore={(playerName, score) => handleChangeScore(roundName, matchName, playerName, score)}
					  />
					))}
				  </div>
				</div>
			  ))
			) : (
			  <div className="text-gray-500 text-center">No rounds available</div>
			)}
		  </div>
		</div>
	  );
	}