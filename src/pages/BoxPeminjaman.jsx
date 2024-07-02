import React from 'react';
import { FaCartArrowDown } from "react-icons/fa";
import { Link } from 'react-router-dom';

const BoxPeminjaman = () => {
  return (
    <Link to="/DataPeminjaman">
    <div className="p-4 w-[200px] bg-[#F6B17A] shadow-md rounded-lg ml-auto" style={{ boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px" }}>
      <div className="flex items-center mb-2">
        <FaCartArrowDown className="text-xl mr-2" />
        <h2 className="text-lg font-semibold">20</h2>
      </div>
      <p className="text-sm text-gray-500">Peminjaman</p>
    </div>
    </Link>
  );
};

export default BoxPeminjaman;
