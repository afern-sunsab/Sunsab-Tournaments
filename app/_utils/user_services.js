import { doc, getDoc, query } from "firebase/firestore";
import { updateTournament, getTournament, getUserRefs } from "./firebase_services";
import {getObjectByDocID, getObjects, createObject, updateObject} from "./firebase_services";
//Kind of dumb import to pass query to getObjects
import { where } from "firebase/database";
import { db } from "./firebase";

//Default user data structure
const defaultUser = {
	username: "username",
	name: "name",
	email: "",
	uid: "",
	pronouns: "",
};

export const createUser = async (user) => {
	
	//Merge default data with provided data
	const newUser = { ...defaultUser, ...user };

	//Create the user document
	const document = await createObject("users", newUser);

	//Add the document ID to the user object
	newUser.docId = document.id;
	return newUser;
}

export const updateUser = async (user) => {
	//const { docId, ...userPrunedDocID } = user;

	//Merge default data with provided data, in case structure has changed
	const updatedUser = { ...defaultUser, ...user };
	await updateObject("users", updatedUser);
}

//"getUser" is already defined in firebase_services.js and is used to get a user document by its uid
//This function is used to get a user document by its docId
export const getUserData = async (docId) => {
	const userData = await getObjectByDocID("users", docId);
	const user = { ...defaultUser, docId, ...userData };
	return user;
}

//Searches for all tournaments where a specified user is in the entrants array
//Returns an array of tournament objects
export const getUserTournaments = async (user) => {
	const userRef = await getUserRefs(user);
	const queryData = ["entrants", "array-contains", userRef];
	const tournaments = await getObjects("tournaments", queryData);
	console.log("Got user tournaments.")
	console.log(tournaments);
	return tournaments;
}