// create empty class for adding static methods not in the Math Object
function MyMath () {}

// new static round method with decimal specification
MyMath.decRound = function(num, decimals){
    return Math.round(num*Math.pow(10,decimals))/Math.pow(10,decimals);
}

/**
 * Sets the time of the date of the Date object to midnight 0:00 hours
 */
Date.prototype.timeToMidnight = function() {
    this.setHours(0);
    this.setMinutes(0);
    this.setMilliseconds(0);
};

/**
 * Sets the current Date object to the first day (Monday) of the week. Time is then set to 0:00 (midnight).
 */
Date.prototype.setToMondayMidnight = function() {
    var weekDay = this.getDay();
    // Sundays are 0. We need them to be 7.
    if (weekDay === 0) { 
        weekDay = 7;
    }
    // var mondayDate = new Date(this);
    this.setDate(this.getDate() - weekDay + 1);
    this.timeToMidnight();
};

/**
 * Returns the number of days in the month of the Date object
 */
Date.prototype.daysInMonth = function() {
    return 32 - new Date(this.getYear(), this.getMonth(), 32).getDate();
};

/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
Date.prototype.getWeek = function (dowOffset) {
/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.epoch-calendar.com */

    dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 1; //default dowOffset to zero -> 1 means Monday = first day
    var newYear = new Date(this.getFullYear(),0,1);
    var day = newYear.getDay() - dowOffset; //the day of week the year begins on
    day = (day >= 0 ? day : day + 7);
	var daynum = Math.floor((this.getTime() - newYear.getTime() - 
	(this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
	var weeknum;
	//if the year starts before the middle of a week
	if(day < 4) {
		weeknum = Math.floor((daynum+day-1)/7) + 1;
		if(weeknum > 52) {
			var nYear = new Date(this.getFullYear() + 1,0,1);
			var nday = nYear.getDay() - dowOffset;
			nday = nday >= 0 ? nday : nday + 7;
			/* if the next year starts before the middle of the week, it is week #1 of that year */
			weeknum = nday < 4 ? 1 : 53;
		}
	}
	else {
		weeknum = Math.floor((daynum+day-1)/7);
	}
	return weeknum;
};

/**
 * Truncates string to n chars
 */
String.prototype.trunc = 
      function(n){
          return this.substr(0,n-1)+(this.length>n?'&hellip;':'');
      };