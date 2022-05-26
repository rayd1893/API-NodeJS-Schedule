const { es, en } = require('./languages/all');
const { handlerValidateDate, handlerBefore, handlerValidateCrossSchedules, handlerValidateTime } = require('../handlers');

const messages = {
    es : es,
    en : en
}

class Validator {
    constructor (req, language) {
        this.req = req;
        this.body = req.body;
        this.errors = [];
        this.language = language
    }

    isRequired(field) {
        const value = eval("this.body." + field);
        if (value === undefined ||  value.length === 0) {
            this.errors.push({
                field: field,
                error: eval(`messages.${this.language}.required`)
            });
        }
    }

    isNumber(field) {
        const value = eval("this.body." + field);
        if (value !== undefined) {
            if (typeof value != "number") {
                this.errors.push({
                    field: field,
                    error: eval(`messages.${this.language}.number`)
                })
            }
        }
    }

    isInteger(field) {
        const value = eval("this.body." + field);
        if(value !== undefined && typeof value == 'number'){
            if(!Number.isInteger(value)) {
                this.errors.push({
                    field: field,
                    error: eval(`messages.${this.language}.integer`)
                });  
            }
        }
    }

    isMoreOrEqualThanZero(field) {
        const value = eval("this.body." + field);
        if(value !== undefined && typeof value == 'number'){
            if(value < 0) {
                this.errors.push({
                    field: field,
                    error: eval(`messages.${this.language}.moreOrEqualThanZero`)
                });  
            }
        }
    }

    isMoreThanZero(field) {
        const value = eval("this.body." + field);
        if(value !== undefined && typeof value == 'number'){
            if(value <= 0) {
                this.errors.push({
                    field: field,
                    error: eval(`messages.${this.language}.moreThanZero`)
                });  
            }
        }
    }

    isArray(field) {
        const value = eval("this.body." + field);
        if(value !== undefined){
            if(!Array.isArray(value)) {
                this.errors.push({
                    field: field,
                    error: eval(`messages.${this.language}.isArray`)
                });  
            }
        }
    }

    isDate(field) {
        const value = eval("this.body." + field);
        if(value !== undefined){
            if(!handlerValidateDate(value)) {
                this.errors.push({
                    field: field,
                    error: eval(`messages.${this.language}.date`)
                });  
            }
        }
    }

    isTime(field) {
        const value = eval("this.body." + field);
        if(value !== undefined){
            if(!handlerValidateTime(value)) {
                this.errors.push({
                    field: field,
                    error: eval(`messages.${this.language}.time`)
                });  
            }
        }
    }

    inRange(field, obj) {
        const value = eval("this.body." + field);
        const { min , max } = obj;
        if(value !== undefined && typeof value == "number") {
            if (value < min || value > max) {
                this.errors.push({
                    field: field,
                    error: messages[this.language].range(min, max)
                });
            }
        }
    }

    isBefore(start, end) {
        const s = eval("this.body." + start);
        const e = eval("this.body." + end);
        if (s !== undefined && e !== undefined) {
            if (handlerValidateDate(s) && handlerValidateDate(e)) {
                if (!handlerBefore(s, e)) {
                    this.errors.push({
                        field: start,
                        error: messages[this.language].before(start, end)
                    }); 
                }
            }
        }
    }

    CrossSchedules(field) {
        const value = eval("this.body." + field);
        if (value !== undefined) {
            if (Array.isArray(value)) {
                if (handlerValidateCrossSchedules(value)) {
                    this.errors.push({
                        field: field,
                        error: messages[this.language].cross
                    }); 
                }
            }
        }
    }

    
}




module.exports = {
    Validator,
    messages
}