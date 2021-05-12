<?php
	
	include "connessione.php";
    
    $nome=$_REQUEST["nome"];
    $descrizione=$_REQUEST["descrizione"];
    $file=$_FILES["file"];
    
    //define ('SITE_ROOT', realpath(dirname(__FILE__)));
    define ('SITE_ROOT', 'C:/xampp/htdocs/');

    if (move_uploaded_file($file["tmp_name"],'C:\\xampp\\htdocs\\mi_ufficio_tecnico\\files\\calcoloFabbisogno\\templates\\'.basename($file["name"]))) 
    {
        $q="INSERT INTO template_excel_importazione_fabbisogni (nome,descrizione,[fileName]) VALUES ('$nome','$descrizione','".$file['name']."')";
        $r=sqlsrv_query($conn,$q);
        if($r==FALSE)
        {
            die("error".$q);
        }
    } 
    else 
    {
        die("error");
    }

?>