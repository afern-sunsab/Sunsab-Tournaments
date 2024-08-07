"use client"
//NOTE: Avoid using functions from this file aside from get/create/updateObject functions, getUserRef, and dateToTimestamp/timestampToDate
//Preference goes to functions in user/bracket/tournament_services, which will be more modular and easier to use
import { collection, doc,getDoc, getDocs, updateDoc, addDoc, query, where, Timestamp, orderBy, limit } from "firebase/firestore";
import { db } from "../_utils/firebase";

//Basic Firestore functions, use these with other services. Try to avoid using these directly in components
//Optionally, queries can be passed to getObjects to filter results
//Query data should be an array with the following format: [field, operator, value]
//Example: ["name", "==", "John Doe"]
//Example: ["age", ">", 21]
export const getObjects = async (type, queryData = null) => {
	
	let documents = [];
	if (queryData) 
		documents = await getDocs(query(collection(db, type), where(queryData[0], queryData[1], queryData[2])));
	else
		documents = await getDocs(collection(db, type));
	const data = documents.docs.map((doc) => ({docId: doc.id, ...doc.data(),}));
	//console.log(`Fetched ${type} objects`)
	return data;
}

export const getObject = async (type, id) => {
	const document = await getDocs(query(collection(db, type), where("id", "==", id)));
	const object = document.docs.map(doc => ({ docId: doc.id, ...doc.data() }))[0];
	//console.log(`Fetched ${type} object`)
	//console.log(object);
	return object;
}

export const getObjectByDocID = async (type, docId) => {
	const document = await getDoc(doc(db, type, docId));
	const object = {docId: docId, ...document.data()};
	//console.log(`Fetched ${type} object`)
	//console.log(object);
	return object;
};

export const createObject = async (type, object) => {
	const document = await addDoc(collection(db, type), object)
	const objectData = {docId: document.id, ...object};
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
	//console.log(`Converted date ${date} to timestamp ${timestamp}`)
	return timestamp;
}

//Function to convert Firestore timestamp to Javascript date
export const timestampToDate = (timestamp) => {
	//if timestamp is a string, just return it & yell at whoever entered a string into a timestamp field
	if (typeof timestamp === 'string') {
		//console.log(`Timestamp is a string, returning it as is: ${timestamp}`);
		return timestamp;
	}
	const date = new Date(timestamp.toDate()).toISOString().split('T')[0];
	//console.log(`Converted timestamp ${timestamp} to date ${date}`);
	return date;
}

//Function to convert object or array of objects to document references
export const objectsToRefs = async (obj, type) => {
	if (Array.isArray(obj)) {
		//Only convert entrant data to reference if it is not already a reference
		const objRefs = await Promise.all(obj.map(async (obj) => {
			if (obj.docId) {
				const objRef = await doc(db, type, obj.docId);
				return objRef;
			} //If obj is a string, it's probably a docId
			else if (typeof obj === 'string') {
				const objRef = await doc(db, type, obj);
				return objRef;
			}
			return obj;
		}));
		return objRefs;
	}
	else if (obj.docId)
		return await doc(db, type, obj.docId);
	return obj;
}

//Function to convert a document reference or list of references to objects
export const refsToObjects = async (ref) => {
	if (Array.isArray(ref)) {
		//Only convert entrant data to object if it is not already an object
		const refObjects = await Promise.all(ref.map(async (ref) => {
			if (!ref.docId) {
				const refDoc = await getDoc(ref);
				const refData = {docId: refDoc.id, ...refDoc.data()};
				return refData;
			}
			return ref;
		}));
		return refObjects;
	}
	else if (!ref.docId) {
		const refDoc = await getDoc(ref);
		const refData = {docId: refDoc.id, ...refDoc.data()};
		return refData;
	}
	return ref;
}

//Little stock function to pull docID if passed a document
export const parseDocID = (doc) => {
	if (typeof doc === "object")
	{
		//If there's no docId, play it safe and return null
		if (!doc.docId)
			return null;
		return doc.docId;
	}
	return doc;
}

//Sort of still-used function to get a user document from the database
//Uses the uid from Firebase Auth to find the user document
export const getUser = async (uid) => {
	//console.log(`Fetching user ${uid}`);
	const document = await getDocs(query(collection(db, "users"), where("uid", "==", uid)));
	const object = document.docs.map(doc => ({ docId: doc.id, ...doc.data()}))[0];
	//console.log(`Fetched user ${object.name} with these attributes${object}`);
	//console.log(object);
	return object;
}

