<?php

    include "Session.php";
    include "connessione.php";

    set_time_limit(3000);

    $commessa=$_REQUEST["commessa"];
    $calcola_media=$_REQUEST["calcola_media"];
    if($calcola_media=="true")
        $colonna=$_REQUEST["colonna"];

    $data=[];

    if($calcola_media=="true")
    {
        $q="SELECT AVG(peso) AS peso, [$colonna], COUNT(codice_cabina) AS n_cabine
            FROM (SELECT peso_qnt_cabine.peso, dbo.consistenza_commesse.[$colonna], peso_qnt_cabine.codice_cabina
                                    FROM dbo.consistenza_commesse INNER JOIN
                                                                    (SELECT codice_cabina, SUM(peso) AS peso
                                                                    FROM mi_db_tecnico.dbo.peso_qnt_cabine AS peso_qnt_cabine_1
                                                                    GROUP BY codice_cabina) AS peso_qnt_cabine ON dbo.consistenza_commesse.nr_codice_pareti_kit = peso_qnt_cabine.codice_cabina
                                    WHERE (dbo.consistenza_commesse.commessa = $commessa) AND (dbo.consistenza_commesse.cabine_sviluppate = 's')) AS t
            GROUP BY [$colonna]";
    }
    else
    {
        $q="SELECT peso_qnt_cabine.codice_cabina, consistenza_commesse.ponte, consistenza_commesse.firezone, consistenza_commesse.lato_nave, consistenza_commesse.n_cabina, consistenza_commesse.verso_cabina, 
                    consistenza_commesse.tipo_cabina, consistenza_commesse.tipo, peso_qnt_cabine.peso
            FROM (SELECT id_consistenza_commessa, commessa, contatore, data_termine_ultimo_progettaz, settimana__arrivo_carrelli_in_cantiere, cabine_sviluppate, nr_lotto_di_prod, data_inser_in_produzione, lasciare_colonna, 
                                                rilascio_ingegneria_entro_la_week_x, sigla_costr, ponte, firezone, sezione, ordinate, lato_nave, n_cabina, verso_cabina, tipo_cabina, nr_codice_pareti_kit, nr_codice_pareti_pref_cabina_parzialment_epref, 
                                                b15_in_prod_da_verificare_utec, tipo, paxeqp, finitura_pareti_a, finitura_pareti_b, finitura_pareti_c, finitura_pareti_d, finitura_pareti_e, tipologia_cabina_fincantieri, tipologia_box_igiene, qta_box_igiene, 
                                                corrisponde_a_tipologia_cabina, floating_floor, h_cabina, h_pannelli, codice_trav_inf, luce_netta_porta_ingresso_cabina_lxh, verso_porta_ingresso_cabina, codice_porta_ingresso_cabina, 
                                                luce_netta_porta_intercom, verso_porta_intercom, codice_porta_interna, pref, sequenza_prf, codice_carrello_prf, lotto_di_produzprf_in_officina_, settimana_imbarco_pref_, soffitti_sviluppati, 
                                                settimana_arrivo_soffitti_in_cantiere, lotto_produz_soffitti_1, data_inser_produz_soffitti, tipologia_soffitto, annex_soffitti, nr_codice_soffitto, tipologia_doga, finitura_soffitti_a, finitura_soffitti_b, finitura_soffitti_c, 
                                                finitura_soffitti_d, finitura_soffitti_e, mq_soffitti, codice_riferimento_pareti__x_gea__non_inserire_dati, letto_pullman_dx, letto_pullman_sx, letto_pullman_rib_dx, letto_pullman_rib_sx, letto_parete_dx, 
                                                letto_parete_sx, letto_singolo, tot_pullman, double_sofa_rrevolving_popullout, rinforzo_tv_verticale, arredo_cabine_sviluppato, codice_arredo, codcabina_gestionale
                        FROM dbo.consistenza_commesse AS consistenza_commesse_1
                        WHERE (commessa = $commessa) AND (cabine_sviluppate = 's')) AS consistenza_commesse INNER JOIN
                        (SELECT codice_cabina, SUM(peso) AS peso
                            FROM mi_db_tecnico.dbo.peso_qnt_cabine AS peso_qnt_cabine_1
                            GROUP BY codice_cabina) AS peso_qnt_cabine ON consistenza_commesse.nr_codice_pareti_kit = peso_qnt_cabine.codice_cabina ";
    }
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            if($calcola_media=="true")
            {
                $rowObj["peso"]=$row["peso"];
                $rowObj[$colonna]=$row[$colonna];
                $rowObj["n_cabine"]=$row["n_cabine"];
            }
            else
            {
                $rowObj["codice_cabina"]=$row["codice_cabina"];
                $rowObj["ponte"]=$row["ponte"];
                $rowObj["firezone"]=$row["firezone"];
                $rowObj["lato_nave"]=$row["lato_nave"];
                $rowObj["n_cabina"]=$row["n_cabina"];
                $rowObj["verso_cabina"]=$row["verso_cabina"];
                $rowObj["tipo_cabina"]=$row["tipo_cabina"];
                $rowObj["tipo"]=$row["tipo"];
                $rowObj["peso"]=$row["peso"];
            }            

            array_push($data,$rowObj);
        }
    }

    echo json_encode($data);

?>