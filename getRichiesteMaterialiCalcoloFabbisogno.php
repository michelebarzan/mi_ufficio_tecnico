<?php

    include "Session.php";
    include "connessione.php";

    $commessa=$_REQUEST["commessa"];
    $gruppo=$_REQUEST["gruppo"];
    $materiale=$_REQUEST["materiale"];

    if($gruppo=="" || $gruppo==null)
        $filtroGruppo="";
    else
        $filtroGruppo="AND id_gruppo=".$gruppo;

    if($materiale=="" || $materiale==null)
        $filtroMateriale="";
    else
        $filtroMateriale="AND id_materiale=".$materiale;
    
    $richieste=[];

    $q="SELECT TOP (100) PERCENT dbo.richieste_materiali_calcolo_fabbisogno.id_richiesta, dbo.richieste_materiali_calcolo_fabbisogno.dataOra, dbo.richieste_materiali_calcolo_fabbisogno.stato, 
            dbo.richieste_materiali_calcolo_fabbisogno.commessa, dbo.utenti.username, dbo.utenti.id_utente, dbo.utenti.nome, dbo.utenti.cognome, dbo.richieste_materiali_calcolo_fabbisogno.note, 
            dbo.anagrafica_commesse.id_commessa,tipo
        FROM dbo.richieste_materiali_calcolo_fabbisogno INNER JOIN
            dbo.utenti ON dbo.richieste_materiali_calcolo_fabbisogno.utente = dbo.utenti.id_utente INNER JOIN
            dbo.anagrafica_commesse ON dbo.richieste_materiali_calcolo_fabbisogno.commessa = dbo.anagrafica_commesse.id_commessa
        WHERE (dbo.anagrafica_commesse.id_commessa = $commessa)
        ORDER BY dbo.richieste_materiali_calcolo_fabbisogno.id_richiesta DESC";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $richiesta["id_richiesta"]=$row["id_richiesta"];
            $richiesta["dataOra"]=$row["dataOra"]->format('d/m/Y H:i:s');
            $richiesta["stato"]=$row["stato"];
            $richiesta["commessa"]=$row["commessa"];
            $utente["id_utente"]=$row["id_utente"];
            $utente["username"]=$row["username"];
            $utente["nome"]=$row["nome"];
            $utente["cognome"]=$row["cognome"];
            $richiesta["utente"]=$utente;
            $richiesta["note"]=$row["note"];
            $richiesta["tipo"]=$row["tipo"];

            $dettagli=[];
            $q2="SELECT dbo.dettagli_richieste_materiali_calcolo_fabbisogno.id_dettaglio, dbo.dettagli_richieste_materiali_calcolo_fabbisogno.qnt, dbo.dettagli_richieste_materiali_calcolo_fabbisogno.richiesta, 
                            dbo.anagrafica_materiali.nome AS nome_materiale, dbo.anagrafica_materiali.descrizione, dbo.anagrafica_materiali.um, dbo.anagrafica_materiali.materia_prima, dbo.anagrafica_materiali.id_materiale, 
                            dbo.anagrafica_gruppi.id_gruppo, dbo.anagrafica_gruppi.nome AS nome_gruppo, dbo.dettagli_richieste_materiali_calcolo_fabbisogno.formato_1, dbo.dettagli_richieste_materiali_calcolo_fabbisogno.qnt_formato_1, 
                            dbo.dettagli_richieste_materiali_calcolo_fabbisogno.formato_2, dbo.dettagli_richieste_materiali_calcolo_fabbisogno.qnt_formato_2, dbo.formati_lamiere.id_formato AS id_formato_1, dbo.formati_lamiere.codice AS codice_1, 
                            dbo.formati_lamiere.altezza AS altezza_1, dbo.formati_lamiere.larghezza AS larghezza_1, formati_lamiere_1.id_formato AS id_formato_2, formati_lamiere_1.codice AS codice_2, formati_lamiere_1.altezza AS altezza_2, 
                            formati_lamiere_1.larghezza AS larghezza_2, dbo.raggruppamenti_materiali.calcolo_progettato_alternativo
                FROM dbo.raggruppamenti_materiali RIGHT OUTER JOIN
                            dbo.anagrafica_materiali ON dbo.raggruppamenti_materiali.id_raggruppamento = dbo.anagrafica_materiali.raggruppamento RIGHT OUTER JOIN
                            dbo.dettagli_richieste_materiali_calcolo_fabbisogno LEFT OUTER JOIN
                            dbo.formati_lamiere AS formati_lamiere_1 ON dbo.dettagli_richieste_materiali_calcolo_fabbisogno.formato_2 = formati_lamiere_1.id_formato LEFT OUTER JOIN
                            dbo.formati_lamiere ON dbo.dettagli_richieste_materiali_calcolo_fabbisogno.formato_1 = dbo.formati_lamiere.id_formato LEFT OUTER JOIN
                            dbo.anagrafica_gruppi ON dbo.dettagli_richieste_materiali_calcolo_fabbisogno.gruppo = dbo.anagrafica_gruppi.id_gruppo ON 
                            dbo.anagrafica_materiali.id_materiale = dbo.dettagli_richieste_materiali_calcolo_fabbisogno.materiale WHERE richiesta=".$row["id_richiesta"]." $filtroMateriale $filtroGruppo";
            $r2=sqlsrv_query($conn,$q2);
            if($r2==FALSE)
            {
                die("error".$q2);
            }
            else
            {
                while($row2=sqlsrv_fetch_array($r2))
                {
                    $riga["id_dettaglio"]=$row2["id_dettaglio"];
                    $riga["id_materiale"]=$row2["id_materiale"];
                    $riga["qnt"]=$row2["qnt"];
                    $riga["richiesta"]=$row2["richiesta"];
                    $riga["nome_materiale"]=$row2["nome_materiale"];
                    $riga["descrizione"]=$row2["descrizione"];
                    $riga["id_gruppo"]=$row2["id_gruppo"];
                    $riga["nome_gruppo"]=$row2["nome_gruppo"];
                    $riga["um"]=$row2["um"];
                    $riga["materia_prima"]=$row2["materia_prima"];
                    $riga["formato_1"]=$row2["formato_1"];
                    $riga["qnt_formato_1"]=$row2["qnt_formato_1"];
                    $riga["formato_2"]=$row2["formato_2"];
                    $riga["qnt_formato_2"]=$row2["qnt_formato_2"];
                    $riga["id_materiale"]=$row2["id_materiale"];
                    $riga["id_gruppo"]=$row2["id_gruppo"];
                    $riga["calcolo_progettato_alternativo"]=$row2["calcolo_progettato_alternativo"];
                    $riga["id_formato_1"]=$row2["id_formato_1"];
                    $riga["codice_1"]=$row2["codice_1"];
                    $riga["altezza_1"]=$row2["altezza_1"];
                    $riga["larghezza_1"]=$row2["larghezza_1"];
                    $riga["id_formato_2"]=$row2["id_formato_2"];
                    $riga["codice_2"]=$row2["codice_2"];
                    $riga["altezza_2"]=$row2["altezza_2"];
                    $riga["larghezza_2"]=$row2["larghezza_2"];

                    array_push($dettagli,$riga);
                }
                $richiesta["dettagli"]=$dettagli;
            }
            
            //if(sizeof($dettagli)>0)
                array_push($richieste,$richiesta);
        }
    }

    echo json_encode($richieste);

?>