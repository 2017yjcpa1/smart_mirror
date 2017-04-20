define([ 'system', 'lib/forecast.io', 'jquery' ,'jquery-draggable' ],function (system, ForecastIO,$ ) {
     
        var date;
        function getweek(date){
            var week = new Array('일요일','월요일','화요일','수요일','목요일','금요일','토요일');
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
             $('#itemList').draggable({axis:'x'});
             $('#weatherActivity > div').draggable({axis:'y'});
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
                                
				items += '<li><img src="./res/drawable/weather_images/'
                                        +conditions[i].getIcon()+'.png" height="100" width="100">' 
                                        +((conditions[i].getTemperature()-32)/1.8).toFixed(1) 
                                        + '℃  ' + '</li>'+"</br><li>오존지수: "+(conditions[i].getOzone()*0.0001).toFixed(3)+'</li>';
			}
			document.getElementById('currentTemp').innerHTML = items;
		});

		forecast.getForecastToday(locations, function(conditions) {
			var items2 = '';
                        var items3 = ''; 
			for (var i = 0; i < conditions.length; i++) {
				items2 += '<div class="secondsubdiv">' + conditions[i].getTime('HH:mm') + '</br><img src="./res/drawable/weather_images/'
                                        +conditions[i].getIcon()+'.png" height="60" width="60"></br>' 
                                        + ((conditions[i].getTemperature()-32)/1.8).toFixed(1) 
                                        + '℃</br>' + (conditions[i].getPrecipitationProbability()*100).toFixed(0) 
                                        + '%' + '</div>';
                                if(conditions[i].getTime('HH')=='21'){
                                    items3 ='<li><img src="./res/drawable/weather_images/'
                                        +conditions[i].getIcon()+'.png" height="100" width="100">' 
                                        +((conditions[i].getTemperature()-32)/1.8).toFixed(1) 
                                        + '℃  ' + '</li>'+"</br><li>오존지수: "+(conditions[i].getOzone()*0.0001).toFixed(3)+'</li>';
                                        
                                }
			}
                        
			document.getElementById('itemList').innerHTML = items2;
                        document.getElementById('currentTemp2').innerHTML = items3;
		});

                forecast.getForecastWeek(locations, function(conditions) {
			var items4 = '';
                        var items5 = '';//현재날씨 아랫부분
                        var items6 = '';//오늘저녁날씨 아랫부분
                        var items7 = '';//내일날씨
                        var items8 = '';//내일날씨 아랫부분
			for (var i = 0; i < conditions.length; i++) {
                            if(i==0){
                                items5 ='<li>'+((conditions[i].getMinTemperature()-32)/1.8).toFixed(1)+'℃/'
                                        +((conditions[i].getMaxTemperature()-32)/1.8).toFixed(1)+'℃</li><li>'
                                        +(conditions[i].getPrecipitationProbability()*100).toFixed(0)+'%</li>';
                            
                                items6 ='<li>'+((conditions[i].getMinTemperature()-32)/1.8).toFixed(1)+'℃/'
                                        +((conditions[i].getMaxTemperature()-32)/1.8).toFixed(1)+'℃</li><li>'
                                        +(conditions[i].getPrecipitationProbability()*100).toFixed(0)+'%</li>';
                            
                                    items4 += '<div class="thirdsubdiv"><span><img src="./res/drawable/weather_images/'
                                            +conditions[i].getIcon()+'.png" height="55" width="55">' 
                                            +'오늘&nbsp;&nbsp;&nbsp;:  ' 
                                            + ((conditions[i].getMinTemperature()-32)/1.8).toFixed(1) 
                                            + '℃  ' 
                                            + '<span class="bar"style="width:'
                                            +(((conditions[i].getMaxTemperature()-32)/1.8)
                                            -((conditions[i].getMinTemperature()-32)/1.8)).toFixed(1)
                                            +'%;"></span>'+((conditions[i].getMaxTemperature()-32)/1.8).toFixed(1)
                                            +'℃강수확률 : '+(conditions[i].getPrecipitationProbability()*100).toFixed(0)
                                            +'%</span></div>';      
                            }
                            else{
                                if(i==1){
                                    items7 = '<li><img src="./res/drawable/weather_images/'
                                        +conditions[i].getIcon()+'.png" height="100" width="100">' 
                                        +((conditions[i].getMaxTemperature()-32)/1.8).toFixed(1) 
                                        + '℃  ' + '</li>'+"</br><li>오존지수: "+(conditions[i].getOzone()*0.0001).toFixed(3)+'</li>';
                                    items8 ='<li>'+((conditions[i].getMinTemperature()-32)/1.8).toFixed(1)+'℃/'
                                        +((conditions[i].getMaxTemperature()-32)/1.8).toFixed(1)+'℃</li><li>'
                                        +(conditions[i].getPrecipitationProbability()*100).toFixed(0)+'%</li>';
                                }
                                    items4 += '<div class="thirdsubdiv"><span><img src="./res/drawable/weather_images/'
                                            +conditions[i].getIcon()+'.png" height="55" width="55">' 
                                            +getweek(conditions[i].getTime('YYYY-MM-DD')) + ':  ' 
                                            + ((conditions[i].getMinTemperature()-32)/1.8).toFixed(1) 
                                            + '℃  ' 
                                            + '<span class="bar"style="width:'
                                            +(((conditions[i].getMaxTemperature()-32)/1.8)
                                            -((conditions[i].getMinTemperature()-32)/1.8)).toFixed(1)
                                            +'%;"></span>'+((conditions[i].getMaxTemperature()-32)/1.8).toFixed(1)
                                            +'℃강수확률 : '+(conditions[i].getPrecipitationProbability()*100).toFixed(0)
                                            +'%</span></div>';      
                                }
			}
			document.getElementById('itemList3').innerHTML = items4;
                        document.getElementById('currentTempbottom').innerHTML = items5;
                        document.getElementById('currentTemp2bottom').innerHTML = items6;
                        document.getElementById('currentTemp3').innerHTML = items7;
                        document.getElementById('currentTemp3bottom').innerHTML = items8;
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