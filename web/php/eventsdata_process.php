<?php 
	$path='C:/xampp/htdocs/smart_mirror/web/php/eventsdata.json';
	$name='eventsdata.json';
	if(file_exists($path)){
		$data=file_get_contents($name);
	}

	echo $data;
 ?>