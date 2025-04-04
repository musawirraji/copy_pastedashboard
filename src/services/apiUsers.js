import supabase from './supabase';

export async function getUsers() {
  try {
    // Get current user to determine role
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // Check where role is stored - could be in user_metadata or app_metadata
    // Based on your previous examples, role could be in different places
    console.log('User data:', user);

    // Try different locations for the role
    const userRole =
      user.app_metadata?.role || user.user_metadata?.role || user.profile.role;

    console.log('User role detected:', userRole);

    // Check if user has permission to fetch users
    if (userRole !== 'admin' && userRole !== 'agency') {
      throw new Error(
        'Unauthorized: Only admin and agency roles can fetch users'
      );
    }

    // Build query to get all users from profiles table
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.error('Error fetching users:', error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return profiles || [];
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
}

export async function createUser(userData) {
  // Implementation for creating a user
  const { data, error } = await supabase
    .from('profiles')
    .insert(userData)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateUser(userData) {
  const { data, error } = await supabase
    .from('profiles')
    .update(userData)
    .eq('id', userData.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteUser(id) {
  const { error } = await supabase.from('profiles').delete().eq('id', id);

  if (error) throw new Error(error.message);
  return null;
}
