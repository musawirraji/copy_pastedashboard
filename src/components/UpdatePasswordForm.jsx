import React from 'react';
import { useState } from 'react';
import { useUpdateUser } from '../hooks/useUpdateUser';

function UpdatePasswordForm() {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const { updateUser, isPending } = useUpdateUser();

  function handleSubmit(e) {
    e.preventDefault();

    if (!password || !passwordConfirm) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== passwordConfirm) {
      alert('Passwords do not match');
      return;
    }

    updateUser(
      { password },
      {
        onSuccess: () => {
          setPassword('');
          setPasswordConfirm('');
        },
      }
    );
  }

  function handleReset() {
    setPassword('');
    setPasswordConfirm('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-4 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md'
    >
      <h2 className='text-xl font-semibold text-gray-800 mb-6'>
        Update Password
      </h2>

      <div>
        <label
          htmlFor='password'
          className='block text-sm font-medium text-gray-700'
        >
          New Password
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
          Confirm New Password
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

      <div className='flex justify-end space-x-3 pt-4'>
        <button
          type='button'
          onClick={handleReset}
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
            'Update Password'
          )}
        </button>
      </div>
    </form>
  );
}

export default UpdatePasswordForm;
