import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./index.css";
import "react-image-crop/dist/ReactCrop.css";
import LandingScreen from "./pages/LandingScreen.tsx";
import Header from "./components/Header.tsx";
import CreateTrip from "./pages/CreateTrip.tsx";
import { FirebaseProvider } from "./context/Firebase.tsx";
import TripItinerary from "./pages/TripItinerary.tsx";
import { Toaster } from "react-hot-toast";

const Layout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <LandingScreen /> },
      { path: "/create-trip", element: <CreateTrip /> },
      { path: "/trip/:tripId", element: <TripItinerary /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FirebaseProvider>
      <Toaster />
      <RouterProvider router={router} />
    </FirebaseProvider>
  </StrictMode>
);
