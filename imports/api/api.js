import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Pokemons = new Mongo.Collection('pokemon');
if(Meteor.isServer){
	Meteor.methods({
	'go': function(username, password, provider, location){
		console.log(location)
		Future = Npm.require('fibers/future');
		let fut = new Future();
		api.cache.location.latitude = location.lat;
		api.cache.location.longitude = location.lon;
		api.login(username, password, provider)
		  .then(api.getPlayerEndpoint)
		  .then(_.partial(api.mapData.getByCoordinates, location.lat, location.lon))
		  .then(function(data) {

		     fut.return(data);
		  })
		  .catch(function(error) {
		    console.log('error', error.stack);
		  });
		return fut.wait();		
	},

});

}

