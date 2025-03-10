import React, { useEffect } from 'react'
import "./styles.css"
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';

function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) return;
    if (user) navigate('/dashboard');
  }, [user, loading])

  const logoutFnc = () => {
    try {
      signOut(auth).then(() => {
        navigate('/')
        toast.success('Logged out successfully')
      }).catch((error) => {
        toast.error(error.message)
      });
      
    } catch (error) {
      toast.error(error.message)
    }
    
  }
  return (
    <div className="navbar">
      <p className='navbar-heading'>BudgetWise</p>
      {user && (
        <div className="navbar-right">
          {user.photoURL && (
            <img src={user.photoURL} alt="User" className="navbar-avatar" />
          )}
          <p className='navbar-link' onClick={logoutFnc}>Logout</p>
        </div>
      )}
    </div>
);

}

export default Header