import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, LogIn, UserPlus, Building2, Plus, CreditCard } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { signOut } from '../lib/firebase/auth';

const Navbar = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">RealtyHub</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/properties" className="text-gray-600 hover:text-indigo-600">
              Properties
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">
                  Dashboard
                </Link>
                <Link to="/subscription" className="text-gray-600 hover:text-indigo-600">
                  <CreditCard className="h-4 w-4 inline mr-1" />
                  Subscription
                </Link>
                <Link 
                  to="/create-listing" 
                  className="flex items-center space-x-1 text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Property</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/signin" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
                <Link 
                  to="/signup" 
                  className="flex items-center space-x-1 text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;