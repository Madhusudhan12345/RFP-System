const axios = require('axios');
const OPENAI_KEY = process.env.OPENAI_API_KEY;

async function callOpenAI(messages, model = 'gpt-4.1') {
  const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
    model,
    messages,
    max_tokens: 1200,
    temperature: 0
  }, {
    headers: { Authorization: `Bearer ${OPENAI_KEY}` }
  });
  return resp.data.choices[0].message.content;
}

async function createStructuredRFP(nlText) {
  const system = `You are an assistant that extracts procurement requirements into JSON. Output ONLY valid JSON with the schema: { title, items: [{name,qty,specs}], budget, delivery_days, payment_terms, warranty_months, notes }`;
  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: nlText }
  ];
  const out = await callOpenAI(messages);
  try { return JSON.parse(out); } catch (e) { throw new Error('AI produced invalid JSON: ' + e.message); }
}

async function parseProposal(rawText) {
  const system = `You are an assistant that extracts vendor proposals into JSON. Output ONLY valid JSON with schema: { vendor_name, total_price, currency, delivery_days, payment_terms, warranty_months, line_items: [{description,unit_price,qty,total_price}], notes }`;
  const messages = [ { role: 'system', content: system }, { role: 'user', content: rawText } ];
  const out = await callOpenAI(messages);
  try { return JSON.parse(out); } catch (e) { throw new Error('AI produced invalid JSON for proposal: ' + e.message); }
}

module.exports = { createStructuredRFP, parseProposal };
