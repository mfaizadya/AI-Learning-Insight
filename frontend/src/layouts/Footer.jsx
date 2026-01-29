import React from "react";
import { Link } from "react-router";

export default function Footer({ className = "" }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`${className} w-full border-t border-gray-200 bg-white/50 backdrop-blur-sm py-6 md:py-8 transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
        {/* left - Copyright & Team */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-muted-foreground font-medium text-center sm:text-left">
          <p>
            <span className="text-foreground font-semibold tracking-tight">
              &copy; {currentYear} CerdasKu.
            </span>
          </p>
          <span className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></span>
          <p className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
            Team ID: A25-CS225
          </p>
        </div>

        {/* right - Links & Version */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-sm text-muted-foreground font-medium">
          <Link
            to="/privacy-policy"
            className="hover:text-primary hover:underline underline-offset-4 transition-all duration-200"
          >
            Privacy Policy
          </Link>
          
          <span className="h-4 w-px bg-gray-200 hidden sm:block"></span>
          
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary/80 text-secondary-foreground text-xs font-semibold border border-transparent shadow-sm">
            v1.0.0
          </span>
        </div>
      </div>
    </footer>
  );
}
