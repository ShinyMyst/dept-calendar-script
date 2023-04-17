// Updates the calendar sheet.  Returns false if duplicate entry.
function updateSheets(entryDict, rowNumber){
  if (duplicateEntry(entryDict)){
    var eventName = entryDict[InputPage['eventName']]
    Logger.log("Input Page.  Duplicate Entry " + eventName)
    return false
  };
  new SheetEntry(entryDict, rowNumber)
};

// ###################
// Entry Class
// ###################
class SheetEntry {
  constructor(entryDict, rowNumber) {
    this.entryDict = entryDict;
    this.calendarDict = createCalendarDict(entryDict)
    this._processInput()
    this._deleteRow(rowNumber)
  };

  _processInput(){
    this.calendarDict[CalendarPage['eventID']] = ''
    const START = this.entryDict[InputPage['startDate']]
    const END = this.entryDict[InputPage['endDate']]

    // Singular Month
    if (MONTHS.includes(START)) {
      this._writeSingularMonth(START)
    }
    // Singular Date
    else if (START.getTime() == END.getTime()) {
      this._writeSingularDate(START)
    } 
    // Date Range
    else {
      this._writeDateRange(START, END)
    }
  };

  // ========================================
  // ===== Writing and Deleting Entries =====
  // ========================================

  // Writes to the next blank row on to the sheet.
  _writeRow() {
    var lastRow = CalendarSheet.getLastRow();
    var newRow = [];

    for (var heading in this.calendarDict){
      newRow.push(this.calendarDict[heading])
    }

    const columnStart = 1
    const columnEnd = newRow.length
    const amountRows = 1
    CalendarSheet.getRange(lastRow+1, columnStart, amountRows, columnEnd).setValues([newRow])
    var eventName = this.entryDict[InputPage['eventName']]
    Logger.log("Calendar Page.  Added Entry " + eventName)
  };

  _deleteRow(rowNumber) {
    var rowRange = InputSheet.getRange(rowNumber, 1, 1, InputSheet.getLastColumn())
    rowRange.clearContent()
    var eventName = this.entryDict[InputPage['eventName']]
    Logger.log("Calendar Page.  Deleted Entry " + eventName)
  };

  // ========================================
  // ===== Types of Dates to Process =====
  // ========================================
  _writeSingularMonth(START){
  const date = new Date(`${START} 1, ${new Date().getFullYear()}`);   // Create Date object.
  this.calendarDict[CalendarPage['dateName']] = START
  this.calendarDict[CalendarPage['sorting']] = date.getTime() - 1
  this._writeRow()
  }

  _writeSingularDate(START){
    this.calendarDict[CalendarPage['dateName']] = START
    this.calendarDict[CalendarPage['sorting']] = START.getTime()
    this._writeRow()
  };

  _writeDateRange(START, END){
    // Helper function for making a date string
    function createDateString(start, end){
      var startMonth = start.toLocaleString('default', { month: 'long' });
      var endMonth = end.toLocaleString('default', { month: 'long' });
      var startDay = start.toLocaleString('default', { day: 'numeric', ordinal: 'numeric' });
      var endDay = end.toLocaleString('default', { day: 'numeric', ordinal: 'numeric' });

      const dateString = startMonth + ' ' + startDay + ' - ' + endMonth + ' ' + endDay;
      return dateString;
      };

    // Entries for each individual date
    for (let date = new Date(START); date <= END; date.setDate(date.getDate() + 1)) {
      this.calendarDict[CalendarPage['eventID']] = this.entryDict[InputPage['eventName']]
      this.calendarDict[CalendarPage['dateName']] = date
      this.calendarDict[CalendarPage['sorting']] = date.getTime()
      this._writeRow()
      }
    // Singular entry for date range
    const dateString = createDateString(START, END)
    this.calendarDict[CalendarPage['eventID']] = ''
    this.calendarDict[CalendarPage['dateName']] = dateString
    this.calendarDict[CalendarPage['sorting']] = START.getTime() - 1
    this._writeRow()
  };
};

// ###################
// Helper Functions
// ###################

// Returns True if duplicate entry exists; False otherwise.
function duplicateEntry(entryDict){
  function getEventList(){
    var eventMatrix = CalendarSheet.getRange(CalendarPage['allEvents']).getValues() 
    var eventList = eventMatrix.map(function(row) {
      return row[0];
        });
    return eventList
  }

  eventName = entryDict[InputPage['eventName']]
  eventList = getEventList()
  if (eventList.includes(eventName)){
    return true
  } else {
    return false
  }
};

// Creates and returns a dictionary with all calendar headings as keys.
function createCalendarDict(entryDict){
  var calendarDict = {}
  //CalendarSheet.getRange(CalendarPage['headingRange']).getValues()[0]; // get values returns a list of rows
  const calendarHeadings = CalendarPage['headingRange']
  // Fill calendarDict with matching values
  for (var index in calendarHeadings) {
    var heading = calendarHeadings[index]
    // Add matching data from entry page to calendarDict.
    if (entryDict.hasOwnProperty(heading)) {
      calendarDict[heading] = entryDict[heading];
    } else {
      calendarDict[heading] = ''
    }
  }
  return calendarDict
};
