<?php

    include "Session.php";
    include "connessione.php";

    $id_commessa=$_REQUEST["id_commessa"];
    $origine=$_REQUEST["origine"];
    $infoCabineCommessa["id_commessa"]=$id_commessa;

    $q="SELECT dbo.anagrafica_commesse.id_commessa, dbo.anagrafica_commesse.nome, dbo.anagrafica_commesse.descrizione, log_importazioni_consistenza_commessa.data, log_importazioni_consistenza_commessa.origine
        FROM dbo.anagrafica_commesse LEFT OUTER JOIN
                                    (SELECT id_importazione, commessa, utente, data, risultato, fileName, origine
                                    FROM dbo.log_importazioni_consistenza_commessa AS log_importazioni_consistenza_commessa_1
                                    WHERE (origine = '$origine')) AS log_importazioni_consistenza_commessa ON dbo.anagrafica_commesse.nome = log_importazioni_consistenza_commessa.commessa
        WHERE (dbo.anagrafica_commesse.id_commessa = $id_commessa)";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $infoCabineCommessa["nome"]=$row["nome"];
            $infoCabineCommessa["descrizione"]=$row["descrizione"];
            $infoCabineCommessa["origine"]=$row["origine"];
            if($row["data"]!=null)
                $infoCabineCommessa["dataImportazione"]=$row["data"]->format('d/m/Y H:i:s');
            else
                $infoCabineCommessa["dataImportazione"]=null;
        }
    }

    echo json_encode($infoCabineCommessa);

?>