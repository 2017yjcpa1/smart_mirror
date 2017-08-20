<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Weather extends CI_Controller
{
    const API_KEY = 'f16953c39ae96b0f7a9c14c0f07ce5c4';
    const API_ENDPOINT = 'https://api.forecast.io/forecast';
    
    public function __construct() 
    {
        parent::__construct();
        
        $this->load->helper('curl');
    }
    
    private function _build_url($lat, $lon) {
        
        $url = rtrim(self::API_ENDPOINT, '/');
        
        return sprintf('%s/%s/%s,%s'
                , rtrim(self::API_ENDPOINT, '/')
                , self::API_KEY
                , $lat
                , $lon);
    }
    
    public function index()
    {
        $lat = $this->input->get('lat');
        $lon = $this->input->get('lon');
        
        $output = simple_get($this->_build_url($lat, $lon));

        $this->output->set_content_type('application/json');
        $this->output->set_output($output);
    }
}