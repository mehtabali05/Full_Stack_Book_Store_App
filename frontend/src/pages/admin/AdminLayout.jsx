import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AdminLayoutPage = () => {

  const {navigate,setIsAdmin,axios} = useContext(AppContext);

  const sidebarLinks = [
      { name: "All Books", path: "/admin", icon: assets.list_icon },
      { name: "Add Book", path: "/admin/add-product", icon: assets.add_icon },
      { name: "Orders", path: "/admin/orders", icon: assets.order_icon },
  ];

  const logout = async () => {
    try {
        const {data} = await axios.post("/user/logout");
        // console.log("Admin Logout data",data);
        if(data.success){
            setIsAdmin(false);
            localStorage.removeItem("isAdmin"); 
            toast.success(data.message);
            navigate("/");
            window.scrollTo({top:0,behavior:"smooth"})
        }
    } catch (error) {
        // console.log(error)
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || error.message);
    }
  }

  return (
      <>
          <div className="admin-Layout flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
              <Link to="/admin">
                  <img className="h-9" src={assets.logo} alt="" />
              </Link>
              <div className="flex items-center gap-5 text-gray-500">
                  <p>Hi! Admin</p>
                  <button onClick={logout} className='border cursor-pointer rounded-full text-sm px-4 py-1'>Logout</button>
              </div>
          </div>
          <div className="flex">
          <div className="adminSidebar md:w-64 w-16 border-r h-[550px] text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
              {sidebarLinks.map((item, index) => (
                  <NavLink to={item.path} key={index} end={item.path === "/admin"}
                      className={({isActive}) => `flex items-center py-3 px-4 gap-3 
                          ${isActive ? "border-r-4 md:border-r-[6px] bg-primary border-primary text-gray-800"
                              : "hover:bg-gray-100/90 border-white text-gray-700"
                          }`
                      }
                  >
                      <img src={item.icon} alt="" className="h-7 w-7" />
                      <p className="md:block hidden text-center">{item.name}</p>
                  </NavLink>
              ))}
          </div>
          <Outlet />
          </div>
      </>
  );
};

export default AdminLayoutPage;