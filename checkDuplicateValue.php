<?php

    $database=$_REQUEST["database"];

    include "connessioneDb.php";

    $value=$_REQUEST["value"];
    $column=$_REQUEST["column"];
    $table=$_REQUEST["table"];

    $q="SELECT * FROM [$table] WHERE [$column]='$value'";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        $rows = sqlsrv_has_rows( $r );
        echo json_encode($rows);
    }

?>