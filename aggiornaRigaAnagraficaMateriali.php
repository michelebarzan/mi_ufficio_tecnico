<?php

    include "Session.php";
    include "connessione.php";

    $id_materiale=$_REQUEST["id_materiale"];
    $colonna=$_REQUEST["colonna"];
    $valore=$_REQUEST["valore"];

    switch ($colonna)
    {
        case 'famiglia':
            if($valore=="Nessuno")
            {
                $q="UPDATE anagrafica_materiali SET [raggruppamento]=NULL WHERE id_materiale = $id_materiale";
                $r=sqlsrv_query($conn,$q);
                if($r==FALSE)
                {
                    die("error".$q);
                }
            }
            else
            {
                $stmt = sqlsrv_query( $conn, "SELECT * FROM raggruppamenti_materiali WHERE nome='$valore'");

                if ($stmt)
                {
                    $rows = sqlsrv_has_rows( $stmt );
                    if ($rows === true)
                    {
                        $q="UPDATE anagrafica_materiali SET [raggruppamento]=(SELECT MAX(id_raggruppamento) FROM raggruppamenti_materiali WHERE nome='$valore') WHERE id_materiale = $id_materiale";
                        $r=sqlsrv_query($conn,$q);
                        if($r==FALSE)
                        {
                            die("error".$q);
                        }
                    }
                    else
                    {
                        $q2="INSERT INTO [dbo].[raggruppamenti_materiali] ([nome],[um]) VALUES ('$valore','da_compilare')";
                        $r2=sqlsrv_query($conn,$q2);
                        if($r2==FALSE)
                        {
                            die("error".$q2);
                        }
                        else
                        {
                            $q="UPDATE anagrafica_materiali SET [raggruppamento]=(SELECT MAX(id_raggruppamento) FROM raggruppamenti_materiali WHERE nome='$valore') WHERE id_materiale = $id_materiale";
                            $r=sqlsrv_query($conn,$q);
                            if($r==FALSE)
                            {
                                die("error".$q);
                            }
                        }
                    }
                }
                else
                    die("error");
            }
        break;
        case 'materia_prima':
            if($valore=="Nessuna")
            {
                $q="UPDATE anagrafica_materiali SET [$colonna]=NULL WHERE id_materiale = $id_materiale";
                $r=sqlsrv_query($conn,$q);
                if($r==FALSE)
                {
                    die("error".$q);
                }
            }
            else
            {
                $stmt = sqlsrv_query( $conn, "SELECT * FROM mi_db_tecnico.dbo.materie_prime WHERE codice_materia_prima='$valore'");

                if ($stmt)
                {
                    $rows = sqlsrv_has_rows( $stmt );
                    if ($rows === true)
                    {
                        $q="UPDATE anagrafica_materiali SET [$colonna]=(SELECT MAX(id_materia_prima) FROM mi_db_tecnico.dbo.materie_prime WHERE codice_materia_prima='$valore') WHERE id_materiale = $id_materiale";
                        $r=sqlsrv_query($conn,$q);
                        if($r==FALSE)
                        {
                            die("error".$q);
                        }
                    }
                }
                else
                    die("error");
            }
            
        break;
        case 'nome':
            $stmt = sqlsrv_query( $conn, "SELECT * FROM anagrafica_materiali WHERE nome='$valore' AND commessa=(SELECT commessa FROM anagrafica_materiali WHERE id_materiale=$id_materiale)");

            if ($stmt)
            {
                $rows = sqlsrv_has_rows( $stmt );
                if ($rows === true)
                {
                    die("duplicato");
                }
                else
                {
                    $q="UPDATE anagrafica_materiali SET [$colonna]='$valore' WHERE id_materiale = $id_materiale";
                    $r=sqlsrv_query($conn,$q);
                    if($r==FALSE)
                    {
                        die("error".$q);
                    }
                }
            }
            else
                die("error");
        break;
        default:
            $q="UPDATE anagrafica_materiali SET [$colonna]='$valore' WHERE id_materiale = $id_materiale";
            $r=sqlsrv_query($conn,$q);
            if($r==FALSE)
            {
                die("error".$q);
            }
        break;
    }

?>