// Load the API client library
//gapi.load('map', initMap);
function gapiLoaded() {
  gapi.load("client", sheet_api);
  gapi.load(
    "map",
    (initMap = function () {
      // Create a new map object centered on a specific location
      var map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 6.1224889, lng: 100.3528662 },
        zoom: 8,
      });
    })
  );
}

function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id:
      "121625714460-vu0l4hm6du8osu26ei30mdac6tl0o693.apps.googleusercontent.com",
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
    callback: "", // defined later
  });
}

// Load the API client library
async function sheet_api() {
  // Initialize the Google Sheets API client
  await gapi.client
    .init({
      apiKey: "AIzaSyAucAWQZ2nQNLeMEOKibM0fLmqANp7FG0M", // Replace with your API key
      discoveryDocs: [
        "https://sheets.googleapis.com/$discovery/rest?version=v4",
      ],
    })
    .then(
      function () {
        getSheetData();
      },
      function (error) {
        // Handle any errors
        console.error(error.result.error.message);
      }
    );
}

// Retrieve latitude, longitude, and address data from a Google Sheet
async function getSheetData() {
  //console.log("hhhhhhhhh");
  var sheetId = "1FX1WXBFKnCWf6O2pVTWwvxw53XrvWrQ_3Khpu8p8SYg"; // Replace with your Google Sheet ID
  var range = "Sheet1!D1:I"; // Replace with the range of cells containing your data
  var values = [];

  // Call the Google Sheets API to retrieve data

  gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: sheetId,
      range: range,
    })
    .then(
      function (response) {
        // Process the response data
        console.log(response);
        var rows = response.result.values;
        for (var i = 1; i < rows.length; i++) {
          var row = rows[i];
          console.log(row);
          var lat = parseFloat(row[3]);
          console.log(row[3]);
          var lng = parseFloat(row[4]);
          console.log(row[4]);
          var address = row[0];

          // Store the latitude, longitude, and address in an array
          values.push({
            address: address,
            latitude: lat,
            longitude: lng,
          });
        }
        console.log(values);
        // Create a new Google Map centered on the first marker
        var center = new google.maps.LatLng(
          values[0].latitude,
          values[0].longitude
        );
        var mapOptions = {
          zoom: 8,
          center: center,
        };
        var map = new google.maps.Map(
          document.getElementById("map"),
          mapOptions
        );

        // Add a marker for each latitude/longitude pair
        for (var i = 0; i < values.length; i++) {
          let latLng = new google.maps.LatLng(
            values[i].latitude,
            values[i].longitude
          );
          let marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: values[i].address,
          });

          // Add an info window to the marker that shows the corresponding address

          //console.log(values[i].address);
          let infoWindow = new google.maps.InfoWindow({
            content: values[i].address,
          });
          marker.addListener("click", function () {
            console.log(infoWindow);
            if (!marker.open) {
              infoWindow.open({ anchor: marker, map });
              marker.open = true;
            } else if (marker.open) {
              infoWindow.close();
              marker.open = false;
            }
          });
        }
      },
      function (error) {
        // Handle any errors
        console.error(error.result.error.message);
      }
    );
}
