import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Map, Mountain, Calendar, ArrowUpRight } from "lucide-react";
import AuthModal from "../components/AuthModal";
import CustomButton from "../components/CustomButton";

function LandingScreen() {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const trips = [
    {
      id: 1,
      title: "Japanese Cultural Journey",
      image:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200",
      location: "Tokyo, Japan",
      days: 12,
      size: "lg",
    },
    {
      id: 2,
      title: "Northern Lights Adventure",
      image:
        "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=1200",
      location: "Reykjavik, Iceland",
      days: 7,
      size: "sm",
    },
    {
      id: 3,
      title: "Sahara Desert Expedition",
      image:
        "https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&q=80&w=1200",
      location: "Morocco",
      days: 10,
      size: "sm",
    },
    {
      id: 4,
      title: "Amazon Rainforest Discovery",
      image:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200",
      location: "Brazil",
      days: 8,
      size: "lg",
    },
    {
      id: 5,
      title: "Greek Island Hopping",
      image:
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200",
      location: "Greece",
      days: 14,
      size: "sm",
    },
    {
      id: 6,
      title: "Swiss Alps Adventure",
      image:
        "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=1200",
      location: "Switzerland",
      days: 9,
      size: "sm",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-32 pb-16 bg-white sm:pt-40">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="space-y-8 text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-primary animate-fade-in">
              Navigating your journey,
              <br />
              <span className="text-secondary">one trail at a time</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-primary/70 animate-fade-in-delay">
              Your AI-powered travel companion that crafts personalized
              adventures tailored to your preferences.
            </p>
            <div className="flex justify-center gap-4 animate-fade-in-delay-2">
              <CustomButton
                labelText="Plan Your Adventure"
                iconPosition="suffix"
                iconName="ArrowRight"
                onClickHandler={() => navigate("/create-trip")}
                buttonClassName="px-7 py-3 shadow-lg group hover:shadow-xl"
                iconClassName="transition-transform group-hover:translate-x-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-light">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="space-y-4 text-center transition-transform duration-300 group hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 mx-auto transition-colors duration-300 bg-white shadow-md rounded-2xl group-hover:bg-secondary">
                <Map className="w-8 h-8 transition-colors duration-300 text-secondary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary">
                Smart Route Planning
              </h3>
              <p className="text-primary/70">
                AI-powered algorithms create the perfect itinerary based on your
                preferences
              </p>
            </div>
            <div className="space-y-4 text-center transition-transform duration-300 group hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 mx-auto transition-colors duration-300 bg-white shadow-md rounded-2xl group-hover:bg-secondary">
                <Mountain className="w-8 h-8 transition-colors duration-300 text-secondary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary">
                Hidden Gems
              </h3>
              <p className="text-primary/70">
                Discover unique locations off the beaten path, curated just for
                you
              </p>
            </div>
            <div className="space-y-4 text-center transition-transform duration-300 group hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 mx-auto transition-colors duration-300 bg-white shadow-md rounded-2xl group-hover:bg-secondary">
                <Calendar className="w-8 h-8 transition-colors duration-300 text-secondary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary">
                Smart Scheduling
              </h3>
              <p className="text-primary/70">
                Optimize your time with intelligent scheduling and real-time
                updates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Trips Section */}
      <div className="py-24 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-16 text-3xl font-bold text-center text-primary">
            Popular Adventures
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className={`relative overflow-hidden rounded-2xl group ${
                  trip.size === "lg" ? "sm:col-span-2 sm:row-span-2" : ""
                }`}
              >
                <div className="absolute inset-0 z-10 transition-opacity bg-black/40 group-hover:opacity-60"></div>
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {trip.title}
                    </h3>
                    <p className="mt-2 text-white/90">{trip.location}</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-white/90">{trip.days} days</span>
                    <button className="p-3 transition-all duration-300 rounded-full opacity-0 bg-white/0 group-hover:opacity-100 group-hover:bg-white/10 hover:bg-white/20">
                      <ArrowUpRight className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default LandingScreen;
