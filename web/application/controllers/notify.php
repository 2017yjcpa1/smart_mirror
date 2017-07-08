<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Notify extends CI_Controller
{
    const MAX_ATTEMPTS = 60;
    
    public function __construct() 
    {
        parent::__construct();
    
        $this->load->database();
    }
	
    function _get($id)
    {
        $query = $this->db->query('SELECT
                                        message,
                                        creation_date
                                   FROM messages 
                                   WHERE id = ?
                                   LIMIT 1', array($id));
        
        if ($query->num_rows() <= 0)
        {
            return FALSE;
        }
        
        $messages = array();
        $creation_date = 0;
         
        foreach ($query->result_array() as $row)
        {
            $messages []= json_decode($query->row()->message);
            $creation_date = max(array($creation_date, $query->row()->creation_date));
        }
        
        return array(
            'creation_date' => $creation_date,
            'messages' => $messages,
        );
    }
	
    function _has_happened($creation_date)
    {
        $query = $this->db->query('SELECT
                                        id,
                                        creation_date
                                   FROM messages 
                                   WHERE creation_date > ? 
                                   LIMIT 1', array($creation_date));
        
        if ($query->num_rows() <= 0)
        {
            return FALSE;
        }
        
        return $query->row()->id;
    }
    
    public function push()
    {
        $message = $this->input->post('message');
        $creation_date = microtime(TRUE) * 10000;

        $data = array();
        $data['message'] = $message;
        $data['creation_date'] = $creation_date;
        
        $this->db->insert('messages', $data);
    }

    public function pull()
    { 
        set_time_limit(0);

        $this->output->set_content_type('application/json');

        $creation_date = $this->input->get('creation_date');
        $attempts = 0;

        if ($creation_date === FALSE)
        {
            $creation_date = microtime(TRUE) * 10000;
        }

        $message = array('creation_date' => $creation_date);

        while ($attempts++ < self::MAX_ATTEMPTS)
        {
            if (($message_id = $this->_has_happened($creation_date)) !== FALSE)
            {
                $message = $this->_get($message_id);
                break;
            }

            sleep(1);
        }

        $this->output->set_content_type('application/json');
        $this->output->set_output(json_encode($message));
    }
}