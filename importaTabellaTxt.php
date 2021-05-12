<?php

    ini_set('memory_limit', '-1');
    set_time_limit(0);

    $databases=json_decode($_REQUEST["JSONdatabases"]);
    $table=$_REQUEST["tabella"];

    $start = microtime(true);

    $errorMessages=[];

    $arrayResponse["tabella"]=$table;

    $queries=[];
    $righeInserite=0;
    $righeNonInserite=0;

    if(sizeof($databases)==1 && $databases[0]=="newpan" && $table=="cavallotti")
    {
        $database="newpan";

        $file = fopen("//10.28.25.1/GrpMI/Ut/PARETI/NEWPAN/regdef/cavalotti.txt", "r") or die("error");
        //$file = fopen("C:/mi_db_tecnico/$database/regdef/Cavalotti.txt", "r") or die("error");

        include "connessioneDb.php";

        $q2="DELETE FROM cavallotti";
        $r2=sqlsrv_query($conn,$q2);
        if($r2==FALSE)
        {
            die("error");
        }
        else
        {
            while(!feof($file))
            {
                $rowString=utf8_encode(fgets($file));
                $rowString=substr($rowString,0,strlen($rowString)-2);
                $rowString=str_replace('"',"'",$rowString);
                $rowString=str_replace("'	","',",$rowString);

                $q2="INSERT INTO cavallotti (CODCAB,CODELE,QNT) VALUES ($rowString)";
                $r2=sqlsrv_query($conn,$q2);
                if($r2==FALSE)
                {
                    array_push($errorMessages,"<b>Tabella: </b>$database.$table<br><b>Query: </b>".$q2."<br>");
                    $righeNonInserite++;
                }
                else
                {
                    $righeInserite++;
                }
            }
            fclose($file);
        }
    }
    else
    {
        foreach($databases as $database)
        {
            include "connessioneDb.php";

            $columns=[];
            $data_types=[];
            $q7="SELECT COLUMN_NAME,DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'$table' AND COLUMN_NAME != 'UTENTE' AND COLUMN_NAME != 'tmp' AND COLUMN_NAME != 'id'";
            $r7=sqlsrv_query($conn,$q7);
            if($r7==FALSE)
            {
                die("error1000: ".$q7."--".print_r(sqlsrv_errors(),TRUE));
            }
            else
            {
                while($row7=sqlsrv_fetch_array($r7))
                {
                    array_push($columns,$row7["COLUMN_NAME"]);
                    array_push($data_types,$row7["DATA_TYPE"]);
                }
            }
            $columns_string="[".implode("],[",$columns)."]";

            $fileName=$table.".txt";

            $rows=[];

            $rowN=0;               

            $codiciDaInserire=[];

            $columns0array=[];
            $columns0file=[];

            $column0=$columns[0];
            $q8="SELECT DISTINCT [$column0] FROM $table";//echo $q8;
            $r8=sqlsrv_query($conn,$q8);
            if($r8==FALSE)
            {
                die("error1: ".$q8);
            }
            else
            {
                while($row8=sqlsrv_fetch_array($r8))
                {
                    $cod=utf8_encode($row8[$columns[0]]);
                    
                    $queries[$cod]=[];
                    array_push($columns0array,$cod);
                }
            }
            
            if($database=="newpan")
                $file = fopen("//10.28.25.1/GrpMI/Ut/PARETI/NEWPAN/regdef/$fileName", "r") or die("error");
            else
                $file = fopen("//10.28.25.1/GrpMI/$database/regdef/$fileName", "r") or die("error");
            
            //$file = fopen("C:/mi_db_tecnico/$database/regdef/$fileName", "r") or die("error");
            while(!feof($file))
            {
                $rowString=utf8_encode(fgets($file));
                $rowString=substr($rowString,0,strlen($rowString)-2);
                $rigaCheck=strtolower($rowString);
                $colonnaCheck=strtolower($columns[0]);
                //controllo che la riga non sia l'intestazione
                if (strpos($rigaCheck, $colonnaCheck) === false) 
                {
                    $rowString=str_replace(chr(34),"'",$rowString);
                    $rowArray=explode(chr(9),$rowString);
                    //controllo di non aver piu colonne nella tabella che nella rigab del txt
                    if(sizeof($columns)>sizeof($rowArray))
                    {
                        $columnsL=sizeof($columns);
                        $rowArrayL=sizeof($rowArray);

						$diff=$columnsL-$rowArrayL;
						for ($x=0; $x < $diff; $x++) 
						{ 
							array_push($rowArray,"NULL");
						}
                    }
                    //controllo di non aver piu colonne nella riga del txt che nella tabella 
                    if(sizeof($rowArray)>sizeof($columns))
                    {
						if($table=="mater")
						{
							$col7=$rowArray[7];
							$col8=$rowArray[8];
							
							$rowArray[7]=$col8;
							$rowArray[8]=$col7;
							
							$columns[7]="UM";
							array_push($columns,"UTENTE");
							
							$columns_string="[".implode("],[",$columns)."]";
						}
						else
						{
							$columnsL=sizeof($columns);
							$rowArrayL=sizeof($rowArray);

							$diff=$rowArrayL-$columnsL;
							array_splice($rowArray, count($rowArray) - $diff, $diff);
						}
                    }
                    //se il numero di colonnne e uguale
                    if(sizeof($rowArray)===sizeof($columns))
                    {	
                        //controllo i valori dell' array, se sono nulli o altri caratteri li sistemo
                        for ($y=0; $y < sizeof($rowArray); $y++)
                        {
                            $item=$rowArray[$y];
                            if($item=="" || $item==" " || $item==null || strlen($item)==0 || ord($item)==13)
                            {
                                if(($data_types[$y]=="decimal" || $data_types[$y]=="int" || $data_types[$y]=="real" || $data_types[$y]=="smallint"))
                                    $rowArray[$y]=0;
                                else
                                    $rowArray[$y]="''";
                            }
                        }

                        $valoreColonna0=str_replace("'","",$rowArray[0]);
                        array_push($columns0file,$valoreColonna0);
                        
                        //$queries è un array di array contenenti query, è un array associativo con indice il valore della prima colonna
                        if(!isset($queries[$valoreColonna0]) || $queries[$valoreColonna0]==null)
                            $queries[$valoreColonna0]=[];
                        array_push($queries[$valoreColonna0],"INSERT INTO [$table] ($columns_string) VALUES (".implode(',',$rowArray).")");
                    }
                }
                $rowN++;
            }
            fclose($file);

            $codiciDaInserire=array_diff($columns0file,$columns0array);
            $codiciDaInserire=array_unique($codiciDaInserire);
            
            foreach($codiciDaInserire as $codice)
            {
                if($table=="cabkit" || $table=="dibcor" || $table=="dibcar")
                    $queries_list=$queries[$codice];
                else
                    $queries_list=array_unique($queries[$codice]);
                foreach($queries_list as $q2)
                {
                    $r2=sqlsrv_query($conn,$q2);
                    if($r2==FALSE)
                    {
                        array_push($errorMessages,"<b>Tabella: </b>$database.$table<br><b>Query: </b>".$q2."<br>");
                        $righeNonInserite++;
                    }
                    else
                    {
                        $righeInserite++;
                    }
                }
            }
        }
    }

    $time_elapsed_secs = microtime(true) - $start;
    $time_elapsed_secs = number_format($time_elapsed_secs,1);

    $arrayResponse["queries"]=$queries;
    $arrayResponse["result"]="ok";
    $arrayResponse["rows"]=$righeInserite;
    $arrayResponse["righeNonInserite"]=$righeNonInserite;
    $arrayResponse["errorMessages"]=$errorMessages;
    $arrayResponse["time_elapsed_secs"]=$time_elapsed_secs;

    echo json_encode($arrayResponse);

?>