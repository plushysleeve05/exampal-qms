import React from "react";
import { Link } from "react-router";

interface ExamPalLogoProps {
  collapsed?: boolean;
}

const ExamPalLogo: React.FC<ExamPalLogoProps> = ({ collapsed = false }) => {
  return (
    <Link to="/" className="flex items-center">
      {collapsed ? (
        <span className="text-xl font-bold text-green-500">E</span>
      ) : (
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          Exam<span className="text-green-500">Pal</span>
        </span>
      )}
    </Link>
  );
};

export default ExamPalLogo;
