
<?php

include "connessione.php";

    $username=$_REQUEST["username"];
    $nome=$_REQUEST["nome"];
    $cognome=$_REQUEST["cognome"];
    $usernamePC=$_REQUEST["usernamePC"];
    $mail=$_REQUEST["mail"];

    $query3="SELECT * FROM utenti WHERE username='$username'";	
    $result3=sqlsrv_query($conn,$query3);
    if($result3==TRUE)
    {
        $rows = sqlsrv_has_rows( $result3 );
        if ($rows === true)
        {
            die("Utente $username già esistente");
        }
        else 
        {
            $query2="INSERT INTO [dbo].[utenti]
                    ([nome]
                    ,[cognome]
                    ,[username]
                    ,[password]
                    ,[usernamePC]
                    ,[eliminato]
                    ,[mail])
                    VALUES
                    ('$nome'
                    ,'$cognome'
                    ,'$username'
                    ,'password'
                    ,'$usernamePC'
                    ,'false'
                    ,'$mail')";	
            $result2=sqlsrv_query($conn,$query2);
            if($result2==TRUE)
            {
                echo "ok";
            }
            else
                die("error1");
        }
    }
    else
        die("error1");
?>