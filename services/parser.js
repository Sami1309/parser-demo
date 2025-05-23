import fs from 'fs';
import pdfParse from 'pdf-parse';
import { PDFDocument } from 'pdf-lib';   // lets us grab AcroForm values if present

export async function extractText(meta) {
  const out = [];

  for (const file of meta) {
    const bytes = fs.readFileSync(file.tmpPath);

    if (file.mime === 'application/pdf') {
      /* ---------- 1) Try AcroForm fields first ---------- */
      try {
        const pdfDoc = await PDFDocument.load(bytes);
        const form   = pdfDoc.getForm();
        const fields = form.getFields();

        if (fields.length) {
          const kv = fields.map(f => `${f.getName()}: ${f.getText()}`).join('\n');
          out.push(kv);
          continue;   // skip raw text step – we got values
        }
      } catch { /* no form / not parseable – fall through */ }

      /* ---------- 2) Raw PDF text ---------- */
      const { text } = await pdfParse(bytes);
      out.push(text.trim());
    } else {
      /* ---------- 3) Non-PDF – naïve fallback ---------- */
      out.push(bytes.toString('utf8'));
    }
  }

  return out;
}
