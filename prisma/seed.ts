import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Profile
  await prisma.profile.create({
    data: {
      name: 'Mahad Qasim',
      title: 'Project Manager | Solar Energy Specialist',
      bio: 'Portfolio of Mahad Qasim, a Project Management Professional (PMP) with experience in Solar Energy projects.',
      email: 'mahadqasim74@gmail.com',
      phone: '+913167044718',
      linkedin: 'https://www.linkedin.com/in/mahadqasim',
      whatsapp: 'https://wa.me/923167044718',
      imageUrl: '/profile.jpg',
    },
  })

  // Experience
  await prisma.experience.createMany({
    data: [
      {
        company: 'PEP Solar (Phoenix, Arizona)',
        role: 'Project Manager',
        startDate: 'June 2024',
        endDate: 'Present',
        description: JSON.stringify([
          'Led project planning and stakeholder engagement, coordinating over 60+ projects and delegating tasks to team members.',
          'Created databases of permit requirements for AHJs nationwide and utilized advanced Clickup for streamlined project management.',
          'Worked closely with design teams to enhance client satisfaction through prompt revisions and clear communication.',
        ]),
        order: 1,
      },
      {
        company: 'Green Home Systems (Northridge, CA)',
        role: 'Project Manager',
        startDate: 'Oct 2023',
        endDate: 'June 2024',
        description: JSON.stringify([
          'Overseeing project, stakeholder management, and client management.',
          'Managing New projects and assigning them to other teammates.',
          'Making Databases of the Permit Requirements of AHJs all over the USA.',
        ]),
        order: 2,
      },
      {
        company: 'Solar SME (Texas)',
        role: 'Project Manager',
        startDate: 'Feb 2023',
        endDate: 'Oct 2023',
        description: JSON.stringify([
          'Developed and managed multiple Smartsheets, employing complex formulas and automation for efficient project management.',
          'Oversaw project planning, scheduling, and coordination with various teams, ensuring the timely completion of over 30 projects.',
          'Facilitated design requests, collaborating with the design team for client satisfaction through proper revisions.',
        ]),
        order: 3,
      },
    ],
  })

  // Education
  await prisma.education.create({
    data: {
      institution: 'Air University - Islamabad Pakistan',
      degree: 'BE Mechatronics Engineering',
    },
  })

  // Skills
  const coreCompetencies = await prisma.skillCategory.create({
    data: {
      name: 'Core Competencies',
      order: 1,
    },
  })

  await prisma.skill.createMany({
    data: [
      'Planning', 'Organizing', 'Time Management', 'Communication', 'Problem-solving',
      'Leadership', 'Risk Management', 'Budgeting', 'Quality Management', 'cost control',
      'EPC coordination', 'Subcontractor oversight', 'mitigation planning', 'AHJ processes',
      'Client communication', 'Process optimization'
    ].map((name, index) => ({
      name,
      categoryId: coreCompetencies.id,
      order: index + 1,
    })),
  })

  const software = await prisma.skillCategory.create({
    data: {
      name: 'Software',
      order: 2,
    },
  })

  await prisma.skill.createMany({
    data: [
      'Smartsheet', 'Excel', 'Hubspot', 'Word', 'Trello', 'Monday', 'Coperniq',
      'clickup', 'JOB NIMBUS', 'Google Workspace', 'Salesforce', 'AutoCAD',
      'Helioscope', 'Open solar', 'Aurora Solar', 'Jira', 'asana', 'MS Project'
    ].map((name, index) => ({
      name,
      categoryId: software.id,
      order: index + 1,
    })),
  })

  // Certifications
  await prisma.certification.createMany({
    data: [
      { name: 'PMP®', imageUrl: '/certifications/PMP.jpg', order: 1 },
      { name: 'NABCEP® PVA', imageUrl: '/certifications/NABCEP_PVA.png', order: 2 },
      { name: 'BESS', imageUrl: '/certifications/Battery Energy Storage System (BESS).jpg', order: 3 },
      { name: 'ESO', imageUrl: '/certifications/Energy System Optimization (ESO).jpg', order: 4 },
      { name: 'Solar PV Procurement', imageUrl: '/certifications/Solar PV Procurement, Sales and Business.jpg', order: 5 },
      { name: 'Solar PV Project Management', imageUrl: '/certifications/Solar PV Project Management.jpg', order: 6 },
      { name: 'Enphase Installation', imageUrl: '/certifications/Enphase Solar PV installation certification assessment_Enphase Solar PV Installation Training Certificate.jpg', order: 7 },
      { name: 'IQ8 Installer', imageUrl: '/certifications/IQ8 Installer certification training final assessment_IQ8 Installer certification training certificate.jpg', order: 8 },
      { name: 'PWRcell Installation', imageUrl: '/certifications/Muhammad Mahad-Qasim_IntroductiontoPWRcellInstallation_2023-09-27.jpg', order: 9 },
      { name: 'Solar Roof Mounting', imageUrl: '/certifications/Muhammad-Mahad-Know-Your-Code-8211-Solar-Roof-Mounting-Know-Your-Code-IronRidge.jpg', order: 10 },
      { name: 'Energy Hub', imageUrl: '/certifications/632_27_1744365_1694629238_Energy Hub Cert--NAM.jpg', order: 11 },
      { name: 'LG RESU Gen3 EG', imageUrl: '/certifications/[LG Energy Solution]231003_Certified Installer_RESU Gen3_EG_Muhammad Mahad_Qasim.jpg', order: 12 },
      { name: 'LG RESU Gen3 MI', imageUrl: '/certifications/[LG Energy Solution]231005_Certified Installer_RESU Gen3_MI_Muhammad Mahad_Qasim.jpg', order: 13 },
      { name: 'NEC code updates', imageUrl: '/certifications/certificate.jpg', order: 14 },
    ],
  })

  // Projects
  await prisma.project.create({
    data: {
      title: 'Dual Axis Solar Tracker',
      subtitle: 'Energy Harnessing Using Solar Tracking System',
      description: JSON.stringify([
        'A dual axis tracker system that tracks the sun through out the day and maintains optimal hitting angle for solar rays improving efficiency upto 28.59%.',
        'Mechanical Design of the System.',
        'Mechanical design, fabrication, and implementation of the system with control and tracking software.',
        'Data logging using sensors and a cleaning system with a sprinkler.',
        'IoT-based with Arduino IoT app setup for self-locking and stabilization during high winds.',
      ]),
      imageUrl: '/solar-tracker.png',
      order: 1,
    },
  })

  // Publications
  await prisma.publication.create({
    data: {
      title: 'Mechatronic Design of a Two-Axis Solar Tracker System for Improved Efficiency',
      link: 'https://ieeexplore.ieee.org/document/10465984?source=AUTHORALERT&dld=Z21haWwuY29t',
      imageUrl: '/publication.png',
      order: 1,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
