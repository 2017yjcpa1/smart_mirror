<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if ( ! function_exists('simple_get'))
{
    function simple_get($url, $params = array(), $timeout = 3, $return = TRUE)
    {
        $CI =& get_instance();
        $CI->load->library('curl');
        
        return $CI->curl->simple_get($url, $param, $timeout, $return);
    }
}