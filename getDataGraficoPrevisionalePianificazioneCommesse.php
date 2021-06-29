<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $view_grafico_previsionale=[];
    $data=[];
    $stripLines=[];

    //PRENDO L'ANAGRAFICA DEGLI ANDAMENTI
    $anagrafica_andamenti=[];

    $q="SELECT * FROM anagrafica_andamenti";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $andamentoObj["id_andamento"]=$row["id_andamento"];
            $andamentoObj["nome"]=utf8_encode($row["nome"]);

            $points=[];
            
            for ($i=0; $i < 100; $i++)
            { 
                $dataPointObj["x"]=$i;
                $dataPointObj["y"]=$row[$i];

                array_push($points,$dataPointObj);
            }
            
            $andamentoObj["points"]=$points;

            array_push($anagrafica_andamenti,$andamentoObj);
        }
    }

    //PRENDO L'ANAGRAFICA DELLE MACRO ATTIVITA
    $macro_attivita=[];

    $q4="SELECT [id_macro_attivita],[nome],[descrizione],[durata] FROM [mi_pianificazione].[dbo].[macro_attivita]";
    $r4=sqlsrv_query($conn,$q4);
    if($r4==FALSE)
    {
        die("error".$q4);
    }
    else
    {
        while($row4=sqlsrv_fetch_array($r4))
        {
            $macro_attivitaObj["id_macro_attivita"]=$row4["id_macro_attivita"];
            $macro_attivitaObj["nome"]=utf8_encode($row4["nome"]);
            $macro_attivitaObj["descrizione"]=utf8_encode($row4["descrizione"]);
            $macro_attivitaObj["durata"]=$row4["durata"];

            array_push($macro_attivita,$macro_attivitaObj);
        }
    }

    //PRENDO L'ANAGRAFICA DEI TRONCONI
    $tronconi=[];

    $q5="SELECT * FROM [mi_pianificazione].[dbo].[anagrafica_tronconi]";
    $r5=sqlsrv_query($conn,$q5);
    if($r5==FALSE)
    {
        die("error".$q5);
    }
    else
    {
        while($row5=sqlsrv_fetch_array($r5))
        {
            $troncone["id_troncone"]=$row5["id_troncone"];
            $troncone["nome"]=utf8_encode($row5["nome"]);

            array_push($tronconi,$troncone);
        }
    }

    //PRENDO L ARRAY SETTIMANE
    $settimane=[];

    $q2="SELECT [settimana] FROM [mi_pianificazione].[dbo].[lunedi_settimane] ORDER BY settimana";
    $r2=sqlsrv_query($conn,$q2);
    if($r2==FALSE)
    {
        die("error".$q2);
    }
    else
    {
        while($row2=sqlsrv_fetch_array($r2))
        {
            array_push($settimane,$row2["settimana"]);
        }
    }

    //CREA UN ARRAY CON L'ULTIMA SETTIMANA DI OGNI ANNO
    $ultima_settimana_array=[];

    $q3="SELECT CONVERT(int, anno) AS anno, MAX(CONVERT(int, settimana)) AS settimana
    FROM (SELECT LEFT(settimana, 4) AS anno, REPLACE(settimana, { fn CONCAT(LEFT(settimana, 4), '_') }, '') AS settimana FROM dbo.lunedi_settimane) AS t
    GROUP BY CONVERT(int, anno)";
    $r3=sqlsrv_query($conn,$q3);
    if($r3==FALSE)
    {
        die("error".$q3);
    }
    else
    {
        while($row3=sqlsrv_fetch_array($r3))
        {
            $ultima_settimana_item["anno"]=$row3["anno"];
            $ultima_settimana_item["settimana"]=$row3["settimana"];

            array_push($ultima_settimana_array,$ultima_settimana_item);
        }
    }

    //PRENDO LA QUERY view_grafico_previsionale
    $settimane_inizio_fine=[];

    $q1="SELECT * FROM view_grafico_previsionale";
    $r1=sqlsrv_query($conn,$q1);
    if($r1==FALSE)
    {
        die("error".$q1);
    }
    else
    {
        while($row1=sqlsrv_fetch_array($r1))
        {
            $rowObj["color"]=$row1["color"];
            $rowObj["id_troncone"]=$row1["id_troncone"];
            $rowObj["id_macro_attivita"]=$row1["id_macro_attivita"];

            foreach ($anagrafica_andamenti as $andamento)
            {
                if($row1["andamento"]==$andamento["id_andamento"])
                    $rowObj["andamento"]=$andamento;
            }

            $rowObj["totale_ore"]=$row1["totale_ore"];
            $rowObj["anno_inizio"]=$row1["anno_inizio"];
            $rowObj["settimana_inizio"]=$row1["settimana_inizio"];
            $rowObj["anno_fine"]=$row1["anno_fine"];
            $rowObj["settimana_fine"]=$row1["settimana_fine"];
            $rowObj["durata_settimane"]=$row1["durata_settimane"];
            $rowObj["n"]=$row1["n"];


            //RIEMPIO UN ARRAY CON TUTTE LE SETTIMANE DI INZIO E FINE
            $settimana_inizio=strval($row1["settimana_inizio"]);
            if(strlen($settimana_inizio)==1)
                $settimana_inizio="0".$settimana_inizio;
            $settimana_fine=strval($row1["settimana_fine"]);
            if(strlen($settimana_fine)==1)
                $settimana_fine="0".$settimana_fine;

            array_push($settimane_inizio_fine,intval($row1["anno_inizio"].$settimana_inizio));
            array_push($settimane_inizio_fine,intval($row1["anno_fine"].$settimana_fine));
                
            array_push($view_grafico_previsionale,$rowObj);
        }
    }

    //CREO UN ARRAY CON LE MILESTONES
    $milestones=[];
    $q6="SELECT anagrafica_tronconi.nome AS nome_troncone, dbo.milestones.id_milestone, dbo.milestones.nome, dbo.milestones.descrizione, dbo.milestones.troncone, dbo.milestones.settimana, dbo.milestones.anno, mi_webapp.dbo.anagrafica_commesse.color
        FROM dbo.milestones INNER JOIN dbo.anagrafica_tronconi ON dbo.milestones.troncone = dbo.anagrafica_tronconi.id_troncone INNER JOIN mi_webapp.dbo.anagrafica_commesse ON dbo.anagrafica_tronconi.commessa = mi_webapp.dbo.anagrafica_commesse.id_commessa";
    $r6=sqlsrv_query($conn,$q6);
    if($r6==FALSE)
    {
        die("error".$q6);
    }
    else
    {
        while($row6=sqlsrv_fetch_array($r6))
        {
            $milestone["name"]=utf8_encode($row6["nome_troncone"] . ': ' . $row6["nome"]);
            /*$milestone["color"]="black";
            $milestone["risingColor"]=$row6["color"];*/
            $milestone["color"]=$row6["color"];
            $milestone["principale"]=false;
            $milestone["id"]=$row6["id_milestone"];
            $milestone["nome"]=utf8_encode($row6["nome"]);
            $milestone["descrizione"]=utf8_encode($row6["descrizione"]);
            $milestone["troncone"]=$row6["troncone"];
            $milestone["settimana"]=$row6["settimana"];
            $milestone["anno"]=$row6["anno"];

            //RIEMPIO UN ARRAY CON TUTTE LE SETTIMANE DI INZIO E FINE
            $settimana_milestone=strval($row6["settimana"]);
            if(strlen($settimana_milestone)==1)
                $settimana_milestone="0".$settimana_milestone;

            array_push($settimane_inizio_fine,intval($row6["anno"].$settimana_milestone));

            array_push($milestones,$milestone);
        }
    }

    $q7="SELECT anagrafica_tronconi.nome AS nome_troncone, dbo.milestones_principali.id_milestone_principale, dbo.milestones_principali.nome, dbo.milestones_principali.descrizione, dbo.milestones_principali.troncone, dbo.milestones_principali.settimana, dbo.milestones_principali.anno, mi_webapp.dbo.anagrafica_commesse.color
        FROM dbo.milestones_principali INNER JOIN dbo.anagrafica_tronconi ON dbo.milestones_principali.troncone = dbo.anagrafica_tronconi.id_troncone INNER JOIN mi_webapp.dbo.anagrafica_commesse ON dbo.anagrafica_tronconi.commessa = mi_webapp.dbo.anagrafica_commesse.id_commessa";
    $r7=sqlsrv_query($conn,$q7);
    if($r7==FALSE)
    {
        die("error".$q7);
    }
    else
    {
        while($row7=sqlsrv_fetch_array($r7))
        {
            $milestone["name"]=utf8_encode($row7["nome_troncone"] . ': ' . $row7["nome"]);
            /*$milestone["color"]="black";
            $milestone["risingColor"]=$row7["color"];*/
            $milestone["color"]=$row7["color"];
            $milestone["principale"]=true;
            $milestone["id"]=$row7["id_milestone_principale"];
            $milestone["nome"]=utf8_encode($row7["nome"]);
            $milestone["descrizione"]=utf8_encode($row7["descrizione"]);
            $milestone["troncone"]=$row7["troncone"];
            $milestone["settimana"]=$row7["settimana"];
            $milestone["anno"]=$row7["anno"];

            //RIEMPIO UN ARRAY CON TUTTE LE SETTIMANE DI INZIO E FINE
            $settimana_milestone=strval($row7["settimana"]);
            if(strlen($settimana_milestone)==1)
                $settimana_milestone="0".$settimana_milestone;

            array_push($settimane_inizio_fine,intval($row7["anno"].$settimana_milestone));

            array_push($milestones,$milestone);
        }
    }

    //TRASFORMO L'ANDAMENTO DELLE MACRO ATTIVITA IN DATAPOINTS
    $new_view_grafico_previsionale=[];
    foreach ($view_grafico_previsionale as $line)
    {
        $i=1;
        $help=0;
        $settimanaCount=0;
        $exceedingValue=0;
        $dataPoints=[];
        foreach ($line["andamento"]["points"] as $point)
        {
            $help+=$point["y"];
            if($i==$line["n"])
            {
                $dataPoint["y"]=$help;
                $dataPoint["settimana"]=getWeek($ultima_settimana_array,$line["anno_inizio"],($line["settimana_inizio"]+$settimanaCount),$settimane);
                if($settimanaCount<=$line["durata_settimane"])
                    array_push($dataPoints,$dataPoint);
                else
                    $exceedingValue+=$help;
                $i=1;
                $help=0;
                $settimanaCount++;
            }
            else
                $i++;
        }

        $new_dataPoints=[];
        $dataPoint=null;
        foreach ($dataPoints as $dataPoint)
        {
            $new_dataPoint=$dataPoint;
            $new_dataPoint["y"]=(($dataPoint["y"]+($exceedingValue/sizeof($dataPoints)))*$line["totale_ore"])/100;

            array_push($new_dataPoints,$new_dataPoint);
        }

        $new_line=$line;

        $new_line["dataPoints"]=$new_dataPoints;

        array_push($new_view_grafico_previsionale,$new_line);
    }

    //CALCOLO LE SETTIMANE PER L'ASSE X
    $settimana_inizio=min($settimane_inizio_fine);
    $settimana_fine=max($settimane_inizio_fine);

    $x_values_int=[];
    $settimana=$settimana_inizio;
    while($settimana<=$settimana_fine)
    {
        array_push($x_values_int,$settimana);
        $settimana++;
    }

    $x_values_string=[];
    $settimana=null;
    foreach ($x_values_int as $settimana_int)
    {
        $settimana_int=strval($settimana_int);

        $anno = substr($settimana_int, 0, 4);
        $settimana = str_replace($anno,"",$settimana_int);

        $anno=intval($anno);
        $settimana=intval($settimana);

        if (in_array($anno."_".$settimana, $settimane))
            array_push($x_values_string,$anno."_".$settimana);
    }
    $x_values_string=array_unique($x_values_string);

    //AGGIUNGO LE MACRO ATTIVITA ALL'ARRAY DATA
    $y_values=[];
    $line=null;
    $item=null;
    foreach ($new_view_grafico_previsionale as $line)
    {
        //$item["toolTipContent"]='{name}: {x}';
        $item["tipo"]="macro_attivita";
        $item["color"]=$line["color"];
        $item["type"]="stackedArea";
        $item["name"]=getNomeTroncone($line['id_troncone'],$tronconi) . " - " . getNomeMacroAttivita($line['id_macro_attivita'],$macro_attivita);
        $item["id_troncone"]=$line['id_troncone'];
        $item["nome_troncone"]=getNomeTroncone($line['id_troncone'],$tronconi);
        $item["id_macro_attivita"]=$line['id_macro_attivita'];
        $item["nome_macro_attivita"]=getNomeMacroAttivita($line['id_macro_attivita'],$macro_attivita);

        $dataPoints=[];

        $settimana=null;
        foreach ($x_values_string as $settimana)
        {
            $dataPoint=null;
            $dataPoint["y"]=0;
            $dataPoint["label"]=$settimana;
            foreach ($line["dataPoints"] as $dataPointlcl)
            {
                if($dataPointlcl["settimana"]==$settimana)
                    $dataPoint["y"]=$dataPointlcl["y"];
            }
            array_push($y_values,$dataPoint["y"]);
            array_push($dataPoints,$dataPoint);
        }

        $item["dataPoints"]=$dataPoints;

        array_push($data,$item);
    }

    //AGGIUNGO LE MILESTONE ALL'ARRAY DATA
    $dataPoint=null;
    $item=null;
    $settimana=null;
    foreach ($milestones as $milestone)
    {
        //stripline
        $stripLine["color"]=$milestone["color"];
        $stripLine["thickness"]=4;
        $stripLine["label"]=$milestone["nome"];
        $stripLine["labelFontFamily"]="'Montserrat',sans-serif";
        $stripLine["labelFontColor"]="black";
        if($milestone["principale"])
        {
            $stripLine["labelFontWeight"]="bold";
            $stripLine["labelBackgroundColor"]=$milestone["color"];
        }
        else
        {
            $stripLine["labelFontWeight"]="normal";
        }
        $stripLine["labelFontSize"]=12;

        $i=0;
        foreach ($x_values_string as $settimana)
        {
            if($settimana==$milestone["anno"].'_'.$milestone["settimana"])
                $stripLine["value"]=$i;
            $i++;
        }
        $stripLine["tipo"]="milestone";
        $stripLine["id_troncone"]=$milestone["troncone"];
        $stripLine["principale"]=$milestone["principale"];
        $stripLine["id"]=$milestone["id"];

        array_push($stripLines,$stripLine);

        //candlestick
        $item["tipo"]="milestone";
        $item["color"]="transparent";
        $item["risingColor"]="transparent";
        $item["id_troncone"]=$milestone["troncone"];
        $item["type"]="candlestick";
        $item["name"]=$milestone["name"];
        $i=0;
        foreach ($x_values_string as $settimana)
        {
            if($settimana==$milestone["anno"].'_'.$milestone["settimana"])
                $dataPoint["x"]=$i;
            $i++;
        }
        $dataPoint["label"]=$milestone["anno"].'_'.$milestone["settimana"];
        $dataPoint["y"]=[0, 0, 0, 0];
        $item["dataPoints"]=[$dataPoint];

        array_push($data,$item);
    }

    $axis_x_points=[];
    $settimana=null;
    $point=null;
    $i=0;
    foreach ($x_values_string as $settimana)
    {
        $point["x"]=$i;
        $point["label"]=$settimana;
        array_push($axis_x_points,$point);
        $i++;
    }

    $arrayResponse["axis_x_points"]=$axis_x_points;
    $arrayResponse["stripLines"]=$stripLines;
    $arrayResponse["data"]=$data;
    $arrayResponse["view_grafico_previsionale"]=$new_view_grafico_previsionale;

    echo json_encode($arrayResponse);

    function getWeek($ultima_settimana_array,$anno,$settimana,$settimane)
    {
        if (in_array($anno."_".$settimana, $settimane))
            return $anno."_".$settimana;
        else
        {
            $ultima_settimana_item=null;
            foreach ($ultima_settimana_array as $ultima_settimana_item)
            {
                if($ultima_settimana_item["anno"]==$anno)
                    return ($anno+1)."_".($settimana-$ultima_settimana_item["settimana"]);
            }
        }
    }
    function getNomeMacroAttivita($id_macro_attivita,$macro_attivita)
    {
        foreach ($macro_attivita as $macro_attivitaObj)
        {
            if($macro_attivitaObj["id_macro_attivita"]==$id_macro_attivita)
                return $macro_attivitaObj["nome"];
        }
    }
    function getNomeTroncone($id_troncone,$tronconi)
    {
        foreach ($tronconi as $troncone)
        {
            if($troncone["id_troncone"]==$id_troncone)
                return $troncone["nome"];
        }
    }

?>