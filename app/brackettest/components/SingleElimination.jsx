"use client";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@utils/firebase";
import React, { useEffect, useState } from "react";
import { Bracket, Seed, SeedItem, SeedTeam, SeedTime } from "react-brackets";
import { RenderLoadingSeed } from "./loading";
import Link from "next/link";

export default function SingleElimination() {
  const [brackets, setBrackets] = useState();

  useEffect(() => {
    async function fetchData() {
      const bracketRef = doc(db, "brackets", "53wINWQ1vcybxutgAHtb");
      const bracketSnap = await getDoc(bracketRef);
      setBrackets(bracketSnap.data());
      console.log(bracketSnap.data());
    }
    fetchData();
  }, []);

  const bracket1 = brackets?.[0];

  const rounds = [
    {
      title: "Round 1",
      seeds: [
        {
          id: 124,
        },
        {
          id: 123,
          date: new Date().toDateString(),
          teams: [
            { id: 123, name: bracket1?.name, score: 2 },
            { id: 333, name: "Mittens", score: 6 },
          ],
        },
        {
          id: 133,
          date: new Date().toDateString(),
          teams: [
            { id: 122, name: "Hello", score: 2 },
            { id: 331, name: "Mittens", score: 6 },
          ],
        },
        {
          id: 122,
          date: new Date().toDateString(),
          teams: [
            { id: 111, name: "The Leons", score: 2 },
            { id: 332, name: "Kitties", score: 6 },
          ],
        },
      ],
    },
    {
      title: "Round 2",
      seeds: [
        {
          id: 112,
          date: new Date().toDateString(),
          teams: [
            { id: 1, name: "The Leons", score: 2 },
            { id: 2, name: "Kitties", score: 6 },
          ],
        },
        {
          id: 113,
          date: new Date().toDateString(),
          teams: [
            { id: 3, name: "The Leons", score: 2 },
            { id: 4, name: "Kitties", score: 6 },
          ],
        },
      ],
    },
    {
      title: "Round 3",
      seeds: [...new Array(1)].fill({
        id: 119,
        date: new Date().toDateString(),
        teams: [
          { id: 781, name: "The Leons", score: "" },
          { id: 943, name: "Kitties", score: "" },
        ],
      }),
    },
  ];

  const RenderSeed = ({ breakpoint, seed }) => {
    return (
      <Seed mobileBreakpoint={breakpoint}>
        <SeedItem style={{ width: "100%" }}>
          <Link href="/">
            <SeedTeam>
              {seed.teams?.[0].name || "-----------"} -{" "}
              {seed.teams?.[0].score || " "}
            </SeedTeam>
            <div style={{ height: 1, backgroundColor: "#707070" }}></div>
            <SeedTeam>
              {seed.teams?.[1].name || "-----------"} -{" "}
              {seed.teams?.[1].score || " "}
            </SeedTeam>
          </Link>
        </SeedItem>
        <SeedTime mobileBreakpoint={breakpoint} style={{ fontSize: 9 }}>
          {seed.date}
        </SeedTime>
      </Seed>
    );
  };

  return (
    <Bracket
      mobileBreakpoint={767}
      rounds={rounds}
      renderSeedComponent={brackets ? RenderSeed : RenderLoadingSeed}
      swipeableProps={{ enableMouseEvents: true, animateHeight: true }}
    />
  );
}
