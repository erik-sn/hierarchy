const moment = require('moment');

now = moment()
let start;
let end;
const hour = now.hours()
if (hour >= 7 && hour < 19) {
  start = moment().hour()
  console.log('day')
} else {
  console.log('night')
}