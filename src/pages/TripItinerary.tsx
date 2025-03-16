import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MapPin, Plus, Bookmark, Calendar, Users, Trash2 } from "lucide-react";
import {
  foodPlaceType,
  hotelType,
  ItineraryDayType,
  tripDataType,
  PlaceType,
} from "../utils/CustomTypes";
import PlaceCard from "../components/PlaceCard";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Option } from "react-google-places-autocomplete/build/types";

const TripItinerary: React.FC = () => {
  const navigate = useNavigate();
  const { tripId } = useParams<{ tripId: string }>();
  const { state: tripData } = useLocation();
  console.log("Trip ID: ", tripId, tripData);
  if (!tripData) {
    navigate("/");
  }
  const [currentTripData, setCurrentTripData] =
    useState<tripDataType>(tripData);
  const [isTripSaved, setIsTripSaved] = useState(false);
  const [editingDayId, setEditingDayId] = useState<number | null>(null);

  const openGoogleMaps = (hotelName: string, hotelAddress: string) => {
    const query = encodeURIComponent(`${hotelName}, ${hotelAddress}`);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(mapsUrl, "_blank"); // Opens in a new tab
  };

  const handleDeletePlace = (dayId: number, placeId: number) => {};

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative h-[40vh] group overflow-hidden mt-24 rounded-2xl">
          <div className="absolute inset-0 z-10 bg-black/40" />
          <img
            src={currentTripData.tripTitleImage}
            alt="Trip Title Image"
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                  Japanese Cultural Journey
                </h1>
                <div className="flex items-center gap-6 text-white/90">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-lg">12 Days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span className="text-lg">2 Travelers</span>
                  </div>
                </div>
              </div>
              <div className="has-tooltip">
                <button
                  onClick={() => setIsTripSaved(!isTripSaved)}
                  className="p-3 transition-colors rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 animate-pulse-hover"
                >
                  <Bookmark
                    className={`w-6 h-6 ${
                      isTripSaved ? "fill-white text-white" : "text-white"
                    }`}
                  />
                </button>
                <span className="absolute px-2 py-1 text-sm text-white rounded tooltip bg-black/75 -left-8 -bottom-8">
                  Save Trip
                </span>
              </div>
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
            {currentTripData.itinerary.map((day, index) => (
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
                <div className="flex gap-6 px-4 pb-6 overflow-x-auto scrollbar-thin ">
                  {currentTripData.itinerary[index].foodPlaces.map(
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
                          key={`${index}-${foodPlace.foodPlaceName}`}
                          openGoogleMaps={openGoogleMaps}
                        />
                      );
                    }
                  )}
                </div>
                <div className="space-y-4">
                  {currentTripData.itinerary[index].placesToVisit.map(
                    (place, PlaceToVisitindex) => (
                      <div
                        key={`${PlaceToVisitindex}-${place.placeName}`}
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
                                {currentTripData.itinerary[index].placesToVisit[
                                  PlaceToVisitindex
                                ].bestTimeToVisit.map((time: string) => {
                                  return (
                                    <span className="px-2 text-white bg-gray-600 rounded-full mt-1 text-[5px]">
                                      {time}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleDeletePlace(day.dayNumber, index)
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
                      setCurrentTripData={setCurrentTripData}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AddActivityForm = ({
  dayNumber,
  setCurrentTripData,
  setEditingDayId,
}: {
  dayNumber: number;
  setEditingDayId: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentTripData: React.Dispatch<React.SetStateAction<tripDataType>>;
}) => {
  const [selectedPlace, setSelectedPlace] = useState<Option | null>(null);
  const [activityDescription, setActivityDescription] = useState("");
  const [bestTime, setBestTime] = useState("");

  const handleAddActivity = () => {
    console.log("Adding activity for day", selectedPlace);
    if (!selectedPlace) return; // Prevent adding an empty activity

    const bestTimeArray = [bestTime];

    setCurrentTripData((prev) => {
      const updatedItinerary = prev.itinerary.map((day) => {
        if (day.dayNumber === dayNumber) {
          return {
            ...day,
            placesToVisit: [
              ...day.placesToVisit,
              {
                placeName: selectedPlace.label,
                placeAddress: selectedPlace.label,
                description: activityDescription,
                bestTimeToVisit: bestTimeArray,
              },
            ],
          };
        }
        return day;
      });

      return { ...prev, itinerary: updatedItinerary };
    });

    setEditingDayId(null);
  };

  return (
    <div className="p-4 bg-white border-2 rounded-lg border-secondary animate-fade-in">
      <div className="space-y-4">
        <div>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              value: selectedPlace,
              onChange: (value) => {
                console.log("Google Maps value is", value);
                setSelectedPlace(value);
              },
            }}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Activity description"
            value={activityDescription}
            onChange={(e) => {
              setActivityDescription(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Best time to visit (e.g., 9:00 AM - 11:00 AM)"
            value={bestTime}
            onChange={(e) => {
              setBestTime(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddActivity}
            className="flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-secondary hover:bg-secondary/90"
          >
            Save
          </button>
          <button
            onClick={() => {
              setEditingDayId(null);
              setSelectedPlace(null);
              setActivityDescription("");
              setBestTime("");
            }}
            className="flex-1 px-4 py-2 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default TripItinerary;
