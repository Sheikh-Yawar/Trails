import { Banknote, Star } from "lucide-react";
import { useState } from "react";

type CardType = "accomodation" | "restaurant";

type PlaceCardProps = {
  cardType: CardType;
  height: number;
  name: string;
  image?: string;
  description: string;
  address: string;
  pricePerNight?: {
    fromPrice: number;
    toPrice: number;
    currencySymbol: string;
  };
  rating: number;
  openGoogleMaps: (hotelName: string, hotelAddress: string) => void;
};

function formatPrice(price: number): string {
  if (price >= 1000) {
    const formattedPrice = (price / 1000).toFixed(price >= 10000 ? 0 : 1);
    return `${formattedPrice}K`;
  } else {
    return price.toString();
  }
}

const PlaceCard = ({
  cardType,
  name,
  image,
  description,
  address,
  pricePerNight,
  rating,
  height,
  openGoogleMaps,
}: PlaceCardProps) => {
  if (!image) {
    if (cardType === "accomodation") {
      image = "/defaultHotelImage.jpg";
    } else if (cardType === "restaurant") {
      image = "/public/defaultRestaurantImage.jpg";
    }
  }
  const [imageSrc, setImageSrc] = useState(image);
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div
      className="flex-shrink-0 w-[300px] bg-white rounded-xl border-2 border-transparent  transition-all overflow-clip duration-300 px-5 cursor-pointer  group"
      style={{
        height: `${470}px`,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
      onClick={() => openGoogleMaps(name, address)}
    >
      <img
        src={imageSrc}
        onError={() => {
          console.log("Image not found ❌", name);
          if (cardType === "accomodation") {
            setImageSrc("/defaultHotelImage.jpg");
          } else if (cardType === "restaurant") {
            setImageSrc("/defaultRestaurantImage.jpg");
          }
        }}
        onLoad={() => setIsLoaded(true)}
        alt="Trip Title Image"
        className={`object-cover w-full h-[200px] transition-transform duration-700 group-hover:scale-105 rounded-xl ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
      <h3 className="h-8 mt-2 text-xl font-semibold text-primary overflow-clip">
        {name}
      </h3>
      <p
        onClick={() => {
          openGoogleMaps(name, address);
        }}
        className="cursor-pointer h-[25px] overflow-clip mb-3 text-[14px] text-gray-500 hover:underline"
      >
        {address}
      </p>
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
        {pricePerNight && (
          <span
            title={
              cardType === "accomodation"
                ? "Average Price Per Night"
                : "Average Price Per Person"
            }
            className="flex items-center gap-1 ml-2 text-sm text-gray-500 cursor-default "
          >
            <Banknote className="w-5" />
            {formatPrice(pricePerNight.fromPrice)}-
            {formatPrice(pricePerNight.toPrice)} {pricePerNight.currencySymbol}/
            {`${cardType === "accomodation" ? "Night" : "Person"}`}
          </span>
        )}
      </div>
      <p className="text-gray-600 h-[27%] overflow-y-auto no-scrollbar">
        {description}
      </p>
    </div>
  );
};

export default PlaceCard;
