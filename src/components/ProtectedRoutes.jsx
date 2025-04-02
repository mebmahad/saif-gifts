import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PrivateRoute({ children }) {
  const history = useHistory();
  const { user } = useAuth();
  if (!user) {
    history.push('/login');
  }
  return children;
}

export function PublicRoute({ children }) {
  const history = useHistory();
  const { user } = useAuth();
  if (user) {
    history.push('/');
    return null;
  }
  return children;
}

export function AdminRoute({ children }) {
  const history = useHistory();
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    history.push('/');
    return null;
  }
  return children;
}