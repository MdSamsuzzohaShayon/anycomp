'use client'

import { type FC } from "react";

interface ResultsCountProps {
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

const ResultsCount: FC<ResultsCountProps> = ({ startIndex, endIndex, totalItems }) => {
  return (
    <div className="mb-4">
      <p className="text-xs sm:text-sm text-gray-600">
        Showing {startIndex + 1}-{endIndex} of {totalItems} specialists
      </p>
    </div>
  );
};

export default ResultsCount;