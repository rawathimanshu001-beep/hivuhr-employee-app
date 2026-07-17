/**
 * iliVU Employee App — Configuration
 * ================================
 *
 * STEP 1: Create Supabase project at https://supabase.com
 * STEP 2: Create tables using SUPABASE_SETUP.md
 * STEP 3: Paste your credentials below
 * STEP 4: Save and deploy!
 */

const ILIVU_CONFIG = {

  // ── SUPABASE CREDENTIALS ──────────────────────────────────
  // Get these from: Supabase Dashboard → Settings → API
  supabaseUrl: "https://kaiiffxgnpjsgswuhukj.supabase.co",      // ← Replace with your Project URL
  supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthaWlmZnhnbnBqc2dzd3VodWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyNzA5MDcsImV4cCI6MjA5OTg0NjkwN30.E5PArYijB5aJ8eBNQ_tr0gUPpa4oAM72VmHCjqWoFw0",                                  // ← Replace with your Anon Key

  // ── COMPANY DETAILS ───────────────────────────────────────
  company: {
    name: "ABC Pvt. Ltd.",
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
    lat: 28.589954,       // ← Paste your latitude
    lng: 77.031847,       // ← Paste your longitude
    name: "Dwarka Office",
    radius: 1000         // Metres (200 is standard)
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