//Gets the highest ID number from a given collection
//Takes in a string for the collection name
//Returns the highest ID number + 1
export const getHighestID = async (type) => {
	//Cool hack to retrieve the document with the highest ID
	//Queries Firestore for the data sorted by id in descending order, and only retrieves the first document
	//const documents = await getDocs(query(collection(db, type).orderBy("id", "desc").limit(1)));
	const documents = await getDocs(query(collection(db, type), orderBy("id", "desc"), limit(1)));
	let newid = 0;
	if (documents.docs.length > 0 && documents.docs[0].data().id) {
		newid = documents.docs[0].data().id;
	}
	console.log(`Highest ID in ${type} is ${newid}`);
	return newid;
}


//----------------
//Deprecated functions
//These interact directly with the database, but only functions in services will be maintained and updated

//Function to get all users from the database
//Just for testing purposes, don't actually use this
export const getUsers = async () => {
	const documents = await getDocs(collection(db, "users"));
	const data = documents.docs.map((doc) => ({docId: doc.id, ...doc.data(),}));
	//console.log("Fetched users")
	return data;
}

//Function to get reference to user document
//Technically not necessary, but it's here for consistency
//objectsToRefs is the preferred function to use
export const getUserRef = async (uid) => {
	const document = await getDocs(query(collection(db, "users"), where("uid", "==", uid)));
	const userRef = doc(db, "users", document.docs[0].id);
	//console.log(`Fetched user reference ${userRef}`);
	return userRef;
}

//Creates a reference to a document in the database
//type: the type of document
//id: the id (docId) of the document
//Supposedly doesn't make a request to the database, but I don't know if that's true
export function createRef(type, id) {
	//console.log(`Creating reference to ${type} document with ID ${id}`);
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

    //console.log("Fetched tournaments")
	//console.log(data);
    return data;
}

export const getTournament = async (id) => {
	const tournament = {docId: id, ...(await getDoc(doc(db, 'tournaments', id))).data()}
	return tournament;
}

export const getBrackets = async () => {
	const documents = await getDocs(collection(db, "brackets"));
	const data = documents.docs.map((doc) => ({docId: doc.id, ...doc.data(),}));
	//console.log("Fetched brackets")
	return data;
}

export const getBracket = async (id) => {
	const document = await getDocs(query(collection(db, "brackets"), where("id", "==", id)));
	const bracket = document.docs.map(doc => ({ docId: doc.id, ...doc.data() }))[0];
	//console.log(`Fetched bracket ${bracket.name}`)
	return bracket;
}

export const getMatches = async () => {
	const documents = await getDocs(collection(db, "matches"));
	const data = documents.docs.map((doc) => ({docId: doc.id, ...doc.data(),}));
	//console.log("Fetched matches")
	return data;
}

export const getMatch = async (id) => {
	const document = await getDocs(query(collection(db, "matches"), where("id", "==", id)));
	const match = document.docs.map(doc => ({ docId: doc.id, ...doc.data() }))[0];
	//console.log(`Fetched match ${match.name}`)
	return match;
}

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
	//console.log(`Added new tournament ${tournament.name}`)
	return document;

}

export const createBracket = async () => {
	const document = await addDoc(collection(db, "brackets"), bracket)
	//console.log(`Added new bracket ${bracket.name}`)
	return document;
}

export const createMatch = async () => {
	const document = await addDoc(collection(db, "matches"), match)
	//console.log(`Added new match ${match.name}`)
	return document;
}

export const updateUser = async () => {
	const { docId, ...updatedUserPrunedDocID } = updatedUser;
	const userRef = doc(db, "users", docId);
	await updateDoc(userRef, updatedUserPrunedDocID);
	//console.log(`Updated user ${updatedUser.name}`);
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
	//console.log(`Updated tournament ${tournament.name}`);
}

export const updateBracket = async () => {
	const { docId, ...updatedBracketPrunedDocID } = updatedBracket;
	const bracketRef = doc(db, "brackets", docId);
	await updateDoc(bracketRef, updatedBracketPrunedDocID);
	//console.log(`Updated bracket ${updatedBracket.name}`);
}

export const updatematch = async () => {
	const { docId, ...updatedMatchPrunedDocID } = updatedMatch;
	const matchRef = doc(db, "matches", docId);
	await updateDoc(matchRef, updatedMatchPrunedDocID);
	//console.log(`Updated match ${updatedMatch.name}`);
}