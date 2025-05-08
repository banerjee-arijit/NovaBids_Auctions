import React from "react";
import CommonLeftPanel from "../common/CommonLeftPanel";
import RegisterRightPanel from "./RegisterRightPanel";

const RegisterForm = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-10 overflow-hidden">
      <div className="relative z-10 w-full max-w-5xl bg-white border border-gray-200 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2">
        <CommonLeftPanel
          content={
            "Step into the future of auctions — Create your account and start bidding on innovation."
          }
        />
        <RegisterRightPanel />
      </div>
    </div>
  );
};

export default RegisterForm;
