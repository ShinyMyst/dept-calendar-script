// ###################
// Triggered Functions 
// ###################
// Triggered periodically
function main(){
  process_unpaired_events();
  process_paired_events();
};



// Triggered on edit
function update_last_edit() {
  // Update the last edited time column to match when row was last edited.
  // Update the corresponding calendar event
  // If for some reason the calendar event has a newer edit date than the spreadsheet...
};

// ###################
// Supporting Functions 
// ###################
// Checks the last edited times of spreadsheet and calendar events
// Updates information to match the most  recently updated version
function process_paired_events(){

};


function process_unpaired_events(scope){
  // Default scope should be 30 days
  // Event name is a unique key
  // Creates a list of all event names in calendars
  // Creates a list of all event names in spreadsheet
  // If event exists in one but not the other, adds a copy where it is missing

  // Check for unpaired spreadsheet events
  for (const rowData of DATA) {
    if (!getCellData(rowData, "Link")) { 
      createCalEvent(rowData);
    };
  };

  // Check for unpaired calendar events
  var thisMonth = new Date().setDate(1);
  var firstDay = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
  var lastDay = new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1, 0);

  for (const [calendarName, calendarID] of CALENDAR) {
    var calendar = CalendarApp.getCalendarById(calendarID);
    var calendarEvents = calendar.getEvents(firstDay, lastDay);
    for (const event of calendarEvents) {
      if (!event.pairedEvent) {
        createSheetEvent(event);
        // TODO - This could possibly be a function
        const extendedProperties = {
          pairedEvent: true 
        };
        event.setExtendedProperties(extendedProperties);
      }
    }
  }



};

function createCalEvent(rowData) {
  // Uses row data to create a new calendar event.
  // Returns a link to the created event

  // TODO - Perform data validation to see if all required fields present
  // DELAY this until write to spreadsheet functions are re-implemented.
  // When we assign variables below, we can also verify they exist and are valid.
  // If not valid, we will write an error message (and highlight row)

  // Pull data from row
  const targetCalendar = getCelldata(rowData, "Calendar");
  const eventStarts = getCelldata(rowData, "Starts");
  const eventEnds = getCelldata(rowData, "Ends");
  const eventTitle = getCelldata(rowData, "Event");
  const eventDescription = getCelldata(rowData, "Description");

  // Format the dates
  const startDate = new Date(eventStarts);
  var endDate = null;
  if (eventEnds && eventStarts === eventEnds) {
    endDate = new Date(eventEnds);
  }

  // Create an all day event
  let endDate = endDate || startDate;
  const event = targetCalendar.createAllDayEvent('', startDate, endDate);

  // Edit attributes of the event
  event.setTitle(eventTitle);
  event.setDescription(eventDescription);
  const extendedProperties = {
      pairedEvent: true 
  };
  event.setExtendedProperties(extendedProperties);

  // TODO - Write a link to the calendar event on spreadsheet
  // DELAY this until write to spreadsheet functions are re-implemented.

  // TODO - make sure to add the last edited date to both spreadsheet and calendar event
  // DELAY this until write to spreadsheet functions are re-implemented.
  // Perhaps make this a function

};


function createSheetEvent(event) {
  // Uses event object from calendar to create an entry on the ACTIVE spreadsheet

}




// Deleted calendar event caught by spreadsheet having an invalid link to event (as opposed to none)
// Deleted spreadsheet event caught by edit detection.

// TODO - Abstract the header names instead of hard coding

// TODO more function for readability