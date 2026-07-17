# iliVU Employee App — Supabase Setup Guide

Complete setup in **15 minutes**. Follow each step carefully.

---

## STEP 1: Create Supabase Project (5 minutes)

1. Go to https://supabase.com
2. Click **Sign Up** → Create free account
3. Click **New Project**
   - **Organization:** Create new or select existing
   - **Project name:** `ilivu-hrms`
   - **Database password:** Create strong password (SAVE IT!)
   - **Region:** Choose closest to you
     - India: Singapore
     - USA: Virginia
4. Click **Create new project**
5. ⏳ Wait 2-3 minutes for initialization

---

## STEP 2: Copy Your API Credentials (2 minutes)

**Once project loads:**

1. Click **Settings** (gear icon, bottom left)
2. Click **API** (left sidebar)
3. Copy these THREE values (save them somewhere):

   ```
   Project URL:      https://xxxxx.supabase.co
   Anon Public Key:  eyJ0eXAiOiJKV1QiLCJhbGc...
   Service Role Key: eyJ0eXAiOiJKV1QiLCJhbGc... (for admin only)
   ```

⚠️ **IMPORTANT:** Keep these SECRET! Never share public or GitHub!

---

## STEP 3: Create Database Tables (5 minutes)

**In Supabase Dashboard:**

1. Click **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy-paste each SQL block below
4. Run with **Ctrl+Enter** or click **Execute**

### Query 1: Create Employees Table

```sql
CREATE TABLE IF NOT EXISTS employees (
  id BIGSERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  emp_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  department VARCHAR(50),
  designation VARCHAR(50),
  salary DECIMAL(10,2),
  dob DATE,
  work_anniversary DATE,
  profile_pic_url TEXT,
  manager_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_employees_phone ON employees(phone);
CREATE INDEX idx_employees_emp_id ON employees(emp_id);
```

✅ **Click Execute**

---

### Query 2: Create Attendance Logs Table

```sql
CREATE TABLE IF NOT EXISTS attendance_logs (
  id BIGSERIAL PRIMARY KEY,
  emp_id VARCHAR(50) NOT NULL REFERENCES employees(emp_id) ON DELETE CASCADE,
  date DATE NOT NULL,
  clock_in_time TIME,
  clock_in_lat DECIMAL(10,8),
  clock_in_lng DECIMAL(10,8),
  clock_in_accuracy INT,
  clock_in_address TEXT,
  clock_out_time TIME,
  clock_out_lat DECIMAL(10,8),
  clock_out_lng DECIMAL(10,8),
  clock_out_address TEXT,
  hours_worked VARCHAR(20),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_attendance_emp_date ON attendance_logs(emp_id, date);
CREATE INDEX idx_attendance_date ON attendance_logs(date);
```

✅ **Click Execute**

---

### Query 3: Create Leave Requests Table

```sql
CREATE TABLE IF NOT EXISTS leave_requests (
  id BIGSERIAL PRIMARY KEY,
  emp_id VARCHAR(50) NOT NULL REFERENCES employees(emp_id) ON DELETE CASCADE,
  leave_type VARCHAR(50) NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'Pending',
  approved_by VARCHAR(100),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leave_emp_status ON leave_requests(emp_id, status);
```

✅ **Click Execute**

---

### Query 4: Create Geofence Violations Table

```sql
CREATE TABLE IF NOT EXISTS geofence_violations (
  id BIGSERIAL PRIMARY KEY,
  emp_id VARCHAR(50) NOT NULL REFERENCES employees(emp_id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(10,8),
  distance_from_office INT,
  action VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_violations_emp_date ON geofence_violations(emp_id, date);
```

✅ **Click Execute**

---

### Query 5: Create Announcements Table

```sql
CREATE TABLE IF NOT EXISTS announcements (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_announcements_active ON announcements(is_active);
```

✅ **Click Execute**

---

## STEP 4: Add Sample Employee Data (3 minutes)

**In Supabase Dashboard:**

1. Click **Table Editor** (left sidebar)
2. Click **employees** table
3. Click **Insert row**
4. Fill in sample data:

```
phone:              +91 98765 43210
emp_id:             EMP001
name:               Ramesh Kumar
email:              ramesh@company.com
department:         Operations
designation:        Manager
salary:             85000
dob:                1990-05-15
work_anniversary:   2022-04-01
profile_pic_url:    (leave empty for now)
manager_name:       Priya Sharma
```

5. Click **Save**
6. Repeat for more employees

---

## STEP 5: Enable Real-time Updates (2 minutes)

**For instant data sync:**

1. Click **Table Editor** → Select **attendance_logs**
2. Click menu ⋮ → **Enable Realtime**
3. Repeat for:
   - leave_requests
   - announcements
   - geofence_violations

---

## STEP 6: Update config.js (2 minutes)

1. Open `config.js` in any text editor
2. Find these lines:
   ```javascript
   supabaseUrl: "https://your-project.supabase.co",
   supabaseKey: "eyJ...",
   ```

3. Replace with YOUR credentials from STEP 2:
   ```javascript
   supabaseUrl: "https://xyzzyx.supabase.co",
   supabaseKey: "eyJ0eXAiOiJKV1QiLCJhbGc...",
   ```

4. **Update office coordinates:**
   ```javascript
   office: {
     lat: 28.5838,    // Your office latitude
     lng: 77.0543,    // Your office longitude
     radius: 100      // 100-200 metres
   },
   ```

5. **Update company name:**
   ```javascript
   company: {
     name: "ABC Traders Pvt. Ltd.",
   },
   ```

6. **Save file**

---

## STEP 7: Test Connection (2 minutes)

1. Open `index.html` in browser
2. Open **Browser Console** (F12 → Console tab)
3. Should see: ✅ **"Supabase initialized"**
4. Try logging in with:
   - Phone: +91 98765 43210
   - OTP: any 6 digits

---

## STEP 8: Deploy on GitHub Pages (Optional, 5 minutes)

### If you want free hosting:

1. Create GitHub account at https://github.com
2. Create new repository named `ilivu-hrms`
3. Upload these files:
   - index.html
   - config.js
   - manifest.json
4. Go to **Settings → Pages**
5. Set Branch: `main` → `/root`
6. Wait 2 minutes
7. Visit: `https://YOUR-USERNAME.github.io/ilivu-hrms/`

---

## TROUBLESHOOTING

### ❌ "Relation does not exist"
- Check all SQL queries ran without errors
- Verify table names are lowercase

### ❌ "Permission denied"
- Verify Anon Key is correct (not Service Role Key)
- Check Supabase Project URL matches

### ❌ "Real-time not working"
- Enable Real-time in Table Editor
- Refresh browser

### ❌ "GPS not working on localhost"
- GPS requires HTTPS
- Use GitHub Pages or Netlify (both free + HTTPS)
- Or use ngrok to HTTPS tunnel

### ❌ Employee not found on login
- Add employee to Supabase first
- Use exact phone number from table

---

## Next Steps

1. ✅ Add all employees to Supabase
2. ✅ Customize office GPS location
3. ✅ Share app link with employees
4. ✅ Monitor data in Supabase tables
5. ✅ Set up backups (Supabase → Auto backup)

---

## Support

**Supabase Docs:** https://supabase.com/docs  
**iliVU GitHub:** https://github.com  
**Email:** support@ilivu.app

---

**You're all set! 🚀**

Start the app, login, and test clock in/out!
