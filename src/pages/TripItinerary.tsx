import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Star,
  Plus,
  Bookmark,
  Calendar,
  Users,
  Trash2,
} from "lucide-react";

interface Place {
  id: string;
  name: string;
  description: string;
  bestTime: string;
  distance?: string;
}

interface Day {
  id: string;
  number: number;
  theme: string;
  places: Place[];
}

interface Hotel {
  id: string;
  name: string;
  rating: number;
  priceRange: string;
  description: string;
}

interface NewActivity {
  name: string;
  description: string;
  bestTime: string;
}

const TripItinerary: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  console.log("Trip ID: ", tripId);
  const [isTripSaved, setIsTripSaved] = useState(false);
  const [editingDayId, setEditingDayId] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState<NewActivity>({
    name: "",
    description: "",
    bestTime: "",
  });

  const hotels: Hotel[] = [
    {
      id: "1",
      name: "Park Hyatt Tokyo",
      rating: 5,
      priceRange: "$$$",
      description: "Luxury hotel featuring elegant rooms with city views",
    },
    {
      id: "2",
      name: "Mandarin Oriental",
      rating: 5,
      priceRange: "$$$",
      description: "Contemporary luxury hotel with spectacular views",
    },
    {
      id: "3",
      name: "The Ritz-Carlton",
      rating: 5,
      priceRange: "$$$",
      description: "Upscale hotel with panoramic views and fine dining",
    },
    {
      id: "4",
      name: "Four Seasons Tokyo",
      rating: 5,
      priceRange: "$$$",
      description: "Contemporary luxury in the heart of Tokyo",
    },
    {
      id: "5",
      name: "Aman Tokyo",
      rating: 5,
      priceRange: "$$$",
      description: "Urban sanctuary with traditional Japanese touches",
    },
    {
      id: "6",
      name: "Peninsula Tokyo",
      rating: 5,
      priceRange: "$$$",
      description: "Perfect blend of luxury and Japanese culture",
    },
    {
      id: "7",
      name: "Shangri-La Tokyo",
      rating: 5,
      priceRange: "$$$",
      description: "Elegant rooms with stunning city views",
    },
    {
      id: "8",
      name: "Conrad Tokyo",
      rating: 5,
      priceRange: "$$$",
      description: "Modern luxury with bay views and spa",
    },
  ];

  const [days, setDays] = useState<Day[]>([
    {
      id: "1",
      number: 1,
      theme: "Cultural Exploration",
      places: [
        {
          id: "1-1",
          name: "Sensō-ji Temple",
          description: "Ancient Buddhist temple with traditional architecture",
          bestTime: "9:00 AM - 11:00 AM",
        },
        {
          id: "1-2",
          name: "Meiji Shrine",
          description:
            "Shinto shrine dedicated to Emperor Meiji and Empress Shoken",
          bestTime: "2:00 PM - 4:00 PM",
        },
      ],
    },
    {
      id: "2",
      number: 2,
      theme: "Modern Tokyo",
      places: [
        {
          id: "2-1",
          name: "Shibuya Crossing",
          description: "World's busiest pedestrian crossing",
          bestTime: "10:00 AM - 12:00 PM",
        },
        {
          id: "2-2",
          name: "Tokyo Skytree",
          description: "Tallest structure in Japan with observation decks",
          bestTime: "3:00 PM - 5:00 PM",
        },
      ],
    },
  ]);

  const handleAddPlace = (dayId: string) => {
    if (
      newActivity.name.trim() === "" ||
      newActivity.description.trim() === ""
    ) {
      return;
    }

    const newPlace: Place = {
      id: `${dayId}-${Date.now()}`,
      name: newActivity.name,
      description: newActivity.description,
      bestTime: newActivity.bestTime,
    };

    setDays((prevDays) =>
      prevDays.map((day) =>
        day.id === dayId ? { ...day, places: [...day.places, newPlace] } : day
      )
    );

    setNewActivity({ name: "", description: "", bestTime: "" });
    setEditingDayId(null);
  };

  const handleDeletePlace = (dayId: string, placeId: string) => {
    setDays((prevDays) =>
      prevDays.map((day) =>
        day.id === dayId
          ? {
              ...day,
              places: day.places.filter((place) => place.id !== placeId),
            }
          : day
      )
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative h-[40vh] group overflow-hidden mt-24 rounded-2xl">
          <div className="absolute inset-0 z-10 bg-black/40" />
          <img
            src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=2070"
            alt="Tokyo Cityscape"
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                  Japanese Cultural Journey
                </h1>
                <div className="flex items-center gap-6 text-white/90">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-lg">12 Days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span className="text-lg">2 Travelers</span>
                  </div>
                </div>
              </div>
              <div className="has-tooltip">
                <button
                  onClick={() => setIsTripSaved(!isTripSaved)}
                  className="p-3 transition-colors rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 animate-pulse-hover"
                >
                  <Bookmark
                    className={`w-6 h-6 ${
                      isTripSaved ? "fill-white text-white" : "text-white"
                    }`}
                  />
                </button>
                <span className="absolute px-2 py-1 text-sm text-white rounded tooltip bg-black/75 -left-8 -bottom-8">
                  Save Trip
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Accommodations Section */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-primary">
            Accommodations
          </h2>

          <div className="flex gap-6 px-4 pb-6 overflow-x-auto scrollbar-thin">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="flex-shrink-0 w-[300px] aspect-square bg-white rounded-xl border-2 border-transparent hover:border-[#1E90FF] transition-all duration-300 p-6"
                style={{
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              >
                <h3 className="mb-3 text-xl font-semibold text-primary">
                  {hotel.name}
                </h3>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: hotel.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {hotel.priceRange}
                  </span>
                </div>
                <p className="text-gray-600">{hotel.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Itinerary Section */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-primary">
            Daily Itinerary
          </h2>
          <div className="space-y-6">
            {days.map((day) => (
              <div
                key={day.id}
                className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md animate-fade-in"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-primary">
                      Day {day.number}
                    </h3>
                    <p className="text-secondary">{day.theme}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {day.places.map((place, index) => (
                    <div
                      key={place.id}
                      className="p-4 transition-all duration-300 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h4 className="font-medium text-primary">
                            {place.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {place.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>Best Time: {place.bestTime}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePlace(day.id, place.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {editingDayId === day.id ? (
                    <div className="p-4 bg-white border-2 rounded-lg border-secondary animate-fade-in">
                      <div className="space-y-4">
                        <div>
                          <input
                            type="text"
                            placeholder="Activity name"
                            value={newActivity.name}
                            onChange={(e) =>
                              setNewActivity((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Activity description"
                            value={newActivity.description}
                            onChange={(e) =>
                              setNewActivity((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Best time to visit (e.g., 9:00 AM - 11:00 AM)"
                            value={newActivity.bestTime}
                            onChange={(e) =>
                              setNewActivity((prev) => ({
                                ...prev,
                                bestTime: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddPlace(day.id)}
                            className="flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-secondary hover:bg-secondary/90"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingDayId(null);
                              setNewActivity({
                                name: "",
                                description: "",
                                bestTime: "",
                              });
                            }}
                            className="flex-1 px-4 py-2 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingDayId(day.id)}
                      className="flex items-center justify-center w-full gap-2 py-3 text-gray-500 transition-colors border-2 border-gray-200 border-dashed rounded-lg hover:border-secondary hover:text-secondary"
                    >
                      <Plus className="w-5 h-5" />
                      Add Activity
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripItinerary;
