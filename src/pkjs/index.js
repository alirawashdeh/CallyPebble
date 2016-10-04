
var urlAddEvent = "https://www.googleapis.com/calendar/v3/calendars/{ID}/events";
var config_url = 'https://cally-pebble-config.herokuapp.com';

var access_token;
var list_name;
var list_id;
var text;

var Cally = require('./cally-min.js');
var appt;

function pad(amount, width) {
 var padding = "";
 while (padding.length < width - 1 && amount < Math.pow(10, width - padding.length - 1))
  padding += "0";
 return padding + amount.toString();
}

function timestamp(date) {

 date = date ? date : new Date();
 console.log('date is ' + date);
 var offset = date.getTimezoneOffset();
 return pad(date.getFullYear(), 4)
   + "-" + pad(date.getMonth() + 1, 2)
   + "-" + pad(date.getDate(), 2)
   + "T" + pad(date.getHours(), 2)
   + ":" + pad(date.getMinutes(), 2)
   + ":" + pad(date.getSeconds(), 2)
   + "." + pad(date.getMilliseconds(), 3)
   + (offset > 0 ? "-" : "+")
   + pad(Math.floor(Math.abs(offset) / 60), 2)
   + ":" + pad(Math.abs(offset) % 60, 2);
}

Pebble.addEventListener('ready', function() {
  console.log('PebbleKit JS ready!');

  		access_token = localStorage.access_token;
      list_name = localStorage.list_name;
      list_id = localStorage.list_id;
      client_id = localStorage.client_id;

});

Pebble.addEventListener('showConfiguration', function() {
  console.log('Showing configuration page: ' + config_url);

  Pebble.openURL(config_url);
});

Pebble.addEventListener('appmessage',
  function(e) {
    console.log('Received message: ' + JSON.stringify(e.payload));

    if(e.payload.KEY_MESSAGE)
    {
      text = e.payload.KEY_MESSAGE;
      appt = new Cally(text, new Date());

      var dict = {
         'KEY_SUGGEST_DATE': GetDateSuggestion(),
         'KEY_SUGGEST_SUBJECT': appt.subject,
       };

      // Send to watchapp
      Pebble.sendAppMessage(dict, function() {
        console.log('Send successful: ' + JSON.stringify(dict));
      }, function() {
        console.log('Send failed!');
      });
    }

    if(e.payload.KEY_GOAHEAD)
    {
      console.log(list_id);
      var response = AddItem(text);
      console.log(response);

      var success = 0;
      if(response.indexOf('created') != -1)
      {
        success = 1;
      }
      var dict = {
         'KEY_SUCCESS': success,
         'KEY_LIST': list_name
       };

      // Send to watchapp
      Pebble.sendAppMessage(dict, function() {
        console.log('Send successful: ' + JSON.stringify(dict));
      }, function() {
        console.log('Send failed!');
      });
    }

  }
);

function AddItem(text) {
    var req = new XMLHttpRequest();
    req.open("POST", urlAddEvent.replace('{ID}',list_id), false);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Authorization", "Bearer " + access_token);
    req.setRequestHeader("X-Client-ID", client_id);
    console.log(urlAddEvent.replace('{ID}',list_id));

    var Cally = require('./cally-min.js');
    var appt = new Cally(text, new Date());

    var finishdate = new Date(appt.date.getTime());
    finishdate.setHours(finishdate.getHours() + 1);
    var json = { 'summary': appt.subject, "start": { "dateTime": timestamp(appt.date) }, "end": { "dateTime": timestamp(finishdate) }, "attendees": [ ], "reminders": { "overrides":[ ] } };
    // var json = { 'summary': appt.subject, "start": { "dateTime": "2016-10-11T12:47:31+05:30" }, "end": { "dateTime": "2016-10-11T22:47:31+05:30" }, "attendees": [ ], "reminders": { "overrides":[ ] } };

     console.log(JSON.stringify(json));
    req.send(JSON.stringify(json));
    return req.responseText;
}


function GetDateSuggestion() {
  var returnString = appt.date.toDateString();
    if(appt.timefound)
    {
      var hours = appt.date.getHours() + '';
      var hourspadded = ('00'+hours).substring(hours.length);
      var minutes = appt.date.getMinutes() + '';
      var minutespadded = ('00'+minutes).substring(minutes.length);
      returnString += ' ' + hourspadded + ':' + minutespadded;
    }
    return returnString;
}

Pebble.addEventListener('webviewclosed', function(e) {
  var configData = JSON.parse(decodeURIComponent(e.response));
  console.log('Configuration page returned: ' + JSON.stringify(configData));

   		localStorage.access_token = configData['access_token'];
      localStorage.list_name = configData['list_name'];
      localStorage.list_id = configData['list_id'];
      localStorage.client_id = configData['client_id'];
        		access_token = localStorage.access_token;
            list_name = localStorage.list_name;
            list_id = localStorage.list_id;
            client_id = localStorage.client_id;

  var dict = {
     'KEY_CONFIGURED': 1
   };

  // Send to watchapp
  Pebble.sendAppMessage(dict, function() {
    console.log('Send successful: ' + JSON.stringify(dict));
  }, function() {
    console.log('Send failed!');
  });


});
