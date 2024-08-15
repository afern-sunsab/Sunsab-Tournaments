import { createObject, updateObject, getObjects, getObjectByDocID, objectsToRefs, createRef, parseDocID, timestampToDate, getHighestID } from "./firebase_services";
//RTDB functions
import { ref, set, get, remove, onValue } from "firebase/database";
import { rtdb } from "./firebase";
import { getUserData } from "./user_services";

//Default data structure for a bracket
export const defaultBracket = {
	name: "",
	style: "",
	matches: [],
	capacity: 0
};

export const defaultMatch = {
	player1: {
		score: 0,
		user: null
	},
	player2: {
		score: 0,
		user: null
	},
	is_bye: false,
	next_match: null,
	match_flags: [],
	date: Date.now()
};

// Function to get a bracket by its document ID
export const getBracketByDocId = async (docId, bypassRTDB = false) =>
{
	let bracketData = null;
	//If bracket is in the RTDB, get that instead
	const bracketInRTDB = bypassRTDB ? false : await isBracketInRTDB(docId);
	if (bracketInRTDB)
	{
		//console.log("Bracket is in RTDB. Getting from RTDB.")
		bracketData = await getBracketFromRTDB(docId);
	}
	else
	{
		//console.log("Bracket is not in RTDB. Getting from Firestore.")
		bracketData = await getObjectByDocID("brackets", docId);
		//Convert user references to user data
		bracketData = await convertBracketToUserData(bracketData);
	}
	//Add returned data to default bracket structure
	const returnBracket = { ...defaultBracket, ...bracketData };
	return returnBracket;
}

export const getTournamentBrackets = async (tournament) => {
	const brackets = []
	if (Array.isArray(tournament.brackets)) {
		await Promise.all(tournament.brackets.map(async (bracketRef) => {
			const bracket = await getBracketByDocId(bracketRef.id);
			brackets.push(bracket);
		}));
	}
	return brackets;
}

// Function to get all brackets
// "queryData" is an optional object containing query data
// queryData format is [field, operator, value]
// Example: ["name", "==", "My Bracket"]
export const getAllBrackets = async (queryData = null) =>
{
	const brackets = await getObjects("brackets", queryData);
	return brackets;
}

// Function to create a new bracket
// "bracket" is a JavaScript object representing a bracket document
export const createBracket = async (bracket) => {
	// Merge default data with provided data
	const newBracket = { ...defaultBracket, ...bracket };
	// Create the bracket
	const document = await createObject("brackets", newBracket);
	//If the bracket's id is 0, create a new id number
	if (newBracket.id <= 0)
	{
		newBracket.id = await getHighestID("brackets") + 1;
	}
	//Add the document ID to the bracket object
	newBracket.docId = document.id;
	return newBracket;
}

