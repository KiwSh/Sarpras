import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

export default function LayoutDefault({ children }) {
  return (
    <>
      <main className="content"> 
         {/* navbar */}
        <Navbar />
          {/* sidebar */}
        <Sidebar />
        {/* children */}
        {children}
      /* </main>
    </>
  );
}
