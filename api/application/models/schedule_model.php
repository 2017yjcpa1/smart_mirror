<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Schedule_model extends CI_Model 
{
    
    function __construct()
    { 
        parent::__construct();
        
        $this->load->database();
    }
    
    function put($user_id, $title, $schedule_date, $contents = '') 
    {
        $data = array();
        $data['user_id'] = $user_id;
        $data['title'] = $title;
        $data['contents'] = $contents;
        $data['schedule_date'] = $schedule_date;
        
        $this->db->insert('schedules', $data);
    }
}
