import React from "react";

const InputField = ({ icon, type, name, placeholder }) => {
  return (
    <div className="relative">
      <span className="absolute top-3 left-3 text-gray-400">{icon}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
      />
    </div>
  );
};

export default InputField;
