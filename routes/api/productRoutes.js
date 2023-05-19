const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');

// Create a new product
router.post('/', async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = new Product({ name, price, description });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description },
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
