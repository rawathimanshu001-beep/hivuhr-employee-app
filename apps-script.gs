/**
 * PayHR — Google Apps Script
 * ===========================
 * This runs inside your Google Sheet and receives
 * data from the employee app automatically.
 *
 * SETUP STEPS:
 * 1. Open your Attendance Google Sheet
 * 2. Click Extensions → Apps Script
 * 3. Delete all existing code
 * 4. Paste this entire file
 * 5. Click Save (floppy disk icon)
 * 6. Click Deploy → New deployment
 * 7. Type: Select type → Web app
 * 8. Execute as: Me
 * 9. Who has access: Anyone
 * 10. Click Deploy → Copy the URL
 * 11. Paste that URL into config.js → sheetsWebAppUrl
 */

// ── YOUR SHEET NAMES ─────────────────────────────────────────
// These must match the tab names in your Google Sheet exactly
const SHEET_ATTENDANCE  = "Attendance Log";
const SHEET_LEAVE       = "Leave Requests";
const SHEET_VIOLATIONS  = "Geofence Violations";

// ── MAIN HANDLER ─────────────────────────────────────────────
// This runs every time the employee app sends data
function doGet(e) {
  try {
    const params = e.parameter;
    const action = params.action;

    if (action === "clockIn" || action === "clockOut") {
      return handleAttendance(params);
    } else if (action === "leaveRequest") {
      return handleLeave(params);
    } else if (action === "violation") {
      return handleViolation(params);
    } else {
      return ok("PayHR API running");
    }
  } catch (err) {
    return ok("Error: " + err.message);
  }
}

// ── CLOCK IN / CLOCK OUT ─────────────────────────────────────
function handleAttendance(p) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let sheet   = ss.getSheetByName(SHEET_ATTENDANCE);

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_ATTENDANCE);
    // Add headers
    sheet.appendRow([
      "Log ID", "Date", "Day", "Emp ID", "Employee Name",
      "Department", "Clock In Time", "Clock In Lat",
      "Clock In Lng", "Accuracy (m)", "Distance from Office (m)",
      "Clock Out Time", "Clock Out Lat", "Clock Out Lng",
      "Total Hours", "Status", "Saved At"
    ]);
    // Style header row
    sheet.getRange(1, 1, 1, 17).setBackground("#2E6DA4").setFontColor("#FFFFFF").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  const now = new Date();

  if (p.type === "clock_in") {
    // New row for clock-in
    const logId = "LOG" + now.getTime();
    const date  = p.date || now.toLocaleDateString("en-IN");
    const day   = new Date().toLocaleDateString("en-IN", {weekday: "short"});

    sheet.appendRow([
      logId,
      date,
      day,
      p.empId,
      p.empName,
      p.dept || "",
      p.timeStr || "",
      p.lat || "",
      p.lng || "",
      p.accuracy || "",
      p.distFromOffice || "",
      "",   // clock out time — filled on clock-out
      "",   // clock out lat
      "",   // clock out lng
      "",   // total hours — filled on clock-out
      p.status || "Present",
      now.toISOString()
    ]);

    // Style the new row
    const lastRow = sheet.getLastRow();
    const statusCell = sheet.getRange(lastRow, 16);
    if (p.status === "Present") {
      statusCell.setBackground("#E6F7F1").setFontColor("#1D9E75");
    } else {
      statusCell.setBackground("#FDEBD0").setFontColor("#E67E22");
    }

    // Send WhatsApp alert to admin if outside geofence
    // (Connect Twilio here in Phase 3 — for now just logs)
    if (p.distFromOffice && parseInt(p.distFromOffice) > 200) {
      Logger.log(`ALERT: ${p.empName} clocked in ${p.distFromOffice}m from office`);
    }

  } else if (p.type === "clock_out") {
    // Find today's clock-in row for this employee and update it
    const data    = sheet.getDataRange().getValues();
    const today   = now.toLocaleDateString("en-IN");

    for (let i = data.length - 1; i >= 1; i--) {
      if (data[i][3] === p.empId && data[i][1] === today && data[i][11] === "") {
        const rowNum = i + 1;
        // Update clock-out columns
        sheet.getRange(rowNum, 12).setValue(p.timeStr || "");  // Clock out time
        sheet.getRange(rowNum, 15).setValue(p.hoursWorked || ""); // Total hours
        break;
      }
    }
  }

  return ok("Attendance saved");
}

// ── LEAVE REQUEST ─────────────────────────────────────────────
function handleLeave(p) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let sheet   = ss.getSheetByName(SHEET_LEAVE);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_LEAVE);
    sheet.appendRow([
      "Request ID", "Submitted At", "Emp ID", "Employee Name",
      "Department", "Leave Type", "From Date", "To Date",
      "Reason", "Status", "Approved By", "Approved At"
    ]);
    sheet.getRange(1, 1, 1, 12).setBackground("#E67E22").setFontColor("#FFFFFF").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  const reqId = "LR" + new Date().getTime();

  sheet.appendRow([
    reqId,
    new Date().toISOString(),
    p.empId,
    p.empName,
    p.dept || "",
    p.leaveType,
    p.fromDate,
    p.toDate || p.fromDate,
    p.reason,
    "Pending",
    "",
    ""
  ]);

  // Style pending row
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 10).setBackground("#FEF3E8").setFontColor("#E67E22");

  return ok("Leave request saved");
}

// ── GEOFENCE VIOLATION ────────────────────────────────────────
function handleViolation(p) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let sheet   = ss.getSheetByName(SHEET_VIOLATIONS);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_VIOLATIONS);
    sheet.appendRow([
      "Date", "Time", "Emp ID", "Employee Name",
      "Latitude", "Longitude", "Distance from Office (m)", "Action"
    ]);
    sheet.getRange(1, 1, 1, 8).setBackground("#E24B4A").setFontColor("#FFFFFF").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  const now = new Date();
  sheet.appendRow([
    now.toLocaleDateString("en-IN"),
    now.toLocaleTimeString("en-IN"),
    p.empId,
    p.empName,
    p.lat,
    p.lng,
    p.dist,
    "Clock-in blocked"
  ]);

  // Highlight violation row in red
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, 8).setBackground("#FDEDEC");

  return ok("Violation logged");
}

// ── HELPER ────────────────────────────────────────────────────
function ok(message) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message }))
    .setMimeType(ContentService.MimeType.JSON);
}
