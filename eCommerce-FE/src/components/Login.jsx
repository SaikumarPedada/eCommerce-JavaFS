import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useState } from "react";
import axios from "axios";

const Login=()=>{
  const [username, setUserName]=useState('');
  const [password, setPassword]=useState('');
  const navigate=useNavigate();
  const {login}=useAuth();
  
  const handleSubmit= async(e)=>{
    e.preventDefault();
    try{
      const response=await axios.post('http://localhost:8080/api/auth/login',{
        username,password
      });

      const { token, role } = response.data;
      const userData = { username, role };
      localStorage.setItem("role", role); 

      login(token, userData);
      navigate(role==='CUSTOMER'?'/customer':'/merchant');
    }catch(err){
      console.log(err);
      alert(err.response?.data?.message||'failed to Login!! Please Try Again');
    }
  };
  
  return (
    <div className="auth-container d-flex justify-content-center align-items-center">
      <div className="card shadow p-4" style={{ maxWidth: '500px', width: '100%', borderRadius: '1rem' }}>
        <div className="text-center mb-4">
          <i className="bi bi-box-arrow-in-right" style={{ fontSize: '2rem', color: '#0d6efd' }}></i>
          <h3 className="mt-2 fw-bold">Login</h3>
          <p className="text-muted mb-0">Welcome back! Login to continue</p>
        
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">UserName</label>
                <input className="form-control" value={username} onChange={e => setUserName(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
          </div>
        </div>
      </div>
   
  );
}

export default Login;