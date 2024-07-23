"use client";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@utils/firebase";
import React, { useEffect, useState } from "react";
import { Bracket, Seed, SeedItem, SeedTeam, SeedTime } from "react-brackets";
import { RenderLoadingSeed } from "../loading";
import Modal from "react-modal";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default function SingleElimination({ rounds }) {
  const [isOpen, setIsOpen] = useState(false);

  const RenderSeed = ({ breakpoint, seed }) => {
    return (
      <Seed mobileBreakpoint={breakpoint}>
        <button className="w-48" onClick={() => setIsOpen(true)}>
          <SeedItem className="hover:bg-slate-400">
            <SeedTeam>
              <div>{seed.teams?.[0].name || "-----------"}</div>
              <div
                className={`py-0.5 px-1.5 rounded ${
                  seed.teams?.[0].score > seed.teams?.[1].score
                    ? "bg-green-600"
                    : seed.teams?.[0].score === seed.teams?.[1].score
                    ? "bg-gray-600"
                    : "bg-red-600"
                }`}
              >
                {seed.teams?.[0].score || "0"}
              </div>
            </SeedTeam>
            <div style={{ height: 1, backgroundColor: "#707070" }}></div>
            <SeedTeam>
              <div>{seed.teams?.[1].name || "-----------"}</div>
              <div
                className={`py-0.5 px-1.5 rounded ${
                  seed.teams?.[1].score > seed.teams?.[0].score
                    ? "bg-green-600"
                    : seed.teams?.[1].score === seed.teams?.[0].score
                    ? "bg-gray-600"
                    : "bg-red-600"
                }`}
              >
                {seed.teams?.[1].score || "0"}
              </div>
            </SeedTeam>
          </SeedItem>
        </button>
        <Modal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          style={customStyles}
        >
          <button className="text-black" onClick={() => setIsOpen(false)}>
            Close
          </button>
        </Modal>
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
      renderSeedComponent={rounds ? RenderSeed : RenderLoadingSeed}
      swipeableProps={{ enableMouseEvents: true, animateHeight: true }}
    />
  );
}
