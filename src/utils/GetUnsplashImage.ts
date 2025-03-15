export async function GetUnsplashImage(
  placeName: string
): Promise<string | null> {
  if (!placeName) return null;

  // Construct a more relevant search query
  const query = `${placeName} trip`;

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&orientation=landscape&per_page=1&client_id=${
        import.meta.env.VITE_UNSPLASH_ACCESS_KEY
      }`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const data = await response.json();
    const image = data.results[0];

    if (image) {
      return `${image.urls.raw}&w=3840&h=2160&fit=crop`; // 4K resolution
    }

    return null;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}
