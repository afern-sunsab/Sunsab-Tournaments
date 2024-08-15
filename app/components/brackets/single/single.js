import { forEachMatch, forEachRound } from "@utils/bracket_services";
import Match from "../match";

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

	return (
		<main className="text-black">
			<div className="flex overflow-x-auto space-x-4">
				{bracket ? (
					Object.entries(bracket.matches).map(([roundName, round], index) => (
						<div key={index} className="flex-shrink-0 w-64 p-4">
							<div className="font-bold text-lg mb-2">{roundName}</div>
							<div className="space-y-4"> {/* Adds vertical spacing between matches */}
								{Object.entries(round).map(([matchName, match], matchIndex) => (
									<Match key={matchIndex} match={match} />
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