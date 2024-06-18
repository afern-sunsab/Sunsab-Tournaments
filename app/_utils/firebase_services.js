"use client"

import { collection, doc, getDocs, updateDoc, addDoc, query, where, Timestamp } from "firebase/firestore";
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
	const document = await getDocs(query(collection(db, users), where("uid", "==", uid)));
	const object = document.docs.map(doc => ({ docId: doc.id, ...doc.data()}))[0];
	console.log(`Fetched user ${object.name} with these attributes${object}`);
	return object;
}

export const getTournaments = async () => {
	const documents = await getDocs(collection(db, "tournaments"));
    const data = documents.docs.map((doc) => ({docId: doc.id, ...doc.data(),}));
    console.log("Fetched tournaments")
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

export const createTournament = async () => {

}

export const createBracket = async () => {

}

export const createMatch = async () => {

}

export const updateUser = async () => {
	const { docId, ...updatedUserPrunedDocID } = updatedUser;
	const userRef = doc(db, "users", docId);
	await updateDoc(userRef, updatedUserPrunedDocID);
	console.log(`Updated user ${updatedUser.name}`);
}

export const updateTournament = async (tournament) => {
	const { docId, ...tournamentPrunedDocID } = tournament;
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