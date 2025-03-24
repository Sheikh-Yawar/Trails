import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  X,
  ChevronRight,
  LoaderIcon,
  Calendar,
  Users,
  XCircle,
  Loader,
} from "lucide-react";
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
import { toast } from "react-toastify";
import { GetImageUrl, GetPlaceImageUrlAndRef } from "../utils/GetPlaceImage";
import { Timestamp } from "firebase/firestore";

const Header: React.FC = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const [isSavedTripsOpen, setIsSavedTripsOpen] = useState(false);
  const [savedTrips, setSavedTrips] = useState<TripDataType[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTripRemovingLoading, setIsTripRemovingLoading] = useState(false);
  const [isTripLoading, setIsTripLoading] = useState(false);
  const savedTripsRef = useFocusTrap(isSavedTripsOpen);
  const profileRef = useFocusTrap(isProfileOpen);

  useScrollLock(isSavedTripsOpen || isProfileOpen);

  useEffect(() => {
    if (firebase && firebase?.savedTrips) {
      console.log("Trip data is", firebase?.savedTrips);
      setSavedTrips(firebase.savedTrips);
    }
  }, [firebase, firebase?.savedTrips]);

  function isOlderThanThreeDays(timestamp: Timestamp): boolean {
    const threeDaysAgoMillis = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const timestampMillis = timestamp.toMillis();
    return timestampMillis < threeDaysAgoMillis;
  }

  const handleViewTripClick = async (tripId: string, index: number) => {
    if (savedTrips.length === 0) return;

    setIsTripLoading(true);
    let updatedTripData = savedTrips[index];

    if (isOlderThanThreeDays(updatedTripData.createdAt)) {
      console.log("Older than 30 days, hence fetching new data");
      const updatedHotelOptionsWithImages = (await Promise.all(
        savedTrips[index].hotelOptions.map(async (hotel: HotelType) => {
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
        savedTrips[index].itinerary.map(async (day) => {
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
        ...savedTrips[index],
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
            "favourites"
          );
        } catch (error) {
          console.log("Couldn't update the trip");
        }
      }
    } else {
      console.log("Rendering the same data ");
      const updatedHotelOptionsWithImages = savedTrips[index].hotelOptions.map(
        (hotel: HotelType) => {
          const hotelImage = GetImageUrl(hotel.hotelImageReference);

          return { ...hotel, hotelImage };
        }
      ) as HotelType[];

      const updatedItineraryWithImages = savedTrips[index].itinerary.map(
        (day) => {
          const updatedFoodPlaces = day.foodPlaces.map(
            (foodPlace: FoodPlaceType) => {
              const foodPlaceImage = GetImageUrl(
                foodPlace.foodPlaceImageReference
              );
              return { ...foodPlace, foodPlaceImage };
            }
          );

          return { ...day, foodPlaces: updatedFoodPlaces };
        }
      ) as ItineraryDayType[];

      updatedTripData = {
        ...savedTrips[index],
        hotelOptions: updatedHotelOptionsWithImages,
        itinerary: updatedItineraryWithImages,
      };
    }

    sessionStorage.setItem(`trails-${tripId}`, JSON.stringify(updatedTripData));
    setIsSavedTripsOpen(false);
    setIsTripLoading(false);

    navigate(`/trip/${tripId}`);
  };

  const handleRemoveTripClick = async (tripId: string) => {
    if (!tripId) {
      toast.error("Trip ID not found");
      return;
    }

    setIsTripRemovingLoading(true);

    try {
      const response = await firebase?.removeDataFromFireStore(
        "trips",
        tripId,
        "favourites"
      );
      toast.success(response);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
    setIsTripRemovingLoading(false);
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
                {savedTrips.map((trip, index) => (
                  <div
                    key={trip.tripId}
                    className="relative overflow-hidden rounded-lg cursor-pointer group"
                  >
                    <div className="absolute inset-0 z-10 transition-opacity bg-black/40 group-hover:opacity-60" />
                    <img
                      src={trip.tripTitleImage}
                      alt="Trip title Image"
                      className="object-cover w-full h-48 transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 ">
                      <div>
                        <div className="flex items-center justify-between ">
                          <h3 className="text-xl font-bold text-white">
                            {trip.tripName}
                          </h3>
                          <div
                            className="opacity-0 group-hover:opacity-70"
                            title="Remove from favourites"
                          >
                            {isTripRemovingLoading ? (
                              <Loader
                                className={`w-5 h-5 text-white animate-spin`}
                              />
                            ) : (
                              <XCircle
                                onClick={() =>
                                  handleRemoveTripClick(trip.tripId)
                                }
                                className="w-5 h-5 text-white"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2 text-white">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span className="text-sm">
                              {trip.tripDays} Days
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-3 h-3" />
                            <span className="text-sm">
                              {trip.tripTravellers} Travelers
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end ">
                        <button
                          title="View Trip"
                          className="p-2 transition-colors rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 animate-pulse-hover"
                        >
                          {isTripLoading ? (
                            <Loader
                              className={`w-5 h-5 text-white animate-spin`}
                            />
                          ) : (
                            <ChevronRight
                              onClick={() =>
                                handleViewTripClick(trip.tripId, index)
                              }
                              className="w-5 h-5 text-white"
                            />
                          )}
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
