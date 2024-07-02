import React, { useState, useEffect } from "react";
import Api from "../../Api";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import sarprasImage from "../../assets/images/sarpras2.png";
import backgroundImage from "../../assets/images/background.jpg";

export default function Login() {
  document.title = "Login - SI Sarpras";

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const login = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrors("Email and password are required.");
      return;
    }
    setLoading(true);

    try {
      const response = await Api.post("/api/login", {
        email: email,
        password: password,
      });

      Cookies.set("token", response.data.token);
      Cookies.set("user", JSON.stringify(response.data.user));
      Cookies.set("permissions", JSON.stringify(response.data.permissions));
      Cookies.set("role", response.data.roles[0]);

      toast.success("Login Successfully!", {
        position: "top-right",
        duration: 4000,
        style: {
          background: "#4CAF50",
          color: "#fff",
          padding: "16px",
        },
        icon: "✔️",
        iconTheme: {
          primary: "white",
          secondary: "#4CAF50",
        },
      });

      const userRole = response.data.roles[0];

      switch (userRole) {
        case "admin":
          navigate("/AdminDashboard");
          break;
        case "user":
          navigate("/UserDashboard");
          break;
        default:
          console.error("Role not recognized:", userRole);
          navigate("/default-dashboard");
      }
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.message);
      } else if (error.request) {
        setErrors("Network error. Please try again later.");
      } else {
        setErrors("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 z-0">
        <img src={backgroundImage} alt="Background" className="w-full h-full object-cover" />
      </div>
      <div className="bg-opacity-50 relative z-10">
        <div className="min-h-screen flex justify-center items-center">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:mr-8 mb-8 lg:mb-0 text-center lg:text-left pb-[200px]" style={{ fontFamily: "'Lexend Deca', sans-serif" }}>
              <img
                src={sarprasImage}
                className="mb-3"
                alt="Sarpras"
                style={{ width: "400px", height: "auto"}}
              />
              <h1 className="mb-3 font-bold text-5xl text-white">Welcome To:</h1>
              <p className="pr-3 text-white">Sistem Informasi Peminjaman Alat Sarana Dan Prasana Sekolah SMKN 1 Ciomas Kab.Bogor</p>
            </div>
            <div className="lg:ml-8">
              <div className="p-12" style={{ background: "rgba( 255, 255, 255, 0.15 )", boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )", backdropFilter: "blur( 5.5px )", WebkitBackdropFilter: "blur( 5.5px )", borderRadius: "10px", border: "1px solid rgba( 255, 255, 255, 0.18 )" }}>
                <div className="mb-4">
                  <h3 className="font-semibold text-2xl text-black-700 text-center">Login </h3>
                  <p className="text-white text-center">Please login to your account.</p>
                </div>
                <form onSubmit={login} className="space-y-5">
                  <div className="space-y-2">
                    <label className="mb-2 text-sm font-medium text-black-700">Email</label>
                    <input
                      className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                      type="email"
                      placeholder="test@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="mb-2 text-sm font-medium text-black-700">Password</label>
                    <input
                      className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <hr />
                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center bg-black hover:bg-blue-500 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Masuk"}
                    </button>
                    <br />
                    <div className="flex justify-between">
                      <div className="text-sm">
                        <Link to="/Readme" className="text-black-400 hover:text-blue-500">Wajib Baca!</Link>
                      </div>
                      <div className="text-sm">
                        <Link to="/Help" className="text-black-400 hover:text-blue-500">Help?</Link>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="pt-5 text-center text-white text-xs">
                  <span>
                    {errors && <p className="text-red-500">{errors}</p>}
                    &nbsp;
                    Copyright © SARPRAS SKANIC
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
