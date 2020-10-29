// import { getDefaultNormalizer } from "@testing-library/react";
import "./App.css";
import { useState, useEffect } from "react";
// var fetch = require("node-fetch");

const GenericHTMLTable = ({ data }) => {
	let columns = [];
	if (data && data.length > 0)
		columns = Object.keys(data[0]).map((val) => {
			return val;
		});

	const header = columns.map((val, idx) => {
		return <th key={idx}>{val}</th>;
	});

	const rows = data.map((row, row_idx) => {
		const cells = columns.map((column, col_idx) => {
			return <td key={col_idx}>{row[column]}</td>;
		});
		return <tr key={row_idx}>{cells}</tr>;
	});

	return (
		<table>
			<tbody>
				<tr>{header}</tr>
				{rows}
			</tbody>
		</table>
	);
};

function App() {
	const [data, setData] = useState([]);

	async function getData() {
		const url = "http://localhost:3001/api/dbtest/";
		const response = await fetch(url);
		const data = await response.json();
		setData(data);
	}

	useEffect(() => {
		getData();
	}, []);

	return (
		<div>
			<h1>Users</h1>
			<GenericHTMLTable data={data} />
		</div>
	);
}

export default App;
