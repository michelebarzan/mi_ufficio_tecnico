<?php

    include "connessione.php";

    /*$tabelle=['doghe','doghelm','doghelr','dogherf','doghex','pannellis','pesicab','soffitti','tabcolli','travinf','travsup','cabine','cabkit','kit','kitpan','pannelli','DIBpaS','pannellil','DIBpan','sviluppi','dibsvi','cesoiati','DIBces','mater','DIBldr','tabrinf','DIBrin','rinfpiede','DIBrinp','lanacer','DIBlcr','corridoi','dibcor','carrelli','dibcar','DIBlams','DIBldrs','DIBrind','DIBtri','DIBtrs','cab_colli','cabsof','dibdog'];

    $q6="SELECT TABLE_NAME FROM $database.INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'";
        $r6=sqlsrv_query($conn,$q6);
        if($r6==FALSE)
        {
            die("error1: ".$q6);
        }
        else
        {
            while($row6=sqlsrv_fetch_array($r6))
            {
                array_push($tables,$row6["TABLE_NAME"]);
            }
        }

        foreach($tables as $table)
        {
            if (in_array($table, $skipTables))
            {
                //array_push($errorMessages,"TABELLA $table NON TROVATA<br>");
            }
            else
            {
















    $query2="SELECT * FROM mi_db_tecnico.dbo.tabelle ORDER BY ordine";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            array_push($tabelle,$row2['tabella_new']);
        }
    }

    echo json_encode($tabelle);*/

?>