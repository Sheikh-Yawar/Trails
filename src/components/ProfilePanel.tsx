import { signOut } from "firebase/auth";
import { Edit2, Loader2, LogOut, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userFirebase } from "../context/Firebase";
import ImageCropper from "./ImageCropper";

import { updateUserFields } from "../utils/CustomTypes";
import { toast } from "react-toastify";

type ProfilePanelProps = {
  profileRef: React.RefObject<HTMLDivElement>;
  isProfileOpen: boolean;
  setIsProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfilePanel = ({
  profileRef,
  isProfileOpen,
  setIsProfileOpen,
}: ProfilePanelProps) => {
  const navigate = useNavigate();
  const firebase = userFirebase();
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const profileImageRef = useRef<string | null>(null);
  const [originalUsername, setOriginalUsername] = useState("");
  const [originalProfileImage, setOriginalProfileImage] = useState<
    string | null
  >(null);

  useEffect(() => {
    profileImageRef.current = firebase?.user?.profileImage!;
    setUsername(firebase?.user?.name!);
    setOriginalUsername(firebase?.user?.name!);
    setOriginalProfileImage(firebase?.user?.profileImage!);
  }, [firebase?.user]);

  const handleSaveChanges = async () => {
    try {
      setIsSavingChanges(true);
      const updates: updateUserFields = {};

      if (username !== originalUsername) {
        updates.displayName = username;
      }

      if (profileImageRef.current !== originalProfileImage) {
        if (profileImageRef.current) {
          updates.photoURL = (await firebase?.uploadBase64Image(
            profileImageRef.current,
            `${username}_${firebase.user?.uid}`
          )) as string;
        } else {
          updates.photoURL = "";
        }
      }

      if (Object.keys(updates).length > 0) {
        await firebase?.updateUserDetails(updates);
      } else {
        console.log("No changes to save");
      }

      setIsEditing(false);
      setIsSavingChanges(false);
    } catch (error) {
      toast.error(
        "We were unable to update your profile at this time. Please try again later."
      );
      setIsSavingChanges(false);
    }
  };

  const handleCancelChanges = () => {
    setIsEditing(false);
    profileImageRef.current = originalProfileImage;
    setUsername(originalUsername);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  return (
    <div
      ref={profileRef}
      role="dialog"
      aria-label="User profile"
      aria-modal="true"
      className={`fixed inset-0 z-50 ${
        isProfileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      } transition-opacity duration-300`}
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-y-0 right-0 w-full max-w-md">
        <div className="flex flex-col h-full bg-white shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-primary">Profile</h2>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 transition-colors rounded-full hover:bg-gray-100"
                >
                  <Edit2 className="w-5 h-5 text-gray-500" />
                </button>
              )}
              <button
                onClick={() => {
                  setIsEditing(false);
                  setIsProfileOpen(false);
                }}
                className="p-2 transition-colors rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center mt-4 space-y-4">
                {firebase?.user && firebase.user.profileImage ? (
                  <ImageCropper
                    profileImageRef={profileImageRef}
                    canChooseNewFile={isEditing}
                  />
                ) : (
                  <ImageCropper
                    profileImageRef={profileImageRef}
                    canChooseNewFile={isEditing}
                  />
                )}
              </div>

              {/* Profile Form */}
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={handleNameChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isEditing
                        ? "border-gray-300 focus:border-secondary focus:ring-1 focus:ring-secondary"
                        : "border-gray-200 bg-gray-50"
                    } transition-colors`}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={firebase?.user?.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg cursor-not-allowed bg-gray-50"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing ? (
                <div className="flex gap-4">
                  <button
                    disabled={isSavingChanges}
                    onClick={handleSaveChanges}
                    className="flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-secondary hover:bg-secondary/90"
                  >
                    {isSavingChanges ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving Changes
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button
                    onClick={handleCancelChanges}
                    className="flex-1 px-4 py-2 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    signOut(firebase?.firebaseAuth!);
                    setIsProfileOpen(false);
                    if (firebase) {
                      firebase.userGradient = "";
                    }
                    navigate("/");
                  }}
                  className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
