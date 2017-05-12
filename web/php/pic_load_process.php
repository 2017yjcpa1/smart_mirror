<?php 
$path='C:\xampp\htdocs\smart_mirror\gallery';
$handle=opendir($path);
$name= readdir($handle);
$files=array();

   while(false !==($filename=readdir($handle))){
      
       if($filename=="."||$filename ==".."){
           continue;
       }
       if(is_file($path."/".$filename)){
           $files[]=$filename;
       }
   } 
   
   closedir($handle);
   rsort($files);
 
   echo json_encode($files);
   
?>