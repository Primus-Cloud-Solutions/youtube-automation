'use server'

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with fallback values for development and testing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eurztwdqjncuypqbrcmw.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1cnp0d2Rxam5jdXlwcWJyY213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI1MzQ0MDAsImV4cCI6MTk5ODExMDQwMH0.fallback_demo_key_for_development'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request) {
  try {
    const { action, email, password, fullName } = await request.json()
    
    if (action === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      
      if (error) throw error
      
      return Response.json({ success: true, user: data.user })
    } 
    else if (action === 'signin') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      return Response.json({ success: true, user: data.user, session: data.session })
    } 
    else if (action === 'signout') {
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      return Response.json({ success: true })
    }
    else if (action === 'google') {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${request.headers.get('origin')}/auth/callback`,
        },
      })
      
      if (error) throw error
      
      return Response.json({ success: true, url: data.url })
    }
    
    return Response.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Auth API error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    if (action === 'session') {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) throw error
      
      return Response.json({ 
        success: true, 
        session: data.session,
        user: data.session?.user || null
      })
    }
    
    return Response.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Auth API error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
