// Import the DateExt module from the index.js file
import DateMagic from './src/date-magic.js';

// Create an instance of DateExt with a specific date
const date = new DateMagic("1997-02-15");

// Format the date in the desired format
console.log(date.format('d/m/Y'));
// Output: '15/02/1997'

// Format the date with the month name
console.log(date.format('D, j F Y'));
// Output: Sat, 15 February 1997

// Display All Formatting Options
console.log(date.format('OPTIONS'));
/* Output: {
  d: 'Day of the month, 2 digits with leading zeros (01 to 31)',
  D: 'A textual representation of a day, three letters (Mon through Sun)',
  ... }
*/

// Retrieve All Available Format Characters and Their Values
console.log(date.format('ALL'));
/* Output: {
  d: '15',
  D: 'Sat',
  ... }
*/
