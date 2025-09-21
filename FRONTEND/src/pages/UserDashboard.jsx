import React, { useEffect, useState } from 'react';
import UserStoreDashboard from '../components/StoreUserSidebar';
import axiosInstance from '../api/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartModal from './forms/CartModal';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ViewListIcon from '@mui/icons-material/ViewList';

function UserDashboard() {
  const sidebarWidth = 200;
  const dashboardContentStyle = {
    padding: '20px',
    marginLeft: window.innerWidth >= 768 ? `${sidebarWidth}px` : '0',
    transition: 'margin-left 0.3s',
  };

  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/');
      setProducts(response.data);

      const initialQuantities = {};
      response.data.forEach(product => {
        initialQuantities[product._id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products.');
    }
  };

  const handleQuantityChange = (productId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  const handleAddToCart = (product) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      toast.error('User not logged in.');
      return;
    }

    const quantityToAdd = quantities[product._id] || 1;
    const cartKey = `cart_${userId}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey)) || {
      user: userId,
      status: 'draft',
      items: [],
      value: 0
    };

    const itemIndex = existingCart.items.findIndex(item => item.product === product._id);
    const existingQuantityInCart = itemIndex > -1 ? existingCart.items[itemIndex].quantity : 0;
    const totalRequestedQuantity = existingQuantityInCart + quantityToAdd;

    if (totalRequestedQuantity > product.qty) {
      toast.error(`Only ${product.qty} "${product.name}" available. You already have ${existingQuantityInCart} in cart.`);
      return;
    }

    if (itemIndex > -1) {
      existingCart.items[itemIndex].quantity += quantityToAdd;
    } else {
      existingCart.items.push({
        product: product._id,
        quantity: quantityToAdd
      });
    }

    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    toast.success(`Added ${quantityToAdd} of "${product.name}" to cart.`);
  };


  return (
    <div class="bootstrap-scope">
      <UserStoreDashboard />
      <div style={dashboardContentStyle}>
        <Typography variant="h4" gutterBottom>
          All Products
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ViewListIcon />}
          onClick={() => setCartOpen(true)}
          disabled={products.length === 0}
          sx={{ mb: 2 }}
        >
          My Cart
        </Button>
        <Grid container spacing={3}>
          {products.map(product => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Card sx={{ maxWidth: 280, margin: 'auto' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.img_src || 'https://placehold.co/250x160'}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Category:</strong> {product.category}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Price:</strong> ${product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Available:</strong> {product.qty}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', padding: '0 16px 16px' }}>
                  <div>
                    <IconButton onClick={() => handleQuantityChange(product._id, -1)}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography component="span" sx={{ mx: 1 }}>
                      {quantities[product._id] || 1}
                    </Typography>
                    <IconButton onClick={() => handleQuantityChange(product._id, 1)}>
                      <AddIcon />
                    </IconButton>
                  </div>
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>

      {/* 👇 Image mapping fix: pass `image` field to CartModal */}
      <CartModal
        open={cartOpen}
        handleClose={() => setCartOpen(false)}
        products={products.map(p => ({ ...p, image: p.img_src }))}
      />
      <ToastContainer />
    </div>
  );
}

export default UserDashboard;
