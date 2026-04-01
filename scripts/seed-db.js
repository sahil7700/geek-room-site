require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Seed Team
  const teamPath = path.join(__dirname, '..', 'data', 'team.json');
  if (fs.existsSync(teamPath)) {
    const teamData = JSON.parse(fs.readFileSync(teamPath, 'utf-8'));
    console.log(`Found ${teamData.length} team members. Seeding...`);
    
    // Clear existing to avoid duplicates in case they ran it already
    await prisma.teamMember.deleteMany({});
    
    // Using createMany or a loop
    for (const member of teamData) {
      await prisma.teamMember.create({
        data: {
          id: member.id,
          name: member.name,
          role: member.role || "",
          category: member.category,
          photo: member.photo,
          gmail: member.gmail || "",
          linkedin: member.linkedin || ""
        }
      });
    }
    console.log('Team members seeded successfully.');
  }

  // Seed Events
  const eventsPath = path.join(__dirname, '..', 'data', 'events.json');
  if (fs.existsSync(eventsPath)) {
    const eventsData = JSON.parse(fs.readFileSync(eventsPath, 'utf-8'));
    console.log(`Found ${eventsData.length} events. Seeding...`);
    
    await prisma.event.deleteMany({});
    
    for (const event of eventsData) {
      const createdEvent = await prisma.event.create({
        data: {
          id: event.id,
          title: event.title,
          description: event.description,
          date: new Date(event.date),
          location: event.location,
          image: event.image,
          status: event.status,
          category: event.category || "tech-event",
          time: event.time || "",
          registrationOpen: false,
          gallery: event.gallery || [],
        }
      });

      // Seed winners if any
      if (event.winners && event.winners.length > 0) {
        for (const winner of event.winners) {
          await prisma.winner.create({
            data: {
              eventId: createdEvent.id,
              rank: winner.rank,
              teamName: winner.teamName,
              members: winner.members || [],
              photo: winner.photo || ""
            }
          });
        }
      }
    }
    console.log('Events seeded successfully.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
