// routes/parse.js
import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { extractText } from '../services/parser.js';
import { sendToLLM }  from '../services/llm.js';

const router = Router();

/* POST /api/parse
 * body: { sessionId }
 * returns: { extracted } – JSON from LLM
 */
router.post('/', async (req, res, next) => {
  try {
    const session = req.body.sessionId;
    const meta = JSON.parse(
      fs.readFileSync(path.join('uploads', `${session}.json`))
    );

    const texts = await extractText(meta);
    const extracted = await sendToLLM(texts);   // returns structured JSON
    res.json({ extracted });
  } catch (e) { next(e); }
});

export default router;
