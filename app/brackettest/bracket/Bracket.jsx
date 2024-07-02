"use client";

import {
  SingleEliminationBracket,
  DoubleEliminationBracket,
  Match,
  SVGViewer,
  createTheme,
} from "@g-loot/react-tournament-brackets";
import { dataDoublePlayoffs, walkOverData } from "./mock_bracket_data";
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


  return (
    <div>
      <SingleElimination matches={walkOverData} />
    </div>
  );
};
