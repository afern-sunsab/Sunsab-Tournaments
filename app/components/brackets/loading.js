import React from "react";
import { Bracket, Seed, SeedItem, SeedTeam, SeedTime } from "react-brackets";
import { keyframes, styled } from "styled-components";

const ShimmerKeyFrames = keyframes`
	100% {
	transform: translateX(100%);
	}
`;

const StyledSkeletonItem = styled(SeedItem)`
  background-color: #e2e2e2;
  background-repeat: repeat-y;
  position: relative;
  color: #e2e2e2;
  overflow: hidden;

  &:after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      45deg,
      rgba(0, 0, 0, 0) 20%,
      rgba(0, 0, 0, 0.2) 100%
    );

    animation: ${ShimmerKeyFrames} 2s infinite;
    content: "";
  }
`;

export const RenderLoadingSeed = ({ seed, breakpoint }) => {
  return (
    <Seed mobileBreakpoint={breakpoint}>
      <StyledSkeletonItem>
        <div>
          {/* you can use height instead of adding a dot also :O */}
          <SeedTeam>Loading...</SeedTeam>
          <SeedTeam>Loading...</SeedTeam>
        </div>
      </StyledSkeletonItem>
      <SeedTime mobileBreakpoint={breakpoint} style={{ fontSize: 9 }}>
        {seed.date}
      </SeedTime>
    </Seed>
  );
};

const LoadingBracket = () => {
  return (
    <Bracket rounds={loadingData} renderSeedComponent={RenderLoadingSeed} />
  );
};

export default LoadingBracket;
