/* global fetch, crypto */
const dropZone    = document.getElementById('dropZone');
const fileInput   = document.getElementById('fileInput');
const fileListEl  = document.getElementById('fileList');
const generateBtn = document.getElementById('generateBtn');
const downloadLink = document.getElementById('downloadLink');
const resultBox   = document.getElementById('result');

const sessionId = crypto.randomUUID();
let uploaded = [];

function renderList() {
  fileListEl.innerHTML = '';
  uploaded.forEach(f => {
    const li = document.createElement('li');
    li.className = 'document-item';
    li.textContent = `${f.originalName}  –  ${(f.size/1024).toFixed(1)} KB ✓`;
    fileListEl.appendChild(li);
  });
  generateBtn.disabled = uploaded.length === 0;
}

async function uploadFiles(files) {
  const body = new FormData();
  [...files].forEach(f => body.append('files', f));
  body.append('sessionId', sessionId);

  const res = await fetch('/api/upload', { method: 'POST', body });
  const meta = await res.json();
  uploaded = uploaded.concat(meta);
  renderList();
}

/* Drag-drop & click */
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', e => uploadFiles(e.target.files));
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('active'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('active'));
dropZone.addEventListener('drop', e => {
  e.preventDefault(); dropZone.classList.remove('active');
  uploadFiles(e.dataTransfer.files);
});

/* Generate PDF */
generateBtn.addEventListener('click', async () => {
  generateBtn.disabled = true; generateBtn.textContent = 'Working…';
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ sessionId })
  });
  const { downloadUrl } = await res.json();
  downloadLink.href = downloadUrl;
  resultBox.hidden = false;
  generateBtn.textContent = 'Generate PDF';
});
