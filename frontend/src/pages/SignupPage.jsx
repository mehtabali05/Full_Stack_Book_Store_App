import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import useDocumentTitle from "../hooks/useDocumentTitle";

const SignupPage = () => {
  useDocumentTitle('Sign Up'); 
  const { navigate, axios } = useContext(AppContext); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // state for validation errors
  const [errors, setErrors] = useState({});

  // ✅ frontend validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    setErrors(newErrors);

    // return true only if no errors
    return Object.keys(newErrors).length === 0;
  };
 
  const handleFormData = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // stop form submit if errors exist
    }

    try {
      const { data } = await axios.post("/user/signup", formData);
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
 
  return (
    <div className="flex items-center justify-center h-screen bg-primary p-4">
      <form
        onSubmit={handleFormData}
        className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Sign up</h1>
        <p className="text-gray-500 text-sm mt-2">Please sign in to continue</p>

        {/* Username */}
        <div className="flex flex-col mt-6">
          <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <FaRegUser className="w-5 h-5" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="User name"
              autoComplete="username"
              className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-lg w-full h-full"
              required
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm mt-1 text-left">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col mt-4">
          <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <MdOutlineMailOutline className="w-5 h-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Email id"
              autoComplete="username"
              className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-lg w-full h-full"
              required
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 text-left">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col mt-4">
          <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <TbLockPassword className="w-5 h-5" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Password"
              autoComplete="current-password"
              className="bg-transparent placeholder-gray-500 outline-none text-lg w-full h-full"
              required
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1 text-left">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="cursor-pointer mt-5 w-full h-11 rounded-full text-white bg-primary hover:opacity-90 transition-opacity"
        >
          Sign up
        </button>

        <p className="text-gray-500 text-sm mt-3 mb-11">
          Already have an account?{" "}
          <Link to={"/login"} className="text-primary">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
