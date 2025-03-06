import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, X, ChevronRight, LoaderIcon } from "lucide-react";
import AuthModal from "./AuthModal";
import { useScrollLock } from "../utils/ScrollLockManager";
import { useFocusTrap } from "../utils/FocusTrap";
import CustomButton from "./CustomButton";
import { userFirebase } from "../context/Firebase";
import ProfilePanel from "./ProfilePanel";

interface SavedTrip {
  id: number;
  title: string;
  location: string;
  image: string;
  days: number;
}

const Header: React.FC = () => {
  const firebase = userFirebase();
  const [isSavedTripsOpen, setIsSavedTripsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const savedTripsRef = useFocusTrap(isSavedTripsOpen);
  const profileRef = useFocusTrap(isProfileOpen);

  useScrollLock(isSavedTripsOpen || isProfileOpen);

  const savedTrips: SavedTrip[] = [
    {
      id: 1,
      title: "Japanese Cultural Journey",
      location: "Tokyo, Japan",
      image:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200",
      days: 12,
    },
    {
      id: 2,
      title: "Northern Lights Adventure",
      location: "Reykjavik, Iceland",
      image:
        "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=1200",
      days: 7,
    },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="px-4 sm:px-6 lg:px-20">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2663ec"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-map-pin-house"
              >
                <path d="M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z" />
                <path d="M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2" />
                <path d="M18 22v-3" />
                <circle cx="10" cy="10" r="3" />
              </svg>
              <span className="text-[28px] font-bold text-primary">Trails</span>
            </Link>
            {!firebase?.isAuthLoaded ? (
              <div className="flex items-center justify-center w-12 h-12">
                <LoaderIcon className="w-6 h-6 text-gray-600 animate-spin" />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {firebase.user ? (
                  <>
                    <button
                      title="Your Saved Trips"
                      onClick={() => setIsSavedTripsOpen(true)}
                      className="relative flex items-center justify-center w-12 h-12 transition-colors rounded-full hover:bg-gray-100 group focus-ring"
                      aria-label={`View ${savedTrips.length} saved trips`}
                    >
                      <Heart className="w-8 h-8 text-gray-600 transition-colors group-hover:text-secondary" />
                      <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white rounded-full top-[-0px] right-[-0.1rem] bg-secondary">
                        {savedTrips.length}
                      </span>
                    </button>
                    <button
                      onClick={() => setIsProfileOpen(true)}
                      className="w-10 h-10 overflow-hidden transition-all rounded-full hover:ring-2 hover:ring-secondary hover:ring-offset-2 focus-ring"
                      aria-label="Open profile menu"
                    >
                      {firebase.user.profileImage ? (
                        <img
                          src={firebase.user.profileImage}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div
                          style={{
                            background: firebase.userGradient,
                          }}
                          className="w-full h-full"
                        ></div>
                      )}
                    </button>
                  </>
                ) : (
                  <CustomButton
                    buttonClassName="px-6 py-2"
                    onClickHandler={() => setIsAuthModalOpen(true)}
                    labelText="Sign In"
                    showIcon={false}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Saved Trips Panel */}
      <div
        ref={savedTripsRef}
        role="dialog"
        aria-label="Saved trips"
        aria-modal="true"
        className={`fixed inset-0 z-50 ${
          isSavedTripsOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } transition-opacity duration-300`}
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-y-0 right-0 w-full max-w-md">
          <div className="flex flex-col h-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-primary">
                Saved Trips
              </h2>
              <button
                onClick={() => setIsSavedTripsOpen(false)}
                className="p-2 transition-colors rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid gap-4">
                {savedTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="relative overflow-hidden rounded-lg cursor-pointer group"
                  >
                    <div className="absolute inset-0 z-10 transition-opacity bg-black/40 group-hover:opacity-60" />
                    <img
                      src={trip.image}
                      alt={trip.title}
                      className="object-cover w-full h-48 transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 z-20 flex flex-col justify-between p-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {trip.title}
                        </h3>
                        <p className="mt-1 text-white/90">{trip.location}</p>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-white/90">{trip.days} days</span>
                        <button className="p-2 transition-all duration-300 rounded-full opacity-0 bg-white/0 group-hover:opacity-100 group-hover:bg-white/10 hover:bg-white/20">
                          <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Panel */}
      <ProfilePanel
        profileRef={profileRef}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;
