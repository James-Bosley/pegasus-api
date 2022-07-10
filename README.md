# GoChamp

## Overview

This is the API provider for GoChamp - A game selection and sports performance insight tool. It uses both an HTTP Express server and a Socket.io connection to communicate with clients.

## Running the Project

There is an underlying MySQL database being used to persist data. This is interfaced with using
[Bookshelf.js](https://bookshelfjs.org/index.html) ORM on top of a [Knex.js](https://knexjs.org/)
query builder instance.  
To use this server locally, first install all dependencies using `npm install`, then create a database in MySQL and create
a .env file in the root directory.  
Within this file set the following environment variables:

```
DB_USER="mysql-username"
DB_PASS="mysql-password"
DATABASE="name-of-database"

SESSION_SECRET="your-secret-string"
JWT_SECRET="your-secret-string"

GOOGLE_ID="google_id" (Private - supplied separately)
GOOGLE_SECRET="google_secret" (Private - supplied separately)
```

Then run the following command from the root directory:

```
npm run db-init
```

This will migrate the database and seed it with some test users.

You can then run the server using `npm run dev`.

The .env file may also contain an optional `PORT` value, which can be used to customise where the server listens for requests and overrides the default port of 8080.  
In a production setting the the following variables must also be added to facilitate OAuth redirection:

```
SITE_URL="my-site-url"
API_URL="api-url"
```
