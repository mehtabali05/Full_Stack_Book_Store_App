import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import toast from "react-hot-toast";
import  {AppContext} from "../../context/AppContext";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const AdminLogin = () => {
  useDocumentTitle('Admin Login');
  const {setIsAdmin,navigate,axios} = useContext(AppContext);
  const [formData,setFormData] = useState({
    email: "",
    password: ""
  });

  const handleFormData = async (e) => {
    e.preventDefault();
    try { 
      const {data} = await axios.post("/user/login",formData);
      // console.log("Admin Login Data: ",data);
      if(data?.success){
        const adminFlag = typeof data?.admin !== "undefined" ? Boolean(data.admin) : true;
        setIsAdmin(adminFlag);
        localStorage.setItem("isAdmin", JSON.stringify(adminFlag));
        toast.success(data?.message);  
        navigate("/admin");
      }else{ 
        toast.error(data?.message);
      }

    } catch (error) {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || error.message);
    }
  } 
  
  return (
    <div className="flex items-center justify-center h-screen bg-primary p-4">
      <form onSubmit={handleFormData} className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Admin Login</h1>
        <p className="text-gray-500 text-sm mt-2">Please sign in to continue</p>
        <div className="flex items-center w-full mt-10 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <MdOutlineMailOutline className= "text-2xl" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData,email:e.target.value})}
            placeholder="Email id"
            autoComplete="email"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <TbLockPassword className= "text-2xl" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData,password:e.target.value})}
            placeholder="Password"
            autoComplete="current-password"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            required
          />
        </div>
        <div className="mt-5 text-left text-indigo-500">
          <Link className="text-sm" to="/">
            Forgot password?
          </Link>
        </div>

        <button
      
          className="cursor-pointer my-6 w-full h-11 rounded-full text-white bg-primary hover:opacity-90 transition-opacity"
        >
          Login
        </button>
       
      </form>
    </div>
  );
};

export default AdminLogin;
