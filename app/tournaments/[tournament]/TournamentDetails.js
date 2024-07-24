import { useUserAuth } from "@utils/auth-context";
import { timestampToDate } from "@utils/firebase_services";
import { joinTournament, leaveTournament } from "@utils/tournament_services";
import Image from "next/image";
import Calendar from "../../../public/icons/Calendar.svg";
import GameType from "../../../public/icons/GameType.svg";
import Participants from "../../../public/icons/Participants-EventPage.svg";
import RegistrationLimit from "../../../public/icons/RegistrationLimit.svg";
import TournamentDescription from "./TournamentDescription";

export default function TournamentDetails({ tournament }) {
  const { user } = useUserAuth();

  const handleJoin = async () => {
    await joinTournament(tournament, user);
  };

  const handleLeave = async () => {
    await leaveTournament(tournament, user);
  };

  return (
    <div className="p-4 mb-4 flex flex-row-reverse items-start">
      <div className="relative h-40 w-40 flex-shrink-0 ml-4 border-2 border-black">
        {tournament.thumbnail ? (
          <img
            src={tournament.thumbnail}
            alt={`Thumbnail for ${tournament.name}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src="/Placeholder.png"
            alt="Default Thumbnail"
            className="h-full w-full object-cover"
          />
        )}
        {user ? (
          <>
            {tournament.entrants && tournament.entrants.some((ref) => ref.id === user.docId) ? (
              <button
                className="mt-2 bg-black text-white font-bold py-2 px-4 rounded hover:bg-yellow-400"
                onClick={handleLeave}
              >
                Leave
              </button>
            ) : (
              <button
                className="mt-2 bg-black text-white font-bold py-2 px-4 rounded hover:bg-yellow-400"
                onClick={handleJoin}
              >
                Join
              </button>
            )}
          </>
        ) : (
          <p className="mt-4">Log in to join this tournament</p>
        )}
      </div>
      <div className="flex-1">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">{tournament.name}</h1>
        <div className="flex items-center mb-2">
          <Image
            src={GameType}
            alt="GameType Icon"
            width={20}
            height={20}
            className="mr-2"
          />
          <span className="text-lg mb-2">Game: {tournament.game}</span>
        </div>
        <div className="flex items-center mb-2">
          <Image
            src={Participants}
            alt="Participants Icon"
            width={20}
            height={20}
            className="mr-2"
          />
          <span className="text-lg mb-2">Entrant Limit: {tournament.entrant_limit}</span>
        </div>
        <div className="flex items-center mb-2">
          <Image
            src={RegistrationLimit}
            alt="Registration Limit Icon"
            width={20}
            height={20}
            className="mr-2"
          />
          <span className="text-lg mb-2">Registration Close Date: {timestampToDate(tournament.close_date)}</span>
        </div>
        <div className="flex items-center mb-2">
          <Image
            src={Calendar}
            alt="Calendar Icon"
            width={20}
            height={20}
            className="mr-2"
          />
          <span className="text-lg mb-2">Event Date: {timestampToDate(tournament.event_date)}</span>
        </div>
        {Date.now() >= timestampToDate(tournament.event_date) ? (
          <p className="text-lg">Completed: {tournament.completed ? "Completed" : "Not Completed"}</p>
        ) : null}
        <TournamentDescription description={tournament.description} />
      </div>
    </div>
  );
}
