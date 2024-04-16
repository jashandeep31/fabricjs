import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// export async function db() {
export default db;
//   return await prisma.$connect();
// }
