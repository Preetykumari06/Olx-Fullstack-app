const {ProductModel}=require("../Models/product.model");
require('dotenv').config()
const { Router } = require('express');
const productRouter = Router();
const {auth}=require("../Middleware/auth.middleware")

// add
productRouter.post("/add", async(req,res)=>{
    try {
        const product = new ProductModel(req.body);
        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
      } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Server error' });
      }
});

// get all

// - Filter by Category (Clothing, Electronics, Furniture, Other)
// - Sort by date (based on the posted date)
// - Search by product name
// - Pagination (4 Cards per page)

productRouter.get('/product', async (req, res) => {
    try {
        let query = {};
        // Filter by Category
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Search by product name
        if (req.query.search) {
            query.name = { $regex: new RegExp(req.query.search, 'i') };
        }

        const sortOptions = {};
        // Sort by date
        if (req.query.sort === 'date') {
            sortOptions.postedAt = -1; // Descending order
        }

        const page = req.query.page || 1;
        const limit = 4;
        const skip = (page - 1) * limit;

        const product = await ProductModel.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// update
productRouter.put("/product/:id", async(req,res)=>{
    try {
        await ProductModel.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// delete
productRouter.delete("/product/:id", async(req,res)=>{
    try {
        await ProductModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports={productRouter}