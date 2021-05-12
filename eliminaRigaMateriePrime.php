<?php

    include "Session.php";
    $database="mi_db_tecnico";
    include "connessioneDb.php";

    $id_materia_prima=$_REQUEST["id_materia_prima"];

    $q="DELETE FROM materie_prime WHERE id_materia_prima = $id_materia_prima";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        if( ($errors = sqlsrv_errors() ) != null)  
        {  
            foreach( $errors as $error)  
            {  
                if($error["code"]==547)
                    die("vincolo_di_chiave");
                else
                    die("error".$q);
            }  
        }
    }

?>