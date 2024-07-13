import React from "react"
import { Bracket, Seed, SeedItem, SeedTeam, SeedTime } from "react-brackets"

export default function SingleElimination() {

  const rounds = [
    
    {
      title: "Round 1",
      seeds: [
        {},
        {},
        {
          id: 1,
          date: new Date().toDateString(),
          teams: [
            { id: 1, name: "Hello", score: 2 },
            { id: 3, name: "Mittens", score: 6 }
          ]
        },
        
        {
          id: 1,
          date: new Date().toDateString(),
          teams: [
            { id: 1, name: "The Leons", score: 2 },
            { id: 3, name: "Kitties", score: 6 }
          ]
        }
      ]
    },
    {
      title: "Round 2",
      seeds: [...new Array(2)].fill({
        id: 1,
        date: new Date().toDateString(),
        teams: [
          { id: 1, name: "The Leons", score: 2 },
          { id: 3, name: "Kitties", score: 6 }
        ]
      })
    },
    {
      title: "Round 3",
      seeds: [...new Array(1)].fill({
        id: 1,
        date: new Date().toDateString(),
        teams: [
          { id: 1, name: "The Leons", score: 2 },
          { id: 3, name: "Kitties", score: 6 }
        ]
      })
    }
  ]
  
  const RenderSeed = ({ breakpoint, seed }) => {
    return (
      <Seed mobileBreakpoint={breakpoint}>
        <SeedItem style={{ width: "100%" }}>
          <div>
            <SeedTeam>{seed.teams?.[0].name || "-----------"}</SeedTeam>
            <div style={{ height: 1, backgroundColor: "#707070" }}></div>
            <SeedTeam>{seed.teams?.[1]?.name || "-----------"}</SeedTeam>
          </div>
        </SeedItem>
        <SeedTime mobileBreakpoint={breakpoint} style={{ fontSize: 9 }}>
          {seed.date}
        </SeedTime>
      </Seed>
    )
  }
  
    return (
      <Bracket
        mobileBreakpoint={767}
        rounds={rounds}
        renderSeedComponent={RenderSeed}
        swipeableProps={{ enableMouseEvents: true, animateHeight: true }}
      />
    )
}
