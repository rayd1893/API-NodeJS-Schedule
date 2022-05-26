const { Pool } = require('pg');

function initClose(pool) {
	return async () => pool.end();
}

async function create(conn) {
	const pool = new Pool({
		user: conn.user,
		host: conn.host,
		database: conn.name,
		password: conn.password,
	});

	return {
		conn: pool,
		close: initClose(pool),
	};
}

module.exports = {
	create,
};