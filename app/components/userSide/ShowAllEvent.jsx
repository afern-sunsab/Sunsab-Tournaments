"use client"
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { useState, useEffect } from "react";
import '../../styling/createEvent.css'
import { timestampToDate } from "../../_utils/firebase_services";

// Firebase
import { doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from "@utils/firebase";
import { auth } from '@utils/firebase';

const ShowAllEvent = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tournaments'));
        const tournamentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTournaments(tournamentsData);
      } catch (error) {
        console.error('Error fetching tournaments: ', error);
      }
    };

    if (isOpen) {
      fetchTournaments();
    }
  }, [isOpen]);

  
  return (
    <div className="layoutCustom">
      <button onClick={() => setIsOpen(true)} className="my-custom-button">
        Show All Events
      </button>
      <ShowEvent isOpen={isOpen} setIsOpen={setIsOpen} tournaments={tournaments} user={user} /> {/* Pass user to ShowEvent */}
    </div>
  );
};


const ShowEvent = ({ isOpen, setIsOpen, tournaments, user }) => {
  const handleCloseModal = () => {
    setIsOpen(false);
  };
 
  const handleJoinEvent = async (tournamentId, user) => {
    try {
      if (!user || !user.uid) {
        throw new Error('User not authenticated');
      }
  
      // Fetch logged-in user document reference
      const userRef = doc(db, 'users', user.uid);
      console.log(user.uid);
      
      // Fetch the current tournament document
      const tournamentRef = doc(db, 'tournaments', tournamentId);
      const tournamentDoc = await getDoc(tournamentRef);
      if (!tournamentDoc.exists()) {
        throw new Error('Tournament not found');
      }
  
      // Ensure tournamentData.entrants is an array
      const currentEntrants = tournamentDoc.data().entrants ?? [];
  
      // Check if user already exists in entrants list
      if (currentEntrants.includes(userRef)) {
        throw new Error('You are already a participant in this tournament.');
      }
  
      // Example of updating document with user reference
      await updateDoc(tournamentRef, {
        entrants: [...currentEntrants, userRef]
      });
  
      alert('Successfully joined the tournament!');
    } catch (error) {
      console.error('Error joining tournament:', error);
      alert('Failed to join the tournament. Please try again later.');
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
          className="my-custom-overlay"
        >
          <motion.div
            initial={{ scale: 0, rotate: '12.5deg' }}
            animate={{ scale: 1, rotate: '0deg' }}
            exit={{ scale: 0, rotate: '0deg' }}
            onClick={(e) => e.stopPropagation()}
            className="my-custom-card"
          >
            <FiAlertCircle className="my-custom-text" />
            <div className="relative z-10">
              <h3 className="my-custom-text1">Tournaments List</h3>
              <div className="my-custom-list">
                {tournaments.map((tournament) => (
                  <div key={tournament.id} className="my-custom-item pb-4">
                    <h4 className="text-xl text-black">
                      TournamentName: {tournament.name}
                    </h4>
                    <p>TournamentDescription: {tournament.description}</p>
                    <p>Close Date: {timestampToDate(tournament.close_date)}</p>
                    <p>Event Date: {timestampToDate(tournament.event_date)}</p>
                    <p>Game: {tournament.game}</p>
                    <p>Entrant Limit: {tournament.entrant_limit}</p>
                    <p>Completed: {tournament.completed ? 'Yes' : 'No'}</p>
                    
                    <button
                      onClick={() => handleJoinEvent(tournament.id, user)}
                      className="my-join-button"
                    >
                      Join Tournament
                    </button>
                    
                  </div>
                ))}
              </div>
              <button type="button" onClick={handleCloseModal} className="my-exit">
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShowAllEvent;