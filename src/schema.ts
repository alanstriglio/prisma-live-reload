import { pascalCase } from "change-case";
import { objectType, makeSchema } from "nexus"
import { join } from "path"
import { adjectives, animals, colors, Config, uniqueNamesGenerator } from 'unique-names-generator';
import { addModelToSchema, migrateDatabase } from "./utils";

export const MigrationStatus = objectType({
    name: 'MigrationStatus',
    definition(t) {
        t.boolean('status')
        t.string('info')
    }
})

export const ClientStatus = objectType({
    name: 'ClientStatus',
    definition(t) {
        t.list.string('models')
    }
})

export const Mutation = objectType({
    name: 'Mutation',
    definition(t) {
        t.field('addRandomModel', {
            type: MigrationStatus,
            resolve: async (_, args, context, info) => {
                // add random model to schema.prisma
                const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], separator: ' ' }); // big_red_donkey

                await addModelToSchema(pascalCase(randomName))

                await migrateDatabase(`added model ${pascalCase(randomName)}`)

                return {
                    status: true,
                    info: pascalCase(randomName)
                }
            },
        })
    },
})

export const Query = objectType({
    name: 'Query',
    definition(t) {
        t.field('checkClient', {
            type: ClientStatus,
            resolve: async (_, args, context, info) => {
                const props = Object.getOwnPropertyNames(context.prisma)

                return {
                    models: props.filter(prop => prop[0] != '_')
                }
            },
        })
    },
})

export const schema = makeSchema({
    types: [
        MigrationStatus, ClientStatus,
        Query,
        Mutation
    ],
    outputs: {
        typegen: join(__dirname, 'generated', 'nexus-typegen.ts'),
        schema: join(__dirname, 'generated', 'schema.graphql'),
    },
})
