import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import InputField from "../common/InputField";
import { Link } from "react-router-dom";

const RegisterRightPanel = () => {
  return (
    <div className="p-8 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          Create your account
        </h2>
        <p className="text-gray-500 mt-2">
          Fill in your details to get started
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <InputField
            icon={<User />}
            type="text"
            name="username"
            placeholder="Username"
          />
          <InputField
            icon={<Mail />}
            type="email"
            name="email"
            placeholder="Email address"
          />
          <InputField
            icon={<Lock />}
            type="password"
            name="password"
            placeholder="Password"
          />
        </div>

        <div className="flex items-center text-sm">
          <label className="flex items-center text-gray-600">
            <input type="checkbox" className="mr-2 rounded border-gray-400" />I
            agree to the Terms of Service and Privacy Policy
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-500  text-white hover:bg-blue-600 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02]"
        >
          <UserPlus className="w-5 h-5" />
          Create Account
        </button>

        <p className="text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link to={"/auth"}>
            <button
              type="button"
              className="text-blue-500 hover:text-cyan-400 font-medium cursor-pointer"
            >
              Sign in
            </button>
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default RegisterRightPanel;
