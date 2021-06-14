<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $id=$_REQUEST["id"];
    $colonna=$_REQUEST["colonna"];
    $valore=$_REQUEST["valore"];

    if($colonna=="macro_attivita")
    {
        if($valore=='Nessuna')
        {
            $q="UPDATE dbo.anagrafica_attivita SET [$colonna]=NULL WHERE [id_attivita] = $id";
            $r=sqlsrv_query($conn,$q);
            if($r==FALSE)
            {
                die("error".$q);
            }
        }
        else
        {
            $q2="SELECT * FROM macro_attivita WHERE nome = '$valore'";
            $r2=sqlsrv_query($conn,$q2);
            if($r2==FALSE)
            {
                die("error".$q2);
            }
            else
            {
                $rows = sqlsrv_has_rows( $r2 );
                if ($rows === true)
                {
                    $q="UPDATE dbo.anagrafica_attivita SET [$colonna]=(SELECT id_macro_attivita FROM macro_attivita WHERE nome = '$valore') WHERE [id_attivita] = $id";
                    $r=sqlsrv_query($conn,$q);
                    if($r==FALSE)
                    {
                        die("error".$q);
                    }
                }
                else
                {
                    $q3="INSERT INTO macro_attivita (nome) VALUES ('$valore')";
                    $r3=sqlsrv_query($conn,$q3);
                    if($r3==FALSE)
                    {
                        die("error".$q3);
                    }
                    else
                    {
                        $q="UPDATE dbo.anagrafica_attivita SET [$colonna]=(SELECT id_macro_attivita FROM macro_attivita WHERE nome = '$valore') WHERE [id_attivita] = $id";
                        $r=sqlsrv_query($conn,$q);
                        if($r==FALSE)
                        {
                            die("error".$q);
                        }
                        else
                        {
                            echo "refresh";
                        }
                    }
                }
            }
        }
    }
    else
    {
        $q="UPDATE dbo.anagrafica_attivita SET [$colonna]='$valore' WHERE [id_attivita] = $id";
        $r=sqlsrv_query($conn,$q);
        if($r==FALSE)
        {
            die("error".$q);
        }
    }

?>