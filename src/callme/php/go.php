<?php
// global backend settings
require('smtp.php');
require('sms.php');
header ('Content-Type: text/html; charset=utf-8');

// array or string, receiver(s)
// you can use $to = 'my@mail.com'; or $to = 'my@mail.com,your@mail.com';
// or $to = array('my@mail.com', 'your@mail.com');
$to = 'nazartokar@gmail.com';

$HTTP_HOST = parse_url('http://'.$_SERVER['HTTP_HOST']);
$HTTP_HOST = str_replace(array ('http://','www.'), '', $HTTP_HOST['host']);

$from = 'noreply@'.$HTTP_HOST;

// set user user's email as sender
$from_user = false;

function say($success = false, $reason = '') {
	$res = ($success) ? 'true' : 'false';
	if ($success) {
		exit ('{"sent": '.$res.', "reason": "'.$reason.'"}');
	} else {
		exit ('{"sent": '.$res.', "reason": "'.$reason.'"}');
	}
}

if (!function_exists('array_column')) {
	function array_column(array $input, $columnKey, $indexKey = null) {
		$array = array();
		foreach ($input as $value) {
			if ( ! isset($value[$columnKey])) {
				trigger_error("Key \"$columnKey\" does not exist in array");
				return false;
			}
			if (is_null($indexKey)) {
				$array[] = $value[$columnKey];
			}
			else {
				if ( ! isset($value[$indexKey])) {
					trigger_error("Key \"$indexKey\" does not exist in array");
					return false;
				}
				if ( ! is_scalar($value[$indexKey])) {
					trigger_error("Key \"$indexKey\" does not contain scalar value");
					return false;
				}
				$array[$value[$indexKey]] = $value[$columnKey];
			}
		}
		return $array;
	}
}

function createMessage($data, $sms, $captions) {
	global $from_user;
	global $from;
	$tmp = '';

	foreach ($data as $item) {
		if ($item['key'] === 'receiver') {
			//...
		} else if ($item['type'] === 'email' && $from_user) {
			$from = $item['value'];
		} else if ($sms) {
			if ($item['sms'] == 'true') {
				if ($captions == 'true') {
					$tmp .= $item['smsKey'].': '.$item['smsValue'].' ';
				}
				else {
					$tmp .= $item['smsValue'].' ';
				}
			}
		} else {
			$tmp .= '<p><b>'.$item['key'].'</b><br>'.$item['value'].'</p>';
		}
	}
	return $tmp;
}

if (!empty($_POST)) {
	$ip = $_SERVER['REMOTE_ADDR'];
	$subject = 'CallMe';
	$data = $_POST['data'];
	$sms = $_POST['sms'];
	$message = createMessage($data, false, false);
	$smsBody = createMessage($data, true, $sms['captions']);
	$message = '<div style="margin:10px 0 0;background:#fffce8;border:1px solid #cecece;padding:0 10px">'.$message.'</div>';
	$message .= '<div style="background:#bfd4ac;border:1px solid #627650;padding:10px;margin:10px 0;">IP: <a href="http://iptool.pro/#'.$ip.'">'.$ip.'</a> / <a href="http://getcallme.com">Callme</a></div>';
	$headers = "Content-type: text/html; charset=utf-8\r\n";
	$headers .= "From: Callme 2.5.5 <".$from.">\r\n";
	$smtp = $_POST['smtp'];

	if ($sms['send']) {
		if ($sms['cut']) {
			$smsBody = substr($smsBody, 0, 160);
		}
		sendSMS( $smsBody );
	}

	if ($to) {

		$data = $_POST['data'];
		$key_receiver = array_search('receiver', array_column($data, 'key'));

		if ($key_receiver) {
			$receiver = $data[$key_receiver];
			$key_receiver = intval($receiver['value']);
			$to_array = is_array($to) ? $to : explode(',', $to);
			$receiver_email = $to_array[$key_receiver];
			$to = $receiver_email ? $receiver_email : $to;
		}

		if (is_array($to)) {
			$to = implode(',', $to);
		}

		if ($smtp == 'true') {
			$sent = smtpmail('', $to, $subject, $message, '');
			say( $sent[0], $sent[1].' smtp' );
		} else {
			$subject = '=?UTF-8?B?'.base64_encode($subject).'?=';
			mail($to, $subject, $message, $headers);
			say( true, 'php' );
		}
	} else {
		say( false, 'No email settings' );
	}

} else {
	say( false, 'No data posted' );
}
?>
