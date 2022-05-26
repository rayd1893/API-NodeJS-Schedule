const router = require('express').Router();

router.get('/', async (req, res) => {
	const { dbs } = req.__context;
	const coreDb = dbs['core'];
	res.json(await coreDb.conn.query('SELECT * FROM orders LIMIT 1'));
});

module.exports = {
	path: '/assignments',
	router,
};