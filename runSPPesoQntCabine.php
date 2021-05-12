<?php

    include "Session.php";
    $database="mi_db_tecnico";
    include "connessioneDb.php";

    set_time_limit(600);

    if ( sqlsrv_begin_transaction( $conn ) === false )
    {
        die( print_r( sqlsrv_errors(), true ));
    }

    $stmts=[];

    $q="DELETE FROM peso_qnt_cabine";
    $r=sqlsrv_query($conn,$q);
    array_push($stmts,$r);
    
    $q2="INSERT INTO [dbo].[peso_qnt_cabine] ([id_cabina],[codice_cabina],[qnt_netta],[qnt_lorda],[um],[peso],[id_materia_prima],[confezione],[pezzo],[origine]) SELECT [id_cabina],[codice_cabina],[qnt_netta],[qnt_lorda],[um],[peso],[id_materia_prima],[confezione],[pezzo],[origine] FROM peso_qnt_cabine_view";
    $r2=sqlsrv_query($conn,$q2);
    array_push($stmts,$r2);

    $q3="INSERT INTO [dbo].[log_crea_peso_qnt_cabine] ([dataOra]) VALUES (getdate())";
    $r3=sqlsrv_query($conn,$q3);
    array_push($stmts,$r3);

    $commit=true;
    foreach ($stmts as $stmt) 
    {
        if(!$stmt)
            $commit=false;
    }
    if( $commit )
    {
        sqlsrv_commit( $conn );
    }
    else
    {
        sqlsrv_rollback( $conn );
        echo "error";
    }

?>