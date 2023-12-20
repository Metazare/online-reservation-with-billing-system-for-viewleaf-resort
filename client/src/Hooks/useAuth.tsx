import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, Outlet, Navigate } from 'react-router-dom';
import axios from './useAxios';

interface AuthContextState {
  user: any;
  login: (data: LoginData) => void;
  logout: () => void;
  register: (data: RegisterData) => void;
  isAuth: (id: any) => boolean;
  User: () => any;
}

interface RegisterData {
  username: string;
  email: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const AuthContext = createContext<AuthContextState>({
  user: null,
  login: () => { },
  logout: () => { },
  register: () => { },
  isAuth: () => false,
  User: () => { }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null);

  const login = async (data: LoginData) => {
    const { email, password } = data;
    try {
      await axios
        .post(`/staffs/login`, {
          "email": email,
          "password": password
        })
        .then((response: any) => {
          console.log(response.data)
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data))
          navigate("/admin")
        });
    }
    catch (error: any) {
      console.log(error);
      // alert(error.message);
    }
  };

  const register = async (data: RegisterData) => {
    const { username, email } = data;

    try {
      await axios
        .post(`/staffs/register`, {
          username: username,
          email: email,
        })
        .then((response: any) => {
          console.log(response)
          setUser(response.data.user);
        });
    }
    catch (error: any) {
      console.log(error);
      // alert(error.message);
    }
  };

  const logout = async () => {
    await axios.post(`/staffs/logout`)
    localStorage.clear();
    navigate("/login");
  };

  const isAuth = (id: any) => {
    if (!user) {
      // User is not logged in, so they are not authorized
      return false;
    }

    // User is logged in and authorized
    return true;
  };

  const User = () => {
    return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '') : '';
  }

  useEffect(() => {
    // Check if user is already logged in on first mount
    // const loggedInUser = localStorage.getItem("user");
    // if (loggedInUser) {
    //     setUser(JSON.parse(loggedInUser));
    // }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, User, isAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {

  // * Gets locally stored user
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '') : '';

  return (
    // Checks if user exists
    user
      // Checks if allowed roles are defined
      ? allowedRoles
        // Checks if user type is part of allowed roles
        ? allowedRoles?.includes(user.role)
          ? <Outlet />
          // Redirects to forbidden if user is not allowed
          : <Navigate to="/" />
        : <Outlet />
      // Redirects to login if not logged in
      : <Navigate to="/" />
  );
};