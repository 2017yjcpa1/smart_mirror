<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Curl 
{
    
    public $_options = array();
    
    public function __construct()
    {
        log_message('debug', "Curl Class Initialized");
    }
    
    public function set_option($key, $value)
    {
        $this->_options[ $key ] = $value;
    }
    
    public function exec($timeout = 3, $return = TRUE)
    {   
        $sess = $this->_sess_init($timeout, $return);
        $exec = curl_exec($sess);
        if ($exec === FALSE)
        {
            // TODO 에러 출력
            curl_errno($sess); // integer
            curl_error($sess); // string
        }
        curl_close($sess);
        $this->_reset_option();
        
        return $exec;
    }
    
    private function _sess_init($timeout = 3, $return = TRUE) 
    { 
        $sess = curl_init();
        foreach ($this->_options as $option => $value)
        {
            curl_setopt($sess, $option, $value);
        }
        // 결과 반환
        if ( ! empty($return))
        {
            if ( ! array_key_exists(CURLOPT_RETURNTRANSFER, $this->_options))
            {
                curl_setopt($sess, CURLOPT_RETURNTRANSFER, TRUE);
            }
        }
        
        // 리다이렉트
        if ( ! array_key_exists(CURLOPT_FOLLOWLOCATION, $this->_options))
        {
            curl_setopt($sess, CURLOPT_FOLLOWLOCATION, TRUE);
        }
        
        //curl_setopt($sess, CURLOPT_PROXY, '127.0.0.1');
        //curl_setopt($sess, CURLOPT_PROXYPORT, 8888);
        
	//curl_setopt($sess, CURLOPT_BUFFERSIZE, 1024 * 4);
	//curl_setopt($sess, CURLOPT_SSL_VERIFYHOST, false);
	//curl_setopt($sess, CURLOPT_SSL_VERIFYPEER, false);
        //curl_setopt($sess, CURLOPT_TIMEOUT, $timeout); 
		
	curl_setopt($sess, CURLOPT_COOKIE, http_build_query($_COOKIE, NULL, '; ')); 
	curl_setopt($sess, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
        return $sess;
    }
	
    protected function _reset_option()
    {
        $this->_options = array();
    }
	
    public function simple_get($url, $params = array(), $timeout = 3, $return = TRUE)
    {	
        $url = parse_url($url);
        $query = array();
        
        if (isset($url['query'])) 
        {
            parse_str($url['query'], $query);
        }
        
        if ( ! empty($params))
        {
            $query = array_merge_recursive($query, $params);
        }
        
        $this->set_option(CURLOPT_URL, sprintf('%s://%s%s?%s', 
                                                    isset($url['scheme']) ? $url['scheme'] : 'http', 
                                                    isset($url['host']) ? $url['host'] : $_SERVER['HTTP_HOST'], 
                                                    isset($url['path']) ? $url['path'] : '', 
                                                    http_build_query($query, NULL, '&')));
        return $this->exec($timeout, $return);
    }
    
    public function simple_post($url, $params = array(), $timeout = 3, $return = TRUE, $method = 'post')
    {
        if ( ! empty($params))
        {
            $params = http_build_query($params, NULL, '&');
        }
        $this->set_option(CURLOPT_URL, $url);
        $this->set_option(CURLOPT_CUSTOMREQUEST, strtoupper($method));
        if (strcasecmp('post', $method) === 0)
        {
            $this->set_option(CURLOPT_POST, TRUE);
            $this->set_option(CURLOPT_POSTFIELDS, $params);
        }
        return $this->exec($timeout, $return);
    }
} 