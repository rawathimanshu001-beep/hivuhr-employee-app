/**
 * Hivu HR Employee App — Configuration
 * ================================
 *
 * STEP 1: Create Supabase project at https://supabase.com
 * STEP 2: Create tables using SUPABASE_SETUP.md
 * STEP 3: Paste your credentials below
 * STEP 4: Save and deploy!
 */

const HIVU_CONFIG = {

  // ── SUPABASE CREDENTIALS ──────────────────────────────────
  // Get these from: Supabase Dashboard → Settings → API
  supabaseUrl: "https://your-project.supabase.co",      // ← Replace with your Project URL
  supabaseKey: "eyJ...",                                  // ← Replace with your Anon Key

  // ── COMPANY DETAILS ───────────────────────────────────────
  company: {
    name: "Your Company Pvt. Ltd.",
    city: "New Delhi",
    logo: "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 120 120%22%3E%3Ccircle cx=%2260%22 cy=%2220%22 r=%2212%22 fill=%22%2300D4FF%22/%3E%3Ctext x=%2210%22 y=%2295%22 font-family=%22Arial%22 font-weight=%22900%22 font-size=%2280%22 fill=%22%230066FF%22%3EiliVU%3C/text%3E%3C/svg%3E"
  },

  // ── OFFICE GPS LOCATION ───────────────────────────────────
  // HOW TO GET:
  // 1. Open Google Maps
  // 2. Go to your office
  // 3. Long-press the building
  // 4. Copy coordinates
  office: {
    lat: 28.5838,       // ← Paste your latitude
    lng: 77.0543,       // ← Paste your longitude
    name: "Head Office",
    radius: 100         // Metres (200 is standard)
  },

  // ── GEOFENCE SETTINGS ─────────────────────────────────────
  geofence: {
    strictMode: true,           // true = block if outside radius
    graceMinutes: 15,           // Minutes after start time for "late"
    officeStartTime: "09:30",   // 24hr format
    officeEndTime: "18:30"
  },

  // ── BRANCH OFFICES (optional) ─────────────────────────────
  branches: [
    // {
    //   name: "Branch 2 — Mumbai",
    //   lat: 19.0760,
    //   lng: 72.8777,
    //   radius: 200
    // }
  ]

};
