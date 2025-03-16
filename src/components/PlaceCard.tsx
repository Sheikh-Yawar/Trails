import { Banknote, Star } from "lucide-react";

type CardType = "accomodation" | "restaurant";

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
}: {
  cardType: CardType;
  height: number;
  name: string;
  image?: string;
  description: string;
  address: string;
  pricePerNight?: { fromPrice: number; toPrice: number };
  rating: number;
  openGoogleMaps: (hotelName: string, hotelAddress: string) => void;
}) => {
  return (
    <div
      className="flex-shrink-0 w-[300px]   aspect-square bg-white rounded-xl border-2 border-transparent hover:border-[#1E90FF] transition-all overflow-clip duration-300 p-6 pb-2 group"
      style={{
        height: `${height}px`,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      <img
        src={image ? image : "../../public/defaultHotelImage.jpg"}
        alt="Trip Title Image"
        className="object-cover w-full h-[200px] transition-transform duration-700 group-hover:scale-105 rounded-xl"
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
          <span className="flex items-center gap-1 ml-2 text-sm text-gray-500">
            <Banknote className="w-5" />
            {pricePerNight.fromPrice}-{pricePerNight.toPrice} INR/Night
          </span>
        )}
      </div>
      <p className="text-gray-600 h-[30%] ">{description}</p>
    </div>
  );
};

export default PlaceCard;
