var currentLocationMarker;  // Marker for the user's current location
        var searchLocationMarker;   // Marker for the searched location

        // Initialize the map
        var mymap = L.map('mapid').setView([28.7041, 77.1025], 12); // Default to Delhi if location fails

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mymap);


        // DATASET FOR WATER LOGGING LEVELS
        var dataset = [
            { "name": "Connaught Place", "lat": 28.6316, "lon": 77.2195, "level": "high" },
            { "name": "Karol Bagh", "lat": 28.6535, "lon": 77.1818, "level": "medium" },
            { "name": "Rohini", "lat": 28.7164, "lon": 77.1170, "level": "low" },
            { "name": "Rajouri Garden", "lat": 28.6489, "lon": 77.1225, "level": "high" },
            { "name": "Burari", "lat": 28.7543, "lon": 77.2016, "level": "medium" },
            //{ "name": "Kashmere Gate", "lat": 28.6665, "lon": 77.2333, "level": "medium" },
            { "name": "Kashmere Gate Metro Station", "lat": 28.6688, "lon": 77.2282, "level": "high" },
            { "name": "Amrit Udyan", "lat": 28.6144, "lon": 77.1980, "level": "medium" },
            { "name": "ITO", "lat": 28.6284, "lon": 77.2412, "level": "medium" },
            { "name": "New Delhi Railway Station", "lat": 28.6424, "lon": 77.2196, "level": "low" },
            { "name": "Akshardham", "lat": 28.6127, "lon": 77.2773, "level": "low" },
            { "name": "India Gate", "lat": 28.6129, "lon": 77.2295, "level": "low" },
            { "name": "Red Fort", "lat": 28.6562, "lon": 77.2410, "level": "high" },
            { "name": "Chandni Chowk", "lat": 28.6561, "lon": 77.2320, "level": "medium" },
            { "name": "Hauz Khas", "lat": 28.5497, "lon": 77.2078, "level": "high" },
            { "name": "Delhi Haat INA", "lat": 28.5733, "lon": 77.2075, "level": "high" },
            { "name": "Lotus Temple", "lat": 28.5535, "lon": 77.2588, "level": "low" },
            { "name": "Qutub Minar", "lat": 28.5245, "lon": 77.1855, "level": "medium" },
            { "name": "Pragati Maidan", "lat": 28.6171, "lon": 77.2435, "level": "high" },
            { "name": "Lodhi Garden", "lat": 28.5964, "lon": 77.2214, "level": "low" },
            { "name": "IGDTUW", "lat": 28.6650, "lon": 77.2325, "level": "medium" },
        ];
        // Function to determine circle color based on water logging level
        function getCircleOptions(level) {
            if (level === "high") {
                return {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                    radius: 250
                };
            } else if (level === "medium") {
                return {
                    color: 'yellow',
                    fillColor: '#ffea00',
                    fillOpacity: 0.5,
                    radius: 250
                };
            } else {
                return {
                    color: 'green',
                    fillColor: '#00ff00',
                    fillOpacity: 0.5,
                    radius: 250
                };
            }
        }

        // Function to determine the popup class based on water logging level
        function getPopupClass(level) {
            if (level === "high") {
                return 'popup-red';
            } else if (level === "medium") {
                return 'popup-yellow';
            } else {
                return 'popup-green';
            }
        }

        // // Iterate through the dataset and add circles to the map
        // dataset.forEach(function(locality) {
        //     var circleOptions = getCircleOptions(locality.level);
        //     var popupClass = getPopupClass(locality.level);

        //     // Add the circle to the map for each locality
        //     L.circle([locality.lat, locality.lon], circleOptions)
        //     .bindPopup(`<div class="${popupClass}"<b>${locality.name}</b><br>Water logging level: ${locality.level}`)
        //     .addTo(mymap);
        // });

        // Iterate through the dataset and add circles to the map
        dataset.forEach(function(locality) {
            var circleOptions = getCircleOptions(locality.level);
            var popupClass = getPopupClass(locality.level);

            // Add the circle to the map for each locality
            L.circle([locality.lat, locality.lon], circleOptions)
                .bindPopup(`<b>${locality.name}</b><br>Water logging level: ${locality.level}`, {
                    className: popupClass  // Add the class dynamically to the popup
                })
                .addTo(mymap);
        });


        // Function to set marker at user's current location
        function setCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var lat = position.coords.latitude;
                    var lon = position.coords.longitude;

                    // Set the view of the map to the user's location
                    mymap.setView([lat, lon], 13);

                    // Add marker at user's current location if not already added
                    if (currentLocationMarker) {
                        currentLocationMarker.setLatLng([lat, lon]);
                    } else {
                        currentLocationMarker = L.marker([lat, lon], {icon: customIcon}).addTo(mymap);
                    }

                    // Add popup message for current location
                    currentLocationMarker.bindPopup("<b>Your current location</b>").openPopup();
                }, function(error) {
                    alert("Unable to retrieve your location. Default location shown.");
                });
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }

        // Call setCurrentLocation when the map loads
        setCurrentLocation();

        // Function to search for a location based on user input
        function searchLocation() {
            var location = document.getElementById("locationInput").value;

            // Fetch coordinates using Nominatim API (free OSM geocoding service)
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    var lat = data[0].lat;
                    var lon = data[0].lon;

                    // Move the map to the searched location
                    mymap.setView([lat, lon], 13);

                    // Add or move marker to the searched location
                    if (searchLocationMarker) {
                        searchLocationMarker.setLatLng([lat, lon]);
                    } else {
                        searchLocationMarker = L.marker([lat, lon], {icon: defaultIcon}).addTo(mymap);
                    }

                    // Add popup at the searched location marker
                    searchLocationMarker.bindPopup(`<b>${location}</b>`).openPopup();
                } else {
                    alert("Location not found");
                }
            })
            .catch(error => {
                console.error("Error fetching the location:", error);
            });
        }
        /*Styling Markers (Custom Icons)*/
        var customIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',  // Your custom icon file
            iconSize: [25, 41],         // Size of the default icon
            iconAnchor: [12, 41],       // Anchor point of the default icon
            popupAnchor: [1, -34]       // Popup relative to the anchor point
        });


        // Define default icon for searched location
        var defaultIcon = L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',  // Default Leaflet icon
            iconSize: [25, 41],         // Size of the default icon
            iconAnchor: [12, 41],       // Anchor point of the default icon
            popupAnchor: [1, -34]       // Popup relative to the anchor point
        });
