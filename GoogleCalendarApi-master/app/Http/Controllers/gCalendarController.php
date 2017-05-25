<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Google_Client;
use Google_Service_Calendar;
use Google_Service_Calendar_Event;
use Google_Service_Calendar_EventDateTime;
use Illuminate\Http\Request;


// $prevQuery = "SELECT * FROM token_info";
// $result = mysqli_query($conn,$prevQuery);
// $db_Data = mysqli_fetch_assoc($result);

class gCalendarController extends Controller
{
    protected $client;

    public function __construct()
    {
        $client = new Google_Client();
        $client->setAuthConfig('client_secret.json');
        $client->addScope(Google_Service_Calendar::CALENDAR); // CALENDAR READONLY 는 읽기만 가능
        $guzzleClient = new \GuzzleHttp\Client(array('curl' => array(CURLOPT_SSL_VERIFYPEER => false)));
        $client->setHttpClient($guzzleClient);
        $client->setAccessType ("offline");
        $client->setApprovalPrompt ("force");
        $client->setRedirectUri('http://localhost/smart_mirror/GoogleCalendarApi-master/public/api/cal');
        $this->client = $client;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        session_start();
        $db_host="localhost";
        $db_user="root";
        $db_pass="";
        $db_name="smartmirror";
        if(!isset($this->db)){
            // Connect to the database
            $conn=mysqli_connect($db_host,$db_user,$db_pass,$db_name);
            if($conn->connect_error){
                die("Failed to connect with MySQL: " . $conn->connect_error);
            }else{
                $this->db = $conn;
            }
        }

        // 사용자 인식후, 사용자의 토큰을 가져와야 됨
        // 사용자 정보가 저장되어 있으면, 사용자가 DB에 있는지 없는지 확인하여 일정을 불러옴.

        // ******************************사용자 등록 기능 만들어야 함 **************************************

        //code..


        if (isset($_SESSION['access_token']) && $_SESSION['access_token']) { //whoareyou.php로부터 시작하여 이게 실행됨.
                                                                            // 일정데이터 저장


                  $row_data;
                  $i=0;
                  foreach ($_SESSION['access_token'] as $key => $value) { // array 형태로 된 값 쪼개기
                    $row_data[$i]=$value;
                    $i++;
                 }
                 $query="SELECT*FROM token_info where access_token='".$row_data[0]."'";
                 $fetch=mysqli_fetch_assoc(mysqli_query($conn,$query)); // 디비에 사용자가 없으면 NULL
                 $user=$fetch['user'];


            $this->client->setAccessToken($_SESSION['access_token']); // 여기서 토큰 받아와서 저장해야지~

                if($this->client->isAccessTokenExpired()){  //토큰이 만료 됬으면


                        $this->client->refreshToken($fetch['refresh_token']);

                        $_SESSION['access_token']=$this->client->getAccessToken();
                        $row_data;
                        $i=0;
                                    foreach ($_SESSION['access_token'] as $key => $value) { // array 형태로 된 값 쪼개기
                                      //$column_name[$i]=$key;
                                      $row_data[$i]=$value;
                                      $i++;
                                   }


                                     $access_token=$row_data[0];
                                     $token_type=$row_data[1];
                                     $expires_in=$row_data[2];
                                     $refresh_token=$row_data[3];
                                     $created=$row_data[4];
                                     $query = "UPDATE token_info
                                     SET access_token = '".mysqli_real_escape_string($conn,$access_token)."',
                                         token_type='".mysqli_real_escape_string($conn,$token_type)."',
                                         expires_in='".mysqli_real_escape_string($conn,$expires_in)."',
                                         created='".mysqli_real_escape_string($conn,$created)."',
                                         refresh_token='".mysqli_real_escape_string($conn,$refresh_token)."'
                                         WHERE user='".$user."'";

                                      mysqli_query($conn,$query);
                                      $this->client->setAccessToken($_SESSION['access_token']);
                }

            $service = new Google_Service_Calendar($this->client);

            $calendarId = 'primary';

            $results = $service->events->listEvents($calendarId);

            // fullcalendar_friendly data construction
            $events=$results->getItems();


            $data=[];
            foreach ($events as $event) {  // 구글 캘린더에 등록된 일정 불러오기. JSON에 딱 박아넣어

              $subArr=[
                'id'=>$event->id,
                'title'=>$event->getSummary(),
                'start'=>$event->getStart()->getDateTime(),
                'end_date'=>$event->getend()->getDateTime(),
                'location'=>$event->getLocation(),  

              ];
              array_push($data,$subArr);
            }
            $a=json_encode($data);
            file_put_contents("C:/xampp\htdocs\smart_mirror\web\php/eventsdata.json",$a);


            return redirect('http://localhost/smart_mirror/web');
            // return $data;
        } else {
            return redirect()->route('oauthCallback');
        }

    }

