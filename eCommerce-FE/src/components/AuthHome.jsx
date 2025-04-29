import React from 'react';
import { Link } from 'react-router-dom';

const AuthHome = () => {
  return (
    <div className="auth-container d-flex align-items-center justify-content-center">
      <div className="container py-5">
        <div className="row justify-content-center g-4">
          <div className="col-md-5">
            <div className="card shadow rounded-4 text-center p-4 h-100">
              <div className="card-body d-flex flex-column">
                <i className="bi bi-box-arrow-in-right display-4 text-primary mb-3"></i>
                <h3 className="card-title">Login</h3>
                <p className="card-text flex-grow-1">Already have an account? Login here.</p>
                <Link to="/login" className="btn btn-primary w-100">
                  Go to Login
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-5">
            <div className="card shadow rounded-4 text-center p-4 h-100">
              <div className="card-body d-flex flex-column">
                <i className="bi bi-person-plus-fill display-4 text-success mb-3"></i>
                <h3 className="card-title">Register</h3>
                <p className="card-text flex-grow-1">New here? Create your account now.</p>
                <Link to="/register" className="btn btn-success w-100">
                  Go to Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthHome;
