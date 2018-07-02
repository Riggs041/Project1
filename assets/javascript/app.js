$(document).ready(function () {
    let trackID = "";
    let artistID = "";
    let artistSearch = "";
    let songSearch = "";
    let songName = "";
    let artistName = "";

    $(document).on("click", "#find-music", function () {
        event.preventDefault();
        artistSearch = $("#music-input").val();
        console.log(artistSearch)
        seatGeakAPI();
        flickrAPI();
        $("#band-info").empty();
        $.ajax({
            type: "GET",
            data: {
                apikey: "09b22cab81909924e1542cfdadffe284",
                q_artist: artistSearch,
                format: "jsonp",
                callback: "jsonp_callback"
            },
            url: "https://api.musixmatch.com/ws/1.1/artist.search?",
            dataType: "jsonp",
            jsonpCallback: 'jsonp_callback',
            contentType: 'application/json',
            success: function (data) {
                console.log(data);
            }
        }).then(function (response) {
            if (response.message.body.artist_list.length === 0) {
                let alert = $("<p>")
                alert.text("Artist not found! Try again!")
                $("#band-info").prepend(alert);
            }
            else {
                console.log(response.message.body.artist_list[0].artist.artist_id)
                console.log(response.message.body.artist_list[0].artist.artist_share_url)
                console.log(response.message.body.artist_list[0].artist.artist_name)
                console.log(response.message.body.artist_list[0].artist.artist_twitter_url)
                artistID = response.message.body.artist_list[0].artist.artist_id;
                artistName = response.message.body.artist_list[0].artist.artist_name
                $("#artist-name").text(artistName)
                let newLink = $("<a>");
                newLink.addClass("card-link");
                let link = response.message.body.artist_list[0].artist.artist_share_url
                newLink.attr("href", link);
                newLink.attr("target", "_blank")
                newLink.attr("id", "band-page");
                newLink.text(artistName + " MusixMatch Band Page")
                $("#band-info").append(newLink);
                $("#band-info").append("<br>")
                let twitter = $("<a>");
                twitter.addClass("card-link");
                let twitterURL = response.message.body.artist_list[0].artist.artist_twitter_url
                twitter.attr("href", twitterURL);
                twitter.attr("target", "_blank")
                twitter.attr("id", "band-twitter");
                twitter.text(artistName + " Twitter")
                $("#band-info").append(twitter);
                let lyricSearch = $("<p>")
                lyricSearch.text("Search for a song by " + artistName + " to get lyrics!")
                $("#band-info").append(lyricSearch);
                artistSearch = "";
            }
        })
    })

    $(document).on("click", "#songSubmit", function () {
        songSearch = $("#song-name").val();

        $.ajax({
            type: "GET",
            data: {
                apikey: "09b22cab81909924e1542cfdadffe284",
                q_track: songSearch,
                f_artist_id: artistID,
                format: "jsonp",
                callback: "jsonp_callback"
            },
            url: "https://api.musixmatch.com/ws/1.1/track.search?",
            dataType: "jsonp",
            jsonpCallback: 'jsonp_callback',
            contentType: 'application/json',
            success: function (data) {
                console.log(data);
            }
        }).then(function (response) {
            console.log(trackID);
            if (response.message.body.track_list.length === 0) {
                let alert = $("<p>")
                alert.text("Song not found! Try again!")
                $("#band-info").append(alert);
            }
            else {
                trackID = response.message.body.track_list[0].track.track_id;
                songName = response.message.body.track_list[0].track.track_name;
                console.log(songName);
                console.log(trackID);
                console.log(songSearch);
                $.ajax({
                    type: "GET",
                    data: {
                        apikey: "09b22cab81909924e1542cfdadffe284",
                        track_id: trackID,
                        format: "jsonp",
                        callback: "jsonp_callback"
                    },
                    url: "https://api.musixmatch.com/ws/1.1/track.lyrics.get?",
                    dataType: "jsonp",
                    jsonpCallback: 'jsonp_callback',
                    contentType: 'application/json',
                    success: function (data) {
                        console.log(data);
                    }
                }).then(function (response) {
                    console.log(response.message.body.lyrics.lyrics_body);
                    $("#band-info").empty();
                    let lyrics = response.message.body.lyrics.lyrics_body;
                    let lyricsClean = lyrics.split("\n\n");
                    let lyricsLink = response.message.body.lyrics.backlink_url;
                    console.log(lyricsClean)
                    let title = $("<h6>");
                    title.text(songName);
                    $("#band-info").append(title);
                    for (i = 0; i < lyricsClean.length; i++) {
                        let newDiv = $("<div>");
                        newDiv.attr("id", "lyricsStanza");
                        let lyricsLine = lyricsClean[i];
                        console.log(lyricsLine);
                        lyricsLineClean = lyricsLine.split("\n")
                        console.log(lyricsLineClean)
                        for (j = 0; j < lyricsLineClean.length; j++) {
                            let newP = $("<p>");
                            newP.attr("id", "lyricsLine")
                            newP.text(lyricsLineClean[j]);
                            newDiv.append(newP);
                        }
                        $("#band-info").append(newDiv);
                    }
                    let link = $("<a>");
                    link.attr("href", lyricsLink);
                    link.attr("target", "_blank")
                    link.text("Get The Full Lyrics");
                    $("#band-info").append(link);
                    songSearch = "";
                })
            }
        })
    })

    function seatGeakAPI() {
        $("#seatGeek").empty();
        $.ajax({
            type: "GET",
            data: {
                q: artistSearch,
                client_id: "MTIwODk3MjV8MTUzMDIwNDExNy4xNw",
            },
            url: "https://api.seatgeek.com/2/performers?",
            success: function (data) {
                console.log(data);

            }
        }).then(function (response) {
            console.log(response.performers[0].has_upcoming_events)
            if (artistSearch == "Elvis" || artistSearch == "Evlis Presley"){
                let elvis = $("<p>")
                elvis.text("Elvis has left the building");
                $("#seatGeek").append(elvis);
            }
            
            else if (response.performers[0].has_upcoming_events === false) {
                let noShows = $("<p>")
                noShows.text("Sorry! We Did Not Find Any Shows For This Artist!")
                $("#seatGeek").append(noShows)
            }
            else {
                for (i = 0; i < 3; i++) {
                    let perfName = response.performers[i].name;
                    let perfEvent = response.performers[i].num_upcoming_events;
                    let tixURL = response.performers[i].url;
                    let pName = $("<h6>");
                    pName.text(perfName);
                    let pEvents = $("<p>");
                    pEvents.text("Upcoming shows: " + perfEvent)
                    let tixLink = $("<a>");
                    tixLink.attr("href", tixURL);
                    tixLink.attr("target", "_blank");
                    tixLink.text("Check out tickets on SeatGeek!")
                    $("#seatGeek").append(pName);
                    $("#seatGeek").append(pEvents);
                    $("#seatGeek").append(tixLink);
                }
            }
        })
    }
    function flickrAPI() {
        var queryURL = "https://api.flickr.com/services/rest?method=flickr.photos.search&api_key=e7e4411acf0227d738e8535038de9843&text=" + artistSearch + "&format=json&nojsoncallback=1";

        $.ajax({
            url: queryURL,
            method: "GET",
        })

            .then(function (response) {
                $("#imghere").empty();
                var results = response.photos.photo
                console.log(results)
                for (var i = 0; i < 10; i++) {
                    var farmid = results[i]["farm"];
                    var serverid = results[i]["server"];
                    var id = results[i]["id"];
                    var secret = results[i]["secret"];

                    console.log(farmid)
                    console.log(serverid)
                    console.log(id)
                    console.log(secret)


                    $("#imghere").append("<img src='https://farm" + farmid + ".staticflickr.com/" + serverid + "/" + id + "_" + secret + "_q.jpg'>");
                }
            });
    };

});

