"use client"
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { useState } from "react";
import '../styling/createEvent.css'

// Firebase
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from "../_utils/firebase";

// Date conversion function
const dateToTimestamp = (value) => {
  const date = new Date(value);
  return Timestamp.fromDate(date);
}

const CreateAllEvent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="layoutCustom">
      <button
        onClick={() => setIsOpen(true)}
        className="my-custom-button"
      >
        Create Event
      </button>
      <CreateEvent isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

const CreateEvent = ({ isOpen, setIsOpen }) => {
  const [eventDetails, setEventDetails] = useState({
    name: '',
    description: '',
    entrant_limit: 0,
    event_date: '',
    game: '',
    close_date: '',
    completed: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for date fields to convert to Timestamp
    if (name === 'event_date' || name === 'close_date') {
      setEventDetails((prevState) => ({
        ...prevState,
        [name]: value,
        // Apply dateToTimestamp conversion
        [name + '_timestamp']: dateToTimestamp(value)
      }));
    } else {
      setEventDetails((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, 'tournaments'), {
        name: eventDetails.name,
        description: eventDetails.description,
        entrant_limit: parseInt(eventDetails.entrant_limit), // Convert to number
        event_date: eventDetails.event_date_timestamp || dateToTimestamp(eventDetails.event_date), // Convert to Firestore timestamp
        game: eventDetails.game,
        close_date: eventDetails.close_date_timestamp || dateToTimestamp(eventDetails.close_date), // Convert to Firestore timestamp
        completed: eventDetails.completed
      });
      console.log('Document written with ID: ', docRef.id);
      alert('Event added successfully!');
      setIsOpen(false); // Close modal after adding event
      // Reset form
      setEventDetails({
        name: '',
        description: '',
        entrant_limit: 0,
        event_date: '',
        game: '',
        close_date: '',
        completed: false
      });
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error adding event. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
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
                Create Event
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="my-custom-input">
                  <input
                    type="text"
                    name="name"
                    value={eventDetails.name}
                    onChange={handleChange}
                    placeholder="Tournaments Name"
                    required
                  />
                </div>
                <div className="my-custom-input">
                  <textarea
                    name="description"
                    value={eventDetails.description}
                    onChange={handleChange}
                    placeholder="Tournaments Description"
                    required
                  ></textarea>
                </div>
                <div className="my-custom-input">
                  <input
                    type="number"
                    name="entrant_limit"
                    value={eventDetails.entrant_limit}
                    onChange={handleChange}
                    placeholder="Entrant Limit"
                    required
                  />
                </div>
                <div className="my-custom-input">
                  <input
                    type="datetime-local"
                    name="event_date"
                    value={eventDetails.event_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="my-custom-input">
                  <input
                    type="text"
                    name="game"
                    value={eventDetails.game}
                    onChange={handleChange}
                    placeholder="Game"
                    required
                  />
                </div>
                <div className="my-custom-input">
                  <input
                    type="datetime-local"
                    name="close_date"
                    value={eventDetails.close_date}
                    onChange={handleChange}
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
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="my-exit"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateAllEvent;