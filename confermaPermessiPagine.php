<?php

    include "connessione.php";

    $id_utente=$_REQUEST['id_utente'];
    $permessi_pagine=json_decode($_REQUEST['JSONpermessi_pagine']);

    $query2="DELETE FROM permessi_pagine WHERE utente=$id_utente";
    $result2=sqlsrv_query($conn,$query2);
    if($result2!=TRUE)
        die("error1".$query2);
    else
    {
        foreach ($permessi_pagine as $id_pagina)
        {
            $query3="INSERT INTO permessi_pagine (utente,pagina,permesso) VALUES ($id_utente,$id_pagina,'completo')";	
            $result3=sqlsrv_query($conn,$query3);
            if($result3===FALSE)
                die("error2".$query3);
        }
        echo "ok";
    }
?>