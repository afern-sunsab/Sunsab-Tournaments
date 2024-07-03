"use client"
//NOTE: Avoid using functions from this file aside from get/create/updateObject functions, getUserRef, and dateToTimestamp/timestampToDate
//Preference goes to functions in user/bracket/tournament_services, which will be more modular and easier to use
import { collection, doc,getDoc, getDocs, updateDoc, addDoc, query, where, Timestamp } from "firebase/firestore";
import { db } from "../_utils/firebase";

//Basic Firestore functions, use these with other services. Try to avoid using these directly in components
export const getObjects = async (type, query = null) => {
	
	let documents = [];
	if (query) 
		documents = await getDocs(query(collection(db, type), query));
	else
		documents = await getDocs(collection(db, type));
	const data = documents.docs.map((doc) => ({docId: doc.id, ...doc.data(),}));
	console.log(`Fetched ${type} objects`)
	return data;
}

export const getObject = async (type, id) => {
	const document = await getDocs(query(collection(db, type), where("id", "==", id)));
	const object = document.docs.map(doc => ({ docId: doc.id, ...doc.data() }))[0];
	console.log(`Fetched ${type} object`)
	console.log(object);
	return object;
}

export const createObject = async (type, object) => {
	const document = await addDoc(collection(db, type), object)
	//alert(`Added new ${type} object`)
	return document;
}

export const updateObject = async (type, updatedObject, confirm = false) => {
	const { docId, ...updatedObjectPrunedDocID } = updatedObject;
	const objectRef = doc(db, type, docId);
	await updateDoc(objectRef, updatedObjectPrunedDocID);
	if (confirm) {
		alert(`Updated ${type} object`);
	}
}

//-------------
//Firestore-specific functions
//It's okay to call these directly in components, but try to use the functions in user/bracket/tournament_services instead
//Function to convert Javascript date to Firestore timestamp
export const dateToTimestamp = (value) => {
	const date = new Date(value);
	const timestamp = Timestamp.fromDate(date);
	console.log(`Converted date ${date} to timestamp ${timestamp}`)
	return timestamp;
}

//Function to convert Firestore timestamp to Javascript date
export const timestampToDate = (timestamp) => {
	//if timestamp is a string, just return it & yell at whoever entered a string into a timestamp field
	if (typeof timestamp === 'string') {
		console.log(`Timestamp is a string, returning it as is: ${timestamp}`);
		return timestamp;
	}
	const date = new Date(timestamp.toDate()).toISOString().split('T')[0];
	console.log(`Converted timestamp ${timestamp} to date ${date}`);
	return date;
}

//Function to convert user object or array of user objects to reference to user document
export const getUserRefs = async (user) => {
	if (Array.isArray(user)) {
		//Only convert entrant data to reference if it is not already a reference
		const userRefs = await Promise.all(user.map(async (user) => {
			if (user.docId) {
				const userRef = await doc(db, "users", user.docId);
				return userRef;
			}
			return user;
		}));
		return userRefs;
	}
	else if (user.docId)
		return doc(db, "users", user.docId);
	return user;

}

//----------------
//Deprecated functions
//These interact directly with the database, but only functions in services will be maintained and updated
export const getUser = async (uid) => {
	console.log(`Fetching user ${uid}`);
	const document = await getDocs(query(collection(db, "users"), where("uid", "==", uid)));
	const object = document.docs.map(doc => ({ docId: doc.id, ...doc.data()}))[0];
	//console.log(`Fetched user ${object.name} with these attributes${object}`);
	//console.log(object);
	return object;
}

//Function to get all users from the database
//Just for testing purposes, don't actually use this
export const getUsers = async () => {
	const documents = await getDocs(collection(db, "users"));
	const data = documents.docs.map((doc) => ({docId: doc.id, ...doc.data(),}));
	console.log("Fetched users")
	return data;
}

//Function to get reference to user document
//Technically not necessary, but it's here for consistency
//getUserRefs is the preferred function to use
export const getUserRef = async (uid) => {
	const document = await getDocs(query(collection(db, "users"), where("uid", "==", uid)));
	const userRef = doc(db, "users", document.docs[0].id);
	console.log(`Fetched user reference ${userRef}`);
	return userRef;
}

//Creates a reference to a document in the database
//type: the type of document
//id: the id (docId) of the document
//Supposedly doesn't make a request to the database, but I don't know if that's true
export function createRef(type, id) {
	return doc(db, type, id);
}

export const getTournaments = async () => {
	const documents = await getDocs(collection(db, "tournaments"));
    const data = documents.docs.map((doc) => ({docId: doc.id, ...doc.data(),}));
	//Convert entrants array of references to user documents to an array of user objects for each tournament
	for (let i = 0; i < data.length; i++) {
		if (data[i].entrants) {
			const entrantData = await Promise.all(data[i].entrants.map(async (entrant) => {
				const entrantDoc = await getDoc(entrant);
				const entrantData = {docId: entrantDoc.id, ...entrantDoc.data()};
				return entrantData;
			}));
			data[i].entrants = entrantData;
		}
	}

    console.log("Fetched tournaments")
	console.log(data);
    return data;
}

