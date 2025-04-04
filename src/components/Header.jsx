import React from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useUser } from '../hooks/useUser';

function Header() {
  const { logout, isPending } = useLogout();
  const { user, isAdmin, isAgency } = useUser();

  return (
    <header className='bg-white shadow'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <div className='flex-shrink-0 flex items-center'>
              <Link
                to='/dashboard'
                className='text-xl font-bold text-indigo-600'
              >
                CopyPasteConvert
              </Link>
            </div>
            <nav className='ml-6 flex space-x-8'>
              <Link
                to='/dashboard'
                className='inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300'
              >
                Dashboard
              </Link>

              {(isAdmin || isAgency) && (
                <>
                  <Link
                    to='/users'
                    className='inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  >
                    Users
                  </Link>

                  {isAdmin && (
                    <Link
                      to='/agencies'
                      className='inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    >
                      Agencies
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>

          <div className='flex items-center'>
            <span className='mr-4 text-sm text-gray-500'>
              {user?.email}
              {user?.profile?.role && ` (${user.profile.role})`}
            </span>

            <button
              onClick={logout}
              disabled={isPending}
              className='ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              {isPending ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
