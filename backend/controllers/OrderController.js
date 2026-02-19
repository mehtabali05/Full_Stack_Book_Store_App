import dotenv from "dotenv";
dotenv.config();
import Book from "../models/BookModel.js";
import Order from "../models/OrderModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET); 

export const placeOrder = async (req,res) => {
    try {
        const {id} = req.user;
        let userId = id;
        const {items,address,paymentOption} = req.body;

        if(!items || !address || items.length === 0 || !paymentOption){
            return res.status(400).json({
                success: false,
                message: "Invalid order details"
            })
        } 


        let amount = 0;
        for(const item of items){
            const book = await Book.findById(item.product);
            if(!book){
                return res.status(404).json({
                    success: false,
                    message: "Book not found"
                });
            }

            amount += book.offerPrice * item.quantity;
        }

        await Order.create({
            userId, 
            items,
            address,
            amount,
            paymentType : paymentOption,
            isPaid: paymentOption === "COD" ? false : true,
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully"
        });
    } catch (error) {
        // console.log("Order placement error:",error);
        return res.status(500).json({
            success: false,
            message:"Internal Server Error"
        })
    }
}
 

export const getUserOrders = async (req,res) => { 
    try {
        const {id} = req.user;
        let userId = id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const orders = await Order.find({
            userId,
            $or:[{paymentType: "COD"}, {paymentType: "Stripe"}]
        }).sort({createdAt: -1});

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message:"Internal Server Error"
        })
    }
}

export const getAllOrders = async (req,res) => {
    try {
        const orders = await Order.find({
          
        }).sort({createdAt: -1}).populate("userId","name email");

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:"Internal Server Error"
        })
    }
}

export const createCheckoutSessionController =  async (req,res) =>{
    try {
        const {id} = req.user;
        let userId = id; // because route is protected by authUser
      const {items, address} = req.body; 
      // const origin = req.headers.get("origin");
  
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).send({ success: false, message: "No items found in cart" });
      }

    let productData = [];

    let amount = await items.reduce(async (acc, item) => {
        const product = await Book.findById(item.product);
           productData.push({
                name: product.title,
                quantity: item.quantity,
                price: product.offerPrice,
            })
        return (await acc) + product.offerPrice * item.quantity;
    },0);

    const order = await Order.create({
        userId, 
        items,
        address,
        amount, 
        paymentType : 'Stripe',
        isPaid: false,
    });

  
    const lineItems = productData.map(item => ({
        price_data: {
            currency: "usd",
            product_data: {
                name: item.name,
                images: [item.image]
            },
            unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url: `${process.env.CLIENT_URL}/checkout-success`,
        cancel_url: `${process.env.CLIENT_URL}/checkout-failure`,
        
        metadata: {
          orderId: order._id.toString(),
          userId: userId.toString()
        }
    }); 
  
      res.json({ url: session.url, success: true });
  
    } catch (error) {
      console.log("Stripe checkout error:", error);
      res.status(400).send({ success: false, message: "Error in Stripe Checkout", error: error.message });
    }
  }


  export const deleteFailedOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
      if (!orderId) {
        return res.status(400).json({ success: false, message: "Order ID required" });
      }
  
      const deletedOrder = await Order.findByIdAndDelete(orderId);
      if (!deletedOrder) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
  
      res.status(200).json({ success: true, message: "Failed order deleted" });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

 
export const stripeWebhookHandler = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    console.log(event.type);
    console.log(event.data.object);
    console.log(event.data.object.id);
    // Only respond to checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
  
      try {
        const orderId = session.metadata?.orderId;
        if (!orderId) return res.json({ received: true });
  
        // ✅ Update existing order to mark it as paid
        await Order.findByIdAndUpdate(orderId, {
          isPaid: true,
          paymentType: "Stripe",
        });
  
        console.log(`✅ Order ${orderId} marked as paid`);
      } catch (err) {
        console.error("Error updating order from webhook:", err);
      }
    }
  
    res.json({ received: true });
  };