// export const getTournament = async (id) => {
// 	const document = await getDocs(query(collection(db, "tournaments"), where("id", "==", id)));
// 	const tournament = document.docs.map(doc => ({ docId: doc.id, ...doc.data() }))[0];
// 	console.log(`Fetched tournament ${tournament.name}`)
// 	return tournament;
// }

export const getTournament = async (id) => {
	const tournament = {docId: id, ...(await getDoc(doc(db, 'tournaments', id))).data()}
	return tournament;
}

export const getBrackets = async () => {
	const documents = await getDocs(collection(db, "brackets"));
	const data = documents.docs.map((doc) => ({docId: doc.id, ...doc.data(),}));
	console.log("Fetched brackets")
	return data;
}

export const getBracket = async (id) => {
	const document = await getDocs(query(collection(db, "brackets"), where("id", "==", id)));
	const bracket = document.docs.map(doc => ({ docId: doc.id, ...doc.data() }))[0];
	console.log(`Fetched bracket ${bracket.name}`)
	return bracket;
}

export const getMatches = async () => {
	const documents = await getDocs(collection(db, "matches"));
	const data = documents.docs.map((doc) => ({docId: doc.id, ...doc.data(),}));
	console.log("Fetched matches")
	return data;
}

export const getMatch = async (id) => {
	const document = await getDocs(query(collection(db, "matches"), where("id", "==", id)));
	const match = document.docs.map(doc => ({ docId: doc.id, ...doc.data() }))[0];
	console.log(`Fetched match ${match.name}`)
	return match;
}

/*export const createTournament = async (tournament) => {
	const document = await addDoc(collection(db, "tournaments"), tournament)
	console.log(`Added new tournament ${tournament.name}`)
	return document;
}*/

export const createTournament = async (tournament) => {
	//Default data structure
	const defaultTournament = {
		name: "New Tournament",
		game: "Game",
		description: "Description",
		entrant_limit: 0,
		close_date: new Date(),
		event_date: new Date(),
		entrants: [],
		bracket: null, //Potentialy deprecated
		brackets: [], //Array of bracket references, if the system will support multiple brackets per tournament
		completed: false
	}
	//Sanity checks for provided data
	//If dates are Javascript dates, convert them to Firestore timestamps
	if (tournament.event_date instanceof Date) {
		tournament.event_date = dateToTimestamp(tournament.event_date);
	}
	if (tournament.close_date instanceof Date) {
		tournament.close_date = dateToTimestamp(tournament.close_date);
	}
	//If entrants are provided, convert them to references to user documents if they are not already
	if (tournament.entrants) {
		const entrantRefs = await Promise.all(tournament.entrants.map(async (entrant) => {
			//Only convert entrant data to reference if it is not already a reference
			if (entrant.docId) {
				const entrantRef = await doc(db, "users", entrant.docId);
				return entrantRef;
			}
			return entrant;
		}));
		tournament.entrants = entrantRefs;
	}

	//Only update fields that are provided in the tournament object
	const newTournament = {...defaultTournament, ...tournament};
	const document = await addDoc(collection(db, "tournaments"), newTournament)
	console.log(`Added new tournament ${tournament.name}`)
	return document;

}

export const createBracket = async () => {
	const document = await addDoc(collection(db, "brackets"), bracket)
	console.log(`Added new bracket ${bracket.name}`)
	return document;
}

export const createMatch = async () => {
	const document = await addDoc(collection(db, "matches"), match)
	console.log(`Added new match ${match.name}`)
	return document;
}

export const updateUser = async () => {
	const { docId, ...updatedUserPrunedDocID } = updatedUser;
	const userRef = doc(db, "users", docId);
	await updateDoc(userRef, updatedUserPrunedDocID);
	console.log(`Updated user ${updatedUser.name}`);
}

export const updateTournament = async (tournament) => {
	const { docId, ...tournamentPrunedDocID } = tournament;
	//console.log(tournamentPrunedDocID);
	//Convert all entrant data back to references to user documents
	if (tournamentPrunedDocID.entrants) {
		const entrantRefs = await Promise.all(tournamentPrunedDocID.entrants.map(async (entrant) => {
			//Only convert entrant data to reference if it is not already a reference
			if (entrant.docId) {
				const entrantRef = await doc(db, "users", entrant.docId);
				return entrantRef;
			}
			return entrant;
		}));
		tournamentPrunedDocID.entrants = entrantRefs;
	}
	
	const tournamentRef = doc(db, "tournaments", docId);
	await updateDoc(tournamentRef, tournamentPrunedDocID);
	console.log(`Updated tournament ${tournament.name}`);
}

export const updateBracket = async () => {
	const { docId, ...updatedBracketPrunedDocID } = updatedBracket;
	const bracketRef = doc(db, "brackets", docId);
	await updateDoc(bracketRef, updatedBracketPrunedDocID);
	console.log(`Updated bracket ${updatedBracket.name}`);
}

export const updatematch = async () => {
	const { docId, ...updatedMatchPrunedDocID } = updatedMatch;
	const matchRef = doc(db, "matches", docId);
	await updateDoc(matchRef, updatedMatchPrunedDocID);
	console.log(`Updated match ${updatedMatch.name}`);
}