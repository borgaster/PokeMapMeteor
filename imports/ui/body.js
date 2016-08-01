import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
import { Pokemons } from '../api/api.js';
//import { GoogleMaps } from 'meteor/dburles:google-maps';
let apiKey = 'AIzaSyCQsGYC2owiU0vWjINJ_eQRfLRyRProTBQ';
let username = '<username>'
let password = '<password>'
let provider = '<provider>'
let markers = [];  
if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load({key: apiKey});
  });


  Template.body.helpers({
    exampleMapOptions: function() {
      // Make sure the maps API has loaded
      if (GoogleMaps.loaded()) {
        // Map initialization options
        return {
          center: new google.maps.LatLng(0, 0),
          zoom: 1
        };
      }
    }
  });

 /* Template.body.onCreated(function() {
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('exampleMap', function(map) {
      // Add a marker to the map once it's ready
      var marker = new google.maps.Marker({
        position: map.options.center,
        map: map.instance
      });
    });
  });*/
}

Template.body.events({
  'submit .new-location'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
    target.text.value='';
    let geoCoder = new google.maps.Geocoder();
    geoCoder.geocode( { 'address': text}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
          let coordinates = {
            lat: results[0].geometry.location.lat(),
            lon: results[0].geometry.location.lng()
          }
          let thisMap = GoogleMaps.maps['exampleMap'].instance
          thisMap.setCenter(new google.maps.LatLng(coordinates.lat, coordinates.lon));
          thisMap.setZoom(14)
          markers.forEach((marker) =>{
                marker.setMap(null)
              });
          markers.length = 0;
          Meteor.call('go', username, password, provider, coordinates, function(err, res){
            if(err){
              console.log(err);
            } 
            else {
              let wild = res.map((elem) => {
                return elem.wild_pokemon;
              }).filter((elem) =>{
                return elem.length > 0
              }).reduce((a, b) =>{
                return a.concat(b) 
              }, [0]);
              console.log(res)
              wild.forEach((pokemon) =>{
                 if(typeof pokemon === 'object'){
                    console.log(pokemon.pokemon_data.pokemon_id)
                    let poke = Pokemons.findOne({"id": pokemon.pokemon_data.pokemon_id.toString()})
                    let marker = new google.maps.Marker({
                      position: new google.maps.LatLng(pokemon.latitude, pokemon.longitude), 
                      map: thisMap,
                      icon: poke.img
                    });
                    markers.push(marker);
                 }
                
              })
              
            }

          });
        } 
        else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
    
  },
});

