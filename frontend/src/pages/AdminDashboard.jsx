import React, { useEffect, useState } from 'react';
import StoreAdminSidebar from '../components/StoreAdminSidebar';
import axiosInstant from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

// Material UI Components
import { Card, CardContent, Typography } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DescriptionIcon from '@mui/icons-material/Description';


function AdminDashboard() {
  const sidebarWidth = 100;
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(null);
  const [productCount, setProductCount] = useState(null);
  const [productCategoryCount, setProductCategoryCount] = useState(null);
  const [sellsCount, setSellsCount] = useState(null);
  const [draftCount, setDraftCount] = useState(null);

  const dashboardContentStyle = {
    padding: '20px',
    marginLeft: window.innerWidth >= 768 ? `${sidebarWidth}px` : '0',
    transition: 'margin-left 0.3s',
  };

  useEffect(() => {

    // Get User Count
    const fetchUserCount = async () => {
      try {
        const response = await axiosInstant.get('/auth/get-user-count');
        setUserCount(response.data.userCount);
      } catch (error) {
        console.error('Failed to fetch user count:', error);
      }
    };

    // Get Product Count
    const fetchProductCount = async () => {
        try {
            const response = await axiosInstant.get('/products/get-product-count')
            setProductCount(response.data.allProductCount);
            
        } catch (error) {
            console.error('Failed to fetch user count:', error);
        }
    }

    // Get Products By Categories
    const fetchProductsCountByCategory = async () => {
        try {
            const response = await axiosInstant.get('/products/get-product-count-by-category')
            setProductCategoryCount(response.data.counts.length)
        } catch (error) {
            console.error('Failed to fetch product count by catergory:', error);
        }
    }

    // Get Sells Count
    const fetchSellsCount = async () => {
        try {
            const response = await axiosInstant.get('/payment/get-sells-count')
            setSellsCount(response.data.sellsCount);
        } catch (error) {
            console.error('Failed to fetch sells count', error);
        }
    }

    // Get Draft Count
    const fetchDraftCount = async () => {
        try {
            const response = await axiosInstant.get('/cart/get-draft-count')
            setDraftCount(response.data);
        } catch (error) {
            console.error('Failed to fetch draft count', error);
        }
    }

    fetchDraftCount();
    fetchSellsCount();
    fetchProductsCountByCategory();
    fetchUserCount();
    fetchProductCount();
  }, []);

  return (
    <div class="bootstrap-scope">
      <StoreAdminSidebar />
      <div style={dashboardContentStyle}>
        <Typography variant="h4" gutterBottom>
          Store Admin Dashboard
        </Typography>

        <div
            style={{
                marginTop: '2rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',  // space between cards
                justifyContent: 'space-between',
            }}
        >
            {/* User Count Card */}
            <Card
            sx={{
                width: 250,
                display: 'flex',
                alignItems: 'center',
                padding: 3,
                mb: 3,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                cursor: 'default',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                boxShadow: '0 8px 20px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-4px)',
                },
            }}
            >
            <GroupIcon sx={{ fontSize: 48, color: '#1976d2', mr: 3 }} />
            <CardContent sx={{ padding: 0 }}>
                <Typography
                variant="subtitle1"
                color="textSecondary"
                sx={{ fontWeight: '500', mb: 0.5 }}
                >
                Users
                </Typography>
                <Typography
                variant="h4"
                sx={{ fontWeight: '700', color: '#0d47a1', letterSpacing: '0.05em' }}
                >
                {userCount !== null ? userCount : 'Loading...'}
                </Typography>
            </CardContent>
            </Card>

            {/* Product Count Card */}
            <Card
            sx={{
                width: 250,
                display: 'flex',
                alignItems: 'center',
                padding: 3,
                mb: 3,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                cursor: 'default',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                boxShadow: '0 8px 20px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-4px)',
                },
            }}
            >
            <Inventory2Icon sx={{ fontSize: 48, color: '#1976d2', mr: 3 }} />
            <CardContent sx={{ padding: 0 }}>
                <Typography
                variant="subtitle1"
                color="textSecondary"
                sx={{ fontWeight: '500', mb: 0.5 }}
                >
                Products
                </Typography>
                <Typography
                variant="h4"
                sx={{ fontWeight: '700', color: '#0d47a1', letterSpacing: '0.05em' }}
                >
                {productCount !== null ? productCount : 'Loading...'}
                </Typography>
            </CardContent>
            </Card>

            {/* Category Count Card */}
            <Card
            sx={{
                width: 250,
                display: 'flex',
                alignItems: 'center',
                padding: 3,
                mb: 3,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                cursor: 'default',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                boxShadow: '0 8px 20px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-4px)',
                },
            }}
            >
            <CategoryIcon sx={{ fontSize: 48, color: '#1976d2', mr: 3 }} />
            <CardContent sx={{ padding: 0 }}>
                <Typography
                variant="subtitle1"
                color="textSecondary"
                sx={{ fontWeight: '500', mb: 0.5 }}
                >
                Categories
                </Typography>
                <Typography
                variant="h4"
                sx={{ fontWeight: '700', color: '#0d47a1', letterSpacing: '0.05em' }}
                >
                {userCount !== null ? productCategoryCount : 'Loading...'}
                </Typography>
            </CardContent>
            </Card>

            {/* Sells Count Card */}
            <Card
            sx={{
                width: 250,
                display: 'flex',
                alignItems: 'center',
                padding: 3,
                mb: 3,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                cursor: 'default',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                boxShadow: '0 8px 20px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-4px)',
                },
            }}
            >
            <MonetizationOnIcon sx={{ fontSize: 48, color: '#1976d2', mr: 3 }} />
            <CardContent sx={{ padding: 0 }}>
                <Typography
                variant="subtitle1"
                color="textSecondary"
                sx={{ fontWeight: '500', mb: 0.5 }}
                >
                Sales
                </Typography>
                <Typography
                variant="h4"
                sx={{ fontWeight: '700', color: '#0d47a1', letterSpacing: '0.05em' }}
                >
                {sellsCount !== null ? sellsCount : 'Loading...'}
                </Typography>
            </CardContent>
            </Card>

            {/* Draft Count Card */}
            <Card
            sx={{
                width: 250,
                display: 'flex',
                alignItems: 'center',
                padding: 3,
                mb: 3,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                cursor: 'default',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                boxShadow: '0 8px 20px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-4px)',
                },
            }}
            >
            <DescriptionIcon sx={{ fontSize: 48, color: '#1976d2', mr: 3 }} />
            <CardContent sx={{ padding: 0 }}>
                <Typography
                variant="subtitle1"
                color="textSecondary"
                sx={{ fontWeight: '500', mb: 0.5 }}
                >
                Draft Orders
                </Typography>
                <Typography
                variant="h4"
                sx={{ fontWeight: '700', color: '#0d47a1', letterSpacing: '0.05em' }}
                >
                {draftCount !== null ? draftCount : 'Loading...'}
                </Typography>
            </CardContent>
          </Card>
          
        </div>

        <div
          style={{
            marginTop: '40px',
            borderRadius: '24px',
            padding: '32px',
            background: 'linear-gradient(135deg, rgba(2,6,23,0.95) 0%, rgba(15,23,42,0.92) 45%, rgba(239,68,68,0.35) 100%)',
            boxShadow: '0 24px 48px rgba(15, 23, 42, 0.35)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            color: '#f8fafc',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#f8fafc' }}>
            Programme Management
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(241,245,249,0.7)', mb: 4 }}>
            Launch the planners below to create structured workout and meal programmes for members.
          </Typography>

          <div
            style={{
              display: 'grid',
              gap: '24px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            }}
          >
            <ProgrammeCard
              title="Workout Plans"
              subtitle="Assign tailored training programmes"
              description="Build personalised routines with curated exercises, intensity and progression guidance."
              cta="Launch builder"
              onClick={() => navigate('/admin/workout-plans/create')}
            />
            <ProgrammeCard
              title="Meal Plans"
              subtitle="Design personalised nutrition"
              description="Combine macro targets, dietary preferences and curated foods into downloadable guides."
              cta="Open planner"
              onClick={() => navigate('/admin/meal-plans/create')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const ProgrammeCard = ({ title, subtitle, description, cta, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      border: 'none',
      borderRadius: '20px',
      padding: '28px',
      textAlign: 'left',
      background: 'rgba(15,23,42,0.85)',
      color: '#f8fafc',
      cursor: 'pointer',
      boxShadow: '0 16px 30px rgba(15,23,42,0.4)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    }}
    onMouseEnter={(event) => {
      event.currentTarget.style.transform = 'translateY(-6px) scale(1.01)';
      event.currentTarget.style.boxShadow = '0 20px 40px rgba(239,68,68,0.35)';
    }}
    onMouseLeave={(event) => {
      event.currentTarget.style.transform = 'translateY(0) scale(1)';
      event.currentTarget.style.boxShadow = '0 16px 30px rgba(15,23,42,0.4)';
    }}
  >
    <div
      style={{
        fontSize: '14px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#f87171',
        fontWeight: 600,
      }}
    >
      {title}
    </div>
    <div style={{ fontSize: '22px', fontWeight: 700, margin: '12px 0 14px' }}>{subtitle}</div>
    <p style={{ fontSize: '14px', color: 'rgba(226,232,240,0.7)' }}>{description}</p>
    <div
      style={{
        marginTop: '24px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '14px',
        fontWeight: 600,
        color: '#fca5a5',
      }}
    >
      <span>{cta}</span>
      <span aria-hidden>&rarr;</span>
    </div>
  </button>
);

export default AdminDashboard;
