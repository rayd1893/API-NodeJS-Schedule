const Server = require('./server');

let svc;

async function main() {
	svc = new Server([
		require('./routes/assignments'),
		require('./routes/schedules'),
	]);
	await svc.start();
}

main().catch(console.log);
['SIGINT', 'SIGTERM'].forEach((s) =>
  process.on(s, async () => {
		svc.stop().catch(console.log);
		console.log(`Exiting using sign: ${s}`);
	})
);