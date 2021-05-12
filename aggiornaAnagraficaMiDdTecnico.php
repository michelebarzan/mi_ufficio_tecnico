
<?php

    ini_set('memory_limit', '-1');
    set_time_limit(3000);

    $sql_server_ip=$_REQUEST["sql_server_ip"];
	$sql_server_password=$_REQUEST["sql_server_password"];
	$sql_server_username=$_REQUEST["sql_server_username"];
	$database="mi_db_tecnico";
    include "connessioneDbServer.php";

    $tabella=$_REQUEST["tabella"];

    $start = microtime(true);

    $result["tabella"]=$tabella;

    $dbs=["Spareti","Grimaldi","po00","Beb","newpan"];

    foreach ($dbs as $db)
    {
        switch ($tabella) 
        {
            case "cesoiati" :/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="UPDATE A SET codice_cesoiato = B.CODCES,descrizione = B.DESCRIZIONE,finitura = B.FINITURA,lung = B.LUNG,halt = B.HALT,spess = B.SPESS,mmq = B.MQ,um = B.UM,id_materia_prima = B.id_materia_prima
                    FROM cesoiati A
                    JOIN (SELECT CODCES, DESCRIZIONE, FINITURA, LUNG, HALT, SPESS, MQ, UM, id_materia_prima
                        FROM (SELECT $db.dbo.cesoiati.CODCES, $db.dbo.cesoiati.DESCRIZIONE, $db.dbo.cesoiati.FINITURA, $db.dbo.cesoiati.LUNG, $db.dbo.cesoiati.HALT, $db.dbo.cesoiati.SPESS, $db.dbo.cesoiati.MQ, 
                        $db.dbo.cesoiati.UM, dbo.materie_prime.id_materia_prima
                        FROM $db.dbo.cesoiati INNER JOIN
                        $db.dbo.DIBces ON $db.dbo.cesoiati.CODCES = $db.dbo.DIBces.CODCES INNER JOIN
                        dbo.materie_prime ON $db.dbo.DIBces.CODMAT = dbo.materie_prime.codice_materia_prima) AS derivedtbl_1) AS B
                    ON A.codice_cesoiato = B.CODCES";
                $r=sqlsrv_query($conn,$q);
                $result["query_".$db]=$q;
                if($r==FALSE)
                {
                    $result["result_".$db]="error";
                    $result["rows_".$db]=0;
                }
                else
                {
                    $result["result_".$db]="ok";
                    $rows = sqlsrv_rows_affected( $r);
                    if( $rows === false)
                        $result["rows_".$db]=false;
                    elseif( $rows == -1)
                        $result["rows_".$db]=false;
                    else
                        $result["rows_".$db]=$rows;
                }
            break;
            case "lane" :/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="UPDATE A
                    SET codice_lana = B.CODLDR
                    ,descrizione = B.DESCRIZIONE
                    ,lung = B.LUNG
                    ,halt = B.HALT
                    ,spess = B.SPESS
                    ,mmq = B.MMQ
                    ,um = B.UM
                    ,id_materia_prima = B.id_materia_prima
                    FROM lane A
                    JOIN (SELECT $db.dbo.mater.CODLDR, $db.dbo.mater.DESCRIZIONE, $db.dbo.mater.LUNG, $db.dbo.mater.HALT, $db.dbo.mater.SPESS, $db.dbo.mater.MMQ, $db.dbo.mater.UM, dbo.materie_prime.id_materia_prima FROM $db.dbo.mater INNER JOIN dbo.materie_prime ON $db.dbo.mater.CODMAT = dbo.materie_prime.codice_materia_prima) AS B
                        ON A.codice_lana = B.CODLDR";
                $r=sqlsrv_query($conn,$q);
                $result["query_".$db]=$q;
                if($r==FALSE)
                {
                    $result["result_".$db]="error";
                    $result["rows_".$db]=0;
                }
                else
                {
                    $result["result_".$db]="ok";
                    $rows = sqlsrv_rows_affected( $r);
                    if( $rows === false)
                        $result["rows_".$db]=false;
                    elseif( $rows == -1)
                        $result["rows_".$db]=false;
                    else
                        $result["rows_".$db]=$rows;
                }
                break;
            case "rinforzi" :/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="UPDATE A SET 
                codice_rinforzo = B.CODRIN,
                descrizione = B.DESCRIZIONE,
                um = B.UM,
                qnt = B.QNT,
                id_materia_prima = B.id_materia_prima
            FROM rinforzi A
                JOIN (SELECT $db.dbo.tabrinf.CODRIN, $db.dbo.tabrinf.DESCRIZIONE, $db.dbo.tabrinf.QNT, $db.dbo.tabrinf.UM, dbo.materie_prime.id_materia_prima FROM $db.dbo.tabrinf INNER JOIN dbo.materie_prime ON $db.dbo.tabrinf.CODMAT = dbo.materie_prime.codice_materia_prima) AS B
                ON A.codice_rinforzo = B.CODRIN";
                $r=sqlsrv_query($conn,$q);
                $result["query_".$db]=$q;
                if($r==FALSE)
                {
                    $result["result_".$db]="error";
                    $result["rows_".$db]=0;
                }
                else
                {
                    $result["result_".$db]="ok";
                    $rows = sqlsrv_rows_affected( $r);
                    if( $rows === false)
                        $result["rows_".$db]=false;
                    elseif( $rows == -1)
                        $result["rows_".$db]=false;
                    else
                        $result["rows_".$db]=$rows;
                }
                break;
            break;
            case "traversine_inferiori" :/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="UPDATE A SET 
                codice_traversina_inferiore = B.CODTRI,
                descrizione = B.DESCRIZIONE,
                lung=B.LUNG,
                um=B.UM,
                pdx=B.PDX,
                psx=B.PSX,
                id_materia_prima = B.id_materia_prima
            FROM traversine_inferiori A
                JOIN (SELECT $db.dbo.travinf.CODTRI, $db.dbo.travinf.DESCRIZIONE, $db.dbo.travinf.LUNG, $db.dbo.travinf.UM, $db.dbo.travinf.PDX, $db.dbo.travinf.PSX,  dbo.materie_prime.id_materia_prima FROM $db.dbo.travinf INNER JOIN dbo.materie_prime ON $db.dbo.travinf.CODMAT = dbo.materie_prime.codice_materia_prima) AS B
                ON A.codice_traversina_inferiore = B.CODTRI";
                $r=sqlsrv_query($conn,$q);
                $result["query_".$db]=$q;
                if($r==FALSE)
                {
                    $result["result_".$db]="error";
                    $result["rows_".$db]=0;
                }
                else
                {
                    $result["result_".$db]="ok";
                    $rows = sqlsrv_rows_affected( $r);
                    if( $rows === false)
                        $result["rows_".$db]=false;
                    elseif( $rows == -1)
                        $result["rows_".$db]=false;
                    else
                        $result["rows_".$db]=$rows;
                }
            break;
            case "lane_ceramiche" :/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="UPDATE A SET 
                            codice_lana_ceramica = B.CODLCR,
                            descrizione = B.DESCRIZIONE,
                            lung=B.LUNG,
                            halt=B.HALT,
                            spess=B.SPESS,
                            mmq=B.MMQ,
                            um=B.UM,
                            id_materia_prima = B.id_materia_prima
                        FROM lane_ceramiche A
                            JOIN (SELECT $db.dbo.lanacer.CODLCR, $db.dbo.lanacer.DESCRIZIONE, $db.dbo.lanacer.LUNG, $db.dbo.lanacer.HALT, $db.dbo.lanacer.SPESS, $db.dbo.lanacer.MMQ, $db.dbo.lanacer.UM, dbo.materie_prime.id_materia_prima FROM $db.dbo.lanacer INNER JOIN dbo.materie_prime ON $db.dbo.lanacer.CODMAT = dbo.materie_prime.codice_materia_prima) AS B
                            ON A.codice_lana_ceramica = B.CODLCR";
                $r=sqlsrv_query($conn,$q);
                $result["query_".$db]=$q;
                if($r==FALSE)
                {
                    $result["result_".$db]="error";
                    $result["rows_".$db]=0;
                }
                else
                {
                    $result["result_".$db]="ok";
                    $rows = sqlsrv_rows_affected( $r);
                    if( $rows === false)
                        $result["rows_".$db]=false;
                    elseif( $rows == -1)
                        $result["rows_".$db]=false;
                    else
                        $result["rows_".$db]=$rows;
                }
            break;
            case "traversine_superiori" :/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="UPDATE A SET 
                            codice_traversina_superiore = B.CODTRI,
                            descrizione = B.DESCRIZIONE,
                            lung=B.LUNG,
                            um=B.UM,
                            pdx=B.PDX,
                            psx=B.PSX,
                            id_materia_prima = B.id_materia_prima
                        FROM traversine_superiori A
                            JOIN (SELECT $db.dbo.travsup.CODTRI, $db.dbo.travsup.DESCRIZIONE, $db.dbo.travsup.LUNG, $db.dbo.travsup.UM, $db.dbo.travsup.PDX, $db.dbo.travsup.PSX,  dbo.materie_prime.id_materia_prima FROM $db.dbo.travsup INNER JOIN dbo.materie_prime ON $db.dbo.travsup.CODMAT = dbo.materie_prime.codice_materia_prima ) AS B
                            ON A.codice_traversina_superiore = B.CODTRI";
                $r=sqlsrv_query($conn,$q);
                $result["query_".$db]=$q;
                if($r==FALSE)
                {
                    $result["result_".$db]="error";
                    $result["rows_".$db]=0;
                }
                else
                {
                    $result["result_".$db]="ok";
                    $rows = sqlsrv_rows_affected( $r);
                    if( $rows === false)
                        $result["rows_".$db]=false;
                    elseif( $rows == -1)
                        $result["rows_".$db]=false;
                    else
                        $result["rows_".$db]=$rows;
                }
            break;
            case "sviluppi" :/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="UPDATE A SET 
                            codice_sviluppo = B.CODSVI,
                            descrizione = B.DESCRIZIONE,
                            lung=B.LUNG,
                            spess=B.SPESS,
                            halt=B.HALT,
                            finitura=B.FINITURA,
                            fori=B.FORI,
                            note=B.note,
                            righe=B.RIGHE,
                            tipo=B.TIPO,
                            um=B.UM,
                            id_cesoiato=B.id_cesoiato
                        FROM sviluppi A
                            JOIN (SELECT $db.dbo.sviluppi.CODSVI, $db.dbo.sviluppi.LUNG, $db.dbo.sviluppi.SPESS, $db.dbo.sviluppi.HALT, $db.dbo.sviluppi.FINITURA, $db.dbo.sviluppi.FORI,  $db.dbo.sviluppi.___ AS note, $db.dbo.sviluppi.RIGHE, $db.dbo.sviluppi.TIPO, $db.dbo.sviluppi.UM, dbo.cesoiati.id_cesoiato,  $db.dbo.sviluppi.DESCRIZIONE FROM $db.dbo.sviluppi INNER JOIN $db.dbo.dibsvi ON $db.dbo.sviluppi.CODSVI = $db.dbo.dibsvi.CODSVI INNER JOIN dbo.cesoiati ON $db.dbo.dibsvi.CODELE = dbo.cesoiati.codice_cesoiato) AS B
                            ON A.codice_sviluppo = B.CODSVI";
                $r=sqlsrv_query($conn,$q);
                $result["query_".$db]=$q;
                if($r==FALSE)
                {
                    $result["result_".$db]="error";
                    $result["rows_".$db]=0;
                }
                else
                {
                    $result["result_".$db]="ok";
                    $rows = sqlsrv_rows_affected( $r);
                    if( $rows === false)
                        $result["rows_".$db]=false;
                    elseif( $rows == -1)
                        $result["rows_".$db]=false;
                    else
                        $result["rows_".$db]=$rows;
                }
            break;
            case "lamiere" :/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="UPDATE A SET 
                            codice_lamiera = B.CODPAN,
                            descrizione = B.DESCRIZIONE,
                            lung1=B.LUNG1,
                            lung2=B.LUNG2,
                            spess=B.SPESS,
                            halt=B.HALT,
                            ang=B.ANG,
                            finitura=B.FINITURA,
                            note=B.[___],
                            righe=B.RIGHE,
                            tipo=B.TIPO,
                            um=B.UM,
                            id_sviluppo=B.id_sviluppo,
                            fori=B.FORI
                        FROM lamiere A
                            JOIN (SELECT $db.dbo.pannellil.CODPAN, $db.dbo.pannellil.DESCRIZIONE, $db.dbo.pannellil.LUNG1, $db.dbo.pannellil.LUNG2, $db.dbo.pannellil.SPESS, $db.dbo.pannellil.HALT, $db.dbo.pannellil.ANG, $db.dbo.pannellil.FINITURA, $db.dbo.pannellil.___, $db.dbo.pannellil.RIGHE, $db.dbo.pannellil.TIPO, $db.dbo.pannellil.UM,  dbo.sviluppi.id_sviluppo, $db.dbo.pannellil.FORI FROM $db.dbo.pannellil INNER JOIN $db.dbo.DIBpan ON $db.dbo.pannellil.CODPAN = $db.dbo.DIBpan.CODPAN INNER JOIN dbo.sviluppi ON $db.dbo.DIBpan.CODELE = dbo.sviluppi.codice_sviluppo) AS B
                            ON A.codice_lamiera = B.CODPAN";
                $r=sqlsrv_query($conn,$q);
                $result["query_".$db]=$q;
                if($r==FALSE)
                {
                    $result["result_".$db]="error";
                    $result["rows_".$db]=0;
                }
                else
                {
                    $result["result_".$db]="ok";
                    $rows = sqlsrv_rows_affected( $r);
                    if( $rows === false)
                        $result["rows_".$db]=false;
                    elseif( $rows == -1)
                        $result["rows_".$db]=false;
                    else
                        $result["rows_".$db]=$rows;
                }
            break;
            case "rinforzi_piede" :/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="UPDATE A SET 
                codice_rinforzo_piede = B.CODRIP,
                descrizione = B.DESCRIZIONE,
                um=B.UM,
                qnt=B.QNT,
                id_materia_prima=B.id_materia_prima
            FROM rinforzi_piede A
                JOIN (SELECT $db.dbo.rinfpiede.CODRIP, $db.dbo.rinfpiede.DESCRIZIONE, $db.dbo.rinfpiede.UM, dbo.materie_prime.id_materia_prima, $db.dbo.rinfpiede.QNT FROM $db.dbo.rinfpiede INNER JOIN dbo.materie_prime ON $db.dbo.rinfpiede.CODMAT = dbo.materie_prime.codice_materia_prima) AS B
                ON A.codice_rinforzo_piede = B.CODRIP";
                $r=sqlsrv_query($conn,$q);
                $result["query_".$db]=$q;
                if($r==FALSE)
                {
                    $result["result_".$db]="error";
                    $result["rows_".$db]=0;
                }
                else
                {
                    $result["result_".$db]="ok";
                    $rows = sqlsrv_rows_affected( $r);
                    if( $rows === false)
                        $result["rows_".$db]=false;
                    elseif( $rows == -1)
                        $result["rows_".$db]=false;
                    else
                        $result["rows_".$db]=$rows;
                }
            break;
            case "pannelli" :/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="UPDATE A SET 
                codice_pannello = B.CODPAS,
                descrizione = B.DESCRIZIONE,
                resis=B.RESIS,
                um=B.UM,
                righe=B.RIGHE,
                descrizionetec=B.DESCRIZIONETEC,
                finitura=B.FINITURA,
                halt=B.HALT,
                fori=B.FORI,
                id_lamiera=B.id_lamiera
            FROM pannelli A
                JOIN (SELECT $db.dbo.pannelli.CODPAS, $db.dbo.pannelli.DESCRIZIONE, $db.dbo.pannelli.RESIS, $db.dbo.pannelli.UM, $db.dbo.pannelli.RIGHE, $db.dbo.pannelli.DESCRIZIONETEC,  $db.dbo.pannelli.FINITURA, $db.dbo.pannelli.HALT, $db.dbo.pannelli.FORI, dbo.lamiere.id_lamiera FROM $db.dbo.pannelli INNER JOIN dbo.lamiere ON $db.dbo.pannelli.CODLAM = dbo.lamiere.codice_lamiera) AS B
                ON A.codice_pannello = B.CODPAS";
                $r=sqlsrv_query($conn,$q);
                $result["query_".$db]=$q;
                if($r==FALSE)
                {
                    $result["result_".$db]="error";
                    $result["rows_".$db]=false;
                }
                else
                {
                    $result["result_".$db]="ok";
                    $rows = sqlsrv_rows_affected( $r);
                    if( $rows === false)
                        $result["rows_".$db]=false;
                    elseif( $rows == -1)
                        $result["rows_".$db]=false;
                    else
                        $result["rows_".$db]=$rows;
                }
            break;
            case "kit" :/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="UPDATE A SET 
                codice_kit = B.CODKIT,
                descrizione = B.DESCRIZIONE,
                lung=B.LUNG,
                halt=B.HALT,
                righe=B.RIGHE,
                um=B.[UM__],
                finitura=B.FINITURA,
                fori=B.MaxDiFORI
            FROM kit A
                JOIN (SELECT CODKIT, DESCRIZIONE, LUNG, HALT, RIGHE, UM__, FINITURA, MaxDiFORI FROM $db.dbo.kit ) AS B
                ON A.codice_kit = B.CODKIT";
                $r=sqlsrv_query($conn,$q);
                $result["query_".$db]=$q;
                if($r==FALSE)
                {
                    $result["result_".$db]="error";
                    $result["rows_".$db]=false;
                }
                else
                {
                    $result["result_".$db]="ok";
                    $rows = sqlsrv_rows_affected( $r);
                    if( $rows === false)
                        $result["rows_".$db]=false;
                    elseif( $rows == -1)
                        $result["rows_".$db]=false;
                    else
                        $result["rows_".$db]=$rows;
                }
            break;
            case "cabine" :/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="UPDATE A SET 
                codice_cabina = B.CODCAB,
                descrizione = B.DESCRIZIONE,
                um=B.UM
            FROM cabine A
                JOIN (SELECT CODCAB, DESCRIZIONE, UM FROM $db.dbo.cabine) AS B
                ON A.codice_cabina = B.CODCAB";
                $r=sqlsrv_query($conn,$q);
                $result["query_".$db]=$q;
                if($r==FALSE)
                {
                    $result["result_".$db]="error";
                    $result["rows_".$db]=false;
                }
                else
                {
                    $result["result_".$db]="ok";
                    $rows = sqlsrv_rows_affected( $r);
                    if( $rows === false)
                        $result["rows_".$db]=false;
                    elseif( $rows == -1)
                        $result["rows_".$db]=false;
                    else
                        $result["rows_".$db]=$rows;
                }
            break;
            case "sottoinsiemi_corridoi" :/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="UPDATE A SET 
                codice_sottoinsieme_corridoio = B.CODCOR,
                descrizione = B.DESCRIZIONE,
                um=B.UM,
                id_cabina=B.id_cabina
            FROM sottoinsiemi_corridoi A
                JOIN ( SELECT $db.dbo.corridoi.CODCOR, $db.dbo.corridoi.UM, $db.dbo.corridoi.DESCRIZIONE, dbo.cabine.id_cabina FROM $db.dbo.corridoi INNER JOIN dbo.cabine ON $db.dbo.corridoi.CORRIDOIO = dbo.cabine.codice_cabina) AS B
                ON A.codice_sottoinsieme_corridoio = B.CODCOR";
                $r=sqlsrv_query($conn,$q);
                $result["query_".$db]=$q;
                if($r==FALSE)
                {
                    $result["result_".$db]="error";
                    $result["rows_".$db]=false;
                }
                else
                {
                    $result["result_".$db]="ok";
                    $rows = sqlsrv_rows_affected( $r);
                    if( $rows === false)
                        $result["rows_".$db]=false;
                    elseif( $rows == -1)
                        $result["rows_".$db]=false;
                    else
                        $result["rows_".$db]=$rows;
                }
            break;
            case "carrelli" :/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="UPDATE A SET 
                codice_carrello = B.CODCAR,
                descrizione = B.DESCRIZIONE,
                mq=B.mq,
                peso=B.peso,
                sottoinsieme_corridoio=B.id_sottoinsieme_corridoio,
                um=B.UM
            FROM carrelli A
                JOIN (SELECT Spareti.dbo.carrelli.CODCAR, Spareti.dbo.carrelli.DESCRIZIONE, Spareti.dbo.carrelli.mq, Spareti.dbo.carrelli.peso, dbo.sottoinsiemi_corridoi.id_sottoinsieme_corridoio,  Spareti.dbo.carrelli.UM FROM Spareti.dbo.carrelli INNER JOIN Spareti.dbo.dibcar ON Spareti.dbo.carrelli.CODCAR = Spareti.dbo.dibcar.CODCAR INNER JOIN dbo.sottoinsiemi_corridoi ON Spareti.dbo.dibcar.NCAB = dbo.sottoinsiemi_corridoi.codice_sottoinsieme_corridoio) AS B
                ON A.codice_carrello = B.CODCAR";
                $r=sqlsrv_query($conn,$q);
                $result["query_".$db]=$q;
                if($r==FALSE)
                {
                    $result["result_".$db]="error";
                    $result["rows_".$db]=0;
                }
                else
                {
                    $result["result_".$db]="ok";
                    $rows = sqlsrv_rows_affected( $r);
                    if( $rows === false)
                        $result["rows_".$db]=false;
                    elseif( $rows == -1)
                        $result["rows_".$db]=false;
                    else
                        $result["rows_".$db]=$rows;
                }
            break;
        }
    }

    $result["result"]="ok";
    $result["rows"]=0;
    foreach ($dbs as $db)
    {
        if($result["result_".$db]=="error")
            $result["result"]="error";
        $result["rows"]+=$result["rows_".$db];
    }

    $time_elapsed_secs = microtime(true) - $start;
    $time_elapsed_secs = number_format($time_elapsed_secs,1);

    $result["time_elapsed_secs"]=$time_elapsed_secs;
    echo json_encode($result);

?>