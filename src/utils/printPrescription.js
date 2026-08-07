/**
 * Utility to generate a beautifully styled, print-optimized medical prescription in a hidden iframe
 */
export function printPrescription({
  clinicName,
  doctorName,
  patientName,
  phone,
  date,
  diagnosis,
  prescription,
  doctorNotes,
}) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;

  const formattedDate = new Date(date).toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const prescriptionRows = (prescription || [])
    .map(
      (med, index) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right; color: #0f172a;">
          Rx: ${med.medication}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #475569;">
          ${med.strength || "—"}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #475569;">
          ${med.frequency || "—"}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #475569;">
          ${med.duration || "—"}
        </td>
      </tr>
    `
    )
    .join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="utf-8">
      <title>روشتة علاجية - ${patientName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap');
        body {
          font-family: 'Vazirmatn', sans-serif;
          margin: 0;
          padding: 20px;
          color: #0f172a;
          background: #ffffff;
        }
        .header {
          border-bottom: 3px double #059669;
          padding-bottom: 15px;
          margin-bottom: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .clinic-info {
          text-align: right;
        }
        .clinic-name {
          font-size: 24px;
          font-weight: bold;
          color: #059669;
          margin: 0 0 5px 0;
        }
        .doctor-name {
          font-size: 16px;
          font-weight: bold;
          margin: 0 0 5px 0;
        }
        .prescription-title {
          font-size: 22px;
          font-weight: bold;
          color: #059669;
          border: 2px solid #059669;
          padding: 5px 20px;
          border-radius: 10px;
        }
        .patient-bar {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 25px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          font-size: 13px;
        }
        .patient-bar div {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .label {
          font-weight: bold;
          color: #475569;
        }
        .section-title {
          font-size: 15px;
          font-weight: bold;
          color: #059669;
          border-right: 4px solid #059669;
          padding-right: 10px;
          margin-bottom: 12px;
          margin-top: 20px;
        }
        .diagnosis-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 15px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 25px;
        }
        .med-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 25px;
          background: #ffffff;
        }
        .med-table th {
          background-color: #f1f5f9;
          color: #334155;
          padding: 12px 10px;
          text-align: center;
          font-weight: bold;
          font-size: 13px;
          border-bottom: 2px solid #cbd5e1;
        }
        .med-table th:first-child {
          text-align: right;
        }
        .footer {
          position: fixed;
          bottom: 20px;
          left: 20px;
          right: 20px;
          border-top: 2px solid #e2e8f0;
          padding-top: 15px;
          text-align: center;
          font-size: 11px;
          color: #64748b;
          display: flex;
          justify-content: space-between;
        }
        @media print {
          body {
            padding: 0;
          }
          .footer {
            position: absolute;
            bottom: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="clinic-info">
          <h1 class="clinic-name">${clinicName || "عيادتنا الطبية"}</h1>
          <h2 class="doctor-name">${doctorName ? "د. " + doctorName : "طبيب العيادة"}</h2>
          <p style="margin: 0; font-size: 12px; color: #475569;">كارت الاستشارات الطبية والروشتات الإلكترونية</p>
        </div>
        <div class="prescription-title">Rx</div>
      </div>

      <div class="patient-bar">
        <div>
          <span class="label">اسم المريض:</span>
          <span>${patientName}</span>
        </div>
        <div>
          <span class="label">تاريخ الكشف:</span>
          <span>${formattedDate}</span>
        </div>
        <div>
          <span class="label">رقم الهاتف:</span>
          <span style="font-family: monospace;">${phone}</span>
        </div>
        <div>
          <span class="label">العيادة:</span>
          <span>نشطة</span>
        </div>
      </div>

      ${
        diagnosis
          ? `
        <div class="section-title">التشخيص الطبي</div>
        <div class="diagnosis-box">${diagnosis}</div>
      `
          : ""
      }

      ${
        prescriptionRows
          ? `
        <div class="section-title">العلاج الموصوف (Prescription)</div>
        <table class="med-table">
          <thead>
            <tr>
              <th style="text-align: right;">اسم الدواء</th>
              <th>الجرعة / التركيز</th>
              <th>التكرار</th>
              <th>المدة</th>
            </tr>
          </thead>
          <tbody>
            ${prescriptionRows}
          </tbody>
        </table>
      `
          : ""
      }

      ${
        doctorNotes
          ? `
        <div class="section-title">تعليمات وإرشادات إضافية</div>
        <div class="diagnosis-box" style="font-style: italic; border-right: 4px solid #f59e0b;">
          ${doctorNotes}
        </div>
      `
          : ""
      }

      <div class="footer">
        <div>نظام عيان الذكي لإدارة العيادات الطبية Eyan Ecosystem</div>
        <div>توقيع الدكتور: ................................</div>
      </div>

      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() {
            window.frameElement.remove();
          }, 100);
        };
      </script>
    </body>
    </html>
  `;

  doc.open();
  doc.write(htmlContent);
  doc.close();
}
