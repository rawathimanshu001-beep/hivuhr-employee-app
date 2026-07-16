const SUPABASE_CONFIG = {
  supabaseUrl: "https://jleqksjmzgsenuxckefn.supabase.co",
  supabaseAnonKey: "eyJhbGci••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••",

  company: {
    name: "Your Company Pvt. Ltd.",
    city: "New Delhi",
  },

  office: {
    lat: 28.5838,
    lng: 77.0543,
    name: "Head Office",
    radius: 30000,
  },

  geofence: {
    strictMode: true,
    graceMinutes: 15,
    officeStartTime: "09:30",
    officeEndTime: "18:30",
  },

  debug: false,
};
