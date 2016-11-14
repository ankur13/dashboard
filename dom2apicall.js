$(document).ready(function(){
    	$("#authorize-button").on('click',function(){
    	$.getScript('https://apis.google.com/js/api.js?onload=handleClientLoad',function(){ 
    		gapi.load('client:auth2', initAuth);
    	});
      var apiKey = $('#key').val();
     
      var clientId = $('#client_id').val();
      var project_name=$('#project_name').val();
      var instance_name=$('#instance_name').val();
      var start_date=$('#start_date').val();
      var start_time=$('#start_time').val();
      var end_date=$('#end_date').val();
      var end_time=$('#end_time').val();
      var zone=$('#zone').val();
      var metric=$('#metric').val();
      var scopes = 'https://www.googleapis.com/auth/monitoring';
      var auth2; // The Sign-In object.
      var authorizeButton = document.getElementById('authorize-button');
      var signoutButton = document.getElementById('signout-button');
     
      function initAuth() {
        gapi.client.setApiKey(apiKey);
        gapi.auth2.init({
            client_id: clientId,
            scope: scopes
        }).then(function () {
          auth2 = gapi.auth2.getAuthInstance();
          // Listen for sign-in state changes.
          auth2.isSignedIn.listen(updateSigninStatus);
          // Handle the initial sign-in state.
          updateSigninStatus(auth2.isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        });
      }
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          makeApiCall();
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
        }
      }

      function handleAuthClick(event) {
        auth2.signIn();
      }
      function handleSignoutClick(event) {
        auth2.signOut();
      }
      // Load the API and make an API call.  Display the results on the screen.
      function makeApiCall() {
        gapi.client.load('monitoring', 'v3', function() {
          var request = gapi.client.request({
            'path':'https://monitoring.googleapis.com/v3/projects/'+project_name+'/timeSeries',
          'method':'GET',
          'params':{
            'filter':'metric.type = "compute.googleapis.com/instance/'+metric+'" AND metric.label.instance_name = "'+instance_name+'"',
             
            'interval.endTime':end_date+'T'+end_time+zone,
            'interval.startTime':start_date+'T'+start_time+zone

          }
          });
          request.execute(function(resp) {
            var p = document.createElement('p');
            var points=resp.timeSeries[0].points;
            var endtime=[];
            var value=[];
            var i;
            for(i=0;i<points.length;i++)
            {
              endtime.push(JSON.stringify(points[i].interval.endTime));
              value.push(JSON.stringify(points[i].value.doubleValue));

            }
          var chart=document.getElementById("lineChart");
          var context=chart.getContext('2d');
          context.clearRect(0,0,chart.width,chart.height);
    
           var lineChart= new Chart(chart,{
            type:'line',
            data: {
              labels: endtime,
              datasets: [
                  {
                      label: metric,
                      fill: false,
                      lineTension: 0.1,
                      backgroundColor: "rgba(75,192,192,0.4)",
                      borderColor: "rgba(75,192,192,1)",
                      borderCapStyle: 'butt',
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: 'miter',
                      pointBorderColor: "rgba(75,192,192,1)",
                      pointBackgroundColor: "#fff",
                      pointBorderWidth: 1,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: "rgba(75,192,192,1)",
                      pointHoverBorderColor: "rgba(220,220,220,1)",
                      pointHoverBorderWidth: 2,
                      pointRadius: 1,
                      pointHitRadius: 10,
                      data: value,
                      spanGaps: false,
                  }
              ]
          }

     });            
            
           

          });
        });
       
        
      }});

    });