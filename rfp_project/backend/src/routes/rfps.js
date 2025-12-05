const express = require('express');
const router = express.Router();
const { createStructuredRFP, parseProposal } = require('../services/aiService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendRfpEmail } = require('../services/emailService');

// Create RFP from natural language
router.post('/create', async (req, res) => {
  try {
    const { nl_text } = req.body;
    const structured = await createStructuredRFP(nl_text);
    const rfp = await prisma.rfp.create({ data: {
      title: structured.title || 'RFP',
      description: nl_text,
      structured,
      budget: structured.budget || null,
      deliveryDays: structured.delivery_days || null,
      paymentTerms: structured.payment_terms || null,
      warrantyMonths: structured.warranty_months || null
    }});
    res.json(rfp);
  } catch (err) { console.error(err); res.status(500).json({error: err.message}); }
});

// Send RFP to vendors
router.post('/:id/send', async (req, res) => {
  try {
    const { id } = req.params;
    const { vendor_ids, message } = req.body;
    const rfp = await prisma.rfp.findUnique({ where: { id } });
    if(!rfp) return res.status(404).json({ error: 'RFP not found' });
    const vendors = await prisma.vendor.findMany({ where: { id: { in: vendor_ids } } });

    for(const vendor of vendors) {
      const html = `<p>Hi ${vendor.contactPerson || vendor.name},</p><p>${message || 'Please find our RFP below.'}</p><pre>${JSON.stringify(rfp.structured, null, 2)}</pre>`;
      const info = await sendRfpEmail(vendor.contactEmail, `RFP: ${rfp.title}`, html);
      await prisma.rfpVendor.create({ data: { rfpId: id, vendorId: vendor.id, sentAt: new Date(), messageId: info.messageId } });
    }
    res.json({ ok: true });
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

// Get proposals for RFP
router.get('/:id/proposals', async (req, res) => {
  const { id } = req.params;
  const proposals = await prisma.proposal.findMany({ where: { rfpId: id }, include: { vendor: true, items: true } });
  res.json(proposals);
});

// Comparison endpoint (basic)
router.get('/:id/comparison', async (req, res) => {
  const { id } = req.params;
  const rfp = await prisma.rfp.findUnique({ where: { id } });
  const proposals = await prisma.proposal.findMany({ where: { rfpId: id }, include: { vendor: true } });
  // naive scoring
  const prices = proposals.map(p => p.parsed?.total_price || Number.MAX_VALUE).filter(v => v !== Number.MAX_VALUE);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const ranked = proposals.map(p => {
    const price = p.parsed?.total_price || Number.MAX_VALUE;
    const priceScore = (minPrice === 0 || price === Number.MAX_VALUE) ? 0 : (minPrice / price) * 50;
    const completeness = p.completeness || 50;
    const aiScore = priceScore + completeness;
    return { vendor: p.vendor.name, price, aiScore, explanation: 'Combined score of price and completeness' };
  }).sort((a,b) => b.aiScore - a.aiScore);
  res.json({ winner: ranked[0] || null, ranked });
});

module.exports = router;
