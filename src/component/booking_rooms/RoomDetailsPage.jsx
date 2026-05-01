import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService'; // Assuming your service is in a file called ApiService.js
import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

const RoomDetailsPage = () => {
  const navigate = useNavigate(); // Access the navigate function to navigate
  const { roomId } = useParams(); // Get room ID from URL parameters
  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track any errors
  const [checkInDate, setCheckInDate] = useState(null); // State variable for check-in date
  const [checkOutDate, setCheckOutDate] = useState(null); // State variable for check-out date
  const [numAdults, setNumAdults] = useState(1); // State variable for number of adults
  const [numChildren, setNumChildren] = useState(0); // State variable for number of children
  const [totalPrice, setTotalPrice] = useState(0); // State variable for total booking price
  const [totalGuests, setTotalGuests] = useState(1); // State variable for total number of guests
  const [showDatePicker, setShowDatePicker] = useState(false); // State variable to control date picker visibility
  const [userId, setUserId] = useState(''); // Set user id
  const [showMessage, setShowMessage] = useState(false); // State variable to control message visibility
  const [confirmationCode, setConfirmationCode] = useState(''); // State variable for booking confirmation code
  const [errorMessage, setErrorMessage] = useState(''); // State variable for error message

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading state to true
        const response = await ApiService.getRoomById(roomId);
        setRoomDetails(response.room);
        const userProfile = await ApiService.getUserProfile();
        setUserId(userProfile.user.id);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching or error
      }
    };
    fetchData();
  }, [roomId]); // Re-run effect when roomId changes


  const handleConfirmBooking = async () => {
    // Check if check-in and check-out dates are selected
    if (!checkInDate || !checkOutDate) {
      setErrorMessage('Please select check-in and check-out dates.');
      setTimeout(() => setErrorMessage(''), 5000); // Clear error message after 5 seconds
      return;
    }

    // Check if number of adults and children are valid
    if (isNaN(numAdults) || numAdults < 1 || isNaN(numChildren) || numChildren < 0) {
      setErrorMessage('Please enter valid numbers for adults and children.');
      setTimeout(() => setErrorMessage(''), 5000); // Clear error message after 5 seconds
      return;
    }

    // Calculate total number of days
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;

    // Calculate total number of guests
    const totalGuests = numAdults + numChildren;

    // Calculate total price
    const roomPricePerNight = roomDetails.roomPrice;
    const totalPrice = roomPricePerNight * totalDays;

    setTotalPrice(totalPrice);
    setTotalGuests(totalGuests);
  };
  const formatDate = (date) => date.toLocaleDateString('en-CA');
const handlePayment = async () => {
  try {

    // 🚨 1. CHECK IF DATES EXIST
    if (!checkInDate || !checkOutDate) {
      setErrorMessage("Please select dates first");
      return;
    }

    // 🚨 2. FORMAT DATES (FIX TIMEZONE BUG)
    const formattedCheckInDate = formatDate(checkInDate);
    const formattedCheckOutDate = formatDate(checkOutDate);

    // 🚨 3. CHECK AVAILABILITY BEFORE PAYMENT
    const isAvailable = await ApiService.checkAvailability(
      roomId,
      formattedCheckInDate,
      formattedCheckOutDate
    );

    if (!isAvailable) {
      setErrorMessage("Room not available for selected dates ❌");
      return;
    }

    // ✅ 4. IF AVAILABLE → CONTINUE PAYMENT
    const order = await ApiService.createOrder(totalPrice);

    const options = {
      key: "rzp_test_S7himHMdfujbzL",
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: "Urban Prime Hotel Booking",
      description: "Room Booking Payment",

      handler: async function (response) {
        console.log("Payment success:", response);
        await acceptBooking(response);
      },

      theme: {
        color: "#0a8f8f"
      }
    };

    const razor = new window.Razorpay(options);
    razor.open();

  } catch (error) {
  console.error("FULL ERROR:", error);
  console.error("RESPONSE:", error.response);
  setErrorMessage(error.response?.data || error.message);
}
};
  const acceptBooking = async (paymentData) => {
    try {

      // Ensure checkInDate and checkOutDate are Date objects
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);

      // Log the original dates for debugging
      console.log("Original Check-in Date:", startDate);
      console.log("Original Check-out Date:", endDate);

      // Convert dates to YYYY-MM-DD format, adjusting for time zone differences
      const formattedCheckInDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const formattedCheckOutDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];


      // Log the original dates for debugging
      console.log("Formated Check-in Date:", formattedCheckInDate);
      console.log("Formated Check-out Date:", formattedCheckOutDate);

      // Create booking object
      const booking = {
        checkInDate: formattedCheckInDate,
        checkOutDate: formattedCheckOutDate,
        numOfAdults: numAdults,
        numOfChildren: numChildren,

        // Razorpay payment details
      razorpayOrderId: paymentData.razorpay_order_id,
      razorpayPaymentId: paymentData.razorpay_payment_id,
      paymentStatus: "PAID"

      };
      console.log(booking)
      console.log(checkOutDate)

      // Make booking
      const response = await ApiService.bookRoom(roomId, userId, booking);
      if (response.statusCode === 200) {
        setConfirmationCode(response.bookingConfirmationCode); // Set booking confirmation code
        setShowMessage(true); // Show message
        // Hide message and navigate to homepage after 5 seconds
        setTimeout(() => {
          setShowMessage(false);
          navigate('/rooms'); // Navigate to rooms
        }, 10000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setTimeout(() => setErrorMessage(''), 5000); // Clear error message after 5 seconds
    }
  };

  if (isLoading) {
    return <p className='room-detail-loading'>Loading room details...</p>;
  }

  if (error) {
    return <p className='room-detail-loading'>{error}</p>;
  }

  if (!roomDetails) {
    return <p className='room-detail-loading'>Room not found.</p>;
  }

  const { roomType, roomPrice, roomPhotoUrl, description, bookings } = roomDetails;

