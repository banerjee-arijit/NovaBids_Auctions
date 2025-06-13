import React, { useState, useEffect } from "react";
import { UserPlus, X, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/common/Logo";
import { supabase } from "@/services/supabase";
import toast, { Toaster } from "react-hot-toast";

const UserProfileDialog = ({ isOpen, onClose, userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: userData?.first_name || "",
    lastName: userData?.last_name || "",
    email: userData?.email || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userData.id);

      if (profileError) throw profileError;

      if (formData.email !== userData.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email,
        });
        if (emailError) throw emailError;
      }

      // Update user metadata in auth
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
        },
      });

      if (metadataError) throw metadataError;

      toast.success("Profile updated successfully!");

      // Update local state
      onUpdate({
        ...userData,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
      });

      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error.message || "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="h-10"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 h-10"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileUpdate = (updatedData) => {
    setUserData(updatedData);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        setUserData(null);
        return;
      }

      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError.message);
          setUserData(null);
          return;
        }

        setUserData({ ...user, ...profileData });
      } else {
        setUserData(null);
      }
    };

    fetchUser();
  }, []);

  const handleNavigate = () => navigate("/auth");

  return (
    <>
      <Toaster position="top-center" />
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Logo />

            {/* Profile Circle or Join Button */}
            {userData ? (
              <button
                onClick={() => setIsProfileOpen(true)}
                className="bg-black text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg shadow-md hover:bg-gray-800 transition-colors"
              >
                {userData.first_name ? (
                  userData.first_name.charAt(0).toUpperCase()
                ) : (
                  <User className="w-5 h-5" />
                )}
              </button>
            ) : (
              <Button
                className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-black"
                onClick={handleNavigate}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Join Nova
              </Button>
            )}
          </div>
        </div>
      </div>

      <UserProfileDialog
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userData={userData}
        onUpdate={handleProfileUpdate}
      />
    </>
  );
};

export default Navbar;
