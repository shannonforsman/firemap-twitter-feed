var fireLocations = new Orbit()
var twitter = new Orbit()
var cookie = new Orbit()
var saveLocation = new Orbit()


google.maps.event.addDomListener(window, 'load', initialize)



var boxText1 = document.createElement("div");
    boxText1.id = "boxText1";
    boxText1.style.height = '490px'


var google
var map

var infowindow = new InfoBox({
  disableAutoPan: false,
  pixelOffset: new google.maps.Size(100, -275),
  zIndex: null,
  boxStyle: infoBoxStyle,
  closeBoxMargin: '0px 0px 16px 16px',
  closeBoxURL: '../images/close.png',
  infoBoxClearance: new google.maps.Size(1, 1),
  isHidden: false,
  pane: 'floatPane'
})

function initialize () {

  var myLatlng = new google.maps.LatLng(40.042119, -100.260929)
  var mapOptions = {
    zoom: 5,
    center: myLatlng,
    panControl: false,
    zoomControl: true,
    scrollwheel: false,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL
    },
    scaleControl: false,
    mapTypeId: google.maps.MapTypeId.ROAD,
    mapTypeControlOptions: { mapTypeIds: [] },
    styles: mapStyles
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions)

}

fireLocations.get('/locations', function () {
  var locations = JSON.parse(this.response)
  var gmarkers = []
  locations.forEach(function (elem) {
    var iconBase = '/images/fire3.png'
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(elem['geo:lat'][0], elem['geo:long'][0]),
      map: map,
      icon: iconBase
    })
    gmarkers.push(marker)
    google.maps.event.addListener(marker, 'click', function (e) {      // marker.setIcon("/images/fire.png")
      for (var i = 0; i < gmarkers.length; i++) {
        gmarkers[i].setIcon('/images/fire3.png')
      }
      this.setIcon('/images/fire2.png')
      var content = ''
      var signInButton = ''
      map.setCenter(marker.getPosition())
      cookie.get('/cookie', function(){

        var cookie = JSON.parse(this.response)
        console.log(cookie.id)
        if (cookie.id.length > 0) {
          signInButton = '<a id="save">Save to Fire map</a>'
        }

        google.maps.event.addDomListener(boxText1,'click',function(e){
          console.log(elem)
          if (e.target.id === 'save') {
            saveLocation.post('/save', JSON.stringify(elem), function (){
              e.target.innerHTML = 'saved!'
            })
          }
        })

        twitter.post('/tweets', JSON.stringify(elem), function () {

          var tweetObj = JSON.parse(this.response)
          var tweets = tweetObj.statuses
          var boxhtml;
          if (tweets.length === 0) {

            boxhtml = '<div class="arrow"></div>' + signInButton + '<h2>' + elem.title + '</h2><p class="description" id="description"><strong>Description: </strong>' + elem.description[0].substring(0, 240) + '...<a href=' + elem.link[0] + ' target="_blank"> Read More</a></p><h3>Recent Tweets</h3><div class="box"><h4>Sorry, there are no tweets on this fire</h4></div>'

            infowindow.setContent(boxText1)
          } else {
            tweets.forEach(function (el) {
              content += '<h4>' + el.text + '</h4>'
            })
            boxhtml ='<div class="arrow"></div>' + signInButton + '<h2>' + elem.title + '</h2><p class="description" id="description"><strong>Description: </strong>' + elem.description[0].substring(0, 240) + '...<a href=' + elem.link[0] + ' target="_blank"> Read More</a></p><h3>Recent Tweets</h3><div class="box">' + content + '</div>'
            infowindow.setContent(boxhtml)
          }
        })
      })

      infowindow.setContent('')
      infowindow.open(map, this)
    })
  })
})

function moveMap () {
  map.panBy(0, -200)
}
