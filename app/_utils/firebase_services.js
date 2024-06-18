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

}

export const getBrackets = async () => {

}

export const getBracket = async (id) => {

}

export const getMatches = async () => {

}

export const getMatch = async (id) => {

}

export const createTournament = async () => {

}

export const createBracket = async () => {

}

export const createMatch = async () => {

}

export const updateUser = async () => {

}

export const updateTournament = async () => {

}

export const updateBracket = async () => {

}

export const updatematch = async () => {

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