var fireLocations = new Orbit()
var twitter = new Orbit()
var remove = new Orbit()

google.maps.event.addDomListener(window, 'load', initialize)

var boxText1 = document.createElement("div");
    boxText1.id = "boxText1"
    boxText1.style.height = '490px'

var google
var map

var infowindow = new InfoBox({
  disableAutoPan: false,
  pixelOffset: new google.maps.Size(100, -300),
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
  map = new google.maps.Map(document.getElementById('my-fire-map'), mapOptions)

}

fireLocations.get('/saved-locations', function () {
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
      map.setCenter(marker.getPosition())

      google.maps.event.addDomListener(boxText1,'click',function(e){
        if (e.target.id === 'remove') {
          remove.post('/remove', JSON.stringify(elem), function (){
          })
        }
      })
      twitter.post('/tweets', JSON.stringify(elem), function () {
        console.log()
        var tweetObj = JSON.parse(this.response)
        var tweets = tweetObj.statuses
        var boxhtml;

        if (tweets.length === 0) {
          boxhtml = '<div class="arrow"></div><form  action="/remove" method="post"><input type="text" name="title" value="' + elem.title + '" hidden style="display: none"><input type="submit" value="Remove Fire"  class="remove"></form><h2>' + elem.title + '</h2><p class="description"><strong>Description: </strong>' + elem.description[0].substring(0, 240) + '...<a href=' + elem.link[0] + ' target="_blank"> Read More</a></p><h3>Recent Tweets</h3><div class="box"><h4>Sorry, there are no tweets on this fire</h4></div>'
          infowindow.setContent(boxText1)
        } else {
          tweets.forEach(function (el) {
            content += '<h4>' + el.text + '</h4>'
          })
          boxhtml = '<div class="arrow"></div><form  action="/remove" method="post"><input type="text" name="title" value="' + elem.title + '" hidden style="display: none"><input type="submit" value="Remove Fire" class="remove"></form><h2>' + elem.title + '</h2><p class="description"><strong>Description: </strong>' + elem.description[0].substring(0, 240) + '...<a href=' + elem.link[0] + ' target="_blank"> Read More</a></p><h3>Recent Tweets</h3><div class="box">' + content + '</div>'
          infowindow.setContent(boxhtml)
        }
      })
      infowindow.setContent('')
      infowindow.open(map, this)
    })
  })
})

function moveMap () {
  map.panBy(0, -200)
}

google.maps.event.addDomListener(window, 'load', initialize)
