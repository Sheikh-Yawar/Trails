import { ArrowUpRight, Calendar, Loader, Users, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { TripDataType } from "../utils/CustomTypes";
import { useFirebase } from "../context/Firebase";
import { useState } from "react";

const TripCard = ({
  collection,
  trip,
  isTripLoadingIndex,
  handleViewTripClick,
  index,
}: {
  collection: "favourites" | "community";
  trip: TripDataType;
  isTripLoadingIndex: number;
  handleViewTripClick: (
    tripId: string,
    index: number,
    trip: TripDataType,
    collection: "favourites" | "community"
  ) => Promise<void>;
  index: number;
}) => {
  const firebase = useFirebase();
  const [isTripRemovingLoading, setIsTripRemovingLoading] = useState(false);
  const handleRemoveTripClick = async (tripId: string) => {
    if (!tripId) {
      toast.error("Trip ID not found");
      return;
    }

    setIsTripRemovingLoading(true);

    try {
      const response = await firebase?.removeDataFromFireStore(
        "trips",
        tripId,
        collection
      );
      toast.success(response);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }

    sessionStorage.removeItem(`trails-${tripId}`);
    setIsTripRemovingLoading(false);
  };
  return (
    <div
      key={trip.tripId}
      className="relative overflow-hidden rounded-lg cursor-pointer group"
    >
      <div className="absolute inset-0 z-10 transition-opacity bg-black/40 group-hover:opacity-60" />
      <img
        src={trip.tripTitleImage}
        alt="Trip title Image"
        className="object-cover w-full h-48 transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 ">
        <div>
          <div className="flex items-center justify-between ">
            <h3 className="text-xl font-bold text-white">{trip.tripName}</h3>
            <div
              className="opacity-0 group-hover:opacity-70"
              title={
                collection === "favourites"
                  ? "Remove from favourites"
                  : "Remove from community"
              }
            >
              {isTripRemovingLoading ? (
                <Loader className={`w-5 h-5 text-white animate-spin`} />
              ) : (
                <XCircle
                  onClick={() => handleRemoveTripClick(trip.tripId)}
                  className="w-5 h-5 text-white"
                />
              )}
            </div>
          </div>
          <div className="flex items-baseline gap-2 text-white">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span className="text-sm">{trip.tripDays} Days</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3" />
              <span className="text-sm">{trip.tripTravellers} Travelers</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end ">
          <button
            title="View Trip"
            className="p-2 transition-colors rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 animate-pulse-hover"
          >
            {isTripLoadingIndex == index ? (
              <Loader className={`w-5 h-5 text-white animate-spin`} />
            ) : (
              <ArrowUpRight
                onClick={() =>
                  handleViewTripClick(trip.tripId, index, trip, collection)
                }
                className="w-5 h-5 text-white"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
