import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect, useState } from 'react';
import { Navbar, Nav, Button, Offcanvas, ListGroup } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

const AppNavbar = ({ onMerchantAddProduct, selectedCategory, setSelectedCategory }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
    document.body.style.backgroundColor = darkMode ? '#212529' : '#f8f9fa';
    document.body.style.color = darkMode ? '#f8f9fa' : '#212529';
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCategorySelect = (selected) => {
    setShowFilter(false);
    setSelectedCategory(selected);
    navigate('/customer');
  };
  return (
    <>
      <Navbar bg={darkMode ? 'dark' : 'light'} variant={darkMode ? 'dark' : 'light'} expand="lg" className="px-4 rounded-bottom shadow-sm mb-3">
        <Navbar.Brand as={Link} to="/">
          <i className="bi bi-shop me-2"></i> MyShop
        </Navbar.Brand>

        <Nav className="ms-auto align-items-center gap-3">
          {user?.role === 'CUSTOMER' && (
            <>
              <Button variant="outline-primary" size="sm" onClick={() => setShowFilter(true)}>
                <i className="bi bi-filter"></i> Filters
              </Button>

              <Link className="nav-link" to="/customer">Customer</Link>

              <Button variant="outline-success" size="sm" onClick={() => navigate('/cart')}>
                <i className="bi bi-cart"></i>
              </Button>

              <Link className="nav-link d-flex align-items-center gap-1" to="/orders">
                <i className="bi bi-receipt-cutoff"></i> My Orders
              </Link>
            </>
          )}

          {user?.role === 'MERCHANT' && (
            <>
              <Link className="nav-link" to="/merchant">Merchant</Link>
              {onMerchantAddProduct && (
                <Button variant="success" size="sm" onClick={onMerchantAddProduct}>
                  <i className="bi bi-plus-lg"></i> Add Product
                </Button>
              )}
            </>
          )}

          {user && (
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>Logout</Button>
          )}

          <Button variant="outline-secondary" size="sm" onClick={() => setDarkMode(!darkMode)} title="Toggle Theme">
            <i className={`bi ${darkMode ? 'bi-brightness-high' : 'bi-moon'}`}></i>
          </Button>
        </Nav>
      </Navbar>
      <Offcanvas show={showFilter} onHide={() => setShowFilter(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter by Category</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup>
            <ListGroup.Item action active={!selectedCategory} onClick={() => handleCategorySelect('')}>All</ListGroup.Item>
            <ListGroup.Item action active={selectedCategory === 'Electronics'} onClick={() => handleCategorySelect('Electronics')}>Electronics</ListGroup.Item>
            <ListGroup.Item action active={selectedCategory === 'Fashion'} onClick={() => handleCategorySelect('Fashion')}>Fashion</ListGroup.Item>
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default AppNavbar;
