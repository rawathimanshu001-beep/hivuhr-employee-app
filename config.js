/**
 * Hivu Employee App — Configuration File
 * =========================================
 * STEP 1: Edit this file with your details
 * STEP 2: Upload everything to GitHub Pages
 * STEP 3: Share the link with employees
 *
 * THIS IS THE ONLY FILE YOU NEED TO EDIT.
 */

const PAYHR_CONFIG = {

  // ── COMPANY DETAILS ────────────────────────────────────────
  company: {
    name:    "Your Company Pvt. Ltd.",   // ← Change this
    city:    "New Delhi",                // ← Change this
    logo:    "https://drive.google.com/file/d/1JNmZK4VF-arucBLnXPrx2Uchok3MkG1a/view?usp=sharing",                         // ← Optional: URL to your logo image
  },

  // ── OFFICE GPS LOCATION ────────────────────────────────────
  // HOW TO GET YOUR COORDINATES:
  // 1. Open Google Maps on your phone
  // 2. Go to your office location
  // 3. Long-press on the building
  // 4. Coordinates appear at the bottom
  // 5. Copy and paste below
  office: {
    lat:    28.5838,    // ← Paste your office latitude here
    lng:    77.0543,    // ← Paste your office longitude here
    name:   "Head Office",
    radius: 100000,        // ← Metres allowed from office (200 = standard)
  },

  // ── GEOFENCE SETTINGS ──────────────────────────────────────
  geofence: {
    strictMode:    true,   // true  = BLOCK clock-in if outside radius
                           // false = WARN only, still allow clock-in
    graceMinutes:  15,     // Minutes after office start before marked Late
    officeStartTime: "09:30", // 24hr format
    officeEndTime:   "18:30", // 24hr format
  },

  // ── GOOGLE SHEETS INTEGRATION ──────────────────────────────
  // HOW TO SET THIS UP (Step by step in SETUP.md):
  // 1. Open your Attendance Google Sheet
  // 2. Go to Extensions → Apps Script
  // 3. Paste the code from apps-script.gs
  // 4. Deploy → New deployment → Web app
  // 5. Copy the URL and paste below
  sheetsWebAppUrl: "https://script.google.com/macros/s/AKfycby-KvBKYmgsVAsNkcFbKpCRXO0BpfqQCVwjETB4XqzLW7KxisLyi0IarZVPUknPIG8ZRA/exec",

  // ── MULTI-BRANCH (optional) ────────────────────────────────
  // Add more offices if your client has multiple locations
  branches: [
    // {
    //   name: "Branch 2 — Mumbai",
    //   lat: 19.0760,
    //   lng: 72.8777,
    //   radius: 200
    // }
  ],

};
