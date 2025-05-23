import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import parseRouter from './routes/parse.js';
…

import uploadRouter   from './routes/upload.js';
import generateRouter from './routes/generate.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json({ limit: '20mb' }));
app.use('/api/upload',   uploadRouter);
app.use('/api/parse', parseRouter);

app.use('/api/generate', generateRouter);
app.use(express.static(join(__dirname, 'public')));

app.listen(PORT, () => console.log(`⇢ http://localhost:${PORT}`));
