<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    set_time_limit(120);

    $table="";

    $colHeaders=["id_milestone", "nome", "settimane", "descrizione", "prima_dopo", "milestone_principale","troncone"];
    $columns=[];

    foreach ($colHeaders as $columnName)
    {
        array_push($colHeaders,$columnName);

        switch ($columnName)
        {
            case 'id_milestone':
                $column["type"]="numeric";
                $column["data"]=$columnName;
                $column["readOnly"]=true;
            break;
            case 'nome':
                $column["type"]="text";
                $column["data"]=$columnName;
                $column["readOnly"]=false;
            break;
            case 'settimane':
                $column["type"]="numeric";
                $column["data"]=$columnName;
                $column["readOnly"]=false;
            break;
            case 'descrizione':
                $column["type"]="text";
                $column["data"]=$columnName;
                $column["readOnly"]=false;
            break;
            case 'prima_dopo':
                $column["type"]="dropdown";
                $column["source"]=["prima","dopo"];
                $column["data"]=$columnName;
                $column["readOnly"]=false;
            break;
            case 'milestone_principale':
                $column["type"]="dropdown";
                $column["source"]=["Inizio nave","Fine nave"];
                $column["data"]=$columnName;
                $column["readOnly"]=false;
            break;
            case 'troncone':
                $column["type"]="text";
                $column["data"]=$columnName;
                $column["readOnly"]=true;
            break;
        }

        array_push($columns,$column);
    }

    $data=[];

    $q="SELECT dbo.anagrafica_milestones.id_milestone, dbo.anagrafica_milestones.nome, dbo.anagrafica_milestones.descrizione, dbo.anagrafica_milestones.settimane, dbo.anagrafica_milestones.prima_dopo, dbo.milestones_principali.nome AS milestone_principale, dbo.anagrafica_tronconi.nome AS troncone
        FROM dbo.anagrafica_milestones INNER JOIN dbo.milestones_principali ON dbo.anagrafica_milestones.milestone_principale = dbo.milestones_principali.id_milestone_principale INNER JOIN dbo.anagrafica_tronconi ON dbo.milestones_principali.troncone = dbo.anagrafica_tronconi.id_troncone";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $rowObj=[];
            foreach ($colHeaders as $column)
            {
                $rowObj[$column]=$row[$column];
            }
            array_push($data,$rowObj);
        }
    }

    $arrayResponse["primaryKey"]="id_milestone";
    $arrayResponse["columns"]=$columns;
    $arrayResponse["colHeaders"]=$colHeaders;
    $arrayResponse["data"]=$data;

    echo json_encode($arrayResponse);

?>