# iliVU Employee App — Quick Start (15 Minutes)

## ⚡ Get Started Now!

### **3 Steps to Launch:**

---

## Step 1️⃣ Create Supabase (5 min)

1. Go to **https://supabase.com**
2. Click **Sign Up** → Create free account
3. Click **New Project**
   - Name: `ilivu-hrms`
   - Password: Any strong password
   - Region: Singapore (for India)
4. ⏳ Wait 2-3 minutes...

---

## Step 2️⃣ Copy Credentials & Setup DB (5 min)

Once Supabase loads:

1. **Settings** → **API**
   - Copy `Project URL`
   - Copy `Anon Public Key`

2. **SQL Editor** → **New query**
   - Copy-paste from `SUPABASE_SETUP.md` (all SQL queries)
   - Run each one (Ctrl+Enter)

3. **Table Editor**
   - Click `employees` → **Insert row**
   - Add your first employee with phone number

---

## Step 3️⃣ Update Config & Run (5 min)

1. Open `config.js` in notepad/editor
2. Replace these:
   ```javascript
   supabaseUrl: "YOUR-PROJECT-URL",     // From Step 2
   supabaseKey: "YOUR-ANON-KEY",        // From Step 2
   
   office: {
     lat: 28.5838,                      // Your office latitude
     lng: 77.0543,                      // Your office longitude
   },
   
   company: {
     name: "Your Company Name",
   }
   ```

3. Save file

4. **Open `index.html` in browser**

5. ✅ **App is running!**

---

## 🧪 Test It

1. **Login**
   - Phone: `+91 98765 43210` (or employee phone you added)
   - OTP: Any 6 digits (demo mode)

2. **Clock In**
   - Click "Clock In"
   - See GPS map with geofence
   - Confirm

3. **Check Data**
   - Go to Supabase `attendance_logs` table
   - Your clock-in should appear! ✅

---

## 📱 Deploy (Optional - Free!)

**To share with employees:**

### GitHub Pages Method:

1. Create GitHub account: https://github.com
2. Create new repo: `ilivu-hrms` (public)
3. Upload these files:
   - `index.html`
   - `config.js`
   - `manifest.json`
4. **Settings** → **Pages**
   - Branch: `main` → `/root`
   - Save
5. Wait 2 min → Visit: `https://YOU.github.io/ilivu-hrms/`

---

## 📋 Files Overview

| File | What |
|------|------|
| `index.html` | The complete app |
| `config.js` | Your settings (Supabase + office location) |
| `manifest.json` | PWA installer |
| `SUPABASE_SETUP.md` | Detailed setup guide |
| `IMPLEMENTATION_SUMMARY.md` | All features explained |
| `QUICKSTART.md` | This file! |

---

## ⚠️ Common Issues

**"Supabase not initialized"**
- Check config.js has correct URL + Key

**"Employee not found"**
- Add employee to Supabase first

**"GPS not working on localhost"**
- Must use HTTPS (GitHub Pages = HTTPS ✅)
- Use ngrok to test locally

**"Real-time not updating"**
- Enable Realtime in Supabase table settings

---

## 🎯 What You Get

✅ Employee login with OTP  
✅ Clock in/out with GPS map + geofence  
✅ Birthday & Work Anniversary alerts  
✅ Attendance tracking & calendar  
✅ Leave application  
✅ Payslip view  
✅ Profile management  
✅ Dark/Light mode  
✅ Real-time data sync  
✅ 100% Free (Supabase + GitHub Pages)  

---

## 🚀 Next

1. Follow steps above
2. Test on your phone
3. Add all employees
4. Share app link
5. Monitor in Supabase

**All done in 15 minutes!** ⏱️

---

Need help? Check `SUPABASE_SETUP.md` for detailed guide.

**Good luck! 🎉**
