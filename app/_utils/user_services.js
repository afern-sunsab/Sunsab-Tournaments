import { updateTournament, getTournament, getUserRef, getUser } from "./firebase_services";
import {getObject, getObjects, createObject, updateObject} from "./firebase_services";

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