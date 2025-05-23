import { Router } from 'express';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import path from 'path';
import fs from 'fs';

const upload = multer({ dest: 'uploads/' });
const router = Router();

/*  POST /api/upload
 *  returns: [{id, originalName, mime, size}]
 */
router.post('/', upload.array('files'), (req, res) => {
  const meta = req.files.map(f => ({
    id: uuid(),                         // returned to front-end
    tmpPath: f.path,                    // saved for later
    originalName: f.originalname,
    mime: f.mimetype,
    size: f.size
  }));

  // Store meta-data so /api/generate can find the files again.
  fs.writeFileSync(
    path.join('uploads', `${req.body.sessionId}.json`),
    JSON.stringify(meta, null, 2)
  );

  res.json(meta);
});

export default router;
