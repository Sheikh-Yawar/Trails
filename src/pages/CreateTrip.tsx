import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Minus,
  Wallet,
  Hotel,
  Plane,
  ArrowLeft,
  Loader,
} from "lucide-react";
import AuthModal from "../components/AuthModal";
import CustomButton from "../components/CustomButton";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Option } from "react-google-places-autocomplete/build/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { GetUnsplashImage } from "../utils/GetUnsplashImage";
import {
  FoodPlaceType,
  HotelType,
  ItineraryDayType,
  PlaceType,
  TripDataType,
} from "../utils/CustomTypes";
import GetPlaceImageReference, { GetImageUrl } from "../utils/GetPlaceImage";
import { AI_PROMPT } from "../utils/Constants";
import { chatSession } from "../utils/AiModel";

const CreateTrip = () => {
  const navigate = useNavigate();
  const [travelers, setTravelers] = useState(2);
  const [days, setDays] = useState(3);
  const [selectedBudget, setSelectedBudget] = useState<
    "cheap" | "moderate" | "luxury" | null
  >(null);
  const [currency, setCurrency] = useState("INR");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Option | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTravelersChange = (increment: boolean) => {
    setTravelers((prev) => {
      const newValue = increment ? prev + 1 : prev - 1;
      return Math.min(Math.max(newValue, 1), 10);
    });
  };

  const handleDaysChange = (increment: boolean) => {
    setDays((prev) => {
      const newValue = increment ? prev + 1 : prev - 1;
      return Math.max(newValue, 0);
    });
  };

  const handleGenerateTrip = async () => {
    if (!selectedPlace || !setSelectedBudget) {
      toast.error("Please select a place and budget");
      return;
    }

    setIsLoading(true);

    const tripId = uuidv4();

    // const FINAL_PROMPT = AI_PROMPT.replace("{userDays}", days.toString())
    //   .replace("{userTravellers}", travelers.toString())
    //   .replace("{userDestination}", selectedPlace.label)
    //   .replace("{userBudget}", selectedBudget!)
    //   .replace("{userCurrency}", currency);

    // const result = await chatSession.sendMessage(FINAL_PROMPT);

    // let tripData = JSON.parse(result?.response?.text());

    // const tripTitleImage = await GetUnsplashImage(selectedPlace?.label);

    // tripData = {
    //   ...tripData,
    //   createdAt: Timestamp.fromDate(new Date()),
    //   tripTitleImage,
    //   tripId,
    //   tripName: `${selectedPlace.value.structured_formatting.main_text} Trip`,
    //   tripDays: days,
    //   tripTravellers: travelers,
    //   isTripSaved: false,
    //   isCommunityTrip: false,
    // };

    // const updatedHotelOptionsWithImageRef = await Promise.all(
    //   tripData.hotelOptions.map(async (hotel: HotelType) => {
    //     const hotelImageReference = await GetPlaceImageReference(
    //       hotel.hotelName,
    //       hotel.hotelAddress
    //     );
    //     return { ...hotel, hotelImageReference };
    //   })
    // );

    // const updatedItineraryWithImageRef = await Promise.all(
    //   tripData.itinerary.map(async (day: ItineraryDayType) => {
    //     const updatedFoodPlaces = await Promise.all(
    //       day.foodPlaces.map(async (foodPlace: FoodPlaceType) => {
    //         const foodPlaceImageReference = await GetPlaceImageReference(
    //           foodPlace.foodPlaceName,
    //           foodPlace.foodPlaceAddress
    //         );
    //         return { ...foodPlace, foodPlaceImageReference };
    //       })
    //     );

    //     return { ...day, foodPlaces: updatedFoodPlaces };
    //   })
    // );

    // const updatedTrip = {
    //   ...tripData,
    //   hotelOptions: updatedHotelOptionsWithImageRef,
    //   itinerary: updatedItineraryWithImageRef,
    // } as TripDataType;

    // const updatedHotelOptionsWithImages = updatedTrip.hotelOptions.map(
    //   (hotel: HotelType) => {
    //     const hotelImage = GetImageUrl(hotel.hotelImageReference);

    //     return { ...hotel, hotelImage };
    //   }
    // );

    // const updatedItineraryWithImages = updatedTrip.itinerary.map((day) => {
    //   const updatedFoodPlaces = day.foodPlaces.map(
    //     (foodPlace: FoodPlaceType) => {
    //       const foodPlaceImage = GetImageUrl(foodPlace.foodPlaceImageReference);
    //       return { ...foodPlace, foodPlaceImage };
    //     }
    //   );

    //   return { ...day, foodPlaces: updatedFoodPlaces };
    // });

    // const updatedTrip2 = {
    //   ...tripData,
    //   hotelOptions: updatedHotelOptionsWithImages,
    //   itinerary: updatedItineraryWithImages,
    // };
    // console.log("Updated Trip Data", updatedTrip2);

    setIsLoading(false);

    let tripData = {
      hotelOptions: [
        {
          hotelName: "Pousada Amazônia",
          hotelAddress:
            "Rua Projetada, 15, Codajás, Amazonas, Brazil, 69470-000",
          pricePerNight: {
            fromPrice: 2500,
            toPrice: 3500,
          },
          rating: 3.8,
          description:
            "A simple guesthouse offering basic accommodations, breakfast, and local tours, providing an affordable option for exploring the Amazon.",
          hotelImageReference:
            "places/ChIJ86xQK_dTiJIR2d2lvhF11zg/photos/AUy1YQ2GXIRRE3f9adhjNMj_DmjxXN_KX8GHGPV265lvKATYKqrV1fTGi2I1V_H9o3f1ZPEJqB6f1KM7pU07XhvLS6iFz6TiJXYb3b_CxZeUOh7zEQEL41oMINbXFInqbzdNjfO0q-FlbdeWlfmfT7jgkLwKg2egpvtDOTWakLliRQ_ufWPHk1fPV19dP4Rh7lBWHE3LW0m1AfcAiNHOucsitEg2R74E08Mj0Vbwv4QJ6xss2v1XJ5ga5ZU085hSEgBEcnc--iMSpU1_q0R9dm6FZu5cWeXcHDLu6JlLsO09XaFPEg",
          hotelImage:
            "https://places.googleapis.com/v1/places/ChIJ86xQK_dTiJIR2d2lvhF11zg/photos/AUy1YQ2GXIRRE3f9adhjNMj_DmjxXN_KX8GHGPV265lvKATYKqrV1fTGi2I1V_H9o3f1ZPEJqB6f1KM7pU07XhvLS6iFz6TiJXYb3b_CxZeUOh7zEQEL41oMINbXFInqbzdNjfO0q-FlbdeWlfmfT7jgkLwKg2egpvtDOTWakLliRQ_ufWPHk1fPV19dP4Rh7lBWHE3LW0m1AfcAiNHOucsitEg2R74E08Mj0Vbwv4QJ6xss2v1XJ5ga5ZU085hSEgBEcnc--iMSpU1_q0R9dm6FZu5cWeXcHDLu6JlLsO09XaFPEg/media?maxHeightPx=500&maxWidthPx=500&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28",
        },
        {
          hotelName: "Hotel Rio Solimões",
          hotelAddress:
            "Rua Getúlio Vargas, 45, Codajás, Amazonas, Brazil, 69470-000",
          pricePerNight: {
            fromPrice: 3000,
            toPrice: 4000,
          },
          rating: 4,
          description:
            "A comfortable hotel offering air-conditioned rooms, a restaurant serving regional cuisine, and boat tours, providing a convenient base for exploring the river.",
          hotelImageReference: null,
          hotelImage: null,
        },
        {
          hotelName: "Amazon Backpackers Hostel (Manaus - Closest Major City)",
          hotelAddress:
            "Rua Tapajós, 496 - Centro, Manaus - AM, 69010-130, Brazil",
          pricePerNight: {
            fromPrice: 800,
            toPrice: 1500,
          },
          rating: 4.2,
          description:
            "A budget-friendly hostel in Manaus (closest major city), offering dormitory-style rooms, a communal kitchen, and organized tours, perfect for backpackers and budget travelers.",
          hotelImageReference:
            "places/ChIJLdB8MGMFbJIRzSCe7c5GXd0/photos/AUy1YQ1uYMKwGIMrWC-w7Wk4M5k7dwh848kDsiKghpoWbFb6BbYsazBiFuU6TN8-oKOFwCWyyEDnNMlthznwvzYjXMaiM5c96Tgli_0Vbk6gJ18Eb68zTtmBz4a8_xwUyAdya-zhVeSPv3ZrTZwXdTWDTnFknBKEhR6qPM9vvvsocIM9EZjpBIZ3edwcRzvekike9FNsj9Orh0qLrhpgZolPjZr_2eEVYGBXWsAXzwBw8gq9Tj__WvCRjurM5fqiPx8-w4LaAdBe23wX3VM0LIJNufAp4HQTmVL8nNkQCtHfFydp5mBjL9a0ZOQnIFZhA787saMK-Tmx_DDOJbHrXwpw2pZ1g2BevYdacwH6KSZio1tu-exxn62Nr69xkpM1CDXvxcz1aPjvtKS026sS-bjviAHXENfppq9ndFqz0sxzWW83rczE",
          hotelImage:
            "https://places.googleapis.com/v1/places/ChIJLdB8MGMFbJIRzSCe7c5GXd0/photos/AUy1YQ1uYMKwGIMrWC-w7Wk4M5k7dwh848kDsiKghpoWbFb6BbYsazBiFuU6TN8-oKOFwCWyyEDnNMlthznwvzYjXMaiM5c96Tgli_0Vbk6gJ18Eb68zTtmBz4a8_xwUyAdya-zhVeSPv3ZrTZwXdTWDTnFknBKEhR6qPM9vvvsocIM9EZjpBIZ3edwcRzvekike9FNsj9Orh0qLrhpgZolPjZr_2eEVYGBXWsAXzwBw8gq9Tj__WvCRjurM5fqiPx8-w4LaAdBe23wX3VM0LIJNufAp4HQTmVL8nNkQCtHfFydp5mBjL9a0ZOQnIFZhA787saMK-Tmx_DDOJbHrXwpw2pZ1g2BevYdacwH6KSZio1tu-exxn62Nr69xkpM1CDXvxcz1aPjvtKS026sS-bjviAHXENfppq9ndFqz0sxzWW83rczE/media?maxHeightPx=500&maxWidthPx=500&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28",
        },
        {
          hotelName: "Local Family Stay (Codajás)",
          hotelAddress:
            "Contact Local Tourism Board for specifics, Codajás, Amazonas, Brazil",
          pricePerNight: {
            fromPrice: 1500,
            toPrice: 2500,
          },
          rating: 4.5,
          description:
            "Experience local Amazonian culture by staying with a family in Codajás. Often includes home-cooked meals and guided excursions, offering a unique and intimate cultural immersion (arrange via local tourism board).",
          hotelImageReference:
            "places/ChIJgfvSPkiH4TgRrB0VPdbA68w/photos/AUy1YQ23Sgau1uq1CxE3l3aySCZT7ZFE2-nG9_VwFILNtSebiSYpa4lk8VTyWSjrbI0i8lPz3I6Vnm6wclDcVXxpbQAyCkuAm6iVjgAHd1Jmr0buWkZH5jcfQSMMlqo_XGw92fol0C2sjBQs6tOfEKsHSn2zBCK1aW-MAYQaCr-gSBkuvrU8QfmgXked8tdzIjEovSrbiS2eviPCGoFRsw2GP9SYI8u8E6Sva3fslDWJ38emQDI65ggKxwxe7Afq6dtxEBKuFCdoAHBwd9oz2zT32xtb4bFfDVrX-BzvPMXwcRNfIg",
          hotelImage:
            "https://places.googleapis.com/v1/places/ChIJgfvSPkiH4TgRrB0VPdbA68w/photos/AUy1YQ23Sgau1uq1CxE3l3aySCZT7ZFE2-nG9_VwFILNtSebiSYpa4lk8VTyWSjrbI0i8lPz3I6Vnm6wclDcVXxpbQAyCkuAm6iVjgAHd1Jmr0buWkZH5jcfQSMMlqo_XGw92fol0C2sjBQs6tOfEKsHSn2zBCK1aW-MAYQaCr-gSBkuvrU8QfmgXked8tdzIjEovSrbiS2eviPCGoFRsw2GP9SYI8u8E6Sva3fslDWJ38emQDI65ggKxwxe7Afq6dtxEBKuFCdoAHBwd9oz2zT32xtb4bFfDVrX-BzvPMXwcRNfIg/media?maxHeightPx=500&maxWidthPx=500&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28",
        },
        {
          hotelName: "Floating Lodge (Near Codajás)",
          hotelAddress:
            "Contact Local Tourism Board for specifics, Near Codajás, Amazonas, Brazil",
          pricePerNight: {
            fromPrice: 4000,
            toPrice: 6000,
          },
          rating: 4.3,
          description:
            "Enjoy an immersive jungle experience by staying at a floating lodge on the Amazon River near Codajás. Offers guided tours, fishing expeditions, and wildlife spotting opportunities (book via local tourism board).",
          hotelImageReference:
            "places/ChIJmZq-oEgFbJIRimzsKYc8hVE/photos/AUy1YQ3Z0IhxpKW8mBNUz2rB63P2W0-C64dCicYDDTeV92NWDBR_KXH0ybaxfLrWXjP9nHVQN9WbBwU1_RbSl1JW3Cbsg0ObhR2nWb3oKBcXEz2FWmqWkvzRLuMuU9xhGYW1HRZMhzCG_xkRk6hC27YFHLzd5YHhsdxd7x7dtoVq0p9KQvvuJ0UE--2HULmsMsUi5NMxXsSlXopk-iJgV-c7uGOu-BiPpNIX_1mM5ItG_QcjRStftSddd-Id_eVDTJ7u-YFT5gOCIyK1AlZplrq4SG_FWRZ6WsWqXOXry8NJrXA2UuAUherY1v3OtI-osJdJaadPnSxp2ljCkUUitI-22SXUw1nb5JrCam6cuAzhr1SFITD4ijjzaSXIPHbx-weXOMPTjTS5zAoX8Lpi77_nQ9oDc3ZVpKxiyd7oqvxOjqgxkKAL",
          hotelImage:
            "https://places.googleapis.com/v1/places/ChIJmZq-oEgFbJIRimzsKYc8hVE/photos/AUy1YQ3Z0IhxpKW8mBNUz2rB63P2W0-C64dCicYDDTeV92NWDBR_KXH0ybaxfLrWXjP9nHVQN9WbBwU1_RbSl1JW3Cbsg0ObhR2nWb3oKBcXEz2FWmqWkvzRLuMuU9xhGYW1HRZMhzCG_xkRk6hC27YFHLzd5YHhsdxd7x7dtoVq0p9KQvvuJ0UE--2HULmsMsUi5NMxXsSlXopk-iJgV-c7uGOu-BiPpNIX_1mM5ItG_QcjRStftSddd-Id_eVDTJ7u-YFT5gOCIyK1AlZplrq4SG_FWRZ6WsWqXOXry8NJrXA2UuAUherY1v3OtI-osJdJaadPnSxp2ljCkUUitI-22SXUw1nb5JrCam6cuAzhr1SFITD4ijjzaSXIPHbx-weXOMPTjTS5zAoX8Lpi77_nQ9oDc3ZVpKxiyd7oqvxOjqgxkKAL/media?maxHeightPx=500&maxWidthPx=500&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28",
        },
      ],
      itinerary: [
        {
          dayNumber: 1,
          dayTheme: "Amazon River Exploration & Local Culture",
          placesToVisit: [
            {
              placeName: "Boat Trip on the Solimões River",
              description:
                "Explore the vast Solimões River, the main branch of the Amazon in this region, aboard a traditional riverboat. Witness the confluence of the Solimões and Negro rivers (meeting of the waters) near Manaus. Observe local river communities, floating markets, and diverse birdlife along the riverbanks. Experience the scale and beauty of the Amazon River ecosystem.",
              placeAddress: "Solimões River, Codajás, Amazonas, Brazil",
              bestTimeToVisit: ["6:00 AM - 11:00 AM", "2:00 PM - 5:00 PM"],
            },
            {
              placeName: "Visit a Caboclo Community",
              description:
                "Visit a traditional Caboclo community along the riverbanks to learn about their unique way of life. Interact with locals, observe their traditional farming practices, and learn about their sustainable use of Amazonian resources. Gain insights into their culture, beliefs, and relationship with the rainforest.",
              placeAddress:
                "Various Caboclo Communities, near Codajás, Amazonas, Brazil (Contact Local Tourism Board for specifics)",
              bestTimeToVisit: ["9:00 AM - 12:00 PM", "2:00 PM - 4:00 PM"],
            },
            {
              placeName: "Local Market Visit in Codajás",
              description:
                "Explore the vibrant local market in Codajás to discover the region's unique products and flavors. Sample exotic fruits, vegetables, and spices from the Amazon rainforest. Observe local vendors selling handicrafts, traditional medicines, and other regional products. Immerse yourself in the lively atmosphere of the local marketplace.",
              placeAddress: "Central Market, Codajás, Amazonas, Brazil",
              bestTimeToVisit: ["7:00 AM - 10:00 AM"],
            },
            {
              placeName: "Swimming with Pink River Dolphins",
              description:
                "Take a boat trip to an area where you can swim with the famous Pink River Dolphins. These gentle creatures are unique to the Amazon. Several tour operators near Codajas offer the opportunity to interact responsibly with these animals in their natural habitat. Be sure to choose operators who prioritize the dolphins' well-being.",
              placeAddress:
                "Amazon River, near Codajás, Amazonas, Brazil (Contact Local Tourism Board for specifics)",
              bestTimeToVisit: ["9:00 AM - 11:00 AM", "3:00 PM - 4:00 PM"],
            },
          ],
          foodPlaces: [
            {
              foodPlaceName: "Restaurante Regional Sabor Amazônico",
              approximatePricePerPerson: {
                fromPrice: 500,
                toPrice: 1000,
              },
              rating: 4.2,
              description:
                "A local restaurant serving authentic Amazonian cuisine, featuring dishes like Tacacá, Pirarucu, and Tambaqui. The restaurant offers a simple and traditional setting, providing a true taste of the region.",
              foodPlaceAddress:
                "Rua da Liberdade, 22, Codajás, Amazonas, Brazil (Exact address may vary)",
              foodPlaceImageReference: null,
              foodPlaceImage: null,
            },
            {
              foodPlaceName: "Comida Caseira da Vovó",
              approximatePricePerPerson: {
                fromPrice: 400,
                toPrice: 800,
              },
              rating: 4,
              description:
                "A family-run eatery serving homemade Brazilian comfort food. This place is known for its friendly service and generous portions of local specialties.",
              foodPlaceAddress:
                "Rua São José, 18, Codajás, Amazonas, Brazil (Exact address may vary)",
              foodPlaceImageReference:
                "places/ChIJc0g941AFbJIR1SB8jqEN1aI/photos/AUy1YQ16QZ6rv4ttb9e1euKYS52FQmxKp2jY9jFeGehTU-2teSZDtjIMqVvVVNSqwpU6oP2Ea29FxX35Bpt8t91NUJAwtZTQDm-P94XTrjusj49uIzI6Gi4m4fb1NSVo2QhuQ4Uja0Oirmr9cYupvIlwjbdkgE5zWpXRj8Qx2ECg-kXNA3w_ZvyOkkUPjzaykhPrv2uVu_volQV9aVYl_wYODqfHna2BK2W-JoJzlEy4dUNx9Mvp-HvQ1s5NEiH5i4PBxTcchBrg7JErLIFyIhodavX6pTSZGOQfig-M0nL8FrdRdg",
              foodPlaceImage:
                "https://places.googleapis.com/v1/places/ChIJc0g941AFbJIR1SB8jqEN1aI/photos/AUy1YQ16QZ6rv4ttb9e1euKYS52FQmxKp2jY9jFeGehTU-2teSZDtjIMqVvVVNSqwpU6oP2Ea29FxX35Bpt8t91NUJAwtZTQDm-P94XTrjusj49uIzI6Gi4m4fb1NSVo2QhuQ4Uja0Oirmr9cYupvIlwjbdkgE5zWpXRj8Qx2ECg-kXNA3w_ZvyOkkUPjzaykhPrv2uVu_volQV9aVYl_wYODqfHna2BK2W-JoJzlEy4dUNx9Mvp-HvQ1s5NEiH5i4PBxTcchBrg7JErLIFyIhodavX6pTSZGOQfig-M0nL8FrdRdg/media?maxHeightPx=500&maxWidthPx=500&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28",
            },
            {
              foodPlaceName: "Bar Flutuante do Rio",
              approximatePricePerPerson: {
                fromPrice: 300,
                toPrice: 600,
              },
              rating: 3.9,
              description:
                "A floating bar and restaurant on the river, offering fresh seafood, cold drinks, and stunning views of the Amazon. Enjoy the laid-back atmosphere and local hospitality.",
              foodPlaceAddress:
                "Solimões River, Codajás, Amazonas, Brazil (Floating location)",
              foodPlaceImageReference:
                "places/ChIJo9rMx_YWbJIRvDlZSOZWu4M/photos/AUy1YQ3cYxA87X5tP3fyqSKGJOEG9B6VfC0NfW73xjEJWq0T4GXm3WxjqfMy34-KatR90TdIz5ONOgCP5kL_EnsJ_CiwiJVA_p40hR7QnM_T11DKyYWiNe5eBBNJgS_yI0uytqYDxGUj03s0KF_1qhqjAz9yfhb7HGagL8pBqHRZUAnzcjn90fNSBIQ5jhzYxeGi6oUrWj5aYvPOpa1lTsM4if3aKOeOOnVLDcEk5P-0FcHV4L5Np1t4JEku5poShr921qj8QDc8-t-4bfEDaL_ykZ3QrHDO3gawUt77rJAO6be-sxaINSYphcVJ-uA7n0TM-LiRpr2LEwY47NuKgQd1jejm7ObaeVTUyLzvd5XWTrx0rO2HN9ScK4mU6b0FYy6zsU-BjlfpQ0fSGC14BfrcobGEfuKRyk1nf-45OJ9wH3Kyico",
              foodPlaceImage:
                "https://places.googleapis.com/v1/places/ChIJo9rMx_YWbJIRvDlZSOZWu4M/photos/AUy1YQ3cYxA87X5tP3fyqSKGJOEG9B6VfC0NfW73xjEJWq0T4GXm3WxjqfMy34-KatR90TdIz5ONOgCP5kL_EnsJ_CiwiJVA_p40hR7QnM_T11DKyYWiNe5eBBNJgS_yI0uytqYDxGUj03s0KF_1qhqjAz9yfhb7HGagL8pBqHRZUAnzcjn90fNSBIQ5jhzYxeGi6oUrWj5aYvPOpa1lTsM4if3aKOeOOnVLDcEk5P-0FcHV4L5Np1t4JEku5poShr921qj8QDc8-t-4bfEDaL_ykZ3QrHDO3gawUt77rJAO6be-sxaINSYphcVJ-uA7n0TM-LiRpr2LEwY47NuKgQd1jejm7ObaeVTUyLzvd5XWTrx0rO2HN9ScK4mU6b0FYy6zsU-BjlfpQ0fSGC14BfrcobGEfuKRyk1nf-45OJ9wH3Kyico/media?maxHeightPx=500&maxWidthPx=500&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28",
            },
          ],
        },
        {
          dayNumber: 2,
          dayTheme: "Jungle Trekking & Wildlife Spotting",
          placesToVisit: [
            {
              placeName: "Guided Jungle Trek with a Local Expert",
              description:
                "Embark on a guided jungle trek with a local expert to explore the Amazon rainforest on foot. Learn about the diverse flora and fauna, medicinal plants, and survival techniques from the experienced guide. Discover hidden waterfalls, ancient trees, and unique ecosystems within the rainforest.",
              placeAddress:
                "Amazon Rainforest, near Codajás, Amazonas, Brazil (Contact Local Tourism Board for specifics)",
              bestTimeToVisit: ["7:00 AM - 11:00 AM"],
            },
            {
              placeName: "Wildlife Spotting Tour (Daytime)",
              description:
                "Join a daytime wildlife spotting tour to observe the Amazon's fascinating animals in their natural habitat. Spot monkeys, sloths, birds, and other wildlife species from a canoe or boat. Learn about their behavior, ecology, and conservation from the knowledgeable guide.",
              placeAddress:
                "Amazon Rainforest, near Codajás, Amazonas, Brazil (Contact Local Tourism Board for specifics)",
              bestTimeToVisit: ["8:00 AM - 10:00 AM", "3:00 PM - 5:00 PM"],
            },
            {
              placeName: "Piranha Fishing",
              description:
                "Experience the thrill of piranha fishing in the Amazon River. Learn traditional fishing techniques from local guides and try your luck at catching these notorious fish. Enjoy the challenge and excitement of reeling in a piranha.",
              placeAddress:
                "Amazon River, near Codajás, Amazonas, Brazil (Contact Local Tourism Board for specifics)",
              bestTimeToVisit: ["9:00 AM - 11:00 AM"],
            },
            {
              placeName: "Visit a Rubber Plantation",
              description:
                "Visit a rubber plantation to learn about the history and process of rubber extraction from the Amazon rainforest. Observe how rubber tappers collect latex from rubber trees and process it into usable rubber products. Understand the economic and social importance of rubber in the Amazon region.",
              placeAddress:
                "Rubber Plantation, near Codajás, Amazonas, Brazil (Contact Local Tourism Board for specifics)",
              bestTimeToVisit: ["2:00 PM - 4:00 PM"],
            },
          ],
          foodPlaces: [
            {
              foodPlaceName: "Alimentação da Floresta",
              approximatePricePerPerson: {
                fromPrice: 450,
                toPrice: 900,
              },
              rating: 4.1,
              description:
                "A small, eco-friendly restaurant specializing in sustainable Amazonian cuisine, using locally sourced ingredients from the rainforest. They are known for their creative dishes and commitment to conservation.",
              foodPlaceAddress:
                "Located within a jungle lodge or ecotourism center near Codajás (Contact Local Tourism Board for specifics)",
              foodPlaceImageReference:
                "places/ChIJtSI0b88FbJIRVUkWZaJxYhU/photos/AUy1YQ0q7dtlsDQMwYVlyHXp8bWVoKobeW9SQTiLLrZg9jd_39WaNxQ9m03CcOMMWdS7FP0T-10QRi9OANyfGzePvFf-aWXdurRjakLh90w0YtPSjFMvobmFA5tjVR4s7_NlxnJZIhL3WpuUAaGNTw3y-cGyEeWbXRg_Rypjy7rP0gpWbkyRut2ABbnGRyNaLrqYUEYDlg69ZbzFBBpMy-HxEh9l6PStkVU91ASZpYgX8i1d-LmPNsINoSJuWKliyy8dEjDO2c3WSSf95vASTH48KYERbFv3s8103K2vOQwnEtPl6GdlcL6ycmAj6928lVK2ziF01q8F8wUkClE7IDC6sdt4Mz1xtcGpl1-2044-RcofwalQnGwgrIkN7ljw7_uu3FZzWwdeCTZ4y9EVxXNEognAvra8rEga2Xn6hEzYcmk",
              foodPlaceImage:
                "https://places.googleapis.com/v1/places/ChIJtSI0b88FbJIRVUkWZaJxYhU/photos/AUy1YQ0q7dtlsDQMwYVlyHXp8bWVoKobeW9SQTiLLrZg9jd_39WaNxQ9m03CcOMMWdS7FP0T-10QRi9OANyfGzePvFf-aWXdurRjakLh90w0YtPSjFMvobmFA5tjVR4s7_NlxnJZIhL3WpuUAaGNTw3y-cGyEeWbXRg_Rypjy7rP0gpWbkyRut2ABbnGRyNaLrqYUEYDlg69ZbzFBBpMy-HxEh9l6PStkVU91ASZpYgX8i1d-LmPNsINoSJuWKliyy8dEjDO2c3WSSf95vASTH48KYERbFv3s8103K2vOQwnEtPl6GdlcL6ycmAj6928lVK2ziF01q8F8wUkClE7IDC6sdt4Mz1xtcGpl1-2044-RcofwalQnGwgrIkN7ljw7_uu3FZzWwdeCTZ4y9EVxXNEognAvra8rEga2Xn6hEzYcmk/media?maxHeightPx=500&maxWidthPx=500&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28",
            },
            {
              foodPlaceName: "Box Grill",
              approximatePricePerPerson: {
                fromPrice: 500,
                toPrice: 1100,
              },
              rating: 4,
              description:
                "A popular grill known for it's meat and rice. Most of their meat comes straight from Amazonian animals.",
              foodPlaceAddress:
                "Rua Antônio Diniz, 595-655, Codajás - AM, 69470-000, Brazil",
              foodPlaceImageReference: null,
              foodPlaceImage: null,
            },
            {
              foodPlaceName: "Regional Delights Kioske",
              approximatePricePerPerson: {
                fromPrice: 300,
                toPrice: 700,
              },
              rating: 3.8,
              description:
                "A local Kioske known for it's traditional drinks and foods. Offers a view of the Amazon. Perfect for a cheap snack.",
              foodPlaceAddress:
                "Rua Antônio Diniz, 612, Codajás - AM, 69470-000, Brazil",
              foodPlaceImageReference: null,
              foodPlaceImage: null,
            },
          ],
        },
        {
          dayNumber: 3,
          dayTheme: "Nighttime Exploration & River Life",
          placesToVisit: [
            {
              placeName: "Caiman Spotting Tour (Nighttime)",
              description:
                "Embark on a thrilling nighttime caiman spotting tour along the riverbanks. Observe caimans, nocturnal birds, and other wildlife species in their natural habitat. Learn about their behavior, ecology, and adaptations from the experienced guide.",
              placeAddress:
                "Amazon River, near Codajás, Amazonas, Brazil (Contact Local Tourism Board for specifics)",
              bestTimeToVisit: ["7:00 PM - 9:00 PM"],
            },
            {
              placeName: "Nighttime Jungle Walk",
              description:
                "Experience the magic of the Amazon rainforest at night with a guided jungle walk. Discover nocturnal insects, amphibians, and mammals under the moonlight. Listen to the sounds of the rainforest and learn about its unique ecosystem.",
              placeAddress:
                "Amazon Rainforest, near Codajás, Amazonas, Brazil (Contact Local Tourism Board for specifics)",
              bestTimeToVisit: ["8:00 PM - 10:00 PM"],
            },
            {
              placeName: "Stargazing on the Amazon River",
              description:
                "Enjoy stargazing on the Amazon River, far from city lights. Observe the constellations, planets, and celestial events in the clear night sky. Learn about the mythology and cultural significance of the stars from the local guides.",
              placeAddress:
                "Amazon River, near Codajás, Amazonas, Brazil (Contact Local Tourism Board for specifics)",
              bestTimeToVisit: ["9:00 PM - 11:00 PM"],
            },
            {
              placeName: "Visit a Floating Village",
              description:
                "Visit a floating village along the Amazon River to experience a unique way of life. Observe how residents build and maintain their homes on floating platforms. Learn about their fishing practices, transportation methods, and cultural adaptations to river life.",
              placeAddress:
                "Floating Villages, near Codajás, Amazonas, Brazil (Contact Local Tourism Board for specifics)",
              bestTimeToVisit: ["6:00 PM - 8:00 PM"],
            },
          ],
          foodPlaces: [
            {
              foodPlaceName: "Peixaria Amazônia",
              approximatePricePerPerson: {
                fromPrice: 550,
                toPrice: 1200,
              },
              rating: 4.3,
              description:
                "A popular restaurant that specializes in fresh-caught Amazonian fish, prepared in traditional local styles. Known for their Pirarucu dishes and riverside ambiance.",
              foodPlaceAddress:
                "Located near the riverfront in Codajás (Specific location changes; ask around locally)",
              foodPlaceImageReference:
                "places/ChIJceDvL6QabJIRGcGwt1IEGAw/photos/AUy1YQ3ifUe__uMDgP_VfHn8_Gu4cWeR_GGUenbtNG2gmRQvxukH7SR9ziOARwsqJnPKz4De0BRTNKfYKbRI2px8wEV3j7QCqrqBTn4Y72yeiHBdFLwyYkahz4KXNNl0bnUNLnE-Mq3p-x-hpF1wXF7U0-xFkIZkRO6aRtFZO6Y04JIdvPcNFZP3Jk7wx6M7F3fizgMYrZuPHs8zDLAKupnkMvgClDyKh6BSo3FBRVB3OTjk-UV0JtRSf_035VwhNapM2fE6Hublm4lqf79uVkROQWiDI7USqZqSCPm95dHD0GYX5w",
              foodPlaceImage:
                "https://places.googleapis.com/v1/places/ChIJceDvL6QabJIRGcGwt1IEGAw/photos/AUy1YQ3ifUe__uMDgP_VfHn8_Gu4cWeR_GGUenbtNG2gmRQvxukH7SR9ziOARwsqJnPKz4De0BRTNKfYKbRI2px8wEV3j7QCqrqBTn4Y72yeiHBdFLwyYkahz4KXNNl0bnUNLnE-Mq3p-x-hpF1wXF7U0-xFkIZkRO6aRtFZO6Y04JIdvPcNFZP3Jk7wx6M7F3fizgMYrZuPHs8zDLAKupnkMvgClDyKh6BSo3FBRVB3OTjk-UV0JtRSf_035VwhNapM2fE6Hublm4lqf79uVkROQWiDI7USqZqSCPm95dHD0GYX5w/media?maxHeightPx=500&maxWidthPx=500&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28",
            },
            {
              foodPlaceName: "Cantina da Dona Maria",
              approximatePricePerPerson: {
                fromPrice: 400,
                toPrice: 850,
              },
              rating: 4,
              description:
                "A small, family-run cantina offering traditional Amazonian stews, soups, and snacks. Provides a taste of authentic home-style cooking.",
              foodPlaceAddress:
                "Address in a residential area of Codajás (Ask locals for directions)",
              foodPlaceImageReference: null,
              foodPlaceImage: null,
            },
            {
              foodPlaceName: "Sunset Drinks at the Pier",
              approximatePricePerPerson: {
                fromPrice: 250,
                toPrice: 600,
              },
              rating: 3.7,
              description:
                "A casual spot on the pier offering cold drinks and light snacks, perfect for enjoying the sunset over the Amazon River.",
              foodPlaceAddress: "Codajás Pier, Amazonas, Brazil",
              foodPlaceImageReference: null,
              foodPlaceImage: null,
            },
          ],
        },
        {
          dayNumber: 4,
          dayTheme: "Indigenous Culture & Craftsmanship",
          placesToVisit: [
            {
              placeName:
                "Visit an Indigenous Tribe (with permission and guide)",
              description:
                "Learn about their traditions, craftsmanship, and knowledge of the rainforest. This experience should be done with respect and with the guidance of a local expert who has established relationships with the tribe. Gain insights into their culture and sustainable way of life.",
              placeAddress:
                "Amazon rainforest, near Codajás. Specifics available through the Local Tourism Board or responsible tour operators",
              bestTimeToVisit: ["10:00 AM - 3:00 PM"],
            },
            {
              placeName: "Learn Traditional Craft Making",
              description:
                "Learn about traditional methods of crafting tools, baskets and ornaments. Engage in a workshop to try making crafts. Experience the significance of natural resources in their daily lives.",
              placeAddress:
                "Indigenous tribe close to Codajás, Amazonas, Brazil",
              bestTimeToVisit: ["10:00 AM - 12:00 PM"],
            },
            {
              placeName: "Medicinal Plant Walk",
              description:
                "Discover the medicinal properties of Amazonian plants with an expert guide. Learn about their traditional uses for healing and wellness. Understand the sustainable harvesting practices to ensure conservation of the plants",
              placeAddress:
                "Amazon rainforest, near Codajás. Specifics available through the Local Tourism Board or responsible tour operators",
              bestTimeToVisit: ["9:00 AM - 11:00 AM"],
            },
            {
              placeName: "Participate in a Traditional Dance",
              description:
                "Experience the richness of indigenous culture by observing or participating in their dance. Understand the storytelling and cultural importance conveyed through the dance. Respect the artistic expression of their people",
              placeAddress:
                "Indigenous tribe close to Codajás, Amazonas, Brazil",
              bestTimeToVisit: ["5:00 PM - 7:00 PM"],
            },
          ],
          foodPlaces: [
            {
              foodPlaceName: "Amazon Green Cuisine",
              approximatePricePerPerson: {
                fromPrice: 400,
                toPrice: 900,
              },
              rating: 4.2,
              description:
                "Explore the authentic flavors of the Amazon rainforest with a tour that focuses on foraging edible plants. Learn how to identify, harvest, and prepare local ingredients while immersing yourself in the natural beauty of the region. ",
              foodPlaceAddress:
                "R. Antônio Diniz, 510, Codajás - AM, 69470-000, Brazil",
              foodPlaceImageReference:
                "places/ChIJE7JK6VlDqpMRlWdc-mAL9-0/photos/AUy1YQ3MPk18P5IniV3fpLDvQaKh3JiX5QcmPBtiG2mNbJ8KAz_eIsowgigkzprCNQPo0Vvc59hG4igsaIKAbq4m0HLNs6Au_FTkYnEIz-R4iQhy9Jh-6xpYkutBjk3HELwJCwiTBcvu2d9TxlAErBjwvPFONp7EHmeYxRxp_Su36i85UeGoa--57JbYn0hmwAtnR4HVBBWfm-_CFDkljeP7eGgK2Evq2mqRGn8_RbDWjKnngqcBGjKK615fxpYhUzke-LlaYyymcMIxQDSLwkPW_Fu9DV3Wveh_9SbrpAwZDBJMfQ",
              foodPlaceImage:
                "https://places.googleapis.com/v1/places/ChIJE7JK6VlDqpMRlWdc-mAL9-0/photos/AUy1YQ3MPk18P5IniV3fpLDvQaKh3JiX5QcmPBtiG2mNbJ8KAz_eIsowgigkzprCNQPo0Vvc59hG4igsaIKAbq4m0HLNs6Au_FTkYnEIz-R4iQhy9Jh-6xpYkutBjk3HELwJCwiTBcvu2d9TxlAErBjwvPFONp7EHmeYxRxp_Su36i85UeGoa--57JbYn0hmwAtnR4HVBBWfm-_CFDkljeP7eGgK2Evq2mqRGn8_RbDWjKnngqcBGjKK615fxpYhUzke-LlaYyymcMIxQDSLwkPW_Fu9DV3Wveh_9SbrpAwZDBJMfQ/media?maxHeightPx=500&maxWidthPx=500&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28",
            },
            {
              foodPlaceName: "Tucunaré na Brasa",
              approximatePricePerPerson: {
                fromPrice: 400,
                toPrice: 850,
              },
              rating: 4.1,
              description:
                "Savor the flavors of Tucunaré na Brasa, a local favorite. Discover the rich flavors of grilled fish in a traditional setting, reflecting the region's culinary heritage",
              foodPlaceAddress:
                "R. Dr. Pedro Batista, 483-525, Codajás - AM, 69470-000, Brazil",
              foodPlaceImageReference: null,
              foodPlaceImage: null,
            },
            {
              foodPlaceName: "Culinária Indígena",
              approximatePricePerPerson: {
                fromPrice: 300,
                toPrice: 600,
              },
              rating: 4,
              description:
                "Embark on a culinary journey to discover the gastronomic secrets of indigenous communities, savoring traditional dishes prepared with ancestral techniques and local ingredients.",
              foodPlaceAddress:
                "R. Pref. Osório, 719, Codajás - AM, 69470-000, Brazil",
              foodPlaceImageReference:
                "places/ChIJGdzkFSQPbJIRhLHEVJI66sg/photos/AUy1YQ2xPPJMimP0mZezO04AEwEw6fnP2NlJOhygZVYJpGMx6dy2wksYirasuSJc7NKx9QZYlBSDGqc8nb1-zYUkv1UFfuIVUUOmsQhhHMovcJJEjkUUvZyf7vZHQ7303zcUOLn97xxQoZ5VqxA1qcoT82YxPcz4oBCrf_rka2aKiIWjmyuEFc10Wrtu6l09OponYUW5ndmp_sYy9dCho8zwK2l4PXlURW0mgFYhxacxnvORFSak0f25Az7eRg54WIKULemmumrOZg6wmeRweJ_eow8WPcGl_0xAFTtHYHqJnJ_Q4w",
              foodPlaceImage:
                "https://places.googleapis.com/v1/places/ChIJGdzkFSQPbJIRhLHEVJI66sg/photos/AUy1YQ2xPPJMimP0mZezO04AEwEw6fnP2NlJOhygZVYJpGMx6dy2wksYirasuSJc7NKx9QZYlBSDGqc8nb1-zYUkv1UFfuIVUUOmsQhhHMovcJJEjkUUvZyf7vZHQ7303zcUOLn97xxQoZ5VqxA1qcoT82YxPcz4oBCrf_rka2aKiIWjmyuEFc10Wrtu6l09OponYUW5ndmp_sYy9dCho8zwK2l4PXlURW0mgFYhxacxnvORFSak0f25Az7eRg54WIKULemmumrOZg6wmeRweJ_eow8WPcGl_0xAFTtHYHqJnJ_Q4w/media?maxHeightPx=500&maxWidthPx=500&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28",
            },
          ],
        },
        {
          dayNumber: 5,
          dayTheme: "River Exploration & Fishing",
          placesToVisit: [
            {
              placeName: "Sunrise River Cruise",
              description:
                "Start the day with a tranquil river cruise to witness the breathtaking sunrise over the Amazon. Enjoy the serenity of the moment as the sky paints the river with vibrant colors, offering a peaceful start to your day.",
              placeAddress: "Amazon River near Codajas, Amazon State",
              bestTimeToVisit: ["5:00 AM - 7:00 AM"],
            },
            {
              placeName: "Visit the Anavilhanas Archipelago",
              description:
                "Discover the Anavilhanas Archipelago, one of the world's largest river archipelagos, with its pristine beauty and rich biodiversity. Explore the maze of waterways, islands, and forests, providing an unforgettable experience in nature.",
              placeAddress:
                "Rio Negro, Amazon State, near Codajas. Requires boat transportation to Anavilhanas.",
              bestTimeToVisit: ["9:00 AM - 12:00 PM"],
            },
            {
              placeName: "Fishing Trip with Local Fishermen",
              description:
                "Embark on a fishing adventure alongside local fishermen to learn traditional techniques and cast your line for unique Amazonian fish. Experience the thrill of fishing in the world's largest river and immerse yourself in the daily life of the local communities.",
              placeAddress: "Amazon River near Codajas, Amazon State.",
              bestTimeToVisit: ["3:00 PM - 5:00 PM"],
            },
            {
              placeName: "Sunset Birdwatching Tour",
              description:
                "Conclude the day with a birdwatching tour during sunset, where you can spot colorful birds as they return to their nests, creating a mesmerizing spectacle against the backdrop of the Amazonian sky.",
              placeAddress: "Amazon River near Codajas, Amazon State.",
              bestTimeToVisit: ["5:00 PM - 7:00 PM"],
            },
          ],
          foodPlaces: [
            {
              foodPlaceName: "Casa do Tacacá",
              approximatePricePerPerson: {
                fromPrice: 350,
                toPrice: 700,
              },
              rating: 4.3,
              description:
                "Experience the unique flavors of Tacacá, a traditional Amazonian soup, prepared with local ingredients and served with tapioca pearls. Indulge in this regional delicacy for an authentic culinary experience.",
              foodPlaceAddress:
                "R. Pref. Osório, 648, Codajás - AM, 69470-000, Brazil",
              foodPlaceImageReference: null,
              foodPlaceImage: null,
            },
            {
              foodPlaceName: "Jaraqui Frito",
              approximatePricePerPerson: {
                fromPrice: 300,
                toPrice: 850,
              },
              rating: 4,
              description:
                "Savor the taste of Jaraqui Frito, a small fried fish served whole, as it represents a true Amazonian delicacy. Experience the crispy texture and distinct flavor of this regional specialty.",
              foodPlaceAddress:
                "R. Gov. Melo e Póvoas, 16, Codajás - AM, 69470-000, Brazil",
              foodPlaceImageReference:
                "places/ChIJCZrnEnYFbJIRDOoWFXY0WEE/photos/AUy1YQ36T-I144aYWMRDyOjNRRlQfWyyU95I9HmbSZXJ-w1gQ9BbmCvh2jl0IiPpu-tz4sqDcuhk8jf3pym8f9rOVtE1oOZnojv1g_HdE07-MFQOIpZbzFZh4Gvugv8_9jD4yV4aHZ9lesQpn-EGgMYyYKe9FLqqkYVI_6nzKOSEyImJQfkjyt1QnmDLz_E3jBzifamll6fj1ZbtZ7P9wT5EN4yJ9E5DGPC6FWU0A1aFWehhVQV09F6S_JYscfEtSaBEEfbeIXyr_O9ssoIYBCjBPe90eNWkOlI_n1joTwDysPRHbwPmwWxpknlXSB3Ml7KcitSrcxlqPYjTtePiyjD4ACNlz1x3i-krGwU42bWMv0ttQkleYYUKnAYcJ4ZatxpzXRU_WVVZdMjjNIUX09Gv376nrU5-NjmPEGprkFGC7D06Gw",
              foodPlaceImage:
                "https://places.googleapis.com/v1/places/ChIJCZrnEnYFbJIRDOoWFXY0WEE/photos/AUy1YQ36T-I144aYWMRDyOjNRRlQfWyyU95I9HmbSZXJ-w1gQ9BbmCvh2jl0IiPpu-tz4sqDcuhk8jf3pym8f9rOVtE1oOZnojv1g_HdE07-MFQOIpZbzFZh4Gvugv8_9jD4yV4aHZ9lesQpn-EGgMYyYKe9FLqqkYVI_6nzKOSEyImJQfkjyt1QnmDLz_E3jBzifamll6fj1ZbtZ7P9wT5EN4yJ9E5DGPC6FWU0A1aFWehhVQV09F6S_JYscfEtSaBEEfbeIXyr_O9ssoIYBCjBPe90eNWkOlI_n1joTwDysPRHbwPmwWxpknlXSB3Ml7KcitSrcxlqPYjTtePiyjD4ACNlz1x3i-krGwU42bWMv0ttQkleYYUKnAYcJ4ZatxpzXRU_WVVZdMjjNIUX09Gv376nrU5-NjmPEGprkFGC7D06Gw/media?maxHeightPx=500&maxWidthPx=500&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28",
            },
            {
              foodPlaceName: "Sorveteria Amazonia",
              approximatePricePerPerson: {
                fromPrice: 150,
                toPrice: 400,
              },
              rating: 3.8,
              description:
                "Enjoy the refreshing flavors of Amazonian fruits at Sorveteria Amazonia, a local ice cream shop that specializes in exotic flavors like cupuaçu, buriti, and taperebá.",
              foodPlaceAddress:
                "Av. Autazes, 966, Codajás - AM, 69470-000, Brazil",
              foodPlaceImageReference: null,
              foodPlaceImage: null,
            },
          ],
        },
        {
          dayNumber: 6,
          dayTheme: "Sustainable Living & Community Initiatives",
          placesToVisit: [
            {
              placeName: "Community Garden",
              description:
                "Participate in the activities of a local community garden, and learn organic farming practices. Plant seeds, harvest vegetables, and understand the importance of sustainable agriculture for food security and environmental conservation.",
              placeAddress:
                "Community garden near Codajás, Amazon State. Contact local tourism board for specifics.",
              bestTimeToVisit: ["9:00 AM - 11:00 AM"],
            },
            {
              placeName: "Handicraft Cooperative Visit",
              description:
                "Visit a local handicraft cooperative to appreciate the work and skill of Amazonian artisans. Browse through a variety of locally made products, and support sustainable economic initiatives that empower the community.",
              placeAddress:
                "Handicraft coop close to Codajás, Amazonas, Brazil",
              bestTimeToVisit: ["2:00 PM - 4:00 PM"],
            },
            {
              placeName: "Workshop on waste management",
              description:
                "Attend a workshop focused on waste management and learn about recycling and composting, reducing environmental impact, and contributing to a greener future. Discover sustainable living practices, by turning waste into resources.",
              placeAddress:
                "Community Center close to Codajás, Amazonas, Brazil",
              bestTimeToVisit: ["3:00 PM - 5:00 PM"],
            },
            {
              placeName: "Renewable Energy Tour",
              description:
                "Visit a site that implements renewable energy and get insight on how sustainable energy is implemented, by using natural resources and technologies to generate electricity, reducing reliance on fossil fuels, and promoting a cleaner environment for future generations.",
              placeAddress:
                "Renewable energy site close to Codajás, Amazonas, Brazil",
              bestTimeToVisit: ["9:00 AM - 11:00 AM"],
            },
          ],
          foodPlaces: [
            {
              foodPlaceName: "Restaurante Comunitário",
              approximatePricePerPerson: {
                fromPrice: 250,
                toPrice: 500,
              },
              rating: 3.9,
              description:
                "Enjoy a nutritious and affordable meal at a community-run restaurant, where locals and tourists can share a common space and support community-based initiatives.",
              foodPlaceAddress:
                "Community Center close to Codajás, Amazonas, Brazil",
              foodPlaceImageReference: null,
              foodPlaceImage: null,
            },
            {
              foodPlaceName: "Panela de Barro",
              approximatePricePerPerson: {
                fromPrice: 400,
                toPrice: 850,
              },
              rating: 4,
              description:
                "Dine at Panela de Barro, and savor the flavors of authentic regional dishes served in clay pots, offering a delicious and sustainable dining experience.",
              foodPlaceAddress:
                "R. Antônio Diniz, 529, Codajás - AM, 69470-000, Brazil",
              foodPlaceImageReference: null,
              foodPlaceImage: null,
            },
            {
              foodPlaceName: "Taverna Tropical",
              approximatePricePerPerson: {
                fromPrice: 350,
                toPrice: 600,
              },
              rating: 4.1,
              description:
                "Relish tasty food and refreshing drinks, and share stories with fellow travelers while supporting community-based establishments.",
              foodPlaceAddress:
                "Contact local tourism board for specific locations near Codajás",
              bestTimeToVisit: ["12:00 PM - 6:00 PM"],
              foodPlaceImageReference:
                "places/ChIJvbiQaBP7sY8Rh78bl2XNNEo/photos/AUy1YQ0DWQx8nDnmDfiPfI2KGBJT7B5h08ZaLwmgP1mJnO9fGEpVe2jdtOpVdvCnIcx6TokV6gMY7i3APYAL7QcNr2ZC2UzDc85_HEBRSVQNPaRCP4sF7dIk2dl3jYxqVSxJ54JHaQcIYNcye4zI6wCF2RSBA_UnsQIFTPwK-lrJ0eEZw8W9LBVnRH4ygVNDN6l2K2y6kGkzvzvG35GM9Uc08LTUweqKR4aiofKE1bNBdrLwEUjHg0f9khvoYKyOGPOhV_MTW8hVsaNDY1KdAsLec3u2VdHIHQKIGl56o20adLEORf-0rOlE_RCuvIwsN-JI9ouBTQbd_j1WTFjmzQQKl4Vo4PD9Rl-lZw6k68Ne3wJ2fdYVSDNBrfQyZ4nsg-ooi2lk2ZrerMPiNzusRlHFAUTbTV89zp6bR4aYGYTUppQkJ1I",
              foodPlaceImage:
                "https://places.googleapis.com/v1/places/ChIJvbiQaBP7sY8Rh78bl2XNNEo/photos/AUy1YQ0DWQx8nDnmDfiPfI2KGBJT7B5h08ZaLwmgP1mJnO9fGEpVe2jdtOpVdvCnIcx6TokV6gMY7i3APYAL7QcNr2ZC2UzDc85_HEBRSVQNPaRCP4sF7dIk2dl3jYxqVSxJ54JHaQcIYNcye4zI6wCF2RSBA_UnsQIFTPwK-lrJ0eEZw8W9LBVnRH4ygVNDN6l2K2y6kGkzvzvG35GM9Uc08LTUweqKR4aiofKE1bNBdrLwEUjHg0f9khvoYKyOGPOhV_MTW8hVsaNDY1KdAsLec3u2VdHIHQKIGl56o20adLEORf-0rOlE_RCuvIwsN-JI9ouBTQbd_j1WTFjmzQQKl4Vo4PD9Rl-lZw6k68Ne3wJ2fdYVSDNBrfQyZ4nsg-ooi2lk2ZrerMPiNzusRlHFAUTbTV89zp6bR4aYGYTUppQkJ1I/media?maxHeightPx=500&maxWidthPx=500&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28",
            },
          ],
        },
      ],
      createdAt: {
        seconds: 1742835682,
        nanoseconds: 602000000,
      },
      tripTitleImage:
        "https://images.unsplash.com/photo-1507125524815-d9d6dccda1dc?ixid=M3w3MTA0OTB8MHwxfHNlYXJjaHw5fHxBbWF6b24lMjBSYWluZm9yZXN0JTIwLSUyMENvZGFqJUMzJUExcyUyQyUyMFN0YXRlJTIwb2YlMjBBbWF6b25hcyUyQyUyMEJyYXppbCUyMHRyaXB8ZW58MHwwfHx8MTc0MjgzMzEzNXww&ixlib=rb-4.0.3&w=3840&h=2160&fit=crop",
      tripId: tripId,
      tripName: "Amazon Rainforest Trip",
      tripDays: 6,
      tripTravellers: 4,
      isTripSaved: false,
      isCommunityTrip: false,
    };

    sessionStorage.setItem(`trails-${tripId}`, JSON.stringify(tripData));

    navigate(`/trip/${tripId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-16">
        <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="space-y-12">
            <h1 className="text-3xl font-bold text-primary">
              Plan Your Adventure
            </h1>

            {/* Destination */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-primary">
                Where would you like to go?
              </label>
              <div className="relative">
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
            </div>

            <div className="flex flex-wrap items-baseline gap-y-5 md:gap-y-0 md:gap-x-20 ">
              <div className="w-full space-y-4 md:w-auto">
                <label className="block text-sm font-medium text-primary">
                  Select your preferred currency
                </label>
                <div className="relative group">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-3 transition-colors bg-white border border-gray-200 rounded-lg outline-none appearance-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  >
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="SAR">SAR - Saudi Riyal</option>
                    <option value="GBP">GBP - Pound Sterling</option>
                  </select>
                  <div className="absolute right-0 z-10 w-64 px-4 py-2 mt-2 text-sm text-white transition-opacity bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 top-full">
                    Trip costs will be displayed in your selected currency
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-20 gap-y-5 md:gap-y-0 md:flex-nowrap">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-primary">
                    How many days?
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleDaysChange(false)}
                      className="flex items-center justify-center w-10 h-10 transition-colors border border-gray-200 rounded-full hover:border-secondary"
                      disabled={days === 0}
                    >
                      <Minus className="w-5 h-5 text-gray-500" />
                    </button>
                    <span className="w-12 text-xl font-semibold text-center text-primary">
                      {days}
                    </span>
                    <button
                      onClick={() => handleDaysChange(true)}
                      className="flex items-center justify-center w-10 h-10 transition-colors border border-gray-200 rounded-full hover:border-secondary"
                    >
                      <Plus className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-primary">
                    Number of travelers
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleTravelersChange(false)}
                      className="flex items-center justify-center w-10 h-10 transition-colors border border-gray-200 rounded-full hover:border-secondary"
                      disabled={travelers === 1}
                    >
                      <Minus className="w-5 h-5 text-gray-500" />
                    </button>
                    <span className="w-12 text-xl font-semibold text-center text-primary">
                      {travelers}
                    </span>
                    <button
                      onClick={() => handleTravelersChange(true)}
                      className="flex items-center justify-center w-10 h-10 transition-colors border border-gray-200 rounded-full hover:border-secondary"
                      disabled={travelers === 10}
                    >
                      <Plus className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-lg font-medium text-primary">
                What's your budget?
              </label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <button
                  onClick={() => setSelectedBudget("cheap")}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-4 group hover:border-secondary ${
                    selectedBudget === "cheap"
                      ? "border-secondary bg-secondary/5"
                      : "border-gray-200"
                  }`}
                >
                  <Wallet
                    className={`w-8 h-8 transition-colors duration-200 ${
                      selectedBudget === "cheap"
                        ? "text-secondary"
                        : "text-gray-400 group-hover:text-secondary"
                    }`}
                  />
                  <div className="text-center">
                    <h3 className="font-semibold text-primary">Budget</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Best value for money
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedBudget("moderate")}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-4 group hover:border-secondary ${
                    selectedBudget === "moderate"
                      ? "border-secondary bg-secondary/5"
                      : "border-gray-200"
                  }`}
                >
                  <Hotel
                    className={`w-8 h-8 transition-colors duration-200 ${
                      selectedBudget === "moderate"
                        ? "text-secondary"
                        : "text-gray-400 group-hover:text-secondary"
                    }`}
                  />
                  <div className="text-center">
                    <h3 className="font-semibold text-primary">Comfort</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Balance of comfort and value
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedBudget("luxury")}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-4 group hover:border-secondary ${
                    selectedBudget === "luxury"
                      ? "border-secondary bg-secondary/5"
                      : "border-gray-200"
                  }`}
                >
                  <Plane
                    className={`w-8 h-8 transition-colors duration-200 ${
                      selectedBudget === "luxury"
                        ? "text-secondary"
                        : "text-gray-400 group-hover:text-secondary"
                    }`}
                  />
                  <div className="text-center">
                    <h3 className="font-semibold text-primary">Luxury</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Premium experiences
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-4 pt-8 sm:flex-row">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 px-6 py-3 transition-colors border-2 border-gray-200 rounded-lg text-primary hover:border-gray-300"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </Link>

              <CustomButton
                isLoading={isLoading}
                buttonClassName="flex-1 "
                onClickHandler={handleGenerateTrip}
                labelText="Generate Trip"
                iconClassName="transition-transform group-hover:scale-110"
              />
            </div>
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
};

export default CreateTrip;
