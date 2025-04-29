import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setProduct(res.data))
    .catch(err => console.error("Error fetching product:", err));

    axios.get(`/api/products/${id}/image`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "arraybuffer"
    })
    .then(res => {
      const base64 = btoa(
        new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );
      setImageSrc(`data:image/png;base64,${base64}`);
    })
    .catch(err => console.error("Image fetch error:", err));
  }, [id, token]);

  if (!product) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading product...</p>
      </Container>
    );
  }
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
  
    try {
      await axios.delete(`/api/merchant/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Product deleted successfully.");
      navigate("/merchant"); // go back to merchant home
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete the product.");
    }
  };
  
  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-lg">
        <Row>
          <Col md={6}>
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={product.name}
                className="img-fluid rounded"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            ) : (
              <div style={{ height: 400, backgroundColor: "#eee" }}>Loading image...</div>
            )}
          </Col>
          <Col md={6}>
            <h2>{product.name}</h2>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Price:</strong> ₹{product.price}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
            <p><strong>Description:</strong> {product.description || "No description available."}</p>
            {/* Optional merchant name */}
            {/* <p><strong>Merchant:</strong> {product.merchantName}</p> */}

            <div className="mt-4">
              {role === "CUSTOMER" && (
                <>
                  <Button variant="primary" className="me-2">Add to Cart</Button>
                  <Button variant="success">Buy Now</Button>
                </>
              )}
              {role === "MERCHANT" && (
                <>
                  <Button variant="warning" className="me-2" onClick={() => navigate(`/edit/${product.id}`)}>
                    Edit Product
                  </Button>
                  <Button variant="danger" onClick={handleDelete}>
                    Delete Product
                  </Button>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default ProductDetail;
