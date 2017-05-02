<?php

    $access_token=$_GET['access_token'];
    $token_type=$_GET['token_type'];
    $expires_in=$_GET['expires_in'];
    $created=$_GET['created'];
    $refresh_token=$_GET['refresh_token'];

 ?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <h1>
    사용자 등록
  </h1>

  <form action='register_process.php' method="post">
    <input type="text" name="name" placeholder="이름을 입력하세요">
    <input type="hidden" name='access_token' value="<?php echo $access_token ?>">
    <input type="hidden" name='token_type' value="<?php echo $token_type ?>">
    <input type="hidden" name='expires_in' value="<?php echo $expires_in ?>">
    <input type="hidden" name='created' value="<?php echo $created ?>">
    <input type="hidden" name='refresh_token' value="<?php echo $refresh_token ?>">

    <input type="submit" value="등록">
  </form>
</body>
</html>
