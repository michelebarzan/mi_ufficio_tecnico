<?php
	include "Session.php";
	include "connessione.php";

	$pageName="Gestione Commesse";
?>
<html>
	<head>
		<link rel="stylesheet" href="css/inPageNavBar.css" />
		<link href="css/fonts.css" rel="stylesheet">
		<title><?php echo $pageName; ?></title>
		<link rel="stylesheet" href="css/struttura.css" />
		<script src="js/struttura.js"></script>
        <link rel="stylesheet" href="css/consistenzaCommesse.css" />
        <script src="js/consistenzaCommesse.js"></script>
        <script src="libs/js/fileSaver.min.js"></script>
		<script src="libs/js/xlsx.full.min.js"></script>
		<link rel="stylesheet" href="css/darkPopup.css" />
		<script src="libs/js/handsontable/handsontable.full.min.js"></script>
		<link href="libs/js/handsontable/handsontable.full.min.css" rel="stylesheet" media="screen">
		<script type="text/javascript" src="libs/js/handsontable/languages/it-IT.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/jszip.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.js"></script>
	</head>
	<body>
		<?php include('struttura.php'); ?>
		<div class="in-page-nav-bar">
			<div class="in-page-nav-bar-row">
			</div>
			<div class="in-page-nav-bar-row">
				<button class="in-page-nav-bar-button" id="btn_collegamento_tabelle" onclick="getMascheraCollegamentoTabelle(this)">
					<span>Collegamento tabelle</span>
                    <i class="fa-duotone fa-table"></i>
                </button>
				<button class="in-page-nav-bar-button" id="btn_gestione_tronconi" onclick="getMascheraGestioneTronconi(this)">
					<span>Gestione tronconi</span>
                    <i class="fa-duotone fa-split"></i>
                </button>
			</div>
		</div>
		<div class="reusable-control-bar" id="consistenzaCommesseActionBar" style="display:none"></div>
		<div id="consistenzaCommesseContainer" style="display:none"></div>
		<div id="footer">
			<b>Marine&nbspInteriors&nbspCabins&nbspS.p.A.</b>&nbsp&nbsp|&nbsp&nbspVia&nbspSegaluzza&nbsp33170&nbspPordenone&nbsp&nbsp|&nbsp&nbspPhone:&nbsp(+39)&nbsp0434612811&nbsp|&nbspPowered&nbspby&nbsp<a target="_blank" href="http://www.servizioglobale.it">Servizio Globale S.R.L.</a>
		</div>
	</body>
</html>