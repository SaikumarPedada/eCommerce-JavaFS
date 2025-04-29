import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [imageMap, setImageMap] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get('/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const data = Array.isArray(res.data) ? res.data : [];
      setOrders(data);

      data.forEach(order => {
        if (order && Array.isArray(order.orderItems)) {
          order.orderItems.forEach(item => {
            if (item && item.productId !== undefined) {
              fetchImage(item.productId);
            }
          });
        }
      });
    })
    .catch(err => console.error('Failed to fetch orders:', err));
  }, []);

  const fetchImage = async (productId) => {
    try {
      const res = await axios.get(`/api/products/${productId}/image`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'arraybuffer'
      });
      const base64 = btoa(
        new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      setImageMap(prev => ({ ...prev, [productId]: `data:image/jpeg;base64,${base64}` }));
    } catch (err) {
      console.error(`Error loading image for product ${productId}`, err);
      setImageMap(prev => ({ ...prev, [productId]: '/default-image.jpg' }));
    }
  };

  return (
    <Container className="mt-3">
      <h3>My Orders</h3>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="mb-4">
            
            <h5>Order :{order.id} — {new Date(order.orderDate).toLocaleString()}</h5>
            <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
            <p><strong>Payment Mode:</strong> {order.paymentMode}</p>
            {order.orderItems && order.orderItems.map(item => (
              <p><strong>Quantity Ordered: </strong>{item.quantity}<br />
              <strong>Total Amount Payable: </strong>{item.price * item.quantity}</p>
            ))}
            <Row>
              {order.orderItems && order.orderItems.map(item => (
                <Col md={4} key={item.productId} className="mb-3">
                  <Card>
                    {imageMap[item.productId] ? (
                      <Card.Img
                        variant="top"
                        src={imageMap[item.productId]}
                        height="200"
                        style={{ objectFit: 'cover', backgroundColor: '#f8f8f8' }}
                      />
                    ) : (
                      <div style={{ height: 200, backgroundColor: "#eee" }}>Image not available</div>
                    )}
                    <Card.Body>
                      <Card.Title>{item.productName}</Card.Title>
                      <Card.Text>
                        Price: ₹{item.price}<br />
                        Description: {item.description}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          
          </div>
        ))
      )}
    </Container>
  );
};

export default MyOrders;
