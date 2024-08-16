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

	const handleWinner = async (round, match, player) => {
		await declareWinner(bracket, round, match, player);
	}

	const handleChangeScore = async (round, match, player, score) => {
		await setScore(bracket, round, match, player, score);
	}

	return (
		<main className="text-black">
			<div className="flex overflow-x-auto space-x-4">
				{bracket ? (
					Object.entries(bracket.matches).map(([roundName, round], index) => (
						<div key={index} className="flex-shrink-0 w-64 p-4">
							<div className="font-bold text-lg mb-2">{roundName}</div>
							<div className="space-y-4"> {/* Adds vertical spacing between matches */}
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
					<div className="text-gray-500">No rounds available</div>
				)}
			</div>
		</main>
	);
	
	
}