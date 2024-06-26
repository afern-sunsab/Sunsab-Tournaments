"use client"
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { useState, useEffect } from "react";
import '../../styling/createEvent.css'

// Firebase
import { collection, addDoc, Timestamp, doc } from 'firebase/firestore';
import { db, rtdb } from "../../_utils/firebase";
import { ref, onValue } from 'firebase/database';
import CreateBracket from './CreateBrackets'
import SingleElimination from "./singleElimination";
// Date conversion function
const CreateAllEvent = () => {
  const [isOpenCreateBracket, setIsOpenCreateBracket] = useState(false);
  const [isOpenCreateTournament, setIsOpenCreateTournament] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    name: "",
    description: "",
    entrant_limit: 0,
    event_date: "",
    game: "",
    close_date: "",
    completed: false,
    bracketId: null,
  });
  const [bracketData, setBracketData] = useState([]); // State to store fetched bracket data

  // Function to fetch bracket data from Firebase
  const fetchBracketData = (bracketId) => {
    const bracketRef = ref(rtdb, `brackets/${bracketId}/matches`);

    onValue(bracketRef, (snapshot) => {
      const matchesData = snapshot.val();
      if (matchesData) {
        const matchesArray = Object.keys(matchesData).map(key => {
          const matchData = matchesData[key];
          return {
            id: matchData.id || '',
            name: matchData.name || '',
            nextMatchId: matchData.nextMatchId || null,
            nextLooserMatchId: matchData.nextLooserMatchId || null,
            tournamentRoundText: matchData.tournamentRoundText || '',
            startTime: matchData.startTime || '',
            state: matchData.state || '',
            participants: matchData.participants || [{}, {}],
          };
        });

        // Sort matches by tournamentRoundText (assuming tournamentRoundText is a number)
        matchesArray.sort((a, b) => parseInt(a.tournamentRoundText) - parseInt(b.tournamentRoundText));

        console.log("Transformed Matches Array:", matchesArray);
        setBracketData(matchesArray);
      } else {
        console.log("No matches found for bracket:", bracketId);
      }
    }, {
      onlyOnce: true
    });
  };

  // Effect to fetch bracket data once bracketId changes
  useEffect(() => {
    if (eventDetails.bracketId) {
      fetchBracketData(eventDetails.bracketId);
    }
  }, [eventDetails.bracketId]);

  const handleBracketCreated = (bracketId) => {
    console.log("Bracket created with ID:", bracketId);
    setEventDetails((prevState) => ({
      ...prevState,
      bracketId: bracketId,
    }));
    setIsOpenCreateBracket(false);
    setIsOpenCreateTournament(true);
    alert(
      "Bracket created successfully! You can now proceed to create a tournament."
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventDetails.bracketId) {
      alert("Please create a bracket first.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "tournaments"), {
        name: eventDetails.name,
        description: eventDetails.description,
        entrant_limit: parseInt(eventDetails.entrant_limit),
        event_date: eventDetails.event_date,
        game: eventDetails.game,
        close_date: eventDetails.close_date,
        completed: eventDetails.completed,
        bracketId: eventDetails.bracketId,
      });
      console.log("Tournament document written with ID: ", docRef.id);
      alert("Event added successfully!");
      setEventDetails({
        name: "",
        description: "",
        entrant_limit: 0,
        event_date: "",
        game: "",
        close_date: "",
        completed: false,
        bracketId: null,
      });
      setIsOpenCreateTournament(false);
    } catch (error) {
      console.error("Error adding tournament document: ", error);
      alert("Error adding event. Please try again.");
    }
  };


  return (
    <div className="layoutCustom">
      <button
        onClick={() => setIsOpenCreateBracket(true)}
        className="my-custom-button"
      >
        Create event
      </button>
      <AnimatePresence>
        <CreateBracket
          isOpen={isOpenCreateBracket}
          setIsOpen={setIsOpenCreateBracket}
          onBracketCreated={handleBracketCreated}
        />
      </AnimatePresence>
      <AnimatePresence>
        {/* Modal for creating a tournament */}
        {isOpenCreateTournament && (
          <motion.div
            key="createTournamentModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                  Create Tournament
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="my-custom-input">
                    <input
                      type="text"
                      name="name"
                      value={eventDetails.name}
                      onChange={e => setEventDetails({ ...eventDetails, name: e.target.value })}
                      placeholder="Tournament Name"
                      required
                    />
                  </div>
                  <div className="my-custom-input">
                    <textarea
                      name="description"
                      value={eventDetails.description}
                      onChange={e => setEventDetails({ ...eventDetails, description: e.target.value })}
                      placeholder="Tournament Description"
                      required
                    ></textarea>
                  </div>
                  <div className="my-custom-input">
                    <input
                      type="number"
                      name="entrant_limit"
                      value={eventDetails.entrant_limit}
                      onChange={e => setEventDetails({ ...eventDetails, entrant_limit: e.target.value })}
                      placeholder="Entrant Limit"
                      required
                    />
                  </div>
                  <div className="my-custom-input">
                    <input
                      type="datetime-local"
                      name="event_date"
                      value={eventDetails.event_date}
                      onChange={e => setEventDetails({ ...eventDetails, event_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="my-custom-input">
                    <input
                      type="text"
                      name="game"
                      value={eventDetails.game}
                      onChange={e => setEventDetails({ ...eventDetails, game: e.target.value })}
                      placeholder="Game"
                      required
                    />
                  </div>
                  <div className="my-custom-input">
                    <input
                      type="datetime-local"
                      name="close_date"
                      value={eventDetails.close_date}
                      onChange={e => setEventDetails({ ...eventDetails, close_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="my-custom-input">
                    <label className="flex">
                      Completed
                      <input
                        type="checkbox"
                        name="completed"
                        checked={eventDetails.completed}
                        onChange={() => setEventDetails(prevState => ({
                          ...prevState,
                          completed: !prevState.completed
                        }))}
                      />
                    </label>
                  </div>
                  <div className="my-flex-container">
                    <button type="submit" className="my-exit">
                      Create Event
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <SingleElimination bracketData={bracketData} />
    </div>
  );
};

export default CreateAllEvent;