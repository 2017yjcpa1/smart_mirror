define(['system',
    'jquery',
    'jquery-draggable'

], function (system, $) {

            function search(e) {
                e.preventDefault();
//clear results
                $('#results').html('');
                $('#buttons').html('');

//Get form input
                query = $('#query').val();

//Run get request API
                $.get(
                        "https://www.googleapis.com/youtube/v3/search", {
                            part: 'snippet, id',
                            q: query,
                            type: 'video',
                            key: 'AIzaSyASFltS6aSwHYy6q9ft-KIH8wAB0-rEHfs'},
                function (data) {
                    var nextPageToken = data.nextPageToken;
                    var prevPageToken = data.prevPageToken;
                    console.log(data);

                    $.each(data.items, function (i, item) {
                        //get output
                        var output = getOutput(item);
                        //Display results
                        $('#results').append(output);
                    });

                    var buttons = getButtons(prevPageToken, nextPageToken);

                    //Display buttons
                    $('#buttons').append(buttons);
                }
                );
            }

//Next page function
            function nextPage() {

                var token = $('#next-button').data('token');
                var query = $('#next-button').data('query');

//clear results
                $('#results').html('');
                $('#buttons').html('');

//Get form input
                query = $('#query').val();

//Run get request API
                $.get(
                        "https://www.googleapis.com/youtube/v3/search", {
                            part: 'snippet, id',
                            q: query,
                            pageToken: token,
                            type: 'video',
                            key: 'AIzaSyASFltS6aSwHYy6q9ft-KIH8wAB0-rEHfs'},
                function (data) {
                    var nextPageToken = data.nextPageToken;
                    var prevPageToken = data.prevPageToken;
                    console.log(data);

                    $.each(data.items, function (i, item) {
                        //get output
                        var output = getOutput(item);
                        //Display results
                        $('#results').append(output);
                    });

                    var buttons = getButtons(prevPageToken, nextPageToken);

                    //Display buttons
                    $('#buttons').append(buttons);
                }
                );

            }

            function prevPage() {
                var token = $('#prev-button').data('token');
                var query = $('#prev-button').data('query');

//clear results
                $('#results').html('');
                $('#buttons').html('');

//Get form input
                query = $('#query').val();

//Run get request API
                $.get(
                        "https://www.googleapis.com/youtube/v3/search", {
                            part: 'snippet, id',
                            q: query,
                            pageToken: token,
                            type: 'video',
                            key: 'AIzaSyASFltS6aSwHYy6q9ft-KIH8wAB0-rEHfs'},
                function (data) {
                    var nextPageToken = data.nextPageToken;
                    var prevPageToken = data.prevPageToken;
                    console.log(data);

                    $.each(data.items, function (i, item) {
                        //get output
                        var output = getOutput(item);
                        //Display results
                        $('#results').append(output);
                    });

                    var buttons = getButtons(prevPageToken, nextPageToken);

                    //Display buttons
                    $('#buttons').append(buttons);
                }
                );
            }

//Build output
            function getOutput(item) {
                var videoId = item.id.videoId;
                var title = item.snippet.title;
                var description = item.snippet.description;
                var thumb = item.snippet.thumbnails.high.url;
                var channelTitle = item.snippet.channelTitle;
                var videoDate = item.snippet.publishedAt;

//Build output String 
                var output ='<iframe class="list-left"src="https://www.youtube.com/embed/'+ videoId +'"frameborder="0" allowfullscreen="true"></iframe>';
                
                return output;
            }

            function getButtons(prevPageToken, nextPageToken) {
                if (!prevPageToken) {
                    var btnOutput = $('<div class="button-container">' +
                            '<button id="next-button" class="paging-button" data-token="' + nextPageToken +
                            '" data-query="' + query + '" ></button></div>').click(nextPage);
                } else {
                    var nextBtn = $('<button id="next-button" data-token="' + nextPageToken +'" data-query="' + query + '"></button>').click(nextPage);
                    var prevBtn = $('<button id="prev-button" data-token="' + prevPageToken +'" data-query="' + query + '"></button>').click(prevPage);
                 
                    var btnOutput = $('<div class="button-container"></div>');
                    
                    prevBtn.appendTo(btnOutput);
                    nextBtn.appendTo(btnOutput);
                }
                return btnOutput;
            }

    return {
        id: 'youtubeActivity',
        title: '유튜브',
        icon: 'ic_youtube.png',
        layoutHTML: 'activity_youtube.html',
        init: function () {
            console.log('youtube init');
            $('#youtubeActivity').draggable({axis:'y'});
            $('#search-form').submit(search);
        },
        resume: function () {
            console.log('youtube resume');
            $(function () {
                var searchField = $('#query');
                var icon = $('#searchBtn');
            });
        },
        pause: function () {
            console.log('youtube pause');
        },
        destroy: function () {
            console.log('youtube destroy');
        },
    }

})
