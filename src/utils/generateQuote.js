/**
 * Opens a print-ready quote in a new window.
 * Uses plain HTML + inline CSS so no framework dependency is needed.
 */

const FACE_LABELS = {
  'CR/CB': 'Carbon vs. Ceramic',
  'CR/CR': 'Carbon vs. Carbon',
  'CR/SIC': 'Carbon vs. Silicon Carbide',
  'CR/TC': 'Carbon vs. Tungsten Carbide',
  'SIC/SIC': 'Silicon Carbide vs. Silicon Carbide',
  'TC/TC': 'Tungsten Carbide vs. Tungsten Carbide',
  'SIC/TC': 'Silicon Carbide vs. Tungsten Carbide',
}

const ELASTOMER_LABELS = {
  'EP': 'EPDM',
  'FEPM': 'Aflas\u00ae (FEPM)',
  'FKM': 'Viton\u00ae (FKM)',
  'PTFE': 'PTFE',
  'BN': 'Buna-N (Nitrile)',
  'CR': 'Neoprene',
  'FFKM': 'Kalrez\u00ae (FFKM)',
}

const TYPE_LABELS = {
  'SA': 'Seal Assembly',
  'SPK': 'Spare Parts Kit',
}

function parseDescription(desc) {
  if (!desc) return null
  const parts = desc.split(/\s+/)
  if (parts.length < 4) return null
  const model = parts[0]
  const size = parts[1]
  const type = parts[2]
  const faceIdx = parts.findIndex(p => p.includes('/'))
  const face = faceIdx >= 0 ? parts[faceIdx] : null
  const elastomer = parts[parts.length - 1]
  return { model, size, type, face, elastomer }
}

