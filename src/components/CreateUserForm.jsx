import React from 'react';
import { useState } from 'react';
import { useCreateUser } from '../hooks/useUsers';
import { useUser } from '../hooks/useUser';

function CreateUserForm({ onCancel }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [role, setRole] = useState('user');

  const { createNewUser, isPending } = useCreateUser();
  const { user, isAdmin } = useUser();

  function handleSubmit(e) {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) return;
    if (password !== passwordConfirm) {
      alert('Passwords do not match');
      return;
    }

    // For agency admins, enforce user role
    const effectiveRole = user?.profile?.role === 'agency' ? 'user' : role;

    createNewUser(
      {
        firstName,
        lastName,
        email,
        password,
        role: effectiveRole,
      },
      {
        onSuccess: () => {
          onCancel(); // Close form on success
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div>
          <label
            htmlFor='firstName'
            className='block text-sm font-medium text-gray-700'
          >
            First Name
          </label>
          <input
            id='firstName'
            type='text'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isPending}
            required
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          />
        </div>

        <div>
          <label
            htmlFor='lastName'
            className='block text-sm font-medium text-gray-700'
          >
            Last Name
          </label>
          <input
            id='lastName'
            type='text'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isPending}
            required
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          />
        </div>
      </div>

      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700'
        >
          Email
        </label>
        <input
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          required
          className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        />
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'
          >
            Password
          </label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            required
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          />
        </div>

        <div>
          <label
            htmlFor='passwordConfirm'
            className='block text-sm font-medium text-gray-700'
          >
            Confirm Password
          </label>
          <input
            id='passwordConfirm'
            type='password'
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            disabled={isPending}
            required
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          />
        </div>
      </div>

      {isAdmin && (
        <div>
          <label
            htmlFor='role'
            className='block text-sm font-medium text-gray-700'
          >
            Role
          </label>
          <select
            id='role'
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isPending || user?.profile?.role === 'agency'}
            className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          >
            <option value='user'>User</option>
            <option value='agency'>Agency Admin</option>
            <option value='admin'>System Admin</option>
          </select>
        </div>
      )}

      <div className='flex justify-end space-x-3 pt-4'>
        <button
          type='button'
          onClick={onCancel}
          disabled={isPending}
          className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        >
          Cancel
        </button>

        <button
          type='submit'
          disabled={isPending}
          className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        >
          {isPending ? (
            <svg
              className='animate-spin h-5 w-5 text-white'
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
          ) : (
            'Create User'
          )}
        </button>
      </div>
    </form>
  );
}

export default CreateUserForm;
