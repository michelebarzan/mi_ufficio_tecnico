<?php

    include "Session.php";
    $database="mi_db_tecnico";
    include "connessioneDb.php";

    if ( sqlsrv_begin_transaction( $conn ) === false )
    {
        die( print_r( sqlsrv_errors(), true ));
    }

    $stmts=[];

    $q="INSERT INTO materie_prime DEFAULT VALUES";
    $r=sqlsrv_query($conn,$q);
    array_push($stmts,$r);
    if($r!==FALSE)
    {
        $q2="SELECT MAX(id_materia_prima) AS id_materia_prima FROM materie_prime";
        $r2=sqlsrv_query($conn,$q2);
        array_push($stmts,$r2);
        if($r2!==FALSE)
        {
            while($row2=sqlsrv_fetch_array($r2))
            {
                $id_materia_prima=$row2["id_materia_prima"];
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
        echo $id_materia_prima;
    }
    else
    {
        sqlsrv_rollback( $conn );
        echo "error";
    }

?>