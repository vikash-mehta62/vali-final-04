import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Sidebar from "../layout/Sidebar";
import { useNavigate } from "react-router-dom";

const Map = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const mapRef = useRef(null); // prevent multiple map initializations

  useEffect(() => {
    if (mapRef.current) return; // already initialized
    const map = L.map("map").setView([33.749, -84.388], 7);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "Map data &copy; OpenStreetMap contributors",
    }).addTo(map);

    const warehouses = [
      { name: "Old Warehouse", coords: [33.8995, -84.2436], color: "blue" },
      { name: "New Warehouse", coords: [33.7284, -84.4608], color: "green" },
    ];

    warehouses.forEach((wh) => {
      L.circleMarker(wh.coords, {
        radius: 10,
        color: wh.color,
        fillOpacity: 0.7,
      })
        .addTo(map)
        .bindPopup(`<b>${wh.name}</b>`);
    });

    const customers = [
      {
        name: "Agrifresh LLC",
        coords: [28.5379, -81.4256],
        address: "3445 Bartlett Blvd, Orlando FL 32811",
      },
      {
        name: "Akshar Grocery",
        coords: [33.8857, -84.1175],
        address: "475 Rockbridge Road NW, Lilburn, GA",
      },
      {
        name: "Ambaji USA Shakti Mandir",
        coords: [33.6134, -84.3564],
        address: "1450 Huie Road, Lake City GA 30260",
      },
      {
        name: "ASMAS Cuisine",
        coords: [33.9482, -84.118],
        address: "3099 Breckinridge Blvd #114B, Duluth GA 30096",
      },
      {
        name: "Baps Shayona",
        coords: [33.8851, -84.1167],
        address: "460 Rockbridge Road, Lilburn GA 30047",
      },
      {
        name: "BAPS Shayona Charlotte NC",
        coords: [35.153, -80.7012],
        address: "4100 Margaret Wallace RD, Mathews NC 28105",
      },
      {
        name: "BAPS SHAYONA MORRISVILLE NC",
        coords: [35.8466, -78.8256],
        address: "1020 Aviation Pkwy, Morrisville NC 27560",
      },
      {
        name: "Bengal Store and Halal Meat",
        coords: [33.8805, -84.2454],
        address: "2475 Chamblee Tucker Road, Chamblee GA 30341",
      },
      {
        name: "Bharath Bazaar ATL",
        coords: [33.8753, -84.4684],
        address: "2997 Cumberland BLVD SE, Atlanta GA 30080",
      },
      {
        name: "Bharath Bazar NC",
        coords: [35.7896, -78.8571],
        address: "738 Slash Pine Drive, Cary NC 27519",
      },
      {
        name: "D Market",
        coords: [33.4488, -84.1453],
        address: "112 McDonough Plaza, McDonough GA 30253",
      },
      {
        name: "Dev Indian Market",
        coords: [32.5222, -84.9552],
        address: "1290 Double Churches Rd Ste J, Columbus, GA 31904",
      },
      {
        name: "Grand India Mart",
        coords: [35.7315, -78.8495],
        address: "544 East Williams Street, Apex NC 27502",
      },
      {
        name: "House Of Spice",
        coords: [28.4563, -81.3938],
        address: "1137 Doss Ave, Orlando FL 32809",
      },
      {
        name: "India Bazaar",
        coords: [29.6251, -82.3748],
        address: "3550 SW 34th Street Suite-J, Gainesville FL 32608",
      },
      {
        name: "India Bazaar Dunwoody",
        coords: [33.9304, -84.3064],
        address: "4639 N Shallowford Rd, Dunwoody, GA 30338",
      },
      {
        name: "INDIA IMPORTS",
        coords: [33.5678, -84.4132],
        address: "6475 SR-85, RIVERDALE GA 30274",
      },
      {
        name: "India Market Knoxville",
        coords: [35.9305, -84.0325],
        address: "1645 Downtown W Blvd Unit 26, Knoxville, TN 37919",
      },
      {
        name: "India Mart Huntsville",
        coords: [34.7431, -86.6515],
        address: "4925 University Dr, Huntsville AL 35816",
      },
      {
        name: "India Plaza",
        coords: [34.1194, -84.2631],
        address: "2905 Jordan Court Ste E, Alpharetta, GA 30004",
      },
      {
        name: "India Spice Montgomery",
        coords: [32.3415, -86.2565],
        address: "3630 Malcolm Dr., Montgomery, AL 36116",
      },
      {
        name: "INDIACO ATLANTA",
        coords: [34.0715, -84.1747],
        address: "11720 Medlock Beidhe RD ST 545, Johns Creek GA 30097",
      },
      {
        name: "Indifresh",
        coords: [34.1942, -84.1233],
        address: "2770 Atlnata Hwy, Cumming GA 30040",
      },
      {
        name: "Indous Food Inc/ Shreeji Grocery",
        coords: [33.9194, -84.2119],
        address: "5675 Jimmy Carter Blvd, Norcross GA 30071",
      },
      {
        name: "Janta Farmers Market Chattanooga",
        coords: [35.0475, -85.1706],
        address: "6500 Lee Hwy, Chattanooga TN 37421",
      },
      {
        name: "Janta Farmers Market Knoxville",
        coords: [35.9112, -84.0918],
        address: "8459 Kingstone Pike, Knoxville TN 37919",
      },
      {
        name: "Janta Farmers Market Lexington KY",
        coords: [37.9973, -84.4564],
        address: "2903 Richmond Road Ste 110, Lexington KY 40509",
      },
      {
        name: "Jay Bhavani",
        coords: [34.0425, -84.0651],
        address: "3230 Calibar St Ste A-104, Suwanee GA 30024",
      },
      {
        name: "Jyoti Grocery",
        coords: [34.0031, -84.1403],
        address: "2820 Peachtree Industrial Blvd, Duluth, GA 30097",
      },
    ];

    customers.forEach((cust) => {
      L.marker(cust.coords)
        .addTo(map)
        .bindPopup(`<b>${cust.name}</b><br>${cust.address}`);
    });
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {isSidebarOpen && (
        <div className="w-[250px] bg-gray-200 border-r">
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>
      )}
      <div id="map" className="flex-1" />
    </div>
  );
};

export default Map;
