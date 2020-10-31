# Simple React App with PostgreSQL

If you don't know SQL, an Object Relational Mapping tool saves the day. If you do, it just gets in the way.

This repo shows how to use postgres without an ORM, and how to isolate SQL code to the database. The react app does not need to know the structure of the database.

On the other hand, to use this solution, you need to know SQL.

## Setup

You will need a local installation of postgreSQL. After doing the install, log in to the postgres user, run psql, and create a new database named testdb.

```
$ sudo bash
bash-3.2# su - postgres
$ bin/psql
Password for user postgres:
psql (12.2)
Type "help" for help.

postgres=# create database testdb;
CREATE DATABASE
postgres=# \q
```

Then create a .env file like this:

```
export PGUSER=postgres
export PGHOST=localhost
export PGPASSWORD=postgres
export PGDATABASE=testdb
export PGPORT=5432
```

If you have the parameters right, you can run psql without parameters.

```
$ . .env
$ psql
psql (12.2)
Type "help" for help.

testdb=# \q
```

To set up the empty database, load the procedures and functions. No tables yet, they will be created by the app using a stored procedure.

```
$ cd postgres
$ psql < storedprocs.sql
```

To run the React app:

```

npm install
. .env
npm run start

```

## Hiding SQL from javascript

An ORM lets you embed SQL in your javascript. But it's awkward to compose complex SQL command strings in javascript. The approach here is to hide the SQL by calling only stored procedures and user-defined functions in javascript. The queries themselves live in the database.

There are two kinds of queries that are done in javascript.

- call stored_procedure (params)
- select \* from user_defined_function (params)

Stored procedures are used to create tables, insert into them, update them, alter them, and make other structural changes in the database. User defined functions are used to get data.

The javascript code does not know or care about the tables, columns, joins, or anything else going on inside the database. It cares about the parameters it passes to the database and the rows it gets back. The database contains its own API.

## The Stack

- node
- node-postgres
- postgreSQL
- expressjs

## Example

In postgres, define a function that runs a SQL query:

```

create or replace function get_users()
returns table (
  user_name varchar,
  email varchar,
  city varchar
)
language plpgsql
as $$
begin
  return query
    select * from users;
end;$$

```

This is a simple query, but it could be as complex as needed, and even make use of postgres features like windowing.

In server-side javascript:

```

async function performSQLQuery(query) {
try {
const response = await client.query(query);
return response.rows;
} catch (error) {}
}

exports.getUsers = function () {
return performSQLQuery("select \* from get_users()");
};

```

Routing:

```

app.get("/api/dbtest", async (req, res) => {
	await db.connect();
	await db.createUsersTable();
	await db.addSampleData();
	const users = await db.getUsers();
	db.close();

    res.setHeader("Content-Type", "application/json");
    res.send(users);
});

```

In client-size javascript:

```
async function getData() {
	const url = "http://localhost:3001/api/dbtest/";
	const response = await fetch(url);
	const data = await response.json();
	setData(data);
}
```

The data returned is a json array of rows. App.js renders the results as an HTML table.
