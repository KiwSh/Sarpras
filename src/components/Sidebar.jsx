import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FaHome, FaBoxOpen, FaDoorClosed, FaCartArrowDown, FaUser } from "react-icons/fa";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    const role = Cookies.get("userRole");
    setUserRole(role);
  }, []);

  const Menus = [
    { title: "Home", path: "/AdminDashboard" },
    { title: "Data Barang", path: "/DataBarang" },
    { title: "Data Ruangan", path: "/DataRuangan" },
    { title: "Data Peminjaman", path: "/DataPeminjaman" },
    { title: "Data User", path: "/DataUser" },
  ];

  const handleNavigate = (path, index) => {
    setSelectedMenuIndex(index);
    navigate(path);
  };

  const renderMenuItem = (Menu) => {
    const iconClass = `w-6 h-6`;

    if (Menu.title === "Home") {
      return (
        <React.Fragment>
          <FaHome className={iconClass} />
          <span className={`ml-2 ${!open && "opacity-0"}`} style={{ fontFamily: 'Livvic, sans-serif' }}>
            {Menu.title}
          </span>
        </React.Fragment>
      );
    } else if (Menu.title === "Data Barang") {
      return (
        <React.Fragment>
          <FaBoxOpen className={iconClass} />
          <span className={`ml-2 ${!open && "opacity-0"}`} style={{ fontFamily: 'Livvic, sans-serif' }}>
            {Menu.title}
          </span>
        </React.Fragment>
      );
    } else if (Menu.title === "Data Ruangan") {
      return (
        <React.Fragment>
          <FaDoorClosed className={iconClass} />
          <span className={`ml-2 ${!open && "opacity-0"}`} style={{ fontFamily: 'Livvic, sans-serif' }}>
            {Menu.title}
          </span>
        </React.Fragment>
      );
    } else if (Menu.title === "Data Peminjaman") {
      return (
        <React.Fragment>
          <FaCartArrowDown className={iconClass} />
          <span className={`ml-2 ${!open && "opacity-0"}`} style={{ fontFamily: 'Livvic, sans-serif' }}>
            {Menu.title}
          </span>
        </React.Fragment>
      );
    } else if (Menu.title === "Data User") {
      return (
        <React.Fragment>
          <FaUser className={iconClass} />
          <span className={`ml-2 ${!open && "opacity-0"}`} style={{ fontFamily: 'Livvic, sans-serif' }}>
            {Menu.title}
          </span>
        </React.Fragment>
      );
    }
  };

  return (
    <div className="flex">
      <div
          className={`${
          open ? "w-72" : "w-20 "
        } bg-black h-screen p-5 pt-8 relative duration-300`}
      >
        <div className="flex flex-col items-center justify-center">
          <img
            src="../src/assets/images/sarpras2.png"
            className={`cursor-pointer duration-500 ${
              open ? "" : "hidden"
            } w-[250px] h-[250px] rounded-full rounded-tl-md rounded-tr-md rounded-bl-md rounded-br-md absolute top-0 left-1/2 transform -translate-x-1/2`}
            alt="Sarpras"
          />
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open ? "scale-0" : ""
            } mt-[160px]`} // Adjust margin-top to bring down the text closer to the menu
          >
            SI {userRole === "admin" ? "Admin" : "SARPRAS"}
          </h1>
          <img
            src="../src/assets/images/control.png"
            className={`absolute cursor-pointer -right-3 top-9 w-7 border-gray-700
             border-2 rounded-full  ${!open && "rotate-180"}`}
            onClick={() => setOpen(!open)}
            alt="Toggle Sidebar"
          />
        </div>
        <ul className={`pt-8 ${!open && "hidden"}`}> {/* Adjust margin-top here */}
          {/* Rendering menus */}
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex  rounded-md p-2 cursor-pointer hover:bg-gray-700 text-gray-300 text-sm items-center gap-x-4 
              mt-2 ${index === selectedMenuIndex && "bg-gray-700"}`} // Adjust margin-top for gaps
              onClick={() => handleNavigate(Menu.path, index)} 
            >
              {/* Render menu item */}
              {renderMenuItem(Menu)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;
