import { Timestamp } from "firebase/firestore";

export type updateUserFields = {
  displayName?: string;
  photoURL?: string | null;
};

export type TripDataType = {
  userId: string;
  tripId: string;
  tripName: string;
  tripTitleImage: string;
  tripDays: number;
  tripTravellers: number;
  isTripSaved: boolean;
  isCommunityTrip: boolean;
  hotelOptions: HotelType[];
  itinerary: {
    dayNumber: number;
    dayTheme: string;
    placesToVisit: PlaceType[];
    foodPlaces: FoodPlaceType[];
  }[];
  createdAt: Timestamp;
};

export type HotelType = {
  description: string;
  hotelAddress: string;
  hotelName: string;
  hotelImage?: string;
  hotelImageReference?: string;
  pricePerNight: { fromPrice: number; toPrice: number };
  rating: number;
};

export type PlaceType = {
  placeName: string;
  description: string;
  placeAddress: string;
  bestTimeToVisit: string[];
};

export type FoodPlaceType = {
  foodPlaceName: string;
  description: string;
  rating: number;
  foodPlaceAddress: string;
  approximatePricePerPerson: { fromPrice: number; toPrice: number };
  foodPlaceImageReference?: string;
  foodPlaceImage?: string;
};

export type ItineraryDayType = {
  dayNumber: number;
  dayTheme: string;
  placesToVisit: PlaceType[];
  foodPlaces: FoodPlaceType[];
};
