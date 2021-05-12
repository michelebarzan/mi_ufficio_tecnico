<?php
	include "Session.php";
	include "connessione.php";

	$pageName="Calcolo Superficie";
?>
<html>
	<head>
		<link href="css/fonts.css" rel="stylesheet">
		<title><?php echo $pageName; ?></title>
		<link rel="stylesheet" href="css/struttura.css" />
		<script src="js/struttura.js"></script>
        <link rel="stylesheet" href="css/calcoloSuperficiePannello.css" />
        <script src="js/calcoloSuperficiePannello.js"></script>
        <script src="libs/js/fileSaver.min.js"></script>
        <script src="libs/js/xlsx.full.min.js"></script>
	</head>
	<body onresize="fixTablePannelli();fixTableKit();">
		<?php include('struttura.php'); ?>
		<div class="reusable-control-bar" id="actionBarCloudFoto">
            <div class="rcb-input-icon-container" id="textareaElencoCodiciCabinaContainer">
                <textarea id="textareaElencoCodiciCabina" placeholder="Incolla un elenco di codici..." ></textarea>
				<button class="fal fa-times" onclick="document.getElementById('textareaElencoCodiciCabina').value=''" style="margin-right:0px;color:gray;font-size:18px" id="btnCheckCodiciCabina" ></button>
                <button class="fad fa-search" onclick="checkCodiciCabina()" id="btnCheckCodiciCabina" ></button>
            </div>
            <button class="rcb-button-text-icon" onclick="esportaExcel()">
				<span>Esporta Excel</span>
				<i class="fal fa-file-excel" style="margin-left:5px"></i>
            </button>
            <button class="rcb-button-text-icon" style="display:none" id="btnCabineNonTrovate" onclick="getPopupCabineNonTrovate()">
				<span>Alcune cabine non sono state trovate</span>
				<i class="fal fa-exclamation-triangle" style="margin-left:5px"></i>
			</button>
            <button class="rcb-button-text-icon" id="btnMostraCodiciCabina" style="display:flex;flex.direction:row;align-items:center" onclick="document.getElementById('checkboxMostraCodiciCabina').checked=!document.getElementById('checkboxMostraCodiciCabina').checked;printInfoSuperficiePannello()">
				<span>Mostra codici cabina</span>
				<input onclick="disableCheckboxMostraCodiciCabina(event);printInfoSuperficiePannello()" type="checkbox" style="margin-left:10px" id="checkboxMostraCodiciCabina">
            </button>
		</div>
		<div id="calcoloSuperficiePannelloContainer"></div>
		<div id="footer">
			<b>Marine&nbspInteriors&nbspCabins&nbspS.p.A.</b>&nbsp&nbsp|&nbsp&nbspVia&nbspSegaluzza&nbsp33170&nbspPordenone&nbsp&nbsp|&nbsp&nbspPhone:&nbsp(+39)&nbsp0434612811&nbsp|&nbspPowered&nbspby&nbsp<a target="_blank" href="http://www.servizioglobale.it">Servizio Globale S.R.L.</a>
		</div>
	</body>
</html>