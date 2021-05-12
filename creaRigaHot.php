<?php

    include "Session.php";
    include "connessione.php";

    $table=$_REQUEST["table"];
    $primaryKey=$_REQUEST["primaryKey"];

    if ( sqlsrv_begin_transaction( $conn ) === false )
    {
        die( print_r( sqlsrv_errors(), true ));
    }

    $stmts=[];

    $q="INSERT INTO $table DEFAULT VALUES";
    $r=sqlsrv_query($conn,$q);
    array_push($stmts,$r);
    if($r!==FALSE)
    {
        $q2="SELECT MAX($primaryKey) AS id FROM $table";
        $r2=sqlsrv_query($conn,$q2);
        array_push($stmts,$r2);
        if($r2!==FALSE)
        {
            while($row2=sqlsrv_fetch_array($r2))
            {
                $id=$row2["id"];
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
        echo $id;
    }
    else
    {
        sqlsrv_rollback( $conn );
        echo "error";
    }

?>