
<?php

    include "Session.php";
    include "connessione.php";

    $hideIndex= $_REQUEST["hideIndex"] === 'true'? true: false;

    $pagine_preferite=[];
    $sezioni=[];

    $qPreferiti="SELECT dbo.pagine_preferite_utenti.id_pagina_preferita_utente, dbo.pagine_preferite_utenti.utente, dbo.elenco_pagine.id_pagina, dbo.elenco_pagine.pagina, dbo.elenco_pagine.nomePagina, dbo.elenco_pagine.icona, dbo.permessi_pagine.permesso,elenco_pagine.ordinamento
                FROM dbo.pagine_preferite_utenti INNER JOIN dbo.elenco_pagine ON dbo.pagine_preferite_utenti.pagina = dbo.elenco_pagine.id_pagina INNER JOIN dbo.permessi_pagine ON dbo.elenco_pagine.id_pagina = dbo.permessi_pagine.pagina
                WHERE (dbo.pagine_preferite_utenti.utente = ".$_SESSION['id_utente'].") AND (dbo.permessi_pagine.permesso = 'completo') AND (dbo.permessi_pagine.utente = ".$_SESSION['id_utente'].")
                ORDER BY elenco_pagine.ordinamento";
    $rPreferiti=sqlsrv_query($conn,$qPreferiti);
    if($rPreferiti==FALSE)
    {
        die("error".$qPreferiti);
    }
    else
    {
        while($rowPreferiti=sqlsrv_fetch_array($rPreferiti))
        {
            $id_pagina=$rowPreferiti['id_pagina'];
            $pagina=$rowPreferiti['pagina'];
            $nomePagina=$rowPreferiti['nomePagina'];
            $icona=$rowPreferiti['icona'];
            $id_pagina_preferita_utente=$rowPreferiti['id_pagina_preferita_utente'];

            $obj_pagina['id_pagina']=$id_pagina;
            $obj_pagina['pagina']=$pagina;
            $obj_pagina['nomePagina']=$nomePagina;
            $obj_pagina['icona']=$icona;
            $obj_pagina['id_pagina_preferita_utente']=$id_pagina_preferita_utente;

            if($rowPreferiti['pagina']=="index.php")
            {
                if(!$hideIndex)
                    array_push($pagine_preferite,$obj_pagina);
            }
            else
                array_push($pagine_preferite,$obj_pagina);
        }
    }

    $qSezioni="SELECT [id_sezione],[sezione],[descrizione],[ordinamento] FROM [mi_webapp].[dbo].[elenco_sezioni]";
    $rSezioni=sqlsrv_query($conn,$qSezioni);
    if($rSezioni==FALSE)
    {
        die("error");
    }
    else
    {
        while($rowSezioni=sqlsrv_fetch_array($rSezioni))
        {
            $id_sezione=$rowSezioni['id_sezione'];
            $sezione=$rowSezioni['sezione'];
            $descrizione=$rowSezioni['descrizione'];
            $ordinamento=$rowSezioni['ordinamento'];

            $pagine_sezioni=[];
            $qPagine="SELECT DISTINCT dbo.elenco_pagine.id_pagina, dbo.elenco_pagine.pagina, dbo.elenco_pagine.nomePagina, dbo.elenco_pagine.sezione, dbo.elenco_pagine.icona, dbo.elenco_pagine.descrizione, dbo.permessi_pagine.permesso,elenco_pagine.ordinamento
                    FROM dbo.elenco_pagine INNER JOIN
                                            dbo.permessi_pagine ON dbo.elenco_pagine.id_pagina = dbo.permessi_pagine.pagina
                    WHERE (dbo.elenco_pagine.sezione = $id_sezione) AND (dbo.elenco_pagine.id_pagina NOT IN
                                                (SELECT elenco_pagine_1.id_pagina
                                                FROM dbo.pagine_preferite_utenti INNER JOIN
                                                                            dbo.elenco_pagine AS elenco_pagine_1 ON dbo.pagine_preferite_utenti.pagina = elenco_pagine_1.id_pagina
                                                WHERE (dbo.pagine_preferite_utenti.utente = ".$_SESSION['id_utente']."))) AND (dbo.permessi_pagine.permesso = 'completo') AND (dbo.permessi_pagine.utente = ".$_SESSION['id_utente'].") ORDER BY elenco_pagine.ordinamento";
            $rPagine=sqlsrv_query($conn,$qPagine);
            if($rPagine==FALSE)
            {
                die("error".$qPagine);
            }
            else
            {
                $rowsPagine = sqlsrv_has_rows( $rPagine );
                if ($rowsPagine === true)
                {
                    $obj_sezione['id_sezione']=$id_sezione;
                    $obj_sezione['sezione']=$sezione;
                    $obj_sezione['descrizione']=$descrizione;
                    $obj_sezione['ordinamento']=$ordinamento;
                    while($rowPagine=sqlsrv_fetch_array($rPagine))
                    {
                        $id_pagina=$rowPagine['id_pagina'];
                        $pagina=$rowPagine['pagina'];
                        $nomePagina=$rowPagine['nomePagina'];
                        $icona=$rowPagine['icona'];
                        $descrizione=$rowPagine['descrizione'];
                        $ordinamento=$rowPagine['ordinamento'];

                        $obj_pagina['id_pagina']=$id_pagina;
                        $obj_pagina['pagina']=$pagina;
                        $obj_pagina['nomePagina']=$nomePagina;
                        $obj_pagina['icona']=$icona;
                        $obj_pagina['descrizione']=$descrizione;
                        $obj_pagina['ordinamento']=$ordinamento;

                        if($rowPagine['pagina']=="index.php")
                        {
                            if(!$hideIndex)
                                array_push($pagine_sezioni,$obj_pagina);
                        }
                        else
                            array_push($pagine_sezioni,$obj_pagina);
                    }
                    $obj_sezione['pagine']=$pagine_sezioni;
                    array_push($sezioni,$obj_sezione);
                }
            }
        }
    }

    $response=[];
    array_push($response,json_encode($pagine_preferite));
    array_push($response,json_encode($sezioni));

    echo json_encode($response);

?>