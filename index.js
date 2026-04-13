const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html for root or other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export the Express API for Vercel
module.exports = app;

// If we are not running on Vercel, start the server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
