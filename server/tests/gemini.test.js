require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  console.log('Testing Gemini Key:', process.env.GEMINI_KEY?.substring(0, 5) + '...');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY || '');
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Hello, are you active?");
    console.log('Gemini Response:', result.response.text());
  } catch (e) {
    console.error('Gemini Error:', e.message);
  }
}

testGemini();
