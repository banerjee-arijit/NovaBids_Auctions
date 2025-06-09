import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { supabase } from "@/SupabaseClient";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      setLoading(false);
      return;
    }

    try {
      // Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // Check user object exists
      if (!authData.user) {
        setError("User data missing after signup.");
        setLoading(false);
        return;
      }

      // Save extra info in "profiles" table
      const { error: dbError } = await supabase.from("profiles").upsert({
        id: authData.user.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
      });

      if (dbError) {
        setError(dbError.message);
        setLoading(false);
        return;
      }

      setSuccess(
        "Registration successful! Please check your email to verify your account."
      );
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      {success && (
        <div className="text-green-600 text-sm text-center">{success}</div>
      )}

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
              className="pl-10 h-12 rounded-xl border-border focus:border-primary"
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
              className="pl-10 h-12 rounded-xl border-border focus:border-primary"
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
            className="pl-10 h-12 rounded-xl border-border focus:border-primary"
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
            className="pl-10 pr-10 h-12 rounded-xl border-border focus:border-primary"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Toggle Password Visibility"
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
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="pl-10 pr-10 h-12 rounded-xl border-border focus:border-primary"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Toggle Confirm Password Visibility"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="flex items-start space-x-2 text-sm">
        <input
          type="checkbox"
          className="rounded border-border mt-0.5"
          required
          id="terms"
        />
        <label htmlFor="terms" className="text-muted-foreground">
          I agree to the{" "}
          <button type="button" className="text-primary hover:underline">
            Terms of Service
          </button>{" "}
          and{" "}
          <button type="button" className="text-primary hover:underline">
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
  );
};

export default RegisterForm;
