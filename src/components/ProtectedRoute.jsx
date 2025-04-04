import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const navigate = useNavigate();
  const { isPending, user, isAuthenticated } = useUser();

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      navigate('/login');
    } else if (!isPending && isAuthenticated && allowedRoles.length > 0) {
      // Check if user has allowed role
      const userRole = user?.profile?.role;
      if (!userRole || !allowedRoles.includes(userRole)) {
        navigate('/unauthorized');
      }
    }
  }, [isPending, isAuthenticated, user, allowedRoles, navigate]);

  if (isPending) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <svg
          className='animate-spin h-10 w-10 text-indigo-600'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          ></circle>
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          ></path>
        </svg>
      </div>
    );
  }

  if (isAuthenticated) {
    if (
      allowedRoles.length === 0 ||
      allowedRoles.includes(user?.profile?.role)
    ) {
      return children;
    }
  }

  return null;
}

export default ProtectedRoute;
