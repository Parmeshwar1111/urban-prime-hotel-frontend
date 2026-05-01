import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditBookingPage = () => {

    const navigate = useNavigate();
    const { bookingCode } = useParams();

    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccessMessage] = useState(null);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await ApiService.getBookingByConfirmationCode(bookingCode);
                setBookingDetails(response.booking);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchBookingDetails();
    }, [bookingCode]);

    const acheiveBooking = async (bookingId) => {

        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            const response = await ApiService.cancelBooking(bookingId);

            if (response.statusCode === 200) {
                setSuccessMessage("Booking successfully cancelled");

                setTimeout(() => {
                    navigate('/admin/manage-bookings');
                }, 3000);
            }

        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="min-h-screen px-4 md:px-16 py-10 bg-gray-100">

            <h2 className="text-3xl font-bold text-center text-teal-700 mb-6">
                Booking Details
            </h2>

            {/* ERROR */}
            {error && (
                <p className="text-red-500 text-center mb-4 font-semibold">
                    {error}
                </p>
            )}

            {/* SUCCESS */}
            {success && (
                <p className="text-green-600 text-center mb-4 font-semibold">
                    {success}
                </p>
            )}

            {bookingDetails && (
                <div className="max-w-4xl mx-auto bg-white shadow-lg rounded p-6 space-y-6">

                    {/* BOOKING INFO */}
                    <div>
                        <h3 className="text-xl font-bold text-teal-700 mb-2">
                            Booking Info
                        </h3>

                        <p><strong>Code:</strong> {bookingDetails.bookingConfirmationCode}</p>
                        <p><strong>Check-in:</strong> {bookingDetails.checkInDate}</p>
                        <p><strong>Check-out:</strong> {bookingDetails.checkOutDate}</p>
                        <p><strong>Adults:</strong> {bookingDetails.numOfAdults}</p>
                        <p><strong>Children:</strong> {bookingDetails.numOfChildren}</p>
                        <p><strong>Guest Email:</strong> {bookingDetails.guestEmail}</p>
                    </div>

                    {/* USER */}
                    <div>
                        <h3 className="text-xl font-bold text-teal-700 mb-2">
                            User Details
                        </h3>

                        <p><strong>Name:</strong> {bookingDetails.user.name}</p>
                        <p><strong>Email:</strong> {bookingDetails.user.email}</p>
                        <p><strong>Phone:</strong> {bookingDetails.user.phoneNumber}</p>
                    </div>

                    {/* ROOM */}
                    <div>
                        <h3 className="text-xl font-bold text-teal-700 mb-2">
                            Room Details
                        </h3>

                        <p><strong>Type:</strong> {bookingDetails.room.roomType}</p>
                        <p><strong>Price:</strong> ${bookingDetails.room.roomPrice}</p>
                        <p><strong>Description:</strong> {bookingDetails.room.roomDescription}</p>

                        <img
                            src={bookingDetails.room.roomPhotoUrl}
                            alt="Room"
                            className="w-full max-w-md h-48 object-cover mt-3 rounded shadow"
                        />
                    </div>

                    {/* BUTTON */}
                    <button
                        onClick={() => acheiveBooking(bookingDetails.id)}
                        className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600 transition"
                    >
                        Cancel Booking
                    </button>

                </div>
            )}

        </div>
    );
};

export default EditBookingPage;