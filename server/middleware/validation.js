const validateProduct = (req, res, next) => {
  const { name, description, price, category, stock } = req.body;

  // Validate required fields
  if (!name || !description || !price || !category || !stock) {
    return res.status(400).json({
      message: 'All fields are required: name, description, price, category, and stock'
    });
  }

  // Validate price
  const numericPrice = parseFloat(price);
  if (isNaN(numericPrice) || numericPrice < 0) {
    return res.status(400).json({
      message: 'Price must be a positive number'
    });
  }

  // Validate stock
  const numericStock = parseInt(stock);
  if (isNaN(numericStock) || numericStock < 0) {
    return res.status(400).json({
      message: 'Stock must be a positive integer'
    });
  }

  // Convert price and stock to numbers
  req.body.price = numericPrice;
  req.body.stock = numericStock;

  next();
};

module.exports = {
  validateProduct
}; 