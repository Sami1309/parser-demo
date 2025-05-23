import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export async function buildPDF(data, outPath) {
  // Load a blank template or carrier-specific base PDF
  const templateBytes = fs.readFileSync('templates/commercial_property_blank.pdf');
  const pdfDoc = await PDFDocument.load(templateBytes);
  pdfDoc.registerFontkit(fontkit);

  const form = pdfDoc.getForm();

  /* Example mappings: adapt for real carrier form fields */
  form.getTextField('InsuredName').setText(data.business_info.legal_name);
  form.getTextField('Address').setText(data.property_info.address);
  form.getTextField('BuildingLimit').setText(`${data.coverage_requirements.building}`);
  // ...repeat for other fields...

  form.flatten();                        // lock the fields
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outPath, pdfBytes);
}
