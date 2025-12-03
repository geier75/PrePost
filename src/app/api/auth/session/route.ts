import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Keine aktive Session', authenticated: false },
        { status: 401 }
      );
    }
    
    const session = JSON.parse(sessionCookie.value);
    
    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      cookieStore.delete('session');
      return NextResponse.json(
        { error: 'Session abgelaufen', authenticated: false },
        { status: 401 }
      );
    }
    
    // TODO: Validate with Supabase
    // const supabase = createRouteHandlerClient({ cookies });
    // const { data: { user } } = await supabase.auth.getUser();
    
    return NextResponse.json({
      authenticated: true,
      user: session.user,
      expiresAt: session.expiresAt
    });
    
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Session-Check', authenticated: false },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = cookies();
    cookieStore.delete('session');
    
    // TODO: Sign out from Supabase
    // const supabase = createRouteHandlerClient({ cookies });
    // await supabase.auth.signOut();
    
    return NextResponse.json({
      success: true,
      message: 'Erfolgreich abgemeldet'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Abmelden' },
      { status: 500 }
    );
  }
}
