<?php

include 'C:\xampp\htdocs\smart_mirror\web\php\getID3-1.9.14\getid3/getid3.php';

$path = 'C:\xampp\htdocs\smart_mirror\music/';
$getID3 = new getID3;
$handle = opendir($path);
$files = array();
while ($filename = readdir($handle)) {

    if ($filename == "." || $filename == "..") { // 얘네는 걸러냄 
        continue;
    }
    if (is_file($path . "/" . $filename)) { // 해당경로에 파일이 있으면 
        $files[] = $filename; // 삽입 ! 
    }
}

closedir($handle);
rsort($files);
$i = 0; $a=0;
$length = sizeof($files);

for ($i; $i < $length; $i++) {
    $file = $getID3->analyze($path . $files[$i]);
    
    $id3tag[] = array(
        'title' => $file['tags']['id3v2']['title'],
        'artist' => $file['tags']['id3v2']['artist'],
        'album' => $file['tags']['id3v2']['album'],
        'lyric' => $file['tags']['id3v2']['unsynchronised_lyric'][0],
        'playtime' => $file['playtime_string'],
        'picture' => base64_encode($file['comments']['picture'][0]['data'])
    );                                    
    
}
//echo base64_encode($file['comments']['picture']['0']['data']);

echo json_encode($id3tag); // JSON 포맷 형식 
?>