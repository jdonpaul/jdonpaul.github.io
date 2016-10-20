<?php
  if( $_POST["emailTO"] || $_POST["emailFrom"])
  {
    $to = $_POST["email"];
    $from = $_POST["emailFrom"];
    $message = $_POST["body"];
    $headers = $_POST["header"];  
   
    $mailResult = mail ( $to, $subject, $message, $headers );
    if ($mailResult) {
     $toReturn ['results'] .= "\n<br><br><font color='#555555' face='courier' size=2><i> -- email sent to admin for analysis</i></font><p>\n";
    }    
  }
?>