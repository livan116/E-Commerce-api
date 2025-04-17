const Cart = require("../models/cart.model");

const getCart =  async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.userId });
      if (!cart) {
        return res.json({
          items: [],
          summary: {
            totalItems: 0,
            totalQuantity: 0,
            subtotal: 0,
            discount: 0,
            total: 0,
          },
        });
      }
      res.json(cart);
    } catch (err) {
      res.status(500).json({ error: "Error fetching cart" });
    }
  }

  const addToCart = async (req, res) => {
    try {
      const {
        productId,
        title,
        price,
        originalPrice,
        images,
        category,
        quantity,
      } = req.body;
  
      // Validate quantity
      if (quantity < 1) {
        return res.status(400).json({ error: "Quantity must be at least 1" });
      }
  
      let cart = await Cart.findOne({ userId: req.userId });
  
      if (!cart) {
        cart = new Cart({
          userId: req.userId,
          items: [
            {
              productId,
              title,
              price,
              originalPrice,
              images,
              category,
              quantity,
            },
          ],
        });
      } else {
        const existingItem = cart.items.find(
          (item) => item.productId === productId
        );
  
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({
            productId,
            title,
            price,
            originalPrice,
            images,
            category,
            quantity,
          });
        }
      }
  
      await cart.save();
      res.json(cart);
    } catch (err) {
      res.status(500).json({ error: "Error adding item to cart" });
    }
  }

  const updateQuantity = async (req, res) => {
    try {
      const { quantity } = req.body;
      const { productId } = req.params;
  
      if (quantity < 1) {
        return res.status(400).json({ error: "Quantity must be at least 1" });
      }
  
      const cart = await Cart.findOne({ userId: req.userId });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
  
      const item = cart.items.find((item) => item.productId === productId);
      if (!item) {
        return res.status(404).json({ error: "Item not found in cart" });
      }
  
      item.quantity = quantity;
      await cart.save();
      res.json(cart);
    } catch (err) {
      res.status(500).json({ error: "Error updating cart item" });
    }
  }

  const removeItem = async (req, res) => {
    try {
      const { productId } = req.params;
  
      const cart = await Cart.findOne({ userId: req.userId });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
  
      cart.items = cart.items.filter((item) => item.productId !== productId);
      await cart.save();
      res.json(cart);
    } catch (err) {
      res.status(500).json({ error: "Error removing item from cart" });
    }
  }

module.exports = {
    getCart,
    addToCart,
    updateQuantity,
    removeItem
}

