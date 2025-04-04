import React, { useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

// Icons

// Components
import UserManagement from '../pages/UserManagement';
import AgencyManagement from '../pages/AgencyManagement';
import SignupForm from './SignupForm';
import UpdatePasswordForm from './UpdatePasswordForm';
import { useLogout } from '../hooks/useLogout';

function Dashboard() {
  const { user, isAdmin, isAgency } = useUser();
  const { logout } = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  console.log(user);

  // Helper to check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col md:flex-row'>
      {/* Mobile menu button */}
      <div className='md:hidden bg-white shadow-sm p-4 flex items-center justify-between'>
        <span className='text-xl font-semibold text-indigo-600'>
          CopyPasteConvert
        </span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className='text-gray-500 hover:text-gray-700 focus:outline-none'
        >
          {sidebarOpen ? (
            <span className='h-6 w-6'>✕</span>
          ) : (
            <span className='h-6 w-6'>☰</span>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block md:w-64 bg-white shadow-lg md:h-screen`}
      >
        <div className='h-full flex flex-col'>
          {/* Logo */}
          <div className='hidden md:flex items-center justify-center h-16 border-b border-gray-200'>
            <span className='text-xl font-semibold text-indigo-600'>
              CopyPasteConvert
            </span>
          </div>

          {/* User Info */}
          <div className='px-4 py-5 border-b border-gray-200'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold'>
                  {user?.profile?.first_name?.[0] || user?.email?.[0] || 'U'}
                </div>
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-gray-700'>
                  {user?.profile?.first_name} {user?.profile?.last_name}
                </p>
                <p className='text-xs text-gray-500'>{user?.email}</p>
                <p className='text-xs font-medium text-indigo-600 mt-1'>
                  {user?.profile?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className='flex-1 px-2 py-4 space-y-1'>
            <Link
              to='/dashboard'
              onClick={() => setSidebarOpen(false)}
              className={`${
                isActive('/dashboard')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
            >
              Dashboard
            </Link>

            {(isAdmin || isAgency) && (
              <>
                <Link
                  to='/dashboard/users'
                  onClick={() => setSidebarOpen(false)}
                  className={`${
                    isActive('/dashboard/users')
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  Users
                </Link>

                <Link
                  to='/dashboard/signup'
                  onClick={() => setSidebarOpen(false)}
                  className={`${
                    isActive('/dashboard/signup')
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  Add User
                </Link>
              </>
            )}

            <Link
              to='/dashboard/password'
              onClick={() => setSidebarOpen(false)}
              className={`${
                isActive('/dashboard/password')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
            >
              Update Password
            </Link>
          </nav>

          {/* Logout Button */}
          <div className='border-t border-gray-200 p-4'>
            <button
              onClick={logout}
              className='w-full flex items-center px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50'
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        <main className='flex-1 overflow-y-auto p-4 md:p-6'>
          <Routes>
            {/* Dashboard Home */}
            <Route
              path='/'
              element={
                <div className='max-w-7xl mx-auto'>
                  <div className='bg-white shadow rounded-lg p-6'>
                    <div className='pb-5 border-b border-gray-200 mb-6'>
                      <h1 className='text-2xl font-bold text-gray-900'>
                        Dashboard
                      </h1>
                    </div>

                    <div className='border-b border-gray-200 pb-5'>
                      <h2 className='text-lg font-medium text-gray-900'>
                        Welcome, {user?.profile?.role.toUpperCase() || ''}
                      </h2>
                      <p className='mt-2 text-sm text-gray-700'>
                        You are logged in as {user?.email} with role:{' '}
                        <span className='font-medium'>
                          {user?.profile?.role}
                        </span>
                        {user?.profile?.agencies?.name &&
                          ` in agency: ${user?.profile?.agencies?.name}`}
                      </p>
                    </div>

                    <div className='mt-6'>
                      <h3 className='text-lg font-medium text-gray-900'>
                        Quick Actions
                      </h3>
                      <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                        <div className='bg-indigo-50 rounded-lg p-4'>
                          <h4 className='text-base font-medium text-indigo-800'>
                            Update Password
                          </h4>
                          <p className='mt-1 text-sm text-indigo-700'>
                            Change your account password for security
                          </p>
                          <div className='mt-4'>
                            <Link
                              to='/dashboard/password'
                              className='text-sm font-medium text-indigo-600 hover:text-indigo-500'
                            >
                              Update Password{' '}
                              <span aria-hidden='true'>&rarr;</span>
                            </Link>
                          </div>
                        </div>

                        {(isAdmin || isAgency) && (
                          <>
                            <div className='bg-purple-50 rounded-lg p-4'>
                              <h4 className='text-base font-medium text-purple-800'>
                                Manage Users
                              </h4>
                              <p className='mt-1 text-sm text-purple-700'>
                                Add, edit, or remove users from the system
                              </p>
                              <div className='mt-4'>
                                <Link
                                  to='/dashboard/users'
                                  className='text-sm font-medium text-purple-600 hover:text-purple-500'
                                >
                                  View Users{' '}
                                  <span aria-hidden='true'>&rarr;</span>
                                </Link>
                              </div>
                            </div>

                            <div className='bg-blue-50 rounded-lg p-4'>
                              <h4 className='text-base font-medium text-blue-800'>
                                Add New User
                              </h4>
                              <p className='mt-1 text-sm text-blue-700'>
                                Create a new user account in the system
                              </p>
                              <div className='mt-4'>
                                <Link
                                  to='/dashboard/signup'
                                  className='text-sm font-medium text-blue-600 hover:text-blue-500'
                                >
                                  Add User{' '}
                                  <span aria-hidden='true'>&rarr;</span>
                                </Link>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            {/* User Management - accessible by admins and agency admins */}
            <Route
              path='/users'
              element={
                isAdmin || isAgency ? (
                  <UserManagement />
                ) : (
                  <Navigate to='/dashboard' />
                )
              }
            />

            {/* Add User Form - accessible by admins and agency admins */}
            <Route
              path='/signup'
              element={
                isAdmin || isAgency ? (
                  <div className='max-w-3xl mx-auto'>
                    <div className='bg-white shadow rounded-lg p-6'>
                      <div className='pb-5 border-b border-gray-200 mb-6'>
                        <h1 className='text-xl font-bold text-gray-900'>
                          Create New User
                        </h1>
                      </div>
                      <SignupForm standalone={true} />
                    </div>
                  </div>
                ) : (
                  <Navigate to='/dashboard' />
                )
              }
            />

            {/* Password Update */}
            <Route
              path='/password'
              element={
                <div className='max-w-3xl mx-auto'>
                  <div className='bg-white shadow rounded-lg p-6'>
                    <div className='pb-5 border-b border-gray-200 mb-6'>
                      <h1 className='text-xl font-bold text-gray-900'>
                        Update Password
                      </h1>
                    </div>
                    <UpdatePasswordForm />
                  </div>
                </div>
              }
            />

            {/* Fallback */}
            <Route path='*' element={<Navigate to='/dashboard' />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
