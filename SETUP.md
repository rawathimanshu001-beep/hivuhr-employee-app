# PayHR Employee App — Setup Guide
## From zero to live in 4 steps

---

## STEP 1 — Edit config.js (5 minutes)

Open `config.js` and change these 3 things:

**Your company name:**
```
name: "Your Company Pvt. Ltd."  →  name: "ABC Traders Pvt. Ltd."
```

**Your office GPS coordinates:**
1. Open Google Maps on your phone
2. Go to your office building
3. Long-press on the exact location
4. Coordinates appear at the bottom (e.g. 28.6139, 77.2090)
5. First number = latitude, second = longitude
```
lat: 28.6139  →  paste your latitude
lng: 77.2090  →  paste your longitude
```

**Your geofence radius:**
```
radius: 200  →  200 metres is standard for a single office floor
               increase to 500 for a campus or large building
```

---

## STEP 2 — Connect Google Sheets (15 minutes)

This makes every clock-in save automatically to your spreadsheet.

**2a. Open your PayHR Attendance Google Sheet**

**2b. Go to Extensions → Apps Script**

**2c. Delete all existing code in the editor**

**2d. Open the file `apps-script.gs` from this folder**
Copy the entire contents and paste into the Apps Script editor.

**2e. Click Save (floppy disk icon or Ctrl+S)**

**2f. Click Deploy → New deployment**
- Click the gear icon next to "Select type" → choose "Web app"
- Description: PayHR Attendance API
- Execute as: Me
- Who has access: Anyone
- Click Deploy

**2g. Copy the Web App URL**
It looks like: `https://script.google.com/macros/s/ABC123.../exec`

**2h. Paste it into config.js:**
```
sheetsWebAppUrl: "https://script.google.com/macros/s/YOUR_URL/exec"
```

**Test it:** Open the URL in your browser. You should see:
`{"status":"ok","message":"PayHR API running"}`

---

## STEP 3 — Deploy on GitHub Pages (10 minutes)

This gives your app a free public URL employees can open on any phone.

**3a. Create a free GitHub account**
Go to github.com → Sign up (free)

**3b. Create a new repository**
- Click the + icon → New repository
- Name it: `payhr-employee-app`
- Make it Public
- Click Create repository

**3c. Upload your files**
- Click "uploading an existing file"
- Drag and drop ALL files from this folder:
  - index.html
  - config.js
  - apps-script.gs
  - manifest.json
  - SETUP.md
- Click Commit changes

**3d. Enable GitHub Pages**
- Click Settings (top of your repo)
- Click Pages (left sidebar)
- Source: Deploy from a branch
- Branch: main → / (root)
- Click Save

**3e. Wait 2 minutes then visit:**
```
https://YOUR-GITHUB-USERNAME.github.io/payhr-employee-app/
```

That is your live app URL. Share it with employees via WhatsApp.

---

## STEP 4 — Share with employees (2 minutes)

Send this WhatsApp message to each employee:

---
*Namaste [Name],*

*Your PayHR app is ready! Use it to clock in, check payslip and apply for leave.*

*📱 Open this link: [YOUR GITHUB PAGES URL]*

*To login: enter your mobile number → you'll get a 6-digit code → enter it → done.*

*Add it to your home screen for quick access:*
*iPhone: tap Share → Add to Home Screen*
*Android: tap Menu → Add to Home Screen*
---

---

## One Google Sheet per client company

For each new client you onboard:
1. Duplicate the PayHR Attendance Google Sheet
2. Connect the new Apps Script to that sheet
3. Duplicate config.js → change office coordinates and company name
4. Keep index.html the same (or host separate copies per client)

Each client's data stays completely separate.

---

## Troubleshooting

**Clock-in not saving to sheets:**
- Check that the Apps Script URL in config.js is correct
- Make sure "Who has access" is set to "Anyone" in Apps Script deployment
- Check the Apps Script execution log: View → Executions

**GPS not working:**
- Must be accessed over HTTPS (GitHub Pages gives this automatically)
- Employee must tap "Allow" when browser asks for location permission
- GPS works best outdoors or near windows

**App not loading:**
- Check that index.html and config.js are in the same folder on GitHub
- GitHub Pages takes 2-5 minutes to update after changes

---

## Files in this folder

| File | Purpose |
|------|---------|
| index.html | The complete employee app |
| config.js | Your settings — office GPS, geofence, Sheets URL |
| apps-script.gs | Paste this into Google Apps Script |
| manifest.json | Makes the app installable on phone home screen |
| SETUP.md | This guide |
