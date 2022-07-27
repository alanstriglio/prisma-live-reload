# GraphQL Server with Database Migration

This example show how to apply a migration to the database using prisma, while the app is running.

## Getting Started

### 1. Install dependencies
Download the repo and install dependencies

```
npm install
```

## 2. Create .env file
Create an env file with database credentials that will be used by prisma

```
DATABASE_URL=mysql://root:password@localhost:3306/prisma-live-reload
```

## 3. Configure Database and Prisma Client
Run the following command to create the database and generate the prisma client.
```
npx prisma migrate dev
```

## 4. Start Grahpql Server
Launch the graphql server with this command

```
npm run dev
```

Navigate to [http://localhost:4000](http://localhost:4000) in your browser to explore the API of your GraphQL server in a [Apollo Server](https://www.apollographql.com/docs/apollo-server/).

## Using the service
Now you can add a new Model on your database using `addRandomModel` mutation and show the available types on Prisma Client by use `checkClient` Query

### Check Prisma Client
The query show you all the model available on `prisma client`.

```gql
query Query {
  checkClient {
    models
  }
}
```

### Add Random Model
Running this mutation a model will:
* Edit schema.prisma by adding a new model with random name
* Create a new migration file with `npx prisma migrate dev --name "migration-name" --create-only`
* Deploy the migration on database with `npx prisma migrate deploy`
* Generate new Prisma Client with `npx prisma generate`

`Status field` will return the success of the migration
`Info field` will return the random model name generated (that should be use to verify if PrismaClient has been updated)

```gql
mutation Mutation {
  addRandomModel {
    status
    info
  }
}
```

> **Note**
>
> For some reasons Prisma Client is out of sync until the app restarts.
>