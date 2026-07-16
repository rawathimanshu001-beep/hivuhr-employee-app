/**
 * HivuHR — Supabase Client
 * ========================
 * Wrapper around Supabase JS client library
 * Handles authentication, attendance, leave, and payslip operations
 */

// ── LOAD SUPABASE CLIENT ─────────────────────────────────────
// Add this to index.html: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
// OR import it below

class SupabaseClient {
  constructor(supabaseUrl, supabaseAnonKey) {
    this.url = supabaseUrl;
    this.key = supabaseAnonKey;
    this.client = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
    this.currentUser = null;
    this.currentEmployee = null;
    this.currentCompany = null;
  }

  // ── AUTHENTICATION ─────────────────────────────────────────

  /**
   * Send OTP to phone number
   * @param {string} phone - Phone number with country code (e.g., +919876543210)
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async sendOTP(phone) {
    try {
      // Check if user exists with this phone
      const { data: user } = await this.client
        .from('users')
        .select('id, employee_id')
        .eq('phone', phone)
        .single();

      if (!user) {
        return { success: false, message: 'Phone number not found' };
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Store OTP in database (expires in 10 minutes)
      const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();
      const { error } = await this.client
        .from('users')
        .update({
          otp: otp,
          otp_expires_at: expiresAt,
          otp_verified: false
        })
        .eq('phone', phone);

      if (error) return { success: false, message: error.message };

      // TODO: Send SMS via Twilio/MSG91 (Phase 3)
      // For now, log to console (demo mode)
      console.log(`OTP for ${phone}: ${otp}`);

      return { success: true, message: `OTP sent to ${phone}`, otp };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  /**
   * Verify OTP and login user
   * @param {string} phone - Phone number
   * @param {string} otp - 6-digit OTP
   * @returns {Promise<{success: boolean, user: object, error: string}>}
   */
  async verifyOTP(phone, otp) {
    try {
      // Get user
      const { data: user, error: userError } = await this.client
        .from('users')
        .select('id, employee_id, otp, otp_expires_at, otp_verified')
        .eq('phone', phone)
        .single();

      if (userError || !user) {
        return { success: false, error: 'User not found' };
      }

      // Check OTP validity
      if (user.otp !== otp) {
        return { success: false, error: 'Invalid OTP' };
      }

      if (new Date() > new Date(user.otp_expires_at)) {
        return { success: false, error: 'OTP expired' };
      }

      // Mark as verified and update last login
      const { error: updateError } = await this.client
        .from('users')
        .update({
          otp_verified: true,
          last_login: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      // Fetch employee details
      const { data: employee } = await this.client
        .from('employees')
        .select('*')
        .eq('id', user.employee_id)
        .single();

      const { data: company } = await this.client
        .from('companies')
        .select('*')
        .eq('id', employee.company_id)
        .single();

      this.currentUser = user;
      this.currentEmployee = employee;
      this.currentCompany = company;

      // Store in localStorage
      localStorage.setItem('hivuhr_user', JSON.stringify({
        userId: user.id,
        phone: phone,
        employeeId: employee.id,
        employeeName: employee.name,
        empId: employee.emp_id,
        companyId: company.id,
        companyName: company.name
      }));

      return {
        success: true,
        user: {
          id: user.id,
          phone: phone,
          employee: employee,
          company: company
        }
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Check if user is logged in
   * @returns {object|null}
   */
  getLoggedInUser() {
    const stored = localStorage.getItem('hivuhr_user');
    return stored ? JSON.parse(stored) : null;
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('hivuhr_user');
    this.currentUser = null;
    this.currentEmployee = null;
    this.currentCompany = null;
  }

  // ── ATTENDANCE ─────────────────────────────────────────────

  /**
   * Clock In
   * @param {object} data - {lat, lng, accuracy, distFromOffice}
   * @returns {Promise<{success: boolean, logId: string}>}
   */
  async clockIn(data) {
    try {
      const user = this.getLoggedInUser();
      if (!user) return { success: false, message: 'Not logged in' };

      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const logId = `LOG${Date.now()}`;

      const { error } = await this.client
        .from('attendance_logs')
        .insert({
          log_id: logId,
          company_id: user.companyId,
          employee_id: user.employeeId,
          emp_id: user.empId,
          emp_name: user.employeeName,
          date: today,
          day_name: now.toLocaleDateString('en-IN', { weekday: 'short' }),
          clock_in_time: now.toLocaleTimeString('en-IN', { hour12: false }).slice(0, 5),
          clock_in_lat: data.lat,
          clock_in_lng: data.lng,
          clock_in_accuracy: data.accuracy,
          clock_in_distance_m: data.distFromOffice,
          status: data.distFromOffice > 200 ? 'late' : 'present'
        });

      if (error) return { success: false, message: error.message };

      return { success: true, logId: logId };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  /**
   * Clock Out
   * @param {object} data - {lat, lng, hoursWorked}
   * @returns {Promise<{success: boolean}>}
   */
  async clockOut(data) {
    try {
      const user = this.getLoggedInUser();
      if (!user) return { success: false, message: 'Not logged in' };

      const now = new Date();
      const today = now.toISOString().split('T')[0];

      // Find today's clock-in record
      const { data: record } = await this.client
        .from('attendance_logs')
        .select('id')
        .eq('employee_id', user.employeeId)
        .eq('date', today)
        .eq('company_id', user.companyId)
        .single();

      if (!record) {
        return { success: false, message: 'No clock-in found for today' };
      }

      const { error } = await this.client
        .from('attendance_logs')
        .update({
          clock_out_time: now.toLocaleTimeString('en-IN', { hour12: false }).slice(0, 5),
          clock_out_lat: data.lat,
          clock_out_lng: data.lng,
          total_hours_worked: data.hoursWorked
        })
        .eq('id', record.id);

      if (error) return { success: false, message: error.message };

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  /**
   * Get today's attendance status
   * @returns {Promise<object>}
   */
  async getTodayAttendance() {
    try {
      const user = this.getLoggedInUser();
      if (!user) return null;

      const today = new Date().toISOString().split('T')[0];

      const { data } = await this.client
        .from('attendance_logs')
        .select('*')
        .eq('employee_id', user.employeeId)
        .eq('date', today)
        .single();

      return data || null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Get monthly attendance summary
   * @param {string} month - YYYY-MM
   * @returns {Promise<array>}
   */
  async getMonthlyAttendance(month) {
    try {
      const user = this.getLoggedInUser();
      if (!user) return [];

      const [year, monthNum] = month.split('-');
      const startDate = `${year}-${monthNum}-01`;
      const endDate = new Date(year, monthNum, 0).toISOString().split('T')[0];

      const { data } = await this.client
        .from('attendance_logs')
        .select('*')
        .eq('employee_id', user.employeeId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      return data || [];
    } catch (err) {
      return [];
    }
  }

  // ── LEAVE ──────────────────────────────────────────────────

  /**
   * Apply for leave
   * @param {object} data - {leaveType, fromDate, toDate, reason}
   * @returns {Promise<{success: boolean, requestId: string}>}
   */
  async applyLeave(data) {
    try {
      const user = this.getLoggedInUser();
      if (!user) return { success: false, message: 'Not logged in' };

      const requestId = `LR${Date.now()}`;
      const fromDate = new Date(data.fromDate);
      const toDate = new Date(data.toDate);
      const numDays = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

      const { error } = await this.client
        .from('leave_requests')
        .insert({
          request_id: requestId,
          company_id: user.companyId,
          employee_id: user.employeeId,
          emp_id: user.empId,
          emp_name: user.employeeName,
          leave_type: data.leaveType,
          from_date: data.fromDate,
          to_date: data.toDate,
          num_days: numDays,
          reason: data.reason,
          status: 'pending'
        });

      if (error) return { success: false, message: error.message };

      return { success: true, requestId: requestId };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  /**
   * Get leave balance
   * @returns {Promise<object>}
   */
  async getLeaveBalance() {
    try {
      const user = this.getLoggedInUser();
      if (!user) return null;

      const year = new Date().getFullYear();

      const { data } = await this.client
        .from('leave_balances')
        .select('*')
        .eq('employee_id', user.employeeId)
        .eq('year', year)
        .single();

      return data || {};
    } catch (err) {
      return {};
    }
  }

  /**
   * Get leave requests history
   * @returns {Promise<array>}
   */
  async getLeaveRequests() {
    try {
      const user = this.getLoggedInUser();
      if (!user) return [];

      const { data } = await this.client
        .from('leave_requests')
        .select('*')
        .eq('employee_id', user.employeeId)
        .order('submitted_at', { ascending: false });

      return data || [];
    } catch (err) {
      return [];
    }
  }

  // ── PAYSLIPS ───────────────────────────────────────────────

  /**
   * Get payslip for a month
   * @param {string} monthYear - YYYY-MM
   * @returns {Promise<object>}
   */
  async getPayslip(monthYear) {
    try {
      const user = this.getLoggedInUser();
      if (!user) return null;

      const { data } = await this.client
        .from('payslips')
        .select('*')
        .eq('employee_id', user.employeeId)
        .eq('month_year', monthYear)
        .single();

      return data || null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Get all payslips
   * @returns {Promise<array>}
   */
  async getAllPayslips() {
    try {
      const user = this.getLoggedInUser();
      if (!user) return [];

      const { data } = await this.client
        .from('payslips')
        .select('*')
        .eq('employee_id', user.employeeId)
        .order('month_year', { ascending: false });

      return data || [];
    } catch (err) {
      return [];
    }
  }

  // ── EMPLOYEE PROFILE ───────────────────────────────────────

  /**
   * Get employee profile
   * @returns {Promise<object>}
   */
  async getEmployeeProfile() {
    try {
      const user = this.getLoggedInUser();
      if (!user) return null;

      const { data } = await this.client
        .from('employees')
        .select('*')
        .eq('id', user.employeeId)
        .single();

      return data || null;
    } catch (err) {
      return null;
    }
  }

  // ── COMPANY SETTINGS ───────────────────────────────────────

  /**
   * Get company settings (office GPS, working hours)
   * @returns {Promise<object>}
   */
  async getCompanySettings() {
    try {
      const user = this.getLoggedInUser();
      if (!user) return null;

      const { data } = await this.client
        .from('company_settings')
        .select('*')
        .eq('company_id', user.companyId)
        .single();

      return data || null;
    } catch (err) {
      return null;
    }
  }
}

// ── GLOBAL INSTANCE ────────────────────────────────────────
let hivuhrDB = null;

function initSupabase(url, key) {
  hivuhrDB = new SupabaseClient(url, key);
  return hivuhrDB;
}

function getSupabase() {
  return hivuhrDB;
}
