const express = require('express');
const fetch = require('node-fetch');
const db = require('../db'); // Pastikan path sesuai ke db.js kamu
const router = express.Router();

const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql'; // sesuaikan

// Helper untuk kirim query ke GraphQL
async function fetchGraphQL(query, variables = {}) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  return json.data;
}

//
// ==== RUTE BERBASIS GRAPHQL ====
//

// Get semua kamar dari GraphQL
router.get('/graphql/kamar', async (req, res) => {
  const query = `
    query {
      semuaKamar {
        id_kamar
        nomor_kamar
        kelas_kamar
        tarif_per_hari
      }
    }
  `;
  const data = await fetchGraphQL(query);
  res.json(data.semuaKamar);
});

// Get rawat inap by ID dari GraphQL
router.get('/graphql/rawat-inap/:id', async (req, res) => {
  const query = `
    query($id: ID!) {
      rawatInap(id: $id) {
        id_rawat_inap
        id_pasien
        tanggal_masuk
        tanggal_keluar
        status
        total_biaya
        kamar { nomor_kamar kelas_kamar }
      }
    }
  `;
  const data = await fetchGraphQL(query, { id: req.params.id });
  res.json(data.rawatInap);
});

// Tambah diagnosa inap lewat GraphQL
router.post('/graphql/diagnosa-inap', async (req, res) => {
  const { id_rawat_inap, nama_diagnosa, kode_icd10 } = req.body;

  const mutation = `
    mutation($id_rawat_inap: Int, $nama_diagnosa: String, $kode_icd10: String) {
      tambahDiagnosaInap(
        id_rawat_inap: $id_rawat_inap,
        nama_diagnosa: $nama_diagnosa,
        kode_icd10: $kode_icd10
      ) {
        id_diagnosa_inap
        nama_diagnosa
      }
    }
  `;

  const data = await fetchGraphQL(mutation, {
    id_rawat_inap,
    nama_diagnosa,
    kode_icd10
  });
  res.json(data.tambahDiagnosaInap);
});

//
// ==== RUTE BERBASIS DATABASE LANGSUNG ====
//

// Kamar
router.get('/kamar', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM kamar');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching kamar:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rawat Inap
router.get('/rawat_inap', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM rawat_inap');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching rawat_inap:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Diagnosa Inap
router.get('/diagnosa_inap', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM diagnosa_inap');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching diagnosa_inap:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Tindakan Inap
router.get('/tindakan_inap', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tindakan_inap');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tindakan_inap:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
