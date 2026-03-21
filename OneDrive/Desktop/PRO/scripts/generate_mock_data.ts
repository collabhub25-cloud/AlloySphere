import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

dotenv.config({ path: '.env.local' });

// We define minimal schemas here to avoid Next.js specific imports or circular dependencies
const UserSchema = new mongoose.Schema({
  email: String,
  passwordHash: String,
  name: String,
  role: String,
  verificationLevel: Number,
  trustScore: Number,
  kycStatus: String,
  kycLevel: Number,
  bio: String,
  skills: [String],
  experience: String,
  location: String,
  isEmailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}, { strict: false });

const StartupSchema = new mongoose.Schema({
  founderId: mongoose.Schema.Types.ObjectId,
  name: String,
  vision: String,
  description: String,
  stage: String,
  industry: String,
  fundingStage: String,
  trustScore: Number,
  isActive: Boolean,
  rolesNeeded: [{
    title: String,
    description: String,
    skills: [String],
    compensationType: String,
    status: String
  }],
  createdAt: Date,
  updatedAt: Date
}, { strict: false });

const AgreementSchema = new mongoose.Schema({
  type: String,
  startupId: mongoose.Schema.Types.ObjectId,
  parties: [mongoose.Schema.Types.ObjectId],
  terms: {
    equityPercent: Number,
    compensation: Number,
    deliverables: [String]
  },
  content: String,
  status: String,
  version: Number,
  signedBy: [{
    userId: mongoose.Schema.Types.ObjectId,
    signedAt: Date,
    signatureHash: String
  }],
  createdAt: Date,
  updatedAt: Date
}, { strict: false });

// Register models
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Startup = mongoose.models.Startup || mongoose.model('Startup', StartupSchema);
const Agreement = mongoose.models.Agreement || mongoose.model('Agreement', AgreementSchema);

async function generateMockData() {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!uri) throw new Error('No MONGODB_URI in .env.local');

  await mongoose.connect(uri);
  console.log('Connected to DB');

  // Helper function to create users
  const createUsers = async (count: number, role: string) => {
    const users: any[] = [];
    for (let i = 0; i < count; i++) {
        const user = await User.create({
            email: faker.internet.email().toLowerCase(),
            passwordHash: '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', // dummy hash
            name: faker.person.fullName(),
            role: role,
            verificationLevel: 5,
            trustScore: faker.number.int({ min: 80, max: 100 }),
            kycStatus: 'verified',
            kycLevel: 2,
            bio: faker.lorem.paragraph(),
            skills: [faker.word.sample(), faker.word.sample(), faker.word.sample()],
            experience: faker.lorem.sentence(),
            location: faker.location.city(),
            isEmailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        users.push(user);
    }
    return users;
  };

  console.log('Clearing old mock data might be dangerous, appending new mock data...');

  console.log('Generating 30 Talent Users...');
  const talents = await createUsers(30, 'talent');

  console.log('Generating 10 Founder Users...');
  const founders = await createUsers(10, 'founder');

  console.log('Generating 20 Investor Users...');
  const investors = await createUsers(20, 'investor');

  console.log('Generating 15 Startups...');
  const startups: any[] = [];
  
  // 5 founders with 2 startups each
  for(let i = 0; i < 5; i++) {
      for(let j=0; j<2; j++) {
        const startup = await Startup.create({
            founderId: founders[i]._id,
            name: faker.company.name(),
            vision: faker.company.catchPhrase(),
            description: faker.lorem.paragraphs(2),
            stage: faker.helpers.arrayElement(['idea', 'validation', 'mvp', 'growth', 'scaling']),
            industry: faker.commerce.department(),
            fundingStage: faker.helpers.arrayElement(['pre-seed', 'seed', 'series-a']),
            trustScore: faker.number.int({ min: 80, max: 100 }),
            isActive: true,
            rolesNeeded: [
                {
                    title: 'Software Engineer',
                    description: 'Build our product',
                    skills: ['React', 'Node.js'],
                    compensationType: 'equity',
                    status: 'open'
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        });
        startups.push(startup);
      }
  }

  // 5 founders with 1 startup each
  for(let i = 5; i < 10; i++) {
    const startup = await Startup.create({
        founderId: founders[i]._id,
        name: faker.company.name(),
        vision: faker.company.catchPhrase(),
        description: faker.lorem.paragraphs(2),
        stage: faker.helpers.arrayElement(['idea', 'validation', 'mvp', 'growth', 'scaling']),
        industry: faker.commerce.department(),
        fundingStage: faker.helpers.arrayElement(['pre-seed', 'seed', 'series-a']),
        trustScore: faker.number.int({ min: 80, max: 100 }),
        isActive: true,
        rolesNeeded: [
            {
                title: 'Marketing Lead',
                description: 'Grow our product',
                skills: ['Marketing', 'SEO'],
                compensationType: 'cash',
                status: 'open'
            }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    });
    startups.push(startup);
  }

  console.log('Generating Agreements...');
  // Agreements: Talent + Founder (work/equity)
  for(let i=0; i<15; i++) {
      const talent = faker.helpers.arrayElement(talents);
      const startup = faker.helpers.arrayElement(startups);
      
      await Agreement.create({
          type: faker.helpers.arrayElement(['work', 'equity']),
          startupId: startup._id,
          parties: [talent._id, startup.founderId],
          terms: {
              equityPercent: faker.number.int({min: 1, max: 10}),
              compensation: faker.number.int({min: 1000, max: 10000}),
              deliverables: ['MVP', 'Website']
          },
          content: 'This is a standard agreement created by mock script.',
          status: 'signed',
          version: 1,
          signedBy: [
              { userId: talent._id, signedAt: new Date(), signatureHash: 'hash1' },
              { userId: startup.founderId, signedAt: new Date(), signatureHash: 'hash2' }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
      });
  }

  // Agreements: Founder + Investor (investment/safe)
  for(let i=0; i<10; i++) {
      const investor = faker.helpers.arrayElement(investors);
      const startup = faker.helpers.arrayElement(startups);

      await Agreement.create({
          type: faker.helpers.arrayElement(['investment', 'safe']),
          startupId: startup._id,
          parties: [investor._id, startup.founderId],
          terms: {
              equityPercent: faker.number.int({min: 5, max: 20}),
              compensation: faker.number.int({min: 50000, max: 500000}),
              deliverables: ['Investment']
          },
          content: 'This is a standard investment agreement created by mock script.',
          status: 'signed',
          version: 1,
          signedBy: [
              { userId: investor._id, signedAt: new Date(), signatureHash: 'hash3' },
              { userId: startup.founderId, signedAt: new Date(), signatureHash: 'hash4' }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
      });
  }

  console.log('Done generating all mock data!');
  await mongoose.disconnect();
}

generateMockData().catch(console.error);
