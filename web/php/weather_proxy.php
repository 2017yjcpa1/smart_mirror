<?php
// File Name: proxy.php

$api_key = 'f16953c39ae96b0f7a9c14c0f07ce5c4';


$API_ENDPOINT = 'https://api.forecast.io/forecast/';
$url = $API_ENDPOINT . $api_key . '/';

if(!isset($_GET['url'])) die();
$url = $url . $_GET['url'];
$url = file_get_contents($url);

print_r($url);
