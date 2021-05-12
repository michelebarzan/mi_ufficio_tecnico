<?php

    include "Session.php";
	$database="mi_db_tecnico";
    include "connessioneDb.php";

    set_time_limit(3000);

    $codici=json_decode($_REQUEST["JSONcodiciInput"]);
    $codiciInput=json_decode($_REQUEST["JSONcodiciInput"]);
    $tabella=$_REQUEST["tabella"];
    $colonna_codice=$_REQUEST["colonna_codice"];
    $tabelle=json_decode($_REQUEST["JSONtabelle"]);
    $output=$_REQUEST["output"];
    $colonnaPivot=$_REQUEST["colonnaPivot"];

	$codici_in="'".implode("','",$codici)."'";

    $codici=[];
    $arrayResponse["totaliCodici"]["qnt"]=0;
    $arrayResponse["totaliCodici"]["peso"]=0;

    if($colonna_codice=="automatico")
    {
        foreach ($tabelle as $JSONtabellaObj)
        {
            $tabellaObj = json_decode(json_encode($JSONtabellaObj, true),true);

            $qCheck="SELECT * FROM [".$tabellaObj['tabella']."] WHERE [".$tabellaObj['colonna_codice']."] IN ($codici_in)";
            $rCheck=sqlsrv_query($conn,$qCheck);
            if($rCheck==FALSE)
            {
                die("error");
            }
            else
            {
                $rows = sqlsrv_has_rows( $rCheck );
                if ($rows === true)
                {
                    $tabella=$tabellaObj["tabella"];
                    $colonna_codice=$tabellaObj["colonna_codice"];
                    break;
                }
            }
        }
        if($colonna_codice=="automatico")
        {
            die("codice_non_trovato");
        }
    }

    switch ($output)
    {
        case 'raggruppato': 
            $columns=[$colonna_codice,"n_cabine"];
            $qCodici="SELECT [$colonna_codice], SUM(peso) AS peso FROM [dbo].[peso_qnt_$tabella] GROUP BY [$colonna_codice] HAVING [$colonna_codice] IN ($codici_in)";
        break;
        case 'esploso':
            $columns=[$colonna_codice,"codice_materia_prima","pezzo","origine"];
            $columns_string="[".implode("],[",$columns)."]";
            $qCodici="SELECT $columns_string, SUM(peso) AS peso FROM [dbo].[peso_qnt_$tabella] INNER JOIN (SELECT id_materia_prima, codice_materia_prima FROM dbo.materie_prime AS materie_prime_1) AS materie_prime ON dbo.peso_qnt_$tabella.id_materia_prima = materie_prime.id_materia_prima GROUP BY $columns_string HAVING [$colonna_codice] IN ($codici_in)";
            array_push($columns,"n_cabine");
        break;
        case 'pivot':
            $pivot_items=[];
            $pivot_items_isnull=[];
            $qPivotItems="SELECT DISTINCT [$colonnaPivot] FROM [peso_qnt_$tabella] INNER JOIN (SELECT materie_prime_1.id_materia_prima, materie_prime_1.codice_materia_prima, ISNULL(dbo.raggruppamenti_materie_prime.nome, 'da_compilare') AS raggruppamento FROM dbo.materie_prime AS materie_prime_1 LEFT OUTER JOIN dbo.raggruppamenti_materie_prime ON materie_prime_1.raggruppamento = dbo.raggruppamenti_materie_prime.id_raggruppamento) AS materie_prime ON dbo.peso_qnt_$tabella.id_materia_prima = materie_prime.id_materia_prima WHERE [$colonna_codice] IN ($codici_in)";
            $rPivotItems=sqlsrv_query($conn,$qPivotItems);
            if($rPivotItems==FALSE)
            {
                die("error\n\n".$qPivotItems."\n\n".print_r(sqlsrv_errors(),TRUE));
            }
            else
            {
                while($rowPivotItems=sqlsrv_fetch_array($rPivotItems))
                {
                    array_push($pivot_items,$rowPivotItems[$colonnaPivot]);
                    array_push($pivot_items_isnull,"ISNULL([".$rowPivotItems[$colonnaPivot]."],0) AS [".$rowPivotItems[$colonnaPivot]."]");
                }
            }
            $pivot_items_in="[".implode("],[",$pivot_items)."]";
            $pivot_items_isnull_string=implode(",",$pivot_items_isnull);
            $columns = array_merge([$colonna_codice], $pivot_items);
            $columns_string="[".implode("],[",$columns)."]";
            $pivot_items_plus="[".implode("]+[",$pivot_items)."]";
            $qCodici="SELECT $columns_string, $pivot_items_plus AS peso FROM (SELECT [$colonna_codice],$pivot_items_isnull_string FROM (SELECT $colonna_codice,peso,[$colonnaPivot] FROM [peso_qnt_$tabella] INNER JOIN (SELECT materie_prime_1.id_materia_prima, materie_prime_1.codice_materia_prima, ISNULL(dbo.raggruppamenti_materie_prime.nome, 'da_compilare') AS raggruppamento FROM dbo.materie_prime AS materie_prime_1 LEFT OUTER JOIN dbo.raggruppamenti_materie_prime ON materie_prime_1.raggruppamento = dbo.raggruppamenti_materie_prime.id_raggruppamento) AS materie_prime ON dbo.peso_qnt_$tabella.id_materia_prima = materie_prime.id_materia_prima where $colonna_codice IN ($codici_in)) p  PIVOT  (  SUM(peso)  FOR [$colonnaPivot] IN  ( $pivot_items_in)  ) AS t) as pivotTable";
            array_push($columns,"n_cabine");
        break;
    }

    $rCodici=sqlsrv_query($conn,$qCodici);
    if($rCodici==FALSE)
    {
        die("error\n\n".$qCodici."\n\n".print_r(sqlsrv_errors(),TRUE));
    }
    else
    {
        while($rowCodici=sqlsrv_fetch_array($rCodici))
        {
            $arrayResponse["totaliCodici"]["qnt"]++;

            $tableRow=$rowCodici;
            
            $n_cabine=getNCabine($codiciInput,$tableRow['codice_cabina']);
            $tableRow["n_cabine"]=$n_cabine;
            $tableRow["peso_totale"]=$n_cabine*$tableRow["peso"];

            $arrayResponse["totaliCodici"]["peso"]+=$tableRow['peso_totale'];
            
            array_push($codici,$tableRow);
        }
    }

    $codiciHeaders=[];
    foreach ($columns as $column)
    {
        $columnObj["label"]=$column;
        $columnObj["value"]=$column;

        array_push($codiciHeaders,$columnObj);
    }
    $columnObj["label"]="Peso unitario (Kg)";
    $columnObj["value"]="peso";

    array_push($codiciHeaders,$columnObj);

    $columnObj["label"]="Peso totale (Kg)";
    $columnObj["value"]="peso_totale";

    array_push($codiciHeaders,$columnObj);

    $arrayResponse["codiciHeaders"]=$codiciHeaders;
    $arrayResponse["tabella"]=$tabella;
    $arrayResponse["colonna_codice"]=$colonna_codice;
    $arrayResponse["qCodici"]=$qCodici;
    $arrayResponse["codici"]=$codici;

    echo json_encode($arrayResponse);

    function getNCabine($codiciInput,$codice_cabina)
    {
        $n_cabine=0;
        foreach ($codiciInput as $codice)
        {
            if($codice_cabina==$codice)
                $n_cabine++;
        }
        return $n_cabine;
    }
?>