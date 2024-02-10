const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const outputPath = __dirname+'\\outputs\\' + uuidv4() + '.png'

function save(screenshot) {
  fs.writeFileSync(outputPath, screenshot);
}

app.post('/screenshot', async (req, res) => {
  const url = req.body.url
  const height = +( req.body.height)
  const width = +(req.body.width)

  console.log(req.body)
  console.log(url)
  console.log(height)
  console.log(width)

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the viewport size
    await page.setViewport({ width, height });

    // Ensure the URL includes the protocol (http:// or https://)
    const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;

    await page.goto(formattedUrl);
    const screenshot = await page.screenshot();
    await browser.close();

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': screenshot.length,
    });
    res.end(screenshot);
    save(screenshot)
    

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
