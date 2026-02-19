import React, { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import useDocumentTitle from "../hooks/useDocumentTitle";

const SendOtpPage = () => {
  useDocumentTitle('Send OTP');
  const {navigate,axios} = useContext(AppContext);
  const [email,setEmail] = useState("");
  
  const handleFormData = async (e) => {
    e.preventDefault();
  
    try {
      const {data} = await axios.post("/user/email-send",{email},{withCredentials: true});
      console.log("Email Sent data",data);
      if(data.success){
        toast.success(data.message);
        localStorage.setItem("resetEmail", email);
        navigate("/reset-password");
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || error.message);
    }
  }
  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <form onSubmit={handleFormData} className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Reset Password</h1>
        
        <div className="flex items-center w-full mt-10 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <MdOutlineMailOutline className= "text-2xl" />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email id"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            required
          />
        </div>

        <div className="flex gap-3 mb-5 mt-5">
          <button
            type="submit"
            className="cursor-pointer mt-2 w-full h-11 rounded-full text-white bg-primary hover:opacity-90 transition-opacity"
          >
            Send OTP
          </button>

          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer mt-2 w-full h-11 rounded-full text-white bg-primary hover:opacity-90 transition-opacity"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendOtpPage;
