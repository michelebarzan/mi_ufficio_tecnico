<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $id_troncone=$_REQUEST["id_troncone"];
    $id_macro_attivita=$_REQUEST["id_macro_attivita"];

    $totali["durata"]=0;
    $totali["cabine"]=0;

    $q="SELECT data_inizio, data_fine, DATEPART(week, data_inizio) AS settimana_inizio, DATEPART(week, data_fine) AS settimana_fine, DATEDIFF(day, data_inizio, data_fine) AS durata_giorni, DATEDIFF(week, data_inizio, data_fine) 
            AS durata_settimane
        FROM (SELECT CASE WHEN prima_dopo_inizio = 'dopo' THEN CONVERT(date, DATEADD(dd, + (settimane_inizio * 7), lunedi_inizio)) ELSE CONVERT(date, DATEADD(dd, - (settimane_inizio * 7), lunedi_inizio)) END AS data_inizio, 
                                    CASE WHEN prima_dopo_fine = 'dopo' THEN CONVERT(date, DATEADD(dd, + (settimane_fine * 7), lunedi_fine)) ELSE CONVERT(date, DATEADD(dd, - (settimane_fine * 7), lunedi_fine)) END AS data_fine
            FROM (SELECT t_1.settimane_inizio, t_1.prima_dopo_inizio, t_1.anno_settimana_inizio, dbo.lunedi_settimane.data AS lunedi_inizio, t_1.settimane_fine, t_1.prima_dopo_fine, t_1.anno_settimana_fine, 
                                                                lunedi_settimane_1.data AS lunedi_fine
                                    FROM (SELECT dbo.macro_attivita_milestones.settimane_inizio, dbo.macro_attivita_milestones.prima_dopo_inizio, { fn CONCAT(CONVERT(varchar(MAX), milestones_1.anno), { fn CONCAT('_', 
                                                                                        CONVERT(varchar(MAX), milestones_1.settimana)) }) } AS anno_settimana_inizio, dbo.macro_attivita_milestones.settimane_fine, dbo.macro_attivita_milestones.prima_dopo_fine, 
                                                                                        { fn CONCAT(CONVERT(varchar(MAX), dbo.milestones.anno), { fn CONCAT('_', CONVERT(varchar(MAX), dbo.milestones.settimana)) }) } AS anno_settimana_fine
                                                                FROM dbo.macro_attivita_milestones INNER JOIN
                                                                                        dbo.milestones ON dbo.macro_attivita_milestones.milestone_fine = dbo.milestones.id_milestone INNER JOIN
                                                                                        dbo.milestones AS milestones_1 ON dbo.macro_attivita_milestones.milestone_inizio = milestones_1.id_milestone
                                                                WHERE (dbo.milestones.troncone = $id_troncone) AND (milestones_1.troncone = $id_troncone) AND (dbo.macro_attivita_milestones.macro_attivita = $id_macro_attivita)) AS t_1 INNER JOIN
                                                                dbo.lunedi_settimane ON t_1.anno_settimana_inizio = dbo.lunedi_settimane.settimana INNER JOIN
                                                                dbo.lunedi_settimane AS lunedi_settimane_1 ON t_1.anno_settimana_fine = lunedi_settimane_1.settimana) AS t_2) AS t";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $totali["durata"]=$row["durata_settimane"];
        }
    }
    $q2="SELECT ISNULL(SUM(dbo.consistenza_tronconi.quantita),0) AS cabine
        FROM dbo.macro_attivita_tronconi INNER JOIN dbo.consistenza_tronconi ON dbo.macro_attivita_tronconi.consistenza_troncone = dbo.consistenza_tronconi.id_consistenza_troncone
        WHERE (dbo.macro_attivita_tronconi.macro_attivita = $id_macro_attivita) AND (dbo.consistenza_tronconi.troncone = $id_troncone)";
    $r2=sqlsrv_query($conn,$q2);
    if($r2==FALSE)
    {
        die("error");
    }
    else
    {
        while($row2=sqlsrv_fetch_array($r2))
        {
            $totali["cabine"]=$row2["cabine"];
        }
    }

    echo json_encode($totali);

?>