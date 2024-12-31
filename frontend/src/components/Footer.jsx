import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 font-poppins">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 My E-Commerce. All rights reserved.</p>
        <div className="mt-4">
          <a href="/privacy" className="hover:text-gray-400 mr-4 ">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-gray-400">
            Terms of Service
          </a>
        </div>
        <div className="mt-4 flex justify-center space-x-6">
          <a
            href="https://facebook.com"
            target="_blank"
            className="text-white hover:text-gray-400"
          >
            <i className="fab fa-facebook-square text-2xl"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            className="text-white hover:text-gray-400"
          >
            <i className="fab fa-instagram-square text-2xl"></i>
          </a>
          {/* Added LinkedIn Icon */}
          <a
            href="https://linkedin.com"
            target="_blank"
            className="text-white hover:text-gray-400"
          >
            <i className="fab fa-linkedin text-2xl"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
