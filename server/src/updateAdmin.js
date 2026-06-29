import mongoose from 'mongoose';
import User from './models/User.js';
import env from './config/env.js';

async function updateAdmin() {
  await mongoose.connect(env.mongodbUri);
  const existing = await User.findOne({ role: 'admin' });
  if (existing) {
    existing.email = 'admin@gmail.com';
    existing.password = '123456';
    await existing.save();
    console.log('Admin updated: admin@gmail.com / 123456');
  } else {
    await User.create({
      name: 'مدير المتجر',
      email: 'admin@gmail.com',
      password: '123456',
      role: 'admin',
      referralCode: 'FURN-ADMIN',
    });
    console.log('Admin created: admin@gmail.com / 123456');
  }
  await mongoose.disconnect();
}

updateAdmin().catch(console.error);
