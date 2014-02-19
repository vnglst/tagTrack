// View class constructor
function TTView() {
// Nothing to see here
}

TTView.prototype.render = function(tTModel) {
    var activeStartDate = tTModel.period.getStartDate();
    var activeEndDate = tTModel.period.getEndDate();
    var periodString = tTModel.period.getPeriodString();
    
    var $textResults = $('#js-textResults');
    $textResults.empty();
    $textResults.append("<h1>" + periodString + "</h1>");
    $textResults.append("From <i>" + activeStartDate.toDateString());
    $textResults.append("</i> to <i>" + activeEndDate.toDateString() + "</i><br />");
    
    $textResults.append(tTModel.toString()+"<br />");
    
    this.drawGraph(tTModel);
};

TTView.prototype.drawGraph = function(tTModel) {
    var clientHoursArray = tTModel.toArray(),
    barHTML,
    clientName,
    workedHours,
    i,
    $barGraph = $('#js-barGraph');

    $barGraph.empty();
    // for every client in the array
    for (i in clientHoursArray) {
        clientName = clientHoursArray[i][1];
        workedHours = clientHoursArray[i][0];
        barHTML = "<div class='barWrapper'>";
        barHTML += "<span class='legenda'><button type='button' class='btn btn-default btn-sm'>" + clientName + "</button></span>";
        barHTML += "<span class='bar'></span>";
        barHTML += "<span class='badge hours'>" + workedHours + " h</span>";
        barHTML += "</div>";
        $barGraph.append(barHTML);
        $('.bar').eq(i).animate({width: workedHours*10}, 1000);
    }
};

// Converts the parameter number (int) to a string of stars
TTView.prototype.numberToStars = function(number) {
    var starString = '';
    for (var i = 0; i < number; i++) {
        starString += '*';
    }
    return starString;
};