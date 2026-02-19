import { useContext, useState } from "react"
import React from 'react'
import { Link } from "react-router-dom";
import { assets } from './../assets/assets';
import { BsCart2 } from "react-icons/bs";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const {navigate,user,setUser,cartCount,axios} = useContext(AppContext);

    const logout = async () => {
        try {
            const {data} = await axios.post("/user/logout",{},{withCredentials:true});
            // console.log("Logout Data: ",data);
            if(data.success){
                setUser(null);
                localStorage.removeItem("user");
                toast.success("Logged out Successfully");
                navigate("/");
                window.scrollTo({top:0,behavior:"smooth"})
            }else{
                toast.error(data.message);
            }    
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed. Try again.");
            console.error(error);
        }
    }

  
    return (
        <nav className="sticky top-0 w-full z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">

        <div className="flex navbar items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 md:px-0">
            <Link to={"/"} >
                <img src={assets.logo} alt="" />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <Link to={"/"} >Home</Link>
                <Link to={"/books"} >Books</Link>



                {
                    user ? (
                        <div className="flex items-center gap-8">
                            <div className="relative cursor-pointer">
                                <BsCart2 onClick={() =>{
                                navigate("/cart");
                                window.scrollTo({top:0,behavior:"smooth"})
                                }} className="text-2xl" />
                                <button  className="absolute color-dark -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{cartCount}</button>
                            </div>
                        <div className="flex items-center gap-5">
                            <button onClick={() => navigate("/my-orders")} className="cursor-pointer px-8 py-2 bg-primary text-white rounded-full">
                                My Orders
                            </button>
                            <p onClick={logout} className="cursor-pointer hover:underline">Logout</p>
                        </div>
                        </div>
                        ) : (
                            <div className="flex mt-3 gap-5 flex-wrap">
                            <button onClick={() => {
                            navigate("/login");
                            window.scrollTo({top: 0,behavior:"smooth"})
                            }} className="cursor-pointer px-6 py-2 bg-white hover:bg-gray-100 transition-bg border text-primary rounded-full">
                                Login
                            </button>
                            <button onClick={() => {
                            navigate("/signup");
                            window.scrollTo({top: 0,behavior:"smooth"})
                            }} className="cursor-pointer px-6 py-2 bg-primary hover:opacity-90 transition-opacity text-white rounded-full">
                                Sign Up
                            </button>
                        </div>  
                        )}
            </div>

            <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="sm:hidden">
                {/* Menu Icon SVG */}
                <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="21" height="1.5" rx=".75" fill="#426287" />
                    <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
                    <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
                </svg>
            </button>
        </div>

            {/* Mobile Menu */}
            <div className={`${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden transition-all duration-300 ease-in-out flex flex-col gap-4 px-6 py-2 sm:hidden bg-white`}>
                <Link to={"/"} >Home</Link>
                <Link to={"/books"} >Books</Link>
                {
                    user ? (
                    <div className="flex items-start flex-col mt-3 gap-5">
                        <div className="relative cursor-pointer">
                            <BsCart2 onClick={() =>{
                            navigate("/cart");
                            window.scrollTo({top:0,behavior:"smooth"})
                            }} className="text-2xl" />
                            <button  className="absolute color-dark -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{cartCount}</button>
                        </div>
                            <button onClick={() => navigate("/my-orders")} className="cursor-pointer px-8 py-2 bg-primary text-white rounded-full">
                                My Orders
                            </button>
                            <p onClick={logout} className="cursor-pointer hover:underline">Logout</p>
                    </div>
                        ) : (
                            <div className="flex mt-3 gap-5 flex-col flex-wrap">
                                <button onClick={() => {
                                navigate("/login");
                                window.scrollTo({top: 0,behavior:"smooth"})
                                }} className="cursor-pointer px-6 py-2 bg-white border text-primary rounded-full">
                                    Login
                                </button>
                                <button onClick={() => {
                                navigate("/signup");
                                window.scrollTo({top: 0,behavior:"smooth"})
                                }} className="cursor-pointer px-6 py-2 bg-primary text-white rounded-full">
                                    Sign Up
                                </button>
                            </div>
                        )
                }
                
            </div>

        </nav>
    )
}

export default Navbar;