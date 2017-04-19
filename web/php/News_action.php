<?php
header("Content-Type: application/json; charset=UTF8");
$client_id = "RXI9sDWyAQ_J0ft2a3NA";  // id
$client_secret = "6Inq7tCXxF";        // ps
$encText = urlencode("실시간"); // 검색 키워드
$url = "https://openapi.naver.com/v1/search/news.json?query=" . $encText; // json 결과
//  $url = "https://openapi.naver.com/v1/search/blog.xml?query=".$encText; // xml 결과
$is_post = false;
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, $is_post);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$headers = array();
$headers[] = "X-Naver-Client-Id: " . $client_id;
$headers[] = "X-Naver-Client-Secret: " . $client_secret;
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
$response = curl_exec($ch);
$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
//echo "status_code:".$status_code."";
curl_close($ch);

echo $response;
?> 