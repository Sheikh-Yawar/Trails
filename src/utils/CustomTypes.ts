export type updateUserFields = {
  displayName?: string;
  photoURL?: string | null;
};

export type tripDataType = {
  tripTitleImage: string;
  hotelOptions: hotelType[];
  itinerary: {
    dayNumber: number;
    dayTheme: string;
    placesToVisit: PlaceType[];
    foodPlaces: foodPlaceType[];
  }[];
};

export type hotelType = {
  description: string;
  hotelAddress: string;
  hotelName: string;
  hotelImage?: string;
  pricePerNight: { fromPrice: number; toPrice: number };
  rating: number;
};

export type PlaceType = {
  placeName: string;
  description: string;
  placeAddress: string;
  bestTimeToVisit: string[];
};

export type foodPlaceType = {
  foodPlaceName: string;
  description: string;
  rating: number;
  foodPlaceAddress: string;
  foodPlaceImage?: string;
};

export type ItineraryDayType = {
  dayNumber: number;
  dayTheme: string;
  placesToVisit: PlaceType[];
  foodPlaces: foodPlaceType[];
};
