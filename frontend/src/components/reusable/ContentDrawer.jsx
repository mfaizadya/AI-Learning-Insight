export default function ContentDrawer({ children }) {
  return (
    <>
      <section
        className="bg-white mt-2 rounded-[30px] p-8 shadow-sm min-h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-8 border border-gray-100"
        aria-label="Content Drawer"
      >
        {children}
      </section>
    </>
  );
}
