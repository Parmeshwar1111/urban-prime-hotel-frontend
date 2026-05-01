import React, { useState } from 'react';
import ApiService from '../../service/ApiService';

const FindBookingPage = () => {

    const [confirmationCode, setConfirmationCode] = useState('');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!confirmationCode.trim()) {
            setError("Please enter a booking confirmation code");
            setTimeout(() => setError(''), 5000);
            return;
        }

        try {
            const response = await ApiService.getBookingByConfirmationCode(confirmationCode);
            setBookingDetails(response.booking);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="px-4 md:px-16 py-10 overflow-x-hidden">

            {/* TITLE */}
            <h2 className="text-3xl font-bold text-center text-teal-700 mb-6">
                Find Your Booking
            </h2>

            {/* SEARCH BOX */}
            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 bg-white shadow p-4 rounded">

                <input
                    type="text"
                    placeholder="Enter booking confirmation code"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    className="flex-1 p-3 border rounded outline-none"
                />

                <button
                    onClick={handleSearch}
                    className="bg-teal-700 text-white px-6 py-3 rounded hover:bg-blue-900 transition"
                >
                    Find
                </button>

            </div>

            {/* ERROR */}
            {error && (
                <p className="text-center text-red-500 mt-4 font-semibold">
                    {error}
                </p>
            )}

            {/* BOOKING DETAILS */}
            {bookingDetails && (
                <div className="max-w-3xl mx-auto mt-8 bg-white shadow-lg rounded p-6">

                    <h3 className="text-xl font-bold text-teal-700 mb-4">
                        Booking Details
                    </h3>

                    <div className="space-y-2 text-gray-700">
                        <p><strong>Confirmation Code:</strong> {bookingDetails.bookingConfirmationCode}</p>
                        <p><strong>Check-in:</strong> {bookingDetails.checkInDate}</p>
                        <p><strong>Check-out:</strong> {bookingDetails.checkOutDate}</p>
                        <p><strong>Adults:</strong> {bookingDetails.numOfAdults}</p>
                        <p><strong>Children:</strong> {bookingDetails.numOfChildren}</p>
                    </div>

                    {/* USER */}
                    <div className="mt-6">
                        <h4 className="font-semibold text-lg text-teal-700 mb-2">
                            Booker Details
                        </h4>
                        <p>Name: {bookingDetails.user.name}</p>
                        <p>Email: {bookingDetails.user.email}</p>
                        <p>Phone: {bookingDetails.user.phoneNumber}</p>
                    </div>

                    {/* ROOM */}
                    <div className="mt-6">
                        <h4 className="font-semibold text-lg text-teal-700 mb-2">
                            Room Details
                        </h4>

                        <p>Room Type: {bookingDetails.room.roomType}</p>

                        <img
                            src={bookingDetails.room.roomPhotoUrl}
                            alt="Room"
                           className="w-full max-w-xs h-40 object-cover mt-3 rounded"
                        />
                    </div>

                </div>
            )}

        </div>
    );
};

export default FindBookingPage;