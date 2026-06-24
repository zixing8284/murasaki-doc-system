
const { PrismaClient } = require('@prisma/client')
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
const { faker } = require('@faker-js/faker')
const { hash } = require('bcrypt-ts')

require('./envConfig.cjs')

const adapter = new PrismaBetterSqlite3(
  { url: process.env.DATABASE_URL || 'file:./prisma/dev.db' },
  { timestampFormat: 'unixepoch-ms' },
)
const prisma = new PrismaClient({ adapter })



async function main () {

  // Delete all existing data in the correct order
  await prisma.post.deleteMany({})
  await prisma.postCategory.deleteMany({})
  await prisma.file.deleteMany({})
  await prisma.fileCategory.deleteMany({})
  await prisma.template.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.department.deleteMany({})


  const hashedPassword = await hash('super_admin', 5)

  let department = await prisma.department.findUnique({
    where: {
      name: '示例部门'
    }
  })
  if (!department) {
    department = await prisma.department.create({
      data: {
        name: '示例部门',
        parentId: null,
      }
    })
  }

  const user = await prisma.user.create({
    // include all the posts and categories in the return objects
    include: {
      posts: {
        include: {
          categories: true
        }
      },
      department: true
    },

    data: {
      name: 'super_admin',
      email: faker.internet.email(),
      password: hashedPassword,
      type: 'super_admin',
      department: {
        connect: {
          id: department.id
        }
      },
      posts: {
        create: [
          {
            title: faker.lorem.sentence(),
            content: JSON.stringify([
              {
                children: [
                  {
                    text: '',
                  },
                ],
                type: 'p',
              },
            ]),
            categories: {
              connectOrCreate: [
                {
                  where: { name: 'Technology' },
                  create: { name: 'Technology' }
                },
                {
                  where: { name: 'Science' },
                  create: { name: 'Science' }
                }
              ]
            }
          },
          {
            title: faker.lorem.sentence(),
            content: JSON.stringify([
              {
                children: [
                  {
                    text: '',
                  },
                ],
                type: 'p',
              },
            ]),
            categories: {
              connectOrCreate: [
                {
                  where: { name: 'Technology' },
                  create: { name: 'Technology' }
                },
                {
                  where: { name: 'Science' },
                  create: { name: 'Science' }
                }
              ]
            }
          }

        ]
      }
    }
  })


  const filesAndCategories = await Promise.all([
    prisma.file.create({
      data: {
        userId: user.id,
        originalName: faker.system.fileName(),
        storageName: faker.system.fileName(),
        path: faker.system.filePath(),
        size: faker.number.bigInt(),
        type: faker.system.fileExt(),
        categories: { create: [{ name: '规章制度' }, { name: '会议精神' }] }
      }
    }),
    prisma.file.create({
      data: {
        userId: user.id,
        originalName: faker.system.fileName(),
        storageName: faker.system.fileName(),
        path: faker.system.filePath(),
        size: faker.number.bigInt(),
        type: faker.system.fileExt(),
      }
    }),
  ])

}

// only run the seed in development environment
console.log('process.env.SEED_DEVELOPMENT:', process.env.SEED_DEVELOPMENT)
if (process.env.SEED_DEVELOPMENT === 'true') {
  main()
    .catch(e => {
      throw e
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
} else {
  console.log('This script is only for development environment.')
  process.exit(1)
}
