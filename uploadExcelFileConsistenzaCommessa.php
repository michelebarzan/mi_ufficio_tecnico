<?php

    include "connessione.php";
    
    $percorsi=[];
    if(isset($_FILES["fileTipCab"]))
    {
        $file=$_FILES["fileTipCab"];

        if (move_uploaded_file($file["tmp_name"],'C:\\xampp\\htdocs\\mi_ufficio_tecnico\\files\\consistenzaCommessa\\'.basename($file["name"]))) 
        {
            $percorso["origine"]="tip_cab";
            $percorso["percorso"]='C:\\xampp\\htdocs\\mi_ufficio_tecnico\\files\\consistenzaCommessa\\'.$file["name"];
            array_push($percorsi,$percorso);
        }
        else 
            die("error5");
    }
    if(isset($_FILES["fileTipCor"]))
    {
        $file=$_FILES["fileTipCor"];

        if (move_uploaded_file($file["tmp_name"],'C:\\xampp\\htdocs\\mi_ufficio_tecnico\\files\\consistenzaCommessa\\'.basename($file["name"]))) 
        {
            $percorso["origine"]="tip_cor";
            $percorso["percorso"]='C:\\xampp\\htdocs\\mi_ufficio_tecnico\\files\\consistenzaCommessa\\'.$file["name"];
            array_push($percorsi,$percorso);
        }
        else 
            die("error5");
    }

    echo json_encode($percorsi);

?>