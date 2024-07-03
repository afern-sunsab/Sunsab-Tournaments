import { query } from "firebase/firestore";
import { updateTournament, getTournament, getUserRefs, getUser } from "./firebase_services";
import {getObject, getObjects, createObject, updateObject} from "./firebase_services";
//Kind of dumb import to pass query to getObjects
import { where } from "firebase/database";

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
	const { docId, ...userPrunedDocID } = user;

	//Merge default data with provided data, in case structure has changed
	const updatedUser = { ...defaultUser, ...userPrunedDocID };
	await updateObject("users", updatedUser);
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