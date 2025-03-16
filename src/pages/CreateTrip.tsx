import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Minus, Wallet, Hotel, Plane, ArrowLeft } from "lucide-react";
import AuthModal from "../components/AuthModal";
import CustomButton from "../components/CustomButton";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Option } from "react-google-places-autocomplete/build/types";
import { v4 as uuidv4 } from "uuid";

const CreateTrip = () => {
  const navigate = useNavigate();
  const [travelers, setTravelers] = useState(1);
  const [days, setDays] = useState(1);
  const [selectedBudget, setSelectedBudget] = useState<
    "cheap" | "moderate" | "luxury" | null
  >(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Option | null>(null);

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
    console.log("Selected Place is", selectedPlace);
    // let tripTitleImage = null;
    // if (selectedPlace) {
    //   tripTitleImage = await GetUnsplashImage(selectedPlace?.label);
    // }

    const tripData = {
      tripTitleImage:
        "https://images.unsplash.com/photo-1629929065472-9b9afa7481ed?ixid=M3w3MTA0OTB8MHwxfHNlYXJjaHwxfHxKYW1tdSUyMGFuZCUyMEthc2htaXIlMjB0cmlwfGVufDB8MHx8fDE3NDIwMzIxMDB8MA&ixlib=rb-4.0.3&w=3840&h=2160&fit=crop",
      hotelOptions: [
        {
          hotelName: "The Heritage Safina Group Of Houseboats",
          hotelAddress: "Dal Lake, Srinagar, 190001, India",
          pricePerNight: {
            fromPrice: 2500,
            toPrice: 4000,
          },
          rating: 4,
          description:
            "A unique houseboat experience on Dal Lake, offering comfortable rooms and traditional Kashmiri hospitality. Includes meals and shikara rides.",
          hotelImage: null,
        },
        {
          hotelName: "Hotel Grand Boulevard",
          hotelAddress: "Boulevard Road, Srinagar, 190001, India",
          pricePerNight: {
            fromPrice: 2000,
            toPrice: 3500,
          },
          rating: 3.5,
          description:
            "Located near Dal Lake, this hotel provides well-appointed rooms, on-site dining, and easy access to Srinagar's attractions.",
          hotelImage:
            "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUy1YQ20Yd99EtKoDZnfdVSsXW2pD-iXgk9GBWv6qJrQ8nsvfqXCKJKElr6DfoU_-A8hBBu2oqtilkGwdqiS1822fZaYfZ9pZImta7KBcBGuLdxxlDEgxOD7RyKiSn-aN5tCrq38XRDStZ669OYFhLqdaP-M-F26akdxsysJ2iGs2VemKgOo9wDcZKYFRFP_HT8Xg2od5XXceHF0UV74J5J1P7it9kL_EvfNSSW4XvGCDYad6pfkfgENU-31jO4ZxXhV1c4sjSCS36at7ca-3mm0BQDJ0qnUlaTf4q1ivPpQ_lsQj5Xmb2k&3u500&4u500&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fcreate-trip&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28&token=79672",
        },
        {
          hotelName: "Hotel Mehak Pahalgam",
          hotelAddress: "Main Market, Pahalgam, 192126, India",
          pricePerNight: {
            fromPrice: 1500,
            toPrice: 2500,
          },
          rating: 3,
          description:
            "A budget-friendly option in Pahalgam, offering basic amenities and a convenient location near the market and tourist spots.",
          hotelImage:
            "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUy1YQ2wH5o1lHyxRn09CYy4FZBF3rOEHa28U3fOYqmDKjGKvJzu8rhkXEuTWJBjNMwTgQeX_FdJYXrDQgZpsMQVZ6d4ZqzsIaAjCRkNjgVV6e-Ox-YpZjB065ARgx-T2aCZ-gbc7RC5l0Vj0MsRzCHolpj95xrUe2Yg86hwjSPPM2WgGuPDSzSACWDAu8mD3DK4_IlDbRzMJ_nQ-Yn2AQ2ig2DgmGNa2OzuZSWVaVi9DjCoVOmzLzD2iXCSfq_9uG7V8Y-rgQLf76lRb0HYP6HBkkkYDE52ls8acTqIVQ5ZrAJ45FOpWfY&3u500&4u500&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fcreate-trip&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28&token=9021",
        },
        {
          hotelName: "Hotel Hilltop",
          hotelAddress: "Gulmarg, Jammu and Kashmir 193403, India",
          pricePerNight: {
            fromPrice: 2200,
            toPrice: 3800,
          },
          rating: 3.2,
          description:
            "Located near the Gondola, this hotel offers comfortable accommodation and decent food, and a cafe",
          hotelImage:
            "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUy1YQ0jRSAS84jnzLIfnvRimeNLaWcH0lbQuWf8s2KypBqxBjYmdNNyzGw68ty7kNpkBwKf_B-uxoKWLyK2TkUEp6yZCg64SFFdh8UAZDeKui4KDqX7NaZPeRt4iCkGycW3dvdsknspkzwqAU9eMrh0R4AyNGRhmQGvxPvH772I1vxksSg56P5pPpt-57IrgY3q6HFeQZlJr6MW4mrIXzjq3nXQYISdBCf237WIQ471Pwa7OceFbcnDtx_nDaeRXNEEYJzCpKW3hCrf9Md6r5y1ZYKMGaH-me8hwJrD_J1qwrAyglDQWMQ&3u500&4u500&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fcreate-trip&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28&token=56846",
        },
        {
          hotelName: "Hotel New Madhu Palace",
          hotelAddress: "Katra, Jammu, 182301, India",
          pricePerNight: {
            fromPrice: 1200,
            toPrice: 2000,
          },
          rating: 3,
          description:
            "A budget-friendly hotel in Katra, offering basic amenities and a convenient location.",
          hotelImage:
            "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUy1YQ33Hyt-gf93XC28ZYttFnmlnRAh8sX9BTxxMVDxKrwemteEt6G4WMeUVKs9ohU9LE_MGoyRMP9YkTC5cUVSoZs7Z1medCg7CKeN3GsSZi_QIt4Xa7C35-bGReTjOk87-J6Sbtzi4Z815nyAK8nVT38G8m98VaKxsWxE2nAyWMjduwA6vCXO5Y47LcGdyAqoNuoRkMqG96Dt9esmF97yXH9hH2-FaD45W8fmL4mc4DgNlxylYVOhsIzDROMk3EYL4qKVuKjVd5KXwTiZ38hqRsl59E5ncca6JdH9wKgvR0j4pcDZ38Y&3u500&4u500&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fcreate-trip&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28&token=29503",
        },
      ],
      itinerary: [
        {
          dayNumber: 1,
          dayTheme: "Srinagar Sightseeing & Dal Lake Experience",
          placesToVisit: [
            {
              placeName: "Dal Lake",
              description:
                "Experience the beauty of Dal Lake with a Shikara ride. Explore the floating gardens and markets.",
              placeAddress: "Dal Lake, Srinagar, 190001, India",
              bestTimeToVisit: ["6 AM - 8 AM", "4 PM - 6 PM"],
            },
            {
              placeName: "Nishat Bagh",
              description:
                "Visit the 'Garden of Joy,' a beautiful Mughal garden with terraced lawns, fountains, and vibrant flowerbeds.",
              placeAddress: "Nishat Bagh, Srinagar, 191121, India",
              bestTimeToVisit: ["10 AM - 12 PM"],
            },
            {
              placeName: "Shalimar Bagh Mughal Garden",
              description:
                "Explore the 'Crown of Srinagar,' another stunning Mughal garden built by Emperor Jahangir for his wife. It is known for its lush greenery and serene ambiance.",
              placeAddress: "Shalimar Bagh, Srinagar, 191121, India",
              bestTimeToVisit: ["2 PM - 4 PM"],
            },
            {
              placeName: "Hazratbal Shrine",
              description:
                "Visit the sacred Muslim shrine located on the banks of Dal Lake, known for its stunning white marble architecture.",
              placeAddress: "Hazratbal, Srinagar, 190006, India",
              bestTimeToVisit: ["4 PM - 6 PM"],
            },
          ],
          foodPlaces: [
            {
              foodPlaceName: "Mughal Darbar",
              description:
                "Famous for its traditional Kashmiri Wazwan cuisine, especially Rogan Josh and Dum Aloo.",
              foodPlaceAddress: "Residency Road, Srinagar, 190001, India",
              rating: 4.3,
              foodPlaceImage:
                "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUy1YQ1ActcX6_6j1TWE5KZjuFFiFJAecggNb3455iPSvefaiQH4FIrLUdNhjuaJ8S6HZOyApFIpsxBWkSfIys8gamFcC-OYWjb1uCi5r1nTkOyQekqT8pu3yDeu5G0G5b-V8Nkkz9Pc1BlOxgwo1bZWz9uLilj0_m_UiNwS2bB7Mj_ElaP5Ezqy6Dqe5elSsiU1Lw3lyqZPtRZOp8j6qmKklMTh9nDDNJC9HS1QhqmdjVqYLNsp0lOuhqUQLZ3hS_7OLTugqT_531VrmZ7szMMnb5gr-SMJ3AUsXVR8Vb2grtezBNbmMzs&3u500&4u500&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fcreate-trip&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28&token=37776",
            },
            {
              foodPlaceName: "Ahdoos Restaurant",
              description:
                "A popular choice for authentic Kashmiri dishes, known for its Gushtaba and flavorful curries.",
              foodPlaceAddress: "Residency Road, Srinagar, 190001, India",
              rating: 2.3,
              foodPlaceImage:
                "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUy1YQ0lpUiz-ePdIu3unyEVvw5zTv1EF0STrrgsEGTCOf5lzjJLQTX8MiHjxPSLCGln2Maa38seqbHQnQ72sR8f9kq1M-8XiwSzUZ6PiIqnhvxKDXdZ1dngaTbA06l6wlsy4uA2P4yuP_ssaw2EL_py9PUIhBtSNf_n_lpqETYs5Z6iapRBuPXYlmLKhzTB5WOQrlFTTd7JDhaWjZhccDo5bsGsJdSMyqStXnD0QgK0u8PcmeY1gTfh3-VKhhc6Ur3xtPyTdrbv3xczMSPSjWper4Ywk82Gfaw-S_0rLMD602J0xIIZ4Bs&3u500&4u500&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fcreate-trip&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28&token=636",
            },
            {
              foodPlaceName: "Shamyana Restaurant",
              description:
                "Offers tasty Kashmiri and North Indian dishes with a great lakeside ambiance.",
              foodPlaceAddress:
                "Boulevard Road, Dal Gate, Srinagar, 190001, India",
              rating: 4,
              foodPlaceImage:
                "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUy1YQ2SqqWpULwPPweFwCWhlfLVm-Z7Xx1mj3FNNoZ57TZaDSW3KPDbq0VVBc3muHXZJRCc4flS71SsuD7O8CrAhWBq6Dx0GIPlkP-s4bOIo-Rhd0Jdz9Kvtl7CI_ATI1beMxED2i7anmKlt2Nq5vcNqCippKkgFKh2UCQfmZlSri84fT7q1QA7VEvu0CfDlbulHn8WVIjQffmYZf69YpZ01bjlMFz2crllkleYkp47N3wDIMQJWzw_52k82GEW4L1PWtOxMeXX-BEIpWX2HdGsY4-CpfVmFKzypVEGXfbzoi96YzJPl-A&3u500&4u500&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fcreate-trip&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28&token=5380",
            },
          ],
        },
        {
          dayNumber: 2,
          dayTheme: "Gulmarg Excursion - Meadow of Flowers",
          placesToVisit: [
            {
              placeName: "Gulmarg Gondola",
              description:
                "Take a ride on one of the highest cable cars in the world, offering mesmerizing views of the snow-clad Himalayas.",
              placeAddress: "Gulmarg, Jammu and Kashmir 193403, India",
              bestTimeToVisit: ["10 AM - 1 PM"],
            },
            {
              placeName: "Apharwat Peak",
              description:
                "Enjoy winter sports like skiing and snowboarding or soak in the serenity of the surroundings.",
              placeAddress:
                "Apharwat Peak, Gulmarg, Jammu and Kashmir 193403, India",
              bestTimeToVisit: ["1 PM - 3 PM"],
            },
            {
              placeName: "St. Mary's Church",
              description:
                "Visit a beautiful church built in the early 20th century, a serene and peaceful place to visit.",
              placeAddress:
                "Near Golf Course, Gulmarg, Jammu and Kashmir 193403, India",
              bestTimeToVisit: ["3 PM - 4 PM"],
            },
            {
              placeName: "Strawberry Valley",
              description:
                "Known for its scenic beauty and lush greenery, ideal for a leisurely stroll.",
              placeAddress: "Gulmarg, Jammu and Kashmir 193403, India",
              bestTimeToVisit: ["4 PM - 6 PM"],
            },
            {
              placeName: "Maharani Temple",
              description:
                "An ancient temple built in 1915, that can be seen from any part of Gulmarg.",
              placeAddress: "Gulmarg, Jammu and Kashmir 193403, India",
              bestTimeToVisit: ["4 PM - 6 PM"],
            },
          ],
          foodPlaces: [
            {
              foodPlaceName: "Bakshi Restaurant",
              description:
                "Offers authentic vegetarian and Jain cuisine amidst a cozy and warm atmosphere.",
              foodPlaceAddress: "Main Market, Gulmarg, Kashmir, India",
              rating: 3.3,
              foodPlaceImage:
                "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUy1YQ32F2e0FOSHe_ZG14XvNo31q73BTHmcHg7D09OTdye2fXSO5Ra8DnKLZbJMw09T9P1vdHyX_hBCc0LjlT8Od5Rd1wtA7-uUrZeW9bZL1dv7wCdLKZG93seoD1xtvzgEI4U1Dg7yW5w9xs6cPeOlgoZYCIhTd6seD9rj_UfY8ufazE_uimFHmMr11VrwIau7TV11hwOZtTDhjF-QVxWnrVVAwk5_yiLTHl0GWo74c3GW6mdmCFkOrK6-mWshfDYUhzDyzEfZji-zDxo-KeMTIwsxbFSBi5gzaTahgucAtLyJeIgqXFk&3u500&4u500&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fcreate-trip&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28&token=94511",
            },
            {
              foodPlaceName: "Hotel Highlands Park",
              description: "Famous for its Rogan Josh and Kashmiri Pulao.",
              foodPlaceAddress: "Church Road, Gulmarg, Kashmir, India",
              rating: 4,
              foodPlaceImage:
                "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUy1YQ3EcfzvBwwvJ0NHiYjt0QPdMuxK7qG-eoLc080XROZhBVtVEUA5BgTMs07L50Ve3vDIQSg6WmOzxVj9wkABcHcp6BWzQGeOS_3nQw2BHovDBrpUVk48Qh8d_CI7aZFhlxJRsXHPUJpjhkThfTLc7ohd6OADJ9ROcA-uq8x3s_D3c0yXWCr5Bq63Hau_SrhcDKUVzMdezDh4_jEz3NhcT2VLtgzcnivplPUEd1OO2xM1C1tH5T4GKDKs6Lr5C9g7lDnUObk9wyTxQg2fy_6D8OVcYlqZfMjHz0hsT0LnRVknqLOBbpU&3u500&4u500&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fcreate-trip&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28&token=118201",
            },
            {
              foodPlaceName: "Alpine Lounge",
              description: "Offers Kashmiri Pulao and Chicken Tikka.",
              foodPlaceAddress: "Hotel Hilltop, Gulmarg, India",
              rating: 2,
              foodPlaceImage:
                "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUy1YQ08gxNgJTbouTNwYyGvwkUtKm9Yz1YY_-pSpGtmR8S3uaguL3gGHCOf5gbgLn58GNuq2Q8MlnWN2ilf_F4QGodAyOn-VjfPtGHriVyYG27vDUhjJ4ShRpDSMHnoDMxas00nhSL3th6NwVYn3mHUJr05lDmmwMRP28wjmu3GqolTQhCvoO-iJdk-yP-NfM22lOEBr2iMurvkqfpjBmEb7BbWGrhxhQpcLa8rah2lj3fWGVKiWCJM3CfC0Zqzz1_JtpTXi4hRJ6RIp7b5JeJ3qHml-Il_-aVWyheNfAlG4OOut3OmNZc&3u500&4u500&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fcreate-trip&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28&token=51435",
            },
          ],
        },
        {
          dayNumber: 3,
          dayTheme: "Pahalgam Exploration - Valley of Shepherds",
          placesToVisit: [
            {
              placeName: "Betaab Valley",
              description:
                "Enjoy the stunning views of mountains, streams, and waterfalls. Named after the Bollywood movie 'Betaab'.",
              placeAddress:
                "Pahalgam, Anantnag, Jammu and Kashmir 192126, India",
              bestTimeToVisit: ["9 AM - 11 AM"],
            },
            {
              placeName: "Aru Valley",
              description:
                "Visit this scenic valley known for its lush green meadows, pristine streams, and trekking routes.",
              placeAddress: "Aru, Pahalgam, Jammu and Kashmir 192126, India",
              bestTimeToVisit: ["11 AM - 1 PM"],
            },
            {
              placeName: "Chandanwari",
              description:
                "A snow clad region, known as the starting point for the Amarnath Yatra.",
              placeAddress:
                "Chandanwari, Pahalgam, Jammu and Kashmir 192126, India",
              bestTimeToVisit: ["2 PM - 4 PM"],
            },
            {
              placeName: "Lidder River",
              description:
                "Enjoy river rafting or simply relax by the banks of the Lidder River.",
              placeAddress:
                "Pahalgam, Anantnag, Jammu and Kashmir 192126, India",
              bestTimeToVisit: ["4 PM - 6 PM"],
            },
          ],
          foodPlaces: [
            {
              foodPlaceName: "Dana Pani",
              description:
                "Known for its delicious Kashmiri dishes and warm hospitality.",
              foodPlaceAddress: "Main Market, Pahalgam, India",
              rating: 1,
              foodPlaceImage:
                "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUy1YQ26iqBAyhC_3ZOLdYL5BhbWxBksfwizXkWGUL3YdUSfAjcsPkUIs9B0AFMv05xFNf4bM7lWLs3x9a9P1sYkm3fXaWtjEuawSwnjDMhR68sXjM4SC1VzgSta4mvRCn_tYDUjWQj5KRMciSwJMiSNIh4Z2f5cwD-WWGUQjYrY5Iyh9sOmEJex7QVUMe-IKH_FNkQsphR9EktCBRqrciHlVfGZj-rE1NBZI8DQCZX31fh7jL_5ZGo3NjIF5UYEaFgqWPHyjO4gMdekfWrgKM-Wfq8XOBcXY4AYpd6smVJVZ_ZhiGmrArs&3u500&4u500&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fcreate-trip&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28&token=68796",
            },
            {
              foodPlaceName: "Troutbeat",
              description:
                "Specializes in fresh trout dishes, located by the Lidder River.",
              foodPlaceAddress: "Main Market, Pahalgam, India",
              rating: 4,
              foodPlaceImage:
                "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUy1YQ2sw3O8_M7QPgwl33fWWxFabh-PkXtvzz1glMQNPSXj0sbxpxaTe_J_Ejl_TSQb8Npea6ODuwNMpwpjul8SR78cACjZfqxf76sR5ENnW3SkdDisHdbkSQgw7jPXB9jei5U2R6V2pBbbx_kFIY6kwmrGRrcYKMnxBGkNjcI6BIcYap5ZpGxuaU8W6ROYVg-9nATrhaCB-4t_UHFK5RrLUiBrGuznAV_E5YDl5fJbhwFf5o8NiZQhC5kpTxgmwklBVEbJiI6DzUU59gB6PQRBkB6OyPmGdMDI9At3ktNBRNifRkKL8Ac&3u500&4u500&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fcreate-trip&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28&token=35690",
            },
            {
              foodPlaceName: "Royal Mughal Darbar",
              description:
                "Offers rich and flavorful Mughlai cuisine with a luxurious dining experience.",
              foodPlaceAddress:
                "Main Market, Opp J&K Bank, Chandanwari Road, Pahalgam, India",
              rating: 5,
              foodPlaceImage:
                "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUy1YQ1GGhaAl40igLByrkc_7TgzYNsD9KQDGh66ap65qVLF6t-8k3TCETcfStQ5ZUxbCp1UyVPex8I8C0qmO_Zub7qCPMUNzbDvlLY3k6_8B7URF5W9-hFqFIPK_gxxyDbYvKK7cZd7FF1sofq5lkcdzM5vItXkquilrM90mQIWh4pNW2zjO0uYYxoBmcrhE-ksx_6DhjozV8e_Pc7qZh6Vqx6_R25uLZruqPV2i7x2IALNuAU3Dy9VATxp8lp4-9GicnhuXM0p7j7v1wgSJTD5ArwEzYPsF2s3fW_i2J0mV0CEiGUyP3c&3u500&4u500&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fcreate-trip&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28&token=29093",
            },
          ],
        },
        {
          dayNumber: 4,
          dayTheme: "Return to Srinagar & Local Exploration",
          placesToVisit: [
            {
              placeName: "Indira Gandhi Memorial Tulip Garden",
              description:
                "Visit Asia's largest tulip garden (seasonal, March-April).",
              placeAddress: "Srinagar, Jammu and Kashmir, India",
              bestTimeToVisit: ["10 AM - 12 PM"],
            },
            {
              placeName: "Chashme Shahi",
              description:
                "Explore this Mughal garden known for its natural spring with supposed healing properties.",
              placeAddress: "Srinagar, Jammu and Kashmir, India",
              bestTimeToVisit: ["12 PM - 1 PM"],
            },
            {
              placeName: "Pari Mahal",
              description:
                "Visit this seven-terraced garden offering panoramic views of Srinagar and Dal Lake.",
              placeAddress: "Srinagar, Jammu and Kashmir, India",
              bestTimeToVisit: ["3 PM - 5 PM"],
            },
            {
              placeName: "Botanical Garden",
              description:
                "With more than 1.5 lakh ornamental plants, the Botanical Garden is among the best places to visit in Srinagar.",
              placeAddress: "Srinagar, Jammu and Kashmir, India",
              bestTimeToVisit: ["3 PM - 5 PM"],
            },
          ],
          foodPlaces: [
            {
              foodPlaceName: "The Chinar at The LaLiT Grand Palace",
              description:
                "Offers breathtaking views and a delightful multi-cuisine menu.",
              foodPlaceAddress: "Gupkar Road, Srinagar, 190001, India",
              rating: 2,
              foodPlaceImage:
                "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUy1YQ1h-gP0O3AIvFR5y_V1_Z_vZjuujNyoe9LJdVe3N_Gj3gHHijpRZrRIQZaTH17JVIjzjRdSv-e0r1tyPzlCrI3MOBO1Z4W_aSioT84wkkWmR8nQFQncS1x6qD-YLDR0e0ZWZvdHEWoXZxQKMWi8TcyZqZNpDcbEHcK0F_19S7kvhm2l-guD5qvr67R_kB71Qsrd9hNFnwd6As3pEVR2ujoPCElx7_1wQcAHU0lXmBfoIxm3QkR5KBUWjuWMnvRN5QO811BhYFCrZRmPzlewXeT7tfIGBzV-PuL3EsJMWxwIrgwFZFM&3u500&4u500&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fcreate-trip&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28&token=69189",
            },
            {
              foodPlaceName: "Stream Restaurant",
              description:
                "Serves a variety of vegetarian North Indian dishes.",
              foodPlaceAddress: "Raj Bagh, Srinagar, India",
              rating: 4,
              foodPlaceImage:
                "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUy1YQ3q-n_JxtCb22jB7HHtRNGN1lgX4WPG90kTzWuDLGqBqtCXW4Za_7TZJNJVkRxzn-o1k-X-1fVePWhbv97FiEOW2iCrgQCry9pwUGMGGMP1VHeZH1fOeY5wlcxpBTm0hZhc_QgLNcE7ShXVPQZ0ckQUgRkmcooaGwwzf1z84tA8I-kZRF4WGoVQ-1moe1rRn2AKiql_OJJmmETNcGRXAkvSgrDLqTtvQEO5x_ofUMWMwLCYE6aE5cFdWkrK4UvmDbqFCCGYRS1pSUxlIkfbvK2Py7tCQrZz_09ENbFEcL9-dFk3Zjc&3u500&4u500&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fcreate-trip&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28&token=18743",
            },
            {
              foodPlaceName: "Lhasa Restaurant",
              description:
                "Cozy cafe with some amazing Tibetan cuisine and impeccable service.",
              foodPlaceAddress:
                "Lane No 3, Boulevard Road, Dal Gate, Srinagar, India",
              rating: 3,
              foodPlaceImage:
                "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUy1YQ1PpXzoNKiBIt3-Y8uepMdftk_cDkocoiO45S2NuUzXArUejZcfg5as6FgBWNTPFpCBdviUzCzk-3d7GUJIGXzSwID-YDP8prRTxiTxxexjpcR1WO82RaRBlN1idjdSB2JcI3feokxd1HGFZBCqmXDRqdR1GxFQ2yraimBTkVjGbX7H_Q29-ouk7MHefEtPR_2fP0Dv5z4aWOrJX4o3UqrSXix3y5z5ELym04vZixe3rLoCHsH9DlxJDLtRZ3tyotQ1EcxsFcg3Z8BJG9Lr2R3Oymdx5jTHS_tfL0ihafmEacnVl4c&3u500&4u500&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fcreate-trip&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28&token=13543",
            },
          ],
        },
        {
          dayNumber: 5,
          dayTheme: "Spiritual & Historical Sites",
          placesToVisit: [
            {
              placeName: "Shankaracharya Temple",
              description:
                "Visit this ancient temple dedicated to Lord Shiva, located on a hilltop offering panoramic views of Srinagar.",
              placeAddress: "Srinagar, Jammu and Kashmir, India",
              bestTimeToVisit: ["8 AM - 10 AM"],
            },
            {
              placeName: "Jamia Masjid",
              description:
                "Visit this magnificent 14th-century mosque known for its stunning Indo-Saracenic architecture.",
              placeAddress: "Nowhatta, Srinagar, 190003, India",
              bestTimeToVisit: ["10 AM - 12 PM"],
            },
            {
              placeName: "Hari Parbat Fort",
              description:
                "Explore this historic fort overlooking Srinagar, offering panoramic views of the city and surrounding landscapes.",
              placeAddress: "Srinagar, Jammu and Kashmir, India",
              bestTimeToVisit: ["2 PM - 4 PM"],
            },
            {
              placeName: "Polo View Market",
              description: "Shop in the local markets.",
              placeAddress: "Srinagar, Jammu and Kashmir, India",
              bestTimeToVisit: ["3 PM - 5 PM"],
            },
          ],
          foodPlaces: [
            {
              foodPlaceName: "Cafe de Linz",
              description: "A non-vegetarian food heaven.",
              foodPlaceAddress: "Court Rd, Srinagar, India",
              rating: 5,
              foodPlaceImage:
                "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUy1YQ0Z2I9fAdUPMoQD6iiNpsNIyaVvAKnSnli9pnEZIimZ3Z04uURJMxSd7GLS39qbl3ctpcIUTqCXW57fvF0Qhc8tsFYKzsrkJCf5ueFDr1fTjOEsNRLRMKgDFmmUVUnMfWkvSqd3YYdkZEY6mI8shgXJiR635h-Z17TCBMKoQWWWd9Bbqq88Qf-D-iN-of2_AP4efcKzhyKUHijFOO-gmzOobsxcBR5ir9We2UjPV2yv4qv4rJYBBzXi8yQNs212MbJQTCn9YdT31Jf1pq-QA_FnHGa0XlhkDhisoRvsAxZs-0w1Ebc&3u500&4u500&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fcreate-trip&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28&token=84111",
            },
            {
              foodPlaceName: "14th Avenue Cafe & Grill",
              description: "offers multi-cuisine dishes",
              foodPlaceAddress:
                "Lal Mandi, Rajbagh, Near Foot Bridge, Srinagar, India",
              rating: 3,
              foodPlaceImage:
                "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUy1YQ3GipV-fGs3VnLo548e91Hsrtq3AVC9YMsoyesxD6n7XSJtbPjhIhdP_o4NZ5-ZTy6AOTIDxyHPRS65LKhJ4vegVMuW-ESOVHlfVJ9KcbPJWkYOhE-6SoSiCKvH2IGchA2i3vUz5y3GyIkXMQoVnWparxvyT-XCnmHAacmCogyuqXjD6WhZkqm8h0TGpJdNBN-c5lUu24r6OJ6sfaLZw8Czmbaf6yWt2saCXiTZE8dIjKIa00RnnHvEfLeUjzhBUXW_e9IJ3Guf_oNuEBvWJ4MqO0526VVQYIi3_FMmo14Q9rSSBlk&3u500&4u500&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fcreate-trip&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28&token=95812",
            },
            {
              foodPlaceName: "Arabian Barbecue",
              description: "Offers barbecue.",
              foodPlaceAddress: "Srinagar, Jammu and Kashmir, India",
              rating: 2,
              foodPlaceImage:
                "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAUy1YQ3IzE1Z688nqgLJ9PqaPSXX02ks2prlw77v6PRWsN3OObCanPCYFnXzXcUFjfD54X_rZFoJ10btUFQGxnUHnenJBEmnQ3rosJG2a9GW0fKAm2Se0_M6QR0YmzFwROQPpj3N4zdn4YBL2q8-JSViVQj09hOKL5aDqp1LzPqQbkLQk7l_TZpTq2Hdutt-nAzjBVIdhrDp9q882vIj9fuT2M1CrqlAje7ybkydU1sAiJofg8fDpzIN2GFMMwk57MOPk9zpyKvXUgxHrWW1QOouz4VZm9vYQS1jA1ZSbl4LeHzsuVWEroU&3u500&4u500&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fcreate-trip&key=AIzaSyAwG6dwerKWFOZwhmoxzehU43OCNl4Im28&token=42856",
            },
          ],
        },
      ],
    };

    // const updatedHotelOptions = await Promise.all(
    //   tripData.hotelOptions.map(async (hotel: hotelType) => {
    //     const hotelImage = await GetPlacesImage(
    //       hotel.hotelName,
    //       hotel.hotelAddress
    //     );
    //     return { ...hotel, hotelImage };
    //   })
    // );

    // const updatedItinerary = await Promise.all(
    //   tripData.itinerary.map(async (day) => {
    //     const updatedFoodPlaces = await Promise.all(
    //       day.foodPlaces.map(async (foodPlace: foodPlaceType) => {
    //         const foodPlaceImage = await GetPlacesImage(
    //           foodPlace.foodPlaceName,
    //           foodPlace.foodPlaceAddress
    //         );
    //         return { ...foodPlace, foodPlaceImage };
    //       })
    //     );

    //     return { ...day, foodPlaces: updatedFoodPlaces };
    //   })
    // );

    // const updatedTrip = {
    //   ...tripData,
    //   hotelOptions: updatedHotelOptions,
    //   itinerary: updatedItinerary,
    // };
    // console.log("Updated Trip Data", updatedTrip);

    navigate(`/trip/${uuidv4()}`, { state: tripData });
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

            {/* Trip Details Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Currency Selector */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-primary">
                  Select your preferred currency
                </label>
                <div className="relative group">
                  <select className="w-full px-4 py-3 transition-colors bg-white border border-gray-200 rounded-lg outline-none appearance-none focus:border-secondary focus:ring-1 focus:ring-secondary">
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

              {/* Trip Days */}
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

              {/* Number of Travelers */}
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

            {/* Budget Selection */}
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
            <div className="flex flex-col gap-4 pt-8 sm:flex-row">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 px-6 py-3 transition-colors border-2 border-gray-200 rounded-lg text-primary hover:border-gray-300"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </Link>
              <CustomButton
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
