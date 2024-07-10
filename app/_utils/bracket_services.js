import { createObject, updateObject, getUserRefs, createRef, parseDocID } from "./firebase_services";
//RTDB functions
import { getDatabase, ref, set, get, child, update, remove, onValue } from "firebase/database";
import { rtdb } from "./firebase";
import { db } from "./firebase";
import { doc } from "firebase/firestore";

//Default data structure for a bracket
const defaultBracket = {
	name: "",
	style: "",
	matches: [],
};

// Function to create a new bracket
// "bracket" is a JavaScript object representing a bracket document
export const createBracket = async (bracket) => {
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

	//Merge default data with provided data, in case structure has changed
	const updatedBracket = { ...defaultBracket, ...bracket };
	await updateObject("brackets", updatedBracket);
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

//Firebase-specific functions for transfering brackets to and from the database and the rtdb
export const sendBracketToRTDB = async (bracket) => {
	//Create a bracket structure in the RTDB
	//Uses the same structure as the Firestore bracket
	//Uses the bracket's docId as the key

	const bracketRef = ref(rtdb, `brackets/${bracket.docId}`);
	///But first, check if the bracket is already in the RTDB
	/*const bracketSnapshot = await get(child(bracketRef));
	const bracketData = bracketSnapshot.val();
	if (bracketData)
	{
		console.log("Bracket already exists in RTDB. Cancelling.");
		return;
	}*/
	//Next, parse all players to convert references into docIDs
	//Firebase RTDB doesn't like complex objects, so we'll store it as a string ("users/[docId]")
	const bracketCopy = { ...bracket };
	//console.log("Bracket copy:")
	//console.log(bracketCopy);
	/*bracketCopy.matches.map((round) => {
		round.map((match) => {
			match.player1.user = match.player1.user.id;
			match.player2.user = match.player2.user.id;
		});
	});*/
	Object.keys(bracketCopy.matches).map((round) => {
		Object.keys(bracketCopy.matches[round]).map((match) => {
			if (bracketCopy.matches[round][match].player1.user)
			{
				//Small fix for a mistake: If user is a string with just a docId, don't convert it
				if (typeof bracketCopy.matches[round][match].player1.user !== "string")
				bracketCopy.matches[round][match].player1.user = bracketCopy.matches[round][match].player1.user.id;
			}
			if (bracketCopy.matches[round][match].player2.user)
			{
				if (typeof bracketCopy.matches[round][match].player2.user !== "string")
				bracketCopy.matches[round][match].player2.user = bracketCopy.matches[round][match].player2.user.id;
			}
		});
	});
	
	await set(bracketRef, bracketCopy);
}

export const sendBracketToFirestore = async (bracket) => {
	//Copy the live bracket data into the permanent document
	//Then delete the live bracket (RIP)
	const bracketDocId = parseDocID(bracket);

	const bracketRef = ref(rtdb, `brackets/${bracketDocId}`);
	const snapshot = await get(bracketRef);
	const bracketData = snapshot.val();
	if (bracketData)
	{
		//First, convert all players back to references
		//They should all be strings containing docIDs
		const bracketCopy = { ...bracketData };
		await Promise.all(Object.keys(bracketCopy.matches).map(async (round) => {
			await Promise.all(Object.keys(bracketCopy.matches[round]).map(async (match) => {
			  if (bracketCopy.matches[round][match].player1.user) {
				bracketCopy.matches[round][match].player1.user = await doc(db, "users", bracketCopy.matches[round][match].player1.user)
			  }
			  if (bracketCopy.matches[round][match].player2.user) {
				bracketCopy.matches[round][match].player2.user = await doc(db, "users", bracketCopy.matches[round][match].player2.user)
			  }
			}));
		  }));
		console.log("Bracket copy:")
		console.log(bracketCopy);
		await updateBracket(bracketCopy);
	}
	else
	{
		console.log("No bracket data found in RTDB for bracket " + bracketDocId);
	}

	//Delete the live bracket
	await remove(bracketRef)
}

//Function to check if a bracket is in the RTDB
//Returns true if the bracket is in the RTDB, false if not
//You can pass a bracket object or a bracket docId
export const isBracketInRTDB = async (bracket) => {
	const bracketDocId = parseDocID(bracket);
	const bracketRef = ref(rtdb, `brackets/${bracketDocId}`);
	const snapshot = await get(bracketRef);
	const bracketData = snapshot.val();
	if (bracketData)
	{
		//console.log("BRACKET_SERVICES: Bracket is in RTDB.");
		//console.log(bracketData);
		return true;
	}

	return false;
}

//Function to get a bracket from the RTDB
//Returns the bracket object
//You can pass a bracket object or a bracket docId
export const getBracketFromRTDB = async (bracket) => {
	const bracketDocId = parseDocID(bracket);
	const bracketRef = ref(rtdb, `brackets/${bracketDocId}`);
	const snapshot = await get(bracketRef);
	const bracketData = snapshot.val();
	if (bracketData)
	{
		//console.log("BRACKET_SERVICES: Bracket is in RTDB.");
		//console.log(bracketData);
		return bracketData;
	}
	return null;
}

//Function to create a listener for a bracket in the RTDB
//Returns a callback function that runs when the bracket is updated
//Use a callback function within the page to update the bracket information in your useState or whatever
//You can pass a bracket object or a bracket docId
export const createBracketListener = async (bracket, callback) => {
	const bracketDocId = parseDocID(bracket);
	const bracketRef = ref(rtdb, `brackets/${bracketDocId}`);
	return onValue(bracketRef, (snapshot) => {
		const data = snapshot.val();
		console.log("BRACKET_SERVICES: Bracket updated in RTDB.");
		console.log(data);
		callback(data);
	});
}
/*
	^^^This one's a bit complex, so here's an example implementation:
	createBracketListener(docID, (data) => {
		setRealtimeBracket(data);
	});

	This sends a circle function to the page that updates the bracket state whenever the bracket is updated in the RTDB
*/