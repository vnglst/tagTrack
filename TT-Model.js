// The MyEvent object class constructor
function MyEvent(startDate, endDate, eventTitle) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.eventTitle = eventTitle;
}

// Method of the MyEvent class. Calculates the number of hours of an event
MyEvent.prototype.getHours = function() {
    var hours = Math.abs(this.startDate - this.endDate) / (1000 * 60 * 60);
    return hours;   
};

// Returns the first hash tag in the eventTitle. Second tags not supported yet.
MyEvent.prototype.getClientHashTag = function() {
    var regExpHash = new RegExp('#([^\\s]*)', 'g');
    var hashTags = this.eventTitle.match(regExpHash); // This first hashtag is the name of the client
    if (hashTags === null) { // If no HashTag specified, set it to this string (null error handling)
        hashTags = new Array("-- no HashTag --");
    }
    return hashTags[0];
};

// TTModel constructor, creates an array of myEvents and a couple of methods
function TTModel(periodType, selectedDate) {
    this.myEvents = [];
    this.period = new Period(periodType, selectedDate);
}

// Load the TTModel with data
TTModel.prototype.loadDate = function(resp, reload) {
    var events = resp.items,
        eventStartDate,
        eventEndDate,
        eventTitle;
    if (reload) this.myEvents = [];
    for (var i in events) {
        eventStartDate = new Date(events[i].start.dateTime);
        eventEndDate = new Date(events[i].end.dateTime);
        eventTitle = events[i].summary;
        this.myEvents.push(new MyEvent(eventStartDate, eventEndDate, eventTitle));
    }
};

// Returns an array with all the unique clients
TTModel.prototype.getClientList = function() {
    var clientList = [],
        o = {},
        clientName = "";

    for (var i = 0; i < this.myEvents.length; i++) {
        clientName = this.myEvents[i].getClientHashTag();
        o[clientName] = clientName; // JS only stores unique object names and discards existing ones. This helps us get the unique clients
    }
    for (i in o) clientList.push(o[i]);
    return clientList;
};

// Returns total number of hours worked for a client
TTModel.prototype.getHoursClient = function(client) {
    var hoursWorkedForClient = 0,
        someClient = "",
        workedHrs = 0;
    for (var i in this.myEvents) {
        someClient = this.myEvents[i].getClientHashTag();
        workedHrs = this.myEvents[i].getHours();
        if (someClient === client) {
            hoursWorkedForClient += workedHrs;
        }
    }
    return hoursWorkedForClient;
};

// Returns the total number of hours in a myCalendar
TTModel.prototype.getTotalHours = function() {
    var totalHours = 0;
    for (var i in this.myEvents) {
        var workedHours = this.myEvents[i].getHours();
        totalHours += workedHours;
    }
    return totalHours;
};

// Generates a HTML-string summary of the MyCalendar object
TTModel.prototype.toString = function() {
    var totalHours = this.getTotalHours(),
        calString = "",
        nbHours = this.getHoursClient("#nb");
    if (this.myEvents === null) {
        calString += "<br /><h3>API data not loaded yet.</h3>";
    } else if (totalHours === 0) {
        calString += "<br /><h3>No hashtags in calendar. Please select a calendar with hashtags on the left.</h3>";
    } else {
        calString += "<br />- Total: " + MyMath.decRound(totalHours, 1) + "h";
        calString += "<br />- Billable (without #nb): " + MyMath.decRound(totalHours - nbHours, 1) + "h.";
    }
    return calString;
};

// Generates an ordered array with {"clients": hours} etc) the TTModel object
TTModel.prototype.toArray = function() {
    var clientHours = 0,
        calArray = [],
        clientList = this.getClientList();
    for (var i in clientList) {
        clientHours = this.getHoursClient(clientList[i]);
        clientHours = MyMath.decRound(clientHours, 1);
        calArray.push([clientHours, clientList[i]]);
    }
    return calArray;
};

// Class constructor Period
function Period(periodType, selectedDate) {
    this.periodType = periodType;
    this.selectedDate = selectedDate;
    this.selectedDate.timeToMidnight();
}

// Returns the periodType as a string
Period.prototype.getPeriodString = function() {
    var periodString = "" + this.periodType + " ";
    switch (this.periodType) {
    case "day":
        // Adds day of the week, week starts on 0 = Sunday
        periodString += (this.selectedDate.getDay());
        break;
    case "week":
        // Adds week number week 1 = week 1
        periodString += (this.selectedDate.getWeek());
        break;
    case "month":
        // Adds month number plus 0 (january = 0)
        periodString += (this.selectedDate.getMonth() + 1);
        break;
    case "year":
        // Adds year number
        periodString += this.selectedDate.getFullYear();
        break;
    }
    return periodString;
};

// methods getStartDate returns first date of the current period as a new Date object
Period.prototype.getStartDate = function() {
    var periodStartDate = new Date(this.selectedDate);
    switch (this.periodType) {
    case "day":
        // Nothing to change here, periodStartDate = selectedDate
        break;
    case "week":
        // set the startDate to Monday this week, midnight 0:00
        periodStartDate.setToMondayMidnight();
        break;
    case "month":
        // set the Date to the first of the month
        periodStartDate.setDate(1);
        break;
    case "year":
        // set Month to January (0) and Date to first
        periodStartDate.setMonth(0);
        periodStartDate.setDate(1);
        break;
    }
    return periodStartDate;
};

// methods getEndDate returns last date of the current period as a new Date object
Period.prototype.getEndDate = function() {
    var periodEndDate = new Date(this.selectedDate);
    switch (this.periodType) {
    case "day":
        // Day plus 1
        periodEndDate.setDate(periodEndDate.getDate()+1);
        break;
    case "week":
        // set the startDate to Monday this week, midnight 0:00
        periodEndDate.setToMondayMidnight();
        periodEndDate.setDate(periodEndDate.getDate() + 7);
        break;
    case "month":
        // set the Date to the first of the month
        periodEndDate.setDate(periodEndDate.daysInMonth() + 1);
        break;
    case "year":
        // Add one to year of date
        // set Month to January (0) and Date to first
        periodEndDate.setFullYear(periodEndDate.getFullYear() + 1);
        periodEndDate.setMonth(0);
        periodEndDate.setDate(1);
        break;
    }
    return periodEndDate;
};

// method nextPeriod increase the current period with one
Period.prototype.nextPeriod = function() {
    var date = this.selectedDate;
    switch (this.periodType) {
    case "day":
        date.setDate(date.getDate() + 1);
        break;
    case "week":
        date.setDate(date.getDate() + 7);
        break;
    case "month":
        date.setDate(date.getDate() + date.daysInMonth());
        break;
    case "year":
        date = new Date(date.getFullYear() + 1, 0, 1);
        break;
    }
};

// method previousPeriod same as above, but decrease with one
Period.prototype.previousPeriod = function() {
    var date = this.selectedDate;
    switch (this.periodType) {
    case "day":
        date.setDate(date.getDate() - 1);
        break;
    case "week":
        date.setDate(date.getDate() - 7);
        break;
    case "month":
        date.setDate(date.getDate() - date.daysInMonth());
        break;
    case "year":
        date = new Date(date.getFullYear() - 1, 0, 1);
        break;
    }
};
