<?php
$code = $_GET["code"];

$clientid = "";
$clientsecret = "";
$redirecturi = "";//Encode http url

if($code !=null) {

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,"https://accounts.spotify.com/api/token");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS,"client_id=$clientid&client_secret=$clientsecret&grant_type=authorization_code&code=$code&redirect_uri=$redirecturi");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$server_output = curl_exec($ch);
curl_close($ch);
echo $server_output;
//COPY refresh_token
return; 
}
//DO DEFAULT INDEX FILE OR EMPTY

?>