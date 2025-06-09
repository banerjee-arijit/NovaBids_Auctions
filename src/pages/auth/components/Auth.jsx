import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import PhoneAuth from "./PhoneAuth";
import Logo from "@/components/Logo";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <Logo />
          </Link>
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome</h2>
          <p className="text-muted-foreground">
            {activeTab === "login" && "Sign in to your account"}
            {activeTab === "register" && "Create your account"}
            {activeTab === "phone" && "Sign in with your phone"}
          </p>
        </div>

        <div className="bg-card rounded-3xl shadow-xl border border-border p-8">
          <div className="flex bg-muted rounded-2xl p-1 mb-6">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === "login"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === "register"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Register
            </button>
            <button
              onClick={() => setActiveTab("phone")}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === "phone"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Phone
            </button>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {activeTab === "login" && <LoginForm />}
            {activeTab === "register" && <RegisterForm />}
            {activeTab === "phone" && <PhoneAuth />}
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Auctions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
