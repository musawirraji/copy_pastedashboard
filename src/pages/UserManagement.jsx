import React from 'react';
import { useState } from 'react';
import { useUsers, useDeleteUser } from '../hooks/useUsers';
import EditUserForm from '../components/EditUserForm';
import { useUser } from '../hooks/useUser';
import SignupForm from '../components/SignupForm';

function UserManagement() {
  const { isPending, users } = useUsers();
  const { deleteExistingUser, isPending: isDeleting } = useDeleteUser();
  const { isAdmin, isAgency } = useUser();
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  console.log('These are the users', users);

  // Function to determine if the current user can edit a specific user
  function canEditUser(userToEdit) {
    if (isAdmin) return true;
    if (isAgency && userToEdit.role === 'user') return true;
    return false;
  }

  // Function to determine if the current user can delete a specific user
  function canDeleteUser(userToEdit) {
    // Same logic as edit for now, but can be customized
    return canEditUser(userToEdit);
  }

  function handleDelete(id) {
    if (
      window.confirm(
        'Are you sure you want to delete this user? This action cannot be undone.'
      )
    ) {
      deleteExistingUser(id);
    }
  }

  if (isPending) {
    return (
      <div className='flex justify-center my-10'>
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

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto'>
      <div className='sm:flex sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>User Management</h1>
          <p className='mt-2 text-sm text-gray-700'>
            Manage users and their access to the system
          </p>
        </div>
        <div className='mt-4 sm:mt-0'>
          <button
            type='button'
            onClick={() => setShowSignupForm(true)}
            className='inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          >
            Add User
          </button>
        </div>
      </div>

      {showSignupForm && (
        <div className='mt-6 p-6 bg-gray-50 rounded-lg shadow'>
          <h2 className='text-lg font-medium text-gray-900 mb-4'>
            Create New User
          </h2>
          <SignupForm
            onSuccess={() => setShowSignupForm(false)}
            onCancel={() => setShowSignupForm(false)}
          />
        </div>
      )}

      {editingUser && (
        <div className='mt-6 p-6 bg-gray-50 rounded-lg shadow'>
          <h2 className='text-lg font-medium text-gray-900 mb-4'>Edit User</h2>
          <EditUserForm
            user={editingUser}
            onCancel={() => setEditingUser(null)}
          />
        </div>
      )}

      <div className='mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg'>
        <table className='min-w-full divide-y divide-gray-300'>
          <thead className='bg-gray-50'>
            <tr>
              <th
                scope='col'
                className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'
              >
                Name
              </th>
              <th
                scope='col'
                className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
              >
                Email
              </th>
              <th
                scope='col'
                className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
              >
                Role
              </th>
              <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-6'>
                <span className='sr-only'>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className='hover:bg-gray-50'>
                  <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
                    {user.name}
                  </td>
                  <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                    {user.email}
                  </td>
                  <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 
                    ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'agency'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                    }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
                    <div className='flex justify-end space-x-3'>
                      {canEditUser(user) && (
                        <button
                          onClick={() => setEditingUser(user)}
                          className='text-indigo-600 hover:text-indigo-900'
                        >
                          Edit
                        </button>
                      )}
                      {canDeleteUser(user) && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={isDeleting}
                          className='text-red-600 hover:text-red-900'
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan='4'
                  className='py-4 text-center text-sm text-gray-500'
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;
