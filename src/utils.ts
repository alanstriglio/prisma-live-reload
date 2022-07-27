
import * as fs from 'fs/promises';
import { spawn } from 'child_process'
import { join } from 'path';

export const addModelToSchema = async (name: string) => {
    console.log('Utils - addRandomModel')

    const schemaBase = await fs.readFile(join(__dirname, '..', 'prisma', 'schema.prisma'), 'utf-8')

    const schemaModel = `
model ${name} {
    id String @id @default(cuid())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}
`
    await fs.writeFile(join(__dirname, '..', 'prisma', 'schema.prisma'), schemaBase + `\n\n` + schemaModel)
}

export const migrateDatabase = async (migrationName = 'migration'): Promise<boolean> => {
    console.log('Utils - migrateDatabase')

    await createMigration(migrationName)

    await deployMigration()
    await generatePrismaClient()

    return true
}

export const createMigration = async (migrationName: string): Promise<boolean> => {
    console.log('Utils - createMigration')
    return new Promise((resolve, reject) => {
        const clires = spawn(`npx prisma migrate dev --name "${migrationName}" --create-only`, [], { shell: true, stdio: 'inherit' })

        clires.on('close', (code) => {
            if (code !== 0) {
                reject('creating migration error')
            }
            resolve(true)
        })

    })
}

export const deployMigration = async (): Promise<boolean> => {
    console.log('Utils - deployMigration')
    return new Promise((resolve, reject) => {
        // deploy migration
        const clires = spawn(`npx prisma migrate deploy`, [], { shell: true, stdio: 'inherit' })

        clires.on('close', (code) => {
            if (code !== 0) {
                reject('migration deploy error')
            }
            resolve(true)
        })
    })
}

export const generatePrismaClient = async (): Promise<boolean> => {
    console.log('Utils - generatePrismaClient')
    return new Promise((resolve, reject) => {
        // deploy migration
        const clires = spawn(`npx prisma generate`, [], { shell: true, stdio: 'inherit' })

        clires.on('close', (code) => {
            if (code !== 0) {
                reject('generate deploy error')
            }
            resolve(true)
        })
    })
}