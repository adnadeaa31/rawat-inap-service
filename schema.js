const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  type Kamar {
    id_kamar: ID!
    nomor_kamar: String!
    kelas_kamar: String!
    tarif_per_hari: Float!
  }

  type TindakanInap {
    id_tindakan_inap: ID!
    nama_tindakan: String
    tanggal_tindakan: Date
    kode_icd9: String
  }

  type DiagnosaInap {
    id_diagnosa_inap: ID!
    id_rawat_inap: Int
    id_kunjungan: Int
    nama_diagnosa: String
    kode_icd10: String
  }

  type RawatInap {
    id_rawat_inap: ID!
    id_pasien: Int
    id_kamar: Int
    id_nakes: Int
    id_diagnosa_inap: Int
    id_tindakan_inap: Int
    id_resep: Int
    id_kunjungan: Int
    tanggal_masuk: Date
    tanggal_keluar: Date
    detail_diagnosa: String
    status: String
    total_biaya: Float

    kamar: Kamar
    diagnosa: DiagnosaInap
    tindakan: TindakanInap
  }

  type Query {
    semuaRawatInap: [RawatInap]
    rawatInap(id: ID!): RawatInap

    semuaKamar: [Kamar]
    kamar(id: ID!): Kamar

    semuaDiagnosaInap: [DiagnosaInap]
    diagnosaInap(id_kunjungan: Int!): DiagnosaInap

    semuaTindakanInap: [TindakanInap]
    tindakanInap(id: ID!): TindakanInap
  }

  type Mutation {
    # Kamar
    tambahKamar(nomor_kamar: String!, kelas_kamar: String!, tarif_per_hari: Float!): Kamar
    editKamar(id_kamar: ID!, nomor_kamar: String, kelas_kamar: String, tarif_per_hari: Float): Kamar
    hapusKamar(id_kamar: ID!): Boolean

    # Tindakan Inap
    tambahTindakanInap(nama_tindakan: String, tanggal_tindakan: Date, kode_icd9: String): TindakanInap
    editTindakanInap(id_tindakan_inap: ID!, nama_tindakan: String, tanggal_tindakan: Date, kode_icd9: String): TindakanInap
    hapusTindakanInap(id_tindakan_inap: ID!): Boolean

    # Diagnosa Inap
    tambahDiagnosaInap(id_rawat_inap: Int, nama_diagnosa: String, kode_icd10: String): DiagnosaInap
    editDiagnosaInap(id_diagnosa_inap: ID!, id_rawat_inap: Int, nama_diagnosa: String, kode_icd10: String): DiagnosaInap
    hapusDiagnosaInap(id_diagnosa_inap: ID!): Boolean

    # Rawat Inap
    tambahRawatInap(
      id_pasien: Int,
      id_kamar: Int,
      id_nakes: Int,
      id_diagnosa_inap: Int,
      id_tindakan_inap: Int,
      id_resep: Int,
      id_kunjungan: Int,
      tanggal_masuk: Date,
      tanggal_keluar: Date,
      nama_diagnosa: String,
      status: String,
      total_biaya: Float
    ): RawatInap

    editRawatInap(
      id_rawat_inap: ID!,
      id_pasien: Int,
      id_kamar: Int,
      id_nakes: Int,
      id_diagnosa_inap: Int,
      id_tindakan_inap: Int,
      id_resep: Int,
      id_kunjungan: Int,
      tanggal_masuk: Date,
      tanggal_keluar: Date,
      nama_diagnosa: String,
      status: String,
      total_biaya: Float
    ): RawatInap

    hapusRawatInap(id_rawat_inap: ID!): Boolean
  }
`;

module.exports = typeDefs;
