const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve app-ads.txt route explicitly with text/plain content type
app.get('/app-ads.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.send('google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0');
});

// Serve static assets from the current directory
app.use(express.static(__dirname));

// Fallback to index.html for SPA behavior
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
