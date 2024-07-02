'use client';

import { SingleEliminationBracket, DoubleEliminationBracket, Match, SVGViewer,createTheme } from '@g-loot/react-tournament-brackets';
import {  dataDoublePlayoffs, walkOverData } from './mock_bracket_data';

export const DoubleElimination = ({matches}) => (
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

export const SingleElimination = ({matches}) => (
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
  textColor: { main: '#000000', highlighted: '#07090D', dark: '#3E414D' },
  matchBackground: { wonColor: '#daebf9', lostColor: '#96c6da' },
  score: {
    background: { wonColor: '#87b2c4', lostColor: '#87b2c4' },
    text: { highlightedWonColor: '#7BF59D', highlightedLostColor: '#FB7E94' },
  },
  border: {
    color: '#CED1F2',
    highlightedColor: '#da96c6',
  },
  roundHeader: { backgroundColor: '#da96c6', fontColor: '#000' },
  connectorColor: '#CED1F2',
  connectorColorHighlight: '#da96c6',
  svgBackground: '#FAFAFA',
});

export const Bracket = () => {
    const singleEliminationMatches = [
        {
          "id": 260005,
          "name": "Final - Match",
          "nextMatchId": null, // Id for the nextMatch in the bracket, if it's final match it must be null OR undefined
          "tournamentRoundText": "4", // Text for Round Header
          "startTime": "2021-05-30",
          "state": "DONE", // 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | 'DONE' | 'SCORE_DONE' Only needed to decide walkovers and if teamNames are TBD (to be decided)
          "participants": [
            {
              "id": "c016cb2a-fdd9-4c40-a81f-0cc6bdf4b9cc", // Unique identifier of any kind
              "resultText": "WON", // Any string works
              "isWinner": false,
              "status": null, // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
              "name": "giacomo123"
            },
            {
              "id": "9ea9ce1a-4794-4553-856c-9a3620c0531b",
              "resultText": null,
              "isWinner": true,
              "status": null, // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY'
              "name": "Ant"
            }
          ]
        }
    ]

    return (
        <div>
          
          <DoubleEliminationBracket matches={dataDoublePlayoffs} />
          <SingleElimination matches={walkOverData} />   
        </div>
    )
}
