const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { name, contactEmail, contactPerson, phone, notes } = req.body;
  const v = await prisma.vendor.create({ data: { name, contactEmail, contactPerson, phone, notes } });
  res.json(v);
});

router.get('/', async (req, res) => {
  const vendors = await prisma.vendor.findMany();
  res.json(vendors);
});

module.exports = router;
