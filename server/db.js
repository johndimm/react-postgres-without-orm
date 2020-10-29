const { Client } = require("pg");

let client = null;

exports.connect = function () {
	// creds are in .env
	client = new Client();
	client.connect();
};

exports.close = function () {
	client.end();
};

async function performSQLQuery(query) {
	console.log("===> performSQLQuery: ", query);

	try {
		const response = await client.query(query);
		return response.rows;
	} catch (error) {}
}

exports.createUsersTable = function () {
	performSQLQuery("call create_users_table()");
};

exports.addSampleData = function () {
	performSQLQuery("call add_sample_data()");
};

exports.getUsers = function () {
	return performSQLQuery("select * from get_users()");
};
