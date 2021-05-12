<?php

    include "Session.php";
    include "connessione.php";

    $commessa=$_REQUEST["id_commessa"];
    $placeholderRow=$_REQUEST["placeholderRow"];

    $stmt1 = sqlsrv_query( $conn, "SELECT * FROM anagrafica_materiali WHERE nome IS NULL");

    if ($stmt1)
    {
        $rows = sqlsrv_has_rows( $stmt1 );
        if ($rows === false)
        {
            if ( sqlsrv_begin_transaction( $conn ) === false )
            {
                die( print_r( sqlsrv_errors(), true ));
            }

            $stmts=[];

            if($placeholderRow=="true")
                $q="INSERT INTO anagrafica_materiali (commessa,um,nome) VALUES ($commessa,'da_compilare','da_compilare')";
            else
                $q="INSERT INTO anagrafica_materiali (commessa,um) VALUES ($commessa,'da_compilare')";

            $r=sqlsrv_query($conn,$q);
            array_push($stmts,$r);
            if($r!==FALSE)
            {
                $q2="SELECT MAX(id_materiale) AS id_materiale FROM anagrafica_materiali";
                $r2=sqlsrv_query($conn,$q2);
                array_push($stmts,$r2);
                if($r2!==FALSE)
                {
                    while($row2=sqlsrv_fetch_array($r2))
                    {
                        $id_materiale=$row2["id_materiale"];
                    }
                }
            }

            $commit=true;
            foreach ($stmts as $stmt) 
            {
                if(!$stmt)
                    $commit=false;
            }
            if( $commit )
            {
                sqlsrv_commit( $conn );
                echo $id_materiale;
            }
            else
            {
                sqlsrv_rollback( $conn );
                echo "error";
            }
        }
        else
            echo "duplicato";
    }

?>