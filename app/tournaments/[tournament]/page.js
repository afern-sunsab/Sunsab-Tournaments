'use client';

import { getTournament } from '@utils/firebase_services';
import { useEffect, useState } from 'react';
import TournamentDetails from './TournamentDetails';
export default function Page({ params }) {
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    const fetchTournament = async () => {
      const data = await getTournament(params.tournament);
      setTournament(data);
    };
    fetchTournament();
  }, [params]);

  return (
    <main className="bg-white text-black p-6">
      {tournament && tournament.name ? (
        <TournamentDetails tournament={tournament} />
      ) : (
        <h1>Loading...</h1>
      )}
    </main>
  );
}
