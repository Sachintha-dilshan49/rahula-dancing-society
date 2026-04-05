import { prisma } from './src/config/prisma';

async function main() {
  try {
    const note = await (prisma as any).note.create({
      data: {
        title: 'Test Note',
        content: '<p>hi</p>',
        studentId: 'ca9afa42-abce-4551-b9be-6e3dda8d65e2'
      }
    });
    console.log('SUCCESS - Note created:', note.id);
  } catch(e: any) {
    console.error('PRISMA ERROR:', e.message);
  }
}

main();
