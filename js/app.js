  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
  function openNav() {
      document.getElementById("mySidenav").style.width = "250px";
      document.getElementById("main").style.marginLeft = "250px";
  }
  
  /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
  function closeNav() {
      document.getElementById("mySidenav").style.width = "0";
      document.getElementById("main").style.marginLeft = "0";
  }

$(document).ready(function(){

    $('.page_link').on('click', function() {
        var id= $(this).attr('href');
        console.log(id);
        
        $('.pages').map(function(item, elem) {
            $(elem).addClass('d-none');
        });
        $(id).removeClass('d-none');

    });
    
    
    $( '#mapButton' ).on('click', function() {
 
      //Map mapbox 3d
      mapboxgl.accessToken = 'pk.eyJ1Ijoia2FoYXJvIiwiYSI6ImNqYm9ueDg4aDF5bTMycm8xbzBmeDlmMmYifQ.gmoJNi-NFdRMIF4cWoRwSQ';
      var map = new mapboxgl.Map({
          style: 'mapbox://styles/mapbox/light-v9',
          // center: [-74.0066, 40.7135],
          center: [71.40407030000006, 51.0895433], 
          zoom: 15.5,
          pitch: 45,
          bearing: -17.6,
          hash: true,
          container: 'map'
      });
    
      // The 'building' layer in the mapbox-streets vector source contains building-height
      // data from OpenStreetMap.
      map.on('load', function() {
          // Insert the layer beneath any symbol layer.
          var layers = map.getStyle().layers;
    
          var labelLayerId;
          for (var i = 0; i < layers.length; i++) {
              if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                  labelLayerId = layers[i].id;
                  break;
              }
          }
    
          map.addLayer({
              'id': '3d-buildings',
              'source': 'composite',
              'source-layer': 'building',
              'filter': ['==', 'extrude', 'true'],
              'type': 'fill-extrusion',
              'minzoom': 15,
              'paint': {
                  'fill-extrusion-color': '#aaa',
    
                  // use an 'interpolate' expression to add a smooth transition effect to the
                  // buildings as the user zooms in
                  'fill-extrusion-height': [
                      "interpolate", ["linear"], ["zoom"],
                      15, 0,
                      15.05, ["get", "height"]
                  ],
                  'fill-extrusion-base': [
                      "interpolate", ["linear"], ["zoom"],
                      15, 0,
                      15.05, ["get", "min_height"]
                  ],
                  'fill-extrusion-opacity': .6
              }
          }, labelLayerId);
      });
      
    });

    
  var data
  function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    // xobj.open('GET', 'data/data20.json', false); // Replace 'my_data' with the path to your file
    xobj.open('GET', 'data/data.json', false); // Replace 'my_data' with the path to your file
    
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
  }

  
  var busstopTime = [];
  var busstopName = [];
  var dataIn = [];
  var dataOut = [];
  
  
  function init() {
    loadJSON(function(response) {
    // Parse JSON string into object
      data = JSON.parse(response)

      for(let i in data) {
        if (i != data.length-1) {
            //busstopTime.push( new Date( Date.parse( data[i]["Дата и время"] ) ) );
            // busstopTime.push( data[i]["Время транзита по плану"] );
            let time =  dateFromString( data[i]["Время транзита по плану"] )
            let timestr = (data[i]["Время транзита по плану"]).match(/(\d+):(\d+):(\d+)/)
            // time.getHours()>9)? time.getHours(): "0" +time.getHours() +
            // ":" + (time.getMinutes()>9)? time.getMinutes(): "0" +time.getMinutes() +
            // ":" + (time.getSeconds()>9)? time.getSeconds(): "0" +time.getSeconds()
            // console.log(timestr[0])
            // busstopTime.push( time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() );
            busstopTime.push( timestr[0] );
            
            
            busstopName.push( data[i]["Описание узла"] )
            dataIn.push( parseInt( data[i]["Итого вошло"] ) )
            //dataIn[i] = (dataIn[i] == 0)?dataIn[i]: -dataIn[i]
            dataOut.push( parseInt( data[i]["Итого вышло"] ) )
            
        }
      }
      
    });
  }
  
  //29.01.2018 07:44:3
  function dateFromString(str) {
    var m = str.match(/(\d+).(\d+).(\d+)(\s+)(\d+):(\d+):(\d+)/);
    return new Date(m[3], m[2] - 1, m[1], m[5], m[6], m[7]);
  }
  init();

    // t_passengers_bus = zeros(nm_dimensions(1), 1);
    // %num(k, 1) <- people entering the bus
    // %num(k, 2) <- people exiting the bus
    const bus_limit = []
    var number_of_people_in_bus = []
    for ( let i=0; i<dataIn.length; i++) { 
        if (i<=0) 
            number_of_people_in_bus.push( dataIn[i] - dataOut[i] )
        else
            if ( number_of_people_in_bus[i-1] + dataIn[i] - dataOut[i] > 0 )
                number_of_people_in_bus.push( number_of_people_in_bus[i-1] + dataIn[i] - dataOut[i] )
            else
                number_of_people_in_bus.push( number_of_people_in_bus[i-1] )
        // dataIn[i] = (dataIn[i] == 0)?dataIn[i]: -dataIn[i]
        dataOut[i] = (dataOut[i] == 0)?dataOut[i]: -dataOut[i]
    
       
    
    }
    // console.log(number_of_people_in_bus)


    Highcharts.chart('chart', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Stacked bar chart'
        },
        xAxis: [{
            categories: busstopTime,
            reversed: false,
            labels: {
                step: 1
            }
        }, { // mirror axis on right side
            opposite: true,
            reversed: false,
            categories: busstopName,
            linkedTo: 0,
            labels: {
                step: 1
            }
        }],
        yAxis: {
            title: {
                text: 'Данные одного круга 17 маршрута'
            },
            plotLines: [{
                color: '#FF0000',
                dashStyle: 'shortdash',
                width: 2,
                value: 50,
                label: {
                    text: 'Максимальная загрузка'
                }
            }],
            subtitle: {
                text: 'Source: Astana LRT'
            }
        },
        // legend: {
        //     reversed: true
        // },
        // plotOptions: {
        //     series: {
        //         stacking: 'normal'
        //     }
        // },
        series: [{
            name: 'В автобусе',
            data: number_of_people_in_bus
        }, {
            name: 'Вышедшие',
            data: dataOut
        }, {
            name: 'Вошедшие',
            data: dataIn
        }]
    });

});

