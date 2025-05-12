import React from "react";
import InputField from "../common/InputField";
import { Lock, Mail, LogIn, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LoginRightPanel = ({ isForgotPassword, setIsForgotPassword }) => {
  const navigate = useNavigate();

  function handleFormSubmit(e) {
    e.preventDefault();
    navigate("/dashboard");
  }
  return (
    <div className="p-8 md:p-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {isForgotPassword ? "Reset Password" : "Sign In"}
        </h2>
        <p className="text-gray-500 mt-2">
          {isForgotPassword
            ? "Enter your email to reset your password"
            : "Log in to your NOVA Bid account"}
        </p>
      </div>

      <form className="space-y-6">
        <div className="space-y-4">
          <InputField
            icon={<Mail />}
            type="email"
            name="email"
            placeholder="Email"
          />
          {!isForgotPassword && (
            <InputField
              icon={<Lock />}
              type="password"
              name="password"
              placeholder="Password"
            />
          )}
        </div>

        {!isForgotPassword && (
          <div className="flex justify-between text-sm text-gray-500">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => setIsForgotPassword(true)}
              className="text-blue-500 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}

        <button
          className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300"
          onClick={handleFormSubmit}
        >
          {isForgotPassword ? (
            "Reset Password"
          ) : (
            <div className="flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              Sign In
            </div>
          )}
        </button>

        {isForgotPassword && (
          <button
            type="button"
            onClick={() => setIsForgotPassword(false)}
            className="w-full text-center text-blue-500 hover:underline text-sm"
          >
            Back to login
          </button>
        )}

        {!isForgotPassword && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-3 border border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-700 hover:border-gray-500"
            >
              <ShieldCheck className="w-5 h-5 text-blue-500" />
              Sign in with Google
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{" "}
              <Link to={"/auth/register"}>
                <button className="text-blue-500 hover:underline font-medium">
                  Sign up
                </button>
              </Link>
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default LoginRightPanel;
