<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $id_troncone=$_REQUEST["id_troncone"];
    $id_macro_attivita=$_REQUEST["id_macro_attivita"];

    $macro_attivita_milestone["id_macro_attivita_milestone"]=null;
    $macro_attivita_milestone["milestone_inizio"]=null;
    $macro_attivita_milestone["prima_dopo_inizio"]=null;
    $macro_attivita_milestone["settimane_inizio"]=null;
    $macro_attivita_milestone["milestone_fine"]=null;
    $macro_attivita_milestone["prima_dopo_fine"]=null;
    $macro_attivita_milestone["settimane_fine"]=null;
    $macro_attivita_milestone["macro_attivita"]=null;

    $q="SELECT dbo.macro_attivita_milestones.id_macro_attivita_milestone, dbo.macro_attivita_milestones.milestone_inizio, dbo.macro_attivita_milestones.prima_dopo_inizio, dbo.macro_attivita_milestones.settimane_inizio, dbo.macro_attivita_milestones.milestone_fine, dbo.macro_attivita_milestones.prima_dopo_fine, dbo.macro_attivita_milestones.settimane_fine, dbo.macro_attivita_milestones.macro_attivita
        FROM dbo.macro_attivita_milestones INNER JOIN dbo.milestones ON dbo.macro_attivita_milestones.milestone_fine = dbo.milestones.id_milestone INNER JOIN dbo.milestones AS milestones_1 ON dbo.macro_attivita_milestones.milestone_inizio = milestones_1.id_milestone
        WHERE (dbo.macro_attivita_milestones.macro_attivita = $id_macro_attivita) AND (dbo.milestones.troncone = $id_troncone) AND (milestones_1.troncone = $id_troncone)";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $macro_attivita_milestone["id_macro_attivita_milestone"]=$row["id_macro_attivita_milestone"];
            $macro_attivita_milestone["milestone_inizio"]=$row["milestone_inizio"];
            $macro_attivita_milestone["prima_dopo_inizio"]=$row["prima_dopo_inizio"];
            $macro_attivita_milestone["settimane_inizio"]=$row["settimane_inizio"];
            $macro_attivita_milestone["milestone_fine"]=$row["milestone_fine"];
            $macro_attivita_milestone["prima_dopo_fine"]=$row["prima_dopo_fine"];
            $macro_attivita_milestone["settimane_fine"]=$row["settimane_fine"];
            $macro_attivita_milestone["macro_attivita"]=$row["macro_attivita"];
        }
    }

    echo json_encode($macro_attivita_milestone);

?>