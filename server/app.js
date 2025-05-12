// server/app.js
const express = require('express');
const fs      = require('fs-extra');
const path    = require('path');
const cors    = require('cors');

const app     = express();
const PORT    = process.env.PORT || 3001;

const DATA_DIR = path.resolve(__dirname, '../ecfr-data');

app.use(cors());
app.use(express.json());

// List all downloaded titles
app.get('/api/titles', async (req, res) => {
  try {
    const files = await fs.readdir(DATA_DIR);
    const titles = files
      .filter(f => f.startsWith('title-') && f.endsWith('.json'))
      .map(f => f.slice(6, -5));
    res.json({ titles });
  } catch (err) {
    res.status(500).json({ error: 'Could not list titles' });
  }
});

// Get one title’s tree data
app.get('/api/titles/:number', async (req, res) => {
  const num = req.params.number;
  const filePath = path.join(DATA_DIR, `title-${num}.json`);

  if (!await fs.pathExists(filePath)) {
    return res.status(404).json({ error: 'Title not found' });
  }

  try {
    const data = await fs.readJson(filePath);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read title data' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
