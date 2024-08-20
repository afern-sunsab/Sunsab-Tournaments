import { forEachMatch, forEachRound } from "@utils/bracket_services";
import Match from "../match";
import { declareWinner, setScore } from "@utils/bracket_services";

export default function Single({ bracket }) {

	// const populateMatches = async () => {
	// 	await forEachMatch(bracket, async (match) => {

	// 	})
	// }

	const forEachMatch = async (round) => {
		await Promise.all(Object.keys(round).map(async (match) => {
			await callback(round[match]);
		}));
	}

	const capitalize = (string) => {
		return string.charAt(0).toUpperCase() + string.slice(1)
	}

	const handleWinner = async (round, match, player) => {
		await declareWinner(bracket, round, match, player);
	}

	const handleChangeScore = async (round, match, player, score) => {
		await setScore(bracket, round, match, player, score);
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