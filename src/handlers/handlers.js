const moment = require('moment');

const handlerTimeZone = (country) => {
	switch (country) {
		case 'MEX':
			return 'America/Mexico_City';
		case 'PER':
			return 'America/Lima';
		case 'CHL':
			return 'America/Santiago';
		case 'COL':
			return 'America/Bogota';
        default:
            return undefined
	}
}

const handlerValidateDate = (date) => {
    const validate_date = moment(date, true);
    return validate_date.isValid();
}

const handlerValidateTime = (time) => {
    const date = moment(`1900-01-01T${ time }`, true);
    return date.isValid();
}

const handlerBetweenDates = (start, end, date) => {
    const start_m = moment(start);
    const end_m = moment(end);
    const date_m = moment(date);

    return date_m.isBetween(start_m, end_m);
}

const handlerBefore = (start, end) => {
    const start_m = moment(start);
    const end_m = moment(end);

    return start_m.isBefore(end_m);
}

const handlerAfter = (end, start) => {
    const start_m = moment(start);
    const end_m = moment(end);

    return end_m.isAfter(start_m);
}

const handlerValidateCrossSchedules = (hours) => {
    for (const i in hours) {
        for (const j in hours) {
            if (i == j) {
                continue;
            }
            
            const start = hours[i].hour_start;
            const end = hours[i].hour_end;
            const date = hours[j].hour_start;
            
            if (!handlerValidateTime(start) || !handlerValidateTime(end) || !handlerValidateTime(date)) {
                console.log("Error")
                return false;
            }
            
            if (handlerBetweenDates(start, end, date)) {
                return true;
            }
        }
    }

    return false;
}


module.exports = {
    handlerTimeZone,
    handlerValidateDate,
    handlerBetweenDates,
    handlerBefore,
    handlerAfter,
    handlerValidateCrossSchedules,
    handlerValidateTime
}