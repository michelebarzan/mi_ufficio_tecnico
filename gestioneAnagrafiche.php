<?php
	include "Session.php";
	include "connessione.php";

	$pageName="Gestione Anagrafiche";
?>
<html>
	<head>
		<link href="css/fonts.css" rel="stylesheet">
		<title><?php echo $pageName; ?></title>
		<link rel="stylesheet" href="css/struttura.css" />
		<script src="js/struttura.js"></script>
        <link rel="stylesheet" href="css/gestioneAnagrafiche.css" />
		<script src="js/gestioneAnagrafiche.js"></script>
		<script src="libs/js/handsontable/handsontable.full.min.js"></script>
		<link href="libs/js/handsontable/handsontable.full.min.css" rel="stylesheet" media="screen">
		<script type="text/javascript" src="libs/js/handsontable/languages/it-IT.js"></script>
		<link rel="stylesheet" href="css/inPageNavBar.css" />
	</head>
	<body>
		<?php include('struttura.php'); ?>
		<div class="reusable-control-bar" id="gestioneAnagraficheActionBar" style="display: none;"></div>
		<div id="gestioneAnagraficheContainer"></div>
		<div id="footer" style="z-index:9999">
			<b>Marine&nbspInteriors&nbspCabins&nbspS.p.A.</b>&nbsp&nbsp|&nbsp&nbspVia&nbspSegaluzza&nbsp33170&nbspPordenone&nbsp&nbsp|&nbsp&nbspPhone:&nbsp(+39)&nbsp0434612811&nbsp|&nbspPowered&nbspby&nbsp<a target="_blank" href="http://www.servizioglobale.it">Servizio Globale S.R.L.</a>
		</div>
	</body>
</html>