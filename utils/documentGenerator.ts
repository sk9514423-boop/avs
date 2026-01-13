
import { Order } from '../types';

export const commonCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
  body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background: #fff; color: #000; }
  .label-thermal { width: 100mm; min-height: 150mm; padding: 0; border: 1px solid #000; display: flex; flex-direction: column; }
  .l-row { display: flex; width: 100%; border-bottom: 1px solid #000; }
  .l-col { padding: 8px; flex: 1; border-right: 1px solid #000; }
  .l-col:last-child { border-right: 0; }
  .b-text { font-weight: 900; text-transform: uppercase; }
  .text-xs { font-size: 7pt; }
  .text-sm { font-size: 9pt; }
  .text-lg { font-size: 11pt; }
  .text-xl { font-size: 14pt; }
  .barcode-box { text-align: center; padding: 10px 0; border-bottom: 1px solid #000; }
  .barcode-img { width: 90%; height: 50px; object-fit: contain; }
  .cod-banner { background: #000; color: #fff; padding: 5px; text-align: center; font-size: 18pt; font-weight: 900; }
  @media print { .label-thermal { margin: 0; } }
`;

// Updated to accept settings, logo, and layout
export const generateGridLayoutHtml = (order: Order, settings?: any, logo?: string | null, layout?: string): string => {
  const isCod = order.payment.method === 'COD';
  const fin = order.financials || { declaredValue: 0, shippingCharge: 0, insuranceCharge: 0, totalPayable: 0 };

  return `
    <div class="label-thermal">
      ${logo ? `<div style="text-align:center; padding: 5px;"><img src="${logo}" style="max-height:30px;"/></div>` : ''}
      ${isCod ? `<div class="cod-banner">COD: ₹ ${fin.declaredValue}</div>` : `<div class="cod-banner" style="background:#eee; color:#000;">PREPAID</div>`}
      
      <div class="l-row">
        <div class="l-col" style="flex: 1.5;">
          <div class="text-xs b-text" style="color: #666;">Deliver To:</div>
          <div class="text-lg b-text">${order.shipping.name}</div>
          <div class="text-sm">${order.shipping.address}</div>
          <div class="text-sm b-text">PIN: ${order.shipping.zip}</div>
          <div class="text-sm b-text">Phone: ${order.shipping.phone}</div>
        </div>
        <div class="l-col">
          <div class="text-xs b-text" style="color: #666;">Order ID:</div>
          <div class="text-sm b-text">${order.id}</div>
          <div class="text-xs b-text" style="margin-top:10px;">Date:</div>
          <div class="text-sm">${order.date.split('|')[0]}</div>
        </div>
      </div>

      <div class="barcode-box">
        <img src="${order.barcodeUrl}" class="barcode-img" />
        <div class="text-lg b-text">AWB: ${order.awb}</div>
      </div>

      <div class="l-row">
        <div class="l-col">
          <div class="text-xs b-text" style="color: #666;">Carrier:</div>
          <div class="text-lg b-text">${order.courier || 'VAS EXPRESS'}</div>
        </div>
        <div class="l-col">
          <div class="text-xs b-text" style="color: #666;">Weight:</div>
          <div class="text-lg b-text">${order.package.deadWt}</div>
        </div>
      </div>

      <div class="l-row" style="background: #f9f9f9;">
        <div class="l-col">
          <div class="text-xs b-text">Value</div>
          <div class="text-sm b-text">₹ ${fin.declaredValue}</div>
        </div>
        <div class="l-col">
          <div class="text-xs b-text">Shipping</div>
          <div class="text-sm b-text">₹ ${fin.shippingCharge}</div>
        </div>
        ${fin.insuranceCharge > 0 ? `
        <div class="l-col">
          <div class="text-xs b-text">Insurance</div>
          <div class="text-sm b-text">₹ ${fin.insuranceCharge}</div>
        </div>
        ` : ''}
      </div>

      <div class="l-row" style="margin-top: auto; border-top: 1px solid #000;">
        <div class="l-col" style="flex: 2;">
          <div class="text-xs b-text" style="color: #666;">Shipped By:</div>
          <div class="text-sm b-text">VAS LOGISTICS HUB</div>
          <div class="text-xs">Sector 12, New Delhi, 110018</div>
        </div>
        <div class="l-col" style="background: #000; color: #fff; text-align: center; display: flex; align-items: center; justify-content: center;">
          <div>
            <div class="text-xs b-text">TOTAL</div>
            <div class="text-xl b-text">₹ ${fin.totalPayable}</div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Updated to accept multiple arguments as called in components
export const printLabel = (order: Order, settings?: any, logo?: string | null) => {
  const html = generateGridLayoutHtml(order, settings, logo);
  const win = window.open('', '_blank', 'width=450,height=800');
  if (win) {
    win.document.write(`<html><head><style>${commonCSS}</style></head><body><div style="display:flex; justify-content:center; padding:10px;">${html}</div></body></html>`);
    win.document.close();
    win.onload = () => { win.print(); win.close(); };
  }
};

export const printInvoice = (order: Order, settings?: any, logo?: string | null) => {
  const html = generateInvoiceHtml(order, settings, logo);
  const win = window.open('', '_blank', 'width=800,height=1000');
  if (win) {
    win.document.write(`<html><head><style>${commonCSS}</style></head><body>${html}</body></html>`);
    win.document.close();
    win.onload = () => { win.print(); win.close(); };
  }
};

export const printBulkInvoices = (orders: Order[], settings?: any, logo?: string | null) => {
  const html = orders.map(o => generateInvoiceHtml(o, settings, logo)).join('<div style="page-break-after: always;"></div>');
  const win = window.open('', '_blank', 'width=800,height=1000');
  if (win) {
    win.document.write(`<html><head><style>${commonCSS}</style></head><body>${html}</body></html>`);
    win.document.close();
    win.onload = () => { win.print(); win.close(); };
  }
};

export const printInsuranceLabel = (order: Order, logo?: string | null) => {
  const html = generateInsuranceLabelHtml(order, logo);
  const win = window.open('', '_blank', 'width=600,height=800');
  if (win) {
    win.document.write(`<html><head><style>${commonCSS}</style></head><body>${html}</body></html>`);
    win.document.close();
    win.onload = () => { win.print(); win.close(); };
  }
};

export const printLabelsGrid = (orders: Order[], perPage: number, settings?: any, logo?: string | null) => {
  const html = orders.map(o => generateGridLayoutHtml(o, settings, logo)).join('<div style="margin-bottom: 20px;"></div>');
  const win = window.open('', '_blank', 'width=600,height=800');
  if (win) {
    win.document.write(`<html><head><style>${commonCSS}</style></head><body>${html}</body></html>`);
    win.document.close();
    win.onload = () => { win.print(); win.close(); };
  }
};

export const printManifest = (orders: Order[]) => {
  // Simple manifest print stub
  const html = `<h1>Manifest</h1><p>Orders: ${orders.length}</p>`;
  const win = window.open('', '_blank', 'width=800,height=600');
  if (win) {
    win.document.write(`<html><head><style>${commonCSS}</style></head><body>${html}</body></html>`);
    win.document.close();
    win.onload = () => { win.print(); win.close(); };
  }
};

export const printReceipt = (data: any) => {
  const html = `<h1>Receipt</h1><pre>${JSON.stringify(data, null, 2)}</pre>`;
  const win = window.open('', '_blank', 'width=400,height=600');
  if (win) {
    win.document.write(`<html><head><style>${commonCSS}</style></head><body>${html}</body></html>`);
    win.document.close();
    win.onload = () => { win.print(); win.close(); };
  }
};

export const downloadMonthlyReport = (type: 'pdf' | 'excel', month: string, year: string) => {
  console.log(`Downloading ${type} report for ${month} ${year}`);
};

export const generateInvoiceHtml = (order: Order, settings?: any, logo?: string | null, signature?: string | null, options?: any): string => {
  return `<div style="padding: 40px; border: 1px solid #ccc;">
    <h2>${options?.title || 'TAX INVOICE'}</h2>
    <p>Order ID: ${order.id}</p>
    <p>Customer: ${order.shipping.name}</p>
    <p>Value: ${order.payment.invoice}</p>
  </div>`;
};

export const generateInsuranceLabelHtml = (order: Order, logo?: string | null): string => {
  return `<div style="padding: 20px; border: 2px solid blue; border-radius: 10px;">
    <h3>INSURANCE PROTECTION</h3>
    <p>Order: ${order.id}</p>
    <p>Status: Protected</p>
  </div>`;
};
