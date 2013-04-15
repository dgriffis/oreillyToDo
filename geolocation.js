function findLocation() {
    
    navigator.geolocation.getCurrentPosition( showMap ,
                                             function(error) {
                                             alert('Cannot determine your location!');
                                             });
    
}