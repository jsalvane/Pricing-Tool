/**
 * Opens a print-ready quote in a new window.
 * Uses plain HTML + inline CSS so no framework dependency is needed.
 */
export function generateQuote(lineItems, { customerName = '', notes = '' } = {}) {
  const total = lineItems.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0)
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const quoteNum = `Q-${Date.now().toString(36).toUpperCase()}`

  const rows = lineItems.map(item => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e5ea;font-family:monospace;font-size:12px;">${item.code || '—'}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e5ea;font-size:13px;">${item.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e5ea;text-align:center;font-size:13px;">${item.qty}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e5ea;text-align:right;font-size:13px;">$${(item.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e5ea;text-align:right;font-size:13px;font-weight:600;">$${((item.price || 0) * (item.qty || 1)).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e5ea;text-align:right;font-size:12px;color:#6e6e73;">${item.leadTime != null ? `${item.leadTime}d` : '—'}</td>
    </tr>
  `).join('')

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Quote ${quoteNum}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', system-ui, sans-serif; color: #1c1c1e; padding: 40px; max-width: 900px; margin: 0 auto; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <!-- Print button -->
  <div class="no-print" style="margin-bottom:24px;display:flex;gap:8px;">
    <button onclick="window.print()" style="padding:10px 20px;background:#c8102e;color:white;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;">Print / Save PDF</button>
    <button onclick="window.close()" style="padding:10px 20px;background:#f2f2f7;color:#1c1c1e;border:1px solid rgba(0,0,0,0.1);border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;">Close</button>
  </div>

  <!-- Header -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:20px;border-bottom:2px solid #c8102e;">
    <div>
      <h1 style="font-size:24px;font-weight:700;letter-spacing:-0.02em;">A.W. Chesterton Company</h1>
      <p style="font-size:13px;color:#6e6e73;margin-top:4px;">Mechanical Seals — Price Quote</p>
    </div>
    <div style="text-align:right;">
      <p style="font-size:12px;color:#6e6e73;">Quote #</p>
      <p style="font-size:14px;font-weight:600;">${quoteNum}</p>
      <p style="font-size:12px;color:#6e6e73;margin-top:4px;">${date}</p>
    </div>
  </div>

  ${customerName ? `
  <div style="margin-bottom:24px;">
    <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#6e6e73;margin-bottom:4px;">Prepared For</p>
    <p style="font-size:14px;font-weight:500;">${customerName}</p>
  </div>` : ''}

  <!-- Line items -->
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
    <thead>
      <tr style="background:#f2f2f7;">
        <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#6e6e73;border-bottom:1px solid #e5e5ea;">Item #</th>
        <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#6e6e73;border-bottom:1px solid #e5e5ea;">Description</th>
        <th style="padding:10px 12px;text-align:center;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#6e6e73;border-bottom:1px solid #e5e5ea;">Qty</th>
        <th style="padding:10px 12px;text-align:right;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#6e6e73;border-bottom:1px solid #e5e5ea;">Unit Price</th>
        <th style="padding:10px 12px;text-align:right;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#6e6e73;border-bottom:1px solid #e5e5ea;">Line Total</th>
        <th style="padding:10px 12px;text-align:right;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#6e6e73;border-bottom:1px solid #e5e5ea;">Lead Time</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <!-- Totals -->
  <div style="display:flex;justify-content:flex-end;margin-bottom:32px;">
    <div style="width:260px;">
      <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px;color:#6e6e73;">
        <span>Subtotal</span>
        <span>$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px;color:#6e6e73;border-bottom:1px solid #e5e5ea;">
        <span>Discount</span>
        <span>—</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:12px 0;font-size:18px;font-weight:700;">
        <span>Total</span>
        <span>$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  </div>

  ${notes ? `
  <div style="margin-bottom:32px;">
    <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#6e6e73;margin-bottom:6px;">Notes</p>
    <p style="font-size:13px;color:#1c1c1e;white-space:pre-wrap;">${notes}</p>
  </div>` : ''}

  <!-- Terms -->
  <div style="padding-top:20px;border-top:1px solid #e5e5ea;">
    <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#6e6e73;margin-bottom:8px;">Terms & Conditions</p>
    <p style="font-size:11px;color:#6e6e73;line-height:1.6;">
      All prices are in USD and represent U.S. List Price. Prices are subject to change without notice.
      Applicable discounts, surcharges, or freight charges are not reflected in this document.
      Please verify current pricing with your Chesterton representative prior to placing an order.
    </p>
    <p style="font-size:11px;color:#aeaeb2;margin-top:12px;">&copy; A.W. Chesterton Company. All rights reserved.</p>
  </div>
</body>
</html>`

  const win = window.open('', '_blank')
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}
