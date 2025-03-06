import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Plus,
  Minus,
  Wallet,
  Hotel,
  Plane,
  ArrowLeft,
} from "lucide-react";
import AuthModal from "../components/AuthModal";
import CustomButton from "../components/CustomButton";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const CreateTrip = () => {
  const navigate = useNavigate();
  const [travelers, setTravelers] = useState(1);
  const [days, setDays] = useState(1);
  const [selectedBudget, setSelectedBudget] = useState<
    "cheap" | "moderate" | "luxury" | null
  >(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPlacesInputEmpty, setIsPlacesInputEmpty] = useState(true);

  useEffect(() => {
    const placesInput = document.querySelector(
      "#react-select-3-input"
    ) as HTMLInputElement;
    const placesInputPlaceholder = document.querySelector(
      ".css-1jqq78o-placeholder"
    );
    if (!placesInput || !placesInputPlaceholder) return;

    placesInputPlaceholder.textContent = "Select your destination";

    const observer = new MutationObserver(() => {
      setIsPlacesInputEmpty(placesInput.value.length === 0);
    });
    observer.observe(placesInput, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    // Cleanup
    return () => observer.disconnect();
  }, []);

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

  const handleGenerateTrip = () => {
    // For now, we'll navigate to a hardcoded trip ID
    // In a real application, this would be generated on the backend
    navigate("/trip/1");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-16">
        <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="space-y-12">
            <h1 className="text-3xl font-bold text-primary">
              Plan Your Adventure
            </h1>

            {/* Destination */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-primary">
                Where would you like to go?
              </label>
              <div className="relative">
                {isPlacesInputEmpty && (
                  <MapPin className="absolute z-20 w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2" />
                )}
                <GooglePlacesAutocomplete
                  apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                />
              </div>
            </div>

            {/* Trip Details Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Currency Selector */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-primary">
                  Select your preferred currency
                </label>
                <div className="relative group">
                  <select className="w-full px-4 py-3 transition-colors bg-white border border-gray-200 rounded-lg outline-none appearance-none focus:border-secondary focus:ring-1 focus:ring-secondary">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                  <div className="absolute right-0 z-10 w-64 px-4 py-2 mt-2 text-sm text-white transition-opacity bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 top-full">
                    Trip costs will be displayed in your selected currency
                  </div>
                </div>
              </div>

              {/* Trip Days */}
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

              {/* Number of Travelers */}
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

            {/* Budget Selection */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-primary">
                What's your budget?
              </label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
            <div className="flex flex-col gap-4 pt-8 sm:flex-row">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 px-6 py-3 transition-colors border-2 border-gray-200 rounded-lg text-primary hover:border-gray-300"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </Link>
              <CustomButton
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
