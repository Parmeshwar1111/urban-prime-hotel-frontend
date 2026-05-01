import React from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const RoomResult = ({ roomSearchResults }) => {

    const navigate = useNavigate();
    const isAdmin = ApiService.isAdmin();

    return (
        <section className="w-full px-4 md:px-16 mt-6">

            {roomSearchResults && roomSearchResults.length > 0 ? (

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {roomSearchResults.map((room) => (

                        <div 
                            key={room.id}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col md:flex-row"
                        >

                            {/* IMAGE */}
                            <img 
                                src={room.roomPhotoUrl}
                                alt={room.roomType}
                                className="w-full md:w-1/3 h-48 md:h-auto object-cover"
                            />

                            {/* DETAILS */}
                            <div className="flex flex-col justify-between p-4 flex-1">

                                <div>
                                    <h3 className="text-xl font-bold text-teal-700 mb-2">
                                        {room.roomType}
                                    </h3>

                                    <p className="text-gray-600 mb-2">
                                        {room.roomDescription}
                                    </p>

                                    <p className="text-lg font-semibold text-orange-500">
                                        ${room.roomPrice} / night
                                    </p>
                                </div>

                                {/* BUTTON */}
                                <div className="mt-4">

                                    {isAdmin ? (
                                        <button
                                            onClick={() => navigate(`/admin/edit-room/${room.id}`)}
                                            className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-blue-900 transition w-full md:w-auto"
                                        >
                                            Edit Room
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => navigate(`/room-details-book/${room.id}`)}
                                            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition w-full md:w-auto"
                                        >
                                            View / Book Now
                                        </button>
                                    )}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            ) : (
                <p className="text-center text-gray-500 mt-6">
                    No rooms available. Try different filters.
                </p>
            )}

        </section>
    );
};

export default RoomResult;