import { formatMoney } from './formatters.jsx';

// Helper function to format date as dd/mm/yyyy hh:mm AM/PM
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = String(hours).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hoursStr}:${minutes} ${ampm}`;
};

// Helper function to generate HTML string for printing Silver Invoice
export const generatePrintHTML = (invoiceData) => {
  if (!invoiceData) return '';

  const formattedDateTime = invoiceData.created_date 
    ? formatDateTime(invoiceData.created_date)
    : formatDateTime(new Date().toISOString());

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Print Silver Invoice</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            @page { size: A5 portrait; margin: 10mm; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 10px; margin-top: 0.5cm; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 10px; text-align: center; }
            td { border: 1px solid #000; padding: 4px; font-size: 12px; font-weight: bold; vertical-align: middle; }
            .header-row { background-color: #ABABAB; }
            .policy-text, .policy-text-ar { font-size: 9px; line-height: 1.3; padding: 8px; }
            .policy-text { text-align: left; }
            .policy-text-ar { text-align: right; }
            .footer-text { font-size: 8px; text-align: left; padding: 5px; border: none; }
            .spacer { height: 60px; }
        </style>
    </head>
    <body>
        <table style="width: 525px;">
            ${invoiceData.serial_no ? `
            <tr>
                <td>Certificate No. <br> رقم الشهادة</td>
                <td>${invoiceData.serial_no}</td>
            </tr>
            ` : ''}

            <tr>
                <td>Invoice No. <br> رقم الفاتورة</td>
                <td>${invoiceData.invoice_no || ''}</td>
                <td>Date <br> التاريخ</td>
                <td>${formattedDateTime}</td>
            </tr>
            <tr>
                <td>Name<br>الإسم</td>
                <td>${invoiceData.customer_name || ''}</td>
                <td>Phone No.<br>رقم العميل</td>
                <td>${invoiceData.customer_phone || ''}</td>
            </tr>
        </table>

        <table style="width: 525px;">
            <tr class="header-row">
                <td>Type<br>النوع</td>
                <td>Material<br>الخامه</td>
                <td>Karat<br>العيار</td>
                <td>W/Gram<br>وزن/ جرام</td>
                <td>Quantity<br>الكمية</td>
                <td>Unit Price<br>سعر الوحدة</td>
                <td>Total<br>الإجمالي</td>
            </tr>
            ${invoiceData.items.map(item => `
            <tr>
                <td>${item.item_name}</td>
                <td>Silver/فضة</td>
                <td>${item.item_karat || ''}K</td>
                <td>${item.item_weight || ''}</td>
                <td>${item.item_quantity || ''}</td>
                <td>${formatMoney(item.item_price || 0)}</td>
                <td>${formatMoney(item.item_total_price || 0)}</td>
            </tr>
            `).join('')}
            <tr class="header-row">
                <td colspan="6">Total/Egyptian Pound<br>الإجمالي /جنيه مصري</td>
                <td>${formatMoney(invoiceData.total_price || 0)}</td>
            </tr>
        </table>

        <div class="spacer"></div>

        <table style="width: 525px;">
            <tr>
                <td class="policy-text">
                    <u>Silver Buy Back Policy by BTC</u><br>
                    The value of the stamp and part of workmanship shall be refunded per gram as follow:<br>
                    - Coin 2 gram: 2 EGP<br>
                    - Ingot 5 - 10 - 20 - 31.1 - 50 - 100 GR: 2 EGP -<br>
                      (116.65 GR) TT BAR : 1 EGP<br>
                    - Cast Bars 250 - 500 - 1000 gram: 0.25 EGP<br>
                    * The product must be returned with the same approved packaging.<br>
                </td>
                <td class="policy-text-ar">
                    <u>سياسة اعادة شراء الفضة من قبل بي تي سي</u><br>
                    فى حالة رغبة العميل اعادة بيع المنتج المذكور يستحق رد قيمة الدمغة بالإضافة الى استرداد جزء من قيمة المصنعية لكل جرام كما يلى:<br>
                    جنيه 8 جرام : 2 جنيه<br>
                    السبيكه 5 - 10 - 20 - 31.1 - 50 - 100 جرام: 2,5 جنيه<br>
                    التولة(116.65 جرام) : 1 جنيه<br>
                    كيلوبار 250 - 500 - 1000 جرام : 0.25 جنيه<br>
                    .يجب أن يكون المنتج معاد بنفس الغلاف المعتمد*<br>
                </td>
            </tr>
        </table>

        <table style="width: 520px;">
            <tr>
                <td class="footer-text">
                    Hussein Branch: 8 Zokak Al Fadel, Al Mashhad ElHussieny, Al Gamallya, Cairo
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;www.BTC-egyptgold.com&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15057
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
};

// Function to print invoice using hidden iframe
export const printInvoice = (invoiceData) => {
  const htmlContent = generatePrintHTML(invoiceData);
  
  // Remove any existing print iframes
  const existingIframe = document.getElementById('print-iframe');
  if (existingIframe) {
    existingIframe.remove();
  }
  
  // Create a hidden iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'print-iframe';
  iframe.style.position = 'absolute';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  iframe.style.visibility = 'hidden';
  
  document.body.appendChild(iframe);
  
  // Write content to iframe
  const iframeDoc = iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(htmlContent);
  iframeDoc.close();
  
  // Wait for content to load then print
  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      
      // Clean up after printing
      setTimeout(() => {
        iframe.remove();
      }, 1000);
    }, 100);
  };
};