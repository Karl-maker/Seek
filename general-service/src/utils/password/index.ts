import bcrypt from 'bcrypt';

async function comparePassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // You can adjust the number of salt rounds for security
  return await bcrypt.hash(password, saltRounds);
}

export default {
    hash: hashPassword,
    compare: comparePassword
}
