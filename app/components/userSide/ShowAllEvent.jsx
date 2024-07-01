"use client"
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { useState, useEffect } from "react";
import '../../styling/createEvent.css'
import { timestampToDate } from "../_utils/firebase_services";

// Firebase
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../../_utils/firebase";

const ShowAllEvent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tournaments'));
        const tournamentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
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
      <button
        onClick={() => setIsOpen(true)}
        className="my-custom-button"
      >
        Show All Events
      </button>
      <ShowEvent isOpen={isOpen} setIsOpen={setIsOpen} tournaments={tournaments} />
    </div>
  );
};

const ShowEvent = ({ isOpen, setIsOpen, tournaments }) => {
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const formatDate = (timestamp) => {
    const date = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date
    return date.toLocaleString(); // Format date as needed
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
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="my-custom-card"
          >
            <FiAlertCircle className="my-custom-text" />
            <div className="relative z-10">
              <h3 className="my-custom-text1">
                Tournaments List
              </h3>
              <div className="my-custom-list">
                {tournaments.map(tournament => (
                  <div key={tournament.id} className="my-custom-item pb-4">
                    <h4 className="text-xl text-black">TournamentName: {tournament.name}</h4>
                    <p>TournamentDescription: {tournament.description}</p>
                    <p>Close Date: {timestampToDate(tournament.close_date)}</p>
                    <p>Event Date: {timestampToDate(tournament.event_date)}</p>
                    <p>Game: {tournament.game}</p>
                    <p>Entrant Limit: {tournament.entrant_limit}</p>
                    <p>Completed: {tournament.completed ? 'Yes' : 'No'}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="my-exit"
              >
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