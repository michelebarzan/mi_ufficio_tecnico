<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $values=json_decode($_REQUEST["JSONvalues"],true);
    $id_troncone=$_REQUEST["id_troncone"];

    if(isset($values['TAGLIO FERRO']))
    {
        $q0="UPDATE [mi_pianificazione].[dbo].[milestones_principali] SET anno=".explode('_',$values['TAGLIO FERRO'])[0].", settimana=".explode('_',$values['TAGLIO FERRO'])[1]." WHERE (troncone = $id_troncone) AND nome='TAGLIO FERRO'";
        $r0=sqlsrv_query($conn,$q0);
        if($r0==FALSE)
        {
            die("error");
        }
    }

    if(isset($values['IMPOSTAZIONE']))
    {
        $q1="UPDATE [mi_pianificazione].[dbo].[milestones_principali] SET anno=".explode('_',$values['IMPOSTAZIONE'])[0].", settimana=".explode('_',$values['IMPOSTAZIONE'])[1]." WHERE (troncone = $id_troncone) AND nome='IMPOSTAZIONE'";
        $r1=sqlsrv_query($conn,$q1);
        if($r1==FALSE)
        {
            die("error");
        } 
    }
    
    if(isset($values['VARO']))
    {
        $q2="UPDATE [mi_pianificazione].[dbo].[milestones_principali] SET anno=".explode('_',$values['VARO'])[0].", settimana=".explode('_',$values['VARO'])[1]." WHERE (troncone = $id_troncone) AND nome='VARO'";
        $r2=sqlsrv_query($conn,$q2);
        if($r2==FALSE)
        {
            die("error");
        }
    }

    if(isset($values['CONSEGNA']))
    {
        $q3="UPDATE [mi_pianificazione].[dbo].[milestones_principali] SET anno=".explode('_',$values['CONSEGNA'])[0].", settimana=".explode('_',$values['CONSEGNA'])[1]." WHERE (troncone = $id_troncone) AND nome='CONSEGNA'";
        $r3=sqlsrv_query($conn,$q3);
        if($r3==FALSE)
        {
            die("error");
        }
    }

?>