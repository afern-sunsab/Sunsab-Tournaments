import {getObject, getObjectByDocID, getObjects, createObject, updateObject, createRef, objectsToRefs, refsToObjects, getHighestID} from "./firebase_services";

export const defaultTournament = {
	id: 0,
	name: "",
	description: "",
	game: "",
	entrant_limit: 0,
	entrants: [],
	brackets: [],
	close_date: Date.now(),
	event_date: Date.now(),
	completed: false,
	owner: null,
	admins: [],
	thumbnail: ""
}

export const getTournamentByDocId = async (docId) => {
	const tournament = await getObjectByDocID("tournaments", docId);
	//Add returned data to default data structure
	const returnTournament = { ...defaultTournament, ...tournament };

	//Quick test: Output Entrant refs
	//I want to get the collection name of the first entrant
	//console.log("Entrants:");
	//console.log(returnTournament.entrants[0].path.split("/")[0]);

	//Convert entrants array to array of user objects
	returnTournament.entrants = await refsToObjects(returnTournament.entrants);

	return returnTournament;
}

export const getAllTournaments = async (queryData = null) => {
	const tournaments = await getObjects("tournaments", queryData);

	//Convert entrants array to array of user objects
	for (let i = 0; i < tournaments.length; i++) {
		tournaments[i].entrants = await refsToObjects(tournaments[i].entrants);
	}
	return tournaments;
}

export const createTournament = async (tournament) => {
	//Merge default data with provided data
	const newTournament = { ...defaultTournament, ...tournament };

	//Get the ID number for the new tournament
	newTournament.id = await getHighestID("tournaments") + 1;

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

	//If the document lacks an ID number, get the highest ID number and increment it
	if (updatedTournament.id <= 0) {
		updatedTournament.id = await getHighestID("tournaments") + 1;
	}

	//Convert entrants array to array of user references
	updatedTournament.entrants = await objectsToRefs(updatedTournament.entrants, "users");
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