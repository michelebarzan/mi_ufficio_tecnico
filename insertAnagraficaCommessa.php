<?php

    include "Session.php";
    include "connessione.php";

    $nome=str_replace("'","''",$_REQUEST["nome"]);
    $descrizione=str_replace("'","''",$_REQUEST["descrizione"]);
    $tronconi=$_REQUEST["tronconi"];
    $n_tronconi=$_REQUEST["n_tronconi"];

    $q="INSERT INTO [dbo].[anagrafica_commesse] ([nome],[descrizione]) VALUES('$nome','$descrizione')";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        $q2="SELECT MAX(id_commessa) AS id_commessa FROM anagrafica_commesse WHERE nome='$nome'";
        $r2=sqlsrv_query($conn,$q2);
        if($r==FALSE)
        {
            die("error".$q2);
        }
        else
        {
            while($row2=sqlsrv_fetch_array($r2))
            {
                $id_commessa = $row2["id_commessa"];
            }
            if($tronconi=="true")
            {
                for ($i=0; $i < $n_tronconi; $i++)
                {
                    if($i==0)
                        $nome_troncone=$nome;
                    else
                        $nome_troncone=$nome."_troncone_".($i+1);
                    $q3="INSERT INTO [mi_pianificazione].[dbo].[anagrafica_tronconi] ([nome],[commessa]) VALUES('".$nome_troncone."',$id_commessa)";
                    $r3=sqlsrv_query($conn,$q3);
                    if($r3==FALSE)
                    {
                        die("error".$q3);
                    }
                }
            }
            echo $id_commessa;
        }
    }

?>