<?php
  include('db_config.php');

  $user=$_POST['name'];
  $access_token=$_POST['access_token'];
  $token_type=$_POST['token_type'];
  $expires_in=$_POST['expires_in'];
  $created=$_POST['created'];
  $refresh_token=$_POST['refresh_token'];

  $query="SELECT*FROM token_info where user='".$user."'";
  $fetch=mysqli_fetch_assoc(mysqli_query($conn,$query)); // 디비에 사용자가 없으면 NULL

  if(!($user===$fetch['user'])){ // DB에 등록된 사용자가 아니면,새로운 사용자 등록, 따로 뺴내서 등록 기능을 만들어야 함.
    $query = "INSERT INTO token_info(`access_token`,
                                     `token_type`,
                                     `expires_in`,
                                     `created`,
                                     `refresh_token`,
                                     `user`)
                                    VALUES (
                                      '".mysqli_real_escape_string($conn,$access_token)."',
                                      '".mysqli_real_escape_string($conn,$token_type)."',
                                      '".mysqli_real_escape_string($conn,$expires_in)."',
                                      '".mysqli_real_escape_string($conn,$created)."',
                                      '".mysqli_real_escape_string($conn,$refresh_token)."',
                                      '".$user."')";

                                      mysqli_query($conn,$query);
                                    }else{ // 등록된 사용자면
                                      $query = "UPDATE token_info
                                      SET access_token = '".mysqli_real_escape_string($conn,$access_token)."',
                                          token_type='".mysqli_real_escape_string($conn,$token_type)."',
                                          expires_in='".mysqli_real_escape_string($conn,$expires_in)."',
                                          created='".mysqli_real_escape_string($conn,$created)."',
                                          refresh_token='".mysqli_real_escape_string($conn,$refresh_token)."'
                                          WHERE user='".$user."'";

                                       mysqli_query($conn,$query);
                                    }
//          header('location:http://localhost/GoogleCalendarApi-master/public/api/cal');
        header('location:http://localhost/smart_mirror/GoogleCalendarApi-master/public/api/oauth?done=register');
        // ********************* 토큰 재요청 *********************** //


 ?>
