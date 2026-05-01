import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

function Navbar() {
    const isAuthenticated = ApiService.isAuthenticated();
    const isAdmin = ApiService.isAdmin();
    const isUser = ApiService.isUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        const isLogout = window.confirm('Are you sure you want to logout this user?');
        if (isLogout) {
            ApiService.logout();
            navigate('/home');
        }
    };

    const linkClass = ({ isActive }) =>
        `transition duration-300 ${
            isActive ? "text-orange-400 font-semibold" : "text-gray-600 hover:text-orange-400"
        }`;

    return (
        <nav className="flex justify-between items-center px-10 py-5 bg-white shadow">
            
            {/* Logo */}
            <div className="text-2xl font-bold text-teal-700">
                <NavLink to="/home">Urban Prime Hotel</NavLink>
            </div>

            {/* Links */}
            <ul className="text-xl flex items-center gap-6 flex-wrap">
                <li><NavLink to="/home" className={linkClass}>Home</NavLink></li>
                <li><NavLink to="/rooms" className={linkClass}>Rooms</NavLink></li>
                <li><NavLink to="/find-booking" className={linkClass}>Find my Booking</NavLink></li>

                {isUser && (
                    <li><NavLink to="/profile" className={linkClass}>Profile</NavLink></li>
                )}

                {isAdmin && (
                    <li><NavLink to="/admin" className={linkClass}>Admin</NavLink></li>
                )}

                {!isAuthenticated && (
                    <li><NavLink to="/login" className={linkClass}>Login</NavLink></li>
                )}

                {!isAuthenticated && (
                    <li><NavLink to="/register" className={linkClass}>Register</NavLink></li>
                )}

                {isAuthenticated && (
                    <li 
                        onClick={handleLogout}
                        className="cursor-pointer text-gray-600 hover:text-red-500 transition"
                    >
                        Logout
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;