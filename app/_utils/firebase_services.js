"use client"

import { collection, doc,getDoc, getDocs, updateDoc, addDoc, query, where, Timestamp } from "firebase/firestore";
import { db } from "../_utils/firebase";

export const getObjects = async (type) => {
	const documents = await getDocs(collection(db, type));
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
	alert(`Added new ${type} object`)
	return document;
}

export const updateObject = async (type, updatedObject, confirm) => {
	const { docId, ...updatedObjectPrunedDocID } = updatedObject;
	const objectRef = doc(db, type, docId);
	await updateDoc(objectRef, updatedObjectPrunedDocID);
	if (confirm) {
		alert(`Updated ${type} object`);
	}
}

export const getUser = async (uid) => {
	const document = await getDocs(query(collection(db, "users"), where("uid", "==", uid)));
	const object = document.docs.map(doc => ({ docId: doc.id, ...doc.data()}))[0];
	console.log(`Fetched user ${object.name} with these attributes${object}`);
	console.log(object);
	return object;
}

//Function to get reference to user document
export const getUserRef = async (uid) => {
	const document = await getDocs(query(collection(db, "users"), where("uid", "==", uid)));
	const userRef = doc(db, "users", document.docs[0].id);
	console.log(`Fetched user reference ${userRef}`);
	return userRef;
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

export const getTournament = async (id) => {
	const document = await getDocs(query(collection(db, "tournaments"), where("id", "==", id)));
	const tournament = document.docs.map(doc => ({ docId: doc.id, ...doc.data() }))[0];
	console.log(`Fetched tournament ${tournament.name}`)
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

export const createTournament = async (tournament) => {
	const document = await addDoc(collection(db, "tournaments"), tournament)
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

export const dateToTimestamp = (value) => {
	const date = new Date(value);
	const timestamp = Timestamp.fromDate(date);
	console.log(`Converted date ${date} to timestamp ${timestamp}`)
	return timestamp;
}

export const timestampToDate = (timestamp) => {
	const date = new Date(timestamp.toDate()).toISOString().split('T')[0];
	console.log(`Converted timestamp ${timestamp} to date ${date}`);
	return date;
}