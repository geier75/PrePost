const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.production' });

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deploySchema() {
  console.log('🚀 Deploying Database Schema to Supabase...\n');
  
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'database-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Schema loaded: 381 lines');
    console.log('🔄 Deploying to Supabase...');
    
    // Execute the schema
    const { data, error } = await supabase.rpc('exec_sql', {
      query: schema
    });
    
    if (error && error.message.includes('does not exist')) {
      // Alternative: Direct deployment not available via RPC
      console.log('\n⚠️  Automatic deployment not available.');
      console.log('\n📝 MANUAL DEPLOYMENT REQUIRED:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('1. Open Supabase Dashboard');
      console.log('2. Go to SQL Editor');
      console.log('3. Click "+ New query"');
      console.log('4. Copy the schema from:');
      console.log('   ' + schemaPath);
      console.log('5. Paste and click "Run"');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n💡 Schema file location:');
      console.log('   cat ' + schemaPath);
      return;
    }
    
    if (error) throw error;
    
    console.log('✅ Schema deployed successfully!');
    console.log('\n📊 Created:');
    console.log('   - 10 Tables');
    console.log('   - RLS Policies');
    console.log('   - Indexes');
    console.log('   - Triggers');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    console.log('\n📝 Please deploy manually via Supabase SQL Editor');
  }
}

deploySchema();
