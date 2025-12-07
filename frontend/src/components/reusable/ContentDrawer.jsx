export default function ContentDrawer({ children, className = "" }) {
  return (
    <>
      <section
        className={`bg-white mt-2 rounded-[30px] p-3 sm:p-5 md:p-8 md:pr-10 shadow-sm h-full flex flex-col lg:flex-row gap-8 border mb-16 border-gray-100 w-full ${className}`}
        aria-label="Content Drawer"
      >
        {children}
      </section>
    </>
  );
}
