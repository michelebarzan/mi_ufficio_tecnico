<?php
	include "Session.php";
	include "connessione.php";

	$pageName="Fabbisogno Materiali";
?>
<html>
	<head>
		<link href="css/fonts.css" rel="stylesheet">
		<title><?php echo $pageName; ?></title>
		<link rel="stylesheet" href="css/struttura.css" />
		<script src="js/struttura.js"></script>
        <script src="libs/js/spinnersV2/spinners.js"></script>
		<link rel="stylesheet" href="libs/js/spinnersV2/spinners.css" />
		<script src="js/calcoloFabbisogno.js"></script>
		<link rel="stylesheet" href="libs/js/spinners/spinner.css" />
		<script src="libs/js/spinners/spinner.js"></script>
		<script src="editableTable/editableTable.js"></script>
		<script src="libs/js/canvasjs.min.js"></script>
		<link rel="stylesheet" href="editableTable/editableTable.css" />
		<link rel="stylesheet" href="css/inPageNavBar.css" />
		<link rel="stylesheet" href="css/darkPopup.css" />
        <link rel="stylesheet" href="css/calcoloFabbisogno.css" />
	</head>
	<body>
		<?php include('struttura.php'); ?>
		<div class="in-page-nav-bar">
			<div class="in-page-nav-bar-row">
				<div class="in-page-nav-bar-select-container" id="selectCommessaCalcoloFabbisognoContainer">
					<span>Commessa</span>
					<select id="selectCommessaCalcoloFabbisogno" onchange="setCookie('commessaFabbisognoMateriali',this.value);getView()"></select>
				</div>
				<button class="in-page-nav-bar-top-button" style="margin-left:auto" onclick="importaAnagraficheCommessa(true)">
					<span>Importa anagrafiche</span>
					<i class="fad fa-file-import" style="margin-left:5px"></i>
				</button>
			</div>
			<div class="in-page-nav-bar-row">
				<button class="in-page-nav-bar-button" disabled id="btn_anagrafica_materiali" onclick="getMascheraAnagraficaMateriali(this)">
					<span>Anagrafica materiali</span>
					<i class="fad fa-database"></i>
				</button>
				<button class="in-page-nav-bar-button" disabled id="btn_anagrafica_gruppi" onclick="getAnagraficaGruppi(this)">
					<span>Anagrafica gruppi</span>
					<i class="fad fa-database"></i>
				</button>
				<button class="in-page-nav-bar-button" disabled id="btn_importazione_materiali" onclick="getImportazioneMateriali(this)">
					<span>Inserimento Fabbisogno Materiali</span>
					<i class="fad fa-upload"></i>
				</button>
				<button class="in-page-nav-bar-button" disabled id="btn_richieste_materiali" onclick="getMascheraRichiesteMateriali(this)">
					<span>Richieste Materiali</span>
					<i class="fad fa-receipt"></i>
				</button>
				<button class="in-page-nav-bar-button" disabled id="btn_statistiche_materiali" onclick="getMascheraStatisticheMateriali(this)">
					<span>Statistiche Materiali</span>
					<i class="fad fa-analytics"></i>
				</button>
				<!--<button class="in-page-nav-bar-button" disabled id="btn_riepilogo_commesse" onclick="getMascheraRiepilogoCommesse()">
					<span>Riepilogo Commesse</span>
					<i class="fad fa-ship"></i>
				</button>-->
				<button class="in-page-nav-bar-button" disabled id="btn_formati_lamiere" onclick="getMascheraFormatiLamiere()">
					<span>Formati Lamiere</span>
					<i class="fab fa-accusoft"></i>
				</button>
			</div>
		</div>
		<div class="reusable-control-bar" id="actionBarCalcoloFabbisogno" style="display:none">
			<div id="actionBarCalcoloFabbisognoItems" class="reusable-control-bar-items"></div>
			<div id="actionBarFormatiLamiereItems" class="reusable-control-bar-items">
				<button class="rcb-button-text-icon" id="btnEsportaExcelFormatiLamiere" onclick="esportaExcelFormatiLamiere()">
					<span>Esporta</span>
					<i class="fad fa-file-excel" style="margin-left:5px"></i>
				</button>
			</div>
			<div id="actionBarAnagraficheItems" class="reusable-control-bar-items">
				<div class="rcb-text-container"><span style="margin-right: 5px;">Righe:</span><span id="rowsNumEditableTable" style="font-weight: normal; color: black;">6</span></div>
				<button class="rcb-button-text-icon" onclick="resetFilters();getTable(selectetTable)"><span>Ripristina</span><i style="margin-left: 5px;" class="fal fa-filter" aria-hidden="true"></i></button>
			</div>
			<div id="actionBarAnagraficaMaterialiItems" class="reusable-control-bar-items">
				<button class="rcb-button-text-icon" onclick="getPopupCollegaMateriePrime()">
					<span>Collega materiali</span>
					<i class="fad fa-link" style="margin-left:5px"></i>
				</button>
				<button class="rcb-button-text-icon" onclick="getPopupRaggruppamenti()">
					<span>Famiglie materiali</span>
					<i class="fad fa-object-group" style="margin-left:5px"></i>
				</button>
				<!--<button class="rcb-button-text-icon" onclick="importaAnagraficheCommessa(true)">
					<span>Importa anagrafiche commessa</span>
					<i class="fad fa-file-import" style="margin-left:5px"></i>
				</button>-->
			</div>
			<div id="actionBarImportazioneItems" class="reusable-control-bar-items">
				<button class="rcb-button-text-icon" onclick="getPopupInserimentoManuale('inserimento_fabbisogno_materiali')">
					<span>Inserimento Manuale</span>
					<i class="fad fa-layer-plus" style="margin-left:5px"></i>
				</button>
				<button class="rcb-button-text-icon" id="buttonImportaExcel" onclick="document.getElementById('inputImportaExcel').click()">
					<span>Importa Excel</span>
					<i class="fad fa-upload" style="margin-left:5px"></i>
				</button>
				<button class="rcb-button-text-icon" id="buttonTabellaDati" onclick="getTabellaDati(this)">
					<span>Tabella Dati</span>
					<i class="fal fa-table" style="margin-left:5px"></i>
				</button>
				<div style="display:none" id="rowsNumEditableTable"></div>
				<div class="rcb-select-container">
					<select style="text-decoration:none" id="selectScaricaTemplateExcel" onchange="scaricaTemplateExcel(this)"></select>
				</div>
				<button class="rcb-button-text-icon" onclick="getPopupGestioneTemplateExcel()">
					<span>Gestione template excel</span>
					<i class="fad fa-cog" style="margin-left:5px"></i>
				</button>
				<!--<button class="rcb-button-text-icon" onclick="document.getElementById('linkDownloadTemplate').click()">
					<span>Scarica template Excel</span>
					<i class="fad fa-download" style="margin-left:5px"></i>
				</button>-->
				<a id="linkDownloadTemplate" style="display:none"></a>
				<!--<input id="inputImportaTemplate" type="file" accept=".xlsx" style="display:none" onchange="uploadExcelTemplate(this)">-->
				<input id="inputImportaExcel" type="file" accept=".xlsx" style="display:none" onchange="readExcelFile(this)">
			</div>
			<div id="actionBarRichiesteItems" class="reusable-control-bar-items">
				<!--<div class="rcb-select-container">
					<span>Commessa:</span>
					<select id="commessaSelectRichiesteMateriali" onchange="getElencoRichiesteMateriali()"></select>
				</div>-->
				<button class="rcb-button-text-icon" id="buttonNuovaRichiesta" onclick="getPopupRichiestaMateriale()">
					<span>Nuova Richiesta</span>
					<i class="fad fa-layer-plus" style="margin-left:5px"></i>
				</button>
				<div class="rcb-input-icon-container">
					<span>#</span>
					<input type="search" onkeyup="searchRichieste(this.value,'id_richiesta')" style="margin-left:10px" id="inputCercaIdRichiesta" onsearch="searchRichieste(this.value,'id_richiesta')" placeholder="Cerca id richiesta...">
				</div>
				<div class="rcb-select-container" style="padding:0px">
					<select style="text-decoration:none" id="selectMaterialeRichieste" onchange="getMascheraRichiesteMateriali(document.getElementById('btn_richieste_materiali'))">
						<option value="">Tutti i materiali</option>
					</select>
				</div>
				<div class="rcb-select-container">
					<select style="text-decoration:none" id="selectGruppoRichieste" onchange="getMascheraRichiesteMateriali(document.getElementById('btn_richieste_materiali'))">
						<option value="">Tutti i gruppi</option>
					</select>
				</div>
				<button class="rcb-button-text-icon" id="buttonStartEsportaRichieste" onclick="startEsportaRichieste()">
					<span>Trasferisci Richieste</span>
					<i class="fad fa-file-excel" style="margin-left:5px"></i>
				</button>
				<button class="rcb-button-text-icon" style="display:none" id="buttonConfermaEsportaRichieste" onclick="confermaEsportaRichieste(this)">
					<span style="color:#70B085">Conferma</span>
					<i style="color:#70B085" class="fad fa-check" style="margin-left:5px"></i>
				</button>
				<button class="rcb-button-text-icon" style="display:none" id="buttonAnnullaEsportaRichieste" onclick="annullaEsportaRichieste(this)">
					<span style="color:#DA6969">Annulla</span>
					<i style="color:#DA6969" class="fas fa-times" style="margin-left:5px"></i>
				</button>
			</div>
			<div id="actionBarStatisticheMaterialiItems" class="reusable-control-bar-items">
				<button class="rcb-button-text-icon" id="buttonScegliMateriali" onclick="getPopupScegliMateriali()">
					<span>Filtra Materiali/Famiglie</span>
					<i class="fad fa-filter" style="margin-left:5px"></i>
				</button>
				<div class="rcb-text-container toggle-view-fabbisogno-materiali">
					<button id="btnVisualizzazioneStatisticheMaterialiChart" style="border-top-left-radius:2px;border-bottom-left-radius:2px" onclick="visualizzazioneStatisticheMateriali='chart';getStatisticheMateriali();"><span>Grafico</span><i class="fad fa-analytics"></i></button>
					<button id="btnVisualizzazioneStatisticheMaterialiTable" style="border-top-right-radius:2px;border-bottom-right-radius:2px" onclick="visualizzazioneStatisticheMateriali='table';getStatisticheMateriali();"><span>Tabella</span><i class="fal fa-table"></i></button>
				</div>
				<div class="rcb-text-container toggle-view-fabbisogno-materiali">
					<button id="btnTabellaStatisticheMaterialiDettagli" style="border-top-left-radius:2px;border-bottom-left-radius:2px" onclick="tabellaStatisticheMateriali='dettagli';getStatisticheMateriali()"><span>Dettagli</span><i class="fad fa-object-group"></i></button>
					<button id="btnTabellaStatisticheMaterialiPivot" style="border-top-right-radius:2px;border-bottom-right-radius:2px" onclick="tabellaStatisticheMateriali='pivot';getStatisticheMateriali()"><span>Pivot</span><i class="fal fa-object-ungroup"></i></button>
				</div>
				<!--<button class="rcb-button-text-icon" id="btnLimitiDeltaMaterialiStatisticheMateriali" onclick="getPopupLimitiDeltaMateriali()">
					<span>Limiti Delta Materiali</span>
					<i class="fad fa-triangle" style="margin-left:5px;color:gray"></i>
				</button>-->
				<button class="rcb-button-text-icon" id="btnEsportaExcelStatisticheMateriali" onclick="esportaExcelStatisticheMateriali()">
					<span>Esporta</span>
					<i class="fad fa-file-excel" style="margin-left:5px"></i>
				</button>
				<span class="aggiornamento-peso-qnt-cabine" style="font-family:'Montserrat',sans-serif;font-size:12px;margin-left:auto;height:40px;line-height:40px;margin-right:15px"></span>
			</div>
			<div id="actionBarConsistenzaCommessaItems" class="reusable-control-bar-items">
				<button class="rcb-button-text-icon" onclick="getPopupNuovaCommessa()">
					<span>Nuova Commessa</span>
					<i class="fad fa-layer-plus" style="margin-left:5px"></i>
				</button>
				<button class="rcb-button-text-icon" onclick="getPopupModificaCommessa()">
					<span>Modifica Commessa</span>
					<i class="fad fa-layer-plus" style="margin-left:5px"></i>
				</button>
			</div>
			<div id="actionBarRiepilogoCommesseItems" class="reusable-control-bar-items">
				<button class="rcb-button-text-icon" onclick="esportaRiepilogoCommesse()">
					<span>Esporta</span>
					<i class="fad fa-file-excel" style="margin-left:5px"></i>
				</button>
				<div class="rcb-text-container toggle-view-fabbisogno-materiali">
					<button id="btnRaggruppamentoRiepilogoCommesseMateriali" style="border-top-left-radius:2px;border-bottom-left-radius:2px" onclick="raggruppamentoRiepilogoCommesse='materiali';getHotRiepilogoCommesse('containerRiepilogoCommesseItems');"><span>Materiali</span><i class="fad fa-object-ungroup"></i></button>
					<button id="btnRaggruppamentoRiepilogoCommesseFamiglie" style="border-top-right-radius:2px;border-bottom-right-radius:2px" onclick="raggruppamentoRiepilogoCommesse='famiglie';getHotRiepilogoCommesse('containerRiepilogoCommesseItems');"><span>Famiglie</span><i class="fad fa-object-group"></i></button>
				</div>
				<!--<button class="rcb-button-text-icon" onclick="getPopupLimitiDeltaMateriali()">
					<span>Limiti Delta Materiali</span>
					<i class="fad fa-triangle" style="margin-left:5px;color:gray"></i>
				</button>-->
				<span class="aggiornamento-peso-qnt-cabine" style="font-family:'Montserrat',sans-serif;font-size:12px;margin-left:auto;height:40px;line-height:40px;margin-right:15px"></span>
			</div>
		</div>
		<div id="calcoloFabbisognoContainer">
			<div id="containerImportazioneItems" class="container-items">
				<div id="fileImportazioniFabbisogniOuterContainer">
					<div id="fileImportazioniFabbisogniTitleContainer">
						<button id='orderByButtonFileImportazioni' onclick="toggleOrderBy()">
							<i class="fad fa-sort-up"></i>
							<span value="dataOra" id="orderByLabel">Data</span>
						</button>
						<input type="search" id="inputSearchFileImportazioni" placeholder="Cerca..." onkeyup="searchFileImportazioni(this)" onsearch="searchFileImportazioni(this)">
						<div>
							<!--<select id='commessaSelectFileImportazioni' onchange="getElencoFilesImportazioniFabbisogni()"></select>-->
							<select id='utenteSelectFileImportazioni' onchange="getElencoFilesImportazioniFabbisogni()"></select>
						</div>
					</div>
					<div id="fileImportazioniFabbisogniInnerContainer"><div class="fa-spinner-container" style="color:#404040" id="faSpinner_container"><i class="fad fa-spinner-third fa-spin"></i><span>Caricamento in corso...</span></div></div>
				</div>
				<div id="datiImportazioniFabbisogniOuterContainer"></div>
			</div>
			<div id="containerCalcoloFabbisognoItems" class="container-items"></div>
			<div id="containerRichiesteItems" class="container-items">
				<div class="richieste-materiali-container-row"></div>
				<div class="richieste-materiali-container-row" id="containerRichiesteMateriali"></div>
			</div>
			<div id="containerInserimentoItems" class="container-items"></div>
			<div id="containerAnagraficheItems" class="container-items"></div>
			<div id="containerAnagraficheHotItems" class="container-items"></div>
			<div id="containerStatisticheMaterialiItems" class="container-items"></div>
			<div id="containerConsistenzaCommessaItems" class="container-items"></div>
			<div id="containerRiepilogoCommesseItems" class="container-items"></div>
			<div id="containerFormatiLamiere" class="container-items"></div>
        </div>
		<div id="footer">
			<b>Marine&nbspInteriors&nbspCabins&nbspS.p.A.</b>&nbsp&nbsp|&nbsp&nbspVia&nbspSegaluzza&nbsp33170&nbspPordenone&nbsp&nbsp|&nbsp&nbspPhone:&nbsp(+39)&nbsp0434612811&nbsp|&nbspPowered&nbspby&nbsp<a target="_blank" href="http://www.servizioglobale.it">Servizio Globale S.R.L.</a>
        </div>

		<script src="libs/js/multiple-select/multiple-select.min.js"></script>
		<script src="libs/js/multiple-select/multiple-select-it-IT.js"></script>
		<link rel="stylesheet" href="libs/js/multiple-select/multiple-select.min.css">

		<script src="libs/js/handsontable/handsontable.full.min.js" class="hot-links"></script>
		<link href="libs/js/handsontable/handsontable.full.min.css" rel="stylesheet" media="screen" class="hot-links">
		<script type="text/javascript" src="libs/js/handsontable/languages/it-IT.js" class="hot-links"></script>

		<script src="libs/js/xlsx.full.min.js"></script>
	</body>
</html>