<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$errors = [];
$errorMessage = ' ';
$successMessage = ' ';
echo 'sending ...';
if (!empty($_POST))
{
  $name = $_POST['name'];
  $message = $_POST['message'];
  $subject = $_POST['subject'];

  if (empty($name)) {
      $errors[] = 'Name is empty';
  }

  if (empty($message)) {
      $errors[] = 'Message is empty';
  }

  if (!empty($errors)) {
      $allErrors = join ('<br/>', $errors);
      $errorMessage = "<p style='color: red; '>{$allErrors}</p>";
  } else {
      $fromEmail = 'no-reply@savethemeows.store';
      $emailSubject = 'New email from your contact form';

      // Create a new PHPMailer instance
      $mail = new PHPMailer(true);
      try {
            // Configure the PHPMailer instance
            $mail->isSMTP();
            $mail->Host = 'live.smtp.mailtrap.io';
            $mail->SMTPAuth = true;
            $mail->Username = 'api';
            $mail->Password = 'd7273794bad4bcbc221b618cc77af104';
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;
           
            // Set the sender, recipient, subject, and body of the message 
            $mail->setFrom($fromEmail, $name); // Use safe from address
            $mail->addAddress('jerry2dev@gmail.com');
            $mail->Subject = $subject;
            $mail->isHTML( true);
            $mail->Body = "<p>Name: {$name}</p><p>Message: {$message}</p>";

            $recipients = array(
                'sportmaxq3@gmail.com' => 'Person One',
                'hoslappa@icloud.com' => 'Person Two',
                'kinanahamwi@yahoo.com' => 'Person Three',
                'quinleyslaw@yahoo.com' => 'Person Four',
                // ..
             );
             foreach($recipients as $email => $name)
             {
                $mail->AddCC($email, $name);
             }
         
            // Send the message
            if (!$mail->send()) {
                echo "<p style='color: red;'>Mailer Error: " . $mail->ErrorInfo . "</p>";
            } else {
                echo "<p style='color: green;'>Thank you for contacting us :)</p>";
            }
            
            
      } catch (Exception $e) {
        echo "<p style='color: red;'>Mailer Error: " . $mail->ErrorInfo . "</p>";

      }
  }
}
?>