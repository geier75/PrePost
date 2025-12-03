import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// TODO: Replace with real Supabase integration
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;
    
    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email und Passwort sind erforderlich' },
        { status: 400 }
      );
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      );
    }
    
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Passwort muss mindestens 8 Zeichen lang sein' },
        { status: 400 }
      );
    }
    
    // TODO: Real Supabase Authentication
    // const supabase = createRouteHandlerClient({ cookies });
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email: email.toLowerCase().trim(),
    //   password,
    // });
    
    // MOCK: Simulate successful login for demo purposes
    const mockUser = {
      id: 'user_' + Date.now(),
      email: email.toLowerCase().trim(),
      name: email.split('@')[0],
      tier: 'pro',
      created_at: new Date().toISOString()
    };
    
    // Set session cookie
    const cookieStore = cookies();
    cookieStore.set('session', JSON.stringify({
      user: mockUser,
      expiresAt: rememberMe 
        ? Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
        : Date.now() + 24 * 60 * 60 * 1000 // 1 day
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60
    });
    
    return NextResponse.json({
      success: true,
      user: mockUser,
      message: 'Login erfolgreich'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST email and password to this endpoint to login',
    method: 'POST',
    requiredFields: ['email', 'password'],
    optionalFields: ['rememberMe']
  });
}
