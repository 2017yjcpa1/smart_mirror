define([ 'system', 'lib/forecast.io' ],function (system, ForecastIO) {
     
        var date;
        function getweek(date){
            var week = new Array('일','월','화','수','목','금','토');
            var day = new Date(date).getDay();
            var todayLabel = week[day];
            return todayLabel;
        }
    
    return {
        
        id : 'weatherActivity',
        title : '날씨',
        icon : 'ic_weather.png',
        layoutHTML : 'activity_weather.html',
        
        init : function () {
            
            
        },
        
        resume : function () {
            console.log('weather resume');
            
            
            
               //This function is called when scripts/helper/util.js is loaded.
	    //If util.js calls define(), then this function is not fired until
	    //util's dependencies have loaded, and the util argument will hold
	    //the module value for 'helper/util'.

	    /*
		 * EXAMPLE LOCATION DATAQ
		 */
		var locations = [
			{
				latitude: '35.8491', 
				longitude: '128.5341'
			}
			
		];
		var forecast = new ForecastIO({
			PROXY_SCRIPT: 'php/weather_proxy.php'
		});
		/*
		 * GET CURRENT CONDITIONS
		 */
		forecast.getCurrentConditions(locations, function(conditions) {
			var items = '';
                       
			// echo temperature
			for (var i = 0; i < conditions.length; i++) {
                                
				items += '<li>'+'<img src="/forecast.io/forecast.io/images/'+conditions[i].getIcon()+'.png" height="48" width="48">' +'기온:' +((conditions[i].getTemperature()-32)/1.8).toFixed(1) + '℃  ' + '</li>';
			}
			document.getElementById('currentTemp').innerHTML = items;
		});
		/*
		 * GET HOURLY CONDITIONS FOR TODAY
		 */
		forecast.getForecastToday(locations, function(conditions) {
			var items = '';
			for (var i = 0; i < conditions.length; i+=2) {
				items += '<li>' + conditions[i].getTime('HH:mm') + '시 온도 : ' + ((conditions[i].getTemperature()-32)/1.8).toFixed(1) + '℃  강수확률 : ' + (conditions[i].getPrecipitationProbability()*100).toFixed(0) + '%' + '</li>';
                                //items2 += '<li>' + conditions[i].getTime('HH:mm') + ': ' + conditions[i].getPrecipitationProbability() + '</li>';
			}
			document.getElementById('itemList').innerHTML = items;
		});
		/*	
		 * GET DAILY CONDITIONS FOR NEXT 7 DAYS
		 */ 
                forecast.getForecastWeek(locations, function(conditions) {
			var items3 = '';
			for (var i = 0; i < conditions.length; i++) {
				items3 += '<li>'+'<img src="/forecast.io/forecast.io/images/'+conditions[i].getIcon()+'.png" height="42" width="42">' 
                                        + getweek(conditions[i].getTime('YYYY-MM-DD')) + '온도 : ' + ((conditions[i].getMaxTemperature()-32)/1.8).toFixed(1) 
                                        + '℃  강수확률 : ' + (conditions[i].getPrecipitationProbability()*100).toFixed(0) + '%' +conditions[i].getIcon() +'</li>';      
			}
			document.getElementById('itemList3').innerHTML = items3;     
		});
            
            
        },
        
        pause : function () {
            console.log('weather pause');
        },
        
        destroy : function () {
            console.log('weather destroy');
        },
    }
})