export function generateQuote(lineItems, { customerName = '', notes = '' } = {}) {
  const total = lineItems.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0)
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const validUntil = new Date(Date.now() + 30 * 86400000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const quoteNum = `Q-${Date.now().toString(36).toUpperCase()}`

  const rows = lineItems.map((item, idx) => {
    const parsed = parseDescription(item.name)
    const faceLabel = parsed?.face ? (FACE_LABELS[parsed.face] || parsed.face) : null
    const elastLabel = parsed?.elastomer ? (ELASTOMER_LABELS[parsed.elastomer] || parsed.elastomer) : null
    const typeLabel = item.type ? (TYPE_LABELS[item.type] || item.type) : null

    return `
    <tr style="${idx % 2 === 0 ? '' : 'background:rgba(0,0,0,0.015);'}">
      <td style="padding:14px 16px;border-bottom:1px solid #e8e8ed;font-family:'SF Mono','Fira Code',monospace;font-size:11px;color:#48484a;vertical-align:top;">${item.code || '—'}</td>
      <td style="padding:14px 16px;border-bottom:1px solid #e8e8ed;font-size:13px;vertical-align:top;">
        <div style="font-weight:600;color:#1c1c1e;margin-bottom:4px;">${parsed ? `Chesterton ${parsed.model} Mechanical Seal` : item.name}${typeLabel ? ` <span style="display:inline-block;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding:2px 6px;border-radius:4px;vertical-align:middle;margin-left:6px;${item.type === 'SA' ? 'background:#c8102e;color:white;' : 'background:#e8e8ed;color:#48484a;'}">${typeLabel}</span>` : ''}</div>
        <div style="font-size:11px;color:#8e8e93;font-family:'SF Mono','Fira Code',monospace;margin-bottom:4px;">${item.name}</div>
        ${parsed ? `<div style="font-size:11px;color:#6e6e73;line-height:1.7;">
          <span style="display:inline-block;margin-right:14px;"><strong style="color:#48484a;">Size:</strong> ${parsed.size}"</span>
          ${faceLabel ? `<span style="display:inline-block;margin-right:14px;"><strong style="color:#48484a;">Faces:</strong> ${faceLabel}</span>` : ''}
          ${elastLabel ? `<span style="display:inline-block;"><strong style="color:#48484a;">Elastomer:</strong> ${elastLabel}</span>` : ''}
        </div>` : ''}
        ${item.note ? `<div style="font-size:11px;color:#8e8e93;margin-top:6px;font-style:italic;padding-left:8px;border-left:2px solid #e5e5ea;">${item.note}</div>` : ''}
      </td>
      <td style="padding:14px 16px;border-bottom:1px solid #e8e8ed;text-align:center;font-size:13px;font-weight:500;vertical-align:top;">${item.qty}</td>
      <td style="padding:14px 16px;border-bottom:1px solid #e8e8ed;text-align:right;font-size:13px;vertical-align:top;color:#48484a;">$${(item.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
      <td style="padding:14px 16px;border-bottom:1px solid #e8e8ed;text-align:right;font-size:13px;font-weight:600;vertical-align:top;">$${((item.price || 0) * (item.qty || 1)).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
      <td style="padding:14px 16px;border-bottom:1px solid #e8e8ed;text-align:center;font-size:11px;color:#6e6e73;vertical-align:top;">${item.leadTime != null ? `${item.leadTime} days` : '—'}</td>
    </tr>
  `}).join('')

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Chesterton Quote ${quoteNum}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', system-ui, sans-serif; color: #1c1c1e; padding: 48px; max-width: 960px; margin: 0 auto; -webkit-font-smoothing: antialiased; }
    @media print {
      body { padding: 24px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <!-- Print button -->
  <div class="no-print" style="margin-bottom:28px;display:flex;gap:8px;">
    <button onclick="window.print()" style="padding:10px 24px;background:#c8102e;color:white;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;letter-spacing:0.01em;">Print / Save PDF</button>
    <button onclick="window.close()" style="padding:10px 20px;background:#f2f2f7;color:#1c1c1e;border:1px solid rgba(0,0,0,0.1);border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;">Close</button>
  </div>

  <!-- Header -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px;padding-bottom:24px;border-bottom:3px solid #c8102e;">
    <div>
      <img src="/logo.png" alt="A.W. Chesterton Company" style="height:40px;margin-bottom:10px;" onerror="this.style.display='none'"/>
      <h1 style="font-size:22px;font-weight:800;letter-spacing:-0.03em;color:#1c1c1e;">A.W. Chesterton Company</h1>
      <p style="font-size:12px;color:#8e8e93;margin-top:4px;letter-spacing:0.02em;">Mechanical Seals — Price Quote</p>
    </div>
    <div style="text-align:right;">
      <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;color:#8e8e93;">Quote Number</p>
      <p style="font-size:16px;font-weight:700;letter-spacing:-0.01em;margin-top:2px;">${quoteNum}</p>
      <p style="font-size:12px;color:#6e6e73;margin-top:8px;">${date}</p>
      <p style="font-size:10px;color:#8e8e93;margin-top:2px;">Valid through ${validUntil}</p>
    </div>
  </div>

  ${customerName ? `
  <div style="margin-bottom:28px;padding:16px 20px;background:#fafafa;border-radius:10px;border:1px solid #e8e8ed;">
    <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;color:#8e8e93;margin-bottom:6px;">Prepared For</p>
    <p style="font-size:15px;font-weight:600;color:#1c1c1e;">${customerName}</p>
  </div>` : ''}

  <!-- Line items -->
  <div style="margin-bottom:28px;">
    <table style="width:100%;border-collapse:collapse;border:1px solid #e8e8ed;border-radius:8px;">
      <thead>
        <tr style="background:#1c1c1e;">
          <th style="padding:12px 16px;text-align:left;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.6);">Item #</th>
          <th style="padding:12px 16px;text-align:left;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.6);">Product Specification</th>
          <th style="padding:12px 16px;text-align:center;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.6);">Qty</th>
          <th style="padding:12px 16px;text-align:right;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.6);">Unit Price</th>
          <th style="padding:12px 16px;text-align:right;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.6);">Line Total</th>
          <th style="padding:12px 16px;text-align:center;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.6);">Lead Time</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>

  <!-- Totals -->
  <div style="display:flex;justify-content:flex-end;margin-bottom:36px;">
    <div style="width:280px;background:#fafafa;border-radius:10px;padding:16px 20px;border:1px solid #e8e8ed;">
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#6e6e73;">
        <span>Subtotal</span>
        <span>$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#6e6e73;border-bottom:1px solid #e5e5ea;">
        <span>Discount</span>
        <span>—</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:12px 0 4px;font-size:20px;font-weight:800;letter-spacing:-0.02em;">
        <span>Total</span>
        <span style="color:#c8102e;">$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  </div>

  ${notes ? `
  <div style="margin-bottom:32px;padding:16px 20px;background:#fffbf5;border-radius:10px;border:1px solid #f0e6d4;">
    <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;color:#8e8e93;margin-bottom:8px;">Notes</p>
    <p style="font-size:13px;color:#1c1c1e;white-space:pre-wrap;line-height:1.6;">${notes}</p>
  </div>` : ''}

  <!-- Engineering Excellence -->
  <div style="margin-bottom:32px;padding:20px 24px;background:#1c1c1e;border-radius:10px;color:white;">
    <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.14em;color:rgba(255,255,255,0.4);margin-bottom:12px;">Why Chesterton</p>
    <div style="display:flex;gap:24px;flex-wrap:wrap;">
      <div style="flex:1;min-width:180px;">
        <p style="font-size:13px;font-weight:600;margin-bottom:4px;color:rgba(255,255,255,0.9);">Precision Engineered</p>
        <p style="font-size:11px;color:rgba(255,255,255,0.5);line-height:1.5;">Every seal is manufactured to exacting tolerances with advanced materials selected for your specific application.</p>
      </div>
      <div style="flex:1;min-width:180px;">
        <p style="font-size:13px;font-weight:600;margin-bottom:4px;color:rgba(255,255,255,0.9);">Application Expertise</p>
        <p style="font-size:11px;color:rgba(255,255,255,0.5);line-height:1.5;">Backed by 140+ years of fluid sealing knowledge and dedicated technical support for your operations.</p>
      </div>
      <div style="flex:1;min-width:180px;">
        <p style="font-size:13px;font-weight:600;margin-bottom:4px;color:rgba(255,255,255,0.9);">Total Cost of Ownership</p>
        <p style="font-size:11px;color:rgba(255,255,255,0.5);line-height:1.5;">Engineered for extended service life, reducing downtime and maintenance costs across your rotating equipment.</p>
      </div>
    </div>
  </div>

  <!-- Terms -->
  <div style="padding-top:24px;border-top:1px solid #e5e5ea;">
    <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;color:#8e8e93;margin-bottom:10px;">Terms & Conditions</p>
    <p style="font-size:11px;color:#8e8e93;line-height:1.7;">
      All prices are in USD and represent U.S. List Price. Prices are subject to change without notice.
      Applicable discounts, surcharges, or freight charges are not reflected in this document.
      Please verify current pricing with your Chesterton representative prior to placing an order.
      This quotation is valid for 30 days from the date of issue.
    </p>
    <div style="margin-top:16px;padding-top:16px;border-top:1px solid #f0f0f5;display:flex;justify-content:space-between;align-items:center;">
      <p style="font-size:10px;color:#aeaeb2;">&copy; A.W. Chesterton Company. All rights reserved.</p>
      <p style="font-size:10px;color:#aeaeb2;">860 Salem Street, Groveland, MA 01834</p>
    </div>
  </div>
</body>
</html>`

  const win = window.open('', '_blank')
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}
