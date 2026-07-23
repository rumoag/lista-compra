// Vista de QR (US-5.3, BR-19) — genera el QR client-side a partir de la URL del household.
import QRCode from 'https://esm.sh/qrcode@1.5.4';

export async function renderQrView(container, { householdId }) {
  const url = `${window.location.origin}/${householdId}`;

  container.innerHTML = `
    <div class="card" data-testid="qr-view">
      <p>Escanea este código (o pégalo en la nevera) para acceder a esta lista:</p>
      <div data-testid="qr-view-image-container"></div>
      <p class="meta" data-testid="qr-view-url">${escapeHtml(url)}</p>
    </div>
  `;

  const imageContainer = container.querySelector('[data-testid="qr-view-image-container"]');

  try {
    const dataUrl = await QRCode.toDataURL(url, { margin: 1, width: 220 });
    const img = document.createElement('img');
    img.src = dataUrl;
    img.alt = 'Código QR de la lista';
    img.dataset.testid = 'qr-view-image';
    imageContainer.appendChild(img);
  } catch (err) {
    imageContainer.innerHTML =
      '<p class="error-message" data-testid="qr-view-error">No se pudo generar el código QR.</p>';
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
