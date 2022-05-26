const Query = require('./querys');
const momenttz = require('moment-timezone');
const moment = require('moment');
const { handlerTimeZone } = require('../handlers/handlers');

const query = new Query('local');

module.exports = class ScheduleController {
    constructor() {
 
    }

    async getSchedulesByCountry (req,country){
        const text = `SELECT schedule_id, description,
						 event_start,
						 event_end,
						 quantity, country, client_id, user_id,
						 created_at at time zone 'utc' as created_at,
						 updated_at at time zone 'utc' as updated_at,
						 created_by, updated_by, deleted
				  FROM schedules WHERE country = $1 AND deleted = false`;
	    const values = [country];

        const result = await query.select(req, text, values);

        return result;
    }

    async getScheduleDays (req,schedule_id) {
        const text = `SELECT *
                      FROM schedule_days
                      WHERE schedule_id = $1`;
        const values = [schedule_id];
        const result = await query.select(req, text, values);

        return result;
    }

    async getScheduleHours (req,schedule_day_id) {
        const text = `SELECT *
                      FROM schedule_hours
                      WHERE schedule_day_id = $1 AND deleted = false`;
        const values = [schedule_day_id];
        const result = await query.select(req, text, values);

        return result;
    }

    async getScheduleDetailById(req, schedule_id){
        const schedule = {};
        const text = `SELECT * FROM schedules WHERE schedule_id = $1 AND deleted = false LIMIT 1`;
        const values = [schedule_id];
        
        try {
            const days = [];
            const [result] = await query.select(req, text, values);
            const schedule_days = await this.getScheduleDays(req, schedule_id)
            for (const schedule_day of schedule_days) {
                const day = {};
                const hours = [];
                const schedule_hours = await this.getScheduleHours(req,schedule_day.schedule_day_id);
                for (const schedule_hour of schedule_hours) {
                    const hour = {};
                    hour['schedule_hour_id'] = schedule_hour.schedule_hour_id;
                    hour['hour_start'] = schedule_hour.hour_start;
                    hour['hour_end'] = schedule_hour.hour_end;
                    hours.push(hour);
                }
                day['schedule_day_id'] = schedule_day.schedule_day_id;
                day['number_day'] = schedule_day.number_day;
                day['hours'] = hours;
                days.push(day);
            }
            schedule['schedule_id'] = result.schedule_id;
            schedule['description'] = result.description;
            schedule['event_start'] = moment(result.event_start).format("YYYY-MM-DD");
            schedule['event_end'] = result.event_end === null ?  result.event_end : moment(result.event_end).format("YYYY-MM-DD");
            schedule['quantity'] = result.quantity;
            schedule['country'] = result.country;
            schedule['days'] = days;
            schedule['client_id'] = result.client_id;
            schedule['user_id'] = result.user_id;
            schedule['created_at'] = momenttz(result.created_at).tz(handlerTimeZone(result.country)).format();
            schedule['updated_at'] = momenttz(result.updated_at).tz(handlerTimeZone(result.country)).format();
            schedule['created_by'] = result.created_by;
            schedule['updated_by'] = result.updated_by;
            schedule['deleted'] = result.deleted;
        } catch {
            return {};
        }

        

        return schedule;
    }

    async insertSchedule (req,description,event_start,event_end,quantity,country,client_id,user_id){
        const text = "INSERT INTO schedules(" + 
				"description, event_start,event_end,quantity,country,client_id,user_id,created_at," +
				"updated_at, created_by,updated_by,deleted) " + 
				"VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *";
        const values = [];
        const time_now = momenttz().tz('UTC');

        values.push(description);
        values.push(event_start);
        values.push(event_end);
        values.push(quantity);
        values.push(country);
        values.push(client_id);
        values.push(user_id);
        values.push(time_now.format());
        values.push(time_now.format());
        values.push(user_id);
        values.push(user_id);
        values.push(false);

        const insert = await query.statement(req, text, values);
        
        return insert;

    }

    async insertScheduleDay(req, number_day, schedule_id, user_id) {
        const text = `INSERT INTO schedule_days 
                    (number_day, schedule_id,created_at,
                    updated_at, created_by,updated_by,deleted )
                    VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

        const values = [];
        const time_now = momenttz().tz('UTC');

        values.push(number_day);
        values.push(schedule_id);
        values.push(time_now.format());
        values.push(time_now.format());
        values.push(user_id);
        values.push(user_id);
        values.push(false);

        const insert = await query.statement(req, text, values);
        
        return insert;

    }

    async insertScheduleHour(req, hour_start, hour_end, schedule_day_id, user_id) {
        const text = `INSERT INTO schedule_hours
                        (hour_start, hour_end, schedule_day_id,created_at,
                        updated_at, created_by,updated_by,deleted )
                        VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

        const values = [];
        const time_now = momenttz().tz('UTC');

        values.push(hour_start);
        values.push(hour_end);
        values.push(schedule_day_id);
        values.push(time_now.format());
        values.push(time_now.format());
        values.push(user_id);
        values.push(user_id);
        values.push(false);

        const insert = await query.statement(req, text, values);
        
        return insert;

    }
}