import React, { useState } from 'react';
import {
  useAgencies,
  useCreateAgency,
  useUpdateAgency,
  useDeleteAgency,
} from '../hooks/useAgencies';
import {
  HiOutlinePlusCircle,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineDotsVertical,
  HiOutlineX,
} from 'react-icons/hi';

function AgencyManagement() {
  const { isPending, agencies } = useAgencies();
  const { createNewAgency, isPending: isCreating } = useCreateAgency();
  const { updateExistingAgency, isPending: isUpdating } = useUpdateAgency();
  const { deleteExistingAgency, isPending: isDeleting } = useDeleteAgency();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAgency, setEditingAgency] = useState(null);
  const [agencyName, setAgencyName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  function handleCreateSubmit(e) {
    e.preventDefault();
    if (!agencyName.trim()) return;

    createNewAgency(
      { name: agencyName },
      {
        onSuccess: () => {
          setAgencyName('');
          setShowCreateForm(false);
        },
      }
    );
  }

  function handleUpdateSubmit(e) {
    e.preventDefault();
    if (!agencyName.trim()) return;

    updateExistingAgency(
      {
        id: editingAgency.id,
        name: agencyName,
      },
      {
        onSuccess: () => {
          setAgencyName('');
          setEditingAgency(null);
        },
      }
    );
  }

  function handleDelete(id) {
    if (
      window.confirm(
        'Are you sure you want to delete this agency? This will also delete all users associated with this agency.'
      )
    ) {
      deleteExistingAgency(id);
      setOpenMenuId(null);
    }
  }

  function startEdit(agency) {
    setEditingAgency(agency);
    setAgencyName(agency.name);
    setOpenMenuId(null);
  }

  function cancelEdit() {
    setEditingAgency(null);
    setAgencyName('');
  }

  // Toggle menu for mobile
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Filter agencies based on search term
  const filteredAgencies = agencies?.filter((agency) => {
    if (searchTerm.trim() === '') return true;

    return agency.name.toLowerCase().includes(searchTerm.toLowerCase());
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
      <div className='flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-200 mb-6'>
        <div>
          <h1 className='text-xl font-bold text-gray-900'>Agency Management</h1>
          <p className='mt-1 text-sm text-gray-500'>
            Create and manage agencies in the system
          </p>
        </div>
        <div className='mt-4 md:mt-0'>
          <button
            type='button'
            onClick={() => setShowCreateForm(true)}
            className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            <HiOutlinePlusCircle className='-ml-1 mr-2 h-5 w-5' />
            Add Agency
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className='mb-6 bg-white shadow rounded-lg overflow-hidden'>
        <div className='px-4 py-5 sm:p-6'>
          <label
            htmlFor='agency-search'
            className='block text-sm font-medium text-gray-700'
          >
            Search Agencies
          </label>
          <div className='mt-1 relative rounded-md shadow-sm'>
            <input
              type='text'
              name='search'
              id='agency-search'
              className='focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md'
              placeholder='Search by agency name'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type='button'
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
                onClick={() => setSearchTerm('')}
              >
                <HiOutlineX className='h-5 w-5 text-gray-400' />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className='mb-6 bg-white shadow rounded-lg overflow-hidden'>
          <div className='px-4 py-5 sm:px-6 bg-gray-50'>
            <h2 className='text-lg font-medium text-gray-900'>
              Create New Agency
            </h2>
          </div>
          <div className='px-4 py-5 sm:p-6'>
            <form onSubmit={handleCreateSubmit}>
              <div>
                <label
                  htmlFor='agency-name'
                  className='block text-sm font-medium text-gray-700'
                >
                  Agency Name
                </label>
                <input
                  type='text'
                  id='agency-name'
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className='mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md'
                  disabled={isCreating}
                  required
                />
              </div>
              <div className='mt-4 flex justify-end space-x-3'>
                <button
                  type='button'
                  onClick={() => {
                    setShowCreateForm(false);
                    setAgencyName('');
                  }}
                  className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <div className='flex items-center'>
                      <div className='animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full'></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Agency'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {editingAgency && (
        <div className='mb-6 bg-white shadow rounded-lg overflow-hidden'>
          <div className='px-4 py-5 sm:px-6 bg-gray-50'>
            <h2 className='text-lg font-medium text-gray-900'>Edit Agency</h2>
          </div>
          <div className='px-4 py-5 sm:p-6'>
            <form onSubmit={handleUpdateSubmit}>
              <div>
                <label
                  htmlFor='edit-agency-name'
                  className='block text-sm font-medium text-gray-700'
                >
                  Agency Name
                </label>
                <input
                  type='text'
                  id='edit-agency-name'
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className='mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md'
                  disabled={isUpdating}
                  required
                />
              </div>
              <div className='mt-4 flex justify-end space-x-3'>
                <button
                  type='button'
                  onClick={cancelEdit}
                  className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <div className='flex items-center'>
                      <div className='animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full'></div>
                      Updating...
                    </div>
                  ) : (
                    'Update Agency'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Agency Count */}
      <div className='mb-4 text-sm text-gray-600'>
        Showing {filteredAgencies?.length || 0} of {agencies?.length || 0}{' '}
        agencies
      </div>

      {/* Agency List */}
      <div className='bg-white shadow overflow-hidden rounded-lg'>
        <ul className='divide-y divide-gray-200'>
          {filteredAgencies && filteredAgencies.length > 0 ? (
            filteredAgencies.map((agency) => (
              <li
                key={agency.id}
                className='px-4 py-4 sm:px-6 hover:bg-gray-50'
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center'>
                      <span className='text-green-700 font-medium'>
                        {agency.name?.[0] || 'A'}
                      </span>
                    </div>
                    <div className='ml-4'>
                      <p className='text-sm font-medium text-gray-900'>
                        {agency.name}
                      </p>
                    </div>
                  </div>

                  {/* Desktop Actions */}
                  <div className='hidden sm:flex space-x-2'>
                    <button
                      type='button'
                      onClick={() => startEdit(agency)}
                      className='inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    >
                      <HiOutlinePencil className='-ml-0.5 mr-1 h-4 w-4' />
                      Edit
                    </button>
                    <button
                      type='button'
                      onClick={() => handleDelete(agency.id)}
                      className='inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                    >
                      <HiOutlineTrash className='-ml-0.5 mr-1 h-4 w-4' />
                      Delete
                    </button>
                  </div>

                  {/* Mobile Actions */}
                  <div className='sm:hidden relative'>
                    <button
                      onClick={() => toggleMenu(agency.id)}
                      className='text-gray-500 hover:text-gray-700'
                      aria-expanded={openMenuId === agency.id}
                    >
                      <HiOutlineDotsVertical className='h-5 w-5' />
                    </button>

                    {openMenuId === agency.id && (
                      <div className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10'>
                        <div className='py-1'>
                          <button
                            onClick={() => startEdit(agency)}
                            className='w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                          >
                            <div className='flex items-center'>
                              <HiOutlinePencil className='mr-3 h-4 w-4 text-gray-500' />
                              Edit
                            </div>
                          </button>
                          <button
                            onClick={() => handleDelete(agency.id)}
                            className='w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                          >
                            <div className='flex items-center'>
                              <HiOutlineTrash className='mr-3 h-4 w-4 text-red-500' />
                              Delete
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className='px-4 py-6 text-center text-sm text-gray-500'>
              {searchTerm
                ? 'No agencies found matching your search'
                : 'No agencies created yet'}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default AgencyManagement;
