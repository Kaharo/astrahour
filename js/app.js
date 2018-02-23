$(document).ready(function(){
  var data
  function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data/37RandomSampleDataIn.json', false); // Replace 'my_data' with the path to your file
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
      
      let keys = Object.keys(data[0]);
      for (let j=1; j<keys.length; j++) 
          busstopName.push( keys[j] )

      for(let i in data) {
        // console.log(data[i]["busstop"]);
        // busstopTime.push(data[i]["busstop"] + " " + data[i]["time"]);
        // dataIn.push( parseInt( data[i]["in"] ) );
        // dataOut.push( parseInt( data[i]["out"] ) );
        busstopTime.push( data[i]["Время "] );
        dataIn[i] = [];
        for (let j=1; j<keys.length; j++) {
          dataIn[i].push( parseInt( data[i][ keys[j] ] ) )
        }
      }
    });
  }
  
  init();
  
  var dataValues = {};
  var dataSeries = [];
  // options.series[1].data = dataIn[1]
  for (let i=0; i<dataIn.length; i++) {
    dataValues = {
      stack: 0,
      data: dataIn[i]
    }
    dataSeries.push( dataValues ) 
  }
  console.log( dataSeries )
  
  
  var options = {
    chart: {
      renderTo: 'chart',
      type: 'column',
      options3d: {
        enabled: true,
        alpha: 20,
        beta: 30,
        depth: 1600, // Set deph
        viewDistance: 7,
        frame: {
          bottom: {
            size: 1,
            color: 'rgba(0,0,0,0.05)'
          }
        }
      }
    },
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    yAxis: {
      min: 0
    },
    xAxis: {
      min: 0, 
      max: busstopName.length,
      categories: busstopName,
      gridLineWidth: 1
    },
    zAxis: {
      min: 0, 
      max: busstopTime.length,
      categories: busstopTime,
      labels: {
        y: 1,
        rotation: 18
      }
    },
    plotOptions: {
      series: {
        grouping: false,
      }
    },
    // series: [{
    //   stack: 0,
    //   data: dataIn
    // // }, {
    // //   stack: 1,
    // //   data: dataOut
    // }]
    // series: [{}]
    series: dataSeries
  };
  


  var chart = new Highcharts.chart(options);

  // Add mouse events for rotation
  $(chart.container).on('mousedown.hc touchstart.hc', function(eStart) {
    eStart = chart.pointer.normalize(eStart);

    var posX = eStart.pageX,
      posY = eStart.pageY,
      alpha = chart.options.chart.options3d.alpha,
      beta = chart.options.chart.options3d.beta,
      newAlpha,
      newBeta,
      sensitivity = 5; // lower is more sensitive

    $(document).on({
      'mousemove.hc touchdrag.hc': function(e) {
        // Run beta
        newBeta = beta + (posX - e.pageX) / sensitivity;
        chart.options.chart.options3d.beta = newBeta;

        // Run alpha
        newAlpha = alpha + (e.pageY - posY) / sensitivity;
        chart.options.chart.options3d.alpha = newAlpha;

        chart.redraw(false);
      },
      'mouseup touchend': function() {
        $(document).off('.hc');
      }
    });
  });

});