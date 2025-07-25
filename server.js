const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const path = require('path');

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json())
app.use(express.static(path.join(__dirname)));

const urls = {};

const isValidUrl = (urlString) => {
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
};

app.post('/shorten', (req, res) => {
  const { url } = req.body;

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'A valid URL must be provided.' });
  }

  const shortCode = nanoid(6);

  const newUrlData = {
    id: String(Object.keys(urls).length + 1),
    url: url,
    shortCode: shortCode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    accessCount: 0,
  };

  urls[shortCode] = newUrlData;
  res.status(201).json(newUrlData);
});

app.get('/:shortCode', (req, res, next) => {
    const { shortCode } = req.params;
    if (req.path.startsWith('/shorten')) {
        return next();
    }

    const urlData = urls[shortCode];

    if (urlData) {
        urlData.accessCount++;
        res.redirect(urlData.url);
    } else {
        next();
    }
});


app.get('/shorten/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const urlData = urls[shortCode];

  if (urlData) {
    res.status(200).json(urlData);
  } else {
    res.status(404).json({ error: 'Short URL not found.' });
  }
});


app.put('/shorten/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const { url } = req.body;

  if (!urls[shortCode]) {
    return res.status(404).json({ error: 'Short URL not found.' });
  }

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'A valid URL must be provided.' });
  }

  urls[shortCode].url = url;
  urls[shortCode].updatedAt = new Date().toISOString();
  res.status(200).json(urls[shortCode]);
});


app.delete('/shorten/:shortCode', (req, res) => {
  const { shortCode } = req.params;

  if (urls[shortCode]) {
    delete urls[shortCode];
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Short URL not found.' });
  }
});


app.get('/shorten/:shortCode/stats', (req, res) => {
  const { shortCode } = req.params;
  const urlData = urls[shortCode];

  if (urlData) {
    res.status(200).json(urlData);
  } else {
    res.status(404).json({ error: 'Short URL not found.' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
