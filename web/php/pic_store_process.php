<?php
$url=$_POST['url'];
$data=ereg_replace('data:image/png;base64,', '', $url);// 필요없는거 떼내기, 순수 png 데이터만 저장
$decode= base64_decode($data); // 바이너리 데이터를 텍스트로 변환
$time=date("Ymdhisa"); // 현재시간으로 파일 이름 지정 

file_put_contents('../../gallery/'.$time.'.png', $decode); // 저장 ! 
?>