/**
 * Roles Helper Functions
 * Shared utilities for role management (used across API routes)
 */

function logError(message, error) {
  console.error(`[ERROR] ${message}`, error);
}

/**
 * Get all roles for a user
 */
export async function getUserRoles(supabase, userId) {
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      role:roles!inner(id, name, description)
    `)
    .eq('user_id', userId);

  if (error) {
    logError('Error fetching user roles:', error);
    return [];
  }

  return (data || []).map(item => item.role);
}

/**
 * Check if a user has a specific role (case-insensitive)
 */
export async function userHasRole(supabase, userId, roleName) {
  if (!roleName) return false;
  
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      role:roles!inner(name)
    `)
    .eq('user_id', userId)
    .limit(100);

  if (error) {
    logError('Error checking user role:', error);
    return false;
  }

  // Case-insensitive comparison
  const normalizedRoleName = roleName.toLowerCase();
  return data && data.some(item => item.role && item.role.name && item.role.name.toLowerCase() === normalizedRoleName);
}

/**
 * Get all users with their roles and login stats
 */
export async function getAllUsersWithRoles(supabase) {
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, name, picture, created_at')
    .order('created_at', { ascending: false });

  if (usersError) {
    logError('Error fetching users:', usersError);
    throw usersError;
  }

  const { data: userRoles, error: rolesError } = await supabase
    .from('user_roles')
    .select(`
      user_id,
      role:roles!inner(id, name, description)
    `);

  if (rolesError) {
    logError('Error fetching user roles:', rolesError);
    throw rolesError;
  }

  // Get login stats
  const userIds = (users || []).map(u => u.id);
  let loginStats = {};
  
  if (userIds.length > 0) {
    const { data: loginData, error: loginError } = await supabase
      .from('user_logins')
      .select('user_id, logged_in_at')
      .in('user_id', userIds);

    if (!loginError && loginData) {
      loginData.forEach(login => {
        if (!loginStats[login.user_id]) {
          loginStats[login.user_id] = {
            last_login: login.logged_in_at,
            first_login: login.logged_in_at,
            login_count: 0,
          };
        }
        const stats = loginStats[login.user_id];
        stats.login_count++;
        if (new Date(login.logged_in_at) > new Date(stats.last_login)) {
          stats.last_login = login.logged_in_at;
        }
        if (new Date(login.logged_in_at) < new Date(stats.first_login)) {
          stats.first_login = login.logged_in_at;
        }
      });
    }
  }

  const rolesByUserId = {};
  (userRoles || []).forEach(ur => {
    if (!rolesByUserId[ur.user_id]) {
      rolesByUserId[ur.user_id] = [];
    }
    rolesByUserId[ur.user_id].push(ur.role);
  });

  return (users || []).map(user => ({
    ...user,
    roles: rolesByUserId[user.id] || [],
    login_stats: loginStats[user.id] || { last_login: null, first_login: null, login_count: 0 },
  }));
}
