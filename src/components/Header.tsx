import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, X, LoaderIcon, Globe } from "lucide-react";
import AuthModal from "./AuthModal";
import { useScrollLock } from "../utils/ScrollLockManager";
import { useFocusTrap } from "../utils/FocusTrap";
import CustomButton from "./CustomButton";
import { useFirebase } from "../context/Firebase";
import ProfilePanel from "./ProfilePanel";
import {
  FoodPlaceType,
  HotelType,
  ItineraryDayType,
  TripDataType,
} from "../utils/CustomTypes";

import { GetImageUrl, GetPlaceImageUrlAndRef } from "../utils/GetPlaceImage";
import { Timestamp } from "firebase/firestore";
import TripCard from "./TripCard";

const Header: React.FC = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const [isSavedTripsOpen, setIsSavedTripsOpen] = useState(false);
  const [isCommunityTripsOpen, setIsCommunityTripsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [savedTrips, setSavedTrips] = useState<TripDataType[]>([]);
  const [communityTrips, setCommunityTrips] = useState<TripDataType[]>([]);
  const [isTripLoadingIndex, setIsTripLoadingIndex] = useState(-1);
  const [showImage, setShowImage] = useState(true);
  const savedTripsRef = useFocusTrap(isSavedTripsOpen);
  const communityTripsRef = useFocusTrap(isCommunityTripsOpen);
  const profileRef = useFocusTrap(isProfileOpen);

  useScrollLock(isSavedTripsOpen || isProfileOpen || isCommunityTripsOpen);

  useEffect(() => {
    if (!firebase) return;
    if (firebase.userSavedTrips) {
      console.log("Saved Trip data is", firebase.userSavedTrips);
      setSavedTrips(firebase.userSavedTrips);
    }
    if (firebase.userCommunityTrips) {
      console.log("Community Trip data is", firebase.userCommunityTrips);
      setCommunityTrips(firebase.userCommunityTrips);
    }
  }, [firebase, firebase?.userSavedTrips, firebase?.userCommunityTrips]);

  function isOlderThanThreeDays(timestamp: Timestamp | Date | number): boolean {
    console.log("Timestamp is", timestamp);
    const threeDaysAgoMillis = Date.now() - 3 * 24 * 60 * 60 * 1000;
    let timestampMillis: number;

    if (timestamp instanceof Timestamp) {
      timestampMillis = timestamp.toMillis();
    } else if (timestamp instanceof Date) {
      timestampMillis = timestamp.getTime();
    } else if (typeof timestamp === "number") {
      timestampMillis = timestamp;
    } else {
      return false;
    }
    return timestampMillis < threeDaysAgoMillis;
  }

  const handleViewTripClick = async (
    tripId: string,
    index: number,
    trip: TripDataType,
    collection: "favourites" | "community"
  ) => {
    if (!trip) return;

    setIsTripLoadingIndex(index);
    let updatedTripData = trip;

    if (isOlderThanThreeDays(updatedTripData.createdAt)) {
      console.log("Older than 30 days, hence fetching new data");
      const updatedHotelOptionsWithImages = (await Promise.all(
        trip.hotelOptions.map(async (hotel: HotelType) => {
          const { imageUrl, imageRef } = await GetPlaceImageUrlAndRef(
            hotel.hotelName,
            hotel.hotelAddress,
            hotel.hotelImageReference
          );
          if (imageRef) {
            hotel.hotelImageReference = imageRef;
          }
          return { ...hotel, hotelImage: imageUrl };
        })
      )) as HotelType[];

      const updatedItineraryWithImage = (await Promise.all(
        trip.itinerary.map(async (day) => {
          const updatedFoodPlaces = await Promise.all(
            day.foodPlaces.map(async (foodPlace: FoodPlaceType) => {
              const { imageUrl, imageRef } = await GetPlaceImageUrlAndRef(
                foodPlace.foodPlaceName,
                foodPlace.foodPlaceAddress,
                foodPlace.foodPlaceImageReference
              );
              if (imageRef) {
                foodPlace.foodPlaceImageReference = imageRef;
              }
              return { ...foodPlace, foodPlaceImageReference: imageUrl };
            })
          );

          return { ...day, foodPlaces: updatedFoodPlaces };
        })
      )) as ItineraryDayType[];

      updatedTripData = {
        ...trip,
        createdAt: Timestamp.fromDate(new Date()),
        hotelOptions: updatedHotelOptionsWithImages,
        itinerary: updatedItineraryWithImage,
      };

      if (firebase && firebase?.user) {
        try {
          await firebase?.saveDataToFireStore(
            "trips",
            updatedTripData,
            tripId,
            firebase.user.uid,
            collection
          );
        } catch (error) {
          console.log("Couldn't update the trip");
        }
      }
    } else {
      console.log("Rendering the same data ");
      const updatedHotelOptionsWithImages = trip.hotelOptions.map(
        (hotel: HotelType) => {
          const hotelImage = GetImageUrl(hotel.hotelImageReference);

          return { ...hotel, hotelImage };
        }
      ) as HotelType[];

      const updatedItineraryWithImages = trip.itinerary.map((day) => {
        const updatedFoodPlaces = day.foodPlaces.map(
          (foodPlace: FoodPlaceType) => {
            const foodPlaceImage = GetImageUrl(
              foodPlace.foodPlaceImageReference
            );
            return { ...foodPlace, foodPlaceImage };
          }
        );

        return { ...day, foodPlaces: updatedFoodPlaces };
      }) as ItineraryDayType[];

      updatedTripData = {
        ...trip,
        hotelOptions: updatedHotelOptionsWithImages,
        itinerary: updatedItineraryWithImages,
      };
    }

    sessionStorage.removeItem(`trails-${tripId}`);
    sessionStorage.setItem(`trails-${tripId}`, JSON.stringify(updatedTripData));
    setIsSavedTripsOpen(false);
    setIsCommunityTripsOpen(false);
    setIsTripLoadingIndex(-1);

    navigate(`/trip/${tripId}`);
  };

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
                      title="Favourite Trips"
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
                      title="Shared with community Trips"
                      onClick={() => setIsCommunityTripsOpen(true)}
                      className="relative flex items-center justify-center w-12 h-12 transition-colors rounded-full hover:bg-gray-100 group focus-ring"
                      aria-label={`View ${communityTrips.length} saved trips`}
                    >
                      <Globe className="w-8 h-8 text-gray-600 transition-colors group-hover:text-secondary" />
                      <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white rounded-full top-[-0px] right-[-0.1rem] bg-secondary">
                        {communityTrips.length}
                      </span>
                    </button>
                    <button
                      onClick={() => setIsProfileOpen(true)}
                      className="w-10 h-10 overflow-hidden transition-all rounded-full hover:ring-2 hover:ring-secondary hover:ring-offset-2 focus-ring"
                      aria-label="Open profile menu"
                    >
                      {showImage && firebase.user.profileImage ? (
                        <img
                          src={firebase.user.profileImage}
                          alt="Profile"
                          onLoad={() => {
                            setShowImage(true);
                          }}
                          onError={() => {
                            console.log(
                              "Error loading profile image",
                              firebase.userGradient
                            );
                            setShowImage(false);
                          }}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div
                          style={{
                            background: "#f3f4f6",
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
              <h2 className="text-xl font-semibold text-primary">User Trips</h2>
              <button
                onClick={() => setIsSavedTripsOpen(false)}
                className="p-2 transition-colors rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid gap-4">
                {savedTrips.map((trip, index) => (
                  <TripCard
                    key={`${trip.tripTitleImage}-${index}`}
                    collection="favourites"
                    trip={trip}
                    isTripLoadingIndex={isTripLoadingIndex}
                    handleViewTripClick={handleViewTripClick}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Trips Panel */}
      <div
        ref={communityTripsRef}
        role="dialog"
        aria-label="Community trips"
        aria-modal="true"
        className={`fixed inset-0 z-50 ${
          isCommunityTripsOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } transition-opacity duration-300`}
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-y-0 right-0 w-full max-w-md">
          <div className="flex flex-col h-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-primary">
                Shared with Community Trips
              </h2>
              <button
                onClick={() => setIsCommunityTripsOpen(false)}
                className="p-2 transition-colors rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid gap-4">
                {communityTrips.map((trip, index) => (
                  <TripCard
                    key={`${trip.tripTitleImage}-${index}`}
                    collection="community"
                    trip={trip}
                    isTripLoadingIndex={isTripLoadingIndex}
                    handleViewTripClick={handleViewTripClick}
                    index={index}
                  />
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
