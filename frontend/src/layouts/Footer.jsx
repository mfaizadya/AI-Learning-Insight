import React from "react";

export default function Footer({ className = "" }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`${className} max-md:w-full max-md:ml-0 border-t border-gray-200 bg-white py-8`}
    >
      <div className="px-8 flex sm:flex-col md:flex-row justify-between items-center gap-4">
        {/* left */}
        <div className="flex flex-col max-sm:items-start md:flex-row items-center gap-2 md:gap-4 text-xs text-gray-500 font-medium">
          <p>
            <span className="text-gray-700 font-semibold">
            &copy; {currentYear}{" "}
              CerdasKu.
            </span>
          </p>
          <span className="hidden md:block w-1 h-1 bg-gray-300 rounded-full"></span>
          <p className="flex items-center gap-1">Tim ID: A25-CS225</p>
        </div>

        {/* right */}
        <div className="flex flex-col max-sm:gap-2 sm:flex items-center gap-6 text-xs text-gray-500 font-medium">
          <a
            href="/privacy-policy"
            className="hover:text-[#5d4b85] transition-colors duration-200"
          >
            Privacy Policy
          </a>
          {/* <a
            href="#"
            className="hover:text-[#5d4b85] transition-colors duration-200"
          >
            Terms of Service
          </a> */}
          <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 border border-gray-300">
            v1.0.0
          </span>
        </div>
      </div>
    </footer>
  );
}
