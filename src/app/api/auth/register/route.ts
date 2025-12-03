import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;
    
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
    
    // Check password strength
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return NextResponse.json(
        { error: 'Passwort muss Groß- und Kleinbuchstaben sowie Zahlen enthalten' },
        { status: 400 }
      );
    }
    
    // TODO: Real Supabase Registration
    // const supabase = createRouteHandlerClient({ cookies });
    // const { data, error } = await supabase.auth.signUp({
    //   email: email.toLowerCase().trim(),
    //   password,
    //   options: {
    //     data: {
    //       name: name || email.split('@')[0]
    //     }
    //   }
    // });
    
    // MOCK: Simulate successful registration
    const mockUser = {
      id: 'user_' + Date.now(),
      email: email.toLowerCase().trim(),
      name: name || email.split('@')[0],
      tier: 'free',
      created_at: new Date().toISOString(),
      email_verified: false
    };
    
    // Set session cookie
    const cookieStore = cookies();
    cookieStore.set('session', JSON.stringify({
      user: mockUser,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60
    });
    
    return NextResponse.json({
      success: true,
      user: mockUser,
      message: 'Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mail.'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST email and password to this endpoint to register',
    method: 'POST',
    requiredFields: ['email', 'password'],
    optionalFields: ['name'],
    passwordRequirements: {
      minLength: 8,
      mustContain: ['uppercase', 'lowercase', 'number']
    }
  });
}
