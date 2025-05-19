const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.get('/aisle', async (req, res) => {
  const item = req.query.item || 'milk';

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    const url = `https://www.walmart.com/store/2281/search?q=${encodeURIComponent(item)}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const html = await page.content();
    await browser.close();

    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching Walmart page');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

