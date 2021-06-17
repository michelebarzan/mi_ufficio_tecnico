<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $id_commessa=$_REQUEST["id_commessa"];

    $tronconi=[];

    $q="SELECT * FROM anagrafica_tronconi WHERE commessa=$id_commessa";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            array_push($tronconi,$row["id_troncone"]);
        }

        $q2="SELECT * FROM mi_webapp.dbo.anagrafica_commesse WHERE id_commessa=$id_commessa";
        $r2=sqlsrv_query($conn,$q2);
        if($r2==FALSE)
        {
            die("error");
        }
        else
        {
            while($row2=sqlsrv_fetch_array($r2))
            {
                $nome=$row2["nome"];
            }
        }
        if(sizeof($tronconi)>0)
        {
            $nome.="_troncone_".(sizeof($tronconi)+1);
        }
        $q3="INSERT INTO [mi_pianificazione].[dbo].[anagrafica_tronconi] ([nome],[commessa]) VALUES('$nome',$id_commessa)";
        $r3=sqlsrv_query($conn,$q3);
        if($r3==FALSE)
        {
            die("error".$q3);
        }
    }

?>