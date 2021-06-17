<?php

    set_time_limit(240);

    /*$mi_webapp_params_file = fopen("C:\mi_webapp_params.json", "r") or die("error");
	$mi_webapp_params=json_decode(fread($mi_webapp_params_file,filesize("C:\mi_webapp_params.json")), true);
	fclose($mi_webapp_params_file);
    $sql_server_ip=$mi_webapp_params['sql_server_info']['ip'];*/

    $databases=json_decode($_REQUEST["JSONdatabases"]);
    $table=$_REQUEST["tabella"];
	$help_database=$_REQUEST["help_database"];
	$sql_server_username=$_REQUEST["sql_server_username"];
	$sql_server_password=$_REQUEST["sql_server_password"];
	$sql_server_ip=$_REQUEST["sql_server_ip"];
	
	$database=$help_database;
	include "connessioneDbServer.php";

    $rowTerminator='||';

    $start = microtime(true);

    $errorMessages=[];

    $arrayResponse["tabella"]=$table;

    $queries=[];
    $righeFile=0;
    $righeInserite=0;
    $righeNonInserite=0;

    $stmts=[];
	
	exec("inserisci_password.bat");

    foreach($databases as $txt_database)
    {
		$database=$txt_database;
        //Finche Loris non sistema cavalotti con cavallotti
        if($table=="cavallotti")
        {
            if($database=="newpan")
                $fileTabella = "//10.28.25.1/GrpMI/Ut/PARETI/NEWPAN/regdef/cavalotti.txt";
            else
                $fileTabella = "//10.28.25.1/GrpMI/$database/regdef/cavalotti.txt";
            copy($fileTabella,"\\\\$sql_server_ip\\mi_webapp_help\\importaTxt\\cavalotti.txt");
            $readFile = fopen("\\\\$sql_server_ip\\mi_webapp_help\\importaTxt\\cavalotti.txt", "r") or die("error");
        }
        else
        {
            if($database=="newpan")
                $fileTabella = "//10.28.25.1/GrpMI/Ut/PARETI/NEWPAN/regdef/$table.txt";
            else
                $fileTabella = "//10.28.25.1/GrpMI/$database/regdef/$table.txt";
            copy($fileTabella,"\\\\$sql_server_ip\\mi_webapp_help\\importaTxt\\".$table.".txt");
            $readFile = fopen("\\\\$sql_server_ip\\mi_webapp_help\\importaTxt\\".$table.".txt", "r") or die("error");
        }

        $nCol=0;

        //legge il file e trova il numero di colonne
        $i=0;
        while(!feof($readFile))
        {
            $rowString=fgets($readFile);
            if($i>0)
            {
                $rowArray=explode(chr(9),$rowString);
                if(sizeof($rowArray)>$nCol)
                    $nCol=sizeof($rowArray);
                $righeFile++;
            }
            $i++;
        }
        fclose($readFile);

        ///elimina tmp_importazione_txt
        $q1="DROP TABLE [tmp_importazione_txt]";
        array_push($queries,$q1);
        $r1=sqlsrv_query($conn,$q1);
        array_push($stmts,$r1);
        if($r1==FALSE)
        {
            array_push($errorMessages,print_r(sqlsrv_errors(),TRUE));
            die("error1 ".$q1." ".print_r(sqlsrv_errors(),TRUE));
        }

        //crea tmp_importazione_txt
        $q3="CREATE TABLE [tmp_importazione_txt] (";
        for ($j=0; $j < $nCol; $j++)
        {
            $q3.="[tmp_$j] [varchar](max) NULL,";
        }
        $q3=rtrim($q3, ", ");
        $q3.=")";
        array_push($queries,$q3);
        $r3=sqlsrv_query($conn,$q3);
        array_push($stmts,$r3);
        if($r3==FALSE)
        {
            array_push($errorMessages,print_r(sqlsrv_errors(),TRUE));
            die("error2 ".$q3." ".print_r(sqlsrv_errors(),TRUE));
        }

        //bulk insert
        //Finche Loris non sistema cavalotti con cavallotti
        if($table=="cavallotti")
            $q2="BULK INSERT [tmp_importazione_txt] FROM 'C:/mi_webapp_help/importaTxt/cavalotti.txt'";
        else
            $q2="BULK INSERT [tmp_importazione_txt] FROM 'C:/mi_webapp_help/importaTxt/$table.txt'";
        array_push($queries,$q2);
        $r2=sqlsrv_query($conn,$q2);
        //array_push($stmts,$r2);
        if($r2==FALSE)
        {
            array_push($errorMessages,print_r(sqlsrv_errors(),TRUE));
            die("error3 ".$q2." ".print_r(sqlsrv_errors(),TRUE));
        }

        //rimuovi riga intestazione
        $q13="DELETE TOP (1) FROM [tmp_importazione_txt]";
        array_push($queries,$q13);
        $r13=sqlsrv_query($conn,$q13);
        //array_push($stmts,$r13);
        if($r13==FALSE)
        {
            array_push($errorMessages,print_r(sqlsrv_errors(),TRUE));
            die("error6 ".$q13." ".print_r(sqlsrv_errors(),TRUE));
        }

        //crea string insert
        $q5="SET ANSI_WARNINGS  OFF;INSERT INTO [$database].[dbo].[$table] (";
        $columns=[];
        include "connessioneDbServer.php";
        $q4="SELECT COLUMN_NAME,CASE WHEN COLLATION_NAME IS NULL THEN 'number' ELSE 'text' END AS DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'$table'";
        array_push($queries,$q4);
        $r4=sqlsrv_query($conn,$q4);
        //array_push($stmts,$r4);
        if($r4==FALSE)
        {
            array_push($errorMessages,print_r(sqlsrv_errors(),TRUE));
            die("error5 ".$q4." ".print_r(sqlsrv_errors(),TRUE));
        }
        else
        {
            $k=0;
            while($row4=sqlsrv_fetch_array($r4))
            {
                if($k<$nCol)
                {
                    $column["COLUMN_NAME"]=$row4["COLUMN_NAME"];
                    $column["DATA_TYPE"]=$row4["DATA_TYPE"];
                    array_push($columns,$column);
                }
                $k++;
            }
            foreach ($columns as $column)
            {
                $q5.="[".$column['COLUMN_NAME']."],";
            }
            $q5=rtrim($q5, ", ");
            $q5.=") SELECT ";
            $x=0;
            foreach ($columns as $column)
            {
                $apici='"';
                if($column['DATA_TYPE']=="text")
                    $q5.="REPLACE([tmp_$x],'$apici',''),";
                else
                    $q5.="TRY_CONVERT(FLOAT,[tmp_$x]),";
                $x++;
            }
            $q5=rtrim($q5, ", ");
            $q5.=" FROM [tmp_importazione_txt];SET ANSI_WARNINGS  ON;";
        }

        //svuota tabella
        $q12="DELETE FROM [$database].[dbo].[$table]";
        array_push($queries,$q12);
        $r12=sqlsrv_query($conn,$q12);
        //array_push($stmts,$r12);
        if($r12==FALSE)
        {
            array_push($errorMessages,print_r(sqlsrv_errors(),TRUE));
            die("error4 ".$q12." ".print_r(sqlsrv_errors(),TRUE));
        }

        //riempi tabella
		$database=$help_database;
        include "connessioneDbServer.php";
        array_push($queries,$q5);
        $r5=sqlsrv_query($conn,$q5);
        //array_push($stmts,$r5);
        if($r5==FALSE)
        {
            array_push($errorMessages,print_r(sqlsrv_errors(),TRUE));
            die("error6 ".$q5." ".print_r(sqlsrv_errors(),TRUE));
        }

        //conta righe
		$database=$txt_database;
        include "connessioneDbServer.php";
        $q7="SELECT COUNT(*) AS n FROM [$database].[dbo].[$table]";
        array_push($queries,$q7);
        $r7=sqlsrv_query($conn,$q7);
        //array_push($stmts,$r7);
        if($r7==FALSE)
        {
            array_push($errorMessages,print_r(sqlsrv_errors(),TRUE));
            die("error6 ".$q7." ".print_r(sqlsrv_errors(),TRUE));
        }
        else
        {
            while($row7=sqlsrv_fetch_array($r7))
            {
                $righeInserite=$row7["n"];
                $righeNonInserite=$righeFile-$righeInserite;
            }
        }
    }
    
    if(sizeof($errorMessages)>0)
        $arrayResponse["result"]="error";
    else
        $arrayResponse["result"]="ok";
    
    $time_elapsed_secs = microtime(true) - $start;
    $time_elapsed_secs = number_format($time_elapsed_secs,1);

    $arrayResponse["queries"]=$queries;
    $arrayResponse["rows"]=$righeInserite;
    $arrayResponse["righeNonInserite"]=$righeNonInserite;
    $arrayResponse["errorMessages"]=$errorMessages;
    $arrayResponse["time_elapsed_secs"]=$time_elapsed_secs;

    echo json_encode($arrayResponse);

?>