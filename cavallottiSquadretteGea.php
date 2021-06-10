<?php
	include "Session.php";
	include "connessione.php";

	$pageName="Cavallotti, squadrette Gea";
?>
<html>
	<head>
		<link href="css/fonts.css" rel="stylesheet">
		<title><?php echo $pageName; ?></title>
		<link rel="stylesheet" href="css/struttura.css" />
		<script src="js/struttura.js"></script>
        <link rel="stylesheet" href="css/cavallottiSquadretteGea.css" />
        <script src="js/cavallottiSquadretteGea.js"></script>
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
		<div class="reusable-control-bar">
            <div class="rcb-select-container">
                <span>Commessa</span>
                <select style="text-decoration:none" id="selectCommessaCavallottiSquadrette" onchange="getHotCavallottiSquadrette()"></select>
            </div>
			<button class="rcb-button-text-icon" onclick="esportaCsvCavallottiSquadrette()">
				<span>Esporta</span>
				<i class="fad fa-file-excel" style="margin-left:5px"></i>
			</button>
			<button class="rcb-button-text-icon" style="display:none" id="buttonPopupAlertCommessaNumeroCabina" onclick="getPopupAlertCommessaNumeroCabina()">
				<span>Numero velette eccessivo</span>
				<i class="fad fa-exclamation-triangle" style="margin-left:5px"></i>
			</button>
		</div>
		<div id="cavallottiSquadretteGeaContainer"></div>
		<div id="footer">
			<b>Marine&nbspInteriors&nbspCabins&nbspS.p.A.</b>&nbsp&nbsp|&nbsp&nbspVia&nbspSegaluzza&nbsp33170&nbspPordenone&nbsp&nbsp|&nbsp&nbspPhone:&nbsp(+39)&nbsp0434612811&nbsp|&nbspPowered&nbspby&nbsp<a target="_blank" href="http://www.servizioglobale.it">Servizio Globale S.R.L.</a>
		</div>
	</body>
</html>