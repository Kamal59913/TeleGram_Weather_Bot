import { config } from 'dotenv';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

config();

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
  },
  { collection: 'admins', timestamps: true },
);

const Admin = mongoose.model('Admin', adminSchema);

async function seedAdmin() {
  const dbUri = process.env.DB_URI;
  if (!dbUri) {
    throw new Error('DB_URI is required in .env');
  }

  const adminName = process.env.ADMIN_SEED_NAME || 'System Admin';
  const adminEmail = (process.env.ADMIN_SEED_EMAIL || 'admin@example.com').toLowerCase();
  const adminUsername = process.env.ADMIN_SEED_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'Admin@123';

  await mongoose.connect(dbUri);

  const existingAdmin = await Admin.findOne({
    $or: [{ email: adminEmail }, { username: adminUsername }],
  });

  if (existingAdmin) {
    console.log('Admin already exists. Seed skipped.');
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await Admin.create({
    name: adminName,
    email: adminEmail,
    username: adminUsername,
    password: hashedPassword,
  });

  console.log('Admin seed completed successfully.');
  await mongoose.disconnect();
}

seedAdmin().catch(async (error) => {
  console.error('Admin seed failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});
