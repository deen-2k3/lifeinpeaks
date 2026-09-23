/**
 * Create or reset an admin account.
 *   npm run admin:create -- --email you@example.com --password "a-long-password" [--name "Your Name"]
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

function arg(name: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  const email = (arg("email") ?? process.env.ADMIN_EMAIL ?? "").toLowerCase().trim();
  const password = arg("password") ?? process.env.ADMIN_PASSWORD ?? "";
  const name = arg("name");
  if (!email || !password) throw new Error('Usage: npm run admin:create -- --email you@example.com --password "long-password"');
  if (password.length < 10) throw new Error("Password must be at least 10 characters.");

  const prisma = new PrismaClient();
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({ where: { email }, create: { email, passwordHash, name }, update: { passwordHash, ...(name ? { name } : {}) } });
  console.log(`✔ Admin ready: ${user.email}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("✖", e.message);
  process.exit(1);
});
