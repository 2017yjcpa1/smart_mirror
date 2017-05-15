<?php
include 'C:\xampp\htdocs\smart_mirror\web\php\getID3-1.9.14\getid3/getid3.php';

$path='C:\xampp\htdocs\smart_mirror\music/Dont You Remember.mp3';
$getID3=new getID3;
$file=$getID3->analyze($path);

echo print_r($file);

?>