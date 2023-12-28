function getLocationFromIP(ipAddress) {
  const apiKey = 'YOUR_API_KEY';
  const apiUrl = `https://get.geojs.io/v1/ip/geo/${ipAddress}.json?key=${apiKey}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Access specific location details from 'data' object here
      // For example: data.country, data.city, data.region, etc.
    })
    .catch(error => {
      console.log(error);
    });
}

getLocationFromIP('8.8.8.8');
