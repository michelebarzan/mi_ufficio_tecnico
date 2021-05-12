<?php
	include "Session.php";
	include "connessione.php";

	$pageName="Gestione Database Tecnici";
?>
<html>
	<head>
		<link href="css/fonts.css" rel="stylesheet">
		<title><?php echo $pageName; ?></title>
		<link rel="stylesheet" href="css/struttura.css" />
		<script src="js/struttura.js"></script>
        <link rel="stylesheet" href="css/importaDati.css" />
		<script src="js/importaDati.js"></script>
		<link rel="stylesheet" href="libs/js/spinners/spinner.css" />
		<script src="libs/js/spinners/spinner.js"></script>
		<script src="editableTable/editableTable.js"></script>
		<link rel="stylesheet" href="editableTable/editableTable.css" />
		<script src="libs/js/handsontable/handsontable.full.min.js"></script>
		<link href="libs/js/handsontable/handsontable.full.min.css" rel="stylesheet" media="screen">
		<script type="text/javascript" src="libs/js/handsontable/languages/it-IT.js"></script>
		<link rel="stylesheet" href="css/inPageNavBar.css" />
	</head>
	<body onresize="fixTable()">
		<?php include('struttura.php'); ?>
		<div class="in-page-nav-bar">
			<div class="in-page-nav-bar-row"></div>
			<div class="in-page-nav-bar-row">
				<button class="in-page-nav-bar-button" id="btn_importazione_database" onclick="getMascheraImportazioneDatabase(this)">
					<span>Importazione database</span>
					<i class="fad fa-file-import"></i>
				</button>
				<!--<button class="in-page-nav-bar-button" id="btn_gestione_anagrafiche" onclick="getMascheraGestioneAnagrafiche(this)">
					<span>Gestione anagrafiche</span>
					<i class="fad fa-database"></i>
				</button>-->
				<button class="in-page-nav-bar-button" id="btn_generale" onclick="getMascheraGenerale(this)">
					<span>Generale</span>
					<i class="fad fa-cog"></i>
				</button>
			</div>
		</div>
		<div class="reusable-control-bar" id="importaDatiActionBar" style="display: none;"></div>
		<div id="importaDatiContainer"></div>
		<div id="footer" style="z-index:9999">
			<b>Marine&nbspInteriors&nbspCabins&nbspS.p.A.</b>&nbsp&nbsp|&nbsp&nbspVia&nbspSegaluzza&nbsp33170&nbspPordenone&nbsp&nbsp|&nbsp&nbspPhone:&nbsp(+39)&nbsp0434612811&nbsp|&nbspPowered&nbspby&nbsp<a target="_blank" href="http://www.servizioglobale.it">Servizio Globale S.R.L.</a>
		</div>
	</body>
</html>