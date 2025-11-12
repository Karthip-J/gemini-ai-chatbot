require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

(async () => {
  try {
    console.log("Gemini key loaded:", !!process.env.GEMINI_API_KEY);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // ✅ Use the latest model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });


    const result = await model.generateContent("Say hello in one short sentence.");
    const response = await result.response.text();

    console.log("\n✅ Gemini Response:\n", response);
  } catch (error) {
    console.error("\n❌ Gemini API error:\n", error);
  }
})();
