// Assign the built-in Date object to DateMagic for extension
const DateMagic = Date;

// Add a new method called format to the DateMagic prototype
DateMagic.prototype.format = function (format, locale = null, calendar = null) {

    const date = new Date(this.getTime() + this.getTimezoneOffset() * 60000)

    if (typeof navigator !== 'undefined') {
        // If locale is not provided, use the user's browser language or default to 'en-US'
        locale = (locale || navigator.language || navigator.userLanguage || 'en-US').split('-')[0];

        // Get the calendar from the browser (if available) or default to 'gregory'
        calendar = (calendar || navigator.calendar || 'gregory').toLowerCase();
    }

    // Define month names and day names for different locales
    const monthNames = {
        'en': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        'es': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        'pt': ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        // Adicione mais idiomas conforme necessário
    };

    const dayNames = {
        'en': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'es': ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        'pt': ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
        // Adicione mais idiomas conforme necessário
    };

    // Determine the appropriate month and day names based on the locale
    const monthNamesLocale = monthNames[locale] || monthNames["en"]
    const dayNamesLocale = dayNames[locale] || dayNames["en"];

    // Define format characters and their corresponding values
    const formatChars = {
        'd': String(date.getDate()).padStart(2, '0'),
        'D': dayNamesLocale[date.getDay()].slice(0, 3),
        'j': date.getDate(),
        'l': dayNamesLocale[date.getDay()],
        'N': date.getDay() === 0 ? 7 : date.getDay(),
        'S': ['st', 'nd', 'rd'][((date.getDate() + '').slice(-1) > 3 || (date.getDate() + '').slice(-2) < 10 || ((date.getDate() + '').slice(-2) > 20 && (date.getDate() + '').slice(-1) == 0)) ? 0 : (date.getDate() + '').slice(-1) - 1],
        'w': date.getDay(),
        'z': Math.floor((date - new Date(date.getFullYear(), 0, 1)) / 86400000),
        'W': (() => {
            const target = new Date(date.valueOf());
            const dayNr = (date.getDay() + 6) % 7;
            target.setDate(target.getDate() - dayNr + 3);
            const firstThursday = target.valueOf();
            target.setMonth(0, 1);
            if (target.getDay() !== 4) {
                target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
            }
            return 1 + Math.ceil((firstThursday - target) / 604800000);
        })(),

        'F': monthNamesLocale[date.getMonth()],
        'm': String(date.getMonth() + 1).padStart(2, '0'),
        'M': monthNamesLocale[date.getMonth()].slice(0, 3),
        'n': date.getMonth() + 1,
        't': (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate(),
        'L': (date.getFullYear() % 4 === 0 && date.getFullYear() % 100 !== 0) || date.getFullYear() % 400 === 0 ? 1 : 0,
        'o': date.getFullYear() + (date.getMonth() === 11 && date.getDate() < 29 ? 1 : (date.getMonth() === 0 && date.getDate() > 3 ? -1 : 0)),
        'Y': date.getFullYear(),
        'y': String(date.getFullYear()).slice(-2),
        'a': date.getHours() < 12 ? 'am' : 'pm',
        'A': date.getHours() < 12 ? 'AM' : 'PM',
        'B': Math.floor((((date.getUTCHours() + 1) % 24) + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) * 1000 / 24),
        'g': date.getHours() % 12 || 12,
        'G': date.getHours(),
        'h': String(date.getHours() % 12 || 12).padStart(2, '0'),
        'H': String(date.getHours()).padStart(2, '0'),
        'i': String(date.getMinutes()).padStart(2, '0'),
        's': String(date.getSeconds()).padStart(2, '0'),
        'u': String(date.getMilliseconds()).padStart(3, '0'),
        'v': String(date.getMilliseconds()).padStart(3, '0'),
        'e': Intl.DateTimeFormat().resolvedOptions().timeZone,
        'I': date.getTimezoneOffset() === new Date(date.getFullYear(), 0, 1).getTimezoneOffset() ? 0 : 1,
        'O': date.toTimeString().match(/([+-]\d{4})/)[1],
        'P': (() => {
            const match = date.toTimeString().match(/([+-]\d{2}):(\d{2})/);
            return match ? match[1] + ':' + match[2] : '';
        })(),
        'p': (() => {
            const match = date.toTimeString().match(/([+-]\d{2}):(\d{2})/);
            return match ? match[1] + match[2] : '';
        })(),
        'T': date.toTimeString().match(/[A-Z]+/)[0],
        'Z': date.getTimezoneOffset() * 60
    };

    // Define an array explaining the meanings of each format character
    const formatExplanation = {
        'd': 'Day of the month, 2 digits with leading zeros (01 to 31)',
        'D': 'A textual representation of a day, three letters (Mon through Sun)',
        'j': 'Day of the month without leading zeros (1 to 31)',
        'l': 'A full textual representation of the day of the week (Sunday through Saturday)',
        'N': 'ISO-8601 numeric representation of the day of the week (1 for Monday, 7 for Sunday)',
        'S': 'English ordinal suffix for the day of the month, 2 characters (st, nd, rd or th)',
        'w': 'Numeric representation of the day of the week (0 for Sunday, 6 for Saturday)',
        'z': 'The day of the year (0 through 365)',
        'W': 'ISO-8601 week number of year, weeks starting on Monday',
        'F': 'A full textual representation of a month, such as January or March',
        'm': 'Numeric representation of a month, with leading zeros (01 to 12)',
        'M': 'A short textual representation of a month, three letters (Jan to Dec)',
        'n': 'Numeric representation of a month, without leading zeros (1 to 12)',
        't': 'Number of days in the given month (28 to 31)',
        'L': 'Whether it\'s a leap year (1 if leap year, 0 otherwise)',
        'o': 'ISO-8601 year number, same as Y except if the ISO week number (W) belongs to the previous or next year',
        'Y': 'A full numeric representation of a year, 4 digits (e.g. 2022)',
        'y': 'A two-digit representation of a year (e.g. 22 for 2022)',
        'a': 'Lowercase Ante meridiem and Post meridiem (am or pm)',
        'A': 'Uppercase Ante meridiem and Post meridiem (AM or PM)',
        'B': 'Swatch Internet time (000 to 999)',
        'g': '12-hour format of an hour without leading zeros (1 to 12)',
        'G': '24-hour format of an hour without leading zeros (0 to 23)',
        'h': '12-hour format of an hour with leading zeros (01 to 12)',
        'H': '24-hour format of an hour with leading zeros (00 to 23)',
        'i': 'Minutes with leading zeros (00 to 59)',
        's': 'Seconds with leading zeros (00 to 59)',
        'u': 'Microseconds (000000 to 999999)',
        'v': 'Milliseconds (000 to 999)',
        'e': 'Timezone identifier (e.g. UTC, GMT, Atlantic/Azores)',
        'I': 'Whether the date is in daylight saving time (DST) (1 if DST, 0 otherwise)',
        'O': 'Difference to Greenwich time (GMT) in hours (e.g. +0200)',
        'P': 'Difference to Greenwich time (GMT) with colon between hours and minutes (e.g. +02:00)',
        'p': 'Difference to Greenwich time (GMT) without colon between hours and minutes (e.g. +0200)',
        'T': 'Timezone abbreviation (e.g. EDT, CEST)',
        'Z': 'Timezone offset in seconds (-43200 to 50400)'
    };


    // Check if the format is 'OPTIONS' and return the array of format explanations
    // Otherwise, if the format is 'ALL', return the object containing all format characters and their values
    // Otherwise, replace format characters in the given format string with their corresponding values
    if (format === 'OPTIONS') {
        return formatExplanation;
    } else if (format === 'ALL') {
        return formatChars;
    } else {
        return format.replace(/(d|D|j|l|N|S|w|z|W|F|m|M|n|t|L|o|Y|y|a|A|B|g|G|h|H|i|s|u|v|e|I|O|P|p|T|Z)/g, (match) => formatChars[match] || match);
    }
};

export default DateMagic;
export { DateMagic };