import bcrypt from 'bcryptjs';

const password = process.argv[2];
if (!password) {
  console.error('Cara pakai: npm run hash-password -- "PasswordAdminAnda"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
console.log('\nSalin baris ini ke file .env Anda:');
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
