import React from 'react';
import { useState } from 'react';
import { useSignup } from '../hooks/useSignup';
import { useNavigate } from 'react-router-dom';

function SignupForm({ onCancel, onSuccess, standalone = false }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [role, setRole] = useState('user');

  const navigate = useNavigate();
  const { signup, isPending } = useSignup();

  function handleSubmit(e) {
    e.preventDefault();
    if (!fullName || !email || !password) return;
    if (password !== passwordConfirm) {
      alert('Passwords do not match');
      return;
    }

    const newUser = {
      fullName,
      email,
      password,
      role,
    };

    signup(newUser, {
      onSuccess: () => {
        // Clear form fields after successful submission
        setFullName('');
        setEmail('');
        setPassword('');
        setPasswordConfirm('');
        setRole('user');

        // If used in a modal/popup with onSuccess handler
        if (onSuccess) {
          onSuccess();
        }
        // If standalone and no custom onSuccess, redirect to users list
        else if (standalone) {
          navigate('/dashboard/users');
        }
      },
    });
  }

  function handleCancel() {
    if (onCancel) {
      // If a cancel handler is provided (modal/popup case)
      onCancel();
    } else {
      // Default behavior for standalone form
      navigate(-1);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label
          htmlFor='fullName'
          className='block text-sm font-medium text-gray-700'
        >
          Full Name
        </label>
        <input
          id='fullName'
          type='text'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isPending}
          required
          className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        />
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
          disabled={isPending}
          className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        >
          <option value='user'>User</option>
          <option value='agency'>Agency Admin</option>
          <option value='admin'>System Admin</option>
        </select>
      </div>

      <div className='flex justify-end space-x-3 pt-4'>
        <button
          type='button'
          onClick={handleCancel}
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
            'Create Account'
          )}
        </button>
      </div>
    </form>
  );
}

export default SignupForm;
