import supabase from './supabase';

export async function getAgencies() {
  // Get current user to determine role
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  // Get user profile
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role, agency_id')
    .eq('id', user.id)
    .single();

  // If not admin, only get own agency
  if (currentProfile.role !== 'admin') {
    if (currentProfile.role === 'agency' && currentProfile.agency_id) {
      const { data, error } = await supabase
        .from('agencies')
        .select('*')
        .eq('id', currentProfile.agency_id)
        .single();

      if (error) throw new Error(error.message);

      return [data];
    }

    return [];
  }

  // Admin gets all agencies
  const { data, error } = await supabase
    .from('agencies')
    .select('*')
    .order('name');

  if (error) throw new Error(error.message);

  return data;
}

export async function createAgency({ name }) {
  const { data, error } = await supabase
    .from('agencies')
    .insert([{ name }])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function updateAgency({ id, name }) {
  const { data, error } = await supabase
    .from('agencies')
    .update({ name })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function deleteAgency(id) {
  // Get users in this agency
  const { data: users } = await supabase
    .from('profiles')
    .select('id')
    .eq('agency_id', id);

  // Delete all users in this agency
  if (users && users.length > 0) {
    for (const user of users) {
      try {
        // Delete user from Auth
        await supabase.auth.admin.deleteUser(user.id);

        // Delete profile
        await supabase.from('profiles').delete().eq('id', user.id);
      } catch (error) {
        console.error(`Failed to delete user ${user.id}:`, error);
      }
    }
  }

  // Delete the agency
  const { error } = await supabase.from('agencies').delete().eq('id', id);

  if (error) throw new Error(error.message);

  return { success: true };
}
