import Address from "../models/AddressModel.js";

export const addAddress = async (req,res) => {
    try {
        const {address} = req.body;
        const {id} = req.user;
        console.log(id,address)
        const savedAddress = await Address.create({
            ...address,
            userId: id
        });

        res.status(201).json({
            success: true,
            savedAddress,
            message: "Address added successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const getAddress = async (req,res) => {
    try {
        const {id}= req.user;
        console.log("user", id);
        const addresses = await Address.find({});
        // const addresses = await Address.find({});
        res.status(201).json({
            success: true,
            addresses
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}