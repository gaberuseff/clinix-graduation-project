import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  // 1. Setup CORS Headers to allow React to communicate with the function
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  // Handle the Preflight (OPTIONS) request sent automatically by the browser
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Retrieve data sent from React
    const body = await req.json()
    const { action = 'create' } = body

    // Create secure admin client (Service Role)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    if (action === 'create') {
      const { name, phone, email, password, confirmPassword, clinic_id } = body

      // Validation: check if all fields are present
      if (!name || !phone || !email || !password || !confirmPassword || !clinic_id) {
        return new Response(
          JSON.stringify({ error: 'All fields are required. Please make sure to fill in all details.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Check if password and confirmPassword match
      if (password !== confirmPassword) {
        return new Response(
          JSON.stringify({ error: 'Password and password confirmation do not match.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Validate password length
      if (password.length < 6) {
        return new Response(
          JSON.stringify({ error: 'Password is too short.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Create secretary account in Auth
      const { data, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: name,
          phone,
          role: 'SECRETARY',
          clinic_id,
        },
      })

      if (authError) throw authError

      return new Response(
        JSON.stringify({ success: true, user: data.user }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    if (action === 'block' || action === 'unblock') {
      const { userId } = body
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'User ID is required for blocking/unblocking.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      const isBlocked = action === 'block'

      // 1. Update in Auth (ban/unban)
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        ban_duration: isBlocked ? '87600h' : 'none'
      })
      if (authError) throw authError

      // 2. Update is_blocked in users table
      const { error: dbError } = await supabaseAdmin
        .from('users')
        .update({ is_blocked: isBlocked })
        .eq('id', userId)
      if (dbError) throw dbError

      return new Response(
        JSON.stringify({ success: true, message: `User ${action}ed successfully` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    if (action === 'delete') {
      const { userId } = body
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'User ID is required for deletion.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // 1. Delete from users table first
      const { error: dbError } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', userId)
      if (dbError) throw dbError

      // 2. Delete from Auth
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
      if (authError) throw authError

      return new Response(
        JSON.stringify({ success: true, message: 'User deleted successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Invalid action
    return new Response(
      JSON.stringify({ error: `Invalid action: ${action}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
