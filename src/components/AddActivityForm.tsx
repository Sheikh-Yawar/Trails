import { Option } from "react-google-places-autocomplete/build/types";
import { useState } from "react";
import { toast } from "react-toastify";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import TimePicker from "./TimePicker";
import { Plus, Trash2 } from "lucide-react";

const AddActivityForm = ({
  setEditingDayId,
  handleAddPlace,
  dayNumber,
}: {
  dayNumber: number;
  setEditingDayId: React.Dispatch<React.SetStateAction<number | null>>;
  handleAddPlace: (
    selectedPlace: Option | null,
    activityDescription: string,
    dayNumber: number,
    bestTimeArray: {
      from: string;
      to: string;
    }[]
  ) => void;
}) => {
  const [selectedPlace, setSelectedPlace] = useState<Option | null>(null);
  const [activityDescription, setActivityDescription] = useState("");
  const [bestTimeArray, setBestTimeArray] = useState([{ from: "", to: "" }]);

  const handleAddTime = () => {
    const lastEntry = bestTimeArray[bestTimeArray.length - 1];
    if (lastEntry.from && lastEntry.to) {
      setBestTimeArray([...bestTimeArray, { from: "", to: "" }]);
    } else {
      toast.warn(
        "Please fill the previous time range before adding a new one."
      );
    }
  };

  const handleTimeChange = (
    index: number,
    field: "from" | "to",
    value: string
  ) => {
    const updatedTimes = [...bestTimeArray];
    updatedTimes[index][field] = value;
    setBestTimeArray(updatedTimes);
  };

  return (
    <div className="p-4 bg-white border-2 rounded-lg border-secondary animate-fade-in">
      <div className="space-y-4">
        <div>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              value: selectedPlace,
              onChange: (value) => {
                console.log("Google Maps value is", value);
                setSelectedPlace(value);
              },
            }}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Activity description"
            value={activityDescription}
            onChange={(e) => {
              setActivityDescription(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          />
        </div>
        <div>
          <p className="pb-2 font-medium text-black">Best time to visit</p>

          {bestTimeArray.map((time, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <TimePicker
                index={index}
                placeholder="From"
                timeFor="from"
                value={time.from}
                handleTimeChange={handleTimeChange}
              />
              <TimePicker
                index={index}
                placeholder="To"
                timeFor="to"
                value={time.to}
                handleTimeChange={handleTimeChange}
              />
              {index !== 0 && (
                <button
                  onClick={() => {
                    setBestTimeArray((prev) =>
                      prev.filter((_, i) => i !== index)
                    );
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={handleAddTime}
            className="flex items-center justify-center w-[28%] gap-2 py-3 mt-3 text-gray-500 transition-colors border-2 border-gray-200 border-dashed rounded-lg hover:border-secondary hover:text-secondary"
          >
            <Plus className="w-5 h-5" />
            Add Time
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              handleAddPlace(
                selectedPlace,
                activityDescription,
                dayNumber,
                bestTimeArray
              );
            }}
            className="flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-secondary hover:bg-secondary/90"
          >
            Save
          </button>
          <button
            onClick={() => {
              setEditingDayId(null);
              setSelectedPlace(null);
              setActivityDescription("");
              // setBestTimeArray(["");
            }}
            className="flex-1 px-4 py-2 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddActivityForm;
