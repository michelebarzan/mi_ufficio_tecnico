<?php

    include "Session.php";
    include "connessione.php";

    $id_commessa=$_REQUEST["id_commessa"];

    if ( sqlsrv_begin_transaction( $conn ) === false )
    {
        die( print_r( sqlsrv_errors(), true ));
    }

    $stmts=[];

    $q="INSERT INTO consistenza_commesse (commessa) VALUES ($id_commessa)";
    $r=sqlsrv_query($conn,$q);
    array_push($stmts,$r);
    if($r!==FALSE)
    {
        $q2="SELECT MAX(id_consistenza_commessa) AS id_consistenza_commessa FROM consistenza_commesse WHERE commessa=$id_commessa";
        $r2=sqlsrv_query($conn,$q2);
        array_push($stmts,$r2);
        if($r2!==FALSE)
        {
            while($row2=sqlsrv_fetch_array($r2))
            {
                $id_consistenza_commessa=$row2["id_consistenza_commessa"];
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
        echo $id_consistenza_commessa;
    }
    else
    {
        sqlsrv_rollback( $conn );
        echo "error";
    }

?>