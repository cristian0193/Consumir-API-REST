const Apikey = "AIzaSyBtf8Th1_OysSS6GoAQyHT1i5_cuUS-O5k";
let rest = require("restler");

class Event {
  constructor(accessToken, calendarID = "primary") {
    this.destinationURL = "https//www.googleapis.com/calendar/v3/calendars/" + calendarID;
    this.accessToken = accessToken;
    this.calendarID = calendarID;
  }

  all(callback) {
    rest.get(this.destinationURL + "/events", this.defaultInfo())
      .on("complete", callback)
  }

  defaultInfo() {
    return {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.accessToken
      }
    }
  }
}

module.exports = Event;