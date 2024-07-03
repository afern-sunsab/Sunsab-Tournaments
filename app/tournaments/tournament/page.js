"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTournaments, getUser, getUserRef } from '@app/_utils/firebase_services';
import { useUserAuth } from '@/app/_utils/auth-context.js';
import { joinTournament, leaveTournament } from '@/app/_utils/tournament_services';


function Tournament() {
  const { id } = useParams();
  const [object, setObject] = useState(null);

  const [tournaments, setTournaments] = useState([]);
  const [users, setUsers] = useState(null);
  const { user } = useUserAuth();


  useEffect(() => {
    const fetchTournaments = async () => {
      const data = await getTournaments();
      setTournaments(data);
    };
    fetchTournaments();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUser(user.uid);
      setUsers(data);
    };
    if (user) fetchUsers();
  }, [user]);


  useEffect(() => {
    const fetchObject = async () => {
      try {
        const docRef = doc(db, 'tournament', id);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          setObject(docSnapshot.data());
        } else {
          console.log('Object not found');
        }
      } catch (error) {
        console.error('Error fetching object:', error);
      }
    };
    fetchObject();
  }, [id, db]);

  if (!object) return <div>Loading...</div>;

  // Now you can use the object data to render the child page
  if (!object) return <div>Loading...</div>;
  return (
    <div>
      <h1>{tournaments.id}</h1>
      {<div key={tournament.docId} className="border rounded-md p-4 mb-4">
            <h2 className="text-xl font-bold">Name: {tournament.name}</h2>
            <p className="text-lg">Game: {tournament.game}</p>
            <p className="mb-2">Description: {tournament.description}</p>
            <p className="mb-2">Entrants:</p>
            <ul>
              {tournament.entrants ? (
                <div>
                  {tournament.entrants.map((entrant, index) => (
                    <li key={index}>
                      <p className="text-sm">
                        <button
                          onClick={() => handleLeave(tournament, entrant)}
                          className="bg-blue-500 hover:bg-blue-700 text-red-400 font-bold px-1 rounded mt-2 mr-2"
                        >
                          X
                        </button>
                        Name: {entrant.username} ({entrant.name})
                      </p>
                    </li>
                  ))}
                </div>
              ) : (
                <p>No Entrants</p>
              )}
            </ul>
           
          </div>}
    </div>
  );
}

export default Tournament;