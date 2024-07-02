import { createObject, updateObject, getUserRef, createRef } from "./firebase_services";

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
	await updateObject("brackets", bracket);
}

// Function to initialize matches
// "bracket" is a JavaScript object representing a bracket document
// "entrants" is an array of JavaScript objects representing user documents
export const initializeMatches = async (bracket, entrants) => {
	// Create a copy of the entrants array
	const entrantsCopy = [...entrants];
	// Shuffle the entrants array
	entrantsCopy.sort(() => Math.random() - 0.5);
	// Create an object to hold the matches
	const matches = {
        round1: {},
        round2: {}  // Initialize round2 here
    };
	//Create a second object to hold match data that will be returned
	//This will hold user data instead of references
	const matchesReturn = {
		round1: {},
		round2: {}
	};
	// Create matches
	let matchid = 1;
	for (let i = 0; i < entrantsCopy.length - 2; i += 2) {
		const match = {
			player1: {
				score: 0,
				user: createRef("users", entrantsCopy[i].docId),
			},
			player2: {
				score: 0,
				user: createRef("users", entrantsCopy[i + 1].docId),
			}
		};
		const matchReturn = {
			player1: {
				score: 0,
				user: entrantsCopy[i],
			},
			player2: {
				score: 0,
				user: entrantsCopy[i + 1],
			}
		};
		console.log("Creating match " + matchid + " with " + entrantsCopy[i].username + " vs " + entrantsCopy[i + 1].username);
		const matchname = "match" + matchid;
		//matches.round1.push({ [matchname]: match });
		matches.round1[matchname] = match;
		matchesReturn.round1[matchname] = matchReturn;
		matchid++;
	}
	//If there is still an odd number of entrants, create a bye match
	if (entrantsCopy.length % 2 !== 0) {
		const match = {
			player1: {
				score: 0,
				user: createRef("users", entrantsCopy[entrantsCopy.length - 1].docId),
			},
			//Empty player 2 slot
			player2: {
				score: 0,
				user: null,
			}
		};
		const matchReturn = {
			player1: {
				score: 0,
				user: entrantsCopy[entrantsCopy.length - 1],
			},
			player2: {
				score: 0,
				user: null,
			}
		};
		//matches.round2.push({ ["match1"]: match });
		matches.round2["match1"] = match;
		matchesReturn.round2["match1"] = matchReturn;
	}
	// Update the bracket with the new matches
	bracket.matches = matches;
	console.log("Matches initialized")
	console.log(matchesReturn);
	await updateBracket(bracket);
	//Now return the matches object with user data instead of references
	//This is why I hate references
	bracket.matches = matchesReturn;
	return bracket;
}