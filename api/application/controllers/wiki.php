<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Wiki extends CI_Controller
{
    // https://ko.wikipedia.org/w/api.php?action=opensearch&search=%EC%98%81%EC%A7%84&namespace=0
    
    public function __construct() 
    {
        parent::__construct();
        
        $this->load->helper('curl');
    }

    public function index()
    {
        $query = $this->input->get('q');
        
        $params = array();
        $params['action'] = 'opensearch';
        $params['search'] = $query;
        $params['namespace'] = 0;
        
        $wiki = json_decode(simple_get('http://ko.wikipedia.org/w/api.php', $params));
        
        $wiki = array_filter($wiki[2]);
        $wiki = array_values($wiki); // 인덱스 재정렬
        
        $this->output->set_content_type('application/json');
        $this->output->set_output(json_encode($wiki));
    }
}