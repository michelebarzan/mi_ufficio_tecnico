<?php

    include "connessione.php";

    set_time_limit(3000);

    error_reporting(E_ERROR | E_PARSE);
    
	require('C:/xampp/htdocs/mi_ufficio_tecnico/libs/php/spreadsheet-reader-master/php-excel-reader/excel_reader2.php');

	require('C:/xampp/htdocs/mi_ufficio_tecnico/libs/php/spreadsheet-reader-master/SpreadsheetReader.php');
    
    $commessa=$_REQUEST["commessa"];
    $utente=$_REQUEST["utente"];
    $percorsi=json_decode($_REQUEST["JSONpercorsi"]);
    $sovrascriviTipCab=$_REQUEST["sovrascriviTipCab"];
    $sovrascriviTipCor=$_REQUEST["sovrascriviTipCor"];
    $foglioTipCab=$_REQUEST["foglioTipCab"];
    $foglioTipCor=$_REQUEST["foglioTipCor"];

    $risultato="ok";

    $q="SELECT * FROM anagrafica_commesse WHERE nome='$commessa'";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        $risultato="Errore generale";
        die($risultato);
    }
    else
    {
        $rows = sqlsrv_has_rows( $r );
        if ($rows === true)
        {
            while($row=sqlsrv_fetch_array($r))
            {
                $id_commessa=$row["id_commessa"];
            }
        }
        else 
        {
            $risultato="Errore: commessa inesistente";
            die($risultato);
        }        
    }

    if($sovrascriviTipCab=="true")
    {
        $q5="DELETE FROM cabine_commesse WHERE commessa=$id_commessa";
        $r5=sqlsrv_query($conn,$q5);
        if($r5==FALSE)
        {
            $risultato="Errore generale";
            die($risultato);
        }
    }
    if($sovrascriviTipCor=="true")
    {
        $q5="DELETE FROM corridoi_commesse WHERE commessa=$id_commessa";
        $r5=sqlsrv_query($conn,$q5);
        if($r5==FALSE)
        {
            $risultato="Errore generale";
            die($risultato);
        }
    }

    foreach ($percorsi as $JSONpercorso)
    {
        $percorso=json_decode(json_encode($JSONpercorso,True),True);

        $Reader = new SpreadsheetReader($percorso["percorso"]);
        $Sheets = $Reader -> Sheets();

        foreach ($Sheets as $Index => $Name)
        {
            if(($percorso['origine']=="tip_cab" && $Name==$foglioTipCab) || ($percorso['origine']=="tip_cor" && $Name==$foglioTipCor))
            {
                if($percorso['origine']=="tip_cab")
                    $n_colonne=75;
                else
                    $n_colonne=34;

                $Reader -> ChangeSheet($Index);

                $i=0;
                foreach ($Reader as $Row)
                {
                    if($i>1)
                    {
                        $insertRow=[];

                        $j=0;
                        foreach ($Row as $cell) 
                        {
                            if($j<$n_colonne)
                            {
                                array_push($insertRow,$cell);
                            }
                            $j++;
                        }

                        $insert=false;
                        foreach ($Row as $cell) 
                        {
                            if($cell!="")
                                $insert=true;
                        }

                        if($insert)
                        {
                            $insertRowString=implode("|split|",$insertRow);
                            $insertRowString=str_replace("'","''",$insertRowString);
                            $insertRowString=str_replace("|split|","','",$insertRowString);
                            $insertRowString="'".$insertRowString."'";
                            
                            if($percorso['origine']=="tip_cab")
                            {
                                $q2="INSERT INTO [dbo].[cabine_commesse] ([commessa],[contatore],[data_termine_ultimo_progettaz],[settimana__arrivo_carrelli_in_cantiere],[cabine_sviluppate],[nr_lotto_di_prod],[data_inser_in_produzione],[lasciare_colonna],[rilascio_ingegneria_entro_la_week_x],[sigla_costr],[ponte],[firezone],[sezione],[ordinate],[lato_nave],[n_cabina],[verso_cabina],[tipo_cabina],[nr_codice_pareti_kit],[nr_codice_pareti_pref_cabina_parzialment_epref],[b15_in_prod_da_verificare_utec],[tipo],[paxeqp],[finitura_pareti_a],[finitura_pareti_b],[finitura_pareti_c],[finitura_pareti_d],[finitura_pareti_e],[tipologia_cabina_fincantieri],[tipologia_box_igiene],[qta_box_igiene],[corrisponde_a_tipologia_cabina],[floating_floor],[h_cabina],[h_pannelli],[codice_trav_inf],[luce_netta_porta_ingresso_cabina_lxh],[verso_porta_ingresso_cabina],[codice_porta_ingresso_cabina],[luce_netta_porta_intercom],[verso_porta_intercom],[codice_porta_interna],[pref],[sequenza_prf],[codice_carrello_prf],[lotto_di_produzprf_in_officina_],[settimana_imbarco_pref_],[soffitti_sviluppati],[settimana_arrivo_soffitti_in_cantiere],[lotto_produz_soffitti_1],[data_inser_produz_soffitti],[tipologia_soffitto],[annex_soffitti],[nr_codice_soffitto],[tipologia_doga],[finitura_soffitti_a],[finitura_soffitti_b],[finitura_soffitti_c],[finitura_soffitti_d],[finitura_soffitti_e],[mq_soffitti],[codice_riferimento_pareti__x_gea__non_inserire_dati],[letto_pullman_dx],[letto_pullman_sx],[letto_pullman_rib_dx],[letto_pullman_rib_sx],[letto_parete_dx],[letto_parete_sx],[letto_singolo],[tot_pullman],[double_sofa_rrevolving_popullout],[rinforzo_tv_verticale],[arredo_cabine_sviluppato],[codice_arredo],[codcabina_gestionale],[esponente_di_carico])
                                    VALUES ($id_commessa,$insertRowString)";
                            }
                            else
                            {
                                $q2="INSERT INTO [dbo].[corridoi_commesse] ([commessa],[contatore],[data_imbarco],[settimana_arrivo_carrelli_in_cantiere],[corridoio_sviluppato],[nr_lotto_di_prod_],[data_inser_in_produzione],[deck],[fire_zone],[ordinate],[verso_nave],[cod_corridoio],[pax_crew],[h_cabina],[h_pannello],[floating_floor],[finitura_pareti_a],[finitura_pareti_b],[finitura_pareti_c],[finitura_pareti_d],[finitura_pareti_e],[nr_pannelli],[mq_parete],[settimana_arrivo_soffitti_in_cantiere],[soffitti_sviluppati],[lotto_produzione_soffitti],[data_inserimento_produzione_soffitti],[codicesoffittocorridoio],[finitura_soffitti_a],[finitura_soffitti_b],[finitura_soffitti_c],[finitura_soffitti_d],[finitura_soffitti_e],[codice_riferimento_srs_per_gea],[codice_corridoio_ponte_zona])
                                    VALUES ($id_commessa,$insertRowString)";
                            }
                                
                            $r2=sqlsrv_query($conn,$q2);
                            if($r2==FALSE)
                            {
                                $riga=$i+1;
                                $risultato="Errore inserimento (riga ".($riga - 2).")";
                                die($risultato);
                            }
                        }
                    }
                    $i++;
                }
            }
        }

        $q4="INSERT INTO [dbo].[log_importazioni_consistenza_commessa] ([commessa],[utente],[data],[risultato],[fileName],[origine]) VALUES ('$commessa','$utente',GETDATE(),'$risultato','".$percorso['percorso']."','".$percorso['origine']."')";
        $r4=sqlsrv_query($conn,$q4);
        if($r4==FALSE)
        {
            die("error");
        }
        /*else
        {
            echo $risultato;
        }*/
    }

?>