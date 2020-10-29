const express = require("express");
const db = require("./db");
const app = express();
const cors = require("cors");

app.use(cors());

app.get("/api/dbtest", async (req, res) => {
	await db.connect();
	await db.createUsersTable();
	await db.addSampleData();
	const users = await db.getUsers();
	db.close();

	console.log("===> from db:", users);

	res.setHeader("Content-Type", "application/json");
	res.send(users);
});

app.listen(3001, () =>
	console.log("Express server is running on localhost:3001")
);
