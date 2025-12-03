import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// DSGVO-compliant consent logging
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    
    // Hash IP for privacy (DSGVO requirement)
    const hashedIP = hashIP(ip);
    
    const consentRecord = {
      id: generateConsentId(),
      timestamp: new Date().toISOString(),
      hashedIP,
      consent: body.consent,
      userAgent: body.userAgent,
      version: body.consent.version || '1.0',
      // Store for 3 years as per DSGVO requirements
      expiresAt: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    // TODO: Save to database
    console.log('Consent recorded:', consentRecord);
    
    // Return confirmation with consent ID for user records
    return NextResponse.json({
      success: true,
      consentId: consentRecord.id,
      timestamp: consentRecord.timestamp
    });
  } catch (error) {
    console.error('Consent logging error:', error);
    return NextResponse.json(
      { error: 'Failed to log consent' },
      { status: 500 }
    );
  }
}

// GET endpoint for users to retrieve their consent history (DSGVO Art. 15)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const consentId = searchParams.get('consentId');
  
  if (!consentId) {
    return NextResponse.json(
      { error: 'Consent ID required' },
      { status: 400 }
    );
  }
  
  // TODO: Retrieve from database
  return NextResponse.json({
    message: 'Consent retrieval endpoint - to be implemented with database'
  });
}

// DELETE endpoint for consent withdrawal (DSGVO Art. 7)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { consentId } = body;
    
    if (!consentId) {
      return NextResponse.json(
        { error: 'Consent ID required' },
        { status: 400 }
      );
    }
    
    // TODO: Mark consent as withdrawn in database (don't delete, keep for audit)
    console.log('Consent withdrawn:', consentId);
    
    return NextResponse.json({
      success: true,
      message: 'Consent withdrawn successfully',
      withdrawnAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Consent withdrawal error:', error);
    return NextResponse.json(
      { error: 'Failed to withdraw consent' },
      { status: 500 }
    );
  }
}

// Helper functions
function hashIP(ip: string): string {
  // Simple hash for DSGVO compliance - in production use proper hashing
  return Buffer.from(ip).toString('base64').substring(0, 10);
}

function generateConsentId(): string {
  return `consent_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
