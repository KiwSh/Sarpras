import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { FaBoxOpen, FaHome, FaDoorClosed, FaBook } from "react-icons/fa";

const SidebarSiswa = () => {
  const [open, setOpen] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(-1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const role = Cookies.get("userRole");
    setUserRole(role);
  }, []);

  const Menus = [
    { title: "Home", src: FaHome, path: "/UserDashboard" },
    { title: "Barang", src: FaBoxOpen, path: "/BarangSiswa" },
    { title: "Ruangan", src: FaDoorClosed, gap: true, path: "/RuanganSiswa" },
    { title: "Laporan", src: FaBook, path: "/LaporanSiswa" },
  ];

  const handleNavigate = (path, index) => {
    setSelectedMenuIndex(index);
    navigate(path);
  };

  return (
    <div className="flex h-screen">
      <div className={`${open ? "w-72" : "w-20"} bg-black h-full p-5 pt-8 relative duration-300`}>
        <div className="flex flex-col items-center justify-center">
          <img
            src="./src/assets/images/sarpras2.png"
            className={`cursor-pointer duration-500 ${open ? "" : "hidden"} w-[250px] h-[250px] rounded-full rounded-tl-md rounded-tr-md rounded-bl-md rounded-br-md absolute top-0 left-1/2 transform -translate-x-1/2`}
            alt="Sarpras"
          />
          <h1 className={`text-white origin-left font-medium text-xl duration-200 ${!open ? "scale-0" : ""} mt-[160px]`}>
            SI {userRole === "admin" ? "Admin" : "SARPRAS"}
          </h1>
          <img
            src="./src/assets/images/control.png"
            className={`absolute cursor-pointer -right-3 top-9 w-7 border-gray-700 border-2 rounded-full ${!open && "rotate-180"}`}
            onClick={() => setOpen(!open)}
            alt="Toggle Sidebar"
          />
        </div>
        <ul className={`pt-6 ${!open && "hidden"}`}>
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex rounded-md p-2 cursor-pointer hover:bg-gray-700 text-gray-300 text-sm items-center gap-x-4 ${Menu.gap ? "mt-9" : "mt-5"} ${index === 0 && "bg-light-gray"} ${location.pathname === Menu.path ? "bg-gray-600" : ""}`}
              onClick={() => handleNavigate(Menu.path, index)}
            >
              {/* Menampilkan ikon jika sidebar ditutup, jika tidak, tampilkan judul dan ikon */}
              {open ? (
                <React.Fragment>
                  <Menu.src className="w-6 h-6" /> {/* Menggunakan icon dari properti src */}
                  <span className={`${!open && "hidden"} origin-left duration-200`}>{Menu.title}</span>
                </React.Fragment>
              ) : (
                <span className="mr-2">{<Menu.src className="w-6 h-6" />}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarSiswa;