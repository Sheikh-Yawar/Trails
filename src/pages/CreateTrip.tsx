import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Minus, Wallet, Hotel, Plane, ArrowLeft } from "lucide-react";
import AuthModal from "../components/AuthModal";
import CustomButton from "../components/CustomButton";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Option } from "react-google-places-autocomplete/build/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { GetUnsplashImage } from "../utils/GetUnsplashImage";
import {
  FoodPlaceType,
  HotelType,
  ItineraryDayType,
  PlaceType,
  TripDataType,
} from "../utils/CustomTypes";
import GetPlaceImageReference, { GetImageUrl } from "../utils/GetPlaceImage";
import { AI_PROMPT } from "../utils/Constants";
import { chatSession } from "../utils/AiModel";
import firebase from "firebase/compat/app";
import { useFirebase } from "../context/Firebase";

const CreateTrip = () => {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const [travelers, setTravelers] = useState(2);
  const [days, setDays] = useState(3);
  const [selectedBudget, setSelectedBudget] = useState<
    "cheap" | "moderate" | "luxury" | null
  >(null);
  const [currency, setCurrency] = useState("INR");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Option | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTravelersChange = (increment: boolean) => {
    setTravelers((prev) => {
      const newValue = increment ? prev + 1 : prev - 1;
      return Math.min(Math.max(newValue, 1), 10);
    });
  };

  const handleDaysChange = (increment: boolean) => {
    setDays((prev) => {
      const newValue = increment ? prev + 1 : prev - 1;
      return Math.max(newValue, 0);
    });
  };

  const handleGenerateTrip = async () => {
    if (!selectedPlace || !setSelectedBudget) {
      toast.error("Please select a place and budget");
      return;
    }

    setIsLoading(true);
    try {
      const tripId = uuidv4();

      const FINAL_PROMPT = AI_PROMPT.replace("{userDays}", days.toString())
        .replace("{userTravellers}", travelers.toString())
        .replace("{userDestination}", selectedPlace.label)
        .replace("{userBudget}", selectedBudget!)
        .replace("{userCurrency}", currency)
        .replace(
          "{userPrompt}",
          userPrompt.length > 0
            ? userPrompt
            : "No user prompt. Work your magic."
        );

      console.log(AI_PROMPT);

      const result = await chatSession.sendMessage(FINAL_PROMPT);

      let tripData = JSON.parse(result?.response?.text());

      const tripTitleImage = await GetUnsplashImage(selectedPlace?.label);

      tripData = {
        ...tripData,
        createdAt: Timestamp.fromDate(new Date()),
        tripTitleImage,
        tripId,
        userId: firebase?.user ? firebase.user.uid : "anonynmous",
        tripName: `${selectedPlace.value.structured_formatting.main_text} Trip`,
        tripDays: days,
        tripTravellers: travelers,
        isTripSaved: false,
        isCommunityTrip: false,
      };

      const updatedHotelOptionsWithImageRef = await Promise.all(
        tripData.hotelOptions.map(async (hotel: HotelType) => {
          const hotelImageReference = await GetPlaceImageReference(
            hotel.hotelName,
            hotel.hotelAddress
          );
          return { ...hotel, hotelImageReference };
        })
      );

      const updatedItineraryWithImageRef = await Promise.all(
        tripData.itinerary.map(async (day: ItineraryDayType) => {
          const updatedFoodPlaces = await Promise.all(
            day.foodPlaces.map(async (foodPlace: FoodPlaceType) => {
              const foodPlaceImageReference = await GetPlaceImageReference(
                foodPlace.foodPlaceName,
                foodPlace.foodPlaceAddress
              );
              return { ...foodPlace, foodPlaceImageReference };
            })
          );

          return { ...day, foodPlaces: updatedFoodPlaces };
        })
      );

      const updatedTrip = {
        ...tripData,
        hotelOptions: updatedHotelOptionsWithImageRef,
        itinerary: updatedItineraryWithImageRef,
      } as TripDataType;

      const updatedHotelOptionsWithImages = updatedTrip.hotelOptions.map(
        (hotel: HotelType) => {
          const hotelImage = GetImageUrl(hotel.hotelImageReference);

          return { ...hotel, hotelImage };
        }
      );

      const updatedItineraryWithImages = updatedTrip.itinerary.map((day) => {
        const updatedFoodPlaces = day.foodPlaces.map(
          (foodPlace: FoodPlaceType) => {
            const foodPlaceImage = GetImageUrl(
              foodPlace.foodPlaceImageReference
            );
            return { ...foodPlace, foodPlaceImage };
          }
        );

        return { ...day, foodPlaces: updatedFoodPlaces };
      });

      const updatedTrip2 = {
        ...tripData,
        hotelOptions: updatedHotelOptionsWithImages,
        itinerary: updatedItineraryWithImages,
      };
      console.log("Updated Trip Data", updatedTrip2);

      setIsLoading(false);

      sessionStorage.removeItem(`trails-${tripId}`);
      sessionStorage.setItem(`trails-${tripId}`, JSON.stringify(updatedTrip2));

      navigate(`/trip/${tripId}`);
    } catch (error) {
      console.log("Error generating trip", error);
      toast.error("Something went wrong. Please try again later.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-16">
        <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-primary">
              Plan Your Adventure
            </h1>

            {/* Destination */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-primary">
                Where would you like to go?
              </label>
              <div className="relative">
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
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-primary ">
                Tailor Your Trip (Optional)
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => {
                  if (e.target.value.length <= 150)
                    setUserPrompt(e.target.value);
                }}
                rows={4}
                className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300  outline-none appearance-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                placeholder="Describe your ideal travel experience! Mention themes like niche places, major tourist attractions, mountain or beach sightseeing, preferred locations, activities, dietary preferences, or any special requests."
              ></textarea>
            </div>

            <div className="flex flex-wrap items-baseline gap-y-5 md:gap-y-0 md:gap-x-20 ">
              <div className="w-full space-y-4 md:w-auto">
                <label className="block text-sm font-medium text-primary">
                  Select your preferred currency
                </label>
                <div className="relative group">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-3 transition-colors bg-white border border-gray-200 rounded-lg outline-none appearance-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  >
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="SAR">SAR - Saudi Riyal</option>
                    <option value="GBP">GBP - Pound Sterling</option>
                  </select>
                  <div className="absolute right-0 z-10 w-64 px-4 py-2 mt-2 text-sm text-white transition-opacity bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 top-full">
                    Trip costs will be displayed in your selected currency
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-5 md:gap-y-0 md:flex-nowrap md:gap-x-20">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-primary">
                    How many days?
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleDaysChange(false)}
                      className="flex items-center justify-center w-10 h-10 transition-colors border border-gray-200 rounded-full hover:border-secondary"
                      disabled={days === 0}
                    >
                      <Minus className="w-5 h-5 text-gray-500" />
                    </button>
                    <span className="w-12 text-xl font-semibold text-center text-primary">
                      {days}
                    </span>
                    <button
                      onClick={() => handleDaysChange(true)}
                      className="flex items-center justify-center w-10 h-10 transition-colors border border-gray-200 rounded-full hover:border-secondary"
                    >
                      <Plus className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-primary">
                    Number of travelers
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleTravelersChange(false)}
                      className="flex items-center justify-center w-10 h-10 transition-colors border border-gray-200 rounded-full hover:border-secondary"
                      disabled={travelers === 1}
                    >
                      <Minus className="w-5 h-5 text-gray-500" />
                    </button>
                    <span className="w-12 text-xl font-semibold text-center text-primary">
                      {travelers}
                    </span>
                    <button
                      onClick={() => handleTravelersChange(true)}
                      className="flex items-center justify-center w-10 h-10 transition-colors border border-gray-200 rounded-full hover:border-secondary"
                      disabled={travelers === 10}
                    >
                      <Plus className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-lg font-medium text-primary">
                What's your budget?
              </label>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <button
                  onClick={() => setSelectedBudget("cheap")}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-4 group hover:border-secondary ${
                    selectedBudget === "cheap"
                      ? "border-secondary bg-secondary/5"
                      : "border-gray-200"
                  }`}
                >
                  <Wallet
                    className={`w-8 h-8 transition-colors duration-200 ${
                      selectedBudget === "cheap"
                        ? "text-secondary"
                        : "text-gray-400 group-hover:text-secondary"
                    }`}
                  />
                  <div className="text-center">
                    <h3 className="font-semibold text-primary">Budget</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Best value for money
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedBudget("moderate")}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-4 group hover:border-secondary ${
                    selectedBudget === "moderate"
                      ? "border-secondary bg-secondary/5"
                      : "border-gray-200"
                  }`}
                >
                  <Hotel
                    className={`w-8 h-8 transition-colors duration-200 ${
                      selectedBudget === "moderate"
                        ? "text-secondary"
                        : "text-gray-400 group-hover:text-secondary"
                    }`}
                  />
                  <div className="text-center">
                    <h3 className="font-semibold text-primary">Comfort</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Balance of comfort and value
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedBudget("luxury")}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-4 group hover:border-secondary ${
                    selectedBudget === "luxury"
                      ? "border-secondary bg-secondary/5"
                      : "border-gray-200"
                  }`}
                >
                  <Plane
                    className={`w-8 h-8 transition-colors duration-200 ${
                      selectedBudget === "luxury"
                        ? "text-secondary"
                        : "text-gray-400 group-hover:text-secondary"
                    }`}
                  />
                  <div className="text-center">
                    <h3 className="font-semibold text-primary">Luxury</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Premium experiences
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-4 pt-8 sm:flex-row">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 px-6 py-3 transition-colors border-2 border-gray-200 rounded-lg text-primary hover:border-gray-300"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </Link>

              <CustomButton
                isLoading={isLoading}
                buttonClassName="flex-1 "
                onClickHandler={handleGenerateTrip}
                labelText="Generate Trip"
                iconClassName="transition-transform group-hover:scale-110"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default CreateTrip;
