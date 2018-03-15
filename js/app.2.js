$(document).ready(function(){
  var data
  function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data/data.json', false); // Replace 'my_data' with the path to your file
    // xobj.open('GET', 'data/data.json', false); // Replace 'my_data' with the path to your file
    
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
      data = JSON.parse(response);
      
      // let keys = Object.keys(data[0]);
      // for (let j=1; j<keys.length; j++) 
        //busstopName.push( keys[j] )
        // busstopName.push(response[i]["Описание узла"])

      for(let i in data) {
        // console.log(data[i]["busstop"]);
        // busstopTime.push(data[i]["busstop"] + " " + data[i]["time"]);
        // dataIn.push( parseInt( data[i]["in"] ) );
        // dataOut.push( parseInt( data[i]["out"] ) );
        //busstopTime.push( new Date( Date.parse( data[i]["Дата и время"] ) ) );
        busstopTime.push( data[i]["Дата и время"] );
        // busstopTime.push( dateFromString( data[i]["Дата и время"] ) );
        busstopName.push( data[i]["Описание узла"] )
        dataIn.push( parseInt( data[i]["Итого вошло"] ) )
        dataOut.push( parseInt( data[i]["Итого вышло"] ) )

        // dataIn[i] = [];
        // for (let j=1; j<keys.length; j++) {
        //   dataIn[i].push( parseInt( data[i][ keys[j] ] ) )
        // }
      }
      // console.log( dataIn )
      console.log( busstopTime )
    });
  }
  
  //29.01.2018 07:44:3
  function dateFromString(str) {
    var m = str.match(/(\d+).(\d+).(\d+)\s+(\d+)(\d+):(\d+)\.(\d+)/);
    console.log(m)
    return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6] * 100);
  }
  init();

    // t_passengers_bus = zeros(nm_dimensions(1), 1);
    // %num(k, 1) <- people entering the bus
    // %num(k, 2) <- people exiting the bus
    const bus_limit = []
    var number_of_people_in_bus = []
    for ( let i=0; i<dataIn.length; i++) { 
        // bus_limit.push(50)
        if (i<=0) 
            number_of_people_in_bus.push( dataIn[i] - dataOut[i] )
        else
            if ( number_of_people_in_bus[i-1] + dataIn[i] - dataOut[i] > 0 )
                number_of_people_in_bus.push( number_of_people_in_bus[i-1] + dataIn[i] - dataOut[i] )
            else
                number_of_people_in_bus.push( number_of_people_in_bus[i-1] )
    }
    // console.log(number_of_people_in_bus)

  
  Highcharts.chart('chart', {
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: 'Данные одного круга 17 маршрута'
    },
    subtitle: {
        text: 'Source: Astana LRT'
    },
    plotOptions: {
        stacking: 'normal'
    },
    xAxis: [{
        // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        //     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        categories: busstopTime,
        crosshair: true
    // },{
    //     categories: busstopTime,
    //     opposite: true

    //     // crosshair: true
    }],
    yAxis: [{ // Primary yAxis
        labels: {
            format: '{value}',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        title: {
            text: 'Время',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
    }, 
    { // Secondary yAxis
        title: {
            text: 'Вошло',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        labels: {
            format: '{value} ',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        opposite: true
    }],
    tooltip: {
        shared: true
    }, 
    legend: {
        layout: 'vertical',
        align: 'left',
        x: 120,
        verticalAlign: 'top',
        y: 100,
        floating: true,
        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
    },
    series: [{
        name: 'Вошло',
        type: 'column',
        yAxis: 1,
        // data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        data: dataIn,
        tooltip: {
            valueSuffix: ' '
        }

    },{
        name: 'Вышло',
        type: 'column',
        yAxis: 1,
        data: dataOut,
        tooltip: {
            valueSuffix: ' '
        }
    },{
        name: 'Заполненность',
        type: 'column',
        yAxis: 1,
        data: number_of_people_in_bus,
        tooltip: {
            valueSuffix: ' '
        },
        
        
        
    // }, {
    //     name: 'Максимум',
    //     type: 'line',
    //     // data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
    //     data: bus_limit,
    //     tooltip: {
    //         valueSuffix: ''
    //     }
    }]
});

});

