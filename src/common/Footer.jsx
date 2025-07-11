import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-red-700 text-white py-6 px-4">
      {/* Links */}
      <div className="max-w-4xl mx-auto flex justify-center flex-wrap gap-4 text-sm font-medium mb-4 text-center">
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Terms of Service</a>
      </div>

      {/* Social Icons */}
      <div className="max-w-[6rem] mx-auto flex justify-between text-lg mb-4">
        <a href="#" className="hover:text-gray-200 transition"><FaFacebookF /></a>
        <a href="#" className="hover:text-gray-200 transition"><FaTwitter /></a>
        <a href="#" className="hover:text-gray-200 transition"><FaInstagram /></a>
      </div>

      {/* Copyright */}
      <p className="text-xs text-center">&copy; 2024 Lifeblood Connect. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
