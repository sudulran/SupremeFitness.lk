import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StoreAdminSidebar from '../components/StoreAdminSidebar';
import axiosInstance from '../api/axiosInstance';

// Material UI Components
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Skeleton,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';

import GroupIcon from '@mui/icons-material/Group';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import AddProductModal from './forms/AddProductModal';
import UpdateProductModal from './forms/UpdateProductModal';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

import Footer from '../components/Footer';


function StoreAdminDashboard() {
  const navigate = useNavigate();
  const sidebarWidth = 70;

  // Dashboard states
  const [userCount, setUserCount] = useState(null);
  const [productCount, setProductCount] = useState(null);
  const [productCategoryCount, setProductCategoryCount] = useState(null);
  const [sellsCount, setSellsCount] = useState(null);
  const [draftCount, setDraftCount] = useState(null);

  // Product management states
  const [products, setProducts] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState(null);

  // Filtering/sorting states
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const productManagementRef = useRef(null);

  const dashboardContentStyle = {
    padding: '20px',
    marginLeft: '240px',
    transition: 'margin-left 0.3s',
    backgroundColor: 'black',
    minHeight: '100vh',
    overflowX: 'auto',
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axiosInstance.get('/auth/get-user-count');
        setUserCount(response.data.userCount);
      } catch (error) {
        console.error('Failed to fetch user count:', error);
      }
    };

    const fetchProductCount = async () => {
      try {
        const response = await axiosInstance.get('/products/get-product-count');
        setProductCount(response.data.allProductCount);
      } catch (error) {
        console.error('Failed to fetch product count:', error);
      }
    };

    const fetchProductsCountByCategory = async () => {
      try {
        const response = await axiosInstance.get('/products/get-product-count-by-category');
        setProductCategoryCount(response.data.counts.length);
        setCategories(response.data.counts.map((c) => c.category));
      } catch (error) {
        console.error('Failed to fetch product count by category:', error);
      }
    };

    const fetchSellsCount = async () => {
      try {
        const response = await axiosInstance.get('/payment/get-sells-count');
        setSellsCount(response.data.sellsCount);
      } catch (error) {
        console.error('Failed to fetch sells count:', error);
      }
    };

    const fetchDraftCount = async () => {
      try {
        const response = await axiosInstance.get('/cart/get-draft-count');
        setDraftCount(response.data);
      } catch (error) {
        console.error('Failed to fetch draft count:', error);
      }
    };

    const fetchAllProducts = async () => {
      try {
        const response = await axiosInstance.get('/products/');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
        toast.error('Failed to fetch products.');
      }
    };

    fetchDraftCount();
    fetchSellsCount();
    fetchProductsCountByCategory();
    fetchUserCount();
    fetchProductCount();
    fetchAllProducts();
  }, []);

  // Product management handlers
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/products/delete/${id}`);
        setProducts((prev) => prev.filter((product) => product._id !== id));
        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting product:', error);
        Swal.fire('Error', 'Failed to delete product.', 'error');
      }
    }
  };

  const handleEdit = (product) => {
    setProductToUpdate(product);
    setOpenUpdateModal(true);
  };

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const handleProductAdded = () => {
    fetchAllProducts();
  };

  const handleProductUpdated = (updatedProduct, success) => {
    setOpenUpdateModal(false);
    setProductToUpdate(null);

    if (success) {
      toast.success('Product updated successfully!');
      fetchAllProducts();
    }
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setProductToUpdate(null);
  };

  const fetchAllProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Failed to fetch products.');
    }
  };

  const hasLowStock = products.some((product) => product.qty < product.restock_level);

  const scrollToProducts = () => {
    productManagementRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredProducts = products
    .filter((product) =>
      selectedCategory ? product.category === selectedCategory : true
    )
    .filter((product) =>
      searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price;
      if (sortOrder === 'desc') return b.price - a.price;
      return 0;
    });

  return (
    <>
    <div className="bootstrap-scope">
      <StoreAdminSidebar />
      <div style={dashboardContentStyle}>
        <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
          Store Admin Dashboard
        </Typography>

        {/* Top Metrics Section */}
        <div
          style={{
            marginTop: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px',
          }}
        >
          {[
            {
              title: 'Users',
              value: userCount,
              icon: <GroupIcon sx={{ fontSize: 48, color: 'white', mr: 3 }} />,
            },
            {
              title: 'Products',
              value: productCount,
              icon: <Inventory2Icon sx={{ fontSize: 48, color: 'white', mr: 3 }} />,
              scroll: true,
            },
            {
              title: 'Categories',
              value: productCategoryCount,
              icon: <CategoryIcon sx={{ fontSize: 48, color: 'white', mr: 3 }} />,
            },
            {
              title: 'Sales',
              value: sellsCount,
              icon: <MonetizationOnIcon sx={{ fontSize: 48, color: 'white', mr: 3 }} />,
            },
            {
              title: 'Draft Orders',
              value: draftCount,
              icon: <DescriptionIcon sx={{ fontSize: 48, color: 'white', mr: 3 }} />,
            },
          ].map((card, index) => (
            <Card
              key={index}
              onClick={card.scroll ? scrollToProducts : undefined}
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: 3,
                borderRadius: 3,
                cursor: card.scroll ? 'pointer' : 'default',
                boxShadow: '0 4px 12px rgba(255, 0, 0, 0.3)',
                background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 20px rgba(255, 0, 0, 0.5)',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              {card.icon}
              <CardContent sx={{ padding: 0 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: '500', mb: 0.5, color: 'white' }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: '700', color: 'white', letterSpacing: '0.05em' }}
                >
                  {card.value !== null ? (
                    card.value
                  ) : (
                    <Skeleton variant="text" width={40} height={30} sx={{ bgcolor: 'grey.700' }} />
                  )}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Product Management Section */}
        <div ref={productManagementRef}>
          <Typography variant="h5" gutterBottom sx={{ mt: 4, color: 'white' }}>
            Product Management
          </Typography>

          {hasLowStock && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              ⚠️ Some products are below their restock levels!
            </Alert>
          )}

          {/* Filters and Search */}
          <Paper
            elevation={3}
            sx={{
              display: 'flex',
              gap: 2,
              p: 2,
              mb: 2,
              flexWrap: 'wrap',
              borderRadius: 3,
              background: '#1e1e1e',
            }}
          >
            <TextField
              label="Search by name or category"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                background: 'white',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: '#d32f2f',
                    borderWidth: 2,
                  },
                  '&:hover fieldset': {
                    borderColor: '#d32f2f',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#d32f2f',
                },
              }}
            />

            <FormControl
              size="small"
              sx={{
                minWidth: 180,
                background: 'white',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d32f2f',
                    borderWidth: 2,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d32f2f',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#d32f2f',
                },
              }}
            >
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">All</MenuItem>
                {categories.map((cat, idx) => (
                  <MenuItem key={idx} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{
                minWidth: 180,
                background: 'white',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d32f2f',
                    borderWidth: 2,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d32f2f',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#d32f2f',
                },
              }}
            >
              <InputLabel>Sort by Price</InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                label="Sort by Price"
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="asc">Low to High</MenuItem>
                <MenuItem value="desc">High to Low</MenuItem>
              </Select>
            </FormControl>
          </Paper>

          {/* Add Product & Sales Summary Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <Button
              variant="contained"
              onClick={handleOpenAddModal}
              sx={{
                backgroundColor: '#d32f2f',
                '&:hover': { backgroundColor: '#b71c1c' },
              }}
            >
              Add Product
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate('/admin-sale-summary')}
              sx={{
                borderColor: '#d32f2f',
                color: 'white',
                '&:hover': { backgroundColor: '#b71c1c', borderColor: '#b71c1c' },
              }}
            >
              View Sales Summary
            </Button>
          </div>

          {/* Product Table */}
          <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table className="table table-striped table-bordered table-hover mt-3">
              <thead
                className="thead-dark"
                style={{
                  position: 'sticky',
                  top: 0,
                  background: '#212529',
                  color: 'white',
                  zIndex: 2,
                }}
              >
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price ($)</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Restock Level</th>
                  <th>Expiry Date</th>
                  <th>Purchase Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const isLowStock = product.qty < product.restock_level;
                    return (
                      <tr key={product._id} className={isLowStock ? 'table-danger' : ''}>
                        <td>
                          {product.img_src ? (
                            <img
                              src={product.img_src}
                              alt={product.name}
                              width="80"
                              height="100"
                              style={{ borderRadius: '8px', objectFit: 'cover' }}
                            />
                          ) : (
                            'No Image'
                          )}
                        </td>
                        <td>
                          {product.name}
                          {isLowStock && <span className="badge bg-danger ms-2">Low Stock</span>}
                        </td>
                        <td>{product.price != null ? product.price.toFixed(2) : 'N/A'}</td>
                        <td>{product.description}</td>
                        <td>{product.category}</td>
                        <td>{product.qty}</td>
                        <td>{product.restock_level ?? 'N/A'}</td>
                        <td>
                          {product.expiry_date
                            ? new Date(product.expiry_date).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td>
                          {product.date_of_purchase
                            ? new Date(product.date_of_purchase).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Tooltip title="Edit">
                              <IconButton color="primary" onClick={() => handleEdit(product)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton color="error" onClick={() => handleDelete(product._id)}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Product Modal */}
        <AddProductModal
          open={openAddModal}
          onClose={handleCloseAddModal}
          onProductAdded={handleProductAdded}
        />

        {/* Update Product Modal */}
        {productToUpdate && (
          <UpdateProductModal
            open={openUpdateModal}
            onClose={handleCloseUpdateModal}
            product={productToUpdate}
            onProductUpdated={handleProductUpdated}
          />
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
    <Footer />
    </>
  );
}

export default StoreAdminDashboard;
