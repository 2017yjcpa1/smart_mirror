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

$obj = json_decode($response);


$first_news = $obj->items[0];

function file_get_contents_curl($url)
{
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);

    $data = curl_exec($ch);
    curl_close($ch);

    return $data;
}

$html = file_get_contents_curl($first_news->link);

//parsing begins here:
$doc = new DOMDocument();
@$doc->loadHTML($html); 
$metas = $doc->getElementsByTagName('meta');

$first_news_image = '';

for ($i = 0; $i < $metas->length; $i++)
{
    $meta = $metas->item($i);
    if($meta->getAttribute('property') == 'og:image') {
        $first_news_image = $meta->getAttribute('content');
    }
}

$first_news->image = $first_news_image;

echo json_encode($obj);
?> 