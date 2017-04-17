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

		var locations = [
			{
				latitude: '35.8491', 
				longitude: '128.5341'
			}
			
		];
		var forecast = new ForecastIO({
			PROXY_SCRIPT: 'php/weather_proxy.php'
		});

		forecast.getCurrentConditions(locations, function(conditions) {
			var items = '';
                       
			for (var i = 0; i < conditions.length; i++) {
                                
				items += '<li>'+'<img src="./res/drawable/weather_images/'
                                        +conditions[i].getIcon()+'.png" height="55" width="55">' 
                                        +'기온:' +((conditions[i].getTemperature()-32)/1.8).toFixed(1) 
                                        + '℃  ' + '</li>';
			}
			document.getElementById('currentTemp').innerHTML = items;
		});

		forecast.getForecastToday(locations, function(conditions) {
			var items = '';
			for (var i = 0; i < conditions.length; i+=2) {
				items += '<li>' + conditions[i].getTime('HH:mm') + '시 온도 : ' 
                                        + ((conditions[i].getTemperature()-32)/1.8).toFixed(1) 
                                        + '℃  강수확률 : ' + (conditions[i].getPrecipitationProbability()*100).toFixed(0) 
                                        + '%' + '</li>';
			}
			document.getElementById('itemList').innerHTML = items;
		});

                forecast.getForecastWeek(locations, function(conditions) {
			var items3 = '';
			for (var i = 0; i < conditions.length; i++) {
				items3 += '<li>'+'<img src="./res/drawable/weather_images/'
                                        +conditions[i].getIcon()+'.png" height="55" width="55">' 
                                        + getweek(conditions[i].getTime('YYYY-MM-DD')) + '온도 : ' 
                                        + ((conditions[i].getMaxTemperature()-32)/1.8).toFixed(1) 
                                        + '℃  강수확률 : ' + (conditions[i].getPrecipitationProbability()*100).toFixed(0) 
                                        + '%' +conditions[i].getIcon() +'</li>';      
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