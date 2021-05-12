<?php
	include "Session.php";
	include "connessione.php";

	$pageName="Homepage";
?>
<html>
	<head>
		<title><?php echo $pageName; ?></title>
		<link rel="stylesheet" href="css/struttura.css" />
		<script src="js/struttura.js"></script>
		<link rel="stylesheet" href="css/index.css" />
		<script src="js/index.js"></script>
	</head>
	<body>
		<?php include('struttura.php'); ?>
		<div class="index-logo-container">
			<img src="images/logo.png">
		</div>
		<div id="indexOuterContainer" class="index-outer-container"></div>
		<!--<div id="container">
			<div id="content">
				<div id="immagineLogo" class="immagineLogo" ></div>
				<div class="homepageLinkContainer">
					<div class="homepageLink" data-tooltip="Calcolo superficie" onclick="gotopath('calcoloSuperficiePannello.php')">
						<i class="fad fa-ruler-combined"></i>
						<div>Calcolo Superficie</div>
					</div>
					<div class="homepageLink" data-tooltip="Fabbisogno Materiali" onclick="gotopath('calcoloFabbisogno.php')">
						<i class="fad fa-analytics"></i>
						<div>Fabbisogno Materiali</div>
					</div>
					<div class="homepageLink" data-tooltip="Calcolo Pesi" onclick="gotopath('calcoloPesi.php')">
						<i class="fad fa-calculator-alt"></i>
						<div>Calcolo Pesi</div>
					</div>
					<div class="homepageLink" data-tooltip="Gestione Commesse" onclick="gotopath('consistenzaCommesse.php')">
						<i class="fad fa-ship"></i>
						<div>Gestione Commesse</div>
					</div>
					<div class="homepageLink" data-tooltip="Cavallotti, squadrette per Gea" onclick="gotopath('cavallottiSquadretteGea.php')">
						<i class="fad fa-database"></i>
						<div>Cavallotti, squadrette Gea</div>
					</div>
				</div>
				<div id="statisticheSwContainer"></div>
			</div>
		</div>-->
		<div id="footer">
			<b>Marine&nbspInteriors&nbspCabins&nbspS.p.A.</b>&nbsp&nbsp|&nbsp&nbspVia&nbspSegaluzza&nbsp33170&nbspPordenone&nbsp&nbsp|&nbsp&nbspPhone:&nbsp(+39)&nbsp0434612811&nbsp|&nbspPowered&nbspby&nbsp<a target="_blank" href="http://www.servizioglobale.it">Servizio Globale S.R.L.</a>
		</div>
	</body>
</html>
