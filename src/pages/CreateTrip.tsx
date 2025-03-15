import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Minus, Wallet, Hotel, Plane, ArrowLeft } from "lucide-react";
import AuthModal from "../components/AuthModal";
import CustomButton from "../components/CustomButton";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Option } from "react-google-places-autocomplete/build/types";
import { GetUnsplashImage } from "../utils/GetUnsplashImage";
import { v4 as uuidv4 } from "uuid";

const CreateTrip = () => {
  const navigate = useNavigate();
  const [travelers, setTravelers] = useState(1);
  const [days, setDays] = useState(1);
  const [selectedBudget, setSelectedBudget] = useState<
    "cheap" | "moderate" | "luxury" | null
  >(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Option | null>(null);

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
    console.log("Selected Place is", selectedPlace);
    let tripTitleImage = null;
    if (selectedPlace) {
      tripTitleImage = await GetUnsplashImage(selectedPlace?.label);
      console.log(tripTitleImage);
    }

    const tripData = {
      tripTitleImage:
        "https://images.unsplash.com/photo-1629929065472-9b9afa7481ed?ixid=M3w3MTA0OTB8MHwxfHNlYXJjaHwxfHxKYW1tdSUyMGFuZCUyMEthc2htaXIlMjB0cmlwfGVufDB8MHx8fDE3NDIwMzIxMDB8MA&ixlib=rb-4.0.3&w=3840&h=2160&fit=crop",
      hotelOptions: [
        {
          hotelName: "Radisson Blu Jammu",
          hotelAddress:
            "Manda Hills, Bypass Road, Jammu, Jammu and Kashmir 180007, India",
          pricePerNight: {
            fromPrice: 80,
            toPrice: 120,
          },
          geoCoordinates: {
            latitude: 32.7167,
            longitude: 74.8563,
          },
          rating: 4.2,
          description:
            "A luxury hotel featuring modern amenities, multiple dining options, a spa, and a swimming pool.",
        },
        {
          hotelName: "Lemon Tree Hotel Jammu",
          hotelAddress:
            "Rail Head Complex, Trikuta Nagar, Jammu, Jammu and Kashmir 180012, India",
          pricePerNight: {
            fromPrice: 60,
            toPrice: 90,
          },
          geoCoordinates: {
            latitude: 32.7175,
            longitude: 74.8731,
          },
          rating: 4.0,
          description:
            "A contemporary hotel with comfortable rooms, a multi-cuisine restaurant, and a fitness center.",
        },
        {
          hotelName: "Country Inn & Suites by Radisson, Jammu",
          hotelAddress:
            "15-A, Gandhi Nagar, Jammu, Jammu and Kashmir 180004, India",
          pricePerNight: {
            fromPrice: 50,
            toPrice: 80,
          },
          geoCoordinates: {
            latitude: 32.7217,
            longitude: 74.8664,
          },
          rating: 3.8,
          description:
            "Offers comfortable accommodations, on-site dining, and a range of facilities for a pleasant stay.",
        },
        {
          hotelName: "Hotel Himgiri",
          hotelAddress:
            "Resham Ghar Colony, Hari Market, Jammu, Jammu and Kashmir 180001, India",
          pricePerNight: {
            fromPrice: 30,
            toPrice: 50,
          },
          geoCoordinates: {
            latitude: 32.7307,
            longitude: 74.8694,
          },
          rating: 3.4,
          description:
            "A budget-friendly option providing basic amenities and a convenient location in the city center.",
        },
        {
          hotelName: "Bloom Hotel - Jammu",
          hotelAddress:
            "C-5, Trikuta Nagar, Jammu, Jammu and Kashmir 180012, India",
          pricePerNight: {
            fromPrice: 40,
            toPrice: 70,
          },
          geoCoordinates: {
            latitude: 32.717,
            longitude: 74.872,
          },
          rating: 4.2,
          description:
            "A modern hotel offering stylish rooms, complimentary breakfast, and essential amenities for a comfortable stay.",
        },
      ],
      itinerary: [
        {
          dayNumber: 1,
          dayTheme: "Jammu City Tour",
          placesToVisit: [
            {
              placeName: "Raghunath Temple",
              description:
                "One of the largest temple complexes in Jammu, dedicated to Lord Rama. Features intricate architecture and a vast collection of Hindu deities.",
              geoCoordinates: {
                latitude: 32.7275,
                longitude: 74.8547,
              },
            },
            {
              placeName: "Bahu Fort",
              description:
                "A historic fort overlooking the Tawi River, offering panoramic views of the city. Includes the Bawe Wali Mata Temple, a significant Hindu shrine.",
              geoCoordinates: {
                latitude: 32.7231,
                longitude: 74.8889,
              },
            },
            {
              placeName: "Mubarak Mandi Palace",
              description:
                "A former royal residence showcasing a blend of Rajasthani, Mughal, and European architectural styles. A significant heritage site with historical importance.",
              geoCoordinates: {
                latitude: 32.7289,
                longitude: 74.8503,
              },
            },
            {
              placeName: "Amar Mahal Museum",
              description:
                "A palace-turned-museum displaying Dogra dynasty artifacts, art galleries, and a golden throne. Offers insights into the region's royal history.",
              geoCoordinates: {
                latitude: 32.7378,
                longitude: 74.8725,
              },
            },
          ],
        },
        {
          dayNumber: 2,
          dayTheme: "Srinagar - Mughal Gardens",
          placesToVisit: [
            {
              placeName: "Shalimar Bagh Mughal Garden",
              description:
                "A beautiful Mughal garden built by Emperor Jahangir for his wife Nur Jahan. Known for its terraced lawns, fountains, and vibrant flowers.",
              geoCoordinates: {
                latitude: 34.1156,
                longitude: 74.8889,
              },
            },
            {
              placeName: "Nishat Bagh",
              description:
                "Another stunning Mughal garden, located on the banks of Dal Lake. Offers breathtaking views of the lake and the surrounding mountains.",
              geoCoordinates: {
                latitude: 34.1022,
                longitude: 74.8797,
              },
            },
            {
              placeName: "Chashme Shahi",
              description:
                "A smaller Mughal garden famous for its natural spring. Offers panoramic views of Dal Lake and the Zabarwan mountain range.",
              geoCoordinates: {
                latitude: 34.0911,
                longitude: 74.8742,
              },
            },
            {
              placeName: "Pari Mahal",
              description:
                "A historic monument and terraced garden offering stunning views of Dal Lake and Srinagar. Once a Buddhist monastery and later a royal observatory.",
              geoCoordinates: {
                latitude: 34.0872,
                longitude: 74.8708,
              },
            },
          ],
        },
        {
          dayNumber: 3,
          dayTheme: "Srinagar - Dal Lake & Local Exploration",
          placesToVisit: [
            {
              placeName: "Dal Lake",
              description:
                "The Jewel of Srinagar, famous for its houseboats, shikaras, and floating gardens. Experience a Shikara ride and explore the lake's serene beauty.",
              geoCoordinates: {
                latitude: 34.0944,
                longitude: 74.8406,
              },
            },
            {
              placeName: "Hazratbal Shrine",
              description:
                "A revered Muslim shrine located on the banks of Dal Lake. Houses a relic believed to be a hair of Prophet Muhammad.",
              geoCoordinates: {
                latitude: 34.1278,
                longitude: 74.8567,
              },
            },
            {
              placeName: "Shankaracharya Temple",
              description:
                "A historic temple dedicated to Lord Shiva, located on a hilltop overlooking Srinagar. Offers panoramic views of the city and Dal Lake.",
              geoCoordinates: {
                latitude: 34.0722,
                longitude: 74.84,
              },
            },
            {
              placeName: "Jamia Masjid",
              description:
                "A significant mosque in Srinagar, known for its Indo-Saracenic architecture and peaceful ambiance. A place of spiritual importance and historical significance.",
              geoCoordinates: {
                latitude: 34.0583,
                longitude: 74.8014,
              },
            },
          ],
        },
        {
          dayNumber: 4,
          dayTheme: "Gulmarg Excursion",
          placesToVisit: [
            {
              placeName: "Gulmarg Gondola",
              description:
                "One of the highest cable cars in the world, offering breathtaking views of the snow-capped Himalayas. A must-do for panoramic vistas.",
              geoCoordinates: {
                latitude: 34.0544,
                longitude: 74.3847,
              },
            },
            {
              placeName: "St. Mary's Church",
              description:
                "A charming church amidst the scenic landscapes of Gulmarg. Known for its Victorian architecture and serene ambiance.",
              geoCoordinates: {
                latitude: 34.046,
                longitude: 74.391,
              },
            },
            {
              placeName: "Gulmarg Golf Course",
              description:
                "One of the highest golf courses in the world, offering a unique golfing experience amidst stunning landscapes.",
              geoCoordinates: {
                latitude: 34.0528,
                longitude: 74.3886,
              },
            },
            {
              placeName: "Maharani Temple",
              description:
                "A historic temple dedicated to Goddess Shivaratri built by Maharani Mohini Bai Sisodia. Known for its spiritual significance and scenic surroundings.",
              geoCoordinates: {
                latitude: 34.0475,
                longitude: 74.3914,
              },
            },
          ],
        },
        {
          dayNumber: 5,
          dayTheme: "Pahalgam Exploration",
          placesToVisit: [
            {
              placeName: "Betaab Valley",
              description:
                "A picturesque valley with lush meadows, dense forests, and the Lidder River flowing through it. A popular spot for picnics and nature walks.",
              geoCoordinates: {
                latitude: 34.0121,
                longitude: 75.2487,
              },
            },
            {
              placeName: "Aru Valley",
              description:
                "A serene valley known for its scenic beauty and as a base camp for trekking. Offers opportunities for hiking, horse riding, and exploring the natural surroundings.",
              geoCoordinates: {
                latitude: 34.1325,
                longitude: 75.2833,
              },
            },
            {
              placeName: "Lidder River",
              description:
                "A gushing river flowing through Pahalgam, offering opportunities for fishing and rafting. Adds to the scenic charm of the valley.",
              geoCoordinates: {
                latitude: 34.0167,
                longitude: 75.3333,
              },
            },
            {
              placeName: "Mamaleshwar Temple",
              description:
                "A 12th-century temple dedicated to Lord Shiva, known for its historical significance and serene ambiance. Located near the Lidder River.",
              geoCoordinates: {
                latitude: 34.0181,
                longitude: 75.3369,
              },
            },
          ],
        },
      ],
    };
    navigate(`/trip/${uuidv4()}`, { state: tripData });
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

            {/* Trip Details Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Currency Selector */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-primary">
                  Select your preferred currency
                </label>
                <div className="relative group">
                  <select className="w-full px-4 py-3 transition-colors bg-white border border-gray-200 rounded-lg outline-none appearance-none focus:border-secondary focus:ring-1 focus:ring-secondary">
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
