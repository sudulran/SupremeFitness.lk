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
  IconButton,
  Chip,
  Badge,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Container,
  Skeleton,
  Rating,
  Tooltip,
  Fab,
  useMediaQuery,
  useTheme,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Divider,
  Autocomplete
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RecommendIcon from '@mui/icons-material/Recommend';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';

import Footer from '../components/Footer';

function UserDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const sidebarWidth = 240;
  
  const dashboardContentStyle = {
    marginLeft: !isMobile ? `${sidebarWidth}px` : '0',
    transition: 'margin-left 0.3s ease',
    minHeight: '100vh',
    backgroundColor: '#000000',
  };

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [favorites, setFavorites] = useState(new Set());
  const [cartItemCount, setCartItemCount] = useState(0);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    categories: [],
    keywords: [],
    priceRange: { min: 0, max: 1000 },
    brands: [],
    enableRecommendations: true
  });
  const [showRecommendations, setShowRecommendations] = useState(true);

  const availableKeywords = [
    'organic', 'premium', 'eco-friendly', 'wireless', 'smart', 'portable',
    'durable', 'lightweight', 'waterproof', 'vintage', 'modern', 'luxury',
    'budget-friendly', 'professional', 'gaming', 'fitness', 'outdoor',
    'indoor', 'kitchen', 'electronic', 'handmade', 'imported', 'local'
  ];

  useEffect(() => {
    fetchAllProducts();
    loadFavorites();
    loadUserPreferences();
    updateCartCount();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
    generateRecommendations();
  }, [products, searchTerm, categoryFilter, sortBy, userPreferences]);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/products/');
      const productsWithRatings = response.data.map(product => ({
        ...product,
        rating: Math.random() * 2 + 3,
        reviewCount: Math.floor(Math.random() * 100) + 10,
        description: product.description || `High-quality ${product.name.toLowerCase()} perfect for your needs. Features excellent build quality and great value for money.`,
      }));
      
      setProducts(productsWithRatings);

      const initialQuantities = {};
      productsWithRatings.forEach(product => {
        initialQuantities[product._id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  const loadUserPreferences = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.id) {
      const prefKey = `preferences_${user.id}`;
      const savedPreferences = JSON.parse(localStorage.getItem(prefKey));
      if (savedPreferences) {
        setUserPreferences(savedPreferences);
      }
    }
  };

  const saveUserPreferences = (preferences) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.id) {
      const prefKey = `preferences_${user.id}`;
      localStorage.setItem(prefKey, JSON.stringify(preferences));
      setUserPreferences(preferences);
      toast.success('Preferences saved successfully!');
    }
  };

  const calculateRelevanceScore = (product) => {
    let score = 0;
    const { categories, keywords, brands, priceRange } = userPreferences;

    if (categories.includes(product.category)) {
      score += 30;
    }

    if (brands.includes(product.brand)) {
      score += 20;
    }

    if (product.price >= priceRange.min && product.price <= priceRange.max) {
      score += 15;
    }

    const productText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    keywords.forEach(keyword => {
      if (productText.includes(keyword.toLowerCase())) {
        score += 10;
      }
    });

    if (favorites.has(product._id)) {
      score += 25;
    }

    return score;
  };

  const generateRecommendations = () => {
    if (!userPreferences.enableRecommendations) {
      setRecommendedProducts([]);
      return;
    }

    const scoredProducts = products.map(product => ({
      ...product,
      relevanceScore: calculateRelevanceScore(product)
    }));

    const recommended = scoredProducts
      .filter(product => product.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 8);

    setRecommendedProducts(recommended);
  };

  const filterAndSortProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'relevance':
          const scoreA = calculateRelevanceScore(a);
          const scoreB = calculateRelevanceScore(b);
          if (scoreA !== scoreB) return scoreB - scoreA;
          return a.name.localeCompare(b.name);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };

  const loadFavorites = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.id) {
      const favKey = `favorites_${user.id}`;
      const savedFavorites = JSON.parse(localStorage.getItem(favKey)) || [];
      setFavorites(new Set(savedFavorites));
    }
  };

  const updateCartCount = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.id) {
      const cartKey = `cart_${user.id}`;
      const cart = JSON.parse(localStorage.getItem(cartKey)) || { items: [] };
      const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemCount(totalItems);
    }
  };

  const handleQuantityChange = (productId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  const toggleFavorite = (productId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) {
      toast.error('Please log in to save favorites.');
      return;
    }

    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
      toast.info('Removed from favorites');
    } else {
      newFavorites.add(productId);
      toast.success('Added to favorites');
    }
    
    setFavorites(newFavorites);
    const favKey = `favorites_${user.id}`;
    localStorage.setItem(favKey, JSON.stringify([...newFavorites]));
  };

  const handleAddToCart = (product) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      toast.error('Please log in to add items to cart.');
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
    updateCartCount();
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(products.map(product => product.category))];
    return categories.filter(Boolean);
  };

  const getUniqueBrands = () => {
    const brands = [...new Set(products.map(product => product.brand))];
    return brands.filter(Boolean);
  };

  const LoadingSkeleton = () => (
    <Grid container spacing={1.5}>
      {[...Array(8)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card sx={{ 
            maxWidth: 260,
            margin: 'auto',
            backgroundColor: "#0a1929",
            border: "1px solid #1e3a5f"
          }}>
            <Skeleton variant="rectangular" height={160} sx={{ backgroundColor: "#1e3a5f" }} />
            <CardContent sx={{ p: 1.5 }}>
              <Skeleton variant="text" sx={{ fontSize: '1rem', backgroundColor: "#1e3a5f" }} />
              <Skeleton variant="text" sx={{ backgroundColor: "#1e3a5f" }} />
              <Skeleton variant="text" width="60%" sx={{ backgroundColor: "#1e3a5f" }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const ProductCard = ({ product, isRecommended = false }) => (
    <Card 
      sx={{ 
        maxWidth: 260, 
        margin: 'auto',
        transition: 'all 0.3s ease',
        backgroundColor: "#0a1929",
        border: isRecommended ? "1px solid #dc2626" : "1px solid #1e3a5f",
        borderRadius: "8px",
        boxShadow: isRecommended ? "0 0 15px rgba(220, 38, 38, 0.3)" : "none",
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: "0 6px 20px rgba(220, 38, 38, 0.3)",
          borderColor: "#dc2626"
        },
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {isRecommended && (
        <Chip
          icon={<RecommendIcon sx={{ fontSize: '14px' }} />}
          label="Recommended"
          size="small"
          sx={{ 
            position: 'absolute', 
            top: 6, 
            left: 6, 
            zIndex: 2,
            fontWeight: 'bold',
            backgroundColor: "#dc2626",
            color: 'white',
            border: "1px solid #ffffff",
            fontSize: '0.65rem',
            height: '20px'
          }}
        />
      )}
      
      <Chip
        icon={<InventoryIcon sx={{ fontSize: '14px' }} />}
        label={product.qty > 10 ? 'In Stock' : product.qty > 0 ? 'Low Stock' : 'Out of Stock'}
        size="small"
        sx={{ 
          position: 'absolute', 
          top: isRecommended ? 28 : 6, 
          right: 6, 
          zIndex: 1,
          fontWeight: 'bold',
          backgroundColor: product.qty > 10 ? "#22c55e" : product.qty > 0 ? "#f59e0b" : "#dc2626",
          color: product.qty > 10 ? "#000000" : "#ffffff",
          border: "1px solid #ffffff",
          fontSize: '0.65rem',
          height: '20px'
        }}
      />
      
      <IconButton
        onClick={() => toggleFavorite(product._id)}
        sx={{ 
          position: 'absolute', 
          top: 6, 
          left: isRecommended ? 95 : 6, 
          zIndex: 1,
          backgroundColor: 'rgba(0,0,0,0.8)',
          border: "1px solid #1e3a5f",
          width: '28px',
          height: '28px',
          '&:hover': { 
            backgroundColor: 'rgba(220, 38, 38, 0.9)',
            borderColor: "#dc2626"
          }
        }}
      >
        {favorites.has(product._id) ? 
          <FavoriteIcon sx={{ color: "#dc2626", fontSize: '16px' }} /> : 
          <FavoriteBorderIcon sx={{ color: "#ffffff", fontSize: '16px' }} />
        }
      </IconButton>

      <CardMedia
        component="img"
        height="160"
        image={product.img_src || 'https://placehold.co/250x200'}
        alt={product.name}
        sx={{
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'scale(1.05)' }
        }}
      />
      
      <CardContent sx={{ flexGrow: 1, pb: 0.5, px: 1.5 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            mb: 0.5,
            color: "#ffffff",
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            fontSize: '0.9rem',
            lineHeight: '1.2'
          }}
        >
          {product.name}
        </Typography>
        
        <Typography 
          variant="body2"
          sx={{ 
            mb: 1,
            color: "#9ca3af",
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            fontSize: '0.75rem'
          }}
        >
          {product.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating 
            value={product.rating} 
            precision={0.1} 
            readOnly 
            size="small"
            sx={{ 
              mr: 0.5,
              '& .MuiRating-iconFilled': {
                color: '#ffd700'
              },
              fontSize: '16px'
            }}
          />
          <Typography variant="body2" sx={{ color: "#9ca3af", fontSize: '0.75rem' }}>
            ({product.reviewCount})
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<CategoryIcon sx={{ color: "#ffffff !important", fontSize: '12px' }} />}
            label={product.category}
            size="small"
            sx={{
              backgroundColor: "#1e3a5f",
              color: "#ffffff",
              border: "1px solid #dc2626",
              fontWeight: 500,
              fontSize: '0.65rem',
              height: '20px'
            }}
          />
          <Chip
            icon={<BrandingWatermarkIcon sx={{ color: "#ffffff !important", fontSize: '12px' }} />}
            label={product.brand}
            size="small"
            sx={{
              backgroundColor: "#000000",
              color: "#ffffff",
              border: "1px solid #9ca3af",
              fontWeight: 500,
              fontSize: '0.65rem',
              height: '20px'
            }}
          />
        </Box>
        
        <Typography 
          variant="h5"
          sx={{ 
            fontWeight: 700, 
            mb: 0.5,
            color: "#dc2626",
            fontSize: "1.1rem"
          }}
        >
          ${product.price}
        </Typography>
        
        <Typography variant="body2" sx={{ color: "#9ca3af", fontSize: '0.75rem' }}>
          <strong style={{ color: "#ffffff" }}>Available:</strong> {product.qty} units
        </Typography>
      </CardContent>
      
      <CardActions sx={{ 
        justifyContent: 'space-between', 
        padding: '6px 12px 12px',
        borderTop: '1px solid #1e3a5f'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton 
            onClick={() => handleQuantityChange(product._id, -1)}
            size="small"
            disabled={quantities[product._id] <= 1}
            sx={{
              border: "1px solid #1e3a5f",
              color: "#ffffff",
              backgroundColor: "#0a1929",
              width: '24px',
              height: '24px',
              "&:hover": {
                borderColor: "#dc2626",
                backgroundColor: "rgba(220, 38, 38, 0.1)"
              },
              "&:disabled": {
                borderColor: "#1e3a5f",
                color: "#4b5563",
                opacity: 0.5
              }
            }}
          >
            <RemoveIcon sx={{ fontSize: '12px' }} />
          </IconButton>
          <Typography 
            component="span" 
            sx={{ 
              minWidth: '16px', 
              textAlign: 'center',
              fontWeight: 600,
              color: "#ffffff",
              fontSize: '0.8rem'
            }}
          >
            {quantities[product._id] || 1}
          </Typography>
          <IconButton 
            onClick={() => handleQuantityChange(product._id, 1)}
            size="small"
            sx={{
              border: "1px solid #1e3a5f",
              color: "#ffffff",
              backgroundColor: "#0a1929",
              width: '24px',
              height: '24px',
              "&:hover": {
                borderColor: "#dc2626",
                backgroundColor: "rgba(220, 38, 38, 0.1)"
              }
            }}
          >
            <AddIcon sx={{ fontSize: '12px' }} />
          </IconButton>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<ShoppingCartIcon sx={{ fontSize: '16px' }} />}
          onClick={() => handleAddToCart(product)}
          disabled={product.qty === 0}
          sx={{
            borderRadius: '16px',
            textTransform: 'none',
            fontWeight: 600,
            backgroundColor: "#dc2626",
            color: "#ffffff",
            boxShadow: "0 2px 8px rgba(220, 38, 38, 0.3)",
            fontSize: '0.7rem',
            px: 1,
            minWidth: '100px',
            height: '32px',
            "&:hover": {
              backgroundColor: "#b91c1c",
              boxShadow: "0 4px 12px rgba(220, 38, 38, 0.4)"
            },
            "&:disabled": {
              backgroundColor: "#4b5563",
              color: "#9ca3af"
            }
          }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );

  // ADDED MISSING PreferencesDialog COMPONENT
  const PreferencesDialog = () => (
    <Dialog 
      open={preferencesOpen} 
      onClose={() => setPreferencesOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#000000",
          border: "1px solid #dc2626",
          borderRadius: "8px",
          maxWidth: '500px'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        backgroundColor: "#0a1929",
        color: "#ffffff",
        borderBottom: "1px solid #dc2626",
        p: 2,
        fontSize: '1.1rem'
      }}>
        <PersonIcon sx={{ color: "#dc2626", fontSize: '20px' }} />
        Your Shopping Preferences
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: "#000000", pt: 2, pb: 1 }}>
        <Box sx={{ mt: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={userPreferences.enableRecommendations}
                onChange={(e) => setUserPreferences(prev => ({
                  ...prev,
                  enableRecommendations: e.target.checked
                }))}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#dc2626',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#dc2626',
                  }
                }}
              />
            }
            label="Enable personalized recommendations"
            sx={{ mb: 2, color: "#ffffff", fontSize: '0.875rem' }}
          />

          <Divider sx={{ my: 1.5, backgroundColor: "#1e3a5f", height: "1px" }} />

          <Typography variant="h6" gutterBottom sx={{ color: "#ffffff", fontSize: '0.95rem', mb: 1 }}>
            Preferred Categories
          </Typography>
          <Autocomplete
            multiple
            options={getUniqueCategories()}
            value={userPreferences.categories}
            onChange={(event, newValue) => {
              setUserPreferences(prev => ({
                ...prev,
                categories: newValue
              }));
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip 
                  variant="outlined" 
                  label={option} 
                  {...getTagProps({ index })}
                  sx={{
                    backgroundColor: "#1e3a5f",
                    color: "#ffffff",
                    border: "1px solid #dc2626",
                    fontSize: '0.75rem'
                  }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Select categories you're interested in"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0a1929",
                    color: "#ffffff",
                    "& fieldset": {
                      borderColor: "#1e3a5f"
                    },
                    "&:hover fieldset": {
                      borderColor: "#dc2626"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#dc2626"
                    }
                  },
                  "& input": {
                    color: "#ffffff",
                    fontSize: '0.875rem'
                  },
                  "& input::placeholder": {
                    color: "#9ca3af",
                    opacity: 1
                  }
                }}
              />
            )}
            sx={{ mb: 2 }}
          />

          <Typography variant="h6" gutterBottom sx={{ color: "#ffffff", fontSize: '0.95rem', mb: 1 }}>
            Preferred Brands
          </Typography>
          <Autocomplete
            multiple
            options={getUniqueBrands()}
            value={userPreferences.brands}
            onChange={(event, newValue) => {
              setUserPreferences(prev => ({
                ...prev,
                brands: newValue
              }));
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip 
                  variant="outlined" 
                  label={option} 
                  {...getTagProps({ index })}
                  sx={{
                    backgroundColor: "#1e3a5f",
                    color: "#ffffff",
                    border: "1px solid #dc2626",
                    fontSize: '0.75rem'
                  }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Select preferred brands"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0a1929",
                    color: "#ffffff",
                    "& fieldset": {
                      borderColor: "#1e3a5f"
                    },
                    "&:hover fieldset": {
                      borderColor: "#dc2626"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#dc2626"
                    }
                  },
                  "& input": {
                    color: "#ffffff",
                    fontSize: '0.875rem'
                  },
                  "& input::placeholder": {
                    color: "#9ca3af",
                    opacity: 1
                  }
                }}
              />
            )}
            sx={{ mb: 2 }}
          />

          <Typography variant="h6" gutterBottom sx={{ color: "#ffffff", fontSize: '0.95rem', mb: 1 }}>
            Interest Keywords
          </Typography>
          <Autocomplete
            multiple
            freeSolo
            options={availableKeywords}
            value={userPreferences.keywords}
            onChange={(event, newValue) => {
              setUserPreferences(prev => ({
                ...prev,
                keywords: newValue
              }));
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip 
                  variant="outlined" 
                  label={option} 
                  {...getTagProps({ index })}
                  sx={{
                    backgroundColor: "#1e3a5f",
                    color: "#ffffff",
                    border: "1px solid #dc2626",
                    fontSize: '0.75rem'
                  }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Add keywords that interest you"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0a1929",
                    color: "#ffffff",
                    "& fieldset": {
                      borderColor: "#1e3a5f"
                    },
                    "&:hover fieldset": {
                      borderColor: "#dc2626"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#dc2626"
                    }
                  },
                  "& input": {
                    color: "#ffffff",
                    fontSize: '0.875rem'
                  },
                  "& input::placeholder": {
                    color: "#9ca3af",
                    opacity: 1
                  }
                }}
              />
            )}
            sx={{ mb: 2 }}
          />

          <Typography variant="h6" gutterBottom sx={{ color: "#ffffff", fontSize: '0.95rem', mb: 1 }}>
            Price Range
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
            <TextField
              label="Min Price"
              type="number"
              value={userPreferences.priceRange.min}
              onChange={(e) => setUserPreferences(prev => ({
                ...prev,
                priceRange: { ...prev.priceRange, min: Number(e.target.value) }
              }))}
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start" sx={{ color: "#9ca3af" }}>$</InputAdornment>,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#0a1929",
                  color: "#ffffff",
                  "& fieldset": {
                    borderColor: "#1e3a5f"
                  },
                  "&:hover fieldset": {
                    borderColor: "#dc2626"
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#dc2626"
                  }
                },
                "& .MuiInputLabel-root": {
                  color: "#9ca3af",
                  fontSize: '0.875rem'
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#dc2626"
                },
                "& input": {
                  color: "#ffffff",
                  fontSize: '0.875rem'
                }
              }}
            />
            <TextField
              label="Max Price"
              type="number"
              value={userPreferences.priceRange.max}
              onChange={(e) => setUserPreferences(prev => ({
                ...prev,
                priceRange: { ...prev.priceRange, max: Number(e.target.value) }
              }))}
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start" sx={{ color: "#9ca3af" }}>$</InputAdornment>,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#0a1929",
                  color: "#ffffff",
                  "& fieldset": {
                    borderColor: "#1e3a5f"
                  },
                  "&:hover fieldset": {
                    borderColor: "#dc2626"
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#dc2626"
                  }
                },
                "& .MuiInputLabel-root": {
                  color: "#9ca3af",
                  fontSize: '0.875rem'
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#dc2626"
                },
                "& input": {
                  color: "#ffffff",
                  fontSize: '0.875rem'
                }
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{
        backgroundColor: "#0a1929",
        borderTop: "1px solid #1e3a5f",
        p: 1.5
      }}>
        <Button 
          onClick={() => setPreferencesOpen(false)}
          size="small"
          sx={{
            color: "#ffffff",
            borderColor: "#9ca3af",
            fontSize: '0.875rem',
            "&:hover": {
              borderColor: "#ffffff",
              backgroundColor: "rgba(255, 255, 255, 0.1)"
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={() => {
            saveUserPreferences(userPreferences);
            setPreferencesOpen(false);
          }}
          variant="contained"
          size="small"
          sx={{
            backgroundColor: "#dc2626",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: '0.875rem',
            "&:hover": {
              backgroundColor: "#b91c1c"
            }
          }}
        >
          Save Preferences
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
    <div className="bootstrap-scope">
      <Box sx={{ 
        margin: '0px', 
        backgroundColor: "#000000", 
        minHeight: "100vh",
      }}>
        <Container maxWidth="lg" sx={{ 
          py: 2, 
          backgroundColor: "#000000", 
          maxWidth: '1100px',
          margin: '0 auto'
        }}>
          {/* Header Section */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              mb: 2, 
              background: "linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)",
              color: 'white',
              borderRadius: 2,
              border: "1px solid #dc2626",
              boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
              maxWidth: '100%'
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' } }}>
              Our Products
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '0.9rem' }}>
              Discover amazing products tailored to your preferences
            </Typography>
          </Paper>

          {/* Controls Section */}
          <Paper sx={{ 
            p: 1.5, 
            mb: 2, 
            borderRadius: 1,
            backgroundColor: "#0a1929",
            border: "1px solid #1e3a5f",
            maxWidth: '100%'
          }}>
            <Grid container spacing={1.5} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  placeholder="Search products..."
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#9ca3af", fontSize: '18px' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#000000",
                      color: "#ffffff",
                      borderRadius: "6px",
                      "& fieldset": {
                        borderColor: "#1e3a5f"
                      },
                      "&:hover fieldset": {
                        borderColor: "#dc2626"
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#dc2626",
                        boxShadow: "0 0 0 2px rgba(220, 38, 38, 0.1)"
                      },
                      "& input": {
                        color: "#ffffff",
                        fontSize: '0.875rem'
                      },
                      "& input::placeholder": {
                        color: "#9ca3af",
                        opacity: 1
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: "#9ca3af", "&.Mui-focused": { color: "#dc2626" }, fontSize: '0.875rem' }}>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Category"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    sx={{
                      backgroundColor: "#000000",
                      color: "#ffffff",
                      borderRadius: "6px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1e3a5f"
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#dc2626"
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#dc2626"
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#ffffff"
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: "#0a1929",
                          border: "1px solid #1e3a5f",
                          "& .MuiMenuItem-root": {
                            color: "#ffffff",
                            fontSize: '0.875rem',
                            "&:hover": {
                              backgroundColor: "#1e3a5f"
                            },
                            "&.Mui-selected": {
                              backgroundColor: "#dc2626",
                              "&:hover": {
                                backgroundColor: "#b91c1c"
                              }
                            }
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {getUniqueCategories().map(category => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: "#9ca3af", "&.Mui-focused": { color: "#dc2626" }, fontSize: '0.875rem' }}>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{
                      backgroundColor: "#000000",
                      color: "#ffffff",
                      borderRadius: "6px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1e3a5f"
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#dc2626"
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#dc2626"
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#ffffff"
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: "#0a1929",
                          border: "1px solid #1e3a5f",
                          "& .MuiMenuItem-root": {
                            color: "#ffffff",
                            fontSize: '0.875rem',
                            "&:hover": {
                              backgroundColor: "#1e3a5f"
                            },
                            "&.Mui-selected": {
                              backgroundColor: "#dc2626",
                              "&:hover": {
                                backgroundColor: "#b91c1c"
                              }
                            }
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="relevance">Relevance</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                    <MenuItem value="rating">Rating</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<SettingsIcon sx={{ fontSize: '18px' }} />}
                  onClick={() => setPreferencesOpen(true)}
                  size="small"
                  sx={{ 
                    height: '40px',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '6px',
                    color: "#ffffff",
                    borderColor: "#9ca3af",
                    fontSize: '0.875rem',
                    "&:hover": {
                      borderColor: "#dc2626",
                      backgroundColor: "rgba(220, 38, 38, 0.1)"
                    }
                  }}
                >
                  Preferences
                </Button>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setCartOpen(true)}
                  size="small"
                  sx={{ 
                    height: '40px',
                    background: '#dc2626',
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: '6px',
                    textTransform: 'none',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)',
                    fontSize: '0.875rem',
                    '&:hover': {
                      background: '#b91c1c',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.5)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  startIcon={
                    <Badge 
                      badgeContent={cartItemCount} 
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: '#000000',
                          color: '#ffffff',
                          fontWeight: 'bold',
                          fontSize: '0.7rem',
                          minWidth: '18px',
                          height: '18px',
                          border: "1px solid #dc2626"
                        }
                      }}
                    >
                      <ShoppingCartIcon sx={{ fontSize: '18px' }} />
                    </Badge>
                  }
                >
                  My Cart
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Recommendations Section */}
          {userPreferences.enableRecommendations && recommendedProducts.length > 0 && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TrendingUpIcon sx={{ color: "#dc2626", fontSize: '20px' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#ffffff", fontSize: '1.1rem' }}>
                    Recommended for You
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showRecommendations}
                      onChange={(e) => setShowRecommendations(e.target.checked)}
                      size="small"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#dc2626',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#dc2626',
                        }
                      }}
                    />
                  }
                  label="Show"
                  sx={{ color: "#ffffff", '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                />
              </Box>

              {showRecommendations && (
                <Box sx={{ mb: 3 }}>
                  <Grid container spacing={1.5}>
                    {recommendedProducts.slice(0, 4).map(product => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={`rec-${product._id}`}>
                        <ProductCard product={product} isRecommended={true} />
                      </Grid>
                    ))}
                  </Grid>
                  <Divider sx={{ mt: 2, mb: 1.5, backgroundColor: "#1e3a5f", height: "1px" }} />
                </Box>
              )}
            </>
          )}

          {/* Products Section */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1.5, color: "#ffffff", fontSize: '1.1rem' }}>
            {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
          </Typography>

          {loading ? (
            <LoadingSkeleton />
          ) : filteredProducts.length === 0 ? (
            <Paper sx={{ 
              p: 3, 
              textAlign: 'center',
              backgroundColor: "#0a1929",
              border: "1px solid #1e3a5f",
              borderRadius: "8px",
              maxWidth: '400px',
              mx: 'auto'
            }}>
              <Typography variant="body1" sx={{ color: "#9ca3af", mb: 1.5, fontSize: '0.9rem' }}>
                No products found matching your criteria
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                }}
                size="small"
                sx={{ 
                  color: "#ffffff",
                  borderColor: "#dc2626",
                  fontSize: '0.875rem',
                  "&:hover": {
                    borderColor: "#b91c1c",
                    backgroundColor: "rgba(220, 38, 38, 0.1)"
                  }
                }}
              >
                Clear Filters
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={1.5}>
              {filteredProducts.map(product => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>

        {/* Floating buttons */}
        {!isMobile && (
          <>
            <Fab
              sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 1000,
                width: 52,
                height: 52,
                background: '#dc2626',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.5)',
                border: "1px solid #ffffff",
                '&:hover': {
                  background: '#b91c1c',
                  boxShadow: '0 6px 16px rgba(220, 38, 38, 0.6)',
                  transform: 'translateY(-2px) scale(1.05)'
                },
                transition: 'all 0.3s ease'
              }}
              onClick={() => setCartOpen(true)}
            >
              <Badge 
                badgeContent={cartItemCount}
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                    minWidth: '18px',
                    height: '18px',
                    border: '1px solid #dc2626'
                  }
                }}
              >
                <ShoppingCartIcon sx={{ fontSize: 22, color: "#ffffff" }} />
              </Badge>
            </Fab>

            <Fab
              sx={{
                position: 'fixed',
                bottom: 16,
                right: 76,
                zIndex: 1000,
                width: 44,
                height: 44,
                background: '#1e3a5f',
                boxShadow: '0 4px 8px rgba(30, 58, 95, 0.5)',
                border: "1px solid #ffffff",
                '&:hover': {
                  background: '#dc2626',
                  boxShadow: '0 6px 12px rgba(220, 38, 38, 0.5)',
                  transform: 'translateY(-2px) scale(1.05)'
                },
                transition: 'all 0.3s ease'
              }}
              onClick={() => setPreferencesOpen(true)}
            >
              <SettingsIcon sx={{ fontSize: 20, color: 'white' }} />
            </Fab>
          </>
        )}
      </Box>

      {/* NOW PreferencesDialog IS DEFINED AND CAN BE USED */}
      <PreferencesDialog />

      <CartModal
        open={cartOpen}
        handleClose={() => {
          setCartOpen(false);
          updateCartCount();
        }}
        products={products.map(p => ({ ...p, image: p.img_src }))}
      />
      
      <ToastContainer 
        position="bottom-right"
        theme="dark"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          backgroundColor: "#0a1929",
          color: "#ffffff",
          border: "1px solid #dc2626"
        }}
      />
    </div>
    <Footer />
    </>
  );
}

export default UserDashboard;