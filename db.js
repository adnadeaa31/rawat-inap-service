const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://rawat_inap_owner:npg_5RXwfNjCmDK9@ep-patient-voice-a883xyrq-pooler.eastus2.azure.neon.tech/rawat_inap_service?sslmode=require',
  ssl: {
    rejectUnauthorized: false, // ini penting buat koneksi ke Neon atau layanan cloud yang pakai SSL self-signed
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
