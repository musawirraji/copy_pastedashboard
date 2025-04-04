import supabase from './supabase';

export async function signup({ fullName, email, password, role }) {
  try {
    // Input validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Check if the email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    // Prepare metadata to match existing successful examples
    const options = {
      data: {
        sub: null, // This will be populated automatically by Supabase
        role: role || 'user',
        email: email,
        fullName: fullName || '',
        email_verified: true,
      },
    };

    // Handle auth signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      console.error('Auth signup error:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Signup process failed:', error);
    throw error;
  }
}

export async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  // Try to get user profile but don't fail if unable to fetch
  try {
    if (data?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profile) {
        data.user.profile = profile;
      }
    }
  } catch (e) {
    console.warn('Could not fetch user profile:', e);
    // Continue without profile data
  }

  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function updatePassword({ password }) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}
