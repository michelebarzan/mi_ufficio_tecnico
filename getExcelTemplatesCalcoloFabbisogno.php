<?php

    include "Session.php";
    include "connessione.php";

    $templates=[];

    $q="SELECT * FROM template_excel_importazione_fabbisogni";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $template["id_template"]=$row["id_template"];
            $template["nome"]=$row["nome"];
            $template["descrizione"]=$row["descrizione"];
            $template["fileName"]=$row["fileName"];
            
            array_push($templates,$template);
        }
    }

    echo json_encode($templates);

?>