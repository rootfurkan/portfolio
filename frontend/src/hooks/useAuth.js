// useAuth — bileşenlerde kolayca auth bilgisine erişmek için
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  return { token, user, isAuthenticated, logout: handleLogout };
};

export default useAuth;