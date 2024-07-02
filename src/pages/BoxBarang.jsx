import React, { useState, useEffect } from 'react';
import { FaBoxOpen } from "react-icons/fa";
import axios from 'axios';
import { Link } from 'react-router-dom';


const BoxBarang = () => {
  const [countBarang, setCountBarang] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://127.0.0.1:8000/api/data_barangs/count')
      .then(response => {
        setCountBarang(response.data.countBarang);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  return (
    <Link to="/DataBarang">
    <div className="p-4 w-[200px] bg-[#B7E5B4] shadow-md rounded-lg ml-auto" style={{ boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px", marginRight: '50px' }}>
      <div className="flex items-center mb-2">
        <FaBoxOpen className="text-xl mr-2" />
        <h2 className="text-lg font-semibold">15</h2>
      </div>
      <p className="text-sm text-gray-500">Barang</p>
    </div>
    <div className="progress w-full h-1">
    </div>
    </Link>
  );
};

export default BoxBarang;
