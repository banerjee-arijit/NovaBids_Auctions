import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, X } from "lucide-react";
import { supabase } from "@/services/supabase";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const TermsDialog = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const content =
    type === "terms"
      ? {
          title: "Terms of Service",
          content: [
            "1. Account Usage:",
            "• Your email may be used to send important notifications and updates.",
            "• You are responsible for maintaining the security of your account.",
            "• Any fraudulent activity will result in immediate account suspension.",
            "",
            "2. User Conduct:",
            "• Users must provide accurate and truthful information.",
            "• Any form of abuse or harassment will not be tolerated.",
            "• Users must comply with all applicable laws and regulations.",
            "",
            "3. Account Termination:",
            "• We reserve the right to suspend or terminate accounts that violate our terms.",
            "• Users may be banned for fraudulent activities or policy violations.",
            "• We may take legal action against users who engage in illegal activities.",
            "",
            "4. Data Usage:",
            "• We collect and process data as described in our Privacy Policy.",
            "• We may use your email for service-related communications.",
            "• We implement security measures to protect your data.",
          ],
        }
      : {
          title: "Privacy Policy",
          content: [
            "1. Information Collection:",
            "• We collect your email, name, and other provided information.",
            "• We may collect usage data to improve our services.",
            "• We use cookies and similar technologies for security and functionality.",
            "",
            "2. Data Usage:",
            "• Your data is used to provide and improve our services.",
            "• We may send you important notifications and updates.",
            "• We use your information to prevent fraud and abuse.",
            "",
            "3. Data Protection:",
            "• We implement security measures to protect your data.",
            "• We do not sell your personal information to third parties.",
            "• We may share data with law enforcement when required by law.",
            "",
            "4. Your Rights:",
            "• You can request access to your personal data.",
            "• You can request deletion of your account and data.",
            "• You can opt-out of non-essential communications.",
          ],
        };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{content.title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4 text-sm text-muted-foreground">
          {content.content.map((line, index) => (
            <p key={index} className={line.startsWith("•") ? "ml-4" : ""}>
              {line}
            </p>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

const RegisterForm = ({ setActiveTab }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const navigate = useNavigate();

  const openDialog = (type) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      // Sign up user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });

      if (authError) {
        if (
          authError.message.toLowerCase().includes("user already registered")
        ) {
          toast.error("Email is already registered. Please log in instead.");
        } else {
          toast.error(authError.message);
        }
        setLoading(false);
        return;
      }

      if (!authData.user) {
        toast.error("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      toast.success(
        "Registration successful! Check your email for verification."
      );
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setActiveTab("login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                className="pl-10 h-12 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                className="pl-10 h-12 rounded-xl"
                required
              />
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 h-12 rounded-xl"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-10 h-12 rounded-xl"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              aria-label="Toggle Password"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="pl-10 pr-10 h-12 rounded-xl"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              aria-label="Toggle Confirm Password"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start space-x-2 text-sm">
          <input
            type="checkbox"
            className="rounded border-border mt-0.5"
            required
            id="terms"
          />
          <label htmlFor="terms" className="text-muted-foreground">
            I agree to the{" "}
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => openDialog("terms")}
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => openDialog("privacy")}
            >
              Privacy Policy
            </button>
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <TermsDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        type={dialogType}
      />
    </>
  );
};

export default RegisterForm;
