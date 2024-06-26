import { createObject, updateObject, getUserRef } from "./firebase_services";

// Function to create a new bracket
// "bracket" is a JavaScript object representing a bracket document
export const createBracket = async (bracket) => {
	//Default data structure for a bracket
	const defaultBracket = {
		name: "",
		style: "",
		matches: [],
	};
	// Merge default data with provided data
	const newBracket = { ...defaultBracket, ...bracket };
	// Create the bracket
	const document = await createObject("brackets", newBracket);
	//Add the document ID to the bracket object
	newBracket.docId = document.id;
	return newBracket;
}

// Function to update a bracket
// "bracket" is a JavaScript object representing a bracket document
export const updateBracket = async (bracket) => {
	const { docId, ...bracketPrunedDocID } = bracket;
	await updateObject("brackets", bracketPrunedDocID);
}

// Function to initialize matches
// "bracket" is a JavaScript object representing a bracket document
// "entrants" is an array of JavaScript objects representing user documents
export const initializeMatches = async (bracket, entrants) => {
	// Create a copy of the entrants array
	const entrantsCopy = [...entrants];
	// Shuffle the entrants array
	entrantsCopy.sort(() => Math.random() - 0.5);
	// Create an array to hold the matches
	const matches = [];
	matches.round1 = [];
	// Create matches
	let matchid = 1;
	for (let i = 0; i < entrantsCopy.length; i += 2) {
		const match = {
			player1: {
				score: 0,
				user: await getUserRef(entrantsCopy[i].uid),
			},
			player2: {
				score: 0,
				user: await getUserRef(entrantsCopy[i + 1].uid),
			}
		};
		const matchname = "match" + matchid;
		matches.round1.push({ [matchname]: match });
	}
	// Update the bracket with the new matches
	bracket.matches = matches;
	await updateBracket(bracket);
	return bracket;
}