
<?php

    include "Session.php";
    include "connessione.php";

    $popupNuovaRichiestaMaterialiUnsavedRows=json_decode($_REQUEST["JSONpopupNuovaRichiestaMaterialiUnsavedRows"]);
    $popupNuovaRichiestaMaterialiUnsavedRows_in=implode(",",$popupNuovaRichiestaMaterialiUnsavedRows);

    $q="DELETE FROM [dbo].[dettagli_richieste_materiali_calcolo_fabbisogno] WHERE id_dettaglio IN ($popupNuovaRichiestaMaterialiUnsavedRows_in)";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    
?>