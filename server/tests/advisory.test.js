const axios = require('axios');

async function testAdvisory() {
  console.log('🧪 Testing Advisory Engine...');
  try {
    const resp = await axios.post('http://localhost:5000/api/advisory/sell-hold', {
      crop: 'Wheat',
      quantity: 50,
      district: 'Karnal',
      storageCostPerDay: 0.5,
      urgency: 'flexible'
    });
    
    if (resp.data.success && resp.data.data.decision) {
      console.log('✅ Advisory Engine Success!');
      console.log('Decision:', resp.data.data.decision);
      console.log('Reason:', resp.data.data.hindi_reason);
    } else {
      console.error('❌ Advisory Engine returned invalid data', resp.data);
    }
  } catch (e) {
    console.error('❌ Advisory Engine Connection Failed', e.message);
  }
}

testAdvisory();