return (
  <div className="px-4 md:px-16 pt-4 pb-24 max-w-5xl mx-auto">

    {/* SUCCESS MESSAGE */}
    {showMessage && (
     <p className="bg-green-100 text-green-700 p-3 rounded text-center mb-4">
  Booking successful! 🎉 <br />
  Your confirmation code is <strong>{confirmationCode}</strong>. <br />
  A confirmation and invoice have been sent to your registered email.
</p>
    )}

    {/* ERROR */}
    {errorMessage && (
      <p className="bg-red-100 text-red-600 p-3 rounded text-center mb-4">
        {errorMessage}
      </p>
    )}

    <h2 className="text-3xl font-bold text-center text-teal-700 mb-6">
      Room Details
    </h2>

    {/* IMAGE */}
    <img
      src={roomPhotoUrl}
      alt={roomType}
      className="w-full max-h-[350px] object-cover rounded shadow"
    />

    {/* DETAILS */}
    <div className="mt-6 space-y-2 text-gray-700">
      <h3 className="text-xl font-bold text-teal-700">{roomType}</h3>
      <p className="text-orange-500 font-semibold">${roomPrice} / night</p>
      <p>{description}</p>
    </div>

    {/* EXISTING BOOKINGS */}
    {bookings && bookings.length > 0 && (
      <div className="mt-6">
        <h3 className="font-bold text-lg mb-2">Existing Bookings</h3>
        <ul className="space-y-2">
          {bookings.map((booking, index) => (
            <li key={booking.id} className="border p-2 rounded">
              Booking {index + 1} → {booking.checkInDate} to {booking.checkOutDate}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* BUTTONS */}
    <div className="mt-6 flex gap-4">
      <button
        onClick={() => setShowDatePicker(true)}
        className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-blue-900 transition"
      >
        Book Now
      </button>

      <button
        onClick={() => setShowDatePicker(false)}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Go Back
      </button>
    </div>

    {/* DATE PICKER + FORM */}
    {showDatePicker && (
      <div className="mt-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* CHECK-IN */}
          <div>
            <label className="block mb-1 font-medium">Check-in</label>
            <DatePicker
              selected={checkInDate}
              onChange={(date) => setCheckInDate(date)}
              selectsStart
              startDate={checkInDate}
              endDate={checkOutDate}
              placeholderText="Check-in Date"
              className="w-full p-2 border rounded"
              wrapperClassName="w-full"
            />
          </div>

          {/* CHECK-OUT */}
          <div>
            <label className="block mb-1 font-medium">Check-out</label>
            <DatePicker
              selected={checkOutDate}
              onChange={(date) => setCheckOutDate(date)}
              selectsEnd
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={checkInDate}
              placeholderText="Check-out Date"
              className="w-full p-2 border rounded"
              wrapperClassName="w-full"
            />
          </div>

          {/* ADULTS */}
          <div>
            <label className="block mb-1 font-medium">Adults</label>
            <input
              type="number"
              min="1"
              value={numAdults}
              onChange={(e) => setNumAdults(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* CHILDREN */}
          <div>
            <label className="block mb-1 font-medium">Children</label>
            <input
              type="number"
              min="0"
              value={numChildren}
              onChange={(e) => setNumChildren(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

        </div>

        {/* CONFIRM BUTTON */}
        <button
          onClick={handleConfirmBooking}
          className="mt-4 w-full bg-orange-500 text-white p-3 rounded hover:bg-orange-600 transition"
        >
          Confirm Booking
        </button>

      </div>
    )}

    {/* TOTAL PRICE */}
    {totalPrice > 0 && (
      <div className="mt-6 p-4 bg-gray-100 rounded text-center">
        <p className="font-semibold">Total Price: ${totalPrice}</p>
        <p>Total Guests: {totalGuests}</p>

        <button
          onClick={handlePayment}
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Pay & Confirm Booking
        </button>
      </div>
    )}

  </div>
);
};

export default RoomDetailsPage;
