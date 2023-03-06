$(document).ready(function () {
    SpGetAccessToken();//Start function
});

function SpGetAccessToken() {
    let inf = ['CLIENT_ID', 'CLIENT_SECRET', 'REFRESH_TOKEN'];

    $.ajax({
        url: "https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=" + inf[2], type: 'POST', dataType: 'json', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + btoa(inf[0] + ':' + inf[1]) },//Base64
        success: function (result) { SpGetTokenSuccess(result); },
        error: function (result) { TokenErr(result) }
    });
}

let access_token = '';
function SpGetTokenSuccess(res) {
    access_token = res.access_token;//Type : Bearer
    console.log("Your spotify api access token : " + access_token);
    SpGetData('player'); //Get api data
}

function SpGetData(ur) {
    //token_type = 'Bearer'
    //if (ur == 'player') * for cycle event
    $.ajax({
        url: 'https://api.spotify.com/v1/me/' + ur, type: 'GET', dataType: 'json', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + access_token },
        success: function (result) { if (ur == 'player') SpCurrentlyPlaying(result); if (ur == 'player/queue') SpListQueue(result); },
        error: function (result) { Err(result); }
    });
}
let songplayurl = '';
function SpCurrentlyPlaying(SpPlayer) {
    try {
        let txt = ''; //For information
        if (SpPlayer != null) {
            if (SpPlayer.is_playing)
                txt = "song is playing"; //Song is now playing
            else {
                txt = 'is not playing!'; //Resume currently song
            }
            var obj = SpPlayer["item"];//Get json item
            songplayurl = obj["external_urls"].spotify;//Song external url
            SpInfoRefresh(obj.name, obj["artists"][0].name, obj["album"]["images"][0].url, obj.popularity);
            //name, artist, albumimage, pop
        } else {
            txt = 'play a song';
            //Spotify returned null response
        }
        _('now-playing').innerText = txt;//Put current play info
        setTimeout("SpGetData('player')", 800); //Get https://api.spotify.com/v1/me/player data and return this function 800ms later
    } catch {
        alert('Json unreadable!');//Reasons for this error: 503 Server Err or Null content
        //Refreshing the page might fix the error
        window.location.reload();
    }
}
let errcounter = 0;
function Err() {
    errcounter++;
    _('errcounter').innerText = errcounter;
    setTimeout("SpGetData('player')", 800);
}
function TokenErr(){
    alert("Client error please check the client options");
}
function PlaySong() {
    //click on the album img opens the song url
    if (songplayurl != '')
        window.open(songplayurl, "_blank");//window blank
}
function SpInfoRefresh(name, artist, img, pop) {
    _('playing').innerText = name; //Song Name
    _('artist').innerText = artist; //Artist
    _('pop').innerText = '#'+pop; //Popularity
    _('song-img').src = img; //Album Image
}
function _(id) {
    return document.getElementById(id);//THIS SHORT MODE
}
function SpListQueue(data) {
    if (data["queue"].length != 0) {
        console.log(data);//DEBUG
    }
}