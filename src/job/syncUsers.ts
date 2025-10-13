import axios from "axios";
import dotenv from "dotenv";
import User from "../models/user.model";

dotenv.config();

const KEY_SYNC = process.env.KEY_SYNC || "";
const URL_SYNC_USERS = `https://sistem.poltekindonusa.ac.id/api/public/mahasiswa/tampil/?key=${KEY_SYNC}`;

export const syncUsers = async () => {
  try {
    const response = await axios.get(URL_SYNC_USERS);
    const users: any[] = response.data.data;

    if (!Array.isArray(users) || users.length === 0) {
      console.log("Tidak ada data user untuk disinkronisasi.");
      return;
    }

    console.log(`🔄 Syncing ${users.length} users...`);

    let inserted = 0;
    let updated = 0;

    // Gunakan for..of agar bisa pakai await
    for (const user of users) {
      const nim = user.nipd?.trim();
      const name = user.nm_pd?.trim();
      const password = user.pass?.trim();

      if (!nim || !name || !password) continue;

      const [record, created] = await User.upsert({
        nim,
        name,
        password,
        role: "MHS", // default role untuk mahasiswa
      });

      if (created) inserted++;
      else updated++;
    }

    console.log(`✅ Sync selesai: ${inserted} baru, ${updated} diperbarui.`);
  } catch (error: any) {
    console.error("❌ Gagal sync user:", error.message);
  }
};
