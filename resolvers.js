const db = require('./db'); // import koneksi pg dari db.js
const { GraphQLScalarType, Kind } = require('graphql');

// Scalar Date untuk parsing tanggal
const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Custom Date scalar type',
  parseValue(value) {
    return new Date(value); // dari client ke server
  },
  serialize(value) {
    return value.toISOString().split('T')[0]; // dari server ke client (YYYY-MM-DD)
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

const resolvers = {
  Date: DateScalar,

  Query: {
    semuaRawatInap: async () => {
      const res = await db.query('SELECT * FROM rawat_inap');
      return res.rows;
    },
    rawatInap: async (_, { id }) => {
      const res = await db.query('SELECT * FROM rawat_inap WHERE id_rawat_inap = $1', [id]);
      return res.rows[0];
    },
    semuaKamar: async () => {
      const res = await db.query('SELECT * FROM kamar');
      return res.rows;
    },
    kamar: async (_, { id }) => {
      const res = await db.query('SELECT * FROM kamar WHERE id_kamar = $1', [id]);
      return res.rows[0];
    },
    semuaDiagnosaInap: async () => {
      const res = await db.query('SELECT * FROM diagnosa_inap');
      return res.rows;
    },
    diagnosaInap: async (_, { id_kunjungan }) => {
      const res = await db.query('SELECT * FROM diagnosa_inap WHERE id_kunjungan = $1', [id_kunjungan]);
      return res.rows[0];
    },
    semuaTindakanInap: async () => {
      const res = await db.query('SELECT * FROM tindakan_inap');
      return res.rows;
    },
    tindakanInap: async (_, { id }) => {
      const res = await db.query('SELECT * FROM tindakan_inap WHERE id_tindakan_inap = $1', [id]);
      return res.rows[0];
    },
  },

  RawatInap: {
    kamar: async (parent) => {
      if (!parent.id_kamar) return null;
      const res = await db.query('SELECT * FROM kamar WHERE id_kamar = $1', [parent.id_kamar]);
      return res.rows[0];
    },
    diagnosa: async (parent) => {
      if (!parent.id_diagnosa_inap) return null;
      const res = await db.query('SELECT * FROM diagnosa_inap WHERE id_diagnosa_inap = $1', [parent.id_diagnosa_inap]);
      return res.rows[0];
    },
    tindakan: async (parent) => {
      if (!parent.id_tindakan_inap) return null;
      const res = await db.query('SELECT * FROM tindakan_inap WHERE id_tindakan_inap = $1', [parent.id_tindakan_inap]);
      return res.rows[0];
    },
  },

  Mutation: {
    // Kamar
    tambahKamar: async (_, { nomor_kamar, kelas_kamar, tarif_per_hari }) => {
      const res = await db.query(
        'INSERT INTO kamar (nomor_kamar, kelas_kamar, tarif_per_hari) VALUES ($1, $2, $3) RETURNING *',
        [nomor_kamar, kelas_kamar, tarif_per_hari]
      );
      return res.rows[0];
    },

    editKamar: async (_, args) => {
      const { id_kamar, nomor_kamar, kelas_kamar, tarif_per_hari } = args;
      const fields = [];
      const values = [];
      let idx = 1;

      if (nomor_kamar !== undefined) {
        fields.push(`nomor_kamar = $${idx++}`);
        values.push(nomor_kamar);
      }
      if (kelas_kamar !== undefined) {
        fields.push(`kelas_kamar = $${idx++}`);
        values.push(kelas_kamar);
      }
      if (tarif_per_hari !== undefined) {
        fields.push(`tarif_per_hari = $${idx++}`);
        values.push(tarif_per_hari);
      }
      if (fields.length === 0) throw new Error('Tidak ada field yang diupdate');

      values.push(id_kamar);
      const query = `UPDATE kamar SET ${fields.join(', ')} WHERE id_kamar = $${idx} RETURNING *`;
      const res = await db.query(query, values);
      return res.rows[0];
    },

    hapusKamar: async (_, { id_kamar }) => {
      const res = await db.query('DELETE FROM kamar WHERE id_kamar = $1', [id_kamar]);
      return res.rowCount > 0;
    },

    // Tindakan Inap
    tambahTindakanInap: async (_, { nama_tindakan, tanggal_tindakan, kode_icd9 }) => {
      const res = await db.query(
        'INSERT INTO tindakan_inap (nama_tindakan, tanggal_tindakan, kode_icd9) VALUES ($1, $2, $3) RETURNING *',
        [nama_tindakan, tanggal_tindakan, kode_icd9]
      );
      return res.rows[0];
    },

    editTindakanInap: async (_, args) => {
      const { id_tindakan_inap, nama_tindakan, tanggal_tindakan, kode_icd9 } = args;
      const fields = [];
      const values = [];
      let idx = 1;

      if (nama_tindakan !== undefined) {
        fields.push(`nama_tindakan = $${idx++}`);
        values.push(nama_tindakan);
      }
      if (tanggal_tindakan !== undefined) {
        fields.push(`tanggal_tindakan = $${idx++}`);
        values.push(tanggal_tindakan);
      }
      if (kode_icd9 !== undefined) {
        fields.push(`kode_icd9 = $${idx++}`);
        values.push(kode_icd9);
      }
      if (fields.length === 0) throw new Error('Tidak ada field yang diupdate');

      values.push(id_tindakan_inap);
      const query = `UPDATE tindakan_inap SET ${fields.join(', ')} WHERE id_tindakan_inap = $${idx} RETURNING *`;
      const res = await db.query(query, values);
      return res.rows[0];
    },

    hapusTindakanInap: async (_, { id_tindakan_inap }) => {
      const res = await db.query('DELETE FROM tindakan_inap WHERE id_tindakan_inap = $1', [id_tindakan_inap]);
      return res.rowCount > 0;
    },

    // Diagnosa Inap
    tambahDiagnosaInap: async (_, { id_rawat_inap, nama_diagnosa, kode_icd10 }) => {
      const res = await db.query(
        'INSERT INTO diagnosa_inap (id_rawat_inap, nama_diagnosa, kode_icd10) VALUES ($1, $2, $3) RETURNING *',
        [id_rawat_inap, nama_diagnosa, kode_icd10]
      );
      return res.rows[0];
    },

    editDiagnosaInap: async (_, args) => {
      const { id_diagnosa_inap, id_rawat_inap, nama_diagnosa, kode_icd10 } = args;
      const fields = [];
      const values = [];
      let idx = 1;

      if (id_rawat_inap !== undefined) {
        fields.push(`id_rawat_inap = $${idx++}`);
        values.push(id_rawat_inap);
      }
      if (detail_diagnosa !== undefined) {
        fields.push(`detail_diagnosa = $${idx++}`);
        values.push(detail_diagnosa);
      }
      if (kode_icd10 !== undefined) {
        fields.push(`kode_icd10 = $${idx++}`);
        values.push(kode_icd10);
      }
      if (fields.length === 0) throw new Error('Tidak ada field yang diupdate');

      values.push(id_diagnosa_inap);
      const query = `UPDATE diagnosa_inap SET ${fields.join(', ')} WHERE id_diagnosa_inap = $${idx} RETURNING *`;
      const res = await db.query(query, values);
      return res.rows[0];
    },

    hapusDiagnosaInap: async (_, { id_diagnosa_inap }) => {
      const res = await db.query('DELETE FROM diagnosa_inap WHERE id_diagnosa_inap = $1', [id_diagnosa_inap]);
      return res.rowCount > 0;
    },

    // Rawat Inap
    tambahRawatInap: async (_, args) => {
      const {
        id_pasien,
        id_kamar,
        id_nakes,
        id_diagnosa_inap,
        id_tindakan_inap,
        id_resep,
        id_kunjungan,
        tanggal_masuk,
        tanggal_keluar,
        detail_diagnosa,
        status,
        total_biaya,
      } = args;

      const res = await db.query(
        `INSERT INTO rawat_inap
          (id_pasien, id_kamar, id_nakes, id_diagnosa_inap, id_tindakan_inap, id_resep, id_kunjungan, tanggal_masuk, tanggal_keluar, detail_diagnosa, status, total_biaya)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
        [
          id_pasien,
          id_kamar,
          id_nakes,
          id_diagnosa_inap,
          id_tindakan_inap,
          id_resep,
          id_kunjungan,
          tanggal_masuk,
          tanggal_keluar,
          detail_diagnosa,
          status,
          total_biaya,
        ]
      );
      return res.rows[0];
    },

    editRawatInap: async (_, args) => {
      const {
        id_rawat_inap,
        id_pasien,
        id_kamar,
        id_nakes,
        id_diagnosa_inap,
        id_tindakan_inap,
        id_resep,
        id_kunjungan,
        tanggal_masuk,
        tanggal_keluar,
        detail_diagnosa,
        status,
        total_biaya,
      } = args;

      const fields = [];
      const values = [];
      let idx = 1;

      if (id_pasien !== undefined) {
        fields.push(`id_pasien = $${idx++}`);
        values.push(id_pasien);
      }
      if (id_kamar !== undefined) {
        fields.push(`id_kamar = $${idx++}`);
        values.push(id_kamar);
      }
      if (id_nakes !== undefined) {
        fields.push(`id_nakes = $${idx++}`);
        values.push(id_nakes);
      }
      if (id_diagnosa_inap !== undefined) {
        fields.push(`id_diagnosa_inap = $${idx++}`);
        values.push(id_diagnosa_inap);
      }
      if (id_tindakan_inap !== undefined) {
        fields.push(`id_tindakan_inap = $${idx++}`);
        values.push(id_tindakan_inap);
      }
      if (id_resep !== undefined) {
        fields.push(`id_resep = $${idx++}`);
        values.push(id_resep);
      }
      if (id_kunjungan !== undefined) {
        fields.push(`id_kunjungan = $${idx++}`);
        values.push(id_kunjungan);
      }
      if (tanggal_masuk !== undefined) {
        fields.push(`tanggal_masuk = $${idx++}`);
        values.push(tanggal_masuk);
      }
      if (tanggal_keluar !== undefined) {
        fields.push(`tanggal_keluar = $${idx++}`);
        values.push(tanggal_keluar);
      }
      if (detail_diagnosa !== undefined) {
        fields.push(`detail_diagnosa = $${idx++}`);
        values.push(detail_diagnosa);
      }
      if (status !== undefined) {
        fields.push(`status = $${idx++}`);
        values.push(status);
      }
      if (total_biaya !== undefined) {
        fields.push(`total_biaya = $${idx++}`);
        values.push(total_biaya);
      }

      if (fields.length === 0) throw new Error('Tidak ada field yang diupdate');

      values.push(id_rawat_inap);
      const query = `UPDATE rawat_inap SET ${fields.join(', ')} WHERE id_rawat_inap = $${idx} RETURNING *`;
      const res = await db.query(query, values);
      return res.rows[0];
    },

    hapusRawatInap: async (_, { id_rawat_inap }) => {
      const res = await db.query('DELETE FROM rawat_inap WHERE id_rawat_inap = $1', [id_rawat_inap]);
      return res.rowCount > 0;
    },
  },
};

module.exports = resolvers;
