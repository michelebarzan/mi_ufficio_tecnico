<?php

    include "connessione.php";

    set_time_limit(240);

    $id_commessa=$_REQUEST["id_commessa"];

    $q4="INSERT INTO [dbo].[anagrafica_materiali] ([nome],[descrizione],[um],[materia_prima],[raggruppamento],[commessa])
        SELECT DISTINCT 
                         mi_db_tecnico.dbo.materie_prime.codice_materia_prima AS nome, mi_db_tecnico.dbo.materie_prime.descrizione, mi_db_tecnico.dbo.materie_prime.um, mi_db_tecnico.dbo.materie_prime.id_materia_prima AS materia_prima, 
                         dbo.raggruppamenti_materiali.id_raggruppamento AS raggruppamento, dbo.consistenza_commesse.commessa
        FROM mi_db_tecnico.dbo.raggruppamenti_materie_prime RIGHT OUTER JOIN
                                mi_db_tecnico.dbo.materie_prime INNER JOIN
                                mi_db_tecnico.dbo.peso_qnt_cabine ON mi_db_tecnico.dbo.materie_prime.id_materia_prima = mi_db_tecnico.dbo.peso_qnt_cabine.id_materia_prima INNER JOIN
                                mi_db_tecnico.dbo.cabine ON mi_db_tecnico.dbo.peso_qnt_cabine.id_cabina = mi_db_tecnico.dbo.cabine.id_cabina INNER JOIN
                                dbo.consistenza_commesse ON mi_db_tecnico.dbo.cabine.codice_cabina = dbo.consistenza_commesse.nr_codice_pareti_kit ON 
                                mi_db_tecnico.dbo.raggruppamenti_materie_prime.id_raggruppamento = mi_db_tecnico.dbo.materie_prime.raggruppamento LEFT OUTER JOIN
                                dbo.raggruppamenti_materiali ON mi_db_tecnico.dbo.raggruppamenti_materie_prime.nome = dbo.raggruppamenti_materiali.nome
        WHERE (dbo.consistenza_commesse.commessa = $id_commessa) AND (mi_db_tecnico.dbo.raggruppamenti_materie_prime.calcolo_fabbisogno_progettato <> 'true') AND (mi_db_tecnico.dbo.materie_prime.codice_materia_prima NOT IN
                            (SELECT nome
                                FROM dbo.anagrafica_materiali
                                WHERE (commessa = $id_commessa)))";
    $r4=sqlsrv_query($conn,$q4);
    if($r4==FALSE)
    {
        die("error");
    }

?>