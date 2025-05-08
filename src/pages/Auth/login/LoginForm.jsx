import React, { useState } from "react";
import LoginRightPanel from "./LoginRightPanel";
import CommonLeftPanel from "../common/CommonLeftPanel";

const LoginForm = () => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 md:p-10">
      <div className="w-full max-w-5xl bg-white border border-gray-200 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <CommonLeftPanel
          content={
            "Welcome back to NOVA Bid — Resume your journey through the next-gen bidding arena."
          }
        />
        <LoginRightPanel
          isForgotPassword={isForgotPassword}
          setIsForgotPassword={setIsForgotPassword}
        />
      </div>
    </div>
  );
};

export default LoginForm;
