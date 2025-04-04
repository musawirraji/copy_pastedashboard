import React, { useState } from 'react';
import { useUsers, useDeleteUser } from '../hooks/useUsers';
import { useUser } from '../hooks/useUser';
import CreateUserForm from './CreateUserForm';
import EditUserForm from './EditUserForm';
import {
  HiOutlineDotsVertical,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';

function UsersTable() {
  const { isPending, users } = useUsers();
  const { deleteExistingUser, isPending: isDeleting } = useDeleteUser();
  const { user, isAdmin, isAgency } = useUser();
  const [editingUser, setEditingUser] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  // Function to determine if the current user can edit a specific user
  function canEditUser(userToEdit) {
    if (isAdmin) return true;
    if (
      isAgency &&
      userToEdit.role === 'user' &&
      userToEdit.agency_id === user?.profile?.agency_id
    )
      return true;
    return false;
  }

  // Function to determine if the current user can delete a specific user
  function canDeleteUser(userToEdit) {
    if (isAdmin) return true;
    if (
      isAgency &&
      userToEdit.role === 'user' &&
      userToEdit.agency_id === user?.profile?.agency_id
    )
      return true;
    return false;
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

  // Toggle menu for mobile
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Filter users based on selected filter and search term
  const filteredUsers = users?.filter((user) => {
    // Role filter
    if (selectedFilter !== 'all' && user.role !== selectedFilter) {
      return false;
    }

    // Search filter
    if (searchTerm.trim() !== '') {
      const searchTermLower = searchTerm.toLowerCase();
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const email = user.email.toLowerCase();

      return (
        fullName.includes(searchTermLower) ||
        email.includes(searchTermLower) ||
        (user.agencies?.name &&
          user.agencies.name.toLowerCase().includes(searchTermLower))
      );
    }

    return true;
  });

  if (isPending) {
    return (
      <div className='flex justify-center my-10'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600'></div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='pb-5 border-b border-gray-200 mb-6'>
        <h1 className='text-xl font-bold text-gray-900'>User Management</h1>
        <p className='mt-1 text-sm text-gray-500'>
          Manage and monitor users in the system
        </p>
      </div>

      {editingUser && (
        <div className='mb-6 bg-white shadow overflow-hidden rounded-lg'>
          <div className='px-4 py-5 sm:px-6 bg-gray-50'>
            <h2 className='text-lg font-medium text-gray-900'>Edit User</h2>
          </div>
          <div className='px-4 py-5 sm:p-6'>
            <EditUserForm
              user={editingUser}
              onCancel={() => setEditingUser(null)}
            />
          </div>
        </div>
      )}

      {/* Filters and search */}
      <div className='mb-6 bg-white shadow overflow-hidden rounded-lg'>
        <div className='px-4 py-5 sm:p-6'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label
                htmlFor='role-filter'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Filter by Role
              </label>
              <select
                id='role-filter'
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              >
                <option value='all'>All Roles</option>
                <option value='admin'>Admin</option>
                <option value='agency'>Agency Admin</option>
                <option value='user'>User</option>
              </select>
            </div>
            <div>
              <label
                htmlFor='search'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Search
              </label>
              <input
                type='text'
                id='search'
                placeholder='Search by name, email, or agency...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Users count */}
      <div className='mb-4 text-sm text-gray-600'>
        Showing {filteredUsers?.length || 0} of {users?.length || 0} users
      </div>

      {/* Table */}
      <div className='bg-white shadow overflow-hidden rounded-lg'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Name
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell'
                >
                  Email
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Role
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell'
                >
                  Agency
                </th>
                <th scope='col' className='relative px-6 py-3'>
                  <span className='sr-only'>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((userData) => (
                  <tr key={userData.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center'>
                          <span className='text-indigo-700 font-medium'>
                            {userData.first_name?.[0] ||
                              userData.email?.[0] ||
                              'U'}
                          </span>
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {userData.first_name} {userData.last_name}
                          </div>
                          <div className='text-sm text-gray-500 md:hidden'>
                            {userData.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell'>
                      {userData.email}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          userData.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : userData.role === 'agency'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {userData.role}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell'>
                      {userData.agencies?.name || 'N/A'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      {/* Desktop view actions */}
                      <div className='hidden sm:flex justify-end space-x-2'>
                        {canEditUser(userData) && (
                          <button
                            onClick={() => setEditingUser(userData)}
                            className='text-indigo-600 hover:text-indigo-900'
                          >
                            Edit
                          </button>
                        )}
                        {canDeleteUser(userData) && (
                          <button
                            onClick={() => handleDelete(userData.id)}
                            disabled={isDeleting}
                            className='text-red-600 hover:text-red-900'
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      {/* Mobile view dropdown */}
                      <div className='sm:hidden relative'>
                        <button
                          onClick={() => toggleMenu(userData.id)}
                          className='text-gray-500 hover:text-gray-700'
                          aria-expanded={openMenuId === userData.id}
                        >
                          <HiOutlineDotsVertical className='h-5 w-5' />
                        </button>

                        {openMenuId === userData.id && (
                          <div className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10'>
                            <div className='py-1'>
                              {canEditUser(userData) && (
                                <button
                                  onClick={() => {
                                    setEditingUser(userData);
                                    setOpenMenuId(null);
                                  }}
                                  className='w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                >
                                  <div className='flex items-center'>
                                    <HiOutlinePencil className='mr-3 h-4 w-4 text-gray-500' />
                                    Edit
                                  </div>
                                </button>
                              )}
                              {canDeleteUser(userData) && (
                                <button
                                  onClick={() => {
                                    handleDelete(userData.id);
                                    setOpenMenuId(null);
                                  }}
                                  disabled={isDeleting}
                                  className='w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                                >
                                  <div className='flex items-center'>
                                    <HiOutlineTrash className='mr-3 h-4 w-4 text-red-500' />
                                    Delete
                                  </div>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan='5'
                    className='px-6 py-8 whitespace-nowrap text-sm text-gray-500 text-center'
                  >
                    No users found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (future implementation) */}
        <div className='bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6'>
          <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
            <div>
              <p className='text-sm text-gray-700'>
                Showing{' '}
                <span className='font-medium'>
                  {filteredUsers?.length || 0}
                </span>{' '}
                users
              </p>
            </div>
            {/* Pagination component will go here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersTable;
