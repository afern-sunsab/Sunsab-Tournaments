import { getObject, getObjectByDocID, objectsToRefs } from "./firebase_services";
import {getObjects, createObject, updateObject, getHighestID} from "./firebase_services";

//Default user data structure
const defaultUser = {
	username: "username",
	name: "name",
	email: "",
	uid: "",
	pronouns: "",
};

export const getUserByDocId = async (docId) => {
	const user = await getObjectByDocID("users", docId);
	//Add returned data to default data structure
	const returnUser = { ...defaultUser, ...user };
	return returnUser;
}

//Try not to actually get all the users, it's a lot of data
export const getAllUsers = async (queryData = null) => {
	const users = await getObjects("users", queryData);
	return users;
}

export const createUser = async (user) => {
	
	//Merge default data with provided data
	const newUser = { ...defaultUser, ...user };

	//Create an ID for the new user
	newUser.id = await getHighestID("users") + 1;

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

	//If user's id number is 0, create a new id number
	if (updatedUser.id <= 0) {
		updatedUser.id = await getHighestID("users") + 1;
	}

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
	const userRef = await objectsToRefs(user, "users");
	const queryData = ["entrants", "array-contains", userRef];
	const tournaments = await getObjects("tournaments", queryData);
	console.log("Got user tournaments.")
	console.log(tournaments);
	return tournaments;
}