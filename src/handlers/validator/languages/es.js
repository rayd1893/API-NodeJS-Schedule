const es = {
    required : "El campo es obligatorio.",
    number: "El valor debe ser un número",
    integer: "El valor de ser un número entero",
    moreOrEqualThanZero: "El valor debe ser un número mayor o igual a cero.",
    moreThanZero: "El valor debe ser mayor a cero",
    isArray: "El valor debe ser un arreglo",
    date: "El formato de fecha no es válido (YYYY-MM-DD)",
    range: (min, max) => {
        return `El valor debe ser mayor o igual que ${ min } y menor o igual que ${ max }`;
    },
    unique: "El valor se esta repitiendo",
    before: (start, end) => {
        return `El valor de la variable ${ start } debe ser menor al valor de la variable ${ end }` 
    },
    cross: "Hay horarios que se están cruzando",
    time: "El formato de hora no es correcto (HH:MM ó HH:MM:SS)"
}

module.exports = {
    es
}
