"use client";

import {
  SingleEliminationBracket,
  DoubleEliminationBracket,
  Match,
  SVGViewer,
  createTheme,
} from "@g-loot/react-tournament-brackets";
import { dataDoublePlayoffs, walkOverData } from "./mock_bracket_data";
import { getTournaments, updateTournament, getUsers, getUserRef  } from "@/app/_utils/firebase_services";
import { useUserAuth } from "@/app/_utils/auth-context.js";
import { useState, useEffect } from "react";  


export const DoubleElimination = ({ matches }) => (
  <DoubleEliminationBracket
    matches={matches}
    matchComponent={Match}
    theme={WhiteTheme}
    options={{
      style: {
        roundHeader: {
          backgroundColor: WhiteTheme.roundHeader.backgroundColor,
          fontColor: WhiteTheme.roundHeader.fontColor,
        },
        connectorColor: WhiteTheme.connectorColor,
        connectorColorHighlight: WhiteTheme.connectorColorHighlight,
      },
    }}
    svgWrapper={({ children, ...props }) => (
      <SVGViewer width={500} height={500} {...props}>
        {children}
      </SVGViewer>
    )}
  />
);

export const SingleElimination = ({ matches }) => (
  <SingleEliminationBracket
    matches={matches}
    matchComponent={Match}
    svgWrapper={({ children, ...props }) => (
      <SVGViewer width={1000} height={1000} {...props}>
        {children}
      </SVGViewer>
    )}
  />
);

const WhiteTheme = createTheme({
  textColor: { main: "#000000", highlighted: "#07090D", dark: "#3E414D" },
  matchBackground: { wonColor: "#daebf9", lostColor: "#96c6da" },
  score: {
    background: { wonColor: "#87b2c4", lostColor: "#87b2c4" },
    text: { highlightedWonColor: "#7BF59D", highlightedLostColor: "#FB7E94" },
  },
  border: {
    color: "#CED1F2",
    highlightedColor: "#da96c6",
  },
  roundHeader: { backgroundColor: "#da96c6", fontColor: "#000" },
  connectorColor: "#CED1F2",
  connectorColorHighlight: "#da96c6",
  svgBackground: "#FAFAFA",
});

export const Bracket = () => {
  const [tournaments, setTournaments] = useState([]);
  const [bracket, setBracket] = useState(null);
  const [users, setUsers] = useState(null);
  const { user } = useUserAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      console.log(data);
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleNewBracket = async () => {
    const newBracket = await createBracket();
    const newNewBracket = await initializeMatches(newBracket, users);
    console.log("NewNewBracket:");
    console.log(newNewBracket);
    setBracket(newNewBracket);
  };

  return (
    <div>
      <SingleElimination matches={walkOverData} />
    </div>
  );
};
