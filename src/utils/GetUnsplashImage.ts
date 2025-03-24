export async function GetUnsplashImage(placeName: string): Promise<string> {
  const query = `${placeName} trip`;

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&orientation=landscape&per_page=10&client_id=${
        import.meta.env.VITE_UNSPLASH_ACCESS_KEY
      }`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const data = await response.json();
    const results = data.results;

    if (results && results.length > 0) {
      // Get a random index within the results array
      const randomIndex = getRandomInt(0, results.length - 1);

      console.log("Random index is", randomIndex);

      const image = results[randomIndex];
      return `${image.urls.raw}&w=3840&h=2160&fit=crop`;
    }

    return "/defaultTripTitleImage.jpg";
  } catch (error) {
    console.error("Error fetching image:", error);
    return "/defaultTripTitleImage.jpg";
  }
}

// Helper function to generate a random integer within a range
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