// Function to update a bracket
// "bracket" is a JavaScript object representing a bracket document
// "bypassRTDB" is a boolean that determines whether the bracket should be updated in Firestore, regardless of whether it is in the RTDB
export const updateBracket = async (bracket, bypassRTDB = false) => {
	//const { docId, ...bracketPrunedDocID } = bracket;

	//Merge default data with provided data, in case structure has changed
	const updatedBracket = { ...defaultBracket, ...bracket };
	//Check to seeif bracket is not in the RTDB
	const bracketInRTDB = await isBracketInRTDB(bracket);
	if (!bracketInRTDB || bypassRTDB)
	{
		//Not in RTDB or bypassing RTDB, update Firestore
		console.log("Bracket is not in RTDB. Updating Firestore.")
		const bracketCopy = await convertBracketToUserRefs(updatedBracket);
		await updateObject("brackets", bracketCopy);
	}
	else
	{
		//Bracket is in RTDB, update RTDB
		const bracketCopy = await convertBracketToDocIDs(updatedBracket);
		console.log("Bracket copy being updated to RTDB:")
		console.log(bracketCopy);
		const bracketRef = ref(rtdb, `brackets/${bracketCopy.docId}`);
		await set(bracketRef, bracketCopy);
	}
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
		let match = {
			player1: {
				score: 0,
				user: createRef("users", entrantsCopy[i].docId),
			},
			player2: {
				score: 0,
				user: createRef("users", entrantsCopy[i + 1].docId),
			}
		};
		let matchReturn = {
			player1: {
				score: 0,
				user: entrantsCopy[i],
			},
			player2: {
				score: 0,
				user: entrantsCopy[i + 1],
			}
		};
		//Add match data to default match structure
		match = { ...defaultMatch, ...match };
		matchReturn = { ...defaultMatch, ...matchReturn };
		console.log("Creating match " + matchid + " with " + entrantsCopy[i].username + " vs " + entrantsCopy[i + 1].username);
		const matchname = "match" + matchid;
		//matches.round1.push({ [matchname]: match });
		matches.round1[matchname] = match;
		matchesReturn.round1[matchname] = matchReturn;
		matchid++;
	}
	//If there is still an odd number of entrants, create a bye match
	if (entrantsCopy.length % 2 !== 0) {
		let match = {
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
		let matchReturn = {
			player1: {
				score: 0,
				user: entrantsCopy[entrantsCopy.length - 1],
			},
			player2: {
				score: 0,
				user: null,
			}
		};
		//Add match data to default match structure
		match = { ...defaultMatch, ...match };
		matchReturn = { ...defaultMatch, ...matchReturn };
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
//if force is set to true, the bracket will be sent to the RTDB regardless of whether it already exists
export const sendBracketToRTDB = async (bracket, force = false) => {
	//Create a bracket structure in the RTDB
	//Uses the same structure as the Firestore bracket
	//Uses the bracket's docId as the key

	const bracketRef = ref(rtdb, `brackets/${bracket.docId}`);
	///But first, check if the bracket is already in the RTDB
	if (await isBracketInRTDB(bracket) && !force)
	{
		console.log("Bracket already exists in RTDB. Cancelling.");
		return;
	}
	//Next, parse all players to convert references into docIDs
	//Firebase RTDB doesn't like complex objects, so we'll store it as a string ("users/[docId]")
	let bracketCopy = { ...bracket };

	bracketCopy = await convertBracketToDocIDs(bracketCopy);
	
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
		let bracketCopy = { ...bracketData };
		bracketCopy = await convertBracketToUserRefs(bracketCopy);

		await updateBracket(bracketCopy, true);
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
	let bracketData = snapshot.val();
	if (bracketData)
	{
		bracketData = await convertBracketToUserData(bracketData);
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
	return onValue(bracketRef, async (snapshot) => {
		if (!snapshot.exists()) {
			console.log("BRACKET_SERVICES: Bracket does not exist in RTDB. Closing listener.");
			callback(null);
			return;
		}
		const data = snapshot.val();
		const bracketData = await convertBracketToUserData(data);
		//console.log("BRACKET_SERVICES: Bracket updated in RTDB.");
		//console.log(bracketData);
		callback(bracketData);
	});
}
/*
	^^^This one's a bit complex, so here's an example implementation:
	const [realtimeBracket, setRealtimeBracket] = useState(null);
	createBracketListener(docID, (data) => {
		setRealtimeBracket(data);
	});

	This sends a circle function to the page that updates the bracket state whenever the bracket is updated in the RTDB
*/

//Function to declare a winner in a match
//The winner will be moved to the next round
//The next round's match number will be the current match number divided by 2, rounded up
//If the match is in the final round, the bracket will be marked as complete
//round, match, and winner are all key names (ie "round1", "match1", "player1")
//Returns the updated bracket
export const declareWinner = async (bracket, round, match, winner) => {
	//Copy the bracket
	const bracketCopy = { ...bracket };
	//Find the match
	const matchData = bracketCopy.matches[round][match];
	//Find the next match
	const nextRound = "round" + (parseInt(round.replace("round", "")) + 1);
	const nextMatch = "match" + Math.ceil(parseInt(match.replace("match", "")) / 2);
	//Declare the winner
	const winnerData = matchData[winner].user;

	//If the the current round only has one match, it is the final match
	//Mark the bracket as complete
	if (Object.keys(bracketCopy.matches[round]).length === 1) {
		bracketCopy.completed = true;
	}
	else{
		//If the next round doesn't exist, create it
		if (!bracketCopy.matches[nextRound]) {
			bracketCopy.matches[nextRound] = {};
		}
		//If the next match doesn't exist, create it
		if (!bracketCopy.matches[nextRound][nextMatch]) {
			bracketCopy.matches[nextRound][nextMatch] = {
				player1: {
					score: 0,
					user: null
				},
				player2: {
					score: 0,
					user: null
				}
			};
		}
		//Move the winner to the next round
		bracketCopy.matches[nextRound][nextMatch]["player" + (2 - (parseInt(match.replace("match", "")) % 2))].user = winnerData;
	}
	
	//Update the bracket
	await updateBracket(bracketCopy);
	return bracketCopy;
}

//Function to set score for a given player in a match
//Basically the same as declareWinner, but changes the score instead of moving the player
//Returns the updated bracket
export const setScore = async (bracket, round, match, player, score) => {
	//Copy the bracket
	const bracketCopy = { ...bracket };
	//Find the match
	const matchData = bracketCopy.matches[round][match];
	//Set the score
	matchData[player].score = score;
	//Update the bracket
	await updateBracket(bracketCopy);
	return bracketCopy;
}


//Function to convert a bracket's user references to user data
//Accepts a bracket object with user references or reference strings
//Returns a bracket object with user data as a javascript object instead of references
export const convertBracketToUserData = async (bracket) => {
	//console.log("Converting bracket to user data:")
	//Copy the bracket
	const bracketCopy = { ...bracket };
	//Convert all user references to user data
	await forEachPlayer(bracketCopy, async (player) => {
		if (player.user) {
			//Skip if user is already a user object
			if (!player.user.docId)
			{
				if (typeof player.user === "string")
					player.user = await getUserData(player.user)
				else
					player.user = await getUserData(player.user.id)
			}
		}
	});
	return bracketCopy;
}

//Function to convert a bracket's user data to user references
//Accepts a bracket object with user data
//Returns a bracket object with user references instead of data
export const convertBracketToUserRefs = async (bracket) => {
	//Copy the bracket
	const bracketCopy = { ...bracket };
	//Convert all user data to user references
	await forEachPlayer(bracketCopy, async (player) => {
		if (player && player.user) {
			console.log("Converting user data to user reference:")
			player.user = await objectsToRefs(player.user, "users");
		}
	});
	return bracketCopy;
}

//Function to convert a bracket's user data to a docId string
//Accepts a bracket object with user data OR user references (probably)
//Returns a bracket object with user references as strings containing docIDs
//Used to convert bracket data to a format that can be stored in the RTDB
export const convertBracketToDocIDs = async (bracket) => {
	//Copy the bracket
	const bracketCopy = { ...bracket };
	//Convert all user data to docIDs
	await forEachPlayer(bracketCopy, async (player) => {
		if (player && player.user) {
			//console.log("Converting user data to docID:")
			if (player.user.id)
				player.user = player.user.id
			else if (player.user.docId)
				player.user = player.user.docId
		}
	});
	return bracketCopy;
}

//Coverts bracket data into a format used by the display module
export const convertBrackets = (brackets) => {
	const convertedBrackets = brackets.map((bracket) => {
		const rounds = Object.keys(bracket.matches).map((roundKey, roundIndex) => {
			const matches = Object.keys(bracket.matches[roundKey]).map((matchKey, matchIndex) => {
				const match = bracket.matches[roundKey][matchKey];

				return {
					id: matchIndex,
					date: match.date ? timestampToDate(match.date) : new Date().toISOString(),
					teams: [
						{
							//Somewht complicated: If user is a docId string pass that, otherwise if user has a codId value, pass that, otherwise pass null
							id: match.player1.user ? (typeof match.player1.user === "string" ? match.player1.user : match.player1.user.docId) : null,
							name: match.player1.user ? match.player1.user.name : null,
							score: match.player1.score ? match.player1.score : null
						},
						{
							id: match.player2.user ? (typeof match.player2.user === "string" ? match.player2.user : match.player2.user.docId) : null,
							name: match.player2.user ? match.player2.user.name : null,
							score: match.player2.score ? match.player2.score : null
						}
					]
				};
			});

			return {
				title: `Round ${roundIndex + 1}`,
				seeds: matches
			};
		});

		return {
			name: bracket.name,
			type: bracket.type,
			rounds: rounds
		};
	});
	//console.log("Converted Brackets:")
	//console.log(convertedBrackets);
	return convertedBrackets;
};

//Stock function to iterate through all rounds within a bracket (For Angelo) (I hate it)
//Attaches to a callback function to do something with each round
export const forEachRound = async (bracket, callback) => {
	//Iterate through each round
	await Promise.all(Object.keys(bracket.matches).map(async (round) => {
		//Call the callback function with the round data
		await callback(bracket.matches[round]);
	}));
}

//Stock function to iterate through all matches within a bracket (For Angelo)
//Attaches to a callback function to do something with each match
export const forEachMatch = async (bracket, callback) => {
	//Recycle the round function to iterate through all matches
	await forEachRound(bracket, async (round) => {
		//Call the callback function with each match
		await Promise.all(Object.keys(round).map(async (match) => {
			await callback(round[match]);
		}));
	});
}

//Stock function to iterate through all players within a bracket
//Attaches to a callback function to do something with each player
export const forEachPlayer = async (bracket, callback) => {
	//Recycle the match function to iterate through all players
	await forEachMatch(bracket, async (match) => {
		//Call the callback function with each player
		await Promise.all(Object.keys(match).map(async (player) => {
			await callback(match[player]);
		}));
	});
}