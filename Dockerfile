# Gunakan image Node.js resmi
FROM node:20

# Buat direktori kerja
WORKDIR /app

# Salin file package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Salin semua source code ke dalam image
COPY . .

# Ekspose port yang digunakan (default: 8003)
EXPOSE 8003

# Jalankan aplikasi
CMD ["node", "rawat_inap.js"]
