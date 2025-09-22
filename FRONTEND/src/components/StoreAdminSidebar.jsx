import React, { useState } from 'react';
import '../styles/StoreSidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h2>Store Panel</h2>
        <a href="/admin-dashboard">Summary</a>
        <a href="/admin-product-management">Products</a>
        <a href="#sales">Sales</a>
        <a href="/admin-trainer-management">Trainers</a>
      </div>
    </>
  );
};

export default Sidebar;
