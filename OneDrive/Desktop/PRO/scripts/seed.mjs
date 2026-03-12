import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://collabhubAdmin:murarijagansai@collabhub.18ydvxf.mongodb.net/collabhub?retryWrites=true&w=majority&appName=CollabHub';

// Wait, NextJS uses the 'default' DB in the connection URI. 
// The URI in .env.local is: mongodb+srv://collabhubAdmin:murarijagansai@collabhub.18ydvxf.mongodb.net/?appName=CollabHub
// I need to specify the DB name. If no DB name is in .env.local, maybe it's just 'test'.
// Let's connect the same way the app does.

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(MONGODB_URI);
}

// Basic schemas to avoid needing ts-node and complex imports
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  verificationLevel: { type: Number, default: 0 },
  trustScore: { type: Number, default: 50 },
  kycStatus: { type: String, default: 'not_submitted' },
  bio: String,
  skills: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const StartupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: { type: String, required: true },
  stage: { type: String, required: true },
  fundingStage: { type: String, required: true },
  vision: String,
  description: String,
  founderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  trustScore: { type: Number, default: 0 },
  AlloySphereVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const FundingRoundSchema = new mongoose.Schema({
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup' },
  roundName: String,
  targetAmount: Number,
  raisedAmount: Number,
  equityOffered: Number,
  valuation: Number,
  minInvestment: Number,
  status: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ApplicationSchema = new mongoose.Schema({
  talentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup' },
  roleId: { type: mongoose.Schema.Types.ObjectId }, // dummy
  coverLetter: String,
  status: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AgreementSchema = new mongoose.Schema({
  title: String,
  type: { type: String },
  status: { type: String },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup' },
  parties: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    role: String,
    signedAt: Date
  }],
  signedBy: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    signedAt: Date
  }],
  createdAt: { type: Date, default: Date.now }
});

const VerificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: String,
    type: { type: String },
    level: Number,
    status: String,
});

const AllianceSchema = new mongoose.Schema({
    startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup' },
    targetStartupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup' },
    status: String,
    message: String,
    createdAt: { type: Date, default: Date.now },
});

// Mock Models
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Startup = mongoose.models.Startup || mongoose.model('Startup', StartupSchema);
const FundingRound = mongoose.models.FundingRound || mongoose.model('FundingRound', FundingRoundSchema);
const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
const Agreement = mongoose.models.Agreement || mongoose.model('Agreement', AgreementSchema);
const Verification = mongoose.models.Verification || mongoose.model('Verification', VerificationSchema);
const Alliance = mongoose.models.Alliance || mongoose.model('Alliance', AllianceSchema);

