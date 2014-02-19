// Standard value is my Urenadmin calendar
var activeCalendar = '7kmr3l8rlvj8ga2v6kr4aeegr8@group.calendar.google.com';

function TTCalendars() {
    this.cals = [];
}

TTCalendars.prototype.render = function(respAPI) {
    this.cals = respAPI;
    var $jscals = $('.js-calendars');
    $jscals.empty();
    for (var i in this.cals) {
            var cal = this.cals[i];
            $jscals.append("<li><a id='cal"+i+"' href='#'>" + cal.summary + "</a></li>");
            
            var calId = "#cal"+i;
            $(calId).css("color", cal.backgroundColor);
            
            if (i == 8) {
                $(calId).parent('li').addClass("active");
                activeCalendar = cal.id;
            }
    }
};

// Creates an empty TTModel, API date should be loaded later
var tTModel = new TTModel('week', new Date());
var tTView = new TTView();
var tTCalendars = new TTCalendars();

$('document').ready(function() {

    $('#js-todayButton').click(function() {
        // set date to today
        tTModel.period.selectedDate = new Date();
        // set time to midnight
        tTModel.period.selectedDate.timeToMidnight();
        loadEventsFromAPI(activeCalendar, tTModel, tTView);
    });

    $('#js-nextButton').click(function() {
        tTModel.period.nextPeriod();
        loadEventsFromAPI(activeCalendar, tTModel, tTView);
    });

    $('#js-previousButton').click(function() {
        tTModel.period.previousPeriod();
        loadEventsFromAPI(activeCalendar, tTModel, tTView);
    });

    $('#js-dayButton').click(function() {
        tTModel.period.periodType = 'day';
        loadEventsFromAPI(activeCalendar, tTModel, tTView);
    });

    $('#js-weekButton').click(function() {
        tTModel.period.periodType = 'week';
        loadEventsFromAPI(activeCalendar, tTModel, tTView);
    });

    $('#js-monthButton').click(function() {
        tTModel.period.periodType = 'month';
        loadEventsFromAPI(activeCalendar, tTModel, tTView);
    });

    $('#js-yearButton').click(function() {
        tTModel.period.periodType = 'year';
        loadEventsFromAPI(activeCalendar, tTModel, tTView);
    });
});