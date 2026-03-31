const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Resetting TeamMember id sequence...");
    const result = await prisma.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('"TeamMember"', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM "TeamMember";
    `);
    console.log("Sequence reset successfully. Result:", result);
  } catch (error) {
    console.error("Error resetting sequence:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
