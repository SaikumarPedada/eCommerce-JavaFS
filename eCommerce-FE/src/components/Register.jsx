import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Register = () => {
  
  const[username,setUserName]=useState('');
  const[password,setPassword]=useState('');
  const [role,setRole]=useState('CUSTOMER');
  const navigate=useNavigate();
  
  const handleSubmit= async (e)=>{
    e.preventDefault();
    try{
      await axios.post('http://localhost:8080/api/auth/register',{
        username,password,role
      });
      alert('Registration successful! Please login..')
      navigate('/login');
    }catch(err){
      alert(err.response?.data?.message || 'failed to Register!! Try Again')
    }
  };

  return (
    <div className="auth-container d-flex justify-content-center align-items-center">
      <div className="card shadow p-4" style={{ maxWidth: '500px', width: '100%', borderRadius: '1rem' }}>
        <div className="text-center mb-4">
          <i className="bi bi-person-plus" style={{ fontSize: '2rem', color: '#0d6efd' }}></i>
          <h3 className="mt-2 fw-bold">Register</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">User Name</label>
                <input className="form-control" value={username} onChange={e => setUserName(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
                  <option value="CUSTOMER">Customer</option>
                  <option value="MERCHANT">Merchant</option>
                </select>
              </div>
              <button type="submit" className="btn btn-success w-100">Register</button>
            </form>
          </div>
        </div>
      </div>

    
  );
};

export default Register;
