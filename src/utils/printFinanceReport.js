/**
 * Utility to generate a beautifully styled, print-optimized financial report in a hidden iframe
 */
export function printFinanceReport({
  clinicName,
  doctorName,
  dateRange,
  stats,
  t,
}) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const completedCount = stats?.completed_count || 0;
  const completedRevenue = stats?.completed_revenue || 0;
  const cancelledCount = stats?.cancelled_count || 0;
  const cancelledRevenue = stats?.cancelled_revenue || 0;
  const pendingCount = stats?.pending_count || 0;
  const pendingRevenue = stats?.pending_revenue || 0;

  const checkupCount = stats?.checkup_count || 0;
  const checkupRevenue = stats?.checkup_revenue || 0;
  const followupCount = stats?.followup_count || 0;
  const followupRevenue = stats?.followup_revenue || 0;

  const averageTicket = completedCount > 0 ? (completedRevenue / completedCount).toFixed(2) : 0;

  const transactionRows = (stats?.recent_transactions || [])
    .map(
      (tx, index) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">${tx.patient_name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace;">${tx.patient_phone}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${new Date(tx.date).toLocaleDateString("ar-EG")}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">
          ${tx.visit_type === "follow_up" ? "استشارة / إعادة" : "كشف جديد"}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">
          ${tx.status === "completed" ? "تم الكشف" : tx.status === "cancelled" ? "ملغى" : "في الانتظار"}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: left; font-weight: bold;">
          ${Number(tx.price).toLocaleString("ar-EG")} ج.م
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
      <title>التقرير المالي للعيادة - ${clinicName}</title>
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
          border-bottom: 3px double #0284c7;
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
          color: #0284c7;
          margin: 0 0 5px 0;
        }
        .doctor-name {
          font-size: 16px;
          font-weight: bold;
          margin: 0;
        }
        .report-title {
          font-size: 20px;
          font-weight: bold;
          color: #0284c7;
          border: 2px solid #0284c7;
          padding: 5px 20px;
          border-radius: 10px;
        }
        .meta-bar {
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
        .meta-item {
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
          color: #0284c7;
          border-right: 4px solid #0284c7;
          padding-right: 10px;
          margin-bottom: 15px;
          margin-top: 25px;
        }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 25px;
        }
        .kpi-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 15px;
          background: #ffffff;
        }
        .kpi-title {
          font-size: 11px;
          color: #64748b;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .kpi-val {
          font-size: 20px;
          font-weight: bold;
          color: #0f172a;
          margin-bottom: 5px;
        }
        .kpi-sub {
          font-size: 11px;
          color: #475569;
        }
        .breakdown-table, .tx-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 25px;
        }
        .breakdown-table th, .tx-table th {
          background-color: #f1f5f9;
          color: #334155;
          padding: 10px;
          font-weight: bold;
          font-size: 12px;
          border-bottom: 2px solid #cbd5e1;
        }
        .breakdown-table td, .tx-table td {
          font-size: 12px;
          color: #334155;
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
          <h1 class="clinic-name">${clinicName || "العيادة الطبية"}</h1>
          <h2 class="doctor-name">د. ${doctorName || "المعالج"}</h2>
        </div>
        <div class="report-title">تقرير الأداء المالي</div>
      </div>

      <div class="meta-bar">
        <div class="meta-item">
          <span class="label">تاريخ إصدار التقرير:</span>
          <span>${formatDate(new Date())}</span>
        </div>
        <div class="meta-item">
          <span class="label">الفترة المشمولة بالتقرير:</span>
          <span>من ${formatDate(dateRange.startDate)} إلى ${formatDate(dateRange.endDate)}</span>
        </div>
      </div>

      <div class="section-title">الملخص والمؤشرات الأساسية (KPIs)</div>
      <div class="kpi-grid">
        <div class="kpi-card" style="border-right: 4px solid #10b981;">
          <div class="kpi-title">الحجوزات المكتملة</div>
          <div class="kpi-val">${completedCount}</div>
          <div class="kpi-sub">المجموع: <strong>${completedRevenue.toLocaleString("ar-EG")} ج.م</strong></div>
        </div>
        <div class="kpi-card" style="border-right: 4px solid #ef4444;">
          <div class="kpi-title">الحجوزات الملغاة</div>
          <div class="kpi-val">${cancelledCount}</div>
          <div class="kpi-sub">الخسارة: <strong>${cancelledRevenue.toLocaleString("ar-EG")} ج.م</strong></div>
        </div>
        <div class="kpi-card" style="border-right: 4px solid #f59e0b;">
          <div class="kpi-title">الحجوزات المعلقة</div>
          <div class="kpi-val">${pendingCount}</div>
          <div class="kpi-sub">المتوقع: <strong>${pendingRevenue.toLocaleString("ar-EG")} ج.م</strong></div>
        </div>
        <div class="kpi-card" style="border-right: 4px solid #3b82f6;">
          <div class="kpi-title">متوسط دخل الكشف</div>
          <div class="kpi-val">${Number(averageTicket).toLocaleString("ar-EG")} ج.م</div>
          <div class="kpi-sub">لكل خدمة مكتملة</div>
        </div>
      </div>

      <div class="section-title">تقسيم المداخيل حسب نوع الخدمة</div>
      <table class="breakdown-table">
        <thead>
          <tr>
            <th style="text-align: right;">نوع الخدمة / الكشف</th>
            <th style="text-align: center;">عدد الحالات</th>
            <th style="text-align: left;">إجمالي القيمة</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">كشف جديد (Checkup)</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${checkupCount}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: left; font-weight: bold;">
              ${checkupRevenue.toLocaleString("ar-EG")} ج.م
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">استشارة / إعادة (Follow-up)</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${followupCount}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: left; font-weight: bold;">
              ${followupRevenue.toLocaleString("ar-EG")} ج.م
            </td>
          </tr>
        </tbody>
      </table>

      ${
        transactionRows
          ? `
        <div class="section-title">قائمة المعاملات المالية المفصلة (الأحدث)</div>
        <table class="tx-table">
          <thead>
            <tr>
              <th style="text-align: right;">اسم المريض</th>
              <th>رقم الهاتف</th>
              <th>التاريخ</th>
              <th>نوع الكشف</th>
              <th>الحالة</th>
              <th style="text-align: left;">قيمة الكشف</th>
            </tr>
          </thead>
          <tbody>
            ${transactionRows}
          </tbody>
        </table>
      `
          : ""
      }

      <div class="footer">
        <div>توقيع الدكتور المسؤول: ...................................</div>
        <div>نظام عيان لإدارة العيادات الذكية Eyan Medical System</div>
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
