<?php

    ini_set('memory_limit', '-1');
    set_time_limit(0);

    $databases=json_decode($_REQUEST["JSONdatabases"]);

    $start = microtime(true);

    $queries=[];

    $result["result"]="ok";

    /*foreach($databases as $database)
    {
        include "connessioneDb.php";

        if($database=="newpan")
            $file_aggiornamenti = fopen("\\\\marineinteriors.it\\groupspaces\\mi\\Ut\\PARETI\\NEWPAN\\regdef\\aggiornamenti.txt", "r") or die("error");
        else
            $file_aggiornamenti = fopen("\\\\marineinteriors.it\\groupspaces\\mi\\".$database."\\regdef\\aggiornamenti.txt", "r") or die("error");

        //$file_aggiornamenti = fopen("C:/mi_db_tecnico/$database/regdef/aggiornamenti.txt", "r") or die("error");
        $rows_aggiornamenti=[];
        while(!feof($file_aggiornamenti))
        {
            $rowString_aggiornamenti=fgets($file_aggiornamenti);
            if($rowString_aggiornamenti!="")
            {
                $row_aggiornamenti=explode(chr(9),$rowString_aggiornamenti);
                $tabella=$row_aggiornamenti[0];
                $valore=$row_aggiornamenti[1];
                
                switch ($tabella) 
                {
                    case "cabine":
                        if(strlen($valore)>10)
                            $valore=substr($valore, 0, 10);

                        $q100="DELETE FROM $database.dbo.cabine WHERE CODCAB = '$valore'";
                        $r100=sqlsrv_query($conn,$q100);
                        if($r100==FALSE)
                        {
                            $result["result"]="error";
                        }
                        else
                        {
                            $q101="DELETE FROM $database.dbo.cabkit WHERE CODCAB = '$valore'";
                            $r101=sqlsrv_query($conn,$q101);
                            if($r101==FALSE)
                            {
                                $result["result"]="error";
                            }
                            else
                            {
                                array_push($queries,$q100);
                                array_push($queries,$q101);
                            }
                        }
                    break;
                    case "corridoi":
                        if(strlen($valore)>11)
                            $valore=substr($valore, 0, 11);

                        $q100="DELETE FROM $database.dbo.corridoi WHERE CODCOR = '$valore'";
                        $r100=sqlsrv_query($conn,$q100);
                        if($r100==FALSE)
                        {
                            $result["result"]="error";
                        }
                        else
                        {
                            $q101="DELETE FROM $database.dbo.dibcor WHERE CODCOR = '$valore'";
                            $r101=sqlsrv_query($conn,$q101);
                            if($r101==FALSE)
                            {
                                $result["result"]="error";
                            }
                            else
                            {
                                array_push($queries,$q100);
                                array_push($queries,$q101);
                            }
                        }
                    break;
                    case "carrelli":
                        if(strlen($valore)>11)
                            $valore=substr($valore, 0, 11);

                        $q100="DELETE FROM $database.dbo.carrelli WHERE CODCAR = '$valore'";
                        $r100=sqlsrv_query($conn,$q100);
                        if($r100==FALSE)
                        {
                            $result["result"]="error";
                        }
                        else
                        {
                            $q101="DELETE FROM $database.dbo.dibcar WHERE CODCAR = '$valore'";
                            $r101=sqlsrv_query($conn,$q101);
                            if($r101==FALSE)
                            {
                                $result["result"]="error";
                            }
                            else
                            {
                                array_push($queries,$q100);
                                array_push($queries,$q101);
                            }
                        }
                    break;
                }
            }
        }
        fclose($file_aggiornamenti);

        if($database=="newpan")
            $file_aggiornamenti = @fopen("//marineinteriors.it/groupspaces/mi/Ut/PARETI/NEWPAN/regdef/aggiornamenti.txt", "r+") or die("error");
        else
            $file_aggiornamenti = @fopen("//marineinteriors.it/groupspaces/mi/$database/regdef/aggiornamenti.txt", "r+") or die("error");
        
        //$file_aggiornamenti = @fopen("C:/mi_db_tecnico/$database/regdef/aggiornamenti.txt", "r+") or die("error");
        if ($file_aggiornamenti !== false)
        {
            ftruncate($file_aggiornamenti, 0);
            fclose($file_aggiornamenti);
        }
    }*/

    $time_elapsed_secs = microtime(true) - $start;
    $time_elapsed_secs = number_format($time_elapsed_secs,1);

    $result["time_elapsed_secs"]=$time_elapsed_secs;

    //$result["queries"]=$queries;

    echo json_encode($result);

?>