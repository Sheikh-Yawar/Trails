import { Loader } from "@googlemaps/js-api-loader";

let placesService: google.maps.places.PlacesService | null = null;
let googleMapsLoaded = false;

const initializePlacesService = async () => {
  if (googleMapsLoaded && placesService) {
    console.log("Places Service already initialized.");
    return; // Already initialized
  }

  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
    version: "weekly",
    libraries: ["places"],
  });

  try {
    const { Place } = await loader.importLibrary("places");
    const google = window.google;

    if (!google || !google.maps || !google.maps.places) {
      throw new Error("Google Maps Places API not loaded.");
    }

    placesService = new google.maps.places.PlacesService(
      document.createElement("div")
    );
    googleMapsLoaded = true;
  } catch (err) {
    console.error("Error initializing Places Service:", err);
    throw err; // Re-throw to indicate initialization failure
  }
};

const GetPlacesImage = async (placeName: string, address: string) => {
  try {
    if (!googleMapsLoaded || !placesService) {
      await initializePlacesService();
    }
    return new Promise<string | null>((resolve) => {
      if (!placesService) {
        resolve(null);
        return;
      }
      placesService.findPlaceFromQuery(
        {
          query: `${placeName}, ${address}`,
          fields: ["place_id", "photos"],
        },
        (results, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            results &&
            results.length > 0
          ) {
            const place = results[0];
            if (place.photos && place.photos.length > 0) {
              const photo = place.photos[0];
              resolve(photo.getUrl({ maxWidth: 500, maxHeight: 500 }));
            } else {
              console.log("No photos available for this place.");
              resolve(null);
            }
          } else {
            console.log("Place not found or an error occurred.");
            resolve(null);
          }
        }
      );
    });
  } catch (err) {
    console.error("Error getting place image:", err);
    return null;
  }
};

export default GetPlacesImage;
