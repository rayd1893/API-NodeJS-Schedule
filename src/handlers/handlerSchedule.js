const moment = require('moment');
const { Validator, messages } = require('./validator/validator');


const handlerValidateSchedule = (req) => {
    const { days } = req.body;
    
    const validator = new Validator(req, 'es');
    
    validator.isRequired('description');
    validator.isRequired('event_start');
    validator.isDate('event_start');
    validator.isDate('event_end');
    validator.isBefore('event_start', 'event_end');
    validator.isRequired('days');
    validator.isArray('days')
    validator.isRequired('quantity');
    validator.isNumber('quantity');
    validator.isInteger('quantity');
    validator.isMoreThanZero('quantity');

    const uniqueDays = [];
    for (const day of days) {
        const { number_day, hours } = day
        req.body.number_day = number_day;
        req.body.hours = hours;
        validator.isRequired('number_day');
        validator.isNumber('number_day');
        validator.isInteger('number_day');
        validator.inRange('number_day', { min: 0, max: 6 });
        if (uniqueDays.includes(number_day)) {
            validator.errors.push({
                field: 'number_day',
                error: messages['es'].unique
            })
        }

        validator.isRequired('hours');
        validator.isArray('hours');

        for(const hour of hours) {
            const { hour_start, hour_end } = hour;

            req.body.hour_start = hour_start
            req.body.hour_end = hour_end

            validator.isRequired('hour_start');
            validator.isTime('hour_start');
            validator.isRequired('hour_end');
            validator.isTime('hour_end');

            delete req.body.hour_start;
            delete req.body.hour_end;
        }

        validator.CrossSchedules('hours');

        delete req.body.hours
        delete req.body.number_day;

        uniqueDays.push(day.number_day);
    }

    return validator.errors;
}

module.exports = {
    handlerValidateSchedule
}