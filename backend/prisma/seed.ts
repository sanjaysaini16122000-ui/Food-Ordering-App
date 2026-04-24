import { PrismaClient } from '@prisma/client';
import { Role, Country, OrderStatus } from '../src/common/enums';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@foodapp.com' },
    update: {},
    create: {
      email: 'admin@foodapp.com',
      password,
      name: 'Global Admin',
      role: Role.ADMIN,
      country: Country.INDIA, // Admin can be based anywhere but has global access in logic
    },
  });

  const indiaManager = await prisma.user.upsert({
    where: { email: 'manager_in@foodapp.com' },
    update: {},
    create: {
      email: 'manager_in@foodapp.com',
      password,
      name: 'India Manager',
      role: Role.MANAGER,
      country: Country.INDIA,
    },
  });

  const usaManager = await prisma.user.upsert({
    where: { email: 'manager_us@foodapp.com' },
    update: {},
    create: {
      email: 'manager_us@foodapp.com',
      password,
      name: 'USA Manager',
      role: Role.MANAGER,
      country: Country.AMERICA,
    },
  });

  const indiaMember = await prisma.user.upsert({
    where: { email: 'member_in@foodapp.com' },
    update: {},
    create: {
      email: 'member_in@foodapp.com',
      password,
      name: 'India Member',
      role: Role.MEMBER,
      country: Country.INDIA,
    },
  });

  // 2. Create Restaurants & Menu Items (INDIA)
  const spicyIndra = await prisma.restaurant.create({
    data: {
      name: 'Spicy Indra',
      description: 'Authentic Indian Curry & Tandoor',
      country: Country.INDIA,
      menuItems: {
        create: [
          { name: 'Paneer Tikka', price: 250, description: 'Grilled cottage cheese' },
          { name: 'Butter Chicken', price: 350, description: 'Creamy tomato gravy chicken' },
          { name: 'Garlic Naan', price: 50, description: 'Leavened bread with garlic' },
        ],
      },
    },
  });

  // 3. Create Restaurants & Menu Items (AMERICA)
  const libertyBurger = await prisma.restaurant.create({
    data: {
      name: 'Liberty Burger',
      description: 'Classic American Burgers & Shakes',
      country: Country.AMERICA,
      menuItems: {
        create: [
          { name: 'Empire Burger', price: 12.99, description: 'Double patty with cheese' },
          { name: 'Freedom Fries', price: 4.5, description: 'Large salty fries' },
          { name: 'Vanilla Shake', price: 6.0, description: 'Thick creamy vanilla' },
        ],
      },
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
