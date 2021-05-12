<?php
	include "Session.php";
	include "connessione.php";

	$pageName="Gestione Utenti";
?>
<html>
	<head>
		<link href="css/fonts.css" rel="stylesheet">
		<title><?php echo $pageName; ?></title>
		<link rel="stylesheet" href="css/struttura.css" />
		<script src="js/struttura.js"></script>
        <link rel="stylesheet" href="css/gestioneUtenti.css" />
        <link rel="stylesheet" href="css/materialComponents.css" />
        <script src="js/gestioneUtenti.js"></script>
        <script src="libs/js/fileSaver.min.js"></script>
        <script src="libs/js/xlsx.full.min.js"></script>
	</head>
	<body>
		<?php include('struttura.php'); ?>
		<div class="gestione-utenti-top-bar">
            <button onclick="popupAggiungiUtente()"><i class="fal fa-user-plus" style="margin-left:5px"></i></button>
            <button onclick="toggleOrderIcon(this);"><i class="fal fa-sort-alpha-down"></i></button>
            <input type="search" id="searcBarGestioneUtenti" placeholder="Cerca..." onfocus="this.value=''" onsearch="searchGestioneUtenti(this.value.toLowerCase())" onkeyup="searchGestioneUtenti(this.value.toLowerCase())">
            <select id="selectFiltroGestioneUtenti" onchange="getElencoUtenti()">
                <option value="">Tutti</option>
                <option value="false" selected>Attivi</option>
                <option value="true">Eliminati</option>
            </select>
        </div>
        <div id="containerGestioneUtenti"></div>
		<div id="footer">
			<b>Marine&nbspInteriors&nbspCabins&nbspS.p.A.</b>&nbsp&nbsp|&nbsp&nbspVia&nbspSegaluzza&nbsp33170&nbspPordenone&nbsp&nbsp|&nbsp&nbspPhone:&nbsp(+39)&nbsp0434612811&nbsp|&nbspPowered&nbspby&nbsp<a target="_blank" href="http://www.servizioglobale.it">Servizio Globale S.R.L.</a>
		</div>
	</body>
</html>