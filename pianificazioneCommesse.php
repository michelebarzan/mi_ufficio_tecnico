<?php
	include "Session.php";
	include "connessione.php";

	$pageName="Pianificazione Commesse";
?>
<html>
	<head>
		<link href="css/fonts.css" rel="stylesheet">
		<title><?php echo $pageName; ?></title>
		<link rel="stylesheet" href="css/struttura.css" />
		<script src="js/struttura.js"></script>
		<script src="js/pianificazioneCommesse.js"></script>
		<link rel="stylesheet" href="css/inPageNavBar.css" />
		<link rel="stylesheet" href="css/darkPopup.css" />
        <link rel="stylesheet" href="css/pianificazioneCommesse.css" />
		<script src="libs/js/canvasjs.min.js"></script>
	</head>
	<body>
		<?php include('struttura.php'); ?>
		<div class="in-page-nav-bar">
			<div class="in-page-nav-bar-row">
			</div>
			<div class="in-page-nav-bar-row">
				<button class="in-page-nav-bar-button" id="btn_gestione_attivita" onclick="getMascheraGestioneAttivita(this)">
					<span>Gestione attività</span>
                    <i class="fa-duotone fa-list-tree"></i>
                </button>
				<button class="in-page-nav-bar-button" id="btn_gestione_macro_attivita" onclick="getMascheraGestioneMacroAttivita(this)">
					<span>Gestione macro attività</span>
                    <i class="fa-duotone fa-layer-group"></i>
                </button>
				<!--<button class="in-page-nav-bar-button" id="btn_gestione_andamenti" onclick="getMascheraGestioneAndamenti(this)">
					<span>Gestione andamenti</span>
                    <i class="fa-duotone fa-chart-line"></i>
                </button>-->
				<button class="in-page-nav-bar-button" id="btn_gestione_commesse" onclick="getMascheraGestioneCommesse(this)">
					<span>Gestione commesse</span>
                    <i class="fa-duotone fa-ship"></i>
                </button>
				<button class="in-page-nav-bar-button" id="btn_gestione_commesse" onclick="getMascheraGraficoPrevisionale(this)">
					<span>Grafico previsionale</span>
                    <i class="fa-duotone fa-chart-mixed"></i>
                </button>
			</div>
		</div>
		<div class="reusable-control-bar" id="actionBarPianificazioneCommesse" style="display:none"></div>
		<div id="pianificazioneCommesseContainer" style="display:none"></div>
		<div id="footer">
			<b>Marine&nbspInteriors&nbspCabins&nbspS.p.A.</b>&nbsp&nbsp|&nbsp&nbspVia&nbspSegaluzza&nbsp33170&nbspPordenone&nbsp&nbsp|&nbsp&nbspPhone:&nbsp(+39)&nbsp0434612811&nbsp|&nbspPowered&nbspby&nbsp<a target="_blank" href="http://www.servizioglobale.it">Servizio Globale S.R.L.</a>
        </div>
        <script src="libs/js/multiple-select/multiple-select.min.js"></script>
		<script src="libs/js/multiple-select/multiple-select-it-IT.js"></script>
		<link rel="stylesheet" href="libs/js/multiple-select/multiple-select.min.css">
		<script src="libs/js/handsontable/handsontable.full.min.js" class="hot-links"></script>
		<link href="libs/js/handsontable/handsontable.full.min.css" rel="stylesheet" media="screen" class="hot-links">
		<script type="text/javascript" src="libs/js/handsontable/languages/it-IT.js" class="hot-links"></script>
	</body>
</html>