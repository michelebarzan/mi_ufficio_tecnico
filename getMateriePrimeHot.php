<?php

    include "Session.php";
    $database="mi_db_tecnico";
    include "connessioneDb.php";

    $tabellaMateriePrime=$_REQUEST["tabellaMateriePrime"];

    set_time_limit(240);

    $columns=[];
    $colHeaders=[];

    if($tabellaMateriePrime=="materie_prime")
    {
        $raggruppamenti=[];
        $q3="SELECT * FROM raggruppamenti_materie_prime";
        $r3=sqlsrv_query($conn,$q3);
        if($r3==FALSE)
        {
            die("error".$q3);
        }
        else
        {
            while($row3=sqlsrv_fetch_array($r3))
            {
                array_push($raggruppamenti,$row3["nome"]);
            }
            array_push($raggruppamenti,"Nessuno");
        }
    }

    $q2="SELECT COLUMN_NAME, CASE WHEN DATA_TYPE = 'varchar' THEN 'text' ELSE 'numeric' END AS type
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE (TABLE_NAME = N'$tabellaMateriePrime')";
    $r2=sqlsrv_query($conn,$q2);
    if($r2==FALSE)
    {
        die("error".$q2);
    }
    else
    {
        while($row2=sqlsrv_fetch_array($r2))
        {
            array_push($colHeaders,$row2["COLUMN_NAME"]);

            $column["data"]=$row2["COLUMN_NAME"];

            if($tabellaMateriePrime=="materie_prime")
            {
                switch ($row2["COLUMN_NAME"])
                {
                    case 'raggruppamento':
                        $column["type"]="dropdown";
                        $column["source"]=$raggruppamenti;
                    break;
                    case 'peso_validato':
                        $column["type"]="checkbox";
                    break;
                    default:
                        $column["type"]=$row2["type"];
                    break;
                }
                
                if($row2["COLUMN_NAME"]=="id_materia_prima" || $row2["COLUMN_NAME"]=="codice_materia_prima")
                    $column["readOnly"]=true;
                else
                    $column["readOnly"]=false;
            }
            else
            {
                if($row2["COLUMN_NAME"]=="id_materia_prima_s" || $row2["COLUMN_NAME"]=="codice_materia_prima_s")
                    $column["readOnly"]=true;
                else
                    $column["readOnly"]=false;
            }

            array_push($columns,$column);
        }
    }

    $data=[];

    if($tabellaMateriePrime=="materie_prime")
    {
        $q="SELECT dbo.materie_prime.id_materia_prima, dbo.materie_prime.codice_materia_prima, dbo.materie_prime.descrizione, dbo.materie_prime.um, dbo.materie_prime.peso, dbo.materie_prime.note, dbo.materie_prime.confezione, ISNULL(dbo.raggruppamenti_materie_prime.nome, 'Nessuno') AS raggruppamento, dbo.materie_prime.peso_validato
            FROM dbo.materie_prime LEFT OUTER JOIN dbo.raggruppamenti_materie_prime ON dbo.materie_prime.raggruppamento = dbo.raggruppamenti_materie_prime.id_raggruppamento";
    }
    else
    {
        $q="SELECT * FROM dbo.materie_prime_s";
    }
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
                switch ($column)
                {
                    case 'peso_validato':
                        $rowObj[$column] = $row[$column] === 'true'? true: false;
                    break;
                    default:
                        $rowObj[$column]=utf8_encode($row[$column]);
                    break;
                }
            }
            array_push($data,$rowObj);
        }
    }

    $arrayResponse["columns"]=$columns;
    $arrayResponse["colHeaders"]=$colHeaders;
    $arrayResponse["data"]=$data;

    echo json_encode($arrayResponse);

?>