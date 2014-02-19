// See https://code.google.com/apis/console/ for info on clientID and apiKey
// To explore the Google API see: https://developers.google.com/apis-explorer/#p/calendar/v3/calendar.calendarList.list?_h=4&
var clientId = '173889151012-sc653mkrjl9tp3todfiqvkdgua5c830o.apps.googleusercontent.com';
var apiKey = 'AIzaSyB-Mysffm9vRg9WM0moLygswUqiXUqsK1w';
// Currently only readonly access is required, not writing to calendars. For write access remove ".readonly" 
var scopes = 'https://www.googleapis.com/auth/calendar.readonly';

function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth, 1);
}

function checkAuth() {
    gapi.auth.authorize({
        client_id: clientId,
        scope: scopes,
        immediate: true
    },
    handleAuthResult);
}

function handleAuthResult(authResult) {
    var $authButton = $('#js-authbutton');
    if (authResult.error) {
        $authButton.text('Error. See console');
        console.log(authResult.error);
    } else if (authResult) {
        $authButton.text('Signed in');
        // This is where the Google API calls go -->
        loadEventsFromAPI(activeCalendar, tTModel, tTView);
        loadCalendarsFromAPI();
    }
    else {
        $authButton.text('Not signed in');
        $authButton.click(handleAuthClick);
    }

}

function handleAuthClick(event) {
    gapi.auth.authorize({
        client_id: clientId,
        scope: scopes,
        immediate: false
    },
    handleAuthResult);
    return false;
}

function loadEventsFromAPI(calendarId, tTModel, tTView) {
    
    var startTime = tTModel.period.getStartDate(),
        endTime = tTModel.period.getEndDate();
    
    gapi.client.load('calendar', 'v3', function() {
        var request = gapi.client.calendar.events.list({
            'calendarId': calendarId,
            'timeMin': startTime,
            'timeMax': endTime
        });
        
        request.execute(function(resp) {
            // Load date in the tTModel, reload = true --> meaning clear data, add only new
            tTModel.loadDate(resp, true);        
            // rendering of the View should take place here b/c of asychronous loading of api date ??
            tTView.render(tTModel);
            // If there is a nextPageToke then not all results are shown. Warn the user.
            if (typeof resp.nextPageToken != "undefined")
            {
                $('#js-textResults').append("<br /><h3>Not showing all results due to pagination from API</h3><br />");
                var pageToken = resp.nextPageToken;
            }
        });
    });
}

function loadCalendarsFromAPI() {
    gapi.client.load('calendar', 'v3', function() {
        var request = gapi.client.calendar.calendarList.list({

        });
    
        request.execute(function(resp) {
            tTCalendars.render(resp.items);
        });
    });
}