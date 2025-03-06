import React, { useState, useRef, act } from "react";
import { X, Mail, Lock, User, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useScrollLock } from "../utils/ScrollLockManager";
import { useFocusTrap } from "../utils/FocusTrap";
import { userFirebase } from "../context/Firebase";
import ImageCropper from "./ImageCropper";

type Tab = "signin" | "signup";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const profileImageRef = useRef<string | null>(null);
  const firebase = userFirebase();
  const modalRef = useFocusTrap(isOpen);
  useScrollLock(isOpen);

  const [activeTab, setActiveTab] = useState<Tab>("signin");
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (
    name: string,
    value: string,
    tempErrors?: { fullName: string; email: string; password: string }
  ) => {
    let error = "";
    switch (name) {
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Please enter a valid email";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters";
        }
        break;
      case "fullName":
        if (!value && activeTab === "signup") {
          error = "Full name is required";
        } else if (value.length > 18 && activeTab === "signup") {
          error = "Full name should be at max 18 characters long";
        }
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    if (tempErrors) {
      tempErrors[name as keyof typeof errors] = error;
      return tempErrors;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let tempErrors = {
      fullName: "",
      email: "",
      password: "",
    };

    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key as keyof typeof formData], tempErrors);
    });

    // Check for errors
    const hasErrors = Object.values(tempErrors).some((error) => error !== "");
    if (hasErrors) {
      setIsLoading(false);
      return;
    }

    try {
      await firebase?.signUpWithEmailAndPassword(
        formData.fullName,
        formData.email,
        formData.password,
        profileImageRef.current
      );
      toast.success(
        `Successfully ${activeTab === "signin" ? "signed in" : "signed up"}!`
      );
      onClose();
    } catch (error) {
      toast.error(
        `${
          activeTab === "signin" ? "Sign in" : "Sign up"
        } failed. Please try again later.}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      ref={modalRef}
    >
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="flex items-center justify-center min-h-full p-4">
        <div className="relative w-full max-w-md overflow-hidden transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute z-10 text-gray-400 transition-colors right-4 top-4 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
                activeTab === "signin"
                  ? "text-secondary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("signin")}
            >
              Sign In
              {activeTab === "signin" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary" />
              )}
            </button>
            <button
              className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
                activeTab === "signup"
                  ? "text-secondary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
              {activeTab === "signup" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary" />
              )}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {activeTab === "signup" && (
              <>
                {/* Profile Picture Upload */}
                <div className="space-y-4 ">
                  <label className="block text-sm font-medium text-center text-gray-700">
                    Profile Picture
                  </label>
                  <ImageCropper profileImageRef={profileImageRef} />
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full py-2 pl-10 pr-4 transition-colors border border-gray-200 rounded-lg focus:border-secondary focus:ring-1 focus:ring-secondary"
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="w-4 h-4" />
                      {errors.fullName}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full py-2 pl-10 pr-4 transition-colors border border-gray-200 rounded-lg focus:border-secondary focus:ring-1 focus:ring-secondary"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full py-2 pl-10 pr-4 transition-colors border border-gray-200 rounded-lg focus:border-secondary focus:ring-1 focus:ring-secondary"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-secondary text-white py-2.5 rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {activeTab === "signin" ? "Signing in..." : "Signing up..."}
                </>
              ) : activeTab === "signin" ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google Auth Button */}
            <button
              onClick={() => {
                console.log("Continue with Google clicked.");
                firebase?.signupwithGoogle();
                onClose();
              }}
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            {/* Switch Tab Link */}
            <p className="text-sm text-center text-gray-500">
              {activeTab === "signin" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("signup")}
                    className="text-secondary hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("signin")}
                    className="text-secondary hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
