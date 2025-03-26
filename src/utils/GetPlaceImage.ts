import { TripDataType } from "./CustomTypes";

const GetPlaceImageReference = async (
  name: string,
  address: string
): Promise<string | null> => {
  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
          "X-Goog-FieldMask": "places.id,places.photos",
        },
        body: JSON.stringify({
          textQuery: `${name} ${address}`,
        }),
      }
    );

    if (!response.ok) {
      console.error("Error fetching place data:", response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.places && data.places.length > 0) {
      const place = data.places[0];
      if (place.photos && place.photos.length > 0) {
        return place.photos[0].name;
      } else {
        console.log("No photos available for this place.", name);
        return null;
      }
    } else {
      console.log("No places found matching the query.", name);
      return null;
    }
  } catch (error) {
    console.error("Error during API call:", error);
    return null;
  }
};

export function GetImageUrl(imageReference?: string) {
  if (!imageReference) return null;
  const photoUrl = `https://places.googleapis.com/v1/${imageReference}/media?maxHeightPx=500&maxWidthPx=500&key=${
    import.meta.env.VITE_GOOGLE_PLACE_API_KEY
  }`;
  return photoUrl;
}

export async function GetPlaceImageUrlAndRef(
  name: string,
  address: string,
  imageReference?: string
): Promise<{ imageUrl: string | null; imageRef: string | null }> {
  if (!imageReference) return { imageUrl: null, imageRef: null };

  const photoUrl = `https://places.googleapis.com/v1/${imageReference}/media?maxHeightPx=500&maxWidthPx=500&key=${
    import.meta.env.VITE_GOOGLE_PLACE_API_KEY
  }`;

  return new Promise<{ imageUrl: string | null; imageRef: string | null }>(
    (resolve) => {
      const img = new Image();
      img.src = photoUrl;

      img.onload = () => {
        console.log("✅ Photo reference is valid!");
        resolve({ imageUrl: photoUrl, imageRef: null });
      };

      img.onerror = async () => {
        console.error("❌ Invalid or expired photo reference:", name);
        const newImageRef = await GetPlaceImageReference(name, address);
        const newPhotoUrl = `https://places.googleapis.com/v1/${newImageRef}/media?maxHeightPx=500&maxWidthPx=500&key=${
          import.meta.env.VITE_GOOGLE_PLACE_API_KEY
        }`;
        resolve({ imageUrl: newPhotoUrl, imageRef: newImageRef });
      };
    }
  );
}

export default GetPlaceImageReference;
