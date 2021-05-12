
<?php

    set_time_limit(10000);

    $tabella=$_REQUEST["tabella"];
	$sql_server_ip=$_REQUEST["sql_server_ip"];
	$sql_server_password=$_REQUEST["sql_server_password"];
	$sql_server_username=$_REQUEST["sql_server_username"];
	$database="mi_db_tecnico";
    include "connessioneDbServer.php";

    $start = microtime(true);

    $result["tabella"]=$tabella;

    $dbs=["Spareti","newpan","Grimaldi","po00","Beb"];

    foreach ($dbs as $db)
    {
        switch ($tabella) 
        {
            case "cesoiati" :/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[cesoiati] ([codice_cesoiato],[descrizione],[finitura],[lung],[halt],[spess],[mmq],[um],[id_materia_prima]) SELECT cesoiati_db.CODCES, cesoiati_db.DESCRIZIONE, cesoiati_db.FINITURA, cesoiati_db.LUNG, cesoiati_db.HALT, cesoiati_db.SPESS, cesoiati_db.MQ, cesoiati_db.UM,  dbo.materie_prime.id_materia_prima FROM (SELECT CODCES, DESCRIZIONE, FINITURA, LUNG, HALT, SPESS, MQ, UM, { fn CONCAT('materiale finitura ', FINITURA) } AS codice_materia_prima FROM $db.dbo.cesoiati AS cesoiati_1) AS cesoiati_db INNER JOIN dbo.materie_prime ON cesoiati_db.codice_materia_prima = dbo.materie_prime.codice_materia_prima WHERE (cesoiati_db.CODCES NOT IN (SELECT codice_cesoiato FROM dbo.cesoiati AS cesoiati_1))";
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
                $q="INSERT INTO [dbo].[lane] ([codice_lana],[descrizione],[lung],[halt],[spess],[mmq],[um],[id_materia_prima]) SELECT $db.dbo.mater.CODLDR, $db.dbo.mater.DESCRIZIONE, $db.dbo.mater.LUNG, $db.dbo.mater.HALT, $db.dbo.mater.SPESS, $db.dbo.mater.MMQ, $db.dbo.mater.UM, dbo.materie_prime.id_materia_prima FROM $db.dbo.mater INNER JOIN dbo.materie_prime ON $db.dbo.mater.CODMAT = dbo.materie_prime.codice_materia_prima WHERE ($db.dbo.mater.CODLDR NOT IN (SELECT codice_lana FROM dbo.lane))";
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
                $q="INSERT INTO [dbo].[rinforzi] ([codice_rinforzo],[descrizione],[qnt],[um],[id_materia_prima]) SELECT $db.dbo.tabrinf.CODRIN, $db.dbo.tabrinf.DESCRIZIONE, $db.dbo.tabrinf.QNT, $db.dbo.tabrinf.UM, dbo.materie_prime.id_materia_prima FROM $db.dbo.tabrinf INNER JOIN dbo.materie_prime ON $db.dbo.tabrinf.CODMAT = dbo.materie_prime.codice_materia_prima WHERE ($db.dbo.tabrinf.CODRIN NOT IN (SELECT codice_rinforzo FROM dbo.rinforzi))";
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
                $q="INSERT INTO [dbo].[traversine_inferiori] ([codice_traversina_inferiore],[descrizione],[lung],[um],[pdx],[psx],[id_materia_prima]) SELECT $db.dbo.travinf.CODTRI, $db.dbo.travinf.DESCRIZIONE, $db.dbo.travinf.LUNG, $db.dbo.travinf.UM, $db.dbo.travinf.PDX, $db.dbo.travinf.PSX,  dbo.materie_prime.id_materia_prima FROM $db.dbo.travinf INNER JOIN dbo.materie_prime ON $db.dbo.travinf.CODMAT = dbo.materie_prime.codice_materia_prima WHERE ($db.dbo.travinf.CODTRI NOT IN (SELECT codice_traversina_inferiore FROM dbo.traversine_inferiori))";
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
                $q="INSERT INTO [dbo].[lane_ceramiche] ([codice_lana_ceramica],[descrizione],[lung],[halt],[spess],[mmq],[um],[id_materia_prima]) SELECT $db.dbo.lanacer.CODLCR, $db.dbo.lanacer.DESCRIZIONE, $db.dbo.lanacer.LUNG, $db.dbo.lanacer.HALT, $db.dbo.lanacer.SPESS, $db.dbo.lanacer.MMQ, $db.dbo.lanacer.UM, dbo.materie_prime.id_materia_prima FROM $db.dbo.lanacer INNER JOIN dbo.materie_prime ON $db.dbo.lanacer.CODMAT = dbo.materie_prime.codice_materia_prima WHERE ($db.dbo.lanacer.CODLCR NOT IN (SELECT codice_lana_ceramica FROM dbo.lane_ceramiche))";
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
                $q="INSERT INTO [dbo].[traversine_superiori] ([codice_traversina_superiore],[descrizione],[lung],[um],[pdx],[psx],[id_materia_prima]) SELECT $db.dbo.travsup.CODTRI, $db.dbo.travsup.DESCRIZIONE, $db.dbo.travsup.LUNG, $db.dbo.travsup.UM, $db.dbo.travsup.PDX, $db.dbo.travsup.PSX,  dbo.materie_prime.id_materia_prima FROM $db.dbo.travsup INNER JOIN dbo.materie_prime ON $db.dbo.travsup.CODMAT = dbo.materie_prime.codice_materia_prima WHERE ($db.dbo.travsup.CODTRI NOT IN (SELECT codice_traversina_superiore FROM dbo.traversine_superiori))";
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
            case "lavorazioni_lana" :/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[lavorazioni_lana] ([codice_lavorazione_lana],[descrizione],[misura_1],[misura_2],[misura_3],[misura_4],[misura_5],[id_lana]) SELECT $db.dbo.DIBldr.CODMAT, 'lavorazione' AS descrizione_lavorazione, $db.dbo.DIBldr.LUNG, $db.dbo.DIBldr.HALT, $db.dbo.DIBldr.SPESS, $db.dbo.DIBldr.MMQ, NULL AS misura_5,  dbo.lane.id_lana FROM $db.dbo.DIBldr INNER JOIN dbo.lane ON $db.dbo.DIBldr.CODLDR = dbo.lane.codice_lana WHERE (CODMAT NOT LIKE '+%') AND (dbo.lane.id_lana NOT IN (SELECT DISTINCT id_lana FROM dbo.lavorazioni_lana))";
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
                $q="INSERT INTO [dbo].[sviluppi] ([codice_sviluppo],[lung],[spess],[halt],[finitura],[fori],[note],[righe],[tipo],[um],[id_cesoiato],[descrizione]) SELECT $db.dbo.sviluppi.CODSVI, $db.dbo.sviluppi.LUNG, $db.dbo.sviluppi.SPESS, $db.dbo.sviluppi.HALT, $db.dbo.sviluppi.FINITURA, $db.dbo.sviluppi.FORI,  $db.dbo.sviluppi.___ AS note, $db.dbo.sviluppi.RIGHE, $db.dbo.sviluppi.TIPO, $db.dbo.sviluppi.UM, dbo.cesoiati.id_cesoiato,  $db.dbo.sviluppi.DESCRIZIONE FROM $db.dbo.sviluppi INNER JOIN $db.dbo.dibsvi ON $db.dbo.sviluppi.CODSVI = $db.dbo.dibsvi.CODSVI INNER JOIN dbo.cesoiati ON $db.dbo.dibsvi.CODELE = dbo.cesoiati.codice_cesoiato WHERE ($db.dbo.sviluppi.CODSVI NOT IN (SELECT codice_sviluppo FROM dbo.sviluppi AS sviluppi_1))";
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
            case "lavorazioni_sviluppi" :/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[lavorazioni_sviluppi] ([codice_lavorazione_sviluppo],[descrizione],[misura_1],[misura_2],[misura_3],[misura_4],[misura_5],[id_sviluppo]) SELECT $db.dbo.dibsvi.CODELE, 'lavorazione' AS descrizione_lavorazione, $db.dbo.dibsvi.DIMX, $db.dbo.dibsvi.DIMY, $db.dbo.dibsvi.QNT, $db.dbo.dibsvi.POSX, $db.dbo.dibsvi.POSY,  dbo.sviluppi.id_sviluppo FROM $db.dbo.dibsvi INNER JOIN dbo.sviluppi ON $db.dbo.dibsvi.CODSVI = dbo.sviluppi.codice_sviluppo WHERE (dbo.sviluppi.id_sviluppo NOT IN (SELECT DISTINCT id_sviluppo FROM dbo.lavorazioni_sviluppi)) AND ($db.dbo.dibsvi.CODELE NOT LIKE '+%')";
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
                $q="INSERT INTO [dbo].[lamiere] ([codice_lamiera],[descrizione],[lung1],[lung2],[spess],[halt],[ang],[finitura],[note],[righe],[tipo],[um],[id_sviluppo],[fori]) SELECT $db.dbo.pannellil.CODPAN, $db.dbo.pannellil.DESCRIZIONE, $db.dbo.pannellil.LUNG1, $db.dbo.pannellil.LUNG2, $db.dbo.pannellil.SPESS, $db.dbo.pannellil.HALT, $db.dbo.pannellil.ANG, $db.dbo.pannellil.FINITURA, $db.dbo.pannellil.___, $db.dbo.pannellil.RIGHE, $db.dbo.pannellil.TIPO, $db.dbo.pannellil.UM,  dbo.sviluppi.id_sviluppo, $db.dbo.pannellil.FORI FROM $db.dbo.pannellil INNER JOIN $db.dbo.DIBpan ON $db.dbo.pannellil.CODPAN = $db.dbo.DIBpan.CODPAN INNER JOIN dbo.sviluppi ON $db.dbo.DIBpan.CODELE = dbo.sviluppi.codice_sviluppo WHERE ($db.dbo.pannellil.CODPAN NOT IN (SELECT codice_lamiera FROM dbo.lamiere))";
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
            case "lavorazioni_lamiere" :/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[lavorazioni_lamiere] ([codice_lavorazione_lamiera],[descrizione],[misura_1],[misura_2],[misura_3],[misura_4],[misura_5] ,[id_lamiera]) SELECT $db.dbo.DIBpan.CODELE, 'lavorazione' AS descrizione_lavorazione, $db.dbo.DIBpan.DIMX, $db.dbo.DIBpan.DIMY, $db.dbo.DIBpan.QNT, $db.dbo.DIBpan.POSX,  $db.dbo.DIBpan.POSY, dbo.lamiere.id_lamiera FROM $db.dbo.DIBpan INNER JOIN dbo.lamiere ON $db.dbo.DIBpan.CODPAN = dbo.lamiere.codice_lamiera WHERE ($db.dbo.DIBpan.CODELE NOT LIKE '+%') AND (dbo.lamiere.id_lamiera NOT IN (SELECT DISTINCT id_lamiera FROM dbo.lavorazioni_lamiere))";
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
                $q="INSERT INTO [dbo].[rinforzi_piede] ([codice_rinforzo_piede],[descrizione],[um],[id_materia_prima],[qnt]) SELECT $db.dbo.rinfpiede.CODRIP, $db.dbo.rinfpiede.DESCRIZIONE, $db.dbo.rinfpiede.UM, dbo.materie_prime.id_materia_prima, $db.dbo.rinfpiede.QNT FROM $db.dbo.rinfpiede INNER JOIN dbo.materie_prime ON $db.dbo.rinfpiede.CODMAT = dbo.materie_prime.codice_materia_prima WHERE ($db.dbo.rinfpiede.CODRIP NOT IN (SELECT codice_rinforzo_piede FROM dbo.rinforzi_piede))";
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
                $q="INSERT INTO [dbo].[pannelli] ([codice_pannello],[descrizione],[resis],[um],[righe],[descrizionetec],[finitura],[halt],[fori],[id_lamiera],[importazione]) SELECT $db.dbo.pannelli.CODPAS, $db.dbo.pannelli.DESCRIZIONE, $db.dbo.pannelli.RESIS, $db.dbo.pannelli.UM, $db.dbo.pannelli.RIGHE, $db.dbo.pannelli.DESCRIZIONETEC,  $db.dbo.pannelli.FINITURA, $db.dbo.pannelli.HALT, $db.dbo.pannelli.FORI, dbo.lamiere.id_lamiera, 'in_corso' FROM $db.dbo.pannelli INNER JOIN dbo.lamiere ON $db.dbo.pannelli.CODLAM = dbo.lamiere.codice_lamiera WHERE ($db.dbo.pannelli.CODPAS NOT IN (SELECT codice_pannello FROM dbo.pannelli AS pannelli_1))";
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
                /*$result["query_".$db]="";
                $result["result_".$db]="ok";
                $result["rows_".$db]=0;*/
            break;
            case "kit" :/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[kit] ([codice_kit],[descrizione],[lung],[halt],[righe],[um],[finitura],[fori],[importazione]) SELECT CODKIT, DESCRIZIONE, LUNG, HALT, RIGHE, UM__, FINITURA, MaxDiFORI ,'in_corso' FROM $db.dbo.kit WHERE (CODKIT NOT IN (SELECT codice_kit FROM dbo.kit AS kit_1))";
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
                $q="INSERT INTO [dbo].[cabine] ([codice_cabina],[descrizione],[um],[importazione]) SELECT CODCAB, DESCRIZIONE, UM, 'in_corso' FROM $db.dbo.cabine WHERE (CODCAB NOT IN (SELECT codice_cabina FROM dbo.cabine AS cabine_1))";
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
                $q="INSERT INTO [dbo].[sottoinsiemi_corridoi] ([codice_sottoinsieme_corridoio],[um],[descrizione],[id_cabina],[importazione]) SELECT $db.dbo.corridoi.CODCOR, $db.dbo.corridoi.UM, $db.dbo.corridoi.DESCRIZIONE, dbo.cabine.id_cabina, 'in_corso' FROM $db.dbo.corridoi INNER JOIN dbo.cabine ON $db.dbo.corridoi.CORRIDOIO = dbo.cabine.codice_cabina WHERE ($db.dbo.corridoi.CODCOR NOT IN (SELECT codice_sottoinsieme_corridoio FROM dbo.sottoinsiemi_corridoi))";
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
                $q="INSERT INTO [dbo].[carrelli] ([codice_carrello],[descrizione],[mq],[peso],[sottoinsieme_corridoio],[um],importazione,n_cab) SELECT $db.dbo.carrelli.CODCAR, $db.dbo.carrelli.DESCRIZIONE, $db.dbo.carrelli.mq, $db.dbo.carrelli.peso, dbo.sottoinsiemi_corridoi.id_sottoinsieme_corridoio,  $db.dbo.carrelli.UM ,'in_corso',$db.dbo.dibcar.NCAB FROM $db.dbo.carrelli INNER JOIN $db.dbo.dibcar ON $db.dbo.carrelli.CODCAR = $db.dbo.dibcar.CODCAR LEFT OUTER JOIN dbo.sottoinsiemi_corridoi ON $db.dbo.dibcar.NCAB = dbo.sottoinsiemi_corridoi.codice_sottoinsieme_corridoio WHERE ($db.dbo.carrelli.CODCAR NOT IN (SELECT codice_carrello FROM dbo.carrelli AS carrelli_1))";
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
            case "materie_prime_pannelli" :/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[materie_prime_pannelli] ([id_pannello],[id_materia_prima],[qnt],[posx],[posy],[dimx],[dimy]) SELECT pannelli.id_pannello, dbo.materie_prime.id_materia_prima, $db.dbo.DIBpaS.QNT, $db.dbo.DIBpaS.POSX, $db.dbo.DIBpaS.POSY, $db.dbo.DIBpaS.DIMX, $db.dbo.DIBpaS.DIMY FROM $db.dbo.DIBpaS INNER JOIN (SELECT id_pannello, codice_pannello, descrizione, resis, um, righe, descrizionetec, finitura, halt, fori, id_lamiera, importazione FROM dbo.pannelli AS pannelli_1 WHERE (importazione = 'in_corso')) AS pannelli ON $db.dbo.DIBpaS.CODPAS = pannelli.codice_pannello INNER JOIN dbo.materie_prime ON $db.dbo.DIBpaS.CODELE = dbo.materie_prime.codice_materia_prima";
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
            case "materie_prime_cabine" :/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[materie_prime_cabine] ([id_cabina],[id_materia_prima],[qnt],[pos]) SELECT cabine.id_cabina, dbo.materie_prime.id_materia_prima, $db.dbo.cabkit.QNT, $db.dbo.cabkit.POS FROM (SELECT id_cabina, codice_cabina, descrizione, um, importazione FROM dbo.cabine AS cabine_1 WHERE (importazione = 'in_corso')) AS cabine INNER JOIN $db.dbo.cabkit ON cabine.codice_cabina = $db.dbo.cabkit.CODCAB INNER JOIN dbo.materie_prime ON $db.dbo.cabkit.CODKIT = dbo.materie_prime.codice_materia_prima";
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
            case "materie_prime_kit" :/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[materie_prime_kit] ([id_kit],[id_materia_prima],[qnt],[posx],[posy],[dimx],[dimy]) SELECT kit.id_kit, dbo.materie_prime.id_materia_prima, $db.dbo.kitpan.QNT, $db.dbo.kitpan.POSX, $db.dbo.kitpan.POSY, $db.dbo.kitpan.DISMX, $db.dbo.kitpan.DIMY FROM $db.dbo.kitpan INNER JOIN (SELECT id_kit, codice_kit, descrizione, lung, halt, righe, um, finitura, fori, importazione FROM dbo.kit AS kit_1 WHERE (importazione = 'in_corso')) AS kit ON $db.dbo.kitpan.CODKIT = kit.codice_kit INNER JOIN dbo.materie_prime ON $db.dbo.kitpan.CODELE = dbo.materie_prime.codice_materia_prima";
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
            case "materie_prime_sottoinsiemi_corridoi" :/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[materie_prime_sottoinsiemi_corridoi] ([id_sottoinsieme_corridoio],[id_materia_prima],[qnt],[pos]) SELECT sottoinsiemi_corridoi.id_sottoinsieme_corridoio, dbo.materie_prime.id_materia_prima, $db.dbo.dibcor.QNT, $db.dbo.dibcor.POS FROM $db.dbo.dibcor INNER JOIN dbo.materie_prime ON $db.dbo.dibcor.CODKIT = dbo.materie_prime.codice_materia_prima INNER JOIN (SELECT id_sottoinsieme_corridoio, codice_sottoinsieme_corridoio, um, descrizione, id_cabina, importazione FROM dbo.sottoinsiemi_corridoi AS sottoinsiemi_corridoi_1 WHERE (importazione = 'in_corso')) AS sottoinsiemi_corridoi ON $db.dbo.dibcor.CODCOR = sottoinsiemi_corridoi.codice_sottoinsieme_corridoio";
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
            case "lane_pannelli" :/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[lane_pannelli] ([id_pannello],[id_lana],[qnt],[posx],[posy]) SELECT pannelli.id_pannello, dbo.lane.id_lana, $db.dbo.DIBpaS.QNT, $db.dbo.DIBpaS.POSX, $db.dbo.DIBpaS.POSY FROM $db.dbo.DIBpaS INNER JOIN dbo.lane ON $db.dbo.DIBpaS.CODELE = dbo.lane.codice_lana INNER JOIN (SELECT id_pannello, codice_pannello, descrizione, resis, um, righe, descrizionetec, finitura, halt, fori, id_lamiera, importazione FROM dbo.pannelli AS pannelli_1 WHERE (importazione = 'in_corso')) AS pannelli ON $db.dbo.DIBpaS.CODPAS = pannelli.codice_pannello";
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
            case "traversine_inferiori_kit" :/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[traversine_inferiori_kit] ([id_kit],[id_traversina_inferiore],[qnt],[posx],[posy]) SELECT kit.id_kit, dbo.traversine_inferiori.id_traversina_inferiore, $db.dbo.kitpan.QNT, $db.dbo.kitpan.POSX, $db.dbo.kitpan.POSY FROM (SELECT id_kit, codice_kit, descrizione, lung, halt, righe, um, finitura, fori, importazione FROM dbo.kit AS kit_1 WHERE (importazione = 'in_corso')) AS kit INNER JOIN $db.dbo.kitpan ON kit.codice_kit = $db.dbo.kitpan.CODKIT INNER JOIN dbo.traversine_inferiori ON $db.dbo.kitpan.CODELE = dbo.traversine_inferiori.codice_traversina_inferiore";
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
            case "traversine_superiori_kit" :/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[traversine_superiori_kit] ([id_kit],[id_traversina_superiore],[qnt],[posx],[posy]) SELECT kit.id_kit, dbo.traversine_superiori.id_traversina_superiore, $db.dbo.kitpan.QNT, $db.dbo.kitpan.POSX, $db.dbo.kitpan.POSY FROM (SELECT id_kit, codice_kit, descrizione, lung, halt, righe, um, finitura, fori, importazione FROM dbo.kit AS kit_1 WHERE (importazione = 'in_corso')) AS kit INNER JOIN $db.dbo.kitpan ON kit.codice_kit = $db.dbo.kitpan.CODKIT INNER JOIN dbo.traversine_superiori ON $db.dbo.kitpan.CODELE = dbo.traversine_superiori.codice_traversina_superiore";
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
            case "rinforzi_piede_pannelli" :/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[rinforzi_piede_pannelli] ([id_pannello],[id_rinforzo_piede],[qnt],[posx],[posy]) SELECT pannelli.id_pannello, dbo.rinforzi_piede.id_rinforzo_piede, $db.dbo.DIBpaS.QNT, $db.dbo.DIBpaS.POSX, $db.dbo.DIBpaS.POSY FROM (SELECT id_pannello, codice_pannello, descrizione, resis, um, righe, descrizionetec, finitura, halt, fori, id_lamiera, importazione FROM dbo.pannelli AS pannelli_1 WHERE (importazione = 'in_corso')) AS pannelli INNER JOIN $db.dbo.DIBpaS ON pannelli.codice_pannello = $db.dbo.DIBpaS.CODPAS INNER JOIN dbo.rinforzi_piede ON $db.dbo.DIBpaS.CODELE = dbo.rinforzi_piede.codice_rinforzo_piede";
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
            case "rinforzi_pannelli" :/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[rinforzi_pannelli] ([id_pannello],[id_rinforzo],[qnt],[posx],[posy]) SELECT pannelli.id_pannello, dbo.rinforzi.id_rinforzo, $db.dbo.DIBpaS.QNT, $db.dbo.DIBpaS.POSX, $db.dbo.DIBpaS.POSY FROM (SELECT id_pannello, codice_pannello, descrizione, resis, um, righe, descrizionetec, finitura, halt, fori, id_lamiera, importazione FROM dbo.pannelli AS pannelli_1 WHERE (importazione = 'in_corso')) AS pannelli INNER JOIN $db.dbo.DIBpaS ON pannelli.codice_pannello = $db.dbo.DIBpaS.CODPAS INNER JOIN dbo.rinforzi ON $db.dbo.DIBpaS.CODELE = dbo.rinforzi.codice_rinforzo";
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
            case "rinforzi_kit" :/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[rinforzi_kit] ([id_kit],[id_rinforzo],[qnt],[posx],[posy]) SELECT kit.id_kit, dbo.rinforzi.id_rinforzo, $db.dbo.kitpan.QNT, $db.dbo.kitpan.POSX, $db.dbo.kitpan.POSY FROM dbo.rinforzi INNER JOIN $db.dbo.kitpan ON dbo.rinforzi.codice_rinforzo = $db.dbo.kitpan.CODELE INNER JOIN (SELECT id_kit, codice_kit, descrizione, lung, halt, righe, um, finitura, fori, importazione FROM dbo.kit AS kit_1 WHERE (importazione = 'in_corso')) AS kit ON $db.dbo.kitpan.CODKIT = kit.codice_kit";
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
            case "lane_ceramiche_kit" :/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[lane_ceramiche_kit] ([id_kit],[id_lana_ceramica],[qnt],[posx],[posy],[dimx],[dimy]) SELECT kit.id_kit, dbo.lane_ceramiche.id_lana_ceramica, $db.dbo.kitpan.QNT, $db.dbo.kitpan.POSX, $db.dbo.kitpan.POSY, $db.dbo.kitpan.DISMX, $db.dbo.kitpan.DIMY FROM (SELECT id_kit, codice_kit, descrizione, lung, halt, righe, um, finitura, fori, importazione FROM dbo.kit AS kit_1 WHERE (importazione = 'in_corso')) AS kit INNER JOIN $db.dbo.kitpan ON kit.codice_kit = $db.dbo.kitpan.CODKIT INNER JOIN dbo.lane_ceramiche ON $db.dbo.kitpan.CODELE = dbo.lane_ceramiche.codice_lana_ceramica";
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
            case "pannelli_cabine" :/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[pannelli_cabine] ([id_cabina],[id_pannello],[qnt],[pos]) SELECT cabine.id_cabina, dbo.pannelli.id_pannello, $db.dbo.cabkit.QNT, $db.dbo.cabkit.POS FROM (SELECT id_cabina, codice_cabina, descrizione, um, importazione FROM dbo.cabine AS cabine_1 WHERE (importazione = 'in_corso')) AS cabine INNER JOIN $db.dbo.cabkit ON cabine.codice_cabina = $db.dbo.cabkit.CODCAB INNER JOIN dbo.pannelli ON $db.dbo.cabkit.CODKIT = dbo.pannelli.codice_pannello";
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
            case "kit_sottoinsiemi_corridoi" :/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[kit_sottoinsiemi_corridoi] ([id_sottoinsieme_corridoio],[id_kit],[qnt],[pos]) SELECT sottoinsiemi_corridoi.id_sottoinsieme_corridoio, dbo.kit.id_kit, $db.dbo.dibcor.QNT, $db.dbo.dibcor.POS FROM dbo.kit INNER JOIN $db.dbo.dibcor ON dbo.kit.codice_kit = $db.dbo.dibcor.CODKIT INNER JOIN (SELECT id_sottoinsieme_corridoio, codice_sottoinsieme_corridoio, um, descrizione, id_cabina, importazione FROM dbo.sottoinsiemi_corridoi AS sottoinsiemi_corridoi_1 WHERE (importazione = 'in_corso')) AS sottoinsiemi_corridoi ON $db.dbo.dibcor.CODCOR = sottoinsiemi_corridoi.codice_sottoinsieme_corridoio";
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
            case "kit_cabine" :/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[kit_cabine] ([id_cabina],[id_kit],[qnt],[pos]) SELECT cabine.id_cabina, dbo.kit.id_kit, $db.dbo.cabkit.QNT, $db.dbo.cabkit.POS FROM $db.dbo.cabkit INNER JOIN (SELECT id_cabina, codice_cabina, descrizione, um, importazione FROM dbo.cabine AS cabine_1 WHERE (importazione = 'in_corso')) AS cabine ON $db.dbo.cabkit.CODCAB = cabine.codice_cabina INNER JOIN dbo.kit ON $db.dbo.cabkit.CODKIT = dbo.kit.codice_kit";
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
            case "cabine_carrelli" :/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[cabine_carrelli] ([id_carrello],[id_cabina],[qnt]) SELECT carrelli.id_carrello, dbo.cabine.id_cabina, $db.dbo.dibcar.QNT FROM $db.dbo.dibcar INNER JOIN (SELECT id_carrello, codice_carrello, descrizione, mq, peso, sottoinsieme_corridoio, um, importazione FROM dbo.carrelli AS carrelli_1 WHERE (importazione = 'in_corso')) AS carrelli ON $db.dbo.dibcar.CODCAR = carrelli.codice_carrello INNER JOIN dbo.cabine ON $db.dbo.dibcar.CODCAB = dbo.cabine.codice_cabina";
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
            case "pannelli_kit" :/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[pannelli_kit] ([id_kit],[id_pannello],[qnt],[posx],[posy]) SELECT kit.id_kit, dbo.pannelli.id_pannello, $db.dbo.kitpan.QNT, $db.dbo.kitpan.POSX, $db.dbo.kitpan.POSY FROM dbo.pannelli INNER JOIN $db.dbo.kitpan ON dbo.pannelli.codice_pannello = $db.dbo.kitpan.CODELE INNER JOIN (SELECT id_kit, codice_kit, descrizione, lung, halt, righe, um, finitura, fori, importazione FROM dbo.kit AS kit_1 WHERE (importazione = 'in_corso')) AS kit ON $db.dbo.kitpan.CODKIT = kit.codice_kit";
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
            case "lane_ceramiche_pannelli" :/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                $q="INSERT INTO [dbo].[lane_ceramiche_pannelli] ([id_pannello],[id_lana_ceramica],[qnt],[posx],[posy],[dimx],[dimy]) SELECT pannelli.id_pannello, dbo.lane_ceramiche.id_lana_ceramica, $db.dbo.DIBpaS.QNT, $db.dbo.DIBpaS.POSX, $db.dbo.DIBpaS.POSY, $db.dbo.DIBpaS.DIMX, $db.dbo.DIBpaS.DIMY FROM $db.dbo.DIBpaS INNER JOIN (SELECT id_pannello, codice_pannello, descrizione, resis, um, righe, descrizionetec, finitura, halt, fori, utente, id_lamiera, importazione FROM dbo.pannelli AS pannelli_1 WHERE (importazione = 'in_corso')) AS pannelli ON $db.dbo.DIBpaS.CODPAS = pannelli.codice_pannello INNER JOIN dbo.lane_ceramiche ON $db.dbo.DIBpaS.CODELE = dbo.lane_ceramiche.codice_lana_ceramica";
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
            case "cavallotti" :/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                if($db=="newpan")
                {
                    $q="INSERT INTO [dbo].[cavallotti] ([id_cabina],[id_materia_prima],[qnt]) SELECT dbo.cabine.id_cabina, dbo.materie_prime.id_materia_prima, newpan.dbo.cavallotti.QNT FROM dbo.cabine INNER JOIN newpan.dbo.cavallotti ON dbo.cabine.codice_cabina = newpan.dbo.cavallotti.CODCAB INNER JOIN dbo.materie_prime ON newpan.dbo.cavallotti.CODELE = dbo.materie_prime.codice_materia_prima WHERE (dbo.cabine.importazione = 'in_corso')";
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
                }
                else
                {
                    $result["result_".$db]="ok";
                    $result["rows_".$db]=false;
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