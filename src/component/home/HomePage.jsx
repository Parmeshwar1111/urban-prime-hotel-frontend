import React, { useState } from "react";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";

const HomePage = () => {

    const [roomSearchResults, setRoomSearchResults] = useState([]);

    const handleSearchResult = (results) => {
        setRoomSearchResults(results);
    };

    return (
        <div className="pb-20 overflow-x-hidden">

            {/* HERO SECTION */}
           <section className="relative h-[80vh] max-w-full overflow-hidden">

                {/* Background Image */}
                <img 
                    src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"
                    alt="Urban Prime Hotel"
                   className="w-full h-full object-cover block"
                />

                {/* Overlay (lighter for better text visibility) */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Text Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                    
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-lg">
                        Welcome to <span className="text-orange-400">Urban Prime Hotel</span>
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-100 drop-shadow-md">
                        Experience luxury, comfort & premium hospitality
                    </p>

                </div>
            </section>

            {/* SEARCH SECTION */}
            <div className="px-6 md:px-16 mt-10">
                <RoomSearch handleSearchResult={handleSearchResult} />
            </div>

            {/* RESULTS SECTION */}
            <div className="px-6 md:px-16 mt-6">
                <RoomResult roomSearchResults={roomSearchResults} />
            </div>

            {/* VIEW ALL ROOMS */}
            <div className="text-center mt-6">
                <a 
                    href="/rooms"
                    className="text-orange-400 text-lg font-semibold underline hover:text-orange-500 transition"
                >
                    View All Rooms
                </a>
            </div>

            {/* SERVICES TITLE */}
            <h2 className="text-center text-3xl font-bold text-teal-700 mt-12">
                Services at <span className="text-orange-400">Urban Prime Hotel</span>
            </h2>

            {/* SERVICES SECTION */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 md:px-16 mt-8">

                {/* CARD 1 */}
                <div className="flex items-center gap-4 p-5 border rounded-lg shadow hover:shadow-lg transition">
                    <img src="./assets/images/ac.png" alt="AC" className="w-12" />
                    <div>
                        <h3 className="font-bold text-teal-700">Air Conditioning</h3>
                        <p className="text-gray-600 text-sm">
                            Stay cool and comfortable with in-room AC.
                        </p>
                    </div>
                </div>

                {/* CARD 2 */}
                <div className="flex items-center gap-4 p-5 border rounded-lg shadow hover:shadow-lg transition">
                    <img src="./assets/images/mini-bar.png" alt="Mini Bar" className="w-12" />
                    <div>
                        <h3 className="font-bold text-teal-700">Mini Bar</h3>
                        <p className="text-gray-600 text-sm">
                            Enjoy snacks and beverages anytime.
                        </p>
                    </div>
                </div>

                {/* CARD 3 */}
                <div className="flex items-center gap-4 p-5 border rounded-lg shadow hover:shadow-lg transition">
                    <img src="./assets/images/parking.png" alt="Parking" className="w-12" />
                    <div>
                        <h3 className="font-bold text-teal-700">Parking</h3>
                        <p className="text-gray-600 text-sm">
                            Secure parking available for guests.
                        </p>
                    </div>
                </div>

                {/* CARD 4 */}
                <div className="flex items-center gap-4 p-5 border rounded-lg shadow hover:shadow-lg transition">
                    <img src="./assets/images/wifi.png" alt="WiFi" className="w-12" />
                    <div>
                        <h3 className="font-bold text-teal-700">WiFi</h3>
                        <p className="text-gray-600 text-sm">
                            Free high-speed internet everywhere.
                        </p>
                    </div>
                </div>

            </section>

        </div>
    );
};

export default HomePage;