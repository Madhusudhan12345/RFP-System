const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { parseProposal } = require('../services/aiService');

// Simulated inbound webhook: accept raw email and process
router.post('/inbound', async (req, res) => {
  try {
    const { from, to, subject, body, rfpId, vendorId } = req.body;
    const log = await prisma.emailLog.create({ data: { rfpId: rfpId || null, vendorId: vendorId || null, direction: 'inbound', subject, body, raw: { from, to } } });
    // parse with AI
    const parsed = await parseProposal(body || subject || '');
    // create proposal
    const proposal = await prisma.proposal.create({ data: { rfpId: rfpId || null, vendorId: vendorId || null, rawEmail: body, parsed } });
    // create items if any
    if(parsed?.line_items && parsed.line_items.length) {
      for(const li of parsed.line_items) {
        await prisma.proposalItem.create({ data: { proposalId: proposal.id, description: li.description || 'item', unitPrice: li.unit_price || null, qty: li.qty || null, totalPrice: li.total_price || null } });
      }
    }
    res.json({ ok: true, proposal });
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

module.exports = router;
