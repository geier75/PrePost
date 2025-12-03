const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

console.log('🔄 Testing Supabase Connection...\n');

// Get credentials from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('📍 URL:', supabaseUrl);
console.log('🔑 Service Key:', supabaseKey ? '✅ Found' : '❌ Missing');
console.log('');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('📊 Testing basic connection...');
    
    // Simple test query
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      // Table might not exist yet - that's OK for initial test
      if (error.message.includes('relation') || error.message.includes('does not exist') || error.message.includes('Could not find the table')) {
        console.log('⚠️  Tables not created yet - this is normal!');
        console.log('📝 Next step: Deploy the database schema');
        console.log('');
        console.log('✅ Connection to Supabase successful!');
        console.log('🎯 Database is ready for schema deployment');
      } else {
        throw error;
      }
    } else {
      console.log('✅ Connection successful!');
      console.log('✅ Tables already exist!');
    }
    
    console.log('\n🎉 DATABASE CONNECTION TEST PASSED!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Next step: Deploy the schema to Supabase');
    console.log('');
    
  } catch (error) {
    console.error('\n❌ Connection test failed!');
    console.error('Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if Supabase project is active');
    console.log('2. Verify API keys in .env.production');
    console.log('3. Check network connection');
    process.exit(1);
  }
}

testConnection();