    public function oauth()   // 여기서 시작
    {
        session_start();

        $rurl = action('gCalendarController@oauth');

        $this->client->setRedirectUri($rurl);
        // if (!isset($_GET['code'])) { // code 값이 없으면
        //     $auth_url = $this->client->createAuthUrl();
        //
        //     $filtered_url = filter_var($auth_url, FILTER_SANITIZE_URL);
        //     echo 'filtered URL : '.$filtered_url;
        //     return redirect($filtered_url); // 구글 로그인화면으로 ~
        //
        // } else

        if (isset($_GET['code'])){ // 사용자등록(request) - 구글로그인(authorization) - code 획득
                                  //code가 있으면 (사용자 등록시) 사용자등록 화면으로 보냄. *사용자등록할때를 제외하곤 코드 절대 안받음*

                  $code=$_GET['code'];
                  $this->client->authenticate($_GET['code']);
                  echo print_r($this->client->getRefreshToken());
                  $_SESSION['access_token'] = $this->client->getAccessToken();
                  $row_data;
                  $i=0;
                  echo print_r($_SESSION['access_token']);

                  foreach ($_SESSION['access_token'] as $key => $value) { // array 형태로 된 값 쪼개기
                    //$column_name[$i]=$key;
                    $row_data[$i]=$value;
                    $i++;
                 }


                 $access_token=$row_data[0];
                 $token_type=$row_data[1];
                 $expires_in=$row_data[2];
                 $refresh_token=$row_data[3];
                 $created=$row_data[4];

            //  return redirect()->route('cal.index');

            return redirect("/register.php?access_token=".$access_token."&token_type=".$token_type.
                            "&expires_in=".$expires_in."&created=".$created."&refresh_token=".$refresh_token);

        }

        if(isset($_GET['login'])){
              $authUrl = $this->client->createAuthUrl();
            return redirect($authUrl);
        }

        if(isset($_GET['done'])){
              if($_GET['done']==='register'){
              return redirect("https://accounts.google.com/logout");
            }
        }
        if(isset($_GET['done'])){ // 사용자 로그인
          // $code=$_GET['code'];
          // $this->client->authenticate($_GET['code']);
          // $_SESSION['access_token'] = $this->client->getAccessToken();
                if($_GET['done']==='a'){
              $db_host="localhost";
              $db_user="root";
              $db_pass="";
              $db_name="smartmirror";
              $conn=mysqli_connect($db_host,$db_user,$db_pass,$db_name);
              $user=$_GET['name'];
              $query="SELECT*FROM token_info where user='".$user."'";
              $fetch=mysqli_fetch_assoc(mysqli_query($conn,$query)); // 디비에 사용자가 없으면 NULL

              $_SESSION['access_token']=array(
                'access_token'=>$fetch['access_token'],
                'token_type'=>$fetch['token_type'],
                'expires_in'=>$fetch['expires_in'],
                'created'=>$fetch['created']
              );

    //            return redirect('http://localhost/GoogleCalendarApi-master/public/events');
                return redirect('http://localhost/smart_mirror/GoogleCalendarApi-master/public/api/cal');
                  // return redirect('http://localhost/smart_mirror/GoogleCalendarApi-master/public/api/oauth?b=1');
            }
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('calendar.createEvent');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        session_start();
        $startDateTime = $request->start_date;
        $endDateTime = $request->end_date;

        if (isset($_SESSION['access_token']) && $_SESSION['access_token']) {
            $this->client->setAccessToken($_SESSION['access_token']);
            $service = new Google_Service_Calendar($this->client);

            $calendarId = 'primary';
            $event = new Google_Service_Calendar_Event([
                'summary' => $request->title,
                'description' => $request->description,
                'start' => ['dateTime' => $startDateTime],
                'end' => ['dateTime' => $endDateTime],
                'reminders' => ['useDefault' => true],
            ]);
            $results = $service->events->insert($calendarId, $event);
            if (!$results) {
                return response()->json(['status' => 'error', 'message' => 'Something went wrong']);
            }
            return response()->json(['status' => 'success', 'message' => 'Event Created']);
        } else {
            return redirect()->route('oauthCallback');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param $eventId
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function show($eventId)
    {
        session_start();
        if (isset($_SESSION['access_token']) && $_SESSION['access_token']) {
            $this->client->setAccessToken($_SESSION['access_token']);

            $service = new Google_Service_Calendar($this->client);
            $event = $service->events->get('primary', $eventId);

            if (!$event) {
                return response()->json(['status' => 'error', 'message' => 'Something went wrong']);
            }
            return response()->json(['status' => 'success', 'data' => $event]);

        } else {
            return redirect()->route('oauthCallback');
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param $eventId
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function update(Request $request, $eventId)
    {
        session_start();
        if (isset($_SESSION['access_token']) && $_SESSION['access_token']) {
            $this->client->setAccessToken($_SESSION['access_token']);
            $service = new Google_Service_Calendar($this->client);

            $startDateTime = Carbon::parse($request->start_date)->toRfc3339String();

            $eventDuration = 30; //minutes

            if ($request->has('end_date')) {
                $endDateTime = Carbon::parse($request->end_date)->toRfc3339String();

            } else {
                $endDateTime = Carbon::parse($request->start_date)->addMinutes($eventDuration)->toRfc3339String();
            }

            // retrieve the event from the API.
            $event = $service->events->get('primary', $eventId);

            $event->setSummary($request->title);

            $event->setDescription($request->description);

            //start time
            $start = new Google_Service_Calendar_EventDateTime();
            $start->setDateTime($startDateTime);
            $event->setStart($start);

            //end time
            $end = new Google_Service_Calendar_EventDateTime();
            $end->setDateTime($endDateTime);
            $event->setEnd($end);

            $updatedEvent = $service->events->update('primary', $event->getId(), $event);


            if (!$updatedEvent) {
                return response()->json(['status' => 'error', 'message' => 'Something went wrong']);
            }
            return response()->json(['status' => 'success', 'data' => $updatedEvent]);

        } else {
            return redirect()->route('oauthCallback');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $eventId
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function destroy($eventId)
    {
        session_start();
        if (isset($_SESSION['access_token']) && $_SESSION['access_token']) {
            $this->client->setAccessToken($_SESSION['access_token']);
            $service = new Google_Service_Calendar($this->client);

            $service->events->delete('primary', $eventId);

        } else {
            return redirect()->route('oauthCallback');
        }
    }
}
