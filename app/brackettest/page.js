import React from "react";
// import DoubleElimination from "./components/double-elimination";
// import LoadingBracket from "./components/loading";
import SingleElimination from "./components/SingleElimination";
import DoubleElimination from "./components/double-elimination";

const Page = () => {
  return (
    <div>
      <hr />
      <h3>Single Elimination</h3>
      <hr />
      <SingleElimination />
      <h3>Double Elimination</h3>
      <hr />
      <DoubleElimination />
    </div>
  );
};

export default Page;
