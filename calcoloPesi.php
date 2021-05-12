<?php
	include "Session.php";
	include "connessione.php";

	$pageName="Calcolo Pesi";
?>
<html>
	<head>
		<link href="css/fonts.css" rel="stylesheet">
		<title><?php echo $pageName; ?></title>
		<link rel="stylesheet" href="css/struttura.css" />
		<script src="js/struttura.js"></script>
        <link rel="stylesheet" href="css/calcoloPesi.css" />
        <script src="js/calcoloPesi.js"></script>
        <script src="libs/js/fileSaver.min.js"></script>
        <script src="libs/js/xlsx.full.min.js"></script>
        <script src="libs/js/handsontable/handsontable.full.min.js"></script>
		<link href="libs/js/handsontable/handsontable.full.min.css" rel="stylesheet" media="screen">
		<script type="text/javascript" src="libs/js/handsontable/languages/it-IT.js"></script>
        <link rel="stylesheet" href="css/darkPopup.css" />
	</head>
	<body onresize="fixTableCodici();">
		<?php include('struttura.php'); ?>
		<div class="reusable-control-bar" id="actionBarCloudFoto" style="min-height:40px;height:auto;">
            <div class="rcb-input-icon-container" id="textareaElencoCodiciContainer">
                <textarea id="textareaElencoCodici" placeholder="Incolla un elenco di codici..." ></textarea>
				<button class="fal fa-times" title="Pulisci" onclick="document.getElementById('textareaElencoCodici').value=''" style="margin-right:0px;color:gray;font-size:18px" id="btnCheckCodici" ></button>
                <button class="fad fa-search" title="Conferma" onclick="checkCodici()" id="btnCheckCodici" ></button>
                <button class="fad fa-filter" title="Filtra" onclick="getPopupFiltraConsistenzaCommessa()" id="btnFilterCommessa" style="margin-left:0px;"></button>
            </div>
            <div class="rcb-select-container" style="display:flex;flex-direction:row;align-items:center;justify-content:flex-start;max-width:480px;flex-wrap:wrap;overflow:auto">
                <input type="radio" class="input-radio-tabella" onchange="checkCodici()" checked colonna_codice="automatico" tabella="automatico" name="tabella" style="margin:0px;margin-right:5px;cursor:pointer;outline:none;height: 30px;min-height: 30px;line-height: 30px;"><span style="margin-right:10px;font-weight:bold;height: 30px;min-height: 30px;line-height: 30px;">Automatico</span>
                <input type="radio" class="input-radio-tabella input-radio-tabella-hidden" onchange="checkCodici()" tabella="cabine" colonna_codice="codice_cabina" name="tabella" style="margin:0px;margin-right:5px;cursor:pointer;outline:none"><span class="input-radio-tabella-hidden" style="margin-right:10px">Cabine</span>
                <input type="radio" class="input-radio-tabella input-radio-tabella-hidden" onchange="checkCodici()" tabella="kit" colonna_codice="codice_kit" name="tabella" style="margin:0px;margin-right:5px;cursor:pointer;outline:none"><span class="input-radio-tabella-hidden" style="margin-right:10px">Kit</span>
                <input type="radio" class="input-radio-tabella input-radio-tabella-hidden" onchange="checkCodici()" tabella="pannelli" colonna_codice="codice_pannello" name="tabella" style="margin:0px;margin-right:5px;cursor:pointer;outline:none"><span class="input-radio-tabella-hidden" style="margin-right:10px">Pannelli</span>
                <input type="radio" class="input-radio-tabella input-radio-tabella-hidden" onchange="checkCodici()" tabella="lamiere" colonna_codice="codice_lamiera" name="tabella" style="margin:0px;margin-right:5px;cursor:pointer;outline:none"><span class="input-radio-tabella-hidden" style="margin-right:10px">Lamiere</span>
                <input type="radio" class="input-radio-tabella input-radio-tabella-hidden" onchange="checkCodici()" tabella="lane" colonna_codice="codice_lana" name="tabella" style="margin:0px;margin-right:5px;cursor:pointer;outline:none"><span class="input-radio-tabella-hidden" style="margin-right:10px">Lane</span>
                <input type="radio" class="input-radio-tabella input-radio-tabella-hidden" onchange="checkCodici()" tabella="lane_ceramiche" colonna_codice="codice_lana_ceramica" name="tabella" style="margin:0px;margin-right:5px;cursor:pointer;outline:none"><span class="input-radio-tabella-hidden" style="margin-right:10px">Lane cer.</span>
                <input type="radio" class="input-radio-tabella input-radio-tabella-hidden" onchange="checkCodici()" tabella="rinforzi" colonna_codice="codice_rinforzo" name="tabella" style="margin:0px;margin-right:5px;cursor:pointer;outline:none"><span class="input-radio-tabella-hidden" style="margin-right:10px">Rinforzi</span>
                <input type="radio" class="input-radio-tabella input-radio-tabella-hidden" onchange="checkCodici()" tabella="rinforzi_piede" colonna_codice="codice_rinforzo_piede" name="tabella" style="margin:0px;margin-right:5px;cursor:pointer;outline:none"><span class="input-radio-tabella-hidden" style="margin-right:10px">Rinf. piede</span>
                <input type="radio" class="input-radio-tabella input-radio-tabella-hidden" onchange="checkCodici()" tabella="traversine_inferiori" colonna_codice="codice_traversina_inferiore" name="tabella" style="margin:0px;margin-right:5px;cursor:pointer;outline:none"><span class="input-radio-tabella-hidden" style="margin-right:10px">Trav. inf.</span>
                <input type="radio" class="input-radio-tabella input-radio-tabella-hidden" onchange="checkCodici()" tabella="traversine_superiori" colonna_codice="codice_traversina_superiore" name="tabella" style="margin:0px;margin-right:5px;cursor:pointer;outline:none"><span class="input-radio-tabella-hidden" style="margin-right:10px">Trav. sup.</span>
                <button class="button-toggle-radio-tabella" id="buttonToggleRadioTabella" onclick="toggleRadioTabella(this)"><i class="fal fa-plus-circle"></i></button>
            </div>
            <button class="rcb-button-text-icon" style="display:none" id="btnCodiciNonTrovati" onclick="getPopupCodiciNonTrovati()">
				<span>Alcuni codici non sono stati trovati</span>
				<i class="fal fa-exclamation-triangle" style="margin-left:5px"></i>
            </button>
            <div class="rcb-select-container">
                <span>Output:</span>
                <select id="selectOutputCalcoloPesi" onchange="checkCodici()" style="text-decoration:none">
                    <option value="raggruppato">raggruppato</option>
                    <option value="esploso">esploso</option>
                    <option value="pivot">pivot</option>
                    <!--<option value="esponente_di_carico">esponente di carico</option>-->
                </select>
            </div>
            <div class="rcb-select-container" id="selectColonnaPivotCalcoloPesiContainer">
                <span>Colonna pivot:</span>
                <select id="selectColonnaPivotCalcoloPesi" style=" width:100px;text-decoration:none" onchange="checkCodici()">
                    <option value="pezzo">pezzo</option>
                    <option value="codice_materia_prima">codice materia prima</option>
                    <option value="raggruppamento">raggruppamento materia prima</option>
                </select>
            </div>
            <button class="rcb-button-text-icon" onclick="getPopupEsponenteDiCarico()">
				<span>Esponente di carico</span>
				<i class="fad fa-sigma" style="margin-left:5px"></i>
            </button>
            <button class="rcb-button-text-icon" onclick="esportaExcel()">
				<span>Esporta Excel</span>
				<i class="fal fa-file-excel" style="margin-left:5px"></i>
            </button>
            <span id="aggiornamentoPesoQntCabine" style="font-family:'Montserrat',sans-serif;font-size:12px;margin-left:auto;height:40px;line-height:40px;margin-right:15px"></span>
		</div>
		<div id="calcoloPesiContainer"></div>
		<div id="footer">
			<b>Marine&nbspInteriors&nbspCabins&nbspS.p.A.</b>&nbsp&nbsp|&nbsp&nbspVia&nbspSegaluzza&nbsp33170&nbspPordenone&nbsp&nbsp|&nbsp&nbspPhone:&nbsp(+39)&nbsp0434612811&nbsp|&nbspPowered&nbspby&nbsp<a target="_blank" href="http://www.servizioglobale.it">Servizio Globale S.R.L.</a>
		</div>
	</body>
</html>