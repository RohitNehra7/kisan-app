const axios = require('axios');

async function runIntegrationAudit() {
  console.log('🕵️‍♂️ Starting System Integration Audit...');
  const api = 'http://localhost:5000/api';

  try {
    // 1. Test Preferences POST
    console.log('Step 1: Testing Preferences Save (POST)...');
    await axios.post(`${api}/preferences`, { type: 'commodity', value: 'Wheat' });

    // 2. Test Preferences GET
    console.log('Step 2: Testing Preferences Retrieval (GET)...');
    const getResp = await axios.get(`${api}/preferences`);
    const data = getResp.data;

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('FATAL: Preferences API returned empty array after save!');
    }

    const hasWheat = data.some(f => f.value === 'Wheat');
    if (!hasWheat) {
      throw new Error('FATAL: Saved item "Wheat" not found in retrieval!');
    }

    console.log('✅ Integration Audit: Preferences System PASSED');

    // 3. Test Search Logic
    console.log('Step 3: Testing Search Logic (Rice)...');
    const searchResp = await axios.get(`${api}/mandi-prices?commodity=rice`);
    if (!searchResp.data.records || searchResp.data.records.length === 0) {
       console.warn('⚠️ Search returned 0 records for "rice". Gov API might be slow.');
    } else {
       console.log(`✅ Search Audit: Found ${searchResp.data.records.length} records for "rice"`);
    }

  } catch (err) {
    console.error('❌ INTEGRATION AUDIT FAILED:', err.message);
    process.exit(1);
  }
}

runIntegrationAudit();
