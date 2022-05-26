const router = require('express').Router();
const ScheduleController = require('../controllers/scheduleController');
const { handlerValidateSchedule } = require('../handlers/handlerSchedule');

const schedulecontroller = new ScheduleController();

router.get('/:schedule_id', async(req, res) => {
	const schedule_id = req.params['schedule_id'];
	const schedule = await schedulecontroller.getScheduleDetailById(req,schedule_id)
	res.status(200).jsonp(schedule);
});

router.get('/', async (req, res) => {
	const data = await schedulecontroller.getSchedulesByCountry(req,req.body.country)
	const result = [];

	for (const row of data){
		const schedule = await schedulecontroller.getScheduleDetailById(req,row.schedule_id);
		result.push(schedule);
	}
	res.json(result);
});


router.post('/',   async (req, res) => {
	
	const validate = handlerValidateSchedule(req);

	if (validate.length) {
		res.status(400).jsonp({
			status_code:400, 
			message: "Algunos datos se enviaron erroneamente",
			errors: validate
		});
	}

	const {description, event_start, event_end, quantity, country, client_id, user_id, days} = req.body;
	
	const insert = schedulecontroller.insertSchedule(req, description, event_start, event_end, quantity, country, client_id, user_id);

	insert.then((response) => {
		const [inserted] = response.rows;
		const {schedule_id} = inserted;
		for (const day of days) {
			const insert_day = schedulecontroller.insertScheduleDay(req, day.number_day, schedule_id, user_id);
			insert_day.then((response) => {
				const [inserted_day] = response.rows;
				const {schedule_day_id} = inserted_day;
				for (const hour of day.hours) {
					const insert_hour = schedulecontroller.insertScheduleHour(req, hour.hour_start, hour.hour_end, schedule_day_id, user_id);
					insert_hour.catch((err) => {
						res.status(400).jsonp({status_code:400, 
						message: "No se agregó el evento",
						error: err.stack});
					});
				}
			}).catch((err) => {
				res.status(400).jsonp({status_code:400, 
					message: "No se agregó el evento",
				error: err.stack});
			});
		}
	}).catch((err) => {
		res.status(400).jsonp({status_code:400, 
			message: "No se agregó el evento",
		error: err.stack});
	})

	res.status(200).jsonp({status_code:200, 
		message: "Evento creado correctamente"});
});

router.put('/:schedule_id', async(req, res) => {
	const schedule_id = req.params['schedule_id'];
	const schedule = await schedulecontroller.getScheduleDetailById(req,schedule_id)
	res.status(200).jsonp(schedule);
});

module.exports = {
	path: '/schedules',
	router,
};