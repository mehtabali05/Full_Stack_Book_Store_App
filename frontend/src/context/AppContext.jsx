import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

export const AppContext = createContext(null); 

const AppContextProvider = ({children}) => {
        const navigate = useNavigate();
        const [user,setUser] = useState(null);
        const [booksData,setBooksData] = useState([]);
        const [searchQuery,setSearchQuery] = useState("");
        const [selectedCategory,setSelectedCategory] = useState("");

        const [cart, setCart] = useState(() => {
          try {
            const currentUser = JSON.parse(localStorage.getItem("user"));
            const cartKey = currentUser ? `cart_${currentUser._id}` : "cart_guest";
            const saved = localStorage.getItem(cartKey);
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
          } catch (error) {
            // console.error("Error parsing user-specific cart from localStorage:", error);
            return [];
          }
        });
        const [isAdmin,setIsAdmin] = useState(false);


        useEffect(() => {
          const currentUser = JSON.parse(localStorage.getItem("user"));
          const cartKey = currentUser ? `cart_${currentUser._id}` : "cart_guest";
          localStorage.setItem(cartKey, JSON.stringify(cart));
        }, [cart, user]);

          // ✅ Utility for safe localStorage parse
        const getFromLocalStorage = (key) => {
          const item = localStorage.getItem(key);
          if (!item || item === "undefined") return null;
          try {
            return JSON.parse(item);
          } catch (error) {
            console.error(`Failed to parse ${key} from localStorage`, error);
            localStorage.removeItem(key);
            return null;
          }
        };

        const fetchIsAdmin = async () => {
            try {
              const { data } = await axios.get("/admin/is-auth");
              // console.log("Is auth data admin:", data); 
              if (data.success) {
                const adminFlag = typeof data.admin !== "undefined" ? Boolean(data.admin) : false;
                setIsAdmin(adminFlag);
                localStorage.setItem("isAdmin", JSON.stringify(adminFlag));
              }
            } catch (error) {
              if (error.response?.status === 401) {
                setIsAdmin(false);
                localStorage.removeItem("isAdmin");
              } else {
                toast.error(error.response?.data?.message || "Error checking admin auth");
              }
            }
        }; 
           

        const fetchUser = async () => { 
            try {
              const { data } = await axios.get("/user/is-auth");
              // console.log("Is auth data user:", data);
              if (data.success) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
              }
            } catch (error) {
              if (error.response?.status === 401) {
                // Not logged in → no need to show toast
                setUser(null);
                localStorage.removeItem("user");
              } else {
                toast.error(error.response?.data?.message || "Error checking user auth");
              }
            }
        };
          

        const fetchBooksData = async () => {
            try {
                const {data} = await axios.get("/book/get-books");
                console.log("Books data",data.books);
                if(data.success){
                    setBooksData(data.books); 
                }else{
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || error.message);
            }
        } 

        const addToCart = (book) => { 
            const existingBook = cart.find((item) => item._id === book._id);
            // console.log("Add to Cart books exists",existingBook)
            if(existingBook){
                const updatedCart = cart.map((item) => item._id === book._id ? {...item,quantity:item.quantity + 1} : item);
                // console.log("Updated cart",updatedCart)
                setCart(updatedCart);
                toast.success("Quantity increased");
            }else{
                setCart([...cart,{...book,quantity: 1}])
                toast.success("added to cart");
            }
        }
 
        const updateQuantity = (productId,newQuantity) => {
            setCart((prevCart) => 
            prevCart.map((item) =>
                item._id === productId ? {...item,quantity: newQuantity} : item
            ));
            toast.success("Quantity updated Successfully");
        }

        const cartCount = Array.isArray(cart) ? cart.reduce((total, item) => total + item.quantity, 0) : 0;                                        

        const totalCartPrice = Array.isArray(cart) ? cart.reduce((total, item) => total + (item.offerPrice * item.quantity), 0): 0;
  
        const removeFromCart = (bookId) => {
            const updatedCart = cart.map((item) => item._id === bookId ? {...item,quantity:item.quantity -1} : item )
            .filter((item) => item.quantity > 0);
            console.log(updatedCart);
            setCart(updatedCart);
            toast.success("Removed from cart");
        }

        useEffect(() => {
          const savedUser = getFromLocalStorage("user");
          if (savedUser) {
            setUser(savedUser);
            fetchUser();
          } 
      
          const savedIsAdmin = getFromLocalStorage("isAdmin");
          if (savedIsAdmin !== null) {
            setIsAdmin(savedIsAdmin);
            fetchIsAdmin();
          } 

          fetchBooksData(); // books should always be fetched
        }, []);

        // ✅ Load cart specific to the logged-in user
        useEffect(() => {
          const currentUser = JSON.parse(localStorage.getItem("user"));
          const cartKey = currentUser ? `cart_${currentUser._id}` : "cart_guest";
          const savedCart = localStorage.getItem(cartKey);

          if (savedCart) {
            try {
              const parsedCart = JSON.parse(savedCart);
              setCart(Array.isArray(parsedCart) ? parsedCart : []);
            } catch (err) {
              // console.error("Error loading user-specific cart:", err);
              setCart([]);
            }
          } else {
            setCart([]); // no cart for this user yet
          }
        }, [user]);

        
        
        const value = {
            navigate,
            isAdmin,
            setIsAdmin,
            user,
            setUser,
            booksData,
            searchQuery,
            setSearchQuery,
            selectedCategory,
            setSelectedCategory,
            addToCart,
            updateQuantity,
            cartCount,
            totalCartPrice,
            removeFromCart,
            cart,
            setCart,
            axios,
            fetchBooksData
         };
    return <AppContext.Provider value={value} >
        {children}
    </AppContext.Provider>
}

export default AppContextProvider;