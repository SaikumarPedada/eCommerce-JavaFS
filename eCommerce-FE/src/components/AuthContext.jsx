import { createContext, useContext, useEffect } from "react";
import axios from 'axios';
import { useState } from "react";

const AuthContext=createContext();

axios.defaults.baseURL='http://localhost:8080/';
axios.interceptors.request.use(
    (config)=>{
        const token=localStorage.getItem('token');
        if(token){
            config.headers.Authorization=`Bearer ${token}`;
        }
        return config;
    },(error)=>Promise.reject(error)
);

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null);

    useEffect(()=>{
        const token=localStorage.getItem('token');
        const user=JSON.parse(localStorage.getItem('user'));
        if(token&& user) setUser(user);
    },[]);

    const login=(token,userData)=>{
        localStorage.setItem('token',token);
        localStorage.setItem('user',JSON.stringify(userData));
        setUser(userData);
    };
    
    const logout=()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    }

    return(
        <AuthContext.Provider value={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth=()=> useContext(AuthContext);