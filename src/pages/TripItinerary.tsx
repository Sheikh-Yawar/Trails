import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Plus,
  Calendar,
  Users,
  Trash2,
  Loader,
  Heart,
  Globe,
} from "lucide-react";
import { TripDataType } from "../utils/CustomTypes";

import PlaceCard from "../components/PlaceCard";
import AddActivityForm from "../components/AddActivityForm";
import { useFirebase } from "../context/Firebase";
import { toast } from "react-toastify";
import { Option } from "react-google-places-autocomplete/build/types";
import { Timestamp } from "firebase/firestore";

const TripItinerary: React.FC = () => {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const { tripId } = useParams<{ tripId: string }>();
  const [currentTripData, setCurrentTripData] = useState<TripDataType | null>(
    null
  );
  const [isTripSavingLoading, setIsTripSavingLoading] = useState(false);
  const [isCommunityTripLoading, setIsCommunityTripLoading] = useState(false);
  const [editingDayId, setEditingDayId] = useState<number | null>(null);

  useEffect(() => {
    if (!tripId) {
      toast.error("No  tripId found. Navigating to home page...");
      setTimeout(() => {
        navigate("/");
      }, 5000);
      return;
    }

    if (typeof window !== "undefined") {
      // Check if running in browser
      const data = sessionStorage.getItem(`trails-${tripId}`);
      if (data) {
        console.log("Trip data is", JSON.parse(data));
        setCurrentTripData(JSON.parse(data) as TripDataType);
      } else {
        toast.error("No trip data found. Navigating to home page...");
        setTimeout(() => {
          navigate("/");
        }, 5000);
      }
    }
  }, [tripId]);

  const openGoogleMaps = (hotelName: string, hotelAddress: string) => {
    const query = encodeURIComponent(`${hotelName}, ${hotelAddress}`);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(mapsUrl, "_blank"); // Opens in a new tab
  };

  const handleShareToCommunityClick = async () => {
    if (!tripId) {
      toast.error("Trip ID not found");
      return;
    }

    if (!firebase?.user) {
      toast.error("User not found. Please signup/login to save trips.");
      return;
    }
    setIsCommunityTripLoading(true);
    try {
      if (!currentTripData) {
        console.log("Current Trip Data is empty");
        return;
      }
      const updatedTripData = {
        ...currentTripData,
        isCommunityTrip: true,
      };
      const response = await firebase?.saveDataToFireStore(
        "trips",
        updatedTripData,
        tripId,
        firebase?.user?.uid,
        "community"
      );
      toast.success(response);
      sessionStorage.setItem(
        `trails-${tripId}`,
        JSON.stringify(updatedTripData)
      );
      setCurrentTripData(updatedTripData);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
    setIsCommunityTripLoading(false);
  };

  const handleTripSaveClick = async () => {
    if (!tripId) {
      toast.error("Trip ID not found");
      return;
    }

    if (!firebase?.user) {
      toast.error("User not found. Please signup/login to save trips.");
      return;
    }

    setIsTripSavingLoading(true);
    try {
      if (!currentTripData) {
        console.log("Current Trip Data is empty");
        return;
      }
      const updatedTripData = {
        ...currentTripData,
        isTripSaved: true,
      };
      const response = await firebase?.saveDataToFireStore(
        "trips",
        updatedTripData,
        tripId,
        firebase?.user?.uid,
        "favourites"
      );
      toast.success(response);

      sessionStorage.setItem(
        `trails-${tripId}`,
        JSON.stringify(updatedTripData)
      );
      setCurrentTripData(updatedTripData);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
    setIsTripSavingLoading(false);
  };

  const handleRemoveTripSaveClick = async (tripId: string) => {
    if (!tripId) {
      toast.error("Trip ID not found");
      return;
    }

    setIsTripSavingLoading(true);

    try {
      if (!currentTripData) {
        console.log("Current Trip Data is empty");
        return;
      }

      const updatedTripData = {
        ...currentTripData,
        isTripSaved: false,
      };
      const response = await firebase?.removeDataFromFireStore(
        "trips",
        tripId,
        "favourites"
      );
      toast.success(response);

      sessionStorage.setItem(
        `trails-${tripId}`,
        JSON.stringify(updatedTripData)
      );
      setCurrentTripData(updatedTripData);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
    setIsTripSavingLoading(false);
  };

  const handleRemoveFromCommunityClick = async (tripId: string) => {
    if (!tripId) {
      toast.error("Trip ID not found");
      return;
    }

    setIsCommunityTripLoading(true);

    try {
      if (!currentTripData) {
        console.log("Current Trip Data is empty");
        return;
      }

      const updatedTripData = {
        ...currentTripData,
        isCommunityTrip: false,
      };
      const response = await firebase?.removeDataFromFireStore(
        "trips",
        tripId,
        "community"
      );
      toast.success(response);

      sessionStorage.setItem(
        `trails-${tripId}`,
        JSON.stringify(updatedTripData)
      );
      setCurrentTripData(updatedTripData);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
    setIsCommunityTripLoading(false);
  };

  const handleDeletePlace = (dayId: number, placeId: number) => {
    if (!currentTripData) {
      console.log("Current Trip Data is empty");
      return;
    }

    const updatedItinerary = currentTripData.itinerary.map((day, index) => {
      if (index === dayId) {
        return {
          ...day,
          placesToVisit: day.placesToVisit.filter(
            (_, index) => index !== placeId
          ),
        };
      } else {
        return day;
      }
    });

    const updatedTripData = {
      ...currentTripData,
      itinerary: updatedItinerary,
    };
    sessionStorage.setItem(`trails-${tripId}`, JSON.stringify(updatedTripData));
    setCurrentTripData(updatedTripData);
  };

  const handleAddPlace = (
    selectedPlace: Option | null,
    placeDescription: string,
    dayNumber: number,
    bestTimeArray: {
      from: string;
      to: string;
    }[]
  ) => {
    if (
      !selectedPlace ||
      placeDescription === "" ||
      bestTimeArray[0].from === "" ||
      bestTimeArray[0].to === ""
    ) {
      toast.error("Please fill all the fields.");
      return; // Prevent adding an empty activity
    }
    const updatedBestTimeArray = bestTimeArray.map((time) => {
      return `${time.from} - ${time.to}`;
    });

    if (!currentTripData) {
      console.log("Current Trip Data is empty");
      return;
    }

    const updatedItinerary = currentTripData.itinerary.map((day) => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          placesToVisit: [
            ...day.placesToVisit,
            {
              placeName: selectedPlace.label,
              placeAddress: selectedPlace.label,
              description: placeDescription,
              bestTimeToVisit: updatedBestTimeArray,
            },
          ],
        };
      }
      return day;
    });

    const updatedTripData = {
      ...currentTripData,
      itinerary: updatedItinerary,
    };

    sessionStorage.setItem(`trails-${tripId}`, JSON.stringify(updatedTripData));
    setCurrentTripData(updatedTripData);
    setEditingDayId(null);
  };

  return (
    <div>
      {currentTripData ? (
        <div className="min-h-screen bg-white">
          {/* Hero Section */}
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative h-[40vh] group overflow-hidden mt-24 rounded-2xl">
              <div className="absolute inset-0 z-10 bg-black/40" />
              <img
                loading="lazy"
                src={currentTripData.tripTitleImage}
                alt="Trip Title Image"
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-center px-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="mb-4 text-4xl font-bold text-white overflow-clip sm:text-5xl lg:text-6xl">
                      {currentTripData.tripName}
                    </h1>
                    <div className="flex items-center gap-6 text-white/90">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span className="text-lg">
                          {currentTripData.tripDays} Days
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span className="text-lg">
                          {currentTripData.tripTravellers} Travelers
                        </span>
                      </div>
                    </div>
                  </div>
                  {firebase?.user?.uid === currentTripData.userId && (
                    <div className="flex gap-2">
                      <button
                        title={
                          currentTripData.isTripSaved
                            ? "Remove from favourites"
                            : "Add to favourites"
                        }
                        onClick={async () => {
                          if (!firebase?.user) {
                            toast.info("Please login/signup to save the trip.");
                            return;
                          }
                          if (isTripSavingLoading) return;
                          console.log("Req sent");
                          if (!currentTripData.isTripSaved) {
                            handleTripSaveClick();
                          } else {
                            handleRemoveTripSaveClick(tripId!);
                          }
                        }}
                        className="p-3 transition-colors rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 animate-pulse-hover"
                      >
                        {isTripSavingLoading ? (
                          <Loader
                            className={`w-6 h-6 text-white animate-spin`}
                          />
                        ) : (
                          <Heart
                            className={`w-6 h-6 ${
                              currentTripData.isTripSaved
                                ? "fill-red-500 text-red-500"
                                : "text-white"
                            }`}
                          />
                        )}
                      </button>
                      <button
                        title={
                          currentTripData.isCommunityTrip
                            ? "Remove from Community"
                            : "Share with Community"
                        }
                        onClick={async () => {
                          if (!firebase?.user) {
                            toast.info(
                              "Please login/signup inorder to share the trip."
                            );
                            return;
                          }
                          if (isCommunityTripLoading) return;
                          if (!currentTripData.isCommunityTrip) {
                            handleShareToCommunityClick();
                          } else {
                            handleRemoveFromCommunityClick(tripId!);
                          }
                        }}
                        className="p-3 transition-colors rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 animate-pulse-hover"
                      >
                        {" "}
                        {isCommunityTripLoading ? (
                          <Loader
                            className={`w-6 h-6 text-white animate-spin`}
                          />
                        ) : (
                          <Globe
                            className={`w-6 h-6  ${
                              currentTripData.isCommunityTrip
                                ? "text-blue-400"
                                : "text-white"
                            }`}
                          />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Accommodations Section */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-primary">
                Accommodations
              </h2>

              <div className="flex gap-6 px-4 pb-6 overflow-x-auto scrollbar-thin">
                {currentTripData.hotelOptions.map((hotel, index) => {
                  return (
                    <PlaceCard
                      cardType="accomodation"
                      height={500}
                      address={hotel.hotelAddress}
                      description={hotel.description}
                      image={hotel.hotelImage}
                      name={hotel.hotelName}
                      pricePerNight={hotel.pricePerNight}
                      rating={hotel.rating}
                      openGoogleMaps={openGoogleMaps}
                      key={`${index}-${hotel.hotelName}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Itinerary Section */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-primary">
                Daily Itinerary
              </h2>
              <div className="space-y-6">
                {currentTripData.itinerary.map((day, dayIndex) => (
                  <div
                    key={day.dayNumber}
                    className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md animate-fade-in"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-primary">
                          Day {day.dayNumber}
                        </h3>
                        <p className="text-secondary">{day.dayTheme}</p>
                      </div>
                    </div>
                    <h2 className="pb-2 pl-5 text-xl font-bold text-primary">
                      Recommended Food Places
                    </h2>
                    <div className="flex gap-6 p-4 overflow-x-auto scrollbar-thin ">
                      {currentTripData.itinerary[dayIndex].foodPlaces.map(
                        (foodPlace, index) => {
                          return (
                            <PlaceCard
                              height={440}
                              cardType="restaurant"
                              address={foodPlace.foodPlaceAddress}
                              description={foodPlace.description}
                              image={foodPlace.foodPlaceImage}
                              name={foodPlace.foodPlaceName}
                              rating={foodPlace.rating}
                              pricePerNight={
                                foodPlace.approximatePricePerPerson
                              }
                              key={`${index}-${foodPlace.foodPlaceName}`}
                              openGoogleMaps={openGoogleMaps}
                            />
                          );
                        }
                      )}
                    </div>
                    <div>
                      <h2 className="pt-2 pl-5 text-xl font-bold text-primary">
                        Recommended Places to visit
                      </h2>
                      <div className="p-4 space-y-4">
                        {currentTripData.itinerary[dayIndex].placesToVisit.map(
                          (place, placeToVisitindex) => (
                            <div
                              key={`${placeToVisitindex}-${place.placeName}`}
                              className="p-4 transition-all duration-300 rounded-lg bg-gray-50 hover:bg-gray-100"
                            >
                              <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                  <h4
                                    onClick={() =>
                                      openGoogleMaps(
                                        place.placeName,
                                        place.placeAddress
                                      )
                                    }
                                    className="font-medium cursor-pointer text-primary hover:underline"
                                  >
                                    {place.placeName}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {place.description}
                                  </p>
                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" />
                                      Best Time:
                                      {place.bestTimeToVisit.map(
                                        (time: string, index: number) => {
                                          return (
                                            <span
                                              key={`time-${index}`}
                                              className="px-2 text-white bg-gray-600 rounded-full mt-1 text-[5px]"
                                            >
                                              {time}
                                            </span>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    handleDeletePlace(
                                      dayIndex,
                                      placeToVisitindex
                                    )
                                  }
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )
                        )}

                        {editingDayId === day.dayNumber ? (
                          <AddActivityForm
                            dayNumber={editingDayId}
                            setEditingDayId={setEditingDayId}
                            handleAddPlace={handleAddPlace}
                          />
                        ) : (
                          <button
                            onClick={() => setEditingDayId(day.dayNumber)}
                            className="flex items-center justify-center w-full gap-2 py-3 text-gray-500 transition-colors border-2 border-gray-200 border-dashed rounded-lg hover:border-secondary hover:text-secondary"
                          >
                            <Plus className="w-5 h-5" />
                            Add Activity
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default TripItinerary;
