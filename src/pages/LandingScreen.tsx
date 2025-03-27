import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Map,
  Mountain,
  Calendar,
  ArrowUpRight,
  Users,
  ChevronRight,
  Loader,
  ArrowDown,
} from "lucide-react";
import AuthModal from "../components/AuthModal";
import CustomButton from "../components/CustomButton";
import { useFirebase } from "../context/Firebase";
import {
  FoodPlaceType,
  HotelType,
  ItineraryDayType,
  TripDataType,
} from "../utils/CustomTypes";
import { Timestamp } from "firebase/firestore";
import { GetImageUrl, GetPlaceImageUrlAndRef } from "../utils/GetPlaceImage";

function LandingScreen() {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [allCommunityTrips, setAllCommunityTrips] = useState<TripDataType[]>(
    []
  );
  const [tripLoadingIndex, setIsTripLoadingIndex] = useState(-1);

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
    trip: TripDataType
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
            "community"
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
    setIsTripLoadingIndex(-1);

    navigate(`/trip/${tripId}`, {
      state: { tripType: "communityTrip" },
    });
  };

  useEffect(() => {
    if (!firebase) return;
    if (firebase.allCommunityTrips) {
      console.log("All Community Trips are", firebase.allCommunityTrips);
      setAllCommunityTrips(firebase.allCommunityTrips);
    }
  }, [firebase, firebase?.allCommunityTrips]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-32 pb-16 bg-white sm:pt-40">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="space-y-8 text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-primary animate-fade-in">
              Navigating your journey,
              <br />
              <span className="text-secondary">one trail at a time</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-primary/70 animate-fade-in-delay">
              Your AI-powered travel companion that crafts personalized
              adventures tailored to your preferences.
            </p>
            <div className="flex justify-center gap-4 animate-fade-in-delay-2">
              <div>
                <CustomButton
                  labelText="Plan Your Adventure"
                  iconPosition="suffix"
                  iconName="ArrowRight"
                  onClickHandler={() => navigate("/create-trip")}
                  buttonClassName="px-7 py-3 shadow-lg group hover:shadow-xl"
                  iconClassName="transition-transform group-hover:translate-x-1"
                />
                <p className="mt-1 text-xs font-normal text-center text-gray-400 ">
                  Developed by{" "}
                  <span
                    onClick={() => {
                      window.open(
                        "https://www.linkedin.com/in/sheikh-yawar-56022a193/",
                        "_blank"
                      );
                    }}
                    className="transition-colors duration-500 border-b-[3px] border-transparent cursor-pointer hover:border-secondary "
                  >
                    Sheikh Yawar
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="space-y-4 text-center transition-transform duration-300 group hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 mx-auto transition-colors duration-300 bg-white shadow-md rounded-2xl group-hover:bg-secondary">
                <Map className="w-8 h-8 transition-colors duration-300 text-secondary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary">
                Smart Route Planning
              </h3>
              <p className="text-primary/70">
                AI-powered algorithms create the perfect itinerary based on your
                preferences
              </p>
            </div>
            <div className="space-y-4 text-center transition-transform duration-300 group hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 mx-auto transition-colors duration-300 bg-white shadow-md rounded-2xl group-hover:bg-secondary">
                <Mountain className="w-8 h-8 transition-colors duration-300 text-secondary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary">
                Hidden Gems
              </h3>
              <p className="text-primary/70">
                Discover unique locations off the beaten path, curated just for
                you
              </p>
            </div>
            <div className="space-y-4 text-center transition-transform duration-300 group hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 mx-auto transition-colors duration-300 bg-white shadow-md rounded-2xl group-hover:bg-secondary">
                <Calendar className="w-8 h-8 transition-colors duration-300 text-secondary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary">
                Smart Scheduling
              </h3>
              <p className="text-primary/70">
                Optimize your time with intelligent scheduling and real-time
                updates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Trips Section */}
      <div className="py-24 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-16 text-3xl font-bold text-center text-primary">
            Popular Community Adventures
            <p className="pt-1 text-xs font-normal text-center text-gray-400">
              Only Top 6 Latest trips are shown currently
            </p>
          </h2>
          {allCommunityTrips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px] ">
              {allCommunityTrips.map((trip, index) => (
                <div
                  onClick={() => handleViewTripClick(trip.tripId, index, trip)}
                  key={index}
                  className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                    index == 0 || index == 3
                      ? "sm:col-span-2 sm:row-span-2"
                      : ""
                  }`}
                >
                  <div className="absolute inset-0 z-10 transition-opacity bg-black/40 group-hover:opacity-60"></div>
                  <img
                    src={trip.tripTitleImage}
                    alt={trip.tripName}
                    className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col justify-between p-6">
                    <div>
                      <h3 className="text-3xl font-bold text-white">
                        {trip.tripName}
                      </h3>
                      <div className="flex items-baseline gap-2 text-white">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span className="text-sm">{trip.tripDays} Days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          <span className="text-sm">
                            {trip.tripTravellers} Travelers
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end justify-end">
                      <button
                        onClick={() =>
                          handleViewTripClick(trip.tripId, index, trip)
                        }
                        title="View Trip"
                        className="p-2 transition-colors rounded-full opacity-0 bg-white/10 backdrop-blur-md hover:bg-white/20 animate-pulse-hover group-hover:opacity-100"
                      >
                        {tripLoadingIndex == index ? (
                          <Loader
                            className={`w-5 h-5 text-white animate-spin`}
                          />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center w-full ">
              <Loader className="w-20 h-20 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default LandingScreen;
