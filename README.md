# Simple React App with PostgreSQL

If you don't know SQL, an Object Relational Mapping tool saves the day. You can store and retrieve structured data.

But if you are already comfortable with SQL, ORM tools like sequelize are a pain. True, you can switch databases easily, but if that's not a priority then consider working directly in SQL in the native database. It gives you more functionality and more optimization opportunities.

This repo shows how to use postgres without an ORM. It also shows how to isolate SQL code to the database, so the react app does not know the structure of the database.

## The Stack

- node 15.0.1
- react 17.0.1
- expressjs 4.17.1
- node-postgres 8.4.2
- postgreSQL 12.2

## Setup

You will need a local installation of postgreSQL for this demo.

After doing the install, log in to the postgres user, run psql, and create a new database named testdb.

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

Log out of the postgres user and return to the project directory, then create a .env file like this:

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
$ . .env
$ cd postgres
$ psql < storedprocs.sql
```

To run the React app:

```

npm install
. .env
npm run start

```

Resulting page:

<img width="50%" src="https://raw.githubusercontent.com/johndimm/react-postgres-without-orm/main/public/screenshot.png" />

## Hiding SQL from javascript

An ORM lets you embed SQL in your javascript. But it's awkward to compose complex SQL command strings in javascript. **The approach here is to isolate and encapsulate the SQL by calling only stored procedures and user-defined functions.** The queries themselves live in the database.

There are two kinds of queries issued from javascript:

- call stored_procedure (params)
- select \* from user_defined_function (params)

Stored procedures are used to create tables, insert records, update them, alter them, and make other structural changes in the database. User defined functions are used to get data.

The javascript code does not know or care about the tables, columns, joins, indices, or anything else going on inside the database. It cares about the parameters it passes to the database and the rows it gets back. **The database contains its own API.**

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

In client-side javascript:

```
async function getData() {
	const url = "http://localhost:3001/api/dbtest/";
	const response = await fetch(url);
	const data = await response.json();
	setData(data);
}
```

The data returned is a json array of rows. App.js renders the results as an HTML table.
