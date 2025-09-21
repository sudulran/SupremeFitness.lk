import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  Typography,
  IconButton,
  Divider,
  Button,
  Stack,
  Tooltip,
  DialogActions,
  DialogContentText,
  Box,
  Grid,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CartIcon from "@mui/icons-material/ShoppingBag";
import axiosInstance from "../../api/axiosInstance";
import PaymentModal from "./PaymentModal";

function CartModal({ open, handleClose, products }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [confirmClear, setConfirmClear] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [cartId, setCartId] = useState(null);
  const [checkoutTotal, setCheckoutTotal] = useState(0); // ✅ NEW STATE

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id;
  };

  const getCartKey = useCallback(() => {
    const userId = getUserId();
    return userId ? `cart_${userId}` : null;
  }, []);

  const saveCart = (items) => {
    const cartKey = getCartKey();
    if (!cartKey) return;
    const cartData = {
      items: items.map((i) => ({ product: i.productId, quantity: i.quantity })),
    };
    localStorage.setItem(cartKey, JSON.stringify(cartData));
  };

  useEffect(() => {
    if (!open) return;
    const cartKey = getCartKey();
    if (!cartKey) {
      setCartItems([]);
      setQuantities({});
      return;
    }
    const storedCart = JSON.parse(localStorage.getItem(cartKey));
    if (storedCart?.items) {
      const enrichedItems = storedCart.items.map((item) => {
        const product = products.find((p) => p._id === item.product);
        return {
          productId: item.product,
          name: product?.name || `Product ID: ${item.product}`,
          price: product?.price || 0,
          quantity: item.quantity,
          total: (product?.price || 0) * item.quantity,
          image: product?.image || null,
        };
      });
      setCartItems(enrichedItems);
      const initialQuantities = {};
      enrichedItems.forEach((i) => {
        initialQuantities[i.productId] = 1;
      });
      setQuantities(initialQuantities);
    } else {
      setCartItems([]);
      setQuantities({});
    }
  }, [open, products, getCartKey]);

  const updateCartItems = (newItems) => {
    setCartItems(newItems);
    saveCart(newItems);
  };

  const handleQtyChange = (productId, value) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed < 1) {
      setQuantities((prev) => ({ ...prev, [productId]: 1 }));
    } else if (parsed > item.quantity) {
      setQuantities((prev) => ({ ...prev, [productId]: item.quantity }));
    } else {
      setQuantities((prev) => ({ ...prev, [productId]: parsed }));
    }
  };

  const incrementQty = (productId) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.min(current + 1, item.quantity);
      return { ...prev, [productId]: next };
    });
  };

  const decrementQty = (productId) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(current - 1, 1);
      return { ...prev, [productId]: next };
    });
  };

  const handleRemoveQty = (productId) => {
    const amountToRemove = quantities[productId] || 1;
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;

    if (amountToRemove >= item.quantity) {
      const updated = cartItems.filter((i) => i.productId !== productId);
      updateCartItems(updated);
    } else {
      const updated = cartItems.map((i) =>
        i.productId === productId
          ? {
              ...i,
              quantity: i.quantity - amountToRemove,
              total: i.price * (i.quantity - amountToRemove),
            }
          : i
      );
      updateCartItems(updated);
    }
    setQuantities((prev) => ({ ...prev, [productId]: 1 }));
  };

  const handleRemoveItem = (productId) => {
    const updated = cartItems.filter((item) => item.productId !== productId);
    updateCartItems(updated);
    setQuantities((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const handleClearCart = () => {
    updateCartItems([]);
    setConfirmClear(false);
    setQuantities({});
  };

  const getTotal = () => cartItems.reduce((sum, item) => sum + item.total, 0);

  const handleCheckout = async () => {
    try {
      const userId = getUserId();
      if (!userId) return;
      const total = getTotal(); // ✅ Capture total before clearing
      const payload = {
        userId,
        items: cartItems.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
        })),
        value: total,
        status: "confirmed",
      };
      const response = await axiosInstance.post("/cart/add", payload);
      setCartId(response.data._id);
      setCheckoutTotal(total); // ✅ Save total to pass to modal
      setPaymentModalOpen(true);
      handleClearCart();
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  const handleConfirmPayment = () => {
    setPaymentModalOpen(false);
    handleClearCart();
    handleClose();
    navigate("/user-dashboard");
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <CartIcon />
              <Typography variant="h6">Your Cart</Typography>
            </Stack>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          {cartItems.length === 0 ? (
            <Box textAlign="center" py={6} color="text.secondary">
              <Typography variant="h6">Your cart is empty</Typography>
              <Typography variant="body2" mb={2}>
                Browse products and add them to your cart.
              </Typography>
              <Button variant="contained" onClick={handleClose}>
                Continue Shopping
              </Button>
            </Box>
          ) : (
            <List disablePadding>
              {cartItems.map((item) => (
                <React.Fragment key={item.productId}>
                  <ListItem>
                    <Grid container spacing={2}>
                      <Grid item xs={2}>
                        {item.image ? (
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{ width: 64, height: 64, borderRadius: 1 }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              bgcolor: "grey.300",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                            }}
                          >
                            No Image
                          </Box>
                        )}
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>{item.name}</Typography>
                        <Typography variant="body2">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Stack spacing={1}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <IconButton
                              size="small"
                              onClick={() => decrementQty(item.productId)}
                              disabled={(quantities[item.productId] || 1) <= 1}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <TextField
                              size="small"
                              value={quantities[item.productId] || 1}
                              onChange={(e) => handleQtyChange(item.productId, e.target.value)}
                              inputProps={{ style: { textAlign: "center", width: 40 } }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => incrementQty(item.productId)}
                              disabled={(quantities[item.productId] || 1) >= item.quantity}
                            >
                              <AddIcon />
                            </IconButton>
                          </Stack>
                          <Stack direction="row" justifyContent="flex-end" spacing={1}>
                            <Button
                              size="small"
                              onClick={() => handleRemoveQty(item.productId)}
                              variant="outlined"
                            >
                              Remove
                            </Button>
                            <Tooltip title="Remove Item">
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveItem(item.productId)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                          <Typography align="right">
                            Total: ${item.total.toFixed(2)}
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>

        {cartItems.length > 0 && (
          <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
            <Typography variant="h6">Total: ${getTotal().toFixed(2)}</Typography>
            {!confirmClear ? (
              <>
                <Button variant="outlined" color="error" onClick={() => setConfirmClear(true)}>
                  Clear Cart
                </Button>
                <Button variant="contained" onClick={handleCheckout}>
                  Checkout
                </Button>
              </>
            ) : (
              <>
                <DialogContentText>Clear entire cart?</DialogContentText>
                <Button variant="contained" color="error" onClick={handleClearCart}>
                  Yes
                </Button>
                <Button variant="outlined" onClick={() => setConfirmClear(false)}>
                  No
                </Button>
              </>
            )}
          </DialogActions>
        )}
      </Dialog>

      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        totalAmount={checkoutTotal} // ✅ Use captured total
        cartId={cartId}
        onPaymentSuccess={handleConfirmPayment}
      />
    </>
  );
}

export default CartModal;
