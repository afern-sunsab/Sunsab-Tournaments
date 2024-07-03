//import { updateTournament, getTournament, getUserRefs, getUser } from "./firebase_services";
import { get } from "firebase/database";
import {getObject, getObjects, createObject, updateObject, createRef, getUserRefs} from "./firebase_services";

const defaultTournament = {
	name: "New Tournament",
	game: "Game",
	description: "Description",
	entrant_limit: 0,
	close_date: new Date(),
	event_date: new Date(),
	entrants: [], //Array of user references
	brackets: [], //Array of bracket references
	completed: false
}

export const createTournament = async (tournament) => {
	//Merge default data with provided data
	const newTournament = { ...defaultTournament, ...tournament };

	//Create the tournament document
	const document = await createObject("tournaments", newTournament);

	//Add the document ID to the tournament object
	newTournament.docId = document.id;
	return newTournament;
}

export const updateTournament = async (tournament) => {
	//const { docId, ...tournamentPrunedDocID } = tournament;

	//Merge default data with provided data, in case structure has changed
	//const updatedTournament = { ...defaultTournament, ...tournamentPrunedDocID };
	const updatedTournament = { ...defaultTournament, ...tournament };

	//Convert entrants array to array of user references
	updatedTournament.entrants = await getUserRefs(updatedTournament.entrants);
	await updateObject("tournaments", updatedTournament);
}

//Adds a user to the entrants array of a tournament
//"tournament" is a JavaScript object representing a tournament document
//"user" is a JavaScript object representing a user document
//Returns the updated tournament object
export const joinTournament = async (tournament, user) => {
	//If tournament somehow lacks entrants field, add it
	if (!tournament.entrants) {
		tournament.entrants = [];
	}

	//Check if user is already an entrant
	const entrantIndex = tournament.entrants.findIndex(entrant => entrant.uid === user.uid);
	if (entrantIndex === -1) {
		tournament.entrants.push(user);
		await updateTournament(tournament);
		console.log(`User ${user.docId} joined tournament ${tournament.name}`);
	} else {
		console.log(`User ${user.docId} is already an entrant in tournament ${tournament.name}`);
	}
	return tournament;
}

export const leaveTournament = async (tournament, user) => {
	//If tournament somehow lacks entrants field, add it
	if (!tournament.entrants) {
		tournament.entrants = [];
	}

	//Check if user is already an entrant
	const entrantIndex = tournament.entrants.findIndex(entrant => entrant.uid === user.uid);
	if (entrantIndex !== -1) {
		tournament.entrants.splice(entrantIndex, 1);
		await updateTournament(tournament);
		console.log(`User ${user.id} left tournament ${tournament.name}`);
	} else {
		console.log(`User ${user.id} is not an entrant in tournament ${tournament.name}`);
	}
	return tournament;
}