async function seed() {
  console.log('Connecting to database...');
  await connectToDatabase();
  console.log('Connected!');

  // 1. Wipe database
  console.log('Wiping collections...');
  await Promise.all([
    User.deleteMany({}),
    Startup.deleteMany({}),
    FundingRound.deleteMany({}),
    Application.deleteMany({}),
    Agreement.deleteMany({}),
    Verification.deleteMany({}),
    mongoose.connection.db.collection('alliances').deleteMany({}).catch(() => {})
  ]);

  // 2. Create users
  const passwordHash = bcrypt.hashSync('1949Love@@', 12);

  console.log('Creating users...');
  const founder = await User.create({
    email: 'murarijagansai@gmail.com',
    passwordHash,
    name: 'Murari Jagansai',
    role: 'founder',
    verificationLevel: 2, // Set to 2 to bypass all UI limits
    kycStatus: 'verified',
    bio: 'Visionary founder building the next big thing',
    skills: ['Leadership', 'Product Management']
  });

  const investor = await User.create({
    email: 'collabhub25@gmail.com',
    passwordHash,
    name: 'AlloySphere Ventures',
    role: 'investor',
    verificationLevel: 2,
    kycStatus: 'verified',
    bio: 'Early-stage tech investor',
    skills: ['Finance', 'Due Diligence']
  });

  const talent = await User.create({
    email: 'jaganloveyou3000@gmail.com',
    passwordHash,
    name: 'Jagan Talent',
    role: 'talent',
    verificationLevel: 3,
    kycStatus: 'verified',
    bio: 'Full-stack developer looking for exciting startups',
    skills: ['React', 'Node.js', 'TypeScript']
  });

  // Create verification records
  await Promise.all([
    Verification.create({ userId: founder._id, role: 'founder', type: 'profile', level: 0, status: 'approved' }),
    Verification.create({ userId: founder._id, role: 'founder', type: 'kyc-business', level: 1, status: 'approved' }),
    Verification.create({ userId: founder._id, role: 'founder', type: 'kyc-id', level: 2, status: 'approved' }),

    Verification.create({ userId: talent._id, role: 'talent', type: 'profile', level: 0, status: 'approved' }),
    Verification.create({ userId: talent._id, role: 'talent', type: 'skill_test', level: 1, status: 'approved' }),
  ]);

  // 3. Create start-ups for founder
  console.log('Creating startups...');
  const startup1 = await Startup.create({
    name: 'Alpha AI',
    industry: 'Artificial Intelligence',
    stage: 'mvp',
    fundingStage: 'seed',
    vision: 'Bringing AGI to the masses',
    description: 'Alpha AI focuses on consumer applications of large language models.',
    founderId: founder._id,
    trustScore: 85,
    AlloySphereVerified: true,
  });

  const startup2 = await Startup.create({
    name: 'GreenTech Solutions',
    industry: 'Clean Energy',
    stage: 'growth',
    fundingStage: 'series-a',
    vision: 'Sustainable solar optimization',
    description: 'Hardware/software hybrid for optimizing solar panels.',
    founderId: founder._id,
    trustScore: 92,
  });

  // 4. Create Funding Rounds
  console.log('Creating funding rounds...');
  await FundingRound.create({
    startupId: startup1._id,
    roundName: 'Seed',
    targetAmount: 500000,
    raisedAmount: 150000,
    equityOffered: 10,
    valuation: 5000000,
    minInvestment: 10000,
    status: 'open'
  });

  await FundingRound.create({
    startupId: startup2._id,
    roundName: 'Series A',
    targetAmount: 2000000,
    raisedAmount: 2000000,
    equityOffered: 15,
    valuation: 13333333,
    minInvestment: 50000,
    status: 'closed' // already closed
  });

  // 5. Create Alliance Requests (Mock target startup for Alliance)
  console.log('Creating alliances...');
  const otherFounder = await User.create({
    email: 'other@example.com',
    passwordHash,
    name: 'Other Founder',
    role: 'founder',
    verificationLevel: 2
  });
  const otherStartup = await Startup.create({
    name: 'DataSync',
    industry: 'SaaS',
    stage: 'mvp',
    fundingStage: 'seed',
    founderId: otherFounder._id
  });

  // Insert alliance request directly
  await mongoose.connection.db.collection('alliances').insertOne({
    requesterId: otherFounder._id,
    receiverId: founder._id,
    targetStartupId: startup1._id,
    startupId: otherStartup._id,
    status: 'pending',
    message: 'We should integrate our AI with your DataSync platform.',
    createdAt: new Date()
  });
  
  await mongoose.connection.db.collection('alliances').insertOne({
    requesterId: founder._id,
    receiverId: otherFounder._id,
    targetStartupId: otherStartup._id,
    startupId: startup2._id,
    status: 'accepted',
    message: 'Let us collaborate on green data centers.',
    createdAt: new Date()
  });

  // 6. Create Application (Talent -> Startup)
  console.log('Creating applications and agreements...');
  const app = await Application.create({
    talentId: talent._id,
    startupId: startup1._id,
    roleId: new mongoose.Types.ObjectId(), // fake
    coverLetter: 'I would love to help you build AGI!',
    status: 'accepted'
  });

  // 7. Create Agreement between Founder and Talent
  await Agreement.create({
    title: 'Employment Agreement',
    type: 'Work',
    status: 'signed',
    startupId: startup1._id,
    parties: [
      { userId: founder._id, name: founder.name, email: founder.email, role: 'founder' },
      { userId: talent._id, name: talent.name, email: talent.email, role: 'talent' }
    ],
    signedBy: [
      { userId: founder._id, signedAt: new Date() },
      { userId: talent._id, signedAt: new Date() }
    ]
  });

  // 8. Create Agreement with Investor
  await Agreement.create({
    title: 'SAFE Note',
    type: 'SAFE',
    status: 'pending_signature',
    startupId: startup1._id,
    parties: [
      { userId: founder._id, name: founder.name, email: founder.email, role: 'founder' },
      { userId: investor._id, name: investor.name, email: investor.email, role: 'investor' }
    ],
    signedBy: [
      { userId: founder._id, signedAt: new Date() }
      // Investor has not signed yet
    ]
  });

  console.log('Done seeding the database!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
