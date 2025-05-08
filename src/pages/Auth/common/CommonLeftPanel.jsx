import React from "react";
import { Rocket } from "lucide-react";

const CommonLeftPanel = ({ content }) => {
  return (
    <div className="hidden md:flex flex-col items-center justify-center p-10 bg-gray-50 border-r border-gray-200">
      <div className="bg-gray-100 rounded-full p-4 mb-6">
        <Rocket className="w-10 h-10 text-gray-700" />
      </div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-2 text-center">
        Welcome to <span className="text-blue-500">NOVA Bid</span>
      </h1>
      <p className="text-gray-500 text-center max-w-xs">{content}</p>
    </div>
  );
};

export default CommonLeftPanel;
