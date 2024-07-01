import React from 'react';
import { SingleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';
const SingleElimination = ({ bracketData }) => (
    bracketData && bracketData.length > 0 ? (
      <SingleEliminationBracket
        matches={bracketData}
        matchComponent={Match}
        svgWrapper={({ children, ...props }) => (
            <SVGViewer width={500} height={500} {...props}>
              {children}
            </SVGViewer>
          )}
      />
    ) : (
      <div>No data available</div>
    )
  );

export default SingleElimination;

// const matches = [
//     {
//         id: 20464,
//         name: "Semi Final - Match 1",
//         nextMatchId: 20463,
//         nextLooserMatchId: null,
//         tournamentRoundText: "2",
//         startTime: "2021-07-28T00:00:00.000+00:00",
//         state: "SCORE_DONE",
//         participants: [
//             {},
//             {}
//         ]
//     },
//     {
//         id: 20465,
//         name: "Round 1 - Match 1",
//         nextMatchId: 20464,
//         nextLooserMatchId: null,
//         tournamentRoundText: "1",
//         startTime: "2021-07-27T23:00:00.000+00:00",
//         state: "SCORE_DONE",
//         participants: [
//             {},
//             {}
//         ]
//     },
//     {
//         id: 20466,
//         name: "Round 1 - Match 2",
//         nextMatchId: 20464,
//         nextLooserMatchId: null,
//         tournamentRoundText: "1",
//         startTime: "2021-07-27T23:00:00.000+00:00",
//         state: "WALK_OVER",
//         participants: [
//             {},
//             {}
//         ]
//     },
//     {
//         id: 20467,
//         name: "Semi Final - Match 2",
//         nextMatchId: 20463,
//         nextLooserMatchId: null,
//         tournamentRoundText: "2",
//         startTime: "2021-07-28T00:00:00.000+00:00",
//         state: "WALK_OVER",
//         participants: [
//             {},
//             {}
//         ]
//     },
//     {
//         id: 20468,
//         name: "Round 1 - Match 3",
//         nextMatchId: 20467,
//         nextLooserMatchId: null,
//         tournamentRoundText: "1",
//         startTime: "2021-07-27T23:00:00.000+00:00",
//         state: "WALK_OVER",
//         participants: [
//             {}
//         ]
//     },
//     {
//         id: 20469,
//         name: "Round 1 - Match 4",
//         nextMatchId: 20467,
//         nextLooserMatchId: null,
//         tournamentRoundText: "1",
//         startTime: "2021-07-27T23:00:00.000+00:00",
//         state: "WALK_OVER",
//         participants: [
//             {}
//         ]
//     },
//     {
//         id: 20463,
//         name: "Final - Match",
//         nextMatchId: null,
//         nextLooserMatchId: null,
//         tournamentRoundText: "3",
//         startTime: "2021-07-28T01:00:00.000+00:00",
//         state: "DONE",
//         participants: [
//             {
//                 id: "b9a3cc7a-95d9-483a-b515-f24bd0531f45",
//                 resultText: null,
//                 isWinner: false,
//                 status: null,
//                 name: "spacefudg3"
//             },
//             {}
//         ]
//     }
// ];