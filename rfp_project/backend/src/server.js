const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

require('dotenv').config();

app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

// Routes
const rfpRoutes = require('./routes/rfps');
const vendorRoutes = require('./routes/vendors');
const emailRoutes = require('./routes/emails');

app.use('/api/rfps', rfpRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/emails', emailRoutes);

app.get('/', (req, res) => res.send('RFP Backend is running'));

app.listen(port, () => console.log(`Server listening on ${port}`));
