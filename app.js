console.log('PULS G Proxy active ⚡️')
// app.js
const express = require('express');
const app = express();

// головний маршрут
app.get('/', (req, res) => {
  res.send('PULS G Proxy is active ⚡️');
});

// Render надає порт через змінну середовища PORT
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
