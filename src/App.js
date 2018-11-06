import React, { Component } from 'react';

import './App.css';
import axios from 'axios';

class App extends Component {
  componentDidMount(){
    this.getVenues();
    
  }
  loadMap = () => {
    //this will load the script
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDDLHLqfuBmKtnjQfjeg3Sowxr39Gz0KHU&callback=initMap');
    //accesing initmap using window object
    window.initMap = this.initMap;

  }
  //Get the data from foursquare api
  getVenues = () => {
    const endPoint = 'https://api.foursquare.com/v2/venues/explore?';
    const parameters = {
      //foursquare client id 
      client_id: 'XUC2STKFP14YWC0AY4VFDALBDOWLRI53VGQKY21SUQ0JLAMN',
      client_secret: '4CNENC3NPSF032OLPEYOVN1X40KMPLK5BGZ2N5WRJCAV40VU',
      query: 'pizza',
      limit: 100,
      near: 'orange county, CA',
      v: '20182507'
    }

    axios.get(endPoint + new URLSearchParams(parameters))
    .then(response => {
      
     this.setState({
      venues: response.data.response.groups[0].items 
    },this.loadMap())
  })
    .catch(error => {
      //if for some reason api doesn't work handling error with console.log and alert 
      console.log("error " + error);
      alert("Sorry, That didn't work. Check console for more details"); 
   })
  }
  initMap = () => {
    var myLatLng = {lat: 33.7, lng: -117.7675};

    // Create a map object and specify the DOM element
    // for display.
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: myLatLng,
      zoom: 10
    });
    //intializing map
    this.map = map;
    //create infowindow
    let infowindow = new window.google.maps.Infowindow();

    
    this.setState({
      map:map,
      infowindow: infowindow
    });

    this.state.venues.forEach(myVenue => {
      var contentString = `${myVenue.venue.name + ","+
      myVenue.venue.location.city+","+myVenue.venue.location.address}`
      //creating info window
      var infowindow =  new window.google.maps.Infowindow ({
        content: contentString
      });

      var marker = new window.google.maps.Marker({
      position : {lat: myVenue.venue.location.lat, lng:myVenue.venue.location.lng},
      map: map , 
      city: myVenue.venue.location.city,
      address: myVenue.venue.location.address,
      myVenue: myVenue,
      id: myVenue.venue.id,
      name: myVenue.venue.name,
      draggable: true,
      animation: window.google.maps.Animation.drop,
      title: myVenue.venue.name
    });
    marker.addListener('click',function(){
        
      //update content before opening infowindow
      infowindow.setContent(contentString);
      //this function will be invoked to open infowindow
      infowindow.open(map,marker);
    });
    


  }); 
 }     
  render() {
    return (
      <main>
        <div id="map"></div>
      </main>  
    );
  }
}

function loadScript(url){
  try {
    //adding try catch block to make sure if script doesnt work it gives proper console and alert
    //select script tag
    var index = window.document.getElementsByTagName('script')[0]
    var script = window.document.createElement('script')
    script.src = url
    script.async = true
    script.defer = true
    index.parentNode.insertBefore(script, index)
   } catch (error) {
    console.log(error);
    //alert for user if it doesnt work
   alert("Sorry, That didn't work. Check console for more details");
   }
  }



export default App;
