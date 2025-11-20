/**
 * Vercel Serverless Function for User Management
 * 
 * Creates or retrieves user information after Google OAuth login
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST and GET requests
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (req.method === 'POST') {
      // Create or update user
      const { email, name, picture, sub } = req.body;

      if (!email || !sub) {
        return res.status(400).json({ error: 'Missing required fields: email and sub' });
      }

      // In a real implementation, you would:
      // 1. Store user in database (e.g., Supabase, PostgreSQL)
      // 2. Check if user exists, create if not
      // 3. Return user with ID and role information
      
      // For now, we'll simulate user creation and return user data
      // TODO: Replace with actual database integration
      const user = {
        id: sub, // Use Google sub as user ID
        email: email,
        name: name || email.split('@')[0],
        picture: picture || null,
        createdAt: new Date().toISOString(),
        // Role would come from your database/CRM system
        role: 'Account Manager', // This would be fetched from your system
      };

      // In production, save to database here
      // await db.users.upsert({ where: { email }, data: user });

      return res.status(200).json(user);
    } else if (req.method === 'GET') {
      // Get user by email or ID
      const { email, id } = req.query;

      if (!email && !id) {
        return res.status(400).json({ error: 'Missing required parameter: email or id' });
      }

      // In a real implementation, fetch from database
      // const user = await db.users.findUnique({ where: { email: email || undefined, id: id || undefined } });
      
      // For now, return mock data
      // TODO: Replace with actual database query
      return res.status(200).json({
        id: id || 'mock-user-id',
        email: email || 'user@example.com',
        name: email?.split('@')[0] || 'User',
        role: 'Account Manager',
      });
    }
  } catch (error) {
    console.error('Error in users function:', error);
    return res.status(500).json({ 
      error: process.env.NODE_ENV === 'production' 
        ? 'An error occurred' 
        : error.message 
    });
  }
}

