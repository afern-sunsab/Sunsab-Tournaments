import { updateTournament, getTournament, getUserRef, getUser } from "./firebase_services";
import {getObject, getObjects, createObject, updateObject} from "./firebase_services";


export const createUser = async (user) => {
	//Default user data structure
	const defaultUser = {
		username: "username",
		name: "name",
		email: "",
		uid: "",
		pronouns: "",
	};

	//Merge default data with provided data
	const newUser = { ...defaultUser, ...user };

	//Create the user document
	const document = await createObject("users", newUser);

	//Add the document ID to the user object
	newUser.docId = document.id;
	return newUser;
}

