
<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $milestone_inizio=$_REQUEST["milestone_inizio"];
    $prima_dopo_inizio=$_REQUEST["prima_dopo_inizio"];
    $settimane_inizio=$_REQUEST["settimane_inizio"];
    $milestone_fine=$_REQUEST["milestone_fine"];
    $prima_dopo_fine=$_REQUEST["prima_dopo_fine"];
    $settimane_fine=$_REQUEST["settimane_fine"];
    $id_macro_attivita=$_REQUEST["id_macro_attivita"];
    $id_macro_attivita_milestone=$_REQUEST["id_macro_attivita_milestone"];
    $consistenza_troncone_array=json_decode($_REQUEST["JSONconsistenza_troncone_array"]);
    $id_troncone=$_REQUEST["id_troncone"];
    $andamento=$_REQUEST["andamento"];

    if($id_macro_attivita_milestone==null)
    {
        $query2="INSERT INTO [dbo].[macro_attivita_milestones]
                    ([milestone_inizio]
                    ,[prima_dopo_inizio]
                    ,[settimane_inizio]
                    ,[milestone_fine]
                    ,[prima_dopo_fine]
                    ,[settimane_fine]
                    ,[macro_attivita])
                VALUES
                    ($milestone_inizio
                    ,'$prima_dopo_inizio'
                    ,$settimane_inizio
                    ,$milestone_fine
                    ,'$prima_dopo_fine'
                    ,$settimane_fine
                    ,$id_macro_attivita)";
        $result2=sqlsrv_query($conn,$query2);
        if($result2==FALSE)
            die("error1".$query2);
    }
    else
    {
        $query2="UPDATE [macro_attivita_milestones]
                SET milestone_inizio=$milestone_inizio,prima_dopo_inizio='$prima_dopo_inizio',settimane_inizio=$settimane_inizio,milestone_fine=$milestone_fine,prima_dopo_fine='$prima_dopo_fine',settimane_fine=$settimane_fine
                WHERE id_macro_attivita_milestone=$id_macro_attivita_milestone";	
        $result2=sqlsrv_query($conn,$query2);
        if($result2==FALSE)
            die("error1".$query2);
    }

    $query1="DELETE
            FROM macro_attivita_tronconi
            WHERE id_macro_attivita_troncone IN (SELECT dbo.macro_attivita_tronconi.id_macro_attivita_troncone
                                                FROM dbo.macro_attivita_tronconi INNER JOIN dbo.consistenza_tronconi ON dbo.macro_attivita_tronconi.consistenza_troncone = dbo.consistenza_tronconi.id_consistenza_troncone
                                                WHERE (dbo.macro_attivita_tronconi.macro_attivita = $id_macro_attivita) AND (dbo.consistenza_tronconi.troncone = $id_troncone))";	
    $result1=sqlsrv_query($conn,$query1);
    if($result1==FALSE)
        die("error1".$query1);
    else
    {
        foreach ($consistenza_troncone_array as $consistenza_troncone)
        {
            $query3="INSERT INTO [dbo].[macro_attivita_tronconi] ([macro_attivita],[consistenza_troncone])
                    VALUES ($id_macro_attivita,$consistenza_troncone)";	
            $result3=sqlsrv_query($conn,$query3);
            if($result3==FALSE)
                die("error3".$query3);
        }
    }

    $query4="DELETE
            FROM macro_attivita_andamenti
            WHERE macro_attivita = $id_macro_attivita AND troncone = $id_troncone";	
    $result4=sqlsrv_query($conn,$query4);
    if($result4==FALSE)
        die("error4".$query4);
    else
    {
        if($andamento!=null)
        {
            $query5="INSERT INTO [dbo].[macro_attivita_andamenti] ([macro_attivita],[troncone],[andamento])
                    VALUES ($id_macro_attivita,$id_troncone,$andamento)";	
            $result5=sqlsrv_query($conn,$query5);
            if($result5==FALSE)
                die("error5".$query5);
        }
    }

?>