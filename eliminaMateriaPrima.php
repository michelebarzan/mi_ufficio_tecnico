<?php

    include "Session.php";
    $database="mi_db_tecnico";
    include "connessioneDb.php";

    $codice_materia_prima=str_replace("'","''",$_REQUEST["codice_materia_prima"]);
    $tabella=$_REQUEST["tabella"];
    $colonna=$_REQUEST["colonna"];

    $stmt = sqlsrv_query( $conn, "SELECT * FROM [$tabella] WHERE [$colonna] = '$codice_materia_prima'");

    if ($stmt)
    {
        $rows = sqlsrv_has_rows( $stmt );
        if ($rows === true)
        {
            $q="DELETE FROM [$tabella] WHERE [$colonna] = '$codice_materia_prima'";
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
        }
        else 
            die("non_trovata");
    }

?>