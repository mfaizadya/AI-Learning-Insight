import React from "react";

export default function Footer({ className = "" }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`${className} max-md:ml-0 border-t border-gray-200 bg-white py-6 md:py-8`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* left */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-xs sm:text-sm text-muted-foreground font-medium">
          <p>
            <span className="text-foreground font-semibold">
              &copy; {currentYear} CerdasKu.
            </span>
          </p>
          <span className="hidden md:block w-1.5 h-1.5 bg-border rounded-full"></span>
          <p className="flex items-center gap-1">Team ID: A25-CS225</p>
        </div>

        {/* right */}
        <div className="flex items-center gap-4 md:gap-6 text-xs sm:text-sm text-muted-foreground font-medium">
          <a
            href="/privacy-policy"
            className="hover:text-primary transition-colors duration-200"
          >
            Privacy Policy
          </a>
          {/* <a
            href="#"
            className="hover:text-primary transition-colors duration-200"
          >
            Terms of Service
          </a> */}
          <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-[10px] sm:text-xs border border-border">
            v1.0.0
          </span>
        </div>
      </div>
    </footer>
  );
}
