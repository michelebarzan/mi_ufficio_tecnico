var orderBy="dataOra";
var utenteSelectFileImportazioni;
var commessa;
var mi_webapp_params;
var materiali;
var materiali_statistiche=[];
var commesse=[];
var view;
var excelTemplates;
var raggruppamentoMateriali=false;
var visualizzazioneStatisticheMateriali="grafico";
var tabellaStatisticheMateriali="pivot";
var riepilogoCommesse;
var statisticheMaterialiPivot;
var shouldCallbackPopupNoteMaterialiCommesse;
var raggruppamentoRiepilogoCommesse="materiali";
var hot;
var hot;
var hot;
var hot;
var hot;
var hot;
var hot;
var hot;
var richiesteSelezionateEsportaRichieste=[];
var esportaRichieste=false;

window.addEventListener("load", async function(event)
{
    var id_commessa;
    var cookie_commessaFabbisognoMateriali=await getCookie("commessaFabbisognoMateriali");
    if(cookie_commessaFabbisognoMateriali!=null && cookie_commessaFabbisognoMateriali!="")
        id_commessa=JSON.parse(cookie_commessaFabbisognoMateriali);

    var select=document.getElementById("selectCommessaCalcoloFabbisogno");
    select.innerHTML="";

    commesse=await getCommesse();
    commesse.forEach(commessa =>
    {
        var option=document.createElement("option");
        option.setAttribute("value",commessa.id_commessa);
        if(commessa.id_commessa==id_commessa)
            option.setAttribute("selected","selected");
        option.innerHTML=commessa.nome;
        select.appendChild(option);
    });

    mi_webapp_params=await getMiWebappParams();

    var cookie_materiali_statistiche=await getCookie("materiali_statistiche");
    if(cookie_materiali_statistiche!=null && cookie_materiali_statistiche!="")
        materiali_statistiche=JSON.parse(cookie_materiali_statistiche);

    var cookie_raggruppamentoMateriali=await getCookie("raggruppamentoMateriali");
    if(cookie_raggruppamentoMateriali!=null && cookie_raggruppamentoMateriali!="")
        raggruppamentoMateriali=JSON.parse(cookie_raggruppamentoMateriali);

    var cookie_visualizzazioneStatisticheMateriali=await getCookie("visualizzazioneStatisticheMateriali");
    if(cookie_visualizzazioneStatisticheMateriali!=null && cookie_visualizzazioneStatisticheMateriali!="")
        visualizzazioneStatisticheMateriali=cookie_visualizzazioneStatisticheMateriali;

    var cookie_tabellaStatisticheMateriali=await getCookie("tabellaStatisticheMateriali");
    if(cookie_tabellaStatisticheMateriali!=null && cookie_tabellaStatisticheMateriali!="")
        tabellaStatisticheMateriali=cookie_tabellaStatisticheMateriali;

    var cookie_raggruppamentoRiepilogoCommesse=await getCookie("raggruppamentoRiepilogoCommesse");
    if(cookie_raggruppamentoRiepilogoCommesse!=null && cookie_raggruppamentoRiepilogoCommesse!="")
        raggruppamentoRiepilogoCommesse=cookie_raggruppamentoRiepilogoCommesse;

    $(".in-page-nav-bar-button").prop("disabled",false);

    var dataAggiornamentoPesoQntCabine=await getDataSPPesoQntCabine();
    var aggiornamentoPesoQntCabineElements=document.getElementsByClassName("aggiornamento-peso-qnt-cabine");
    for (let index = 0; index < aggiornamentoPesoQntCabineElements.length; index++)
    {
        const element = aggiornamentoPesoQntCabineElements[index];
        element.innerHTML="Progettato aggiornato al <b>"+dataAggiornamentoPesoQntCabine+"</b>";
    }

    importaAnagraficheCommessa(false);
});
function getView()
{
    if(view!=null)
        document.getElementById("btn_"+view).click();
}
function getMascheraConsistenzaCommesse(button)
{
    view="consistenza_commessa";

    $(".in-page-nav-bar-button").css({"border-bottom-color":"","font-weight":""});
    button.style.borderBottomColor="#4C91CB";
    button.style.fontWeight="bold";

    document.getElementById("actionBarCalcoloFabbisogno").style.display="flex";
    $(".reusable-control-bar-items").hide();

    document.getElementById("actionBarConsistenzaCommessaItems").style.display="flex";
    $(".container-items").hide();
    document.getElementById("containerConsistenzaCommessaItems").style.display="flex";

    $("#selectCommessaCalcoloFabbisognoContainer").hide(200,"swing");

    getTable("consistenza_commesse_view");
}
async function getInfoCommessaPopupModificaCommessa(id_commessa)
{
    if(id_commessa!="" && id_commessa!=null)
    {
        var infoCommessa=await getInfoCabineCommessa(id_commessa);

        document.getElementById("popupModificaCommessaNome").value=infoCommessa.nome;
        document.getElementById("popupModificaCommessaDescrizione").value=infoCommessa.descrizione;
        document.getElementById("popupModificaCommessaCabine").value=infoCommessa.cabine.join("\n");

        document.getElementById("popupModificaCommessaNome").disabled=false;
        document.getElementById("popupModificaCommessaDescrizione").disabled=false;
        document.getElementById("popupModificaCommessaCabine").disabled=false;
        document.getElementById("popupModificaCommessaButton").disabled=false;
    }
    else
    {
        document.getElementById("popupModificaCommessaNome").value="";
        document.getElementById("popupModificaCommessaDescrizione").value="";
        document.getElementById("popupModificaCommessaCabine").value="";

        document.getElementById("popupModificaCommessaNome").disabled=true;
        document.getElementById("popupModificaCommessaDescrizione").disabled=true;
        document.getElementById("popupModificaCommessaCabine").disabled=true;
        document.getElementById("popupModificaCommessaButton").disabled=true;
    }
}
function getInfoCabineCommessa(id_commessa)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getInfoCabineCommessaCalcoloFabbisogno.php",{id_commessa},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
async function getPopupModificaCommessa()
{    
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","dark-popup-outer-container");

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Commessa";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var select=document.createElement("select");
    select.setAttribute("class","dark-popup-select");
    select.setAttribute("id","popupModificaCommessaCommessa");
    select.setAttribute("onchange","getInfoCommessaPopupModificaCommessa(this.value)");

    var option=document.createElement("option");
    option.setAttribute("value","");
    option.innerHTML="Scegli";
    select.appendChild(option);

    commesse.forEach(commessa =>
    {
        var option=document.createElement("option");
        option.setAttribute("value",commessa.id_commessa);
        option.innerHTML=commessa.nome;
        select.appendChild(option);
    });
    
    row.appendChild(select);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Nome";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("class","dark-popup-input");input.setAttribute("type","text");
    input.setAttribute("disabled","disabled");
    input.setAttribute("id","popupModificaCommessaNome");
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Descrizione";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var textarea=document.createElement("textarea");
    textarea.setAttribute("class","dark-popup-textarea");
    textarea.setAttribute("disabled","disabled");
    textarea.setAttribute("id","popupModificaCommessaDescrizione");
    
    row.appendChild(textarea);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Cabine";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var textarea=document.createElement("textarea");
    textarea.setAttribute("class","dark-popup-textarea");
    textarea.setAttribute("disabled","disabled");
    textarea.setAttribute("placeholder","Incolla un elenco di cabine separate da a capo... (incolla da Excel)");
    textarea.setAttribute("id","popupModificaCommessaCabine");
    
    row.appendChild(textarea);

    outerContainer.appendChild(row);
    
    var row=document.createElement("div");
    row.setAttribute("class","dark-popup-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:10px");

    var confirmButton=document.createElement("button");
    confirmButton.setAttribute("class","dark-popup-button");
    confirmButton.setAttribute("id","popupModificaCommessaButton");
    confirmButton.setAttribute("style","width:100%;");
    confirmButton.setAttribute("disabled","disabled");
    confirmButton.setAttribute("onclick","modificaCommessa()");
    confirmButton.innerHTML='<span>Conferma</span><i class="fal fa-check-circle"></i>';
    row.appendChild(confirmButton);    

    outerContainer.appendChild(row);

    Swal.fire
    ({
        background:"#404040",
        title:"Nuova commessa",
        html:outerContainer.outerHTML,
        allowOutsideClick:true,
        showCloseButton:true,
        showConfirmButton:true,
        allowEscapeKey:true,
        showCancelButton:false,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                    document.getElementsByClassName("swal2-title")[0].style.fontSize="12px";
                    document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                    document.getElementsByClassName("swal2-title")[0].style.width="100%";
                    document.getElementsByClassName("swal2-title")[0].style.textDecoration="underline";
                    document.getElementsByClassName("swal2-close")[0].style.width="40px";
                    document.getElementsByClassName("swal2-close")[0].style.height="40px";
                    document.getElementsByClassName("swal2-title")[0].style.margin="0px";
                    document.getElementsByClassName("swal2-title")[0].style.marginTop="5px";
                    document.getElementsByClassName("swal2-title")[0].style.fontFamily="'Montserrat',sans-serif";
                    document.getElementsByClassName("swal2-title")[0].style.textAlign="left";
                    document.getElementsByClassName("swal2-confirm")[0].style.display="none";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingBottom="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingRight="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingLeft="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingTop="10px";
                    document.getElementsByClassName("swal2-header")[0].style.paddingLeft="20px";
                    document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-actions")[0].style.margin="0px";
                }
    });
}
function getPopupNuovaCommessa()
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","dark-popup-outer-container");

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Nome";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("class","dark-popup-input");input.setAttribute("type","text");
    input.setAttribute("id","popupNuovaCommessaNome");
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Descrizione";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var textarea=document.createElement("textarea");
    textarea.setAttribute("class","dark-popup-textarea");
    textarea.setAttribute("id","popupNuovaCommessaDescrizione");
    
    row.appendChild(textarea);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Cabine";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var textarea=document.createElement("textarea");
    textarea.setAttribute("class","dark-popup-textarea");
    textarea.setAttribute("placeholder","Incolla un elenco di cabine separate da a capo... (incolla da Excel)");
    textarea.setAttribute("id","popupNuovaCommessaCabine");
    
    row.appendChild(textarea);

    outerContainer.appendChild(row);
    
    var row=document.createElement("div");
    row.setAttribute("class","dark-popup-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:10px");

    var confirmButton=document.createElement("button");
    confirmButton.setAttribute("class","dark-popup-button");
    confirmButton.setAttribute("style","width:100%;");
    confirmButton.setAttribute("onclick","inserisciNuovaCommessa()");
    confirmButton.innerHTML='<span>Conferma</span><i class="fal fa-check-circle"></i>';
    row.appendChild(confirmButton);    

    outerContainer.appendChild(row);

    Swal.fire
    ({
        background:"#404040",
        title:"Nuova commessa",
        html:outerContainer.outerHTML,
        allowOutsideClick:true,
        showCloseButton:true,
        showConfirmButton:true,
        allowEscapeKey:true,
        showCancelButton:false,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                    document.getElementsByClassName("swal2-title")[0].style.fontSize="12px";
                    document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                    document.getElementsByClassName("swal2-title")[0].style.width="100%";
                    document.getElementsByClassName("swal2-title")[0].style.textDecoration="underline";
                    document.getElementsByClassName("swal2-close")[0].style.width="40px";
                    document.getElementsByClassName("swal2-close")[0].style.height="40px";
                    document.getElementsByClassName("swal2-title")[0].style.margin="0px";
                    document.getElementsByClassName("swal2-title")[0].style.marginTop="5px";
                    document.getElementsByClassName("swal2-title")[0].style.fontFamily="'Montserrat',sans-serif";
                    document.getElementsByClassName("swal2-title")[0].style.textAlign="left";
                    document.getElementsByClassName("swal2-confirm")[0].style.display="none";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingBottom="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingRight="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingLeft="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingTop="10px";
                    document.getElementsByClassName("swal2-header")[0].style.paddingLeft="20px";
                    document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-actions")[0].style.margin="0px";
                }
    });
}
function modificaCommessa()
{
    var id_commessa=document.getElementById("popupModificaCommessaCommessa").value;
    var nome=document.getElementById("popupModificaCommessaNome").value;
    var descrizione=document.getElementById("popupModificaCommessaDescrizione").value;
    var cabine=document.getElementById("popupModificaCommessaCabine").value.split(/\r?\n/);

    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    if(nome==null || nome=="")
    {
        Swal.fire
        ({
            icon:"error",
            background:"#404040",
            title: "Inserisci un nome",
            showCloseButton:true,
            showConfirmButton:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
        }).then((result) => 
        {
            getPopupModificaCommessa();
        });
    }
    else
    {
        var JSONcabine=JSON.stringify(cabine);
        $.post("modificaCommessaCalcoloFabbisogno.php",
        {
            id_commessa,
            nome,
            descrizione,
            JSONcabine
        },
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    console.log(response);
                    Swal.fire
                    ({
                        icon:"error",
                        title: "Errore. Se il problema persiste contatta l' amministratore.",
                        showCloseButton:true,
                        showConfirmButton:false,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                    });
                }
                else
                {
                    Swal.fire
                    ({
                        icon:"success",
                        title: "Modifiche completate",
                        showCloseButton:true,
                        showConfirmButton:false,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                    }).then((result) => 
                    {
                        getTable("consistenza_commesse_view");
                    });
                }
            }
        });
    }
}
function inserisciNuovaCommessa()
{
    var nome=document.getElementById("popupNuovaCommessaNome").value;
    var descrizione=document.getElementById("popupNuovaCommessaDescrizione").value;
    var cabine=document.getElementById("popupNuovaCommessaCabine").value.split(/\r?\n/);

    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    if(nome==null || nome=="")
    {
        Swal.fire
        ({
            icon:"error",
            background:"#404040",
            title: "Inserisci un nome",
            showCloseButton:true,
            showConfirmButton:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
        }).then((result) => 
        {
            getPopupNuovaCommessa();
        });
    }
    else
    {
        var JSONcabine=JSON.stringify(cabine);
        $.post("inserisciNuovaCommessaCalcoloFabbisogno.php",
        {
            nome,
            descrizione,
            JSONcabine
        },
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    console.log(response);
                    Swal.fire
                    ({
                        icon:"error",
                        title: "Errore. Se il problema persiste contatta l' amministratore.",
                        showCloseButton:true,
                        showConfirmButton:false,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                    });
                }
                else
                {
                    Swal.fire
                    ({
                        icon:"success",
                        title: "Inserimento completato",
                        showCloseButton:true,
                        showConfirmButton:false,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                    }).then((result) => 
                    {
                        getTable("consistenza_commesse_view");
                    });
                }
            }
        });
    }
}
function toggleOrderBy()
{
    var orderByLabel=document.getElementById("orderByLabel").getAttribute("value");
    if(orderByLabel=="dataOra")
    {
        orderBy="nomeFile";
        document.getElementById("orderByLabel").innerHTML="Nome";
        document.getElementById("orderByLabel").setAttribute("value","nomeFile");
    }
    else
    {
        orderBy="dataOra";
        document.getElementById("orderByLabel").innerHTML="Data";
        document.getElementById("orderByLabel").setAttribute("value","dataOra");
            
    }
    getElencoFilesImportazioniFabbisogni();
}
function getCommesse()
{
    return new Promise(function (resolve, reject) 
    {
        $.post("getCommesseCalcoloFabbisogno.php",
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
        });
    });
}
function getCommesseFilesImportazioniFabbisogni()
{
    return new Promise(function (resolve, reject) 
    {
        $.post("getCommesseFilesImportazioniFabbisogni.php",
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
        });
    });
}
function getUtentiFilesImportazioniFabbisogni()
{
    return new Promise(function (resolve, reject) 
    {
        $.post("getUtentiFilesImportazioniFabbisogni.php",
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
        });
    });
}
async function getMascheraRichiesteMateriali(button)
{
    view="richieste_materiali";

    $(".in-page-nav-bar-button").css({"border-bottom-color":"","font-weight":""});
    button.style.borderBottomColor="#4C91CB";
    button.style.fontWeight="bold";

    document.getElementById("actionBarCalcoloFabbisogno").style.display="flex";
    $(".reusable-control-bar-items").hide();

    document.getElementById("actionBarRichiesteItems").style.display="flex";
    $(".container-items").hide();
    document.getElementById("containerRichiesteItems").style.display="flex";

    $("#selectCommessaCalcoloFabbisognoContainer").show(200,"swing",function () {$("#selectCommessaCalcoloFabbisognoContainer").css("display","flex")});

    getElencoRichiesteMateriali();
}
async function getElencoRichiesteMateriali()
{
    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });
    
    annullaEsportaRichieste();

    var oldScrollTop=0;
    if(document.getElementById("calcoloFabbisognoContainer")!=null)
        oldScrollTop=document.getElementById("calcoloFabbisognoContainer").scrollTop;

    document.getElementById("inputCercaIdRichiesta").value="";
    
    var containerRichiesteMateriali=document.getElementById("containerRichiesteMateriali");
    containerRichiesteMateriali.innerHTML="";

    var commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;

    materiali=await getMateriali();
    var gruppi=await getGruppi();
    var formati_lamiere=await getFormatiLamiere();

    var selectMateriale=document.getElementById("selectMaterialeRichieste");
    if(selectMateriale.getElementsByTagName("option").length==1)
    {
        materiali.forEach(materiale => 
        {
            var option=document.createElement("option");
            option.setAttribute("value",materiale.id_materiale);
            option.innerHTML=materiale.nome;
            selectMateriale.appendChild(option);
        });
    }
    $("#selectMaterialeRichieste").multipleSelect("destroy");
    $("#selectMaterialeRichieste").multipleSelect(
    {
        single:true,
        onAfterCreate: function () 
                {
                    $(".ms-choice").css({"height":"30px","line-height":"30px","background-color":"transparent","border":"none"});
                    $(".ms-choice span").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left","color":"black"});
                },
        onOpen:function()
        {
            $(".ms-search input").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
            $(".optgroup").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
            $(".ms-drop ul").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
        },
        filter:true,
        filterPlaceholder:"Cerca...",
        locale:"it-IT"
    });
    var selectGruppo=document.getElementById("selectGruppoRichieste");
    if(selectGruppo.getElementsByTagName("option").length==1)
    {
        gruppi.forEach(gruppo => 
        {
            var option=document.createElement("option");
            option.setAttribute("value",gruppo.id_gruppo);
            option.innerHTML=gruppo.nome;
            selectGruppo.appendChild(option);
        });
    }

    var richieste=await getRichiesteMateriali(commessa);

    richieste.forEach(richiesta => 
    {
        var innerContainer=document.createElement("div");
        innerContainer.setAttribute("class","richieste-materiali-item-inner-container");
        innerContainer.setAttribute("id","richiesteMaterialiItem"+richiesta.id_richiesta);
        innerContainer.setAttribute("id_richiesta",richiesta.id_richiesta);
        innerContainer.setAttribute("onclick","selectEsportaRichieste("+richiesta.id_richiesta+")");

        var row=document.createElement("div");
        row.setAttribute("class","richieste-materiali-item-row");

        var section=document.createElement("div");
        section.setAttribute("class","richieste-materiali-item-section");
        section.setAttribute("style","width:130px;overflow:hidden;height:55px;justify-content: space-between;");

        var div=document.createElement("div");
        div.setAttribute("style","display:flex;flex-direction:row;align-items:center;justify-content:flex-start;width:100%;height:15px");
        var hashtag=document.createElement("i");
        hashtag.setAttribute("class","fad fa-hashtag");
        hashtag.setAttribute("style","font-size:14px;margin-right:5px");
        div.appendChild(hashtag);
        var span=document.createElement("span");
        span.setAttribute("class","richieste-materiali-item-span");
        span.innerHTML=richiesta.id_richiesta;
        div.appendChild(span);
        if(richiesta.stato=="Trasferita")
        {
            var icon=document.createElement("i");
            icon.setAttribute("class","fad fa-check-circle");
            icon.setAttribute("style","margin-right:10px;margin-left:auto;color:#70B085");
            div.appendChild(icon);
        }
        var excelIconButton=document.createElement("button");
        excelIconButton.setAttribute("class","action-element-richieste");
        excelIconButton.setAttribute("onclick","esportaRichiestaMateriale("+richiesta.id_richiesta+")");
        if(richiesta.stato=="Trasferita")
            excelIconButton.setAttribute("style","width:15px;height:15px;display:flex;flex-direction:row;align-items:center;justify-content:center;font-size:15px;border:none;background-color:transparent;outline:none;cursor:pointer;margin:0px;padding:0px");
        else
            excelIconButton.setAttribute("style","width:15px;height:15px;display:flex;flex-direction:row;align-items:center;justify-content:center;font-size:15px;border:none;background-color:transparent;outline:none;cursor:pointer;margin:0px;padding:0px;margin-left:auto");
        excelIconButton.innerHTML='<i class="fad fa-file-excel"></i>';
        div.appendChild(excelIconButton);
        section.appendChild(div);

        var span=document.createElement("span");
        span.setAttribute("class","richieste-materiali-item-span");
        span.innerHTML='<i class="fad fa-user" style="font-size:14px;margin-right:5px"></i>'+richiesta.utente.username;
        section.appendChild(span);

        var span=document.createElement("span");
        span.setAttribute("class","richieste-materiali-item-span");
        span.innerHTML='<i class="fad fa-calendar-alt" style="font-size:14px;margin-right:5px"></i>'+richiesta.dataOra;
        section.appendChild(span);

        row.appendChild(section);

        var section=document.createElement("div");
        section.setAttribute("class","richieste-materiali-item-section");
        section.setAttribute("style","border-radius:4px;box-sizing:border-box;width:calc(100% - 340px);margin-left:10px;overflow:hidden;height:55px;justify-content: space-between;box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);");

        var textarea=document.createElement("textarea");
        textarea.setAttribute("class","richieste-materiali-item-textarea action-element-richieste");
        textarea.setAttribute("placeholder","Note");
        textarea.setAttribute("onfocusout","aggiornaNoteRichiestaMateriale(this.value,"+richiesta.id_richiesta+")");
        textarea.innerHTML=richiesta.note;
        section.appendChild(textarea);

        row.appendChild(section);

        var section=document.createElement("div");
        section.setAttribute("class","richieste-materiali-item-section");
        section.setAttribute("style","width:90px;margin-left:10px;justify-content:flex-start;flex-direction:column;align-items:flex-start;");

        var sectionRow=document.createElement("div");
        sectionRow.setAttribute("style","width:100%;display:flex;flex-direction:row;align-items:center;justify-content:flex-start;margin-bottom:2.5px");

        var select=document.createElement("select");
        select.setAttribute("class","richieste-materiali-item-select action-element-richieste");
        select.setAttribute("onchange","aggiornaTipoRichiestaMateriale(this.value,"+richiesta.id_richiesta+")");

        var option=document.createElement("option");
        option.setAttribute("value","pax");
        if(richiesta.tipo=="pax")
            option.setAttribute("selected","selected");
        option.innerHTML="Tipo: pax";
        select.appendChild(option);

        var option=document.createElement("option");
        option.setAttribute("value","crew");
        if(richiesta.tipo=="crew")
            option.setAttribute("selected","selected");
        option.innerHTML="Tipo: crew";
        select.appendChild(option);

        sectionRow.appendChild(select);

        section.appendChild(sectionRow);

        var sectionRow=document.createElement("div");
        sectionRow.setAttribute("style","width:100%;display:flex;flex-direction:row;align-items:center;justify-content:flex-start;margin-top:2.5px")

        var btnModifica=document.createElement("button");
        btnModifica.setAttribute("class","richieste-materiali-item-button action-element-richieste");
        btnModifica.setAttribute("style","background-color:#525252;color:white");
        btnModifica.setAttribute("onclick","getPopupRichiestaMateriale("+richiesta.id_richiesta+")");
        btnModifica.innerHTML='<span>Modifica</span><i class="fad fa-pen-alt"></i>';
        sectionRow.appendChild(btnModifica);

        section.appendChild(sectionRow);
        
        row.appendChild(section);

        var buttonsContainer=document.createElement("div");
        buttonsContainer.setAttribute("style","height:55px;width:90px;display:flex;flex-direction:column;margin-left:10px");

        var btnElimina=document.createElement("button");
        btnElimina.setAttribute("class","richieste-materiali-item-button action-element-richieste");
        btnElimina.setAttribute("style","background-color:#DA6969;color:white;margin-bottom:5px;");
        btnElimina.setAttribute("onclick","eliminaRichiestaMateriale("+richiesta.id_richiesta+")");
        btnElimina.innerHTML='<span>Elimina</span><i class="fad fa-trash"></i>';
        buttonsContainer.appendChild(btnElimina);

        var btnDuplica=document.createElement("button");
        btnDuplica.setAttribute("class","richieste-materiali-item-button action-element-richieste");
        btnDuplica.setAttribute("style","background-color:#525252;color:white");
        btnDuplica.setAttribute("onclick","duplicaRichiestaMateriale("+richiesta.id_richiesta+")");
        btnDuplica.innerHTML='<span>Duplica</span><i class="fad fa-clone"></i>';
        buttonsContainer.appendChild(btnDuplica);

        row.appendChild(buttonsContainer);

        innerContainer.appendChild(row);

        var row=document.createElement("div");
        row.setAttribute("style","overflow:auto;width:100%;max-height:120px;margin-top:10px");
        row.setAttribute("id","richiesteMaterialiHotDettagliContainer"+richiesta.id_richiesta);
        
        innerContainer.appendChild(row);

        containerRichiesteMateriali.appendChild(innerContainer);
    });

    richieste.forEach(richiesta =>
    {
        getHotDettagliRichiesteMaterialiView("dettagli_richieste_materiali_view","richiesteMaterialiHotDettagliContainer"+richiesta.id_richiesta,richiesta.id_richiesta);
    });

    document.getElementById("calcoloFabbisognoContainer").scrollTop = oldScrollTop;

    Swal.close();
}
async function getHotDettagliRichiesteMaterialiView(table,containerId,id_richiesta)
{
    var container = document.getElementById(containerId);
    container.innerHTML="";

    var response=await getHotDettagliRichiesteMaterialiViewData(table,id_richiesta);

    var table=document.createElement("table");
    table.setAttribute("class","dettagli-richiesta-table");
    table.setAttribute("id","dettagliRichiestaTable"+id_richiesta);

    var tr=document.createElement("tr");
    response.colHeaders.forEach(header =>
    {
        var th=document.createElement("th");
        th.innerHTML=header;
        tr.appendChild(th);
    });
    table.appendChild(tr);

    response.data.forEach(row =>
    {
        var tr=document.createElement("tr");
        response.colHeaders.forEach(header =>
        {
            var td=document.createElement("td");
            td.innerHTML=row[header];
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    document.getElementById(containerId).appendChild(table);
}
function getHotDettagliRichiesteMaterialiViewData(table,id_richiesta)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getHotDettagliRichiesteMaterialiViewData.php",{table,id_richiesta},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
function duplicaRichiestaMateriale(id_richiesta)
{
    $.get("duplicaRichiestaMateriale.php",
    {
        id_richiesta
    },
    function(response, status)
    {
        if(status=="success")
        {
            getElencoRichiesteMateriali();
        }
    });
}
function eliminaRichiestaMateriale(id_richiesta)
{
    $.get("eliminaRichiestaMaterialeCalcoloFabbisogno.php",
    {
        id_richiesta
    },
    function(response, status)
    {
        if(status=="success")
        {
            getElencoRichiesteMateriali();
        }
    });
}
/*function getMaterialiCommessaFilesImportazioniFabbisogni(commessa)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getMaterialiCommessaFilesImportazioniFabbisogni.php",
        {
            commessa
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
        });
    });
}*/
function inserisciDettagliRichiestaMateriale(id_richiesta)
{
    $.post("inserisciDettagliRichiestaMaterialeCalcoloFabbisogno.php",
    {
        id_richiesta
    },
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire
                ({
                    icon:"error",
                    title: "Errore. Se il problema persiste contatta l' amministratore.",
                    showCloseButton:true,
                    showConfirmButton:false,
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                });
                console.log(response);
            }
            else
                getElencoRichiesteMateriali();
        }
    });
}
/*function eliminaDettagliRichiestaMateriale(id_dettaglio,tr)
{
    $.post("eliminaDettagliRichiestaMaterialeCalcoloFabbisogno.php",
    {
        id_dettaglio
    },
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire
                ({
                    icon:"error",
                    title: "Errore. Se il problema persiste contatta l' amministratore.",
                    showCloseButton:true,
                    showConfirmButton:false,
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                });
                console.log(response);
            }
            else
            {
                tr.remove();
                fixTables();
            }
        }
    });
}*/
function aggiornaDettagliRichiestaMateriale(valore,id_dettaglio,colonna,input)
{
    var commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;
    $.post("aggiornaDettagliRichiestaMaterialeCalcoloFabbisogno.php",
    {
        valore,id_dettaglio,colonna,commessa
    },
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire
                ({
                    icon:"error",
                    title: "Errore. Impossibile salvare le modifiche. Se il problema persiste contatta l' amministratore.",
                    showCloseButton:true,
                    showConfirmButton:false,
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                });
                console.log(response);
            }
            else
            {
                if(colonna=="materiale")
                {
                    input.parentElement.parentElement.childNodes[1].getElementsByTagName("span")[0].innerHTML=response;
                }
            }
        }
    });
}
/*function fixTables()
{
    try {
        var tables=document.getElementsByClassName("dettagli-richiesta-table");
    for (let index = 0; index < tables.length; index++)
    {
        const table = tables[index];
        try
        {
            var id_richiesta=table.getAttribute("id_richiesta");

            var colsNum=document.getElementById("dettagliRichiestaTable"+id_richiesta).getElementsByTagName("th").length-1;
            var tableWidth=document.getElementById("dettagliRichiestaTable"+id_richiesta).offsetWidth-35;

            var tableColWidth=tableWidth/colsNum;
            
            var ths=document.getElementById("dettagliRichiestaTable"+id_richiesta).getElementsByTagName("th");
            for (let index = 0; index < ths.length; index++)
            {
                const th = ths[index];
                if(index<7)
                    th.style.width=tableColWidth+"px";
            }
            var tds=document.getElementById("dettagliRichiestaTable"+id_richiesta).getElementsByTagName("td");
            for (let index = 0; index < tds.length; index++)
            {
                const td = tds[index];
                if(index<7)
                    td.style.width=tableColWidth+"px";
            }
        } catch (error) {console.log(error)}
    }
    } catch (error) {
        
    }
}*/
function aggiornaGruppoRichiestaMateriale(gruppo,id_richiesta)
{
    $.post("aggiornaGruppoRichiestaMaterialeCalcoloFabbisogno.php",
    {
        gruppo,id_richiesta
    },
    function(response, status)
    {
        if(status=="success")
        {
            console.log(response);
        }
    });
}
function aggiornaTipoRichiestaMateriale(tipo,id_richiesta)
{
    $.post("aggiornaTipoRichiestaMaterialeCalcoloFabbisogno.php",
    {
        tipo,id_richiesta
    },
    function(response, status)
    {
        if(status=="success")
        {
            console.log(response);
        }
    });
}
function aggiornaNoteRichiestaMateriale(note,id_richiesta)
{
    $.post("aggiornaNoteRichiestaMaterialeCalcoloFabbisogno.php",
    {
        note,id_richiesta
    },
    function(response, status)
    {
        if(status=="success")
        {
            console.log(response);
        }
    });
}
function getRichiesteMateriali(commessa)
{
    return new Promise(function (resolve, reject) 
    {
        var materiale=document.getElementById("selectMaterialeRichieste").value;
        var gruppo=document.getElementById("selectGruppoRichieste").value;

        $.get("getRichiesteMaterialiCalcoloFabbisogno.php",
        {
            commessa,
            materiale,
            gruppo
        },
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
async function getImportazioneMateriali(button)
{
    view="importazione_materiali";

    $(".in-page-nav-bar-button").css({"border-bottom-color":"","font-weight":""});
    button.style.borderBottomColor="#4C91CB";
    button.style.fontWeight="bold";

    document.getElementById("actionBarCalcoloFabbisogno").style.display="flex";
    $(".reusable-control-bar-items").hide();
    
    document.getElementById("actionBarImportazioneItems").style.display="flex";
    $(".container-items").hide();
    document.getElementById("containerImportazioneItems").style.display="flex";

    document.getElementById("linkDownloadTemplate").setAttribute("href",mi_webapp_params.web_server_info.protocol+"://"+mi_webapp_params.web_server_info.ip+":"+mi_webapp_params.web_server_info.port+"/mi_ufficio_tecnico/files/calcoloFabbisogno/template.xlsx");

    $("#selectCommessaCalcoloFabbisognoContainer").show(200,"swing",function () {$("#selectCommessaCalcoloFabbisognoContainer").css("display","flex")});

    var selectScaricaTemplateExcel=document.getElementById("selectScaricaTemplateExcel");
    selectScaricaTemplateExcel.innerHTML="";
    var option=document.createElement("option");
    option.setAttribute("disabled","disabled");
    option.setAttribute("id","selectScaricaTemplateExcelPlaceholder");
    option.setAttribute("selected","selected");
    option.innerHTML="Scarica template excel";
    selectScaricaTemplateExcel.appendChild(option);

    excelTemplates=await getExcelTemplates();
    excelTemplates.forEach(template =>
    {
        var option=document.createElement("option");
        option.setAttribute("value",template.fileName);
        option.innerHTML=template.nome;
        selectScaricaTemplateExcel.appendChild(option);
    });

    getElencoFilesImportazioniFabbisogni();
}
function scaricaTemplateExcel(select)
{
    document.getElementById("linkDownloadTemplate").setAttribute("href","files/calcoloFabbisogno/templates/"+select.value);
    document.getElementById("linkDownloadTemplate").setAttribute("download",select.value);
    document.getElementById("linkDownloadTemplate").click();
    document.getElementById("selectScaricaTemplateExcelPlaceholder").selected=true;
}
async function getPopupGestioneTemplateExcel()
{
    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    excelTemplates=await getExcelTemplates();

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","popup-cambia-template-outer-container");

    var button=document.createElement("div");
    button.setAttribute("style","background-color:none;border:none;border-bottom:1px solid #ddd;cursor:pointer;display:flex;align-items:center;justify-content:flex-start;flex-direction:row;margin-left:20px;margin-top:15px;margin-bottom:10px;color:#ddd;");
    button.setAttribute("onclick","getPopupNuovoTemplateExcel()");
    var span=document.createElement("span");
    span.setAttribute("style","font-size: 12px;font-weight: normal;font-family: 'Montserrat',sans-serif;");
    span.innerHTML="Inserisci";
    button.appendChild(span);
    var i=document.createElement("i");
    i.setAttribute("style","margin-left:5px");
    i.setAttribute("class","fad fa-file-plus");
    button.appendChild(i);
    outerContainer.appendChild(button);

    var i=0;
    excelTemplates.forEach(template => 
    {
        var templateItem=document.createElement("div");
        templateItem.setAttribute("class","popup-cambia-template-item");
        //templateItem.setAttribute("onclick","cambiaTemplate("+template.filtro+","+template.id_template+",'"+template.nome+"','"+template.descrizione+"')");

        var div=document.createElement("div");

        var span=document.createElement("span");
        span.setAttribute("style","font-weight:bold");
        span.innerHTML=template.nome;
        div.appendChild(span);

        var button=document.createElement("button");
        button.setAttribute("style","margin-left:auto;");
        button.setAttribute("onclick","eliminaExcelTemplate("+template.id_template+")");
        button.innerHTML="<i class='fad fa-trash'></i>";
        div.appendChild(button);

        templateItem.appendChild(div);

        if(template.descrizione!="" && template.descrizione!=null)
        {
            var div=document.createElement("div");

            var span=document.createElement("span");
            span.innerHTML=template.descrizione;
            div.appendChild(span);

            templateItem.appendChild(div);
        }
        
        outerContainer.appendChild(templateItem);
        i++;
    });

    Swal.fire
    ({
        background:"#404040",
        title:"Gestione template excel",
        html:outerContainer.outerHTML,
        allowOutsideClick:true,
        showCloseButton:true,
        showConfirmButton:true,
        allowEscapeKey:true,
        showCancelButton:false,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                    document.getElementsByClassName("swal2-title")[0].style.fontSize="12px";
                    document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                    document.getElementsByClassName("swal2-title")[0].style.width="100%";
                    document.getElementsByClassName("swal2-close")[0].style.width="40px";
                    document.getElementsByClassName("swal2-close")[0].style.height="40px";
                    document.getElementsByClassName("swal2-title")[0].style.margin="0px";
                    document.getElementsByClassName("swal2-title")[0].style.marginTop="5px";
                    document.getElementsByClassName("swal2-title")[0].style.fontFamily="'Montserrat',sans-serif";
                    document.getElementsByClassName("swal2-title")[0].style.textAlign="left";
                    document.getElementsByClassName("swal2-confirm")[0].style.display="none";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingBottom="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingRight="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingLeft="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingTop="10px";
                    document.getElementsByClassName("swal2-header")[0].style.paddingLeft="20px";
                    document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-actions")[0].style.margin="0px";
                }
    });
}
function eliminaExcelTemplate(id_template)
{
    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    $.get("eliminaExcelTemplateCalcoloFabbisogno.php",
    {
        id_template
    },
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                console.log(response);
                Swal.fire
                ({
                    icon:"error",
                    title: "Errore. Se il problema persiste contatta l' amministratore.",
                    showCloseButton:true,
                    showConfirmButton:false,
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                });
            }
            else
            {
                var selectScaricaTemplateExcel=document.getElementById("selectScaricaTemplateExcel");
                selectScaricaTemplateExcel.innerHTML="";
                var option=document.createElement("option");
                option.setAttribute("disabled","disabled");
                option.setAttribute("id","selectScaricaTemplateExcelPlaceholder");
                option.setAttribute("selected","selected");
                option.innerHTML="Scarica template excel";
                selectScaricaTemplateExcel.appendChild(option);

                var x=0;
                excelTemplates.forEach(template =>
                {
                    if(template.id_template==id_template)
                        excelTemplates.splice(x, 1);
                    x++;
                });

                excelTemplates.forEach(template =>
                {
                    var option=document.createElement("option");
                    option.setAttribute("value",template.fileName);
                    option.innerHTML=template.nome;
                    selectScaricaTemplateExcel.appendChild(option);
                });
                getPopupGestioneTemplateExcel();
            }
        }
    });
}
function getPopupNuovoTemplateExcel()
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","dark-popup-outer-container");

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Nome";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("class","dark-popup-input");
    input.setAttribute("type","text");
    input.setAttribute("id","popupNuovoTemplateExcelNome");
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Descrizione";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var textarea=document.createElement("textarea");
    textarea.setAttribute("class","dark-popup-input");
    textarea.setAttribute("id","popupNuovoTemplateExcelDescrizione");
    row.appendChild(textarea);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="File";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("class","dark-popup-input");
    input.setAttribute("type","file");
    input.setAttribute("style","height:auto");
    input.setAttribute("id","popupNuovoTemplateExcelFile");
    row.appendChild(input);

    outerContainer.appendChild(row);
    
    var row=document.createElement("div");
    row.setAttribute("class","dark-popup-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:10px");

    var confirmButton=document.createElement("button");
    confirmButton.setAttribute("class","dark-popup-button");
    confirmButton.setAttribute("style","width:100%;");
    confirmButton.setAttribute("onclick","importaNuovoTemplateExcel()");
    confirmButton.innerHTML='<span>Conferma</span><i class="fal fa-check-circle"></i>';
    row.appendChild(confirmButton);    

    outerContainer.appendChild(row);

    Swal.fire
    ({
        background:"#404040",
        title:"Nuovo template",
        html:outerContainer.outerHTML,
        allowOutsideClick:true,
        showCloseButton:true,
        showConfirmButton:true,
        allowEscapeKey:true,
        showCancelButton:false,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                    document.getElementsByClassName("swal2-title")[0].style.fontSize="12px";
                    document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                    document.getElementsByClassName("swal2-title")[0].style.width="100%";
                    document.getElementsByClassName("swal2-title")[0].style.textDecoration="underline";
                    document.getElementsByClassName("swal2-close")[0].style.width="40px";
                    document.getElementsByClassName("swal2-close")[0].style.height="40px";
                    document.getElementsByClassName("swal2-title")[0].style.margin="0px";
                    document.getElementsByClassName("swal2-title")[0].style.marginTop="5px";
                    document.getElementsByClassName("swal2-title")[0].style.fontFamily="'Montserrat',sans-serif";
                    document.getElementsByClassName("swal2-title")[0].style.textAlign="left";
                    document.getElementsByClassName("swal2-confirm")[0].style.display="none";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingBottom="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingRight="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingLeft="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingTop="10px";
                    document.getElementsByClassName("swal2-header")[0].style.paddingLeft="20px";
                    document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-actions")[0].style.margin="0px";
                }
    });
}
function importaNuovoTemplateExcel()
{
    var nome=document.getElementById("popupNuovoTemplateExcelNome").value;
    var descrizione=document.getElementById("popupNuovoTemplateExcelDescrizione").value;
    var file=document.getElementById("popupNuovoTemplateExcelFile").files[0];

    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    if(nome=="" || nome==null || file==undefined && file==null)
    {
        Swal.fire
        ({
            icon:"error",
            background:"#404040",
            title: "Inserisci un nome e scegli un file",
            showCloseButton:true,
            showConfirmButton:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
        });
    }
    else
    {
        var data= new FormData();
        data.append('nome',nome);
        data.append('descrizione',descrizione);
        data.append('file',file);
        $.ajax
        ({
            url:'importaNuovoTemplateExcelCalcoloFabbisogno.php',
            data:data,
            processData:false,
            contentType:false,
            type:'POST',
            success:function(response)
                {
                    console.log(response);
                    if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                    {
                        Swal.fire({icon: 'error',title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    }
                    else
                    {
                        Swal.fire
                        ({
                            icon:'success',
                            title: 'Template importato',
                            background:"#404040",
                            showCloseButton: true,
                            showConfirmButton:false,
                            onOpen : function()
                                    {
                                        document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                                        document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
                                    }
                        }).then((result) => 
                        {
                            document.getElementById("btn_importazione_materiali").click();
                        });
                    }
                }
        });
    }
}
function getExcelTemplates()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getExcelTemplatesCalcoloFabbisogno.php",
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
async function getElencoFilesImportazioniFabbisogni()
{
    var id_utente=await getSessionValue("id_utente");

    var items=document.getElementsByClassName("file-importazioni-item");
    for (let index = 0; index < items.length; index++)
    {
        const item = items[index];
        item.style.border="";
    }
    document.getElementById("buttonTabellaDati").style.border="";
    document.getElementById("buttonTabellaDati").getElementsByTagName("span")[0].style.color="";
    document.getElementById("buttonTabellaDati").getElementsByTagName("i")[0].style.color="";

    document.getElementById("datiImportazioniFabbisogniOuterContainer").innerHTML="";

    var container=document.getElementById("fileImportazioniFabbisogniInnerContainer");
    container.innerHTML="";
    getFaSpinner(container,"container","Caricamento in corso...");

    commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;

    var select=document.getElementById("utenteSelectFileImportazioni");
    var options=[];
    var selectOptions=select.getElementsByTagName("option");
    for (let index = 0; index < selectOptions.length; index++)
    {
        const option = selectOptions[index];
        options.push(option.value);
    }
    
    var utenti=await getUtentiFilesImportazioniFabbisogni();

    if(!options.includes("*"))
    {
        var option=document.createElement("option");
        option.setAttribute("value","*");
        option.innerHTML="Tutti gli utenti";
        select.appendChild(option);
    }

    utenti.forEach(function(utente)
    {
        if(!options.includes(utente.id_utente.toString()))
        {
            var option=document.createElement("option");
            option.setAttribute("value",utente.id_utente);
            option.innerHTML=utente.username;
            select.appendChild(option);
        }
    });

    utenteSelectFileImportazioni=document.getElementById("utenteSelectFileImportazioni").value;
    var files=await getFilesImportazioniFabbisogni();

    removeFaSpinner("container");
    files.forEach(function(file)
    {
        var n=30;
        if(file.utente==id_utente)
            n+=30;
        if(file.versioni>0)
            n+=30;

        var item=document.createElement("div");
        item.setAttribute("class","file-importazioni-item");
        item.setAttribute("id","fileImportazioniItem"+file.id_file);

        var button=document.createElement("button");
        button.setAttribute("class","file-importazioni-item-button");
        button.setAttribute("style","width:calc(100% - 10px - "+n+"px)");
        button.setAttribute("onclick","getDatiFileImportazione("+file.id_file+")");

        var div=document.createElement("div");
        
        var span=document.createElement("span");
        span.setAttribute("style","color: #4C91CB;font-size:12px;font-weight:bold");
        span.innerHTML=file.nomeFile;
        div.appendChild(span);

        button.appendChild(div);

        var div=document.createElement("div");
        
        var span=document.createElement("span");
        span.setAttribute("style","color:black;font-size:10px");
        span.innerHTML=file.dataOra;
        div.appendChild(span);

        button.appendChild(div);

        item.appendChild(button);

        if(file.utente==id_utente)
        {
            var button=document.createElement("button");
            button.setAttribute("class","file-importazioni-item-icon-button");
            button.setAttribute("onclick","eliminaFileImportazioneFabbisogni("+file.id_file+",this.parentElement)");
            button.innerHTML="<i class='fad fa-trash'></i>";
            item.appendChild(button);
        }
        if(file.versioni>0)
        {
            var button=document.createElement("button");
            button.setAttribute("class","file-importazioni-item-icon-button");
            button.setAttribute("onclick","getPopupCronologiaFilesImportazioniFabbisogni('"+file.nomeFile+"')");
            button.innerHTML="<i class='fad fa-history'></i>";
            item.appendChild(button);
        }

        var a=document.createElement("a");
        a.setAttribute("href",mi_webapp_params.web_server_info.protocol+"://"+mi_webapp_params.web_server_info.ip+":"+mi_webapp_params.web_server_info.port+"/mi_ufficio_tecnico/files/calcoloFabbisogno/"+file.nomeFile);
        a.setAttribute("download",file.nomeFile);
        a.setAttribute("title","Scarica");
        a.setAttribute("class","file-importazioni-item-download-link");
        a.innerHTML='<i class="fad fa-download"></i>';
        item.appendChild(a);

        container.appendChild(item);
    });
}
async function getPopupCronologiaFilesImportazioniFabbisogni(nomeFile)
{
    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    var files=await getCronologiaFilesImportazioniFabbisogni(nomeFile);

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","popup-cambia-template-outer-container");

    var i=0;
    files.forEach(file => 
    {
        var item=document.createElement("div");
        item.setAttribute("class","popup-cambia-template-item");

        var div=document.createElement("div");

        var span=document.createElement("span");
        span.setAttribute("style","font-weight:bold");
        span.innerHTML="Versione "+file.versione;
        div.appendChild(span);

        var historyNomeFile=file.nomeFile.replace(".xlsx","")+"_"+file.versione+".xlsx";

        var a=document.createElement("a");
        a.setAttribute("href",mi_webapp_params.web_server_info.protocol+"://"+mi_webapp_params.web_server_info.ip+":"+mi_webapp_params.web_server_info.port+"/mi_ufficio_tecnico/files/calcoloFabbisogno/history/"+historyNomeFile);
        a.setAttribute("download",historyNomeFile);
        a.setAttribute("title","Scarica");
        a.setAttribute("style","margin-left:auto;margin-right:0px;color:#ddd");
        a.setAttribute("class","file-importazioni-item-download-link");
        a.innerHTML='<i class="fad fa-download"></i>';
        div.appendChild(a);

        item.appendChild(div);

        var div=document.createElement("div");

        var span=document.createElement("span");
        span.innerHTML=file.dataOra;
        div.appendChild(span);

        item.appendChild(div);

        outerContainer.appendChild(item);
        i++;
    });

    Swal.fire
    ({
        background:"#404040",
        title:"Storico file "+nomeFile,
        html:outerContainer.outerHTML,
        allowOutsideClick:true,
        showCloseButton:true,
        showConfirmButton:true,
        allowEscapeKey:true,
        showCancelButton:false,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                    document.getElementsByClassName("swal2-title")[0].style.fontSize="12px";
                    document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                    document.getElementsByClassName("swal2-title")[0].style.width="100%";
                    document.getElementsByClassName("swal2-close")[0].style.width="40px";
                    document.getElementsByClassName("swal2-close")[0].style.height="40px";
                    document.getElementsByClassName("swal2-title")[0].style.margin="0px";
                    document.getElementsByClassName("swal2-title")[0].style.marginTop="5px";
                    document.getElementsByClassName("swal2-title")[0].style.fontFamily="'Montserrat',sans-serif";
                    document.getElementsByClassName("swal2-title")[0].style.textAlign="left";
                    document.getElementsByClassName("swal2-confirm")[0].style.display="none";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingBottom="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingRight="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingLeft="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingTop="10px";
                    document.getElementsByClassName("swal2-header")[0].style.paddingLeft="20px";
                    document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-actions")[0].style.margin="0px";
                }
    });
}
function getCronologiaFilesImportazioniFabbisogni(nomeFile)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getCronologiaFilesImportazioniFabbisogni.php",{nomeFile},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
function eliminaFileImportazioneFabbisogni(id_file,item)
{
    Swal.fire
    ({
        icon:"warning",
        background:"#404040",
        title: "Eliminare il file e tutto il suo contenuto?",
        showCancelButton: true,
        confirmButtonColor: '#DA6969',
        cancelButtonColor: '#4C91CB',
        confirmButtonText: 'Elimina',
        cancelButtonText:"Annulla",
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    }).then((result) => 
    {
        if(result.value)
        {
            $.post("eliminaFileImportazioneFabbisogni.php",
            {
                id_file
            },
            function(response, status)
            {
                if(status=="success")
                {
                    if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                    {
                        console.log(response);
                        Swal.fire
                        ({
                            icon:"error",
                            title: "Errore. Impossibile eliminare il file. Se il problema persiste contatta l' amministratore.",
                            showCloseButton:true,
                            showConfirmButton:false,
                            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                        });
                    }
                    else
                    {
                        document.getElementById("datiImportazioniFabbisogniOuterContainer").innerHTML="";
                        item.remove();
                    }
                }
            });
        }
    });
}
async function getDatiFileImportazione(id_file)
{
    var items=document.getElementsByClassName("file-importazioni-item");
    for (let index = 0; index < items.length; index++)
    {
        const item = items[index];
        item.style.border="";
    }
    document.getElementById("buttonTabellaDati").style.border="";
    document.getElementById("buttonTabellaDati").getElementsByTagName("span")[0].style.color="";
    document.getElementById("buttonTabellaDati").getElementsByTagName("i")[0].style.color="";
    document.getElementById("fileImportazioniItem"+id_file).style.border="2px solid #4C91CB";

    var containerId="datiImportazioniFabbisogniOuterContainer";

    var container = document.getElementById(containerId);
    container.innerHTML="";

    var response=await getHotDataFileImportazione(id_file);

    var height=container.offsetHeight;

    if(response.data.length>0)
    {
        destroyHots();
        hot = new Handsontable
        (
            container,
            {
                data: response.data,
                rowHeaders: true,
                manualColumnResize: true,
                colHeaders: response.colHeaders,
                filters: true,
                dropdownMenu: true,
                headerTooltips: true,
                language: 'it-IT',
                contextMenu: true,
                width:"100%",
                columnSorting: true,
                height,
                columns:response.columns,
                beforeRemoveRow: () => 
                {
                    return false;
                },
                beforeCreateRow: () => 
                {
                    return false;
                },
                beforeChange: () => 
                {
                    return false;
                },
                afterDropdownMenuShow: (dropdownMenu) =>
                {
                    document.getElementsByClassName("htUIMultipleSelectSearch")[0].getElementsByTagName("input")[0].addEventListener("click", function()
                    {
                        document.getElementsByClassName("htUIClearAll")[0].getElementsByTagName("a")[0].click();
                    });
                }
            }
        );
        hideHotDisplayLicenceInfo();
        $(".handsontable .changeType").css
        ({
            "background": "#eee",
            "border-radius": "0",
            "border": "none",
            "color": "#404040",
            "font-size": "14px",
            "line-height": "normal",
            "padding": "0px",
            "margin": "0px",
            "float": "right"
        });
    }
}
function fixTable()
{
    try {
        var tableWidth=document.getElementById("datiFileImportazioneTable").offsetWidth-8;
        var tableColWidth=tableWidth/document.getElementById("datiFileImportazioneTable").getElementsByTagName("th").length;
        
        $("#datiFileImportazioneTable th").css({"width":tableColWidth+"px"});
        $("#datiFileImportazioneTable td").css({"width":tableColWidth+"px"});
    } catch (error) {}
}
function getHotDataFileImportazione(id_file)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getHotDataFileImportazione.php",{id_file},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
function getHotMaterialiCalcoloFabbisogno()
{
    return new Promise(function (resolve, reject) 
    {
        var id_commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;
        $.get("getHotMaterialiCalcoloFabbisogno.php",{id_commessa},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
function getDatiImportazioniFabbisogni(id_file)
{
    return new Promise(function (resolve, reject) 
    {
        $.post("getDatiImportazioniFabbisogni.php",
        {
            id_file
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                resolve("error");
        });
    });
}
function getFilesImportazioniFabbisogni()
{
    return new Promise(function (resolve, reject) 
    {
        $.post("getFilesImportazioniFabbisogni.php",
        {
            commessa,
            utente:utenteSelectFileImportazioni,
            orderBy
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                resolve("error");
        });
    });
}
function readExcelFile(input)
{
    if(input.files.length>0)
    {
        Swal.fire
        ({
            width:"100%",
            background:"transparent",
            title:"Caricamento in corso...",
            html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
            allowOutsideClick:false,
            showCloseButton:false,
            showConfirmButton:false,
            allowEscapeKey:false,
            showCancelButton:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
        });

        var excelFile=input.files[0];
        setTimeout(() =>
        {
            var reader = new FileReader();
            reader.onload = function(e)
            {
                var data = new Uint8Array(e.target.result);
                var workbook = XLSX.read(data, {type: 'array'});
                var worksheet = workbook.Sheets["dati"];

                if(worksheet==undefined)
                {
                    Swal.fire
                    ({
                        icon: 'error',
                        title: "Foglio dati mancante",
                        showCloseButton:true,
                        showConfirmButton:false,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                    });
                }
                else
                {
                    var letters=["A","B","C","D","E","F"];
                    var data = [];
                    var headers = [];
                    
                    letters.forEach(letter =>
                    {
                        headers.push((worksheet[letter+"1"] ? worksheet[letter+"1"].v : "").toString());
                    });

                    for (let index = 2; index < 10000; index++)
                    {
                        var row={};
                        letters.forEach(letter =>
                        {
                            row[(worksheet[letter+"1"] ? worksheet[letter+"1"].v : "").toString()]=(worksheet[letter+""+index] ? worksheet[letter+""+index].v : "").toString();
                        });
                        data.push(row);
                    }
                    
                    checkExcelFile(headers,data,excelFile.name,excelFile);
                }

                
            };
            reader.readAsArrayBuffer(excelFile);
        }, 1500);

    }
    //input.value=null;
}
async function checkExcelFile(headers,dirtyData,fileName,excelFile)
{
    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    materiali=await getMateriali();

    var error=false;
    var errorMessage="";
    var missingGruppi=[];
    var missingMateriali=[];

    if(headers.length!=6)
    {
        error=true;
        errorMessage="Numero colonne errato";
    }
    if(headers[0]!="commessa" || headers[1]!="gruppo" || headers[2]!="materiale" || headers[3]!="qnt" || headers[4]!="altezza_sviluppo" || headers[5]!="note")
    {
        error=true;
        errorMessage="Nomi o ordinamento colonne errati";
    }
    var data=[];
    dirtyData.forEach(row =>
    {
        if((row["commessa"]==undefined || row["commessa"]==null || row["commessa"]=="" || row["commessa"]=="0" || row["commessa"]==0 || row["commessa"]=="1" || row["commessa"]==1 || row["commessa"]==" " || row["commessa"].indexOf("#")>-1))
        {
            //riga con commessa vuota, da escludere
        }
        else
        {
            if((row["commessa"]==undefined || row["commessa"]==null || row["commessa"]=="" || row["commessa"]=="0" || row["commessa"]==0 || row["commessa"]=="1" || row["commessa"]==1 || row["commessa"]==" " || row["commessa"].indexOf("#")>-1) &&
                (row["gruppo"]==undefined || row["gruppo"]==null || row["gruppo"]=="" || row["gruppo"]=="0" || row["gruppo"]==0 || row["gruppo"]=="1" || row["gruppo"]==1 || row["gruppo"]==" " || row["gruppo"].indexOf("#")>-1) &&
                (row["materiale"]==undefined || row["materiale"]==null || row["materiale"]=="" || row["materiale"]=="0" || row["materiale"]==0 || row["materiale"]=="1" || row["materiale"]==1 || row["materiale"]==" " || row["materiale"].indexOf("#")>-1) &&
                (row["qnt"]==undefined || row["qnt"]==null || row["qnt"]=="" || row["qnt"]=="0" || row["qnt"]==0 || row["qnt"]=="1" || row["qnt"]==1 || row["qnt"]==" " || row["qnt"].indexOf("#")>-1))
            {
                //riga vuota, da escludere
            }
            else
            {
                if((row["commessa"]!==undefined && row["commessa"]!==null && row["commessa"]!=="" && row["commessa"]!=="0" && row["commessa"]!==0 && row["commessa"]!==" " || row["commessa"].indexOf("#")>-1) &&
                (row["gruppo"]==undefined || row["gruppo"]==null || row["gruppo"]=="" || row["gruppo"]=="0" || row["gruppo"]==0 || row["gruppo"]=="1" || row["gruppo"]==1 || row["gruppo"]==" " || row["gruppo"].indexOf("#")>-1) &&
                (row["materiale"]==undefined || row["materiale"]==null || row["materiale"]=="" || row["materiale"]=="0" || row["materiale"]==0 || row["materiale"]=="1" || row["materiale"]==1 || row["materiale"]==" " || row["materiale"].indexOf("#")>-1) &&
                (row["qnt"]==undefined || row["qnt"]==null || row["qnt"]=="" || row["qnt"]=="0" || row["qnt"]==0 || row["qnt"]=="1" || row["qnt"]==1 || row["qnt"]==" " || row["qnt"].indexOf("#")>-1))
                {
                    //riga contenente solo la commessa, da escludere
                }
                else
                {
                    row.qnt=parseFloat(row.qnt).toFixed(2);
                    data.push(row);
                }  
            }
        }
    });
    console.log(data);
    if(data.length==0)
    {
        error=true;
        errorMessage="File excel vuoto";
    }
    for (let index = 0; index < data.length; index++)
    {
        const row = data[index];
        if(row["commessa"]==undefined || row["commessa"]==null || row["commessa"]=="" || row["commessa"]=="0" || row["commessa"]==0 || row["commessa"]==" ")
        {
            error=true;
            errorMessage="Una o più commesse mancano o sono errate";
        }
        else
        {
            var found=await checkCommessa(row["commessa"]);
            if(found===false)
            {
                error=true;
                errorMessage="Commessa '"+row['commessa']+"' mancante";
            }
            else
                row['commessa']=found;
        }
        
    }
    for (let index = 0; index < data.length; index++)
    {
        const row = data[index];
        if(row["gruppo"]==undefined || row["gruppo"]==null || row["gruppo"]=="" || row["gruppo"]=="0" || row["gruppo"]==0 || row["gruppo"]==" ")
        {
            error=true;
            errorMessage="Uno o più gruppi mancano o sono errati";
        }
        else
        {
            var found=await checkGruppo(row["gruppo"]);
            if(found===false)
            {
                error=true;
                var push=true;
                missingGruppi.forEach(missingGruppo => 
                {
                    if(missingGruppo.value==row['gruppo'])
                        push=false;
                });
                if(push)
                {
                    var missingGruppo=
                    {
                        "value":row['gruppo'],
                        "table":"anagrafica_gruppi",
                        "column":"nome"
                    };
                    missingGruppi.push(missingGruppo);
                }
            }
            else
                row['gruppo']=found;
        }
    }
    for (let index = 0; index < data.length; index++)
    {
        const row = data[index];
        if(row["materiale"]==undefined || row["materiale"]==null || row["materiale"]=="" || row["materiale"]=="0" || row["materiale"]==0 || row["materiale"]==" ")
        {
            error=true;
            errorMessage="Uno o più materiali mancano o sono errati";
        }
        else
        {
            var found=await checkMateriale(row["materiale"]);
            if(found===false)
            {
                error=true;
                var push=true;
                missingMateriali.forEach(missingMateriale => 
                {
                    if(missingMateriale.value==row['materiale'])
                        push=false;
                });
                if(push)
                {
                    var missingMateriale=
                    {
                        "value":row['materiale'],
                        "table":"anagrafica_materiali",
                        "column":"nome"
                    };
                    missingMateriali.push(missingMateriale);
                }
            }
            else
                row['materiale']=found;
        }
    }
    var commesseM=[];
    data.forEach(function(row)
    {
        commesseM.push(row["commessa"]);
    });
    var commesse = [];
    $.each(commesseM, function(i, el){
        if($.inArray(el, commesse) === -1) commesse.push(el);
    });
    if(commesse.length>1)
    {
        error=true;
        errorMessage="Il file contiene più di una commessa";
    }
    if(error)
    {
        if(missingGruppi.length==0 && missingMateriali.length==0)
        {
            Swal.fire
            ({
                icon:"error",
                title: errorMessage,
                showCloseButton:true,
                showConfirmButton:false,
                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
            });
            document.getElementById("inputImportaExcel").value=null;
        }
        else
        {
            if(missingGruppi.length>0)
            {
                var nomi=[];
                missingGruppi.forEach(missingGruppo =>
                {
                    nomi.push(missingGruppo.value);
                });

                var showConfirmButton=true;
                var title="I seguenti gruppi non sono stati trovati";
                var popupOuterHtml="["+nomi.join("]<br>[")+"]";
                
                Swal.fire
                ({
                    icon:"error",
                    title,
                    html:popupOuterHtml,
                    showCloseButton:true,
                    showConfirmButton,
                    confirmButtonText:"Aggiungi gruppi",
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";document.getElementById("swal2-content").style.fontWeight="bold"}
                }).then((result) => 
                {
                    if(result.value)
                        aggiungiAnagraficheImportazioneFabbisogno(missingGruppi);
                    else
                        document.getElementById("inputImportaExcel").value=null;
                });
            }
            else
            {
                var raggruppamenti=await getRaggruppamenti();

                var commesseLcl=await getCommesse();
                var commessaObj=getFirstObjByPropValue(commesseLcl,"id_commessa",commesse[0]);

                var title="Materiali non trovati per la commessa "+commessaObj.nome;

                var outerContainer=document.createElement("div");
                outerContainer.setAttribute("class","popup-missing-materiali-outer-container");

                var i=0;
                missingMateriali.forEach(missingMateriale => 
                {
                    var row=document.createElement("div");
                    row.setAttribute("class","popup-missing-materiali-row");
                    if(i!=missingMateriali.length-1)
                    row.setAttribute("style","border-bottom: 1px solid gray;padding-bottom: 10px;");

                    var span=document.createElement("span");
                    span.setAttribute("class","popup-missing-materiali-row-span");
                    span.setAttribute("title",missingMateriale.value);
                    span.innerHTML=missingMateriale.value;
                    row.appendChild(span);

                    var button=document.createElement("div");
                    button.setAttribute("onclick","this.style.borderColor='#4C91CB';document.getElementById('selectRinominaMateriale"+i+"').style.borderColor=''");
                    button.setAttribute("id","buttonRinominaMateriale"+i);
                    button.setAttribute("class","popup-missing-materiali-row-div-button");
                    button.setAttribute("style","border-color:#4C91CB;width: 250px;");
                    button.setAttribute("materiale",missingMateriale.value);
                    var span=document.createElement("span");
                    span.setAttribute("style","width:calc(100% - 180px);white-space: nowrap;overflow: hidden;text-overflow: ellipsis;");
                    span.innerHTML="Aggiungi";
                    button.appendChild(span);
                    var input=document.createElement("input");
                    input.setAttribute("type","text");
                    input.setAttribute("placeholder","u.m.");
                    input.setAttribute("id","inputAggiungiMateriale"+i);
                    button.appendChild(input);
                    var select=document.createElement("select");
                    select.setAttribute("id","selectAggiungiMateriale"+i);
                    raggruppamenti.forEach(raggruppamento =>
                    {
                        var option=document.createElement("option");
                        option.setAttribute("value",raggruppamento.id_raggruppamento);
                        option.innerHTML="Famiglia: "+raggruppamento.nome;
                        select.appendChild(option);
                    });
                    button.appendChild(select);
                    row.appendChild(button);

                    var span=document.createElement("span");
                    span.setAttribute("style","width:50px;margin-left:10px");
                    span.innerHTML="Oppure";
                    row.appendChild(span);

                    var select=document.createElement("select");
                    select.setAttribute("style","width: 200px;");
                    select.setAttribute("id","selectRinominaMateriale"+i);
                    select.setAttribute("class","select-rinomina-materiale");
                    select.setAttribute("materiale",missingMateriale.value);
                    select.setAttribute("onchange","this.style.borderColor='#4C91CB';document.getElementById('buttonRinominaMateriale"+i+"').style.borderColor=''");
                    var option=document.createElement("option");
                    option.setAttribute("disabled","disabled");
                    option.setAttribute("selected","selected");
                    option.innerHTML="Rinomina materiale";
                    select.appendChild(option);
                    materiali.forEach(materiale => 
                    {
                        var option=document.createElement("option");
                        option.setAttribute("value",materiale.id_materiale);
                        option.innerHTML="Rinomina "+materiale.nome;
                        select.appendChild(option);
                    });
                    row.appendChild(select);
                    
                    outerContainer.appendChild(row);
                    i++;
                });

                var button=document.createElement("button");
                button.setAttribute("onclick","checkMaterialiMancanti(this,"+i+")");
                button.setAttribute("id","buttonConfermaMaterialiMancanti");
                button.innerHTML="<span>Conferma</span>";
                outerContainer.appendChild(button);

                Swal.fire
                ({
                    background:"#404040",
                    width:"50%",
                    title,
                    html:outerContainer.outerHTML,
                    allowOutsideClick:true,
                    showCloseButton:true,
                    showConfirmButton:true,
                    allowEscapeKey:true,
                    showCancelButton:false,
                    onOpen : function()
                            {
                                document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                                document.getElementsByClassName("swal2-title")[0].style.fontSize="12px";
                                document.getElementsByClassName("swal2-title")[0].style.color="white";
                                document.getElementsByClassName("swal2-title")[0].style.width="100%";
                                document.getElementsByClassName("swal2-close")[0].style.width="40px";
                                document.getElementsByClassName("swal2-close")[0].style.height="40px";
                                document.getElementsByClassName("swal2-title")[0].style.margin="0px";
                                document.getElementsByClassName("swal2-title")[0].style.marginTop="5px";
                                document.getElementsByClassName("swal2-title")[0].style.fontFamily="'Montserrat',sans-serif";
                                document.getElementsByClassName("swal2-title")[0].style.textAlign="left";
                                document.getElementsByClassName("swal2-confirm")[0].style.display="none";
                                document.getElementsByClassName("swal2-popup")[0].style.paddingBottom="0px";
                                document.getElementsByClassName("swal2-popup")[0].style.paddingRight="0px";
                                document.getElementsByClassName("swal2-popup")[0].style.paddingLeft="0px";
                                document.getElementsByClassName("swal2-popup")[0].style.paddingTop="10px";
                                document.getElementsByClassName("swal2-header")[0].style.paddingLeft="20px";
                                document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                                document.getElementsByClassName("swal2-actions")[0].style.margin="0px";
                            }
                }).then((result) => 
                {
                    if(result.value)
                    {

                    }
                    else
                        document.getElementById("inputImportaExcel").value=null;
                });
            }
        }
    }
    else
    {
        var checkStoricoResponse=await checkStoricoExcelFile(excelFile.name);
        if(checkStoricoResponse.toLowerCase().indexOf("error")>-1 || checkStoricoResponse.toLowerCase().indexOf("notice")>-1 || checkStoricoResponse.toLowerCase().indexOf("warning")>-1)
        {
            console.log(checkStoricoResponse);
            Swal.fire
            ({
                icon:"error",
                title: "Errore. Impossibile caricare il file. Se il problema persiste contatta l' amministratore.",
                showCloseButton:true,
                showConfirmButton:false,
                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
            });
        }
        else
        {
            var uploadResponse=await uploadExcelFile(excelFile);
            if(uploadResponse.toLowerCase().indexOf("error")>-1 || uploadResponse.toLowerCase().indexOf("notice")>-1 || uploadResponse.toLowerCase().indexOf("warning")>-1)
            {
                console.log(uploadResponse);
                Swal.fire
                ({
                    icon:"error",
                    title: "Errore. Impossibile caricare il file. Se il problema persiste contatta l' amministratore.",
                    showCloseButton:true,
                    showConfirmButton:false,
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                });
            }
            else
            {
                var arrayResponse=JSON.parse(uploadResponse)
                var id_file=arrayResponse.id_file;
                var dataOra=arrayResponse.dataOra.date;
                
                var insertResponse=await insertExcelData(data,headers,id_file,dataOra);
                if(insertResponse.toLowerCase().indexOf("error")>-1 || insertResponse.toLowerCase().indexOf("notice")>-1 || insertResponse.toLowerCase().indexOf("warning")>-1)
                {
                    console.log(insertResponse);
                    Swal.fire
                    ({
                        icon:"error",
                        title: "Errore. Il file è stato importato ma non è stato possibile inserire i dati. Ricontrolla il contenuto del file. Se il problema persiste contatta l' amministratore.",
                        showCloseButton:true,
                        showConfirmButton:false,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                    });
                }
                else
                {
                    document.getElementById("inputImportaExcel").value=null;
                    Swal.fire
                    ({
                        icon:"success",
                        title: "File importato",
                        showCloseButton:true,
                        showConfirmButton:false,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                    }).then((result) => 
                    {
                        document.getElementById("selectCommessaCalcoloFabbisogno").value=commesse[0];
                        getView();
                    });
                }
            }
        }
        document.getElementById("inputImportaExcel").value=null;
    }

    var button=document.getElementById("buttonImportaExcel");
    var icon=button.getElementsByTagName("i")[0];
    icon.className="fad fa-upload";
}
async function checkMaterialiMancanti(button,i)
{
    var errorUm=false;
    for (let index = 0; index < i; index++)
    {
        var element=document.getElementById("buttonRinominaMateriale"+index);
        var materiale=element.getAttribute("materiale");
        if(element.style.borderColor=="rgb(76, 145, 203)")
        {
            var um=document.getElementById("inputAggiungiMateriale"+index).value;
            if(um=="")
            {
                errorUm=true;
            }
        }
    }

    if(errorUm)
    {
        Swal.fire
        ({
            icon:"error",
            title: "Errore. Inserisci l'unità di misura",
            showCloseButton:true,
            showConfirmButton:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
        }).then((result) => 
        {
            readExcelFile(document.getElementById("inputImportaExcel"));
        });
    }
    else
    {
        button.innerHTML="<i class='fad fa-spinner-third fa-spin'></i>";
        button.disabled=true;

        var errorCheckMaterialiMancanti=false;

        for (let index = 0; index < i; index++)
        {
            var element=document.getElementById("buttonRinominaMateriale"+index);
            var materiale=element.getAttribute("materiale");
            if(element.style.borderColor=="rgb(76, 145, 203)")
            {
                var um=document.getElementById("inputAggiungiMateriale"+index).value;
                var id_raggruppamento=document.getElementById("selectAggiungiMateriale"+index).value;
                var response=await aggiungiAnagraficaMaterialeImportazioneFabbisogno(materiale,um,id_raggruppamento);
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                    errorCheckMaterialiMancanti=true;
            }
            else
            {
                var response=await aggiornaAnagraficaImportazioneFabbisogno(materiale,document.getElementById("selectRinominaMateriale"+index).value);
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                    errorCheckMaterialiMancanti=true;
            }
        }

        if(errorCheckMaterialiMancanti)
        {
            Swal.fire
            ({
                icon:"error",
                title: "Errore. Impossibile caricare il file. Se il problema persiste contatta l' amministratore.",
                showCloseButton:true,
                showConfirmButton:false,
                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
            });
            document.getElementById("inputImportaExcel").value=null;
        }
        else
            readExcelFile(document.getElementById("inputImportaExcel"));
    }
    
}
function aggiornaAnagraficaImportazioneFabbisogno(value,id)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("aggiornaAnagraficaImportazioneFabbisogno.php",
        {
            value,id
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(response);
            }
        });
    });
}
async function aggiungiAnagraficheImportazioneFabbisogno(missingGruppi)
{
    var errorAggiungiAnagrafica=false;
    for (let index = 0; index < missingGruppi.length; index++) 
    {
        const missingGruppo = missingGruppi[index];
        var response=await aggiungiAnagraficaImportazioneFabbisogno(missingGruppo.value,missingGruppo.table,missingGruppo.column);
        if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            errorAggiungiAnagrafica=true;
    }
    if(errorAggiungiAnagrafica)
    {
        Swal.fire
        ({
            icon:"error",
            title: "Errore. Impossibile caricare il file. Se il problema persiste contatta l' amministratore.",
            showCloseButton:true,
            showConfirmButton:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
        });
        document.getElementById("inputImportaExcel").value=null;
    }
    else
        readExcelFile(document.getElementById("inputImportaExcel"));
}
function aggiungiAnagraficaMaterialeImportazioneFabbisogno(materiale,um,id_raggruppamento)
{
    return new Promise(function (resolve, reject) 
    {
        var id_commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;
        $.get("aggiungiAnagraficaMaterialeImportazioneFabbisogno.php",
        {
            materiale,um,id_commessa,id_raggruppamento
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(response);
            }
        });
    });
}
function aggiungiAnagraficaImportazioneFabbisogno(missingValue,missingTable,missingColumn)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("aggiungiAnagraficaImportazioneFabbisogno.php",
        {
            missingValue,missingTable,missingColumn
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(response);
            }
        });
    });
}
function checkStoricoExcelFile(fileName)
{
    return new Promise(function (resolve, reject) 
    {
        $.post("checkStoricoExcelFileCalcoloFabbisogno.php",
        {
            fileName
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(response);
            }
            else
                resolve("error");
        });
    });
}
function insertExcelData(data,headers,id_file,dataOra)
{
    return new Promise(function (resolve, reject) 
    {
        var JSONdata=JSON.stringify(data);
        var JSONheaders=JSON.stringify(headers);
        $.post("insertExcelDataCalcoloFabbisogno.php",
        {
            JSONdata,
            JSONheaders,
            id_file,
            dataOra
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(response);
            }
            else
                resolve("error");
        });
    });
}
function uploadExcelFile(excelFile)
{
    return new Promise(function (resolve, reject) 
    {
        var data= new FormData();
        data.append('excelFile',excelFile);
        $.ajax
        ({
            url:'uploadExcelFileCalcoloFabbisogno.php',
            data:data,
            processData:false,
            contentType:false,
            type:'POST',
            success:function(response){resolve(response);}
        });
    });
}
function searchFileImportazioni(input)
{
    var value=input.value;
    $(".file-importazioni-item").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
}
async function getPopupRichiestaMateriale(id_richiesta,id_materiale)
{
    var materiali=await getMateriali();
    if(materiali.length==0)
    {
        Swal.fire
        ({
            icon:"warning",
            title:"Nessun materiale inserito per questa commessa",
            allowOutsideClick:true,
            showCloseButton:true,
            showConfirmButton:false,
            allowEscapeKey:true,
            showCancelButton:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="black";}
        });
    }
    else
    {
        var commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;
        var commessaObj=getFirstObjByPropValue(commesse,"id_commessa",commessa);

        if(id_richiesta==undefined)
        {
            var id_richiesta=await creaNuovaRichiesta(commessa);
        }

        var richieste=await getRichiesteMateriali(commessa);
        
        var richiesta_selezionata=getFirstObjByPropValue(richieste,"id_richiesta",id_richiesta);
        var title="Richiesta #"+id_richiesta;

        Swal.fire
        ({
            width:"100%",
            background:"transparent",
            title:"Caricamento in corso...",
            html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
            allowOutsideClick:false,
            showCloseButton:false,
            showConfirmButton:false,
            allowEscapeKey:false,
            showCancelButton:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
        });

        //-----------------------------------------------------------------------------------------------------------------
        var outerContainer=document.createElement("div");
        outerContainer.setAttribute("class","dark-popup-outer-container");

        var row=document.createElement("div");
        
        row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
        row.innerHTML="Commessa";
        outerContainer.appendChild(row);

        var row=document.createElement("div");
        row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

        var select=document.createElement("select");
        select.setAttribute("class","dark-popup-select");
        select.setAttribute("disabled","disabled");

        var option=document.createElement("option");
        option.innerHTML=commessaObj.nome;
        select.appendChild(option);
        
        row.appendChild(select);

        outerContainer.appendChild(row);

        var row=document.createElement("div");
        
        row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
        row.innerHTML="Tipo";
        outerContainer.appendChild(row);

        var row=document.createElement("div");
        row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

        var select=document.createElement("select");
        select.setAttribute("class","dark-popup-select");
        select.setAttribute("id","popupNuovaRichiestaTipo");

        var option=document.createElement("option");
        option.setAttribute("value","");
        option.setAttribute("selected","selected");
        option.innerHTML="Scegli";
        select.appendChild(option);
        
        var option=document.createElement("option");
        option.setAttribute("value","pax");
        if(richiesta_selezionata.tipo=="pax")
            option.setAttribute("selected","selected");
        option.innerHTML="Pax";
        select.appendChild(option);

        var option=document.createElement("option");
        option.setAttribute("value","crew");
        if(richiesta_selezionata.tipo=="crew")
            option.setAttribute("selected","selected");
        option.innerHTML="Crew";
        select.appendChild(option);

        row.appendChild(select);

        outerContainer.appendChild(row);

        var row=document.createElement("div");
        
        row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
        row.innerHTML="Note";
        outerContainer.appendChild(row);

        var row=document.createElement("div");
        row.setAttribute("style","width:100%;justify-content:flex-start;padding-bottom:20px;box-sizing:border-box;border-bottom:1px solid gray");

        var textarea=document.createElement("textarea");
        textarea.setAttribute("class","dark-popup-textarea");
        textarea.setAttribute("id","popupNuovaRichiestaTextareaNote");
        if(richiesta_selezionata.note!=undefined)
            textarea.innerHTML=richiesta_selezionata.note;
        
        row.appendChild(textarea);

        outerContainer.appendChild(row);

        //-----------------------------------------------------------------------------------------------------------------

        var row=document.createElement("div");
        row.setAttribute("class","popup-nuova-richiesta-row");
        row.setAttribute("id","popupNuovaRichiestaMaterialiAggiuntiContainer");
        row.setAttribute("style","width:100%;max-height:200px;overflow-y:auto;bpx-sizing:border-box;margin-top:20px;margin-bottom:10px;");

        if(richiesta_selezionata.dettagli!=undefined)
        {
            if(richiesta_selezionata.dettagli.length>0)
            {
                var table=document.createElement("table");
                table.setAttribute("id","popupNuovaRichiestaTable");

                var thead=document.createElement("thead");
                var tr=document.createElement("tr");

                var th=document.createElement("th");
                th.setAttribute("style","border-top-left-radius: 4px;");
                th.innerHTML="Materiale";
                tr.appendChild(th);

                var th=document.createElement("th");
                th.innerHTML="Quantità";
                tr.appendChild(th);

                var th=document.createElement("th");
                th.innerHTML="Gruppo";
                tr.appendChild(th);

                var th=document.createElement("th");
                th.innerHTML="Foglio largo";
                tr.appendChild(th);

                var th=document.createElement("th");
                th.innerHTML="N. fogli";
                tr.appendChild(th);

                var th=document.createElement("th");
                th.innerHTML="Foglio stretto";
                tr.appendChild(th);

                var th=document.createElement("th");
                th.innerHTML="N. fogli";
                tr.appendChild(th);

                var th=document.createElement("th");
                th.setAttribute("style","border-top-right-radius: 4px;width:30px;padding:0px");
                tr.appendChild(th);

                thead.appendChild(tr);
                table.appendChild(thead);

                var tbody=document.createElement("tbody");

                richiesta_selezionata.dettagli.forEach(riga_dettagli_richieste =>
                {
                    $("#popupNuovaRichiestaTable td").css({"border-bottom-right-radius":"","border-bottom-left-radius":""})

                    var tr=document.createElement("tr");

                    var td=document.createElement("td");
                    td.setAttribute("style","border-bottom-left-radius: 4px;");
                    td.setAttribute("id_materiale",riga_dettagli_richieste.id_materiale);
                    td.innerHTML=riga_dettagli_richieste.nome_materiale;
                    tr.appendChild(td);

                    var td=document.createElement("td");
                    td.innerHTML=riga_dettagli_richieste.qnt+" "+riga_dettagli_richieste.um;
                    tr.appendChild(td);

                    var td=document.createElement("td");
                    td.setAttribute("id_gruppo",riga_dettagli_richieste.id_gruppo);
                    td.innerHTML=riga_dettagli_richieste.nome_gruppo;
                    tr.appendChild(td);

                    var td=document.createElement("td");
                    if(riga_dettagli_richieste.calcolo_progettato_alternativo=="true")
                    {
                        if(riga_dettagli_richieste.id_formato_1==null)
                            td.setAttribute("id_formato_1","");
                        else
                        {
                            td.setAttribute("id_formato_1",riga_dettagli_richieste.id_formato_1);
                                td.innerHTML=riga_dettagli_richieste.codice_1+" ("+riga_dettagli_richieste.altezza_1+"x"+riga_dettagli_richieste.larghezza_1+")";
                        }
                    }
                    tr.appendChild(td);

                    var td=document.createElement("td");
                    if(riga_dettagli_richieste.calcolo_progettato_alternativo=="true")
                        td.innerHTML=riga_dettagli_richieste.qnt_formato_1;
                    tr.appendChild(td);

                    var td=document.createElement("td");
                    if(riga_dettagli_richieste.calcolo_progettato_alternativo=="true")
                    {
                        if(riga_dettagli_richieste.id_formato_2==null)
                            td.setAttribute("id_formato_2","");
                        else
                        {
                            td.setAttribute("id_formato_2",riga_dettagli_richieste.id_formato_2);
                                td.innerHTML=riga_dettagli_richieste.codice_2+" ("+riga_dettagli_richieste.altezza_2+"x"+riga_dettagli_richieste.larghezza_2+")";
                        }
                    }
                    tr.appendChild(td);

                    var td=document.createElement("td");
                    if(riga_dettagli_richieste.calcolo_progettato_alternativo=="true")
                        td.innerHTML=riga_dettagli_richieste.qnt_formato_2;
                    tr.appendChild(td);

                    var td=document.createElement("td");
                    td.setAttribute("style","border-bottom-right-radius: 4px;width:30px;padding:0px");
                    var button=document.createElement("button");
                    button.setAttribute("onclick","rimuoviRigaDettagliRichiestaMateriale("+riga_dettagli_richieste.id_dettaglio+",this.parentElement.parentElement)");
                    button.innerHTML="<i class='fad fa-trash'></i>";
                    td.appendChild(button);
                    tr.appendChild(td);

                    tbody.appendChild(tr);
                });
                
                table.appendChild(tbody);

                row.appendChild(table);
            }
            else
            {
                var span=document.createElement("span");
                span.setAttribute("class","popup-nuova-richiesta-span");
                span.setAttribute("style","color:#ddd");
                span.innerHTML="Nessun materiale aggiunto";
                row.appendChild(span);
            }
        }
        else
        {
            var span=document.createElement("span");
            span.setAttribute("class","popup-nuova-richiesta-span");
            span.setAttribute("style","color:#ddd");
            span.innerHTML="Nessun materiale aggiunto";
            row.appendChild(span);
        }

        outerContainer.appendChild(row);

        //-----------------------------------------------------------------------------------------------------------------

        var row=document.createElement("div");
        row.setAttribute("class","popup-nuova-richiesta-row");
        row.setAttribute("style","height:30px;flex-direction:row;align-items:center;justify-content:flex-start;border-top:1px solid gray;margin-top:10px;box-sizing:border-box;padding-top:30px");

        var span=document.createElement("span");
        span.setAttribute("class","popup-nuova-richiesta-span");
        span.setAttribute("style","color:#ddd;width:60px;text-align:left");
        span.innerHTML="Materiale: ";
        row.appendChild(span);

        var select=document.createElement("select");
        select.setAttribute("class","dark-popup-select");
        select.setAttribute("id","selectMaterialePopupNuovaRichiesta");
        select.setAttribute("style","width:225px;margin-left:5px");
        select.setAttribute("onchange","checkMaterialePopupNuovaRichiesta(this.value);getTotaliMaterialePopupNuovaRichiesta()");

        materiali=await getMateriali();

        materiali.forEach(function(materiale)
        {
            var option=document.createElement("option");
            if(parseInt(id_materiale)==parseInt(materiale.id_materiale))
                option.setAttribute("selected","selected");
            option.setAttribute("value",materiale.id_materiale);
            option.innerHTML=materiale.nome+" ("+materiale.um+")";
            select.appendChild(option);
        });

        row.appendChild(select);

        var span=document.createElement("span");
        span.setAttribute("class","popup-nuova-richiesta-span");
        span.setAttribute("style","margin-left: auto;color:#ddd;text-align:left");
        span.innerHTML="Quantità: ";
        row.appendChild(span);

        var input=document.createElement("input");
        input.setAttribute("type","number");
        input.setAttribute("id","popupNuovaRichiestaQnt");
        input.setAttribute("class","dark-popup-input");
        input.setAttribute("onkeyup","calcolaFormatiLamiera()");
        input.setAttribute("onchange","calcolaFormatiLamiera()");
        input.setAttribute("style","width: 80px;margin-left:5px");
        row.appendChild(input);

        outerContainer.appendChild(row);

        //--------------------------------------------------------------------------------------------------

        var row=document.createElement("div");
        row.setAttribute("class","popup-nuova-richiesta-row");
        row.setAttribute("style","height:30px;flex-direction:row;align-items:center;justify-content:flex-start;margin-top:10px;box-sizing:border-box;padding-top:20px");

        var span=document.createElement("span");
        span.setAttribute("class","popup-nuova-richiesta-span");
        span.setAttribute("style","color:#ddd;width:60px;text-align:left");
        span.innerHTML="Gruppo: ";
        row.appendChild(span);

        var select=document.createElement("select");
        select.setAttribute("class","dark-popup-select");
        select.setAttribute("id","selectGruppoPopupNuovaRichiesta");
        select.setAttribute("onchange","getTotaliMaterialePopupNuovaRichiesta()");
        select.setAttribute("style","width:100px;margin-left:5px");

        var gruppi=await getGruppi();
        gruppi.forEach(function(gruppo)
        {
            var option=document.createElement("option");
            option.setAttribute("value",gruppo.id_gruppo);
            option.innerHTML=gruppo.nome;
            select.appendChild(option);
        });

        row.appendChild(select);

        var div=document.createElement("div");
        div.setAttribute("style","display:flex;flex-direction:row;align-items:center;justify-content:flex-start;margin-left:auto");
        var span=document.createElement("span");
        span.setAttribute("id","popupNuovaRichiestaTotaleCalcolato");
        div.appendChild(span);
        var span=document.createElement("span");
        span.setAttribute("id","popupNuovaRichiestaTotaleRichiesto");
        div.appendChild(span);
        row.appendChild(div);

        outerContainer.appendChild(row);

        //--------------------------------------------------------------------------------------------------

        var row=document.createElement("div");
        row.setAttribute("class","popup-nuova-richiesta-row popup-nuova-richiesta-lamiera-item");
        row.setAttribute("style","height:30px;flex-direction:row;align-items:center;justify-content:flex-start;margin-top:10px;box-sizing:border-box;padding-top:20px;display:none;");

        var span=document.createElement("span");
        span.setAttribute("class","popup-nuova-richiesta-span");
        span.setAttribute("style","color:#ddd;text-align:left;text-decoration:underline");
        span.innerHTML="Calcolo formati lamiera";
        row.appendChild(span);

        var span=document.createElement("span");
        span.setAttribute("class","popup-nuova-richiesta-span");
        span.setAttribute("style","margin-left: auto;color:#ddd;text-align:left");
        span.innerHTML="Foglio largo: ";
        row.appendChild(span);

        var select=document.createElement("select");
        select.setAttribute("class","dark-popup-select");
        select.setAttribute("id","select1xPopupNuovaRichiesta");
        select.setAttribute("style","width:175px;margin-left:5px");
        select.setAttribute("onchange","if(this.value=='aggiungi'){Swal.close();getMascheraFormatiLamiere()}else{calcolaFormatiLamiera()}");

        row.appendChild(select);

        var span=document.createElement("span");
        span.setAttribute("class","popup-nuova-richiesta-span");
        span.setAttribute("style","margin-left: 10px;color:#ddd;width:45px;text-align:left");
        span.innerHTML="N. fogli: ";
        row.appendChild(span);

        var input=document.createElement("input");
        input.setAttribute("type","number");
        input.setAttribute("id","popupNuovaRichiestaFogli1");
        input.setAttribute("class","dark-popup-input");
        input.setAttribute("style","width: 60px;margin-left:5px;");
        row.appendChild(input);

        outerContainer.appendChild(row);

        var row=document.createElement("div");
        row.setAttribute("class","popup-nuova-richiesta-row popup-nuova-richiesta-lamiera-item");
        row.setAttribute("style","height:30px;flex-direction:row;align-items:center;justify-content:flex-start;margin-top:10px;box-sizing:border-box;padding-top:20px;display:none;");

        var span=document.createElement("span");
        span.setAttribute("class","popup-nuova-richiesta-span");
        span.setAttribute("style","color:#ddd;text-align:left");
        span.innerHTML="Percentuale foglio stretto: ";
        row.appendChild(span);

        var input=document.createElement("input");
        input.setAttribute("type","number");
        input.setAttribute("id","popupNuovaRichiestaPercentuale");
        input.setAttribute("value","65");
        input.setAttribute("class","dark-popup-input");
        input.setAttribute("onkeyup","calcolaFormatiLamiera()");
        input.setAttribute("onchange","calcolaFormatiLamiera()");
        input.setAttribute("style","width: 65px;margin-left:5px;margin-right:10px");
        row.appendChild(input);

        var span=document.createElement("span");
        span.setAttribute("class","popup-nuova-richiesta-span");
        span.setAttribute("style","margin-left: auto;color:#ddd;text-align:left");
        span.innerHTML="Foglio stretto: ";
        row.appendChild(span);

        var select=document.createElement("select");
        select.setAttribute("class","dark-popup-select");
        select.setAttribute("id","select2xPopupNuovaRichiesta");
        select.setAttribute("style","width:175px;margin-left:5px");
        select.setAttribute("onchange","if(this.value=='aggiungi'){Swal.close();getMascheraFormatiLamiere()}else{calcolaFormatiLamiera()}");

        row.appendChild(select);

        var span=document.createElement("span");
        span.setAttribute("class","popup-nuova-richiesta-span");
        span.setAttribute("style","margin-left: 10px;color:#ddd;width:45px;text-align:left");
        span.innerHTML="N. fogli: ";
        row.appendChild(span);

        var input=document.createElement("input");
        input.setAttribute("type","number");
        input.setAttribute("id","popupNuovaRichiestaFogli2");
        input.setAttribute("class","dark-popup-input");
        input.setAttribute("style","width: 60px;margin-left:5px;");
        row.appendChild(input);

        outerContainer.appendChild(row);

        //--------------------------------------------------------------------------------------------------

        var row=document.createElement("div");
        row.setAttribute("class","popup-nuova-richiesta-row");
        row.setAttribute("style","flex-direction:row;align-items:center;justify-content:flex-start;margin-top:30px");

        var button=document.createElement("button");
        button.setAttribute("class","popup-nuova-richiesta-button");
        button.setAttribute("style","width:100%");
        button.setAttribute("onclick","aggiungiMaterialeRichiesta(this.getElementsByTagName('i')[0],"+id_richiesta+")");
        button.innerHTML='<span>Aggiungi materiale</span><i class="fas fa-plus-circle"></i>';
        row.appendChild(button);

        outerContainer.appendChild(row);

        //--------------------------------------------------------------------------------------------------

        Swal.fire
        ({
            background:"#404040",
            width:"750px",
            title,
            html:outerContainer.outerHTML,
            allowOutsideClick:false,
            showCloseButton:true,
            showConfirmButton:true,
            allowEscapeKey:false,
            showCancelButton:false,
            onOpen : function()
                    {
                        document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                        document.getElementsByClassName("swal2-title")[0].style.fontSize="12px";
                        document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                        document.getElementsByClassName("swal2-title")[0].style.width="100%";
                        document.getElementsByClassName("swal2-title")[0].style.textDecoration="underline";
                        document.getElementsByClassName("swal2-close")[0].style.width="40px";
                        document.getElementsByClassName("swal2-close")[0].style.height="40px";
                        document.getElementsByClassName("swal2-title")[0].style.margin="0px";
                        document.getElementsByClassName("swal2-title")[0].style.marginTop="5px";
                        document.getElementsByClassName("swal2-title")[0].style.fontFamily="'Montserrat',sans-serif";
                        document.getElementsByClassName("swal2-title")[0].style.textAlign="left";
                        document.getElementsByClassName("swal2-confirm")[0].style.display="none";
                        document.getElementsByClassName("swal2-popup")[0].style.paddingBottom="0px";
                        document.getElementsByClassName("swal2-popup")[0].style.paddingRight="0px";
                        document.getElementsByClassName("swal2-popup")[0].style.paddingLeft="0px";
                        document.getElementsByClassName("swal2-popup")[0].style.paddingTop="10px";
                        document.getElementsByClassName("swal2-header")[0].style.paddingLeft="20px";
                        document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                        document.getElementsByClassName("swal2-actions")[0].style.margin="0px";

                        $("#selectMaterialePopupNuovaRichiesta").multipleSelect(
                        {
                            single:true,
                            onAfterCreate: function () 
                                    {
                                        $(".ms-choice").css({"height":"30px","line-height":"30px","background-color":"transparent","border":"none"});
                                        $(".ms-choice span").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left","color":"#ddd"});
                                        document.getElementById("selectMaterialePopupNuovaRichiesta").style.width="220px";
                                        $(".ms-parent").css({"margin-left":"5px"});
                                        setTimeout(() => {
                                            checkMaterialePopupNuovaRichiesta(document.getElementById("selectMaterialePopupNuovaRichiesta").value);
                                            getTotaliMaterialePopupNuovaRichiesta();
                                        }, 100);
                                    },
                            onOpen:function()
                            {
                                $(".ms-search input").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                                $(".optgroup").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                                $(".ms-drop ul").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                            },
                            filter:true,
                            filterPlaceholder:"Cerca...",
                            locale:"it-IT"
                        });
                    }
        }).then((result) => 
        {
            $.get("cleanRichiesteVuote.php",
            function(response, status)
            {
                if(status=="success")
                {
                    console.log(response);
                    if(view=="richieste_materiali")
                        getElencoRichiesteMateriali();
                    if(view=="statistiche_materiali")
                        getStatisticheMateriali();
                }
            });
        });
    }
}
async function checkMaterialePopupNuovaRichiesta(id_materiale)
{
    var materiali=await getMateriali();
    var materialeObj=getFirstObjByPropValue(materiali,"id_materiale",id_materiale);
    document.getElementById("popupNuovaRichiestaFogli1").value="";
    document.getElementById("popupNuovaRichiestaFogli2").value="";
    document.getElementById("popupNuovaRichiestaQnt").value="";
    if(materialeObj.calcolo_progettato_alternativo=="true")
    {
        $(".popup-nuova-richiesta-lamiera-item").show();

        document.getElementById("select1xPopupNuovaRichiesta").innerHTML="";
        document.getElementById("select2xPopupNuovaRichiesta").innerHTML="";

        var option=document.createElement("option");
        option.setAttribute("selected","selected");
        option.setAttribute("value","");
        option.innerHTML="Scegli";
        document.getElementById("select1xPopupNuovaRichiesta").appendChild(option);

        var option=document.createElement("option");
        option.setAttribute("selected","selected");
        option.setAttribute("value","");
        option.innerHTML="Scegli";
        document.getElementById("select2xPopupNuovaRichiesta").appendChild(option);

        //newMouseSpinner(event);
        var formati_lamiere=await getFormatiLamiere();
		//console.log(formati_lamiere);
        //removeMouseSpinner();
        formati_lamiere.forEach(function(riga)
        {
            if(riga.finitura.toLowerCase().indexOf(materialeObj.nome.toLowerCase()) > -1)
            {
                var option=document.createElement("option");
                option.setAttribute("value",riga.id_formato);
                option.innerHTML=riga.codice+" ("+riga.altezza+"x"+riga.larghezza+") | "+riga.profondita+" | "+riga.famiglia;
                document.getElementById("select1xPopupNuovaRichiesta").appendChild(option);

                var option=document.createElement("option");
                option.setAttribute("value",riga.id_formato);
                option.innerHTML=riga.codice+" ("+riga.altezza+"x"+riga.larghezza+") | "+riga.profondita+" | "+riga.famiglia;
                document.getElementById("select2xPopupNuovaRichiesta").appendChild(option);
            }
        });

        var option=document.createElement("option");
        option.setAttribute("value","aggiungi");
        option.innerHTML="Aggiungi...";
        document.getElementById("select1xPopupNuovaRichiesta").appendChild(option);

        var option=document.createElement("option");
        option.setAttribute("value","aggiungi");
        option.innerHTML="Aggiungi...";
        document.getElementById("select2xPopupNuovaRichiesta").appendChild(option);

        $("#select1xPopupNuovaRichiesta").multipleSelect("destroy");
        $("#select1xPopupNuovaRichiesta").multipleSelect(
        {
            single:true,
            maxHeight:150,
            onAfterCreate: function () 
                    {
                        $(".ms-choice").css({"height":"30px","line-height":"30px","background-color":"transparent","border":"none"});
                        $(".ms-choice span").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left","color":"#ddd"});
                        document.getElementById("selectMaterialePopupNuovaRichiesta").style.width="220px";
                        $(".ms-parent").css({"margin-left":"5px"});
                    },
            onOpen:function()
            {
                $(".ms-search input").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                $(".optgroup").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                $(".ms-drop ul").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
            },
            filter:true,
            filterPlaceholder:"Cerca...",
            locale:"it-IT"
        });

        $("#select2xPopupNuovaRichiesta").multipleSelect("destroy");
        $("#select2xPopupNuovaRichiesta").multipleSelect(
        {
            single:true,
            maxHeight:150,
            onAfterCreate: function () 
                    {
                        $(".ms-choice").css({"height":"30px","line-height":"30px","background-color":"transparent","border":"none"});
                        $(".ms-choice span").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left","color":"#ddd"});
                        document.getElementById("selectMaterialePopupNuovaRichiesta").style.width="220px";
                        $(".ms-parent").css({"margin-left":"5px"});
                    },
            onOpen:function()
            {
                $(".ms-search input").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                $(".optgroup").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                $(".ms-drop ul").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
            },
            filter:true,
            filterPlaceholder:"Cerca...",
            locale:"it-IT"
        });
    }
    else
    {
        $(".popup-nuova-richiesta-lamiera-item").hide();
    }
}
/*function inserisciNuovaRichiesta()
{
    var note=document.getElementById("popupNuovaRichiestaTextareaNote").value;
    var commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;
    var tipo=document.getElementById("popupNuovaRichiestaTipo").value;
    
    var righe_dettagli_richieste_materiali_calcolo_fabbisogno=[];
    if(document.getElementById("popupNuovaRichiestaTable")!=null)
    {
        var rows=document.getElementById("popupNuovaRichiestaTable").getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        for (let index = 0; index < rows.length; index++)
        {
            const row = rows[index];
            var id_materiale=row.getElementsByTagName("td")[0].getAttribute("id_materiale");
            var qnt=row.getElementsByTagName("td")[1].innerHTML.split(" ")[0].replace(" ","");
            var id_gruppo=row.getElementsByTagName("td")[2].getAttribute("id_gruppo");
            var formato_1=row.getElementsByTagName("td")[3].getAttribute("id_formato_1");
            if(formato_1==null || formato_1=="")
                formato_1="NULL";
            var qnt_formato_1=row.getElementsByTagName("td")[4].innerHTML;
            if(qnt_formato_1=="")
                qnt_formato_1="NULL";
            var formato_2=row.getElementsByTagName("td")[5].getAttribute("id_formato_2");
            if(formato_2==null || formato_2=="")
                formato_2="NULL";
            var qnt_formato_2=row.getElementsByTagName("td")[6].innerHTML;
            if(qnt_formato_2=="")
                qnt_formato_2="NULL";

            var riga_dettagli_richieste_materiali_calcolo_fabbisogno=
            {
                "id_materiale":id_materiale,
                "qnt":qnt,
                "id_gruppo":id_gruppo,
                "formato_1":formato_1,
                "qnt_formato_1":qnt_formato_1,
                "formato_2":formato_2,
                "qnt_formato_2":qnt_formato_2
            }
			console.log(riga_dettagli_richieste_materiali_calcolo_fabbisogno);
            righe_dettagli_richieste_materiali_calcolo_fabbisogno.push(riga_dettagli_richieste_materiali_calcolo_fabbisogno);
        }
    }

    if(righe_dettagli_richieste_materiali_calcolo_fabbisogno.length>0)
    {
        var JSONrighe_dettagli_richieste_materiali_calcolo_fabbisogno=JSON.stringify(righe_dettagli_richieste_materiali_calcolo_fabbisogno);
        $.post("inserisciNuovaRichiestaMaterialeCalcoloFabbisogno.php",
        {
            commessa,
            note,
            JSONrighe_dettagli_richieste_materiali_calcolo_fabbisogno,
            tipo
        },
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    console.log(response);
                    Swal.fire
                    ({
                        icon:"error",
                        title: "Errore. Se il problema persiste contatta l' amministratore.",
                        showCloseButton:true,
                        showConfirmButton:false,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                    });
                }
                else
                {
                    Swal.fire
                    ({
                        icon:"success",
                        title: "Richiesta inserita (#"+response+")",
                        showCloseButton:true,
                        showConfirmButton:false,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                    }).then((result) => 
                    {
                        if(view=="richieste_materiali")
                            getElencoRichiesteMateriali();
                        if(view=="statistiche_materiali")
                            getStatisticheMateriali();
                    });
                }
            }
        });
    }
}*/
async function aggiungiMaterialeRichiesta(icon,id_richiesta)
{
    icon.setAttribute("class","fad fa-spinner-third fa-spin");

    var materiali=await getMateriali();

    var popupNuovaRichiestaMaterialiAggiuntiContainer=document.getElementById("popupNuovaRichiestaMaterialiAggiuntiContainer");
    var materiale=document.getElementById("selectMaterialePopupNuovaRichiesta").value;
    var qnt=parseFloat(document.getElementById("popupNuovaRichiestaQnt").value);
    var id_gruppo=document.getElementById("selectGruppoPopupNuovaRichiesta").value;
    
    var id_formato_1=document.getElementById("select1xPopupNuovaRichiesta").value;
    var id_formato_2=document.getElementById("select2xPopupNuovaRichiesta").value;
    var fogli1=document.getElementById("popupNuovaRichiestaFogli1").value;
    var fogli2=document.getElementById("popupNuovaRichiestaFogli2").value;
    
    var materialeObj=getFirstObjByPropValue(materiali,"id_materiale",materiale);

    var gruppi=await getGruppi();
    var gruppoObj=getFirstObjByPropValue(gruppi,"id_gruppo",id_gruppo);

    var formati_lamiere=await getFormatiLamiere();
    var formato_1Obj;
    var codice_1;
    var altezza_1;
    var larghezza_1;
    var formato_2Obj;
    var codice_2;
    var altezza_2;
    var larghezza_2;
    if(id_formato_1!=null && id_formato_1!="")
    {
        formato_1Obj=getFirstObjByPropValue(formati_lamiere,"id_formato",id_formato_1);
        codice_1=formato_1Obj.codice;
        altezza_1=formato_1Obj.altezza;
        larghezza_1=formato_1Obj.larghezza;
    }
    if(id_formato_2!=null && id_formato_2!="")
    {
        formato_2Obj=getFirstObjByPropValue(formati_lamiere,"id_formato",id_formato_2);
        codice_2=formato_2Obj.codice;
        altezza_2=formato_2Obj.altezza;
        larghezza_2=formato_2Obj.larghezza;
    }

    icon.setAttribute("class","fas fa-plus-circle");

    if(qnt!=null && qnt>0 && qnt!=NaN)
    {
        if(document.getElementById("popupNuovaRichiestaTable")==null)
        {
            document.getElementById("popupNuovaRichiestaMaterialiAggiuntiContainer").innerHTML="";

            var table=document.createElement("table");
            table.setAttribute("id","popupNuovaRichiestaTable");

            var thead=document.createElement("thead");
            var tr=document.createElement("tr");

            var th=document.createElement("th");
            th.setAttribute("style","border-top-left-radius: 4px;");
            th.innerHTML="Materiale";
            tr.appendChild(th);

            var th=document.createElement("th");
            th.innerHTML="Quantità";
            tr.appendChild(th);

            var th=document.createElement("th");
            th.innerHTML="Gruppo";
            tr.appendChild(th);

            var th=document.createElement("th");
            th.innerHTML="Foglio largo";
            tr.appendChild(th);

            var th=document.createElement("th");
            th.innerHTML="N. fogli";
            tr.appendChild(th);

            var th=document.createElement("th");
            th.innerHTML="Foglio stretto";
            tr.appendChild(th);

            var th=document.createElement("th");
            th.innerHTML="N. fogli";
            tr.appendChild(th);

            var th=document.createElement("th");
            th.setAttribute("style","border-top-right-radius: 4px;width:30px;padding:0px");
            tr.appendChild(th);

            thead.appendChild(tr);
            table.appendChild(thead);

            var tbody=document.createElement("tbody");
            table.appendChild(tbody);

            popupNuovaRichiestaMaterialiAggiuntiContainer.appendChild(table);
        }

        $("#popupNuovaRichiestaTable td").css({"border-bottom-right-radius":"","border-bottom-left-radius":""});

        var id_dettaglio=await inserisciRigaDettagliRichiestaMateriale(materialeObj.id_materiale,qnt,id_richiesta,gruppoObj.id_gruppo,id_formato_1,fogli1,id_formato_2,fogli2)

        var tr=document.createElement("tr");

        var td=document.createElement("td");
        td.setAttribute("style","border-bottom-left-radius: 4px;");
        td.setAttribute("id_materiale",materiale);
        td.innerHTML=materialeObj.nome;
        tr.appendChild(td);

        var td=document.createElement("td");
        td.innerHTML=qnt+" "+materialeObj.um;
        tr.appendChild(td);

        var td=document.createElement("td");
        td.setAttribute("id_gruppo",gruppoObj.id_gruppo);
        td.innerHTML=gruppoObj.nome;
        tr.appendChild(td);

        var td=document.createElement("td");
        if(materialeObj.calcolo_progettato_alternativo=="true")
        {
            if(formato_1Obj==null)
                td.setAttribute("id_formato_1","");
            else
            {
                td.setAttribute("id_formato_1",id_formato_1);
                td.innerHTML=codice_1+" ("+altezza_1+"x"+larghezza_1+")";
            }
        }
        tr.appendChild(td);

        var td=document.createElement("td");
        if(materialeObj.calcolo_progettato_alternativo=="true")
            td.innerHTML=fogli1;
        tr.appendChild(td);

        var td=document.createElement("td");
        if(materialeObj.calcolo_progettato_alternativo=="true")
        {
            if(formato_2Obj==null)
                td.setAttribute("id_formato_2","");
            else
            {
                td.setAttribute("id_formato_2",id_formato_2);
                td.innerHTML=codice_2+" ("+altezza_2+"x"+larghezza_2+")";
            }
        }
        tr.appendChild(td);

        var td=document.createElement("td");
        if(materialeObj.calcolo_progettato_alternativo=="true")
            td.innerHTML=fogli2;
        tr.appendChild(td);
		
		if(id_formato_1=="" || id_formato_1==null)
            id_formato_1="NULL";
        if(fogli1=="" || fogli1==null)
            fogli1="NULL";
        if(id_formato_2=="" || id_formato_2==null)
            id_formato_2="NULL";
        if(fogli2=="" || fogli2==null)
            fogli2="NULL";
        
        var td=document.createElement("td");
        td.setAttribute("style","border-bottom-right-radius: 4px;width:30px;padding:0px");
        var button=document.createElement("button");
        button.setAttribute("onclick","rimuoviRigaDettagliRichiestaMateriale("+id_dettaglio+",this.parentElement.parentElement)");
        button.innerHTML="<i class='fad fa-trash'></i>";
        td.appendChild(button);
        tr.appendChild(td);

        document.getElementById("popupNuovaRichiestaTable").getElementsByTagName("tbody")[0].appendChild(tr);

        document.getElementById("popupNuovaRichiestaMaterialiAggiuntiContainer").scrollTop = document.getElementById("popupNuovaRichiestaMaterialiAggiuntiContainer").scrollHeight;

        document.getElementById("popupNuovaRichiestaQnt").value="";
        document.getElementById("popupNuovaRichiestaFogli1").value="";
        document.getElementById("popupNuovaRichiestaFogli2").value="";

        $("#select1xPopupNuovaRichiesta").multipleSelect("destroy");
        document.getElementById("select1xPopupNuovaRichiesta").value="";
        $("#select1xPopupNuovaRichiesta").multipleSelect(
        {
            single:true,
            maxHeight:150,
            onAfterCreate: function () 
                    {
                        $(".ms-choice").css({"height":"30px","line-height":"30px","background-color":"transparent","border":"none"});
                        $(".ms-choice span").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left","color":"#ddd"});
                        document.getElementById("selectMaterialePopupNuovaRichiesta").style.width="220px";
                        $(".ms-parent").css({"margin-left":"5px"});
                    },
            onOpen:function()
            {
                $(".ms-search input").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                $(".optgroup").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                $(".ms-drop ul").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
            },
            filter:true,
            filterPlaceholder:"Cerca...",
            locale:"it-IT"
        });

        $("#select2xPopupNuovaRichiesta").multipleSelect("destroy");
        document.getElementById("select2xPopupNuovaRichiesta").value="";
        $("#select2xPopupNuovaRichiesta").multipleSelect(
        {
            single:true,
            maxHeight:150,
            onAfterCreate: function () 
                    {
                        $(".ms-choice").css({"height":"30px","line-height":"30px","background-color":"transparent","border":"none"});
                        $(".ms-choice span").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left","color":"#ddd"});
                        document.getElementById("selectMaterialePopupNuovaRichiesta").style.width="220px";
                        $(".ms-parent").css({"margin-left":"5px"});
                    },
            onOpen:function()
            {
                $(".ms-search input").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                $(".optgroup").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                $(".ms-drop ul").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
            },
            filter:true,
            filterPlaceholder:"Cerca...",
            locale:"it-IT"
        });
    }
}
function rimuoviRigaDettagliRichiestaMateriale(id_dettaglio,tr)
{
    var tbody=tr.parentElement;
    tr.remove();
    if(tbody.childElementCount==0)
        tbody.parentElement.remove();

    $.post("rimuoviRigaDettagliRichiestaMateriale.php",{id_dettaglio},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
        }
    });
}
function getCronologiaRichiesteMateriale(commessa,materiale)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getCronologiaRichiesteMateriale.php",
        {
            commessa,materiale
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
        });
    });
}
async function getPopupInserimentoManuale(call)
{
    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    var id_commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","dark-popup-outer-container");

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Gruppo";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var select=document.createElement("select");
    select.setAttribute("class","dark-popup-select");
    select.setAttribute("id","popupInserimentoFabbisognoGruppo");

    var gruppi=await getGruppi();
    gruppi.forEach(gruppo =>
    {
        var option=document.createElement("option");
        option.setAttribute("value",gruppo.id_gruppo);
        option.innerHTML=gruppo.nome;
        select.appendChild(option);
    });
    
    row.appendChild(select);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Materiale";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var select=document.createElement("select");
    select.setAttribute("class","dark-popup-select");
    select.setAttribute("id","popupInserimentoFabbisognoMateriale");
    
    var materiali=await getMateriali();
    materiali.forEach(materiale =>
    {
        var option=document.createElement("option");
        option.setAttribute("value",materiale.id_materiale);
        option.innerHTML=materiale.nome+" ("+materiale.um+")";
        select.appendChild(option);
    });

    row.appendChild(select);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Qnt";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("class","dark-popup-input");input.setAttribute("type","number");
    input.setAttribute("id","popupInserimentoFabbisognoQnt");
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Altezza sviluppo";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("class","dark-popup-input");input.setAttribute("type","number");
    input.setAttribute("id","popupInserimentoFabbisognoAltezza_sviluppo");
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Note";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var textarea=document.createElement("textarea");
    textarea.setAttribute("class","dark-popup-textarea");
    textarea.setAttribute("id","popupInserimentoFabbisognoNote");
    
    row.appendChild(textarea);

    outerContainer.appendChild(row);
    
    var row=document.createElement("div");
    row.setAttribute("class","dark-popup-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:10px");

    var confirmButton=document.createElement("button");
    confirmButton.setAttribute("class","dark-popup-button");
    confirmButton.setAttribute("style","width:100%;");
    confirmButton.setAttribute("onclick","inserisciRigaDatiImportazioniFabbisogni('"+call+"')");
    confirmButton.innerHTML='<span>Conferma</span><i class="fal fa-check-circle"></i>';
    row.appendChild(confirmButton);    

    outerContainer.appendChild(row);

    Swal.fire
    ({
        background:"#404040",
        title:"Inserimento fabbisogno",
        html:outerContainer.outerHTML,
        allowOutsideClick:true,
        showCloseButton:true,
        showConfirmButton:true,
        allowEscapeKey:true,
        showCancelButton:false,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                    document.getElementsByClassName("swal2-title")[0].style.fontSize="12px";
                    document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                    document.getElementsByClassName("swal2-title")[0].style.width="100%";
                    document.getElementsByClassName("swal2-title")[0].style.textDecoration="underline";
                    document.getElementsByClassName("swal2-close")[0].style.width="40px";
                    document.getElementsByClassName("swal2-close")[0].style.height="40px";
                    document.getElementsByClassName("swal2-title")[0].style.margin="0px";
                    document.getElementsByClassName("swal2-title")[0].style.marginTop="5px";
                    document.getElementsByClassName("swal2-title")[0].style.fontFamily="'Montserrat',sans-serif";
                    document.getElementsByClassName("swal2-title")[0].style.textAlign="left";
                    document.getElementsByClassName("swal2-confirm")[0].style.display="none";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingBottom="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingRight="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingLeft="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingTop="10px";
                    document.getElementsByClassName("swal2-header")[0].style.paddingLeft="20px";
                    document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-actions")[0].style.margin="0px";

                    $("#popupInserimentoFabbisognoMateriale").multipleSelect(
                    {
                        single:true,
                        onAfterCreate: function () 
                                {
                                    $(".ms-choice").css({"height":"30px","line-height":"30px","background-color":"transparent","border":"none"});
                                    $(".ms-choice span").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left","color":"#ddd"});
                                },
                        onOpen:function()
                        {
                            $(".ms-search input").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                            $(".optgroup").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                            $(".ms-drop ul").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                        },
                        filter:true,
                        filterPlaceholder:"Cerca...",
                        locale:"it-IT"
                    });
                }
    });
}
function getDatalistItems()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getDatalistItemsImportazioniFabbisogni.php",
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
        });
    });
}
function inserisciRigaDatiImportazioniFabbisogni(call)
{
    var commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;
    var gruppo=document.getElementById("popupInserimentoFabbisognoGruppo").value;
    var materiale=document.getElementById("popupInserimentoFabbisognoMateriale").value;
    var qnt=document.getElementById("popupInserimentoFabbisognoQnt").value;
    var altezza_sviluppo=document.getElementById("popupInserimentoFabbisognoAltezza_sviluppo").value;
    var note=document.getElementById("popupInserimentoFabbisognoNote").value;

    if(qnt==null || qnt=="")
    {
        Swal.fire
        ({
            icon:"error",
            background:"#404040",
            title: "Inserisci una quantità",
            showCloseButton:true,
            showConfirmButton:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
        });
    }
    else
    {
        $.post("inserisciRigaDatiImportazioniFabbisogni.php",
        {
            commessa,
            gruppo,
            materiale,
            qnt,
            altezza_sviluppo,
            note
        },
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    console.log(response);
                    Swal.fire
                    ({
                        icon:"error",
                        title: "Errore. Se il problema persiste contatta l' amministratore.",
                        showCloseButton:true,
                        showConfirmButton:false,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                    });
                }
                else
                {
                    Swal.fire
                    ({
                        icon:"success",
                        title: "Inserimento completato",
                        showCloseButton:true,
                        showConfirmButton:false,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                    }).then((result) => 
                    {
                        if(call=='inserimento_fabbisogno_materiali')
                            getTabellaDati(document.getElementById("buttonTabellaDati"));
                        if(call=='statistiche_materiali')
                            getStatisticheMateriali();
                    });
                }
            }
        });
    }
}
async function getTabellaDati(button)
{
    var items=document.getElementsByClassName("file-importazioni-item");
    for (let index = 0; index < items.length; index++)
    {
        const item = items[index];
        item.style.border="";
    }
    button.style.border="1px solid #4C91CB";
    button.getElementsByTagName("span")[0].style.color="#4C91CB";
    button.getElementsByTagName("i")[0].style.color="#4C91CB";

    document.getElementById("datiImportazioniFabbisogniOuterContainer").innerHTML="";

    //getTable("materiali_calcolo_fabbisogno_view");

    var containerId="datiImportazioniFabbisogniOuterContainer";

    var container = document.getElementById(containerId);
    container.innerHTML="";

    var response=await getHotMaterialiCalcoloFabbisogno();

    var height=container.offsetHeight;

    if(response.data.length>0)
    {
        destroyHots();
        hot = new Handsontable
        (
            container,
            {
                data: response.data,
                rowHeaders: true,
                manualColumnResize: true,
                colHeaders: response.colHeaders,
                filters: true,
                dropdownMenu: true,
                headerTooltips: true,
                language: 'it-IT',
                contextMenu: true,
                width:"100%",
                columnSorting: true,
                height,
                columns:response.columns,
                beforeRemoveRow: (index,amount,physicalRows,source)  =>
                {
                    for (let i = 0; i < physicalRows.length; i++)
                    {
                        const indice = physicalRows[i];
                        var id_importazione=hot.getDataAtCell(indice, 0);
                        eliminaRigaMaterialiCalcoloFabbisogno(id_importazione);
                    }
                },
                beforeCreateRow: () => 
                {
                    return false;
                },
                beforeChange: () => 
                {
                    return false;
                },
                afterDropdownMenuShow: (dropdownMenu) =>
                {
                    document.getElementsByClassName("htUIMultipleSelectSearch")[0].getElementsByTagName("input")[0].addEventListener("click", function()
                    {
                        document.getElementsByClassName("htUIClearAll")[0].getElementsByTagName("a")[0].click();
                    });
                }
            }
        );
        hideHotDisplayLicenceInfo();
        $(".handsontable .changeType").css
        ({
            "background": "#eee",
            "border-radius": "0",
            "border": "none",
            "color": "#404040",
            "font-size": "14px",
            "line-height": "normal",
            "padding": "0px",
            "margin": "0px",
            "float": "right"
        });
    }
}
function getTable(table,orderBy,orderType)
{
    if(table=="materiali_calcolo_fabbisogno_view")
    {
        getEditableTable
        ({
            table:'materiali_calcolo_fabbisogno_view',
            foreignKeys:[['gruppo','anagrafica_gruppi','id_gruppo','nome'],['materiale','anagrafica_materiali','id_materiale','nome'],['file','file_importazioni_fabbisogni','id_file','nomeFile']],
            editable: true,
            primaryKey:"id_importazione",
            container:'datiImportazioniFabbisogniOuterContainer',
            readOnlyColumns:['id_importazione','file','origine','commessa','gruppo','materiale','um',"dataOra"],
            noFilterColumns:["dataOra","file"],
            orderBy:orderBy,
            orderType:orderType
        });
    }
    if(table=="consistenza_commesse_view")
    {
        getEditableTable
        ({
            table:'consistenza_commesse_view',
            editable: false,
            primaryKey:"codice_cabina",
            container:'containerConsistenzaCommessaItems',
            orderBy:orderBy,
            orderType:orderType
        });
    }
    if(table=="anagrafica_gruppi")
    {
        getEditableTable
        ({
            table:'anagrafica_gruppi',
            editable: true,
            container:'containerAnagraficheItems',
            readOnlyColumns:['id_gruppo'],
            noInsertColumns:['id_gruppo'],
            orderBy:orderBy,
            orderType:orderType
        });
    }
    if(table=="anagrafica_commesse")
    {
        getEditableTable
        ({
            table:'anagrafica_commesse',
            editable: true,
            container:'containerAnagraficheItems',
            readOnlyColumns:['id_commessa'],
            noInsertColumns:['id_commessa'],
            orderBy:orderBy,
            orderType:orderType
        });
    }
    if(table=="anagrafica_materiali")
    {
        getEditableTable
        ({
            table:'anagrafica_materiali',
            editable: true,
            container:'containerAnagraficheItems',
            readOnlyColumns:['id_materiale',"materia_prima",'raggruppamento'],
            noInsertColumns:['id_materiale',"materia_prima",'raggruppamento'],
            noFilterColumns:["descrizione","materia_prima",'raggruppamento'],
            foreignKeys:[['materia_prima','materie_prime_view','id_materia_prima','codice_materia_prima']],
            orderBy:orderBy,
            orderType:orderType
        });
    }
    /*if(table=="riepilogo_commesse_view")
    {
        getEditableTable
        ({
            table:'riepilogo_commesse_view',
            editable: false,
            primaryKey:"materiale",
            container:'containerRiepilogoCommesseItems',
            noFilterColumns:["qnt"],
            orderBy:orderBy,
            orderType:orderType
        });
    }*/
}
async function editableTableLoad()
{
    if(selectetTable=="materiali_calcolo_fabbisogno_view")
    {
        document.getElementById("datiImportazioniFabbisogniOuterContainer").style.maxHeight=document.getElementById("fileImportazioniFabbisogniOuterContainer").offsetHeight+"px";
        document.getElementsByClassName("btnAddRecordEditableTable")[0].remove();
    }
    /*if(selectetTable=="anagrafica_materiali")
    {
        var raggruppamenti=await getRaggruppamenti();
        var tbl = document.getElementById("myTableanagrafica_materiali");
        
        for (var j = 1, row; row = tbl.rows[j]; j++)
        {
            //materia prima
            var materia_prima=row.cells[4].innerHTML;

            if(materia_prima!=="")
            {
                row.cells[4].innerHTML="";
            
                var span=document.createElement("span");
                span.setAttribute("style","font-family:'Montserrat',sans-serif;font-size:10px");
                span.innerHTML=materia_prima;
                row.cells[4].appendChild(span);

                var i=document.createElement("i");
                i.setAttribute("class","fal fa-times");
                i.setAttribute("title","Rimuovi");
                i.setAttribute("style","float:right;font-size:14px;cursor:pointer");
                i.setAttribute("onclick","rimuoviMateriaPrimaMateriali("+row.cells[0].innerHTML+",this.parentElement)");
                row.cells[4].appendChild(i);
            }
            //raggruppamento
            var id_materiale=row.cells[0].innerHTML;

            var id_raggruppamento=row.cells[5].innerHTML;
            row.cells[5].innerHTML="";

            var select=document.createElement("select");
            select.setAttribute("class","transparent-select-editable-table");
            select.setAttribute("onchange","checkRaggruppamentoMateriali(this,"+id_materiale+")");
            select.setAttribute("id","selectRaggruppamentoMateriali"+id_materiale);

            if(id_raggruppamento=="")
            {
                var option=document.createElement("option");
                option.setAttribute("value","seleziona");
                option.innerHTML="Seleziona";
                select.appendChild(option);
            }
            
            raggruppamenti.forEach(raggruppamento =>
            {
                var option=document.createElement("option");
                option.setAttribute("value",raggruppamento.id_raggruppamento);
                if(parseInt(raggruppamento.id_raggruppamento)==parseInt(id_raggruppamento))
                    option.setAttribute("selected","selected");
                option.innerHTML=raggruppamento.nome+" ("+raggruppamento.um+")";
                select.appendChild(option);
            });
            var option=document.createElement("option");
            option.setAttribute("value","");
            option.innerHTML="Aggiungi...";
            select.appendChild(option);

            row.cells[5].appendChild(select);
        }
    }*/
}
function checkRaggruppamentoMateriali(select,id_materiale)
{
    if(select.value=="")
    {
        getPopupNuovoRaggruppamento(id_materiale);
    }
    else
    {
        if(select.value!="seleziona")
        {
            $.post("aggiornaRaggruppamentoMateriale.php",{id_materiale,raggruppamento:select.value},
            function(response, status)
            {
                if(status=="success")
                {
                    if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                    {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                    }
                }
            });
        }
    }
}
function getPopupNuovoRaggruppamento(id_materiale)
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","dark-popup-outer-container");

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Nome";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("class","dark-popup-input");input.setAttribute("type","text");
    input.setAttribute("id","popupNuovoRaggruppamentoNome");
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Um";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("class","dark-popup-input");input.setAttribute("type","text");
    input.setAttribute("id","popupNuovoRaggruppamentoUm");
    
    row.appendChild(input);

    outerContainer.appendChild(row);
    
    var row=document.createElement("div");
    row.setAttribute("class","dark-popup-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:10px");

    var confirmButton=document.createElement("button");
    confirmButton.setAttribute("class","dark-popup-button");
    confirmButton.setAttribute("style","width:100%;");
    confirmButton.setAttribute("onclick","inserisciNuovoRaggruppamentoMateriali("+id_materiale+")");
    confirmButton.innerHTML='<span>Conferma</span><i class="fal fa-check-circle"></i>';
    row.appendChild(confirmButton);    

    outerContainer.appendChild(row);

    Swal.fire
    ({
        background:"#404040",
        title:"Nuovo raggruppamento",
        html:outerContainer.outerHTML,
        allowOutsideClick:true,
        showCloseButton:true,
        showConfirmButton:true,
        allowEscapeKey:true,
        showCancelButton:false,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                    document.getElementsByClassName("swal2-title")[0].style.fontSize="12px";
                    document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                    document.getElementsByClassName("swal2-title")[0].style.width="100%";
                    document.getElementsByClassName("swal2-title")[0].style.textDecoration="underline";
                    document.getElementsByClassName("swal2-close")[0].style.width="40px";
                    document.getElementsByClassName("swal2-close")[0].style.height="40px";
                    document.getElementsByClassName("swal2-title")[0].style.margin="0px";
                    document.getElementsByClassName("swal2-title")[0].style.marginTop="5px";
                    document.getElementsByClassName("swal2-title")[0].style.fontFamily="'Montserrat',sans-serif";
                    document.getElementsByClassName("swal2-title")[0].style.textAlign="left";
                    document.getElementsByClassName("swal2-confirm")[0].style.display="none";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingBottom="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingRight="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingLeft="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingTop="10px";
                    document.getElementsByClassName("swal2-header")[0].style.paddingLeft="20px";
                    document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-actions")[0].style.margin="0px";
                }
    }).then((result) => 
    {
        if(result.value==undefined)
            getTable("anagrafica_materiali");
    });
}
function inserisciNuovoRaggruppamentoMateriali(id_materiale)
{
    var nome=document.getElementById("popupNuovoRaggruppamentoNome").value;
    var um=document.getElementById("popupNuovoRaggruppamentoUm").value;

    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    if(nome==null || nome=="" || um==null || um=="")
    {
        Swal.fire
        ({
            icon:"error",
            background:"#404040",
            title: "Compila tutti i campi",
            showCloseButton:true,
            showConfirmButton:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
        }).then((result) => 
        {
            getPopupNuovoRaggruppamento(id_materiale);
        });
    }
    else
    {
        $.post("inserisciNuovoRaggruppamentoMateriali.php",
        {
            nome,
            um
        },
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    console.log(response);
                    Swal.fire
                    ({
                        icon:"error",
                        title: "Errore. Se il problema persiste contatta l' amministratore.",
                        showCloseButton:true,
                        showConfirmButton:false,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                    });
                }
                else
                {
                    var id_raggruppamento=response;
                    $.post("aggiornaRaggruppamentoMateriale.php",{id_materiale,raggruppamento:id_raggruppamento},
                    function(response, status)
                    {
                        if(status=="success")
                        {
                            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                            {
                                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                                console.log(response);
                            }
                            else
                            {
                                Swal.close();

                                var option=document.createElement("option");
                                option.setAttribute("value",id_raggruppamento);
                                option.setAttribute("selected","selected");
                                option.innerHTML=nome+" ("+um+")";
                                document.getElementById("selectRaggruppamentoMateriali"+id_materiale).insertBefore(option, document.getElementById("selectRaggruppamentoMateriali"+id_materiale).lastChild);

                                var selects=document.getElementsByClassName("transparent-select-editable-table");
                                for (let index = 0; index < selects.length; index++)
                                {
                                    const select = selects[index];
                                    if(select.id!="selectRaggruppamentoMateriali"+id_materiale)
                                    {
                                        var option=document.createElement("option");
                                        option.setAttribute("value",id_raggruppamento);
                                        option.innerHTML=nome+" ("+um+")";
                                        select.insertBefore(option, select.lastChild);
                                    }
                                }
                            }
                        }
                    });
                }
            }
        });
    }
}
function getRaggruppamenti()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getRaggruppamentiMaterialiCalcoloFabbisogno.php",
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
function rimuoviMateriaPrimaMateriali(id_materiale,cell)
{
    $.post("rimuoviMateriaPrimaMaterialiCalcoloFabbisogno.php",
    {
        id_materiale
    },
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
            {
                cell.innerHTML="";
            }
        }
    });
}
function getMascheraCalcoloFabbisogno(button)
{
    view="calcolo_fabbisogno";

    $(".in-page-nav-bar-button").css({"border-bottom-color":"","font-weight":""});
    button.style.borderBottomColor="#4C91CB";
    button.style.fontWeight="bold";

    document.getElementById("actionBarCalcoloFabbisogno").style.display="flex";
    $(".reusable-control-bar-items").hide();
    
    document.getElementById("actionBarCalcoloFabbisognoItems").style.display="flex";
    $(".container-items").hide();
    document.getElementById("containerCalcoloFabbisognoItems").style.display="flex";

    $("#selectCommessaCalcoloFabbisognoContainer").show(200,"swing",function () {$("#selectCommessaCalcoloFabbisognoContainer").css("display","flex")});
}
function getAnagraficaGruppi(button)
{
    view="anagrafica_gruppi";

    $(".in-page-nav-bar-button").css({"border-bottom-color":"","font-weight":""});
    button.style.borderBottomColor="#4C91CB";
    button.style.fontWeight="bold";

    document.getElementById("actionBarCalcoloFabbisogno").style.display="flex";
    $(".reusable-control-bar-items").hide();
    
    document.getElementById("actionBarAnagraficheItems").style.display="flex";
    $(".container-items").hide();
    document.getElementById("containerAnagraficheItems").style.display="flex";

    $("#selectCommessaCalcoloFabbisognoContainer").hide(200,"swing");

    getHotAnagraficaGruppi("anagrafica_gruppi","containerAnagraficheItems",150);
}
function getMascheraAnagraficaMateriali(button)
{
    view="anagrafica_materiali";

    $(".in-page-nav-bar-button").css({"border-bottom-color":"","font-weight":""});
    button.style.borderBottomColor="#4C91CB";
    button.style.fontWeight="bold";

    document.getElementById("actionBarCalcoloFabbisogno").style.display="flex";
    $(".reusable-control-bar-items").hide();
    
    document.getElementById("actionBarAnagraficaMaterialiItems").style.display="flex";
    $(".container-items").hide();
    document.getElementById("containerAnagraficheHotItems").style.display="block";

    $("#selectCommessaCalcoloFabbisognoContainer").show(200,"swing",function () {$("#selectCommessaCalcoloFabbisognoContainer").css("display","flex")});

    getHotAnagraficaMateriali();
}
async function getHotAnagraficaMateriali()
{
    var container = document.getElementById('containerAnagraficheHotItems');
    container.innerHTML="";

    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    var anagraficaMateriali=await getAnagraficaMateriali();

    Swal.close();

	var height=container.offsetHeight;

    if(anagraficaMateriali.data.length>0)
    {
        destroyHots();
        hot = new Handsontable
        (
            container,
            {
                data: anagraficaMateriali.data,
                rowHeaders: true,
                manualColumnResize: true,
                colHeaders: anagraficaMateriali.colHeaders,
                colWidths: [150, 150, 300,150,150,200],
                filters: true,
                dropdownMenu: true,
                headerTooltips: true,
                language: 'it-IT',
                contextMenu: true,
                width:"100%",
                height,
                columns:anagraficaMateriali.columns,
                afterChange: (changes) =>
                {
                    if(changes!=null)
                    {
                        changes.forEach(([row, prop, oldValue, newValue]) =>
                        {
                            if(prop!="id_materiale")
                            {
                                if(oldValue!=newValue)
                                {
                                    var id_materiale=hot.getDataAtCell(row, 0);
                                    aggiornaRigaAnagraficaMateriali(id_materiale,prop,newValue);
                                    checkFamigliaMateriaPrima();
                                }
                            }
                        });
                    }
                },
                afterCreateRow: (index,amount,source) =>
                {
                    creaRigaAnagraficaMateriali(false,index);
                },
                beforeRemoveRow: (index,amount,physicalRows,source)  =>
                {
                    for (let i = 0; i < physicalRows.length; i++)
                    {
                        const indice = physicalRows[i];
                        var id_materiale=hot.getDataAtCell(index, 0);
                        eliminaRigaAnagraficaMateriali(id_materiale);
                    }
                },
                afterDropdownMenuShow: (dropdownMenu) =>
                {
                    document.getElementsByClassName("htUIMultipleSelectSearch")[0].getElementsByTagName("input")[0].addEventListener("click", function()
                    {
                        document.getElementsByClassName("htUIClearAll")[0].getElementsByTagName("a")[0].click();
                    });
                }
            }
        );

        checkFamigliaMateriaPrima();

        hideHotDisplayLicenceInfo();
        $(".handsontable .changeType").css
        ({
            "background": "#eee",
            "border-radius": "0",
            "border": "none",
            "color": "#404040",
            "font-size": "14px",
            "line-height": "normal",
            "padding": "0px",
            "margin": "0px",
            "float": "right"
        });
        try {
            document.getElementsByClassName("wtHolder")[0].scroll(1, 0);
        } catch (error) {}
    }
    else
    {
        creaRigaAnagraficaMateriali(true);
    }
}
async function checkFamigliaMateriaPrima()
{
    var raggruppamento_calcolo_progettato_alternativo=await getRaggruppamentoCalcoloProgettatoAlternativo();
    try {
        var cellsToEmpty=[];
        hot.updateSettings
        ({
            cells: function (row, col, prop)
            {
                var cellProperties = {};

                if(prop=="materia_prima" && hot.getDataAtRowProp(row, "famiglia")==raggruppamento_calcolo_progettato_alternativo)
                {
                    cellsToEmpty.push(row+"_"+col);
                }

                return cellProperties;
            }
        });

        function onlyUnique(value, index, self)
        {
            return self.indexOf(value) === index;
        }
        var cellsToEmptyUnique = cellsToEmpty.filter(onlyUnique);

        var cellsToEmptyClean=[];

        cellsToEmptyUnique.forEach(cellToEmpty =>
        {
            var row=cellToEmpty.split("_")[0];
            var col=cellToEmpty.split("_")[1];
            var obj={row:parseInt(row),col:parseInt(col)};
            cellsToEmptyClean.push(obj);
        });
        cellsToEmptyClean.forEach(cellToEmpty =>
        {
            hot.setDataAtCell(cellToEmpty.row, cellToEmpty.col, "Nessuna");
        });
        hot.updateSettings
        ({
            cells: function (row, col, prop)
            {
                var cellProperties = {};

                if(prop=="materia_prima" && hot.getDataAtRowProp(row, "famiglia")==raggruppamento_calcolo_progettato_alternativo)
                {
                    cellProperties.editor = false;
                }

                return cellProperties;
            }
        });
    } catch (error) {}
}
function getRaggruppamentoCalcoloProgettatoAlternativo()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getRaggruppamentoCalcoloProgettatoAlternativo.php",
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                }
                else
                {
                    resolve(response);
                }
            }
        });
    });
}
function aggiornaRigaAnagraficaMateriali(id_materiale,colonna,valore)
{
    $.get("aggiornaRigaAnagraficaMateriali.php",{id_materiale,colonna,valore},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
            {
                if(response.toLowerCase().indexOf("duplicato")>-1)
                {
                    Swal.fire
                    ({
                        icon:"error",
                        background:"#404040",
                        title: "Esiste già un materiale con questo nome",
                        showCloseButton:true,
                        showConfirmButton:false,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                    }).then((result) => 
                    {
                        hot.destroy();
                        getHotAnagraficaMateriali();
                    });
                    //window.alert("Esiste già un materiale con questo nome");
                }
            }
        }
    });
}
function creaRigaAnagraficaMateriali(placeholderRow,index)
{
    var id_commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;
    $.get("creaRigaAnagraficaMateriali.php",{id_commessa,placeholderRow:placeholderRow.toString()},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
            {
                if(response.toLowerCase().indexOf("duplicato")>-1)
                {
                    Swal.fire
                    ({
                        icon:"error",
                        background:"#404040",
                        title: "Prima di inserire nuove righe compila quelle con il campo nome vuoto",
                        showCloseButton:true,
                        showConfirmButton:false,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                    }).then((result) => 
                    {
                        hot.destroy();
                        getHotAnagraficaMateriali();
                    });
                }
                else
                {
                    if(placeholderRow)
                        getHotAnagraficaMateriali();
                    else
                    {
                        hot.setDataAtCell(index, 0, response);
                        hot.setDataAtCell(index, 3, "da_compilare");
                        hot.setDataAtCell(index, 4, "Nessuno");
                        hot.setDataAtCell(index, 5, "Nessuna");
                    }
                }
                
            }
        }
    });
}
function eliminaRigaAnagraficaMateriali(id_materiale)
{
    $.get("eliminaRigaAnagraficaMateriali.php",{id_materiale},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire
                ({
                    icon:"error",
                    background:"#404040",
                    title: "Impossibile eliminare il materiale.\n\nAssicurati che non sia già stato usato",
                    showCloseButton:true,
                    showConfirmButton:false,
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                }).then((result) => 
                {
                    hot.destroy();
                    getHotAnagraficaMateriali();
                });
                //window.alert("Impossibile eliminare il materiale.\n\nAssicurati che non sia già stato usato");
                console.log(response);
            }
        }
    });
}
function getAnagraficaMateriali()
{
    return new Promise(function (resolve, reject) 
    {
        var id_commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;
        $.get("getAnagraficaMateriali.php",{id_commessa},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
function getMateriePrime()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getMateriePrimeCalcoloFabbisogno.php",
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
async function getPopupCollegaMateriePrime()
{
    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    var materiali=await getMateriali();
    var materie_prime=await getMateriePrime();

    var id_materiale;
    var materiale;
    var materia_prima;
    var id_materia_prima;

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","dark-popup-outer-container");

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-top:5px;");
    row.innerHTML="Materiale calcolo fabbisogno";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start;margin-top:5px");

    var select=document.createElement("select");
    select.setAttribute("class","dark-popup-select");
    select.setAttribute("id","popupCollegaMaterialiMateriale");

    materiali.forEach(item =>
    {
        var option=document.createElement("option");
        option.setAttribute("value",item.id_materiale);
        option.innerHTML=item.nome;
        select.appendChild(option);
    });
    
    row.appendChild(select);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-top:10px;");
    row.innerHTML="Materia prima db tecnico";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start;margin-top:5px");

    var select=document.createElement("select");
    select.setAttribute("class","dark-popup-select");
    select.setAttribute("id","popupCollegaMaterialiMateriaPrima");

    materie_prime.forEach(item =>
    {
        var option=document.createElement("option");
        option.setAttribute("value",item.id_materia_prima);
        option.innerHTML=item.codice_materia_prima;
        select.appendChild(option);
    });
    
    row.appendChild(select);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","dark-popup-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:5px");

    var confirmButton=document.createElement("button");
    confirmButton.setAttribute("class","dark-popup-button");
    confirmButton.setAttribute("style","width:100%;margin-top:5px");
    confirmButton.setAttribute("onclick","collegaMateriePrime()");
    confirmButton.innerHTML='<span>Conferma</span><i class="fal fa-check-circle"></i>';
    row.appendChild(confirmButton);

    outerContainer.appendChild(row);

    Swal.fire
    ({
        background:"#404040",
        title:"Collega materiali",
        html:outerContainer.outerHTML,
        allowOutsideClick:true,
        showCloseButton:true,
        showConfirmButton:false,
        allowEscapeKey:true,
        showCancelButton:false,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";
                    document.getElementsByClassName("swal2-title")[0].style.fontSize="12px";
                    document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                    document.getElementsByClassName("swal2-title")[0].style.width="100%";
                    /*document.getElementsByClassName("swal2-title")[0].style.textDecoration="underline";*/
                    document.getElementsByClassName("swal2-close")[0].style.width="40px";
                    document.getElementsByClassName("swal2-close")[0].style.height="40px";
                    document.getElementsByClassName("swal2-close")[0].style.boxShadow="none";document.getElementsByClassName("swal2-close")[0].style.outline="none";
                    document.getElementsByClassName("swal2-title")[0].style.margin="0px";
                    document.getElementsByClassName("swal2-title")[0].style.marginTop="5px";
                    document.getElementsByClassName("swal2-title")[0].style.fontFamily="'Montserrat',sans-serif";
                    document.getElementsByClassName("swal2-title")[0].style.textAlign="left";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingBottom="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingRight="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingLeft="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingTop="10px";
                    document.getElementsByClassName("swal2-header")[0].style.paddingLeft="20px";
                    document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-actions")[0].style.margin="0px";

                    $("#popupCollegaMaterialiMateriale").multipleSelect(
                    {
                        single:true,
                        onAfterCreate: function () 
                                {
                                    $(".ms-choice").css({"height":"30px","line-height":"30px","background-color":"transparent","border":"none"});
                                    $(".ms-choice span").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left","color":"#ddd"});
                                },
                        onOpen:function()
                        {
                            $(".ms-search input").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                            $(".optgroup").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                        },
                        filter:true,
                        filterPlaceholder:"Cerca...",
                        locale:"it-IT"
                    });

                    $("#popupCollegaMaterialiMateriaPrima").multipleSelect(
                    {
                        single:true,
                        onAfterCreate: function () 
                                {
                                    $(".ms-choice").css({"height":"30px","line-height":"30px","background-color":"transparent","border":"none"});
                                    $(".ms-choice span").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left","color":"#ddd"});
                                },
                        onOpen:function()
                        {
                            $(".ms-search input").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                            $(".optgroup").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                        },
                        filter:true,
                        filterPlaceholder:"Cerca...",
                        locale:"it-IT"
                    });
                }
    })
}
function collegaMateriePrime()
{
    var id_materiale=document.getElementById("popupCollegaMaterialiMateriale").value;
    var id_materia_prima=document.getElementById("popupCollegaMaterialiMateriaPrima").value;

    if(id_materiale==null || id_materia_prima==null)
    {
        Swal.fire
        ({
            icon:"error",
            background:"#404040",
            title: "Compila tutti i campi",
            showCloseButton:true,
            showConfirmButton:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
        }).then((result) => 
        {
            getPopupCollegaMateriePrime();
        });
    }
    else
    {
        Swal.fire
        ({
            width:"100%",
            background:"transparent",
            title:"Caricamento in corso...",
            html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
            allowOutsideClick:false,
            showCloseButton:false,
            showConfirmButton:false,
            allowEscapeKey:false,
            showCancelButton:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
        });
    
        $.post("collegaMateriePrimeCalcoloFabbisogno.php",
        {
            id_materiale,
            id_materia_prima
        },
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    console.log(response);
                    Swal.fire
                    ({
                        icon:"error",
                        title: "Errore. Se il problema persiste contatta l' amministratore.",
                        showCloseButton:true,
                        showConfirmButton:false,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                    });
                }
                else
                {
                    Swal.fire
                    ({
                        icon:"success",
                        title: "Modifiche completate",
                        showCloseButton:true,
                        showConfirmButton:false,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                    }).then((result) => 
                    {
                        getHotAnagraficaMateriali();
                    });
                }
            }
        });
    }
}
function getAnagraficaCommesse(button)
{
    $(".in-page-nav-bar-button").css({"border-bottom-color":"","font-weight":""});
    button.style.borderBottomColor="#4C91CB";
    button.style.fontWeight="bold";

    document.getElementById("actionBarCalcoloFabbisogno").style.display="flex";
    $(".reusable-control-bar-items").hide();
    
    document.getElementById("actionBarAnagraficheItems").style.display="flex";
    $(".container-items").hide();
    document.getElementById("containerAnagraficheItems").style.display="flex";

    $("#selectCommessaCalcoloFabbisognoContainer").hide(200,"swing");

    getTable("anagrafica_commesse");
}
function getMascheraStatisticheMateriali(button)
{
    view="statistiche_materiali";

    $(".in-page-nav-bar-button").css({"border-bottom-color":"","font-weight":""});
    button.style.borderBottomColor="#4C91CB";
    button.style.fontWeight="bold";

    document.getElementById("actionBarCalcoloFabbisogno").style.display="flex";
    $(".reusable-control-bar-items").hide();
    
    document.getElementById("actionBarStatisticheMaterialiItems").style.display="flex";
    $(".container-items").hide();
    document.getElementById("containerStatisticheMaterialiItems").style.display="flex";

    $("#selectCommessaCalcoloFabbisognoContainer").show(200,"swing",function () {$("#selectCommessaCalcoloFabbisognoContainer").css("display","flex")});

    getStatisticheMateriali();
}
async function getPopupScegliMateriali()
{
    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    var id_commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","dark-popup-outer-container");

    var actionBar=document.createElement("div");
    actionBar.setAttribute("class","dark-popup-action-bar");
    actionBar.setAttribute("style","padding:0px;margin-bottom:10px;height:auto;box-shadow:none");

    var span=document.createElement("span");
    span.setAttribute("class","dark-popup-action-bar-span");
    span.innerHTML="Filtra materiali/famiglie";
    actionBar.appendChild(span);

    var button=document.createElement("button");
    button.setAttribute("class","dark-popup-action-bar-text-button");
    if(!raggruppamentoMateriali)
        button.setAttribute("style","background-color:rgb(48, 133, 214);color:white;border:1px solid rgb(48, 133, 214)");
    button.setAttribute("onclick","$('.dark-popup-action-bar-text-button').css({'background-color':'','color':'','border':''});$(this).css({'background-color':'rgb(48, 133, 214)','color':'white','border':'1px solid rgb(48, 133, 214)'});raggruppamentoMateriali=false;setCookie('raggruppamentoMateriali',raggruppamentoMateriali);getTablePopupScegliMateriali()");
    button.innerHTML='<span>Materiali</span>';
    actionBar.appendChild(button);

    var button=document.createElement("button");
    button.setAttribute("class","dark-popup-action-bar-text-button");
    button.setAttribute("onclick","$('.dark-popup-action-bar-text-button').css({'background-color':'','color':'','border':''});$(this).css({'background-color':'rgb(48, 133, 214)','color':'white','border':'1px solid rgb(48, 133, 214)'});raggruppamentoMateriali=true;setCookie('raggruppamentoMateriali',raggruppamentoMateriali);getTablePopupScegliMateriali()");
    if(raggruppamentoMateriali)
        button.setAttribute("style","background-color:rgb(48, 133, 214);color:white;border:1px solid rgb(48, 133, 214);margin-left:5px");
    else
        button.setAttribute("style","margin-left:5px");
    button.innerHTML='<span>Famiglie</span>';
    actionBar.appendChild(button);

    var button=document.createElement("button");
    button.setAttribute("class","dark-popup-action-bar-close-button");
    button.setAttribute("onclick","Swal.close()");
    button.innerHTML='<i class="fal fa-times"></i>';
    actionBar.appendChild(button);

    outerContainer.appendChild(actionBar);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("class","dark-popup-input");
    input.setAttribute("type","search");
    input.setAttribute("placeholder","Cerca materiale...");
    input.setAttribute("onkeyup","document.getElementById('selectFiltraFamigliaPopupFiltraMateriali').value='';cercaPopupScegliMateriali([0,1],this)");
    input.setAttribute("onsearch","document.getElementById('selectFiltraFamigliaPopupFiltraMateriali').value='';cercaPopupScegliMateriali([0,1],this)");
    input.setAttribute("id","popupScegliMaterialiSearch");
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("style","margin-top:5px;display:flex;flex-direction:row;align-items:center;justify-content:flex-start;cursor:pointer");
    row.setAttribute("onclick","this.getElementsByTagName('input')[0].checked=!this.getElementsByTagName('input')[0].checked;toggleSelectAllFiltraMateriali()");

    var input=document.createElement("input");
    input.setAttribute("type","checkbox");
    input.setAttribute("onchange","toggleSelectAllFiltraMateriali();");
    input.setAttribute("onclick","disableCheckboxPopupScegliMateriali(event)");
    input.setAttribute("id","popupScegliMaterialiCheckboxTutti");
    row.appendChild(input);

    var span=document.createElement("span");
    span.setAttribute("style","font-family:'Montserrat',sans-serif;font-size:12px;color:#ddd;margin-left:5px");
    span.innerHTML="Seleziona tutti";
    row.appendChild(span);

    outerContainer.appendChild(row);
    
    var checkboxContainer=document.createElement("div")
    checkboxContainer.setAttribute("class","dark-popup-row");
    checkboxContainer.setAttribute("style","overflow-x:hidden;width:100%;flex-direction:column;align-items:flex-start;justify-content:flex-start;margin-top:10px;max-height:400px;min-height:400px;height:400px;overflow-y:auto");
    checkboxContainer.setAttribute("id","checkboxContainerPopupScegliMateriali");
    
    outerContainer.appendChild(checkboxContainer);

    var row=document.createElement("div");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-top:10px;");
    if(materiali_statistiche.length<=5)
        var color="#70B085";
    if(materiali_statistiche.length<=10 && materiali_statistiche.length>5)
        var color="#E9A93A";
    if(materiali_statistiche.length>10)
        var color="#DA6969";

    if(raggruppamentoMateriali)
        row.innerHTML="<span id='nMaterialiContainerPopupMateriali' style='color:"+color+"'>"+materiali_statistiche.length+" famiglie selezionate</span>";
    else
        row.innerHTML="<span id='nMaterialiContainerPopupMateriali' style='color:"+color+"'>"+materiali_statistiche.length+" materiali selezionati</span>";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-top:10px;");
    row.innerHTML="<u><b>Nota: </b></u><ul style='margin: 0px;margin-top: 5px;padding: 0px;padding-left: 15px;'><li>maggiore è il numero di materiali selezionati maggiore sarà il tempo impiegato per il calcolo</li><li>il programma ricorderà la scelta</li></ul>";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","dark-popup-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:10px");

    var confirmButton=document.createElement("button");
    confirmButton.setAttribute("class","dark-popup-button");
    confirmButton.setAttribute("style","width:100%;margin-top:5px");
    confirmButton.setAttribute("onclick","getStatisticheMateriali()");
    confirmButton.innerHTML='<span>Conferma</span><i class="fal fa-check-circle"></i>';
    row.appendChild(confirmButton);

    outerContainer.appendChild(row);

    Swal.fire
    ({
        background:"#404040",
        html:outerContainer.outerHTML,
        width:"70%",
        allowOutsideClick:true,
        showConfirmButton:false,
        allowEscapeKey:true,
        showCancelButton:false,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-popup")[0].style.paddingBottom="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingRight="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingLeft="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingTop="0px";
                    document.getElementsByClassName("swal2-header")[0].style.paddingLeft="20px";
                    document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-actions")[0].style.margin="0px";

                    getTablePopupScegliMateriali();
                }
    });
}
function toggleSelectAllFiltraMateriali()
{
    var checked=document.getElementById("popupScegliMaterialiCheckboxTutti").checked;
    var checkboxes=document.getElementsByClassName("popup-scegli-materiali-checkbox");
    checkboxes.forEach(checkbox =>
    {
        if(checkbox.parentElement.parentElement.style.display!="none")
            checkbox.checked=checked;
    });
    checkMaterialiPopupMateriali();
}
async function getTablePopupScegliMateriali()
{
    var checkboxContainer=document.getElementById("checkboxContainerPopupScegliMateriali");
    checkboxContainer.innerHTML="";

    if(raggruppamentoMateriali)
    {
        var table=document.createElement("table");
        table.setAttribute("class","checkbox-table");
        table.setAttribute("id","checkboxTable");

        var thead=document.createElement("thead");

        var tr=document.createElement("tr");

        var th=document.createElement("th");
        th.innerHTML="Famiglia";
        tr.appendChild(th);

        var th=document.createElement("th");
        th.innerHTML="N. materiali";
        tr.appendChild(th);

        var th=document.createElement("th");
        th.innerHTML="Materiali";
        tr.appendChild(th);    

        thead.appendChild(tr);

        table.appendChild(thead);

        var tbody=document.createElement("tbody");

        var raggruppamenti=await getRaggruppamentiMateriali();

        raggruppamenti.forEach(raggruppamento =>
        {
            var tr=document.createElement("tr");
            tr.setAttribute("onclick","this.getElementsByTagName('input')[0].checked=!this.getElementsByTagName('input')[0].checked;checkMaterialiPopupMateriali()");

            var td=document.createElement("td");
            td.setAttribute("style","display: flex;flex-direction: row;align-items: center;justify-content: flex-start;");
            td.setAttribute("title",raggruppamento.nome + " ("+raggruppamento.um+")");
            var checkbox=document.createElement("input");
            checkbox.setAttribute("type","checkbox");
            checkbox.setAttribute("class","popup-scegli-materiali-checkbox");
            checkbox.setAttribute("style","margin:0px;margin-right:5px");
            checkbox.setAttribute("onchange","checkMaterialiPopupMateriali()");
            if(materiali_statistiche.includes(raggruppamento.id_raggruppamento))
                checkbox.setAttribute("checked","checked");
            checkbox.setAttribute("materiale",raggruppamento.id_raggruppamento);
            checkbox.setAttribute("onclick","disableCheckboxPopupScegliMateriali(event)");
            td.appendChild(checkbox);
            var span=document.createElement("span");
            span.setAttribute("style","margin-left:5px;");
            span.innerHTML=raggruppamento.nome + " ("+raggruppamento.um+")";
            td.appendChild(span);
            tr.appendChild(td);

            var td=document.createElement("td");
            td.innerHTML="<span>"+raggruppamento.n_materiali+"</span>";
            tr.appendChild(td);

            var nomiMateriali=[];
            raggruppamento.materiali.forEach(materiale =>
            {
                nomiMateriali.push(materiale.nome);
            });

            var td=document.createElement("td");
            td.setAttribute("title",nomiMateriali.toString());
            td.innerHTML="<span style='text-decoration:underline'>Dettagli</span>";
            tr.appendChild(td);

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
    }
    else
    {
        var materiali=await getMateriali();
        var nomi_raggruppamenti_materialiD=[];
        materiali.forEach(materiale =>
        {
            nomi_raggruppamenti_materialiD.push(materiale.nome_raggruppamento);
        });
        var nomi_raggruppamenti_materiali=[];
        $.each(nomi_raggruppamenti_materialiD, function(i, el){
            if($.inArray(el, nomi_raggruppamenti_materiali) === -1) nomi_raggruppamenti_materiali.push(el);
        });

        var table=document.createElement("table");
        table.setAttribute("class","checkbox-table");
        table.setAttribute("id","checkboxTable");

        var thead=document.createElement("thead");

        var tr=document.createElement("tr");

        var th=document.createElement("th");
        th.innerHTML="Materiale";
        tr.appendChild(th);

        var th=document.createElement("th");
        th.innerHTML="Descrizione";
        tr.appendChild(th);

        var th=document.createElement("th");
        th.setAttribute("style","display:flex;flex-direction:row;align-items:center;justify-content:flex-start");
        var span=document.createElement("span");
        span.innerHTML="Famiglia: ";
        th.appendChild(span);
        var select=document.createElement("select");
        select.setAttribute("onchange","document.getElementById('popupScegliMaterialiSearch').value='';cercaPopupScegliMateriali([2],this)");
        select.setAttribute("id","selectFiltraFamigliaPopupFiltraMateriali");
        select.setAttribute("style","background-color:#4d4d4d;border:none;outline:none;margin:0px;padding:0px;font-family:'Montserrat',sans-serif;color:#ddd;font-size:12px");
        var option=document.createElement("option");
        option.setAttribute("value","");
        option.innerHTML="tutte";
        select.appendChild(option);
        nomi_raggruppamenti_materiali.forEach(nome_raggruppamento =>
        {
            if(nome_raggruppamento==null || nome_raggruppamento=="")
                nome_raggruppamento="Nessuna";
            var option=document.createElement("option");
            option.setAttribute("value",nome_raggruppamento);
            option.innerHTML=nome_raggruppamento;
            select.appendChild(option);
        });
        th.appendChild(select);
        tr.appendChild(th);    

        thead.appendChild(tr);

        table.appendChild(thead);

        var tbody=document.createElement("tbody");

        materiali.forEach(materiale =>
        {
            var tr=document.createElement("tr");
            tr.setAttribute("onclick","this.getElementsByTagName('input')[0].checked=!this.getElementsByTagName('input')[0].checked;checkMaterialiPopupMateriali()");

            var td=document.createElement("td");
            td.setAttribute("style","display: flex;flex-direction: row;align-items: center;justify-content: flex-start;");
            td.setAttribute("title",materiale.nome + " ("+materiale.um+")");
            var checkbox=document.createElement("input");
            checkbox.setAttribute("type","checkbox");
            checkbox.setAttribute("class","popup-scegli-materiali-checkbox");
            checkbox.setAttribute("style","margin:0px;margin-right:5px");
            checkbox.setAttribute("onchange","checkMaterialiPopupMateriali()");
            if(materiali_statistiche.includes(materiale.id_materiale))
                checkbox.setAttribute("checked","checked");
            checkbox.setAttribute("materiale",materiale.id_materiale);
            checkbox.setAttribute("onclick","disableCheckboxPopupScegliMateriali(event)");
            td.appendChild(checkbox);
            var span=document.createElement("span");
            span.setAttribute("style","margin-left:5px;");
            span.innerHTML=materiale.nome + " ("+materiale.um+")";
            td.appendChild(span);
            tr.appendChild(td);

            var td=document.createElement("td");
            td.innerHTML="<span>"+materiale.descrizione+"</span>";
            tr.appendChild(td);

            var td=document.createElement("td");
            if(materiale.nome_raggruppamento==null || materiale.nome_raggruppamento=="")
                td.innerHTML="<span style=''>Nessuna</span>";
            else
                td.innerHTML="<span style=''>"+materiale.nome_raggruppamento+"</span>";
            tr.appendChild(td);

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
    }
    
    checkboxContainer.appendChild(table);

    checkMaterialiPopupMateriali();
}
function getRaggruppamentiMateriali()
{
    return new Promise(function (resolve, reject) 
    {
        var id_commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;
        $.get("getComposizioneRaggruppamentiMaterialiCalcoloFabbisogno.php",{id_commessa},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
function getMateriali()
{
    return new Promise(function (resolve, reject) 
    {
        var id_commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;
        $.get("getMaterialiCalcoloFabbisogno.php",{id_commessa},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
function getGruppi()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getGruppiCalcoloFabbisogno.php",
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
function disableCheckboxPopupScegliMateriali(event)
{
    event.stopPropagation();
}
function cercaPopupScegliMateriali(cols,input)
{
    var value = input.value.toLowerCase();
    var i=0;

    var table = document.getElementById("checkboxTable");
    for (var i = 1, row; row = table.rows[i]; i++)
    {
        var remove=true;
        cols.forEach(j =>
        {
            var col = row.cells[j];
            if(col.getElementsByTagName("span")[0].innerHTML.toLowerCase().indexOf(value) > -1)
                remove=false;
        });
        if(remove)
        {
            row.style.display="none";
            row.cells[0].getElementsByTagName("input")[0].checked=false;
        }
        else
            row.style.display="";
    }
    checkMaterialiPopupMateriali();
}
async function getStatisticheMateriali()
{
    var oldScrollTop=0;
    if(document.getElementById("calcoloFabbisognoContainer")!=null)
    {
        oldScrollTop=document.getElementById("calcoloFabbisognoContainer").scrollTop;
    }

    if(visualizzazioneStatisticheMateriali=="table")
    {
        document.getElementById("btnVisualizzazioneStatisticheMaterialiTable").style.backgroundColor="rgb(76, 145, 203)";
        document.getElementById("btnVisualizzazioneStatisticheMaterialiTable").style.color="white";
        document.getElementById("btnVisualizzazioneStatisticheMaterialiChart").style.backgroundColor="";
        document.getElementById("btnVisualizzazioneStatisticheMaterialiChart").style.color="";
        document.getElementById('btnEsportaExcelStatisticheMateriali').style.display='';
        document.getElementById('btnTabellaStatisticheMaterialiDettagli').style.display='';
        document.getElementById('btnTabellaStatisticheMaterialiPivot').style.display='';
        
        if(tabellaStatisticheMateriali=="pivot")
        {
            document.getElementById("btnTabellaStatisticheMaterialiPivot").style.backgroundColor="rgb(76, 145, 203)";
            document.getElementById("btnTabellaStatisticheMaterialiPivot").style.color="white";
            document.getElementById("btnTabellaStatisticheMaterialiDettagli").style.backgroundColor="";
            document.getElementById("btnTabellaStatisticheMaterialiDettagli").style.color="";
        }
        else
        {
            document.getElementById("btnTabellaStatisticheMaterialiPivot").style.backgroundColor="";
            document.getElementById("btnTabellaStatisticheMaterialiPivot").style.color="";
            document.getElementById("btnTabellaStatisticheMaterialiDettagli").style.backgroundColor="rgb(76, 145, 203)";
            document.getElementById("btnTabellaStatisticheMaterialiDettagli").style.color="white";
        }
    }
    else
    {
        document.getElementById("btnVisualizzazioneStatisticheMaterialiTable").style.backgroundColor="";
        document.getElementById("btnVisualizzazioneStatisticheMaterialiTable").style.color="";
        document.getElementById("btnVisualizzazioneStatisticheMaterialiChart").style.backgroundColor="rgb(76, 145, 203)";
        document.getElementById("btnVisualizzazioneStatisticheMaterialiChart").style.color="white";
        document.getElementById('btnEsportaExcelStatisticheMateriali').style.display='none';
        document.getElementById('btnTabellaStatisticheMaterialiDettagli').style.display='none';
        document.getElementById('btnTabellaStatisticheMaterialiPivot').style.display='none';
    }
    
    setCookie('visualizzazioneStatisticheMateriali',visualizzazioneStatisticheMateriali);
    setCookie('tabellaStatisticheMateriali',tabellaStatisticheMateriali);

    var containerStatisticheMaterialiItems=document.getElementById("containerStatisticheMaterialiItems");
    containerStatisticheMaterialiItems.innerHTML="";

    if(raggruppamentoMateriali)
        var raggruppamenti=await getRaggruppamentiMateriali();
    else
        var materiali=await getMateriali();

    var materiali_statistiche_check_ids=[];
    if(raggruppamentoMateriali)
    {
        raggruppamenti.forEach(raggruppamento =>
        {
            materiali_statistiche_check_ids.push(raggruppamento.id_raggruppamento);
        });
    }
    else
    {
        materiali.forEach(materiale =>
        {
            materiali_statistiche_check_ids.push(materiale.id_materiale);
        });
    }
    var wrong_materiali_statistiche=true;
    materiali_statistiche_check_ids.forEach(id =>
    {
        if(materiali_statistiche.includes(id))
            wrong_materiali_statistiche=false;
    });
    if(wrong_materiali_statistiche)
        materiali_statistiche=[];

    if(document.getElementById("checkboxContainerPopupScegliMateriali")!=null)
    {
        materiali_statistiche=[];

        var checkboxes=document.getElementsByClassName("popup-scegli-materiali-checkbox");
        for (let index = 0; index < checkboxes.length; index++)
        {
            const checkbox = checkboxes[index];

            var id_materiale=checkbox.getAttribute("materiale");
            if(checkbox.checked)
                materiali_statistiche.push(parseInt(id_materiale));
        }
        Swal.close();
    }
    else
    {
        if(materiali_statistiche.length==0)
        {
            Swal.fire
            ({
                width:"100%",
                background:"transparent",
                title:"Caricamento in corso...",
                html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
                allowOutsideClick:false,
                showCloseButton:false,
                showConfirmButton:false,
                allowEscapeKey:false,
                showCancelButton:false,
                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
            });

            if(raggruppamentoMateriali)
            {
                var j=0;
                raggruppamenti.forEach(raggruppamento =>
                {
                    if(j<5)
                        materiali_statistiche.push(raggruppamento.id_raggruppamento);
                    j++;
                });
            }
            else
            {
                var j=0;
                materiali.forEach(materiale =>
                {
                    if(j<5)
                        materiali_statistiche.push(materiale.id_materiale);
                    j++;
                });
            }
        }
    }

    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    setCookie("materiali_statistiche",JSON.stringify(materiali_statistiche));

    var id_commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;
    var commessaObj=getFirstObjByPropValue(commesse,"id_commessa",id_commessa);
    var commessa=commessaObj.nome;

    var totaleCommessa=await getTotaleCommessa(id_commessa);

    if(materiali_statistiche.length==0)
    {
        Swal.fire
        ({
            icon:"error",
            background:"#404040",
            title: "Nessun materiale selezionato",
            showCloseButton:true,
            showConfirmButton:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
        });
    }
    else
    {
        if(visualizzazioneStatisticheMateriali=="table" && tabellaStatisticheMateriali=="pivot")
        {
            var innerContainer=document.createElement("div");
            innerContainer.setAttribute("id","innerContainerStatisticheMaterialiItems");
            innerContainer.setAttribute("style","height:"+document.getElementById('containerStatisticheMaterialiItems').offsetHeight+"px;width:"+document.getElementById('containerStatisticheMaterialiItems').offsetWidth+"px;overflow:hidden");

            destroyHots();
            
            document.getElementById("containerStatisticheMaterialiItems").innerHTML="";
            document.getElementById("containerStatisticheMaterialiItems").appendChild(innerContainer);

            var container=document.getElementById("innerContainerStatisticheMaterialiItems");
        
            statisticheMaterialiPivot=await getStatisticheMaterialiPivotData(materiali_statistiche,raggruppamentoMateriali);
            console.log(statisticheMaterialiPivot)
            statisticheMaterialiPivot.data.forEach(row =>
            {
                row.calcolato=parseFloat(row.calcolato).toFixed(2);
                row.progettato=parseFloat(row.progettato).toFixed(2);
                row.richiesto=parseFloat(row.richiesto).toFixed(2);
                row["delta_richiesto-calcolato"]=parseFloat(row["delta_richiesto-calcolato"]).toFixed(2);
                row["delta_calcolato-progettato"]=parseFloat(row["delta_calcolato-progettato"]).toFixed(2);
                row["delta_richiesto-progettato"]=parseFloat(row["delta_richiesto-progettato"]).toFixed(2);
            });
        
            Swal.close();
        
            if(statisticheMaterialiPivot.data.length>0)
            {
                function statisticheMaterialiCellRenderer(instance, td, row, col, prop, value, cellProperties)
                {
                    Handsontable.renderers.TextRenderer.apply(this, arguments);
                    if(prop=="note" && !raggruppamentoMateriali)
                    {
                        try {
                            var materiale=hot.getDataAtCell(row, 0);

                            var nNote=value;
                            td.innerHTML="";

                            var div=document.createElement("div");
                            div.setAttribute("style","display:flex;flex-direction:row;align-items:center;justify-content:flex-start;width:100%");

                            var span=document.createElement("span");
                            span.setAttribute("style","");
                            span.innerHTML=nNote+" note";
                            div.appendChild(span);

                            var button=document.createElement("button");
                            button.setAttribute("onclick","getPopupNoteMaterialiCommesse('"+materiale+"','"+commessa+"',getStatisticheMateriali)");
                            button.setAttribute("class","btn-aggiungi-nota-materiale-commessa");
                            button.innerHTML="<i class='fad fa-sticky-note'></i>";
                            div.appendChild(button);

                            td.appendChild(div);
                        } catch (error) {}
                    }
                    if(prop=="delta_richiesto-calcolato")
                    {
                        try {
                            var calcolato=hot.getDataAtCell(row, 3);
                            if(value<0 && calcolato!=0)
                            {
                                td.style.background="#e34208";
                                td.style.color="white";
                            }
                        } catch (error) {}
                    }
                    if(prop=="delta_calcolato-progettato")
                    {
                        try {
                            var calcolato=hot.getDataAtCell(row, 3);
                            if(value<0 && calcolato!=0)
                            {
                                td.style.background="#e34208";
                                td.style.color="white";
                            }
                        } catch (error) {}
                    }
                }
                Handsontable.renderers.registerRenderer('statisticheMaterialiCellRenderer', statisticheMaterialiCellRenderer);
        
                if(raggruppamentoMateriali)
                    var colWidths = [250,50 ,400,150,150,150,280,280,280];
                else
                    var colWidths = [300,400,50 ,200,150,150,150,280,280,280,150];

                hot = new Handsontable
                (
                    container,
                    {
                        data: statisticheMaterialiPivot.data,
                        rowHeaders: true,
                        manualColumnResize: true,
                        colHeaders: statisticheMaterialiPivot.colHeaders,
                        className: "htMiddle",
                        filters: true,
                        dropdownMenu: true,
                        headerTooltips: true,
                        language: 'it-IT',
                        contextMenu: true,
                        height:container.offsetHeight,
                        columnSorting: true,
                        colWidths,
                        columns:statisticheMaterialiPivot.columns,
                        beforeRemoveRow: () => 
                        {
                            return false;
                        },
                        beforeCreateRow: () => 
                        {
                            return false;
                        },
                        beforeChange: () => 
                        {
                            return false;
                        },
                        cells: function (row, col)
                        {
                            var cellProperties = {};
                            var data = this.instance.getData();
                            
                            cellProperties.renderer = "statisticheMaterialiCellRenderer";
                
                            return cellProperties;
                        },
                        afterDropdownMenuShow: (dropdownMenu) =>
                        {
                            document.getElementsByClassName("htUIMultipleSelectSearch")[0].getElementsByTagName("input")[0].addEventListener("click", function()
                            {
                                document.getElementsByClassName("htUIClearAll")[0].getElementsByTagName("a")[0].click();
                            });
                        }
                    }
                );
                hideHotDisplayLicenceInfo();
                $(".handsontable .changeType").css
                ({
                    "background": "#eee",
                    "border-radius": "0",
                    "border": "none",
                    "color": "#404040",
                    "font-size": "14px",
                    "line-height": "normal",
                    "padding": "0px",
                    "margin": "0px",
                    "float": "right"
                });
            }
        }
        else
        {
            var totaliMateriali=await getTotaliMateriali(id_commessa,materiali_statistiche,raggruppamentoMateriali);
            totaliMateriali.forEach(totaleMateriale =>
            {
                totaleMateriale.qnt=parseFloat(totaleMateriale.qnt.toFixed(2));
            });
        
            var cronologiaMateriali=await getCronologiaMateriali(id_commessa,materiali_statistiche,raggruppamentoMateriali);
            cronologiaMateriali.forEach(cronologiaMateriale =>
            {
                cronologiaMateriale.qnt=parseFloat(cronologiaMateriale.qnt.toFixed(2));
            });

            if(visualizzazioneStatisticheMateriali=="table" && tabellaStatisticheMateriali=="dettagli")
            {
                var tableStatisticheMateriali=document.createElement("table");
                tableStatisticheMateriali.setAttribute("id","tableStatisticheMateriali");
            }
            
            var rowsCronologiaMateriali=[];
            for (let index = 0; index < materiali_statistiche.length; index++)
            {
                if(visualizzazioneStatisticheMateriali=="table" && tabellaStatisticheMateriali=="dettagli")
                {
                    if(raggruppamentoMateriali)
                    {
                        var id_raggruppamento = materiali_statistiche[index];
                        var raggruppamento=getFirstObjByPropValue(raggruppamenti,"id_raggruppamento",id_raggruppamento);
                    }
                    else
                    {
                        var id_materiale = materiali_statistiche[index];
                        var materiale=getFirstObjByPropValue(materiali,"id_materiale",id_materiale);
                    }
    
                    if(index!=0)
                    {
                        var tr=document.createElement("tr");
                        var td=document.createElement("td");
                        td.setAttribute("colspan","5");
                        td.setAttribute("style","height:25px;border-left:none;border-right:none;border-top:2px solid black;border-bottom:2px solid black");
                        tr.appendChild(td);
                        tableStatisticheMateriali.appendChild(tr);
                    }
    
                    var tr=document.createElement("tr");
    
                    var td=document.createElement("td");
                    td.setAttribute("colspan","5");
                    td.setAttribute("style","text-align:center;font-weight:bold;background-color:rgb(76, 145, 203);color:white");
                    if(raggruppamentoMateriali)
                        td.innerHTML=raggruppamento.nome.toUpperCase()+" ("+raggruppamento.um+")";
                    else
                        td.innerHTML=materiale.nome.toUpperCase()+" ("+materiale.um+")";
                    tr.appendChild(td);
    
                    tableStatisticheMateriali.appendChild(tr);
    
                    var tr=document.createElement("tr");
    
                    var td=document.createElement("td");
                    td.setAttribute("style","background-color:rgb(76, 145, 203);color:white");
                    td.innerHTML="Totale";
                    tr.appendChild(td);
    
                    var td=document.createElement("td");
                    td.innerHTML="";
                    tr.appendChild(td);
    
                    var td=document.createElement("td");
                    td.setAttribute("style","color:#DA6969;font-weight:bold");
                    var value="0";
                    totaliMateriali.forEach(totale => 
                    {
                        if(raggruppamentoMateriali)
                        {
                            if(totale.raggruppamento==id_raggruppamento && totale.voce=="calcolato")
                                value=totale.qnt;
                        }
                        else
                        {
                            if(totale.materiale==id_materiale && totale.voce=="calcolato")
                                value=totale.qnt;
                        }
                    });
                    td.innerHTML=value;
                    tr.appendChild(td);
    
                    var td=document.createElement("td");
                    td.setAttribute("style","color:#DA6969;font-weight:bold");
                    var value="0";
                    totaliMateriali.forEach(totale => 
                    {
                        if(raggruppamentoMateriali)
                        {
                            if(totale.raggruppamento==id_raggruppamento && totale.voce=="richiesto")
                                value=totale.qnt;
                        }
                        else
                        {
                            if(totale.materiale==id_materiale && totale.voce=="richiesto")
                                value=totale.qnt;
                        }
                    });
                    td.innerHTML=value;
                    tr.appendChild(td);
    
                    var td=document.createElement("td");
                    td.setAttribute("style","color:#DA6969;font-weight:bold");
                    var value="0";
                    totaliMateriali.forEach(totale => 
                    {
                        if(raggruppamentoMateriali)
                        {
                            if(totale.raggruppamento==id_raggruppamento && totale.voce=="progettato")
                                value=totale.qnt;
                        }
                        else
                        {
                            if(totale.materiale==id_materiale && totale.voce=="progettato")
                                value=totale.qnt;
                        }
                    });
                    td.innerHTML=value;
                    tr.appendChild(td);
    
                    tableStatisticheMateriali.appendChild(tr);
    
                    var tr=document.createElement("tr");
    
                    var td=document.createElement("td");
                    td.setAttribute("style","background-color:rgb(76, 145, 203);color:white");
                    td.innerHTML="Voce";
                    tr.appendChild(td);
    
                    var td=document.createElement("td");
                    td.innerHTML="";
                    tr.appendChild(td);
    
                    var td=document.createElement("td");
                    td.setAttribute("style","color:rgb(76, 145, 203);font-weight:bold");
                    td.innerHTML="Calcolato";
                    tr.appendChild(td);
    
                    var td=document.createElement("td");
                    td.setAttribute("style","color:rgb(76, 145, 203);font-weight:bold");
                    td.innerHTML="Richiesto";
                    tr.appendChild(td);
    
                    var td=document.createElement("td");
                    td.setAttribute("style","color:rgb(76, 145, 203);font-weight:bold");
                    td.innerHTML="Progettato";
                    tr.appendChild(td);
                    
                    tableStatisticheMateriali.appendChild(tr);
    
                    var addTdDettagli=true;
                    var rowsCronologiaMaterialiItem=0;
    
                    cronologiaMateriali.forEach(cronologiaMateriale => 
                    {
                        if(raggruppamentoMateriali)
                        {
                            if(cronologiaMateriale.id_raggruppamento==id_raggruppamento)
                            {
                                var tr=document.createElement("tr");
                                if(addTdDettagli)
                                {
                                    var tdDettagli=document.createElement("td");
                                    tdDettagli.innerHTML="Dettagli";
                                    tdDettagli.setAttribute("id","tdDettagliTableStatisticheMateriali"+id_raggruppamento);
                                    tdDettagli.setAttribute("style","background-color:rgb(76, 145, 203);color:white");
                                    tr.appendChild(tdDettagli);
                                    addTdDettagli=false;
                                }
    
                                var td=document.createElement("td");
                                td.innerHTML=cronologiaMateriale.dataOraString;
                                tr.appendChild(td);
    
                                var td=document.createElement("td");
                                if(cronologiaMateriale.voce=="calcolato")
                                    td.innerHTML=cronologiaMateriale.qnt;
                                else
                                    td.innerHTML="0";
                                tr.appendChild(td);
    
                                var td=document.createElement("td");
                                if(cronologiaMateriale.voce=="richiesto")
                                    td.innerHTML=cronologiaMateriale.qnt;
                                else
                                    td.innerHTML="0";
                                tr.appendChild(td);
    
                                var td=document.createElement("td");
                                if(cronologiaMateriale.voce=="progettato")
                                    td.innerHTML=cronologiaMateriale.qnt;
                                else
                                    td.innerHTML="0";
                                tr.appendChild(td);
                                tableStatisticheMateriali.appendChild(tr);
                                rowsCronologiaMaterialiItem++;
                            }
                        }
                        else
                        {
                            if(cronologiaMateriale.materiale==id_materiale)
                            {
                                var tr=document.createElement("tr");
                                if(addTdDettagli)
                                {
                                    var tdDettagli=document.createElement("td");
                                    tdDettagli.innerHTML="Dettagli";
                                    tdDettagli.setAttribute("style","background-color:rgb(76, 145, 203);color:white");
                                    tdDettagli.setAttribute("id","tdDettagliTableStatisticheMateriali"+id_materiale);
                                    tr.appendChild(tdDettagli);
                                    addTdDettagli=false;
                                }
    
                                var td=document.createElement("td");
                                td.innerHTML=cronologiaMateriale.dataOraString;
                                tr.appendChild(td);
    
                                var td=document.createElement("td");
                                if(cronologiaMateriale.voce=="calcolato")
                                    td.innerHTML=cronologiaMateriale.qnt;
                                else
                                    td.innerHTML="0";
                                tr.appendChild(td);
    
                                var td=document.createElement("td");
                                if(cronologiaMateriale.voce=="richiesto")
                                    td.innerHTML=cronologiaMateriale.qnt;
                                else
                                    td.innerHTML="0";
                                tr.appendChild(td);
    
                                var td=document.createElement("td");
                                if(cronologiaMateriale.voce=="progettato")
                                    td.innerHTML=cronologiaMateriale.qnt;
                                else
                                    td.innerHTML="0";
                                tr.appendChild(td);  
                                tableStatisticheMateriali.appendChild(tr);
                                rowsCronologiaMaterialiItem++;
                            }
                        }
                    });
                    if(raggruppamentoMateriali)
                    {
                        var id_raggruppamento = materiali_statistiche[index];
                        rowsCronologiaMateriali[id_raggruppamento]=rowsCronologiaMaterialiItem;
                    }
                    else
                    {
                        var id_materiale = materiali_statistiche[index];
                        rowsCronologiaMateriali[id_materiale]=rowsCronologiaMaterialiItem;
                    }
                }
                else
                {
                    if(raggruppamentoMateriali)
                    {
                        var id_raggruppamento = materiali_statistiche[index];
                        var raggruppamento=getFirstObjByPropValue(raggruppamenti,"id_raggruppamento",id_raggruppamento);
                    }
                    else
                    {
                        var id_materiale = materiali_statistiche[index];
                        var materiale=getFirstObjByPropValue(materiali,"id_materiale",id_materiale);
                    }
                    var check=false;
                    if(raggruppamentoMateriali)
                    {
                        if(raggruppamento!=undefined)
                            check=true;
                    }
                    else
                    {
                        if(materiale!=undefined)
                            check=true;
                    }
                    if(check)
                    {
                        var outerContainer=document.createElement("div");
                        outerContainer.setAttribute("class","statistiche-materiali-item-outer-container");
    
                        var infoMaterialeContainer=document.createElement("div");
                        infoMaterialeContainer.setAttribute("class","statistiche-materiali-item-info-materiale-container");
    
                        var div=document.createElement("div");
                        div.setAttribute("style","width:calc(100% / 3);display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;height: 55px;max-height: 55px;min-height: 55px;box-sizing:border-box;padding:10px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;");
    
                        var span=document.createElement("span");
                        span.setAttribute("style","color:#4C91CB;letter-spacing: 1px");
                        if(raggruppamentoMateriali)
                            span.innerHTML="<b style='text-transform:uppercase'>"+raggruppamento.nome+"</b> ("+raggruppamento.um+")";
                        else
                            span.innerHTML="<b style='text-transform:uppercase'>"+materiale.nome+"</b> ("+materiale.um+")";
                        div.appendChild(span);     
                        
                        if(raggruppamentoMateriali)
                        {
                            var span=document.createElement("span");
                            span.setAttribute("style","margin-top:5px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;");
                            var nomiMateriali=[];
                            raggruppamento.materiali.forEach(materiale =>
                            {
                                nomiMateriali.push(materiale.nome);
                            });
                            span.innerHTML=nomiMateriali.toString();
                            div.appendChild(span);
                        }
                        else
                        {
                            if(materiale.descrizione!="" && materiale.descrizione!="NULL" && materiale.descrizione!=null)
                            {
                                var span=document.createElement("span");
                                span.setAttribute("style","margin-top:5px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;")
                                span.innerHTML=materiale.descrizione;
                                div.appendChild(span);
                            }
                        }
    
                        infoMaterialeContainer.appendChild(div);
    
                        var buttonsContainer=document.createElement("div");
                        buttonsContainer.setAttribute("class","statistiche-materiali-item-buttons-container");
    
                        if(!raggruppamentoMateriali)
                        {
                            var button=document.createElement("button");
                            button.setAttribute("onclick","getPopupRichiestaMateriale(null,"+materiale.id_materiale+")");
                            button.setAttribute("class","statistiche-materiali-item-button");
                            var span=document.createElement("span");
                            span.innerHTML="Nuova Richiesta";
                            button.appendChild(span);
                            var i=document.createElement("i");
                            i.setAttribute("class","fad fa-layer-plus");
                            button.appendChild(i);
                            buttonsContainer.appendChild(button);
    
                            /*var button=document.createElement("button");
                            button.setAttribute("onclick","getPopupRicalcolaFabbisogno("+id_materiale+",'"+materiale.nome+"','"+materiale.um+"')");
                            button.setAttribute("class","statistiche-materiali-item-button");
                            var span=document.createElement("span");
                            span.innerHTML="Ricalcola Fabbisogno";
                            button.appendChild(span);
                            var i=document.createElement("i");
                            i.setAttribute("class","fad fa-calculator-alt");
                            button.appendChild(i);
                            buttonsContainer.appendChild(button);*/
                        }
                        
                        infoMaterialeContainer.appendChild(buttonsContainer);
    
                        var chartContainer=document.createElement("div");
                        chartContainer.setAttribute("class","statistiche-materiali-item-pie-chart-container");
                        if(raggruppamentoMateriali)
                            chartContainer.setAttribute("id","pieChartContainer_"+raggruppamento.id_raggruppamento);
                        else
                            chartContainer.setAttribute("id","pieChartContainer_"+materiale.id_materiale);
    
                        infoMaterialeContainer.appendChild(chartContainer);
    
                        var calcolato=0;
                        var richiesto=0;
                        var progettato=0;
                        var um="";

                        var div=document.createElement("div");
                        div.setAttribute("style","display:flex;flex-direction:column;align-items:flex-start;justify-content:center;height: 55px;max-height: 55px;min-height: 55px;box-sizing:border-box;padding-right:10px;padding-left:10px");
    
                        totaliMateriali.forEach(totale => 
                        {
                            if(raggruppamentoMateriali)
                            {
                                if(totale.raggruppamento==id_raggruppamento)
                                {
                                    var span=document.createElement("span");
                                    span.setAttribute("style","text-transform: capitalize;text-shadow: 2px 4px 3px rgba(0,0,0,0.3);white-space: nowrap;overflow: hidden;text-overflow: ellipsis;color:"+totale.colore);
                                    if(totale.voce=="progettato")
                                    {
                                        progettato=totale.qnt;
                                        span.innerHTML=totale.voce+" <b style='letter-spacing: 1px;'>"+totale.qnt.toFixed(2)+"</b> "+raggruppamento.um+" ("+totaleCommessa.n_cabine+"/"+totaleCommessa.cabine_totali+") cabine";
                                    }
                                    else
                                    {
                                        if(totale.voce=="calcolato")
                                            calcolato=totale.qnt;
                                        else
                                            richiesto=totale.qnt;
                                        span.innerHTML=totale.voce+" <b style='letter-spacing: 1px;'>"+totale.qnt.toFixed(2)+"</b> "+raggruppamento.um;
                                    }
                                    um=raggruppamento.um;
                                    div.appendChild(span);
                                }
                            }
                            else
                            {
                                if(totale.materiale==id_materiale)
                                {
                                    var span=document.createElement("span");
                                    span.setAttribute("style","text-transform: capitalize;text-shadow: 2px 4px 3px rgba(0,0,0,0.3);white-space: nowrap;overflow: hidden;text-overflow: ellipsis;color:"+totale.colore);
                                    if(totale.voce=="progettato")
                                    {
                                        progettato=totale.qnt;
                                        span.innerHTML=totale.voce+" <b style='letter-spacing: 1px;'>"+totale.qnt.toFixed(2)+"</b> "+materiale.um+" ("+totaleCommessa.n_cabine+"/"+totaleCommessa.cabine_totali+") cabine";
                                    }
                                    else
                                    {
                                        if(totale.voce=="calcolato")
                                            calcolato=totale.qnt;
                                        else
                                            richiesto=totale.qnt;
                                        span.innerHTML=totale.voce+" <b style='letter-spacing: 1px;'>"+totale.qnt.toFixed(2)+"</b> "+materiale.um;
                                    }
                                    um=materiale.um;
                                    div.appendChild(span);
                                }
                            }
                        });
    
                        infoMaterialeContainer.appendChild(div);

                        var delta_1=richiesto-calcolato;
                        var delta_2=calcolato-progettato;
                        var delta_3=richiesto-progettato;
                        if(parseFloat(delta_1)<0 && calcolato>0)
                            var colorDelta1="#e34208";
                        else
                            var colorDelta1="#ddd";
                        if(parseFloat(delta_2)<0 && calcolato>0)
                            var colorDelta2="#e34208";
                        else
                            var colorDelta2="#ddd";
                        if(parseFloat(delta_3)<0 && calcolato>0)
                            var colorDelta3="#e34208";
                        else
                            var colorDelta3="#ddd";

                        var div=document.createElement("div");
                        div.setAttribute("style","display:flex;flex-direction:column;align-items:flex-start;justify-content:center;height: 55px;max-height: 55px;min-height: 55px;box-sizing:border-box;padding-right:10px;padding-left:10px");
                        var span=document.createElement("span");
                        span.setAttribute("title","Delta richiesto-calcolato");
                        span.setAttribute("style","text-transform: capitalize;text-shadow: 2px 4px 3px rgba(0,0,0,0.3);white-space: nowrap;overflow: hidden;text-overflow: ellipsis;color:#ddd");
                        span.innerHTML="Delta richiesto-calcolato <b style='letter-spacing: 1px;color:"+colorDelta1+"'>"+delta_1.toFixed(2)+"</b> "+um;
                        div.appendChild(span);
                        var span=document.createElement("span");
                        span.setAttribute("title","Delta calcolato-progettato");
                        span.setAttribute("style","text-transform: capitalize;text-shadow: 2px 4px 3px rgba(0,0,0,0.3);white-space: nowrap;overflow: hidden;text-overflow: ellipsis;color:#ddd");
                        span.innerHTML="Delta calcolato-progettato <b style='letter-spacing: 1px;color:"+colorDelta2+"'>"+delta_2.toFixed(2)+"</b> "+um;
                        div.appendChild(span);
                        var span=document.createElement("span");
                        span.setAttribute("title","Delta richiesto-progettato");
                        span.setAttribute("style","text-transform: capitalize;text-shadow: 2px 4px 3px rgba(0,0,0,0.3);white-space: nowrap;overflow: hidden;text-overflow: ellipsis;color:#ddd");
                        span.innerHTML="Delta richiesto-progettato <b style='letter-spacing: 1px;color:"+colorDelta3+"'>"+delta_3.toFixed(2)+"</b> "+um;
                        div.appendChild(span);
                        infoMaterialeContainer.appendChild(div);
    
                        outerContainer.appendChild(infoMaterialeContainer);
    
                        var innerContainer=document.createElement("div");
                        innerContainer.setAttribute("class","statistiche-materiali-item-inner-container");
    
                        var historyContainer=document.createElement("div");
                        historyContainer.setAttribute("class","statistiche-materiali-item-history-container");
                        
                        var title=document.createElement("div");
                        title.setAttribute("class","statistiche-materiali-item-history-title");
    
                        var i=document.createElement("i");
                        i.setAttribute("class","fad fa-history");
                        title.appendChild(i);
    
                        var span=document.createElement("span");
                        span.innerHTML="Cronologia";
                        title.appendChild(span);  
    
                        historyContainer.appendChild(title);
    
                        var ul=document.createElement("ul");
                        ul.setAttribute("class","statistiche-materiali-item-history-list");
                        
                        //cronologiaMaterialiReverse=cronologiaMateriali.reverse();
                        
                        for(j = (cronologiaMateriali.length-1) ; j >= 0 ; j--) 
                        {
                            cronologiaMateriale=cronologiaMateriali[j];
                        //cronologiaMaterialiReverse.forEach(cronologiaMateriale => 
                        //{
                            if(raggruppamentoMateriali)
                            {
                                if(cronologiaMateriale.id_raggruppamento==id_raggruppamento)
                                {
                                    var li=document.createElement("li");
                                    li.setAttribute("style","text-shadow: 2px 4px 3px rgba(0,0,0,0.3);letter-spacing: 1px;color:"+cronologiaMateriale.colore);
    
                                    var i=document.createElement("i");
                                    i.setAttribute("class","fas fa-circle");
                                    i.setAttribute("style","font-size:5px;margin-right:10px");
                                    li.appendChild(i);
    
                                    var span=document.createElement("span");
                                    span.innerHTML="<b>"+cronologiaMateriale.qnt.toFixed(2)+"</b> "+cronologiaMateriale.um+" "+cronologiaMateriale.voce;
                                    li.appendChild(span);
    
                                    var span=document.createElement("span");
                                    span.setAttribute("style","margin-left:auto");
                                    span.innerHTML=cronologiaMateriale.dataOraString;
                                    li.appendChild(span);
    
                                    ul.appendChild(li);     
                                }
                            }
                            else
                            {
                                if(cronologiaMateriale.materiale==id_materiale)
                                {
                                    var li=document.createElement("li");
                                    li.setAttribute("style","text-shadow: 2px 4px 3px rgba(0,0,0,0.3);letter-spacing: 1px;color:"+cronologiaMateriale.colore);
    
                                    var i=document.createElement("i");
                                    i.setAttribute("class","fas fa-circle");
                                    i.setAttribute("style","font-size:5px;margin-right:10px");
                                    li.appendChild(i);
    
                                    var span=document.createElement("span");
                                    span.innerHTML="<b>"+cronologiaMateriale.qnt.toFixed(2)+"</b> "+cronologiaMateriale.um+" "+cronologiaMateriale.voce;
                                    li.appendChild(span);
    
                                    var span=document.createElement("span");
                                    span.setAttribute("style","margin-left:auto");
                                    span.innerHTML=cronologiaMateriale.dataOraString;
                                    li.appendChild(span);
    
                                    ul.appendChild(li);     
                                }
                            }
                        }//);
    
                        historyContainer.appendChild(ul);
    
                        var totaliGruppiOuterContainer=document.createElement("div");
                        totaliGruppiOuterContainer.setAttribute("class","statistiche-materiali-item-totali-gruppi-outer-container");
    
                        var filterContainer=document.createElement("div");
                        filterContainer.setAttribute("class","statistiche-materiali-item-totali-gruppi-filter-container");
                        
                        var button=document.createElement("button");
                        if(raggruppamentoMateriali)
                        {
                            button.setAttribute("onclick","getTotaliGruppiPieChart("+raggruppamento.id_raggruppamento+",'"+raggruppamento.um+"','%')");
                            button.setAttribute("class","statistiche-materiali-item-totali-gruppi-filter-button-"+raggruppamento.id_raggruppamento);
                            button.setAttribute("id","gruppiFilterButtontutti"+raggruppamento.id_raggruppamento);
                        }
                        else
                        {
                            button.setAttribute("onclick","getTotaliGruppiPieChart("+materiale.id_materiale+",'"+materiale.um+"','%')");
                            button.setAttribute("class","statistiche-materiali-item-totali-gruppi-filter-button-"+materiale.id_materiale);
                            button.setAttribute("id","gruppiFilterButtontutti"+materiale.id_materiale);
                        }
                        
                        var span=document.createElement("span");
                        span.innerHTML="Tutte le voci";
                        button.appendChild(span);
                        filterContainer.appendChild(button);
    
                        var button=document.createElement("button");
                        if(raggruppamentoMateriali)
                        {
                            button.setAttribute("onclick","getTotaliGruppiPieChart("+raggruppamento.id_raggruppamento+",'"+raggruppamento.um+"','richiesto')");
                            button.setAttribute("class","statistiche-materiali-item-totali-gruppi-filter-button-"+raggruppamento.id_raggruppamento);
                            button.setAttribute("id","gruppiFilterButtonrichiesto"+raggruppamento.id_raggruppamento);
                        }
                        else
                        {
                            button.setAttribute("onclick","getTotaliGruppiPieChart("+materiale.id_materiale+",'"+materiale.um+"','richiesto')");
                            button.setAttribute("class","statistiche-materiali-item-totali-gruppi-filter-button-"+materiale.id_materiale);
                            button.setAttribute("id","gruppiFilterButtonrichiesto"+materiale.id_materiale);
                        }
                        
                        var span=document.createElement("span");
                        span.innerHTML="Richiesto";
                        button.appendChild(span);
                        filterContainer.appendChild(button);
    
                        var button=document.createElement("button");
                        if(raggruppamentoMateriali)
                        {
                            button.setAttribute("onclick","getTotaliGruppiPieChart("+raggruppamento.id_raggruppamento+",'"+raggruppamento.um+"','calcolato')");
                            button.setAttribute("class","statistiche-materiali-item-totali-gruppi-filter-button-"+raggruppamento.id_raggruppamento);
                            button.setAttribute("id","gruppiFilterButtoncalcolato"+raggruppamento.id_raggruppamento);
                        }
                        else
                        {
                            button.setAttribute("onclick","getTotaliGruppiPieChart("+materiale.id_materiale+",'"+materiale.um+"','calcolato')");
                            button.setAttribute("class","statistiche-materiali-item-totali-gruppi-filter-button-"+materiale.id_materiale);
                            button.setAttribute("id","gruppiFilterButtoncalcolato"+materiale.id_materiale);
                        }
                        
                        var span=document.createElement("span");
                        span.innerHTML="Calcolato";
                        button.appendChild(span);
                        filterContainer.appendChild(button);
    
                        totaliGruppiOuterContainer.appendChild(filterContainer);
                        
                        var totaliGruppiChartContainer=document.createElement("div");
                        totaliGruppiChartContainer.setAttribute("class","statistiche-materiali-item-totali-gruppi-inner-container");
                        if(raggruppamentoMateriali)
                            totaliGruppiChartContainer.setAttribute("id","totaliGruppiPieChartContainer_"+raggruppamento.id_raggruppamento);
                        else
                            totaliGruppiChartContainer.setAttribute("id","totaliGruppiPieChartContainer_"+materiale.id_materiale);
                        totaliGruppiOuterContainer.appendChild(totaliGruppiChartContainer);
    
                        historyContainer.appendChild(totaliGruppiOuterContainer);
    
                        innerContainer.appendChild(historyContainer);
    
                        var graficiContainer=document.createElement("div");
                        graficiContainer.setAttribute("class","statistiche-materiali-item-grafici-container");
    
                        var barChartOuterContainer=document.createElement("div");
                        barChartOuterContainer.setAttribute("class","statistiche-materiali-item-bar-chart-container");
    
                        var barChartInnerContainer=document.createElement("div");
                        barChartInnerContainer.setAttribute("class","statistiche-materiali-item-bar-chart-inner-container");
                        if(raggruppamentoMateriali)
                            barChartInnerContainer.setAttribute("id","barChartContainer_"+raggruppamento.id_raggruppamento);
                        else
                            barChartInnerContainer.setAttribute("id","barChartContainer_"+materiale.id_materiale);
                        barChartOuterContainer.appendChild(barChartInnerContainer);
    
                        graficiContainer.appendChild(barChartOuterContainer);
    
                        var lineChartOuterContainer=document.createElement("div");
                        lineChartOuterContainer.setAttribute("class","statistiche-materiali-item-line-chart-container");
    
                        var lineChartInnerContainer=document.createElement("div");
                        lineChartInnerContainer.setAttribute("class","statistiche-materiali-item-line-chart-inner-container");
                        if(raggruppamentoMateriali)
                            lineChartInnerContainer.setAttribute("id","lineChartContainer_"+raggruppamento.id_raggruppamento);
                        else
                            lineChartInnerContainer.setAttribute("id","lineChartContainer_"+materiale.id_materiale);
                        lineChartOuterContainer.appendChild(lineChartInnerContainer);
    
                        graficiContainer.appendChild(lineChartOuterContainer);
    
                        innerContainer.appendChild(graficiContainer);
    
                        outerContainer.appendChild(innerContainer);
                        
                        containerStatisticheMaterialiItems.appendChild(outerContainer);
    
                        if(raggruppamentoMateriali)
                        {
                            getPieChart(raggruppamento.id_raggruppamento,totaliMateriali);
                            getBarChart(raggruppamento,totaliMateriali,id_raggruppamento);
                            getLineChart(raggruppamento,cronologiaMateriali,id_raggruppamento);
                            getTotaliGruppiPieChart(raggruppamento.id_raggruppamento,raggruppamento.um,'%');
                        }
                        else
                        {
                            getPieChart(materiale.id_materiale,totaliMateriali);
                            getBarChart(materiale,totaliMateriali,id_materiale);
                            getLineChart(materiale,cronologiaMateriali,id_materiale);
                            getTotaliGruppiPieChart(materiale.id_materiale,materiale.um,'%');
                        }
                    }
                }
            }
            if(visualizzazioneStatisticheMateriali=="table" && tabellaStatisticheMateriali=="dettagli")
            {
                containerStatisticheMaterialiItems.appendChild(tableStatisticheMateriali);
                for (let index = 0; index < materiali_statistiche.length; index++)
                {
                    if(visualizzazioneStatisticheMateriali=="table")
                    {
                        if(raggruppamentoMateriali)
                        {
                            var id_raggruppamento = materiali_statistiche[index];
                            try {document.getElementById("tdDettagliTableStatisticheMateriali"+id_raggruppamento).setAttribute("rowspan",rowsCronologiaMateriali[id_raggruppamento]);} catch (error) {}
                        }
                        else
                        {
                            var id_materiale = materiali_statistiche[index];
                            try {document.getElementById("tdDettagliTableStatisticheMateriali"+id_materiale).setAttribute("rowspan",rowsCronologiaMateriali[id_materiale]);} catch (error) {}
                        }
                    }
                }
                var table = document.getElementById("tableStatisticheMateriali");
                for (var i = 0, row; row = table.rows[i]; i++) 
                {
                    for (var j = 0, col; col = row.cells[j]; j++)
                    {
                        if(col.style.borderLeft!="none")
                        {
                            if(j==0)
                                col.style.borderLeft="2px solid black";
                            if(j==row.cells.length-1)
                                col.style.borderRight="2px solid black";
                        }
                    }  
                 }
            }
            Swal.close();
        }
    }

    document.getElementById("calcoloFabbisognoContainer").scrollTop = oldScrollTop;
}
function getTotaleCommessa(id_commessa)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getTotaleCommessaCalcoloFabbisogno.php",{id_commessa},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
async function applicaFiltroGruppo(id_materiale,id_gruppo)
{
    /*var id_commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;

    var totaliMateriali=await getTotaliMateriali(id_commessa,materiali_statistiche);
    var totaliMaterialiFiltrato=[];
    totaliMateriali.forEach(totale => 
    {
        if(totale.gruppo==materiale.id_materiale)
        {
            totaliMaterialiFiltrato.push(totale);
        }
    });*/
}
async function getPopupRicalcolaFabbisogno(id_materiale,nome,um)
{
    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    var id_commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","dark-popup-outer-container");

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Gruppo";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var select=document.createElement("select");
    select.setAttribute("class","dark-popup-select");
    select.setAttribute("id","popupInserimentoFabbisognoGruppo");

    var gruppi=await getGruppi();
    gruppi.forEach(gruppo =>
    {
        var option=document.createElement("option");
        option.setAttribute("value",gruppo.id_gruppo);
        option.innerHTML=gruppo.nome;
        select.appendChild(option);
    });
    
    row.appendChild(select);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Materiale";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var select=document.createElement("select");
    select.setAttribute("class","dark-popup-select");
    select.setAttribute("id","popupInserimentoFabbisognoMateriale");
    
    var option=document.createElement("option");
    option.setAttribute("value",id_materiale);
    option.innerHTML=nome+" ("+um+")";
    select.appendChild(option);

    row.appendChild(select);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Qnt";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("class","dark-popup-input");input.setAttribute("type","number");
    input.setAttribute("id","popupInserimentoFabbisognoQnt");
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Altezza sviluppo";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("class","dark-popup-input");input.setAttribute("type","number");
    input.setAttribute("id","popupInserimentoFabbisognoAltezza_sviluppo");
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Note";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var textarea=document.createElement("textarea");
    textarea.setAttribute("class","dark-popup-textarea");
    textarea.setAttribute("id","popupInserimentoFabbisognoNote");
    
    row.appendChild(textarea);

    outerContainer.appendChild(row);
    
    var row=document.createElement("div");
    row.setAttribute("class","dark-popup-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:10px");

    var confirmButton=document.createElement("button");
    confirmButton.setAttribute("class","dark-popup-button");
    confirmButton.setAttribute("style","width:100%;");
    confirmButton.setAttribute("onclick","inserisciRigaDatiImportazioniFabbisogni('statistiche_materiali')");
    confirmButton.innerHTML='<span>Conferma</span><i class="fal fa-check-circle"></i>';
    row.appendChild(confirmButton);    

    outerContainer.appendChild(row);

    Swal.fire
    ({
        background:"#404040",
        title:"Inserimento fabbisogno",
        html:outerContainer.outerHTML,
        allowOutsideClick:true,
        showCloseButton:true,
        showConfirmButton:true,
        allowEscapeKey:true,
        showCancelButton:false,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                    document.getElementsByClassName("swal2-title")[0].style.fontSize="12px";
                    document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                    document.getElementsByClassName("swal2-title")[0].style.width="100%";
                    document.getElementsByClassName("swal2-title")[0].style.textDecoration="underline";
                    document.getElementsByClassName("swal2-close")[0].style.width="40px";
                    document.getElementsByClassName("swal2-close")[0].style.height="40px";
                    document.getElementsByClassName("swal2-title")[0].style.margin="0px";
                    document.getElementsByClassName("swal2-title")[0].style.marginTop="5px";
                    document.getElementsByClassName("swal2-title")[0].style.fontFamily="'Montserrat',sans-serif";
                    document.getElementsByClassName("swal2-title")[0].style.textAlign="left";
                    document.getElementsByClassName("swal2-confirm")[0].style.display="none";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingBottom="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingRight="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingLeft="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingTop="10px";
                    document.getElementsByClassName("swal2-header")[0].style.paddingLeft="20px";
                    document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-actions")[0].style.margin="0px";

                    $("#popupInserimentoFabbisognoMateriale").multipleSelect(
                    {
                        single:true,
                        onAfterCreate: function () 
                                {
                                    $(".ms-choice").css({"height":"30px","line-height":"30px","background-color":"transparent","border":"none"});
                                    $(".ms-choice span").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left","color":"#ddd"});
                                },
                        onOpen:function()
                        {
                            $(".ms-search input").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                            $(".optgroup").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                            $(".ms-drop ul").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
                        },
                        filter:true,
                        filterPlaceholder:"Cerca...",
                        locale:"it-IT"
                    });
                }
    });
}
async function getTotaliGruppiPieChart(id,um,voce)
{
    $(".statistiche-materiali-item-totali-gruppi-filter-button-"+id).css({"background-color":"","border":"","color":""});
    if(voce!=="%")
        $("#gruppiFilterButton"+voce+id).css({"background-color":"#4C91CB","border":"1px solid #4C91CB","color":"white"});
    else
        $("#gruppiFilterButtontutti"+id).css({"background-color":"#4C91CB","border":"1px solid #4C91CB","color":"white"});

    document.getElementById("totaliGruppiPieChartContainer_"+id).innerHTML="<i class='fad fa-spinner-third fa-spin'></i>";

    var id_commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;

    var totaliGruppi=await getTotaliGruppi(id_commessa,id,voce);

    document.getElementById("totaliGruppiPieChartContainer_"+id).innerHTML="";
    
    var dataPoints=[];
    totaliGruppi.forEach(totale => 
    {
        if(raggruppamentoMateriali)
        {
            if(totale.raggruppamento==id)
            {
                var dataPoint=
                {
                    y:totale.qnt.toFixed(2),
                    label:totale.nome,
                    indexLabelFormatter: function (e) { return  e.dataPoint.label + ": " + e.dataPoint.y + " " + um; } 
                }
                dataPoints.push(dataPoint);
            }
        }
        else
        {
            if(totale.materiale==id)
            {
                var dataPoint=
                {
                    y:totale.qnt.toFixed(2),
                    label:totale.nome,
                    indexLabelFormatter: function (e) { return  e.dataPoint.label + ": " + e.dataPoint.y + " " + um; } 
                }
                dataPoints.push(dataPoint);
            }
        }
    });

    var chart = new CanvasJS.Chart("totaliGruppiPieChartContainer_"+id,
    {
        backgroundColor:"transparent",
        animationEnabled: true,
        toolTip:{
            enabled: true,
          },
        data: [{
            type: "doughnut",
            indexLabelFontFamily: "'Montserrat',sans-serif",
            indexLabelFontColor:"#ddd",
            indexLabelFontSize:12,
            radius: "100%", 
            innerRadius: "80%",
            dataPoints
        }]
    });
    chart.render();
}
async function getPieChart(id,totaliMateriali)
{
    var dataPoints=[];

    if(raggruppamentoMateriali)
    {
        totaliMateriali.forEach(totale => 
        {
            if(totale.raggruppamento==id)
            {
                var dataPoint=
                {
                    y:totale.qnt.toFixed(2),
                    name:totale.voce,
                    color:totale.colore
                }
                dataPoints.push(dataPoint);
            }
        });
    }
    else
    {
        totaliMateriali.forEach(totale => 
        {
            if(totale.materiale==id)
            {
                var dataPoint=
                {
                    y:totale.qnt.toFixed(2),
                    name:totale.voce,
                    color:totale.colore
                }
                dataPoints.push(dataPoint);
            }
        });
    }

    var chart = new CanvasJS.Chart("pieChartContainer_"+id,
    {
        backgroundColor:"transparent",
        animationEnabled: true,
        toolTip:{
            enabled: false,
          },
        data: [{
            type: "doughnut",
            radius: "100%", 
            innerRadius: "80%",  //change the innerRadius here.
            dataPoints
        }]
    });
    chart.render();
}
function getConsistenzaProgettato(id_materiale,id_commessa)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getConsistenzaProgettatoCalcoloFabbisogno.php",{id_materiale,id_commessa},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
async function getTotaliProgettatoPieChart(materiale)
{
    var container=document.getElementById("totaliProgettatoPieChartContainer_"+materiale.id_materiale);
    container.innerHTML='<i class="fad fa-spinner-third fa-spin fa-2x" style="color:#ddd"></i>';

    var id_commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;
    var consistenzaProgettato=await getConsistenzaProgettato(materiale.id_materiale,id_commessa);

    var chart = new CanvasJS.Chart("totaliProgettatoPieChartContainer_"+materiale.id_materiale, 
    {
        animationEnabled: true,
        backgroundColor: "transparent",
        title:
        {
            text: "Consistenza progettato",
            horizontalAlign: "left"
        },
        data: 
        [{
            type: "doughnut",
            startAngle: 60,
            //innerRadius: 60,
            indexLabelFontSize: 12,
            indexLabelFontFamily:"'Montserrat',sans-serif",
            indexLabelFontColor:"#ddd",
            indexLabel: "{label}<br>#percent%",
            toolTipContent: "<b>{label}:</b> {y} "+materiale.um+" (#percent%)",
            dataPoints: [
                { y: 67, label: "Inbox" },
                { y: 28, label: "Archives" },
                { y: 10, label: "Labels" },
                { y: 7, label: "Drafts"},
                { y: 15, label: "Trash"},
                { y: 6, label: "Spam"}
            ]
        }]
    });
    chart.render();
}
function getBarChart(obj,totaliMateriali,id)
{
    document.getElementById("barChartContainer_"+id).innerHTML="";

    if(raggruppamentoMateriali)
    {
        var interval=0;
        var dataPoints=[];
        totaliMateriali.forEach(totale => 
        {
            if(totale.raggruppamento==id)
            {
                var dataPoint=
                {
                    y:totale.qnt,
                    label:capitalize(totale.voce),
                    color:totale.colore
                }
                dataPoints.push(dataPoint);
                interval+=totale.qnt;
            }
        });
    
        interval=interval/dataPoints.length;
        interval=interval/2;
    }
    else
    {
        var interval=0;
        var dataPoints=[];
        totaliMateriali.forEach(totale => 
        {
            if(totale.materiale==id)
            {
                var dataPoint=
                {
                    y:totale.qnt,
                    label:capitalize(totale.voce),
                    color:totale.colore
                }
                dataPoints.push(dataPoint);
                interval+=totale.qnt;
            }
        });
    
        interval=interval/dataPoints.length;
        interval=interval/2;
    }

    var chart = new CanvasJS.Chart("barChartContainer_"+id,
    {
        toolTip:
        {
            backgroundColor: "#4d4d4d",
            cornerRadius: 4,
            contentFormatter: function ( e )
            {
                var span=document.createElement("span");
                span.setAttribute("style","color:#ddd;margin:5px;font-family:'Montserrat',sans-serif;font-size:12px;");
                span.innerHTML=e.entries[0].dataPoint.label + " <b style='color:"+e.entries[0].dataPoint.color+";text-shadow: 2px 4px 3px rgba(0,0,0,0.3);letter-spacing: 1px'>" +  e.entries[0].dataPoint.y.toFixed(2) + "</b> "+obj.um;

                return  span.outerHTML;  
            }  
        },
        backgroundColor:"transparent",
        animationEnabled: true,
        axisX: {
          //labelPlacement: "inside",
          labelFontColor: "#ddd",
          labelFontFamily: "'Montserrat',sans-serif",
          labelFontSize: 12,
          labelTextAlign: "left"
        },
        axisY2:
        {
            labelAngle: -45,
            labelFontColor: "#ddd",
            labelFontFamily: "'Montserrat',sans-serif",
            labelFontSize: 12,
            labelTextAlign: "left",
            suffix: " "+obj.um,
            labelFontColor: "#ddd",
            valueFormatString: "######.##",
            interval
        },
        data: [{
          type: "bar",
          axisYType: "secondary",
          dataPoints
        }]
      });
      chart.render();
}
function getLineChart(obj,cronologiaMateriali,id)
{
	/*console.log("------------------------------------");
	console.log(obj);*/
	
    document.getElementById("lineChartContainer_"+id).innerHTML="";

	var cronologiaMaterialiReverse=cronologiaMateriali;
    var dataPoints=
    {
        "calcolato":[],
        "richiesto":[]
    };
	var yCalcolato=0;
	var yRichiesto=0;
    cronologiaMaterialiReverse.forEach(cronologiaMateriale => 
    {
        if(raggruppamentoMateriali)
        {
            if(cronologiaMateriale.id_raggruppamento==id)
            {
                if(cronologiaMateriale.voce=="calcolato")
                {
                    yCalcolato+=cronologiaMateriale.qnt;
                    var dataPoint=
                    {
                        x:new Date(cronologiaMateriale.anno, (cronologiaMateriale.mese-1), cronologiaMateriale.giorno),
                        y:yCalcolato
                    }
                    dataPoints.calcolato.push(dataPoint);
                }
                if(cronologiaMateriale.voce=="richiesto")
                {
                    yRichiesto+=cronologiaMateriale.qnt;
                    var dataPoint=
                    {
                        x:new Date(cronologiaMateriale.anno, (cronologiaMateriale.mese-1), cronologiaMateriale.giorno),
                        y:yRichiesto
                    }
                    dataPoints.richiesto.push(dataPoint);
                }
            }
        }
        else
        {
            if(cronologiaMateriale.materiale==id)
            {
                if(cronologiaMateriale.voce=="calcolato")
                {
                    yCalcolato+=cronologiaMateriale.qnt;
                    var dataPoint=
                    {
                        x:new Date(cronologiaMateriale.anno, (cronologiaMateriale.mese-1), cronologiaMateriale.giorno),
                        y:yCalcolato
                    }
                    dataPoints.calcolato.push(dataPoint);
                }
                if(cronologiaMateriale.voce=="richiesto")
                {
                    yRichiesto+=cronologiaMateriale.qnt;
                    var dataPoint=
                    {
                        x:new Date(cronologiaMateriale.anno, (cronologiaMateriale.mese-1), cronologiaMateriale.giorno),
                        y:yRichiesto
                    }
                    dataPoints.richiesto.push(dataPoint);
                }
            }
        }
    });

    var chart = new CanvasJS.Chart("lineChartContainer_"+id, 
    {
        backgroundColor:"transparent",
        animationEnabled: true,
        axisX:
        {
            valueFormatString: "DD MMM",
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            },
            labelFontColor: "#ddd",
            labelFontFamily: "'Montserrat',sans-serif",
            labelFontSize: 12,
            labelTextAlign: "left",
            interval: 1,
            intervalType: "day",
			labelAngle: -90
        },
        axisY:
        {
            crosshair: {
                enabled: true
            },
            labelFontColor: "#ddd",
            labelFontFamily: "'Montserrat',sans-serif",
            labelFontSize: 12,
            labelTextAlign: "left",
            suffix: " "+obj.um,
            valueFormatString: "######.##"/*,
            interval:50*/
        },
        toolTip:
        {
            shared:false,
            backgroundColor: "#4d4d4d",
            cornerRadius: 4,
            contentFormatter: function ( e )
            {
                var div=document.createElement("div");
                div.setAttribute("style","margin:5px;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start");

                var span=document.createElement("span");
                span.setAttribute("style","color:#ddd;font-family:'Montserrat',sans-serif;font-size:12px;");
                span.innerHTML=convertDate(e.entries[0].dataPoint.x);
                div.appendChild(span);

                function convertDate(inputFormat) {
                    function pad(s) { return (s < 10) ? '0' + s : s; }
                    var d = new Date(inputFormat)
                    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
                  }

                var span=document.createElement("span");
                span.setAttribute("style","color:#ddd;font-family:'Montserrat',sans-serif;font-size:12px;");
                span.innerHTML=e.entries[0].dataSeries.name+" <b style='color:"+e.entries[0].dataSeries.color+";text-shadow: 2px 4px 3px rgba(0,0,0,0.3);letter-spacing: 1px'>" +  e.entries[0].dataPoint.y + "</b> "+obj.um;
                div.appendChild(span);

                return  div.outerHTML;  
            }  
        },  
        legend:
        {
            cursor:"pointer",
            verticalAlign: "bottom",
            horizontalAlign: "left",
            fontColor: "#ddd",
            fontWeight:"normal",
            fontFamily: "'Montserrat',sans-serif",
            fontSize: 12,
            dockInsidePlotArea: false,
            itemclick: toogleDataSeries
        },
        data: [{
            type: "area",
            showInLegend: true,
            name: "Calcolato",
            xValueFormatString: "DD MMM, YYYY",
            color: "#E9A93A",
            dataPoints: dataPoints.calcolato
        },
        {
            type: "area",
            showInLegend: true,
            name: "Richiesto",
            xValueFormatString: "DD MMM, YYYY",
            color:"#70B085",
            dataPoints: dataPoints.richiesto
        }]
    });
    chart.render();
    
    function toogleDataSeries(e){
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else{
            e.dataSeries.visible = true;
        }
        chart.render();
    }
}
function checkCommessa(commessa)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("checkCommessaCalcoloFabbisogno.php",{commessa},
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
        });
    });
}
function checkGruppo(gruppo)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("checkGruppoCalcoloFabbisogno.php",{gruppo},
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
        });
    });
}
function checkMateriale(materiale)
{
    return new Promise(function (resolve, reject) 
    {
        var id_commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;
        $.get("checkMaterialeCalcoloFabbisogno.php",{materiale,id_commessa},
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
        });
    });
}
function getTotaliMateriali(id_commessa,materiali_statistiche,raggruppamentoMateriali)
{
    return new Promise(function (resolve, reject) 
    {
        var JSONmateriali_statistiche=JSON.stringify(materiali_statistiche);
        $.get("getTotaliMaterialiCalcoloFabbisogno.php",{id_commessa,JSONmateriali_statistiche,raggruppamentoMateriali},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
function getCronologiaMateriali(id_commessa,materiali_statistiche,raggruppamentoMateriali)
{
    return new Promise(function (resolve, reject) 
    {
        var JSONmateriali_statistiche=JSON.stringify(materiali_statistiche);
        $.get("getCronologiaMaterialiCalcoloFabbisogno.php",{id_commessa,JSONmateriali_statistiche,raggruppamentoMateriali},
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
        });
    });
}
function getTotaliGruppi(id_commessa,id,voce)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getTotaliGruppiCalcoloFabbisogno.php",{id_commessa,id,voce,raggruppamentoMateriali},
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
        });
    });
}
function capitalize(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function getPopupRaggruppamentoMateriali()
{
    
}
function checkMaterialiPopupMateriali()
{
    var tot=0;
    var n=0;
    var checkboxes=document.getElementsByClassName("popup-scegli-materiali-checkbox");
    for (let index = 0; index < checkboxes.length; index++)
    {
        const checkbox = checkboxes[index];
        if(checkbox.checked)
            n++;
        if(checkbox.parentElement.parentElement.style.display!="none")
            tot++;
    }

    if(n<=5)
        var color="#70B085";
    if(n<=10 && n>5)
        var color="#E9A93A";
    if(n>10)
        var color="#DA6969";

	try
    {
		if(raggruppamentoMateriali)
			document.getElementById("nMaterialiContainerPopupMateriali").innerHTML=n+" famiglie selezionate";
		else
			document.getElementById("nMaterialiContainerPopupMateriali").innerHTML=n+" materiali selezionati";
		document.getElementById("nMaterialiContainerPopupMateriali").style.color=color;
	}
	catch(e){}
	
    document.getElementById("popupScegliMaterialiCheckboxTutti").checked=n==tot;
}
async function getMascheraRiepilogoCommesse()
{
    var button=document.getElementById("btn_riepilogo_commesse");

    view="riepilogo_commesse";

    $(".in-page-nav-bar-button").css({"border-bottom-color":"","font-weight":""});
    button.style.borderBottomColor="#4C91CB";
    button.style.fontWeight="bold";

    document.getElementById("actionBarCalcoloFabbisogno").style.display="flex";
    $(".reusable-control-bar-items").hide();

    document.getElementById("actionBarRiepilogoCommesseItems").style.display="flex";
    $(".container-items").hide();
    document.getElementById("containerRiepilogoCommesseItems").style.display="flex";

    $("#selectCommessaCalcoloFabbisognoContainer").hide(200,"swing");

    getHotRiepilogoCommesse('containerRiepilogoCommesseItems');
}
async function getHotRiepilogoCommesse(containerId)
{
    if(raggruppamentoRiepilogoCommesse=="materiali")
    {
        document.getElementById("btnRaggruppamentoRiepilogoCommesseMateriali").style.backgroundColor="rgb(76, 145, 203)";
        document.getElementById("btnRaggruppamentoRiepilogoCommesseMateriali").style.color="white";
        document.getElementById("btnRaggruppamentoRiepilogoCommesseFamiglie").style.backgroundColor="";
        document.getElementById("btnRaggruppamentoRiepilogoCommesseFamiglie").style.color="";
    }
    else
    {
        document.getElementById("btnRaggruppamentoRiepilogoCommesseMateriali").style.backgroundColor="";
        document.getElementById("btnRaggruppamentoRiepilogoCommesseMateriali").style.color="";
        document.getElementById("btnRaggruppamentoRiepilogoCommesseFamiglie").style.backgroundColor="rgb(76, 145, 203)";
        document.getElementById("btnRaggruppamentoRiepilogoCommesseFamiglie").style.color="white";
    }
    
    destroyHots();

    var container = document.getElementById(containerId);
    container.innerHTML="";

    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    riepilogoCommesse=await getRiepilogoCommesse();
    console.log(riepilogoCommesse);
    riepilogoCommesse.data.forEach(row =>
    {
        row.calcolato=parseFloat(row.calcolato).toFixed(2);
        row.progettato=parseFloat(row.progettato).toFixed(2);
        row.richiesto=parseFloat(row.richiesto).toFixed(2);
        row["delta_richiesto-calcolato"]=parseFloat(row["delta_richiesto-calcolato"]).toFixed(2);
        row["delta_calcolato-progettato"]=parseFloat(row["delta_calcolato-progettato"]).toFixed(2);
    });

    Swal.close();

    if(riepilogoCommesse.data.length>0)
    {
        function riepilogoCommesseCellRenderer(instance, td, row, col, prop, value, cellProperties)
        {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if(prop=="note")
            {
                try {
                    var materiale=hot.getDataAtCell(row, 1);
                    var commessa=hot.getDataAtCell(row, 0);

                    var nNote=value;
                    td.innerHTML="";

                    var div=document.createElement("div");
                    div.setAttribute("style","display:flex;flex-direction:row;align-items:center;justify-content:flex-start;width:100%");

                    var span=document.createElement("span");
                    span.setAttribute("style","");
                    span.innerHTML=nNote+" note";
                    div.appendChild(span);

                    if(materiale!==null)
                    {
                        var button=document.createElement("button");
                        button.setAttribute("onclick","getPopupNoteMaterialiCommesse('"+materiale+"','"+commessa+"',getMascheraRiepilogoCommesse)");
                        button.setAttribute("class","btn-aggiungi-nota-materiale-commessa");
                        button.innerHTML="<i class='fad fa-sticky-note'></i>";
                        div.appendChild(button);
                    }

                    td.appendChild(div);
                } catch (error) {}
            }
            if(prop=="materiale")
            {
                if(value==null)
                {
                    td.parentElement.childNodes[1].style.color="#e34208";
                    td.parentElement.childNodes[1].style.fontWeight="bold";
                }
            }
            if(prop=="delta_richiesto-calcolato")
            {
                if(value<0)
                {
                    td.style.background="#e34208";
                    td.style.color="white";
                }
            }
            if(prop=="delta_calcolato-progettato")
            {
                if(value<0)
                {
                    td.style.background="#e34208";
                    td.style.color="white";
                }
            }
        }
        Handsontable.renderers.registerRenderer('riepilogoCommesseCellRenderer', riepilogoCommesseCellRenderer);

        hot = new Handsontable
        (
            container,
            {
                data: riepilogoCommesse.data,
                rowHeaders: true,
                manualColumnResize: true,
                colHeaders: riepilogoCommesse.colHeaders,
                className: "htMiddle",
                filters: true,
                dropdownMenu: true,
                headerTooltips: true,
                language: 'it-IT',
                contextMenu: true,
                height:"100%",
                columnSorting: true,
                colWidths: [100, 400,50,150,100,100,100,280,280,100],
                columns:riepilogoCommesse.columns,
                beforeRemoveRow: () => 
                {
                    return false;
                },
                beforeCreateRow: () => 
                {
                    return false;
                },
                beforeChange: () => 
                {
                    return false;
                },
                cells: function (row, col)
                {
                    var cellProperties = {};
                    var data = this.instance.getData();
                    
                    cellProperties.renderer = "riepilogoCommesseCellRenderer";
        
                    return cellProperties;
                },
                afterDropdownMenuShow: (dropdownMenu) =>
                {
                    document.getElementsByClassName("htUIMultipleSelectSearch")[0].getElementsByTagName("input")[0].addEventListener("click", function()
                    {
                        document.getElementsByClassName("htUIClearAll")[0].getElementsByTagName("a")[0].click();
                    });
                }
            }
        );
        hideHotDisplayLicenceInfo();
        $(".handsontable .changeType").css
        ({
            "background": "#eee",
            "border-radius": "0",
            "border": "none",
            "color": "#404040",
            "font-size": "14px",
            "line-height": "normal",
            "padding": "0px",
            "margin": "0px",
            "float": "right"
        });
    }
}
function getRiepilogoCommesse()
{
    return new Promise(function (resolve, reject) 
    {
        var JSONraggruppamentoMaterialiRiepilogoCommesse=JSON.stringify(raggruppamentoRiepilogoCommesse=='famiglie');
        $.post
        (
            "getRiepilogoCommesseView.php",
            {
                JSONraggruppamentoMaterialiRiepilogoCommesse
            },
            function(response, status)
            {
                if(status=="success")
                {
                    if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                    {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                    else
                    {
                        try {
                            resolve(JSON.parse(response));
                        } catch (error) {
                            Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                            console.log(response);
                            resolve([]);
                        }
                    }
                }
            });
    });
}
function esportaRiepilogoCommesse()
{
    var inputNomeFile=document.createElement("input");
    inputNomeFile.setAttribute("type","text");
    inputNomeFile.setAttribute("value","riepilogo_commesse");
    inputNomeFile.setAttribute("id","fileNameInputSwal");
    Swal.fire
    ({
        type: 'question',
        title: 'Scegli il nome del file',
        html : inputNomeFile.outerHTML
    }).then((result) => 
    {
        if (result.value)
        {
            swal.close();
            var filename=document.getElementById("fileNameInputSwal").value;
            if(filename==null || filename=='')
            {
                var filename="riepilogo_commesse";
            }
            try {
                document.getElementById("esportaRiepilogoCommesseTable").remove();
            } catch (error) {}
        
            var table=document.createElement("table");
            table.setAttribute("style","display:none");
            table.setAttribute("id","esportaRiepilogoCommesseTable");
        
            var tr=document.createElement("tr");
            riepilogoCommesse.colHeaders.forEach(header =>
            {
                var th=document.createElement("th");
                th.innerHTML=header;
                tr.appendChild(th);
            });
            table.appendChild(tr);
        
            var data=hot.getData();
            data.forEach(row =>
            {
                var tr=document.createElement("tr");
                row.forEach(cell =>
                {
                    var td=document.createElement("td");
                    td.innerHTML=cell;
                    tr.appendChild(td);
                });
                table.appendChild(tr);
            });
        
            document.body.appendChild(table);
            exportTableToExcel("esportaRiepilogoCommesseTable", filename);
        }
        else
            swal.close();
    });
}
function exportTableToExcel(tableID, filename = '')
{
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
}
function esportaExcelStatisticheMateriali()
{
    var inputNomeFile=document.createElement("input");
    inputNomeFile.setAttribute("type","text");
    inputNomeFile.setAttribute("value","statistiche_materiali");
    inputNomeFile.setAttribute("id","fileNameInputSwal");
    Swal.fire
    ({
        type: 'question',
        title: 'Scegli il nome del file',
        html : inputNomeFile.outerHTML
    }).then((result) => 
    {
        if (result.value)
        {
            swal.close();
            var filename=document.getElementById("fileNameInputSwal").value;
            if(filename==null || filename=='')
            {
                var filename="statistiche_materiali";
            }
            if(tabellaStatisticheMateriali=="dettagli")
                fnExcelReport("tableStatisticheMateriali", filename);
            else
            {
                try {
                    document.getElementById("esportaStatisticheMaterialiPivotTable").remove();
                } catch (error) {}
            
                var table=document.createElement("table");
                table.setAttribute("style","display:none");
                table.setAttribute("id","esportaStatisticheMaterialiPivotTable");
            
                var tr=document.createElement("tr");
                statisticheMaterialiPivot.colHeaders.forEach(header =>
                {
                    var th=document.createElement("th");
                    th.innerHTML=header;
                    tr.appendChild(th);
                });
                table.appendChild(tr);
            
                var data=hot.getData();
                data.forEach(row =>
                {
                    var tr=document.createElement("tr");
                    row.forEach(cell =>
                    {
                        var td=document.createElement("td");
                        td.innerHTML=cell;
                        tr.appendChild(td);
                    });
                    table.appendChild(tr);
                });
            
                document.body.appendChild(table);
                exportTableToExcel("esportaStatisticheMaterialiPivotTable", filename);
            }
        }
        else
            swal.close();
    });
}
function fnExcelReport(id,fileName)
{
    var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
    var textRange; var j=0;
    tab = document.getElementById(id); // id of table

    for(j = 0 ; j < tab.rows.length ; j++) 
    {     
        tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
        //tab_text=tab_text+"</tr>";
    }

    tab_text=tab_text+"</table>";
    tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
    tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE "); 

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        txtArea1.document.open("txt/html","replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus(); 
        sa=txtArea1.document.execCommand("SaveAs",true,"Say Thanks to Sumit.xls");
    }  
    else                 //other browser not tested on IE 11
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));  

    return (sa);
}
function arrayUnique(value, index, self)
{
    return self.indexOf(value) === index;
}
function getPopupRaggruppamenti()
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("id","containerPopupRaggruppamenti");
    outerContainer.setAttribute("style","width:calc(100% - 40px);height:550px;margin-left:20px;margin-right:20px;margin-top:15px");

    outerContainer.innerHTML="<i class='fad fa-spinner-third fa-spin'></i>";

    Swal.fire
    ({
        width:"90%",
        title:"Famiglie materiali",
        background:"#f1f1f1",
        html:outerContainer.outerHTML,
        allowOutsideClick:false,
        showCloseButton:true,
        showConfirmButton:true,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-header")[0].style.boxSizing="border-box";
                    document.getElementsByClassName("swal2-header")[0].style.paddingLeft="20px";
                    document.getElementsByClassName("swal2-header")[0].style.paddingTop="15px";
                    document.getElementsByClassName("swal2-header")[0].style.display="flex";
                    document.getElementsByClassName("swal2-header")[0].style.alignItems="center";
                    document.getElementsByClassName("swal2-header")[0].style.flexDirection="row";
                    document.getElementsByClassName("swal2-header")[0].style.justifyContent="flex-start";
                    document.getElementsByClassName("swal2-title")[0].style.margin="0px";
                    document.getElementsByClassName("swal2-confirm")[0].style.display="none";
                    document.getElementsByClassName("swal2-content")[0].style.fontFamily="initial";
                    document.getElementsByClassName("swal2-content")[0].style.fontSize="initial";
                    document.getElementsByClassName("swal2-header")[0].style.width="calc(100% - 50px)";

                    var alertSpan=document.createElement("div");
                    alertSpan.setAttribute("style","font-family:'Montserrat',sans-serif;font-size:12px;margin-left:auto;color:red");
                    alertSpan.setAttribute("id","alertSpanFamiglieMateriali");
                    document.getElementsByClassName("swal2-header")[0].appendChild(alertSpan);

                    setTimeout(() => {
                        getHotRaggruppamentiMateriali();
                    }, 100);
                }
    }).then((result) => 
    {
        getHotAnagraficaMateriali();
    });
}
async function getHotAnagraficaGruppi(table,containerId,colWidths)
{
    var container = document.getElementById(containerId);
    container.innerHTML="";

    var response=await getHotData(table);

    var height=container.offsetHeight;

    if(response.data.length>0)
    {
        hot = new Handsontable
        (
            container,
            {
                data: response.data,
                rowHeaders: true,
                manualColumnResize: true,
                colHeaders: response.colHeaders,
                filters: true,
                dropdownMenu: true,
                headerTooltips: true,
                language: 'it-IT',
                contextMenu: true,
                width:"100%",
                colWidths,
                columnSorting: true,
                height,
                columns:response.columns,
                afterChange: (changes) =>
                {
                    if(changes!=null)
                    {
                        changes.forEach(([row, prop, oldValue, newValue]) =>
                        {
                            if(prop!=response.primaryKey)
                            {
                                var id=hot.getDataAtCell(row, 0);
                                aggiornaRigaHot(id,prop,newValue,table,response.primaryKey);
                            }
                        });
                    }
                },
                afterCreateRow: (index,amount,source) =>
                {
                    creaRigaHot(index,table,response.primaryKey,hot);
                },
                beforeRemoveRow: (index,amount,physicalRows,source)  =>
                {
                    for (let i = 0; i < physicalRows.length; i++)
                    {
                        const indice = physicalRows[i];
                        var id=hot.getDataAtCell(indice, 0);
                        eliminaRigaHot(id,table,response.primaryKey);
                    }
                },
                afterDropdownMenuShow: (dropdownMenu) =>
                {
                    document.getElementsByClassName("htUIMultipleSelectSearch")[0].getElementsByTagName("input")[0].addEventListener("click", function()
                    {
                        document.getElementsByClassName("htUIClearAll")[0].getElementsByTagName("a")[0].click();
                    });
                }
            }
        );
        hideHotDisplayLicenceInfo();
        $(".handsontable .changeType").css
        ({
            "background": "#eee",
            "border-radius": "0",
            "border": "none",
            "color": "#404040",
            "font-size": "14px",
            "line-height": "normal",
            "padding": "0px",
            "margin": "0px",
            "float": "right"
        });
    }
}
function aggiornaRigaHot(id,colonna,valore,table,primaryKey)
{
    $.get("aggiornaRigaHot.php",{id,colonna,valore,table,primaryKey},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
        }
    });
}
function creaRigaHot(index,table,primaryKey,local_hot)
{
    $.get("creaRigaHot.php",{table,primaryKey},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
                local_hot.setDataAtCell(index, 0, response);
        }
    });
}
function eliminaRigaHot(id,table,primaryKey)
{
    $.get("eliminaRigaHot.php",{id,table,primaryKey},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
        }
    });
}
function getHotData(table)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getHotData.php",{table},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
async function getHotRaggruppamentiMateriali()
{
    var container = document.getElementById("containerPopupRaggruppamenti");
    container.innerHTML="";

    var table="raggruppamenti_materiali";

    var response=await getHotRaggruppamentiMaterialiData(table);

    var height=container.offsetHeight;

    if(response.data.length>0)
    {
        destroyHots(["hot"]);
        hot = new Handsontable
        (
            container,
            {
                data: response.data,
                rowHeaders: true,
                manualColumnResize: true,
                colHeaders: response.colHeaders,
                filters: false,
                dropdownMenu: false,
                headerTooltips: true,
                language: 'it-IT',
                contextMenu: true,
                width:"100%",
                columnSorting: true,
                height,
                columns:response.columns,
                afterChange: (changes) =>
                {
                    if(changes!=null)
                    {
                        changes.forEach(([row, prop, oldValue, newValue]) =>
                        {
                            if(prop!=response.primaryKey)
                            {
                                var id=hot.getDataAtCell(row, 0);
                                aggiornaRigaHotRaggruppamentiMateriali(id,prop,newValue,table,response.primaryKey);
                            }
                        });
                    }
                },
                afterCreateRow: (index,amount,source) =>
                {
                    creaRigaHotRaggruppamentiMateriali(index,table,response.primaryKey);
                },
                beforeRemoveRow: (index,amount,physicalRows,source)  =>
                {
                    for (let i = 0; i < physicalRows.length; i++)
                    {
                        const indice = physicalRows[i];
                        var id=hot.getDataAtCell(indice, 0);
                        eliminaRigaHotRaggruppamentiMateriali(id,table,response.primaryKey);
                    }
                },
                afterDropdownMenuShow: (dropdownMenu) =>
                {
                    document.getElementsByClassName("htDropdownMenu")[0].style.zIndex="9999";
                },
                afterContextMenuShow: (dropdownMenu) =>
                {
                    document.getElementsByClassName("htContextMenu")[0].style.zIndex="9999";
                }
            }
        );
        hideHotDisplayLicenceInfo();

        if(response.n==1)
            document.getElementById("alertSpanFamiglieMateriali").innerHTML="";
        if(response.n>1)
            document.getElementById("alertSpanFamiglieMateriali").innerHTML="Può essere utilizzata solo una famiglia per calcolare il progettato in modo alternativo. <b><u>IL PROGRAMMA POTREBBE NON FUNZIONARE CORRETTAMENTE</u></b>";
        if(response.n==0)
            document.getElementById("alertSpanFamiglieMateriali").innerHTML="Almeno una famiglia deve essere utilizzata per calcolare il progettato in modo alternativo. <b><u>IL PROGRAMMA POTREBBE NON FUNZIONARE CORRETTAMENTE</u></b>"; 
    }
}
function aggiornaRigaHotRaggruppamentiMateriali(id,colonna,valore,table,primaryKey)
{
    $.get("aggiornaRigaHotRaggruppamentiMateriali.php",{id,colonna,valore,table,primaryKey},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
            {
                if(response==1)
                    document.getElementById("alertSpanFamiglieMateriali").innerHTML="";
                if(response>1)
                    document.getElementById("alertSpanFamiglieMateriali").innerHTML="Può essere utilizzata solo una famiglia per calcolare il progettato in modo alternativo. <b><u>IL PROGRAMMA POTREBBE NON FUNZIONARE CORRETTAMENTE</u></b>";
                if(response==0)
                    document.getElementById("alertSpanFamiglieMateriali").innerHTML="Almeno una famiglia deve essere utilizzata per calcolare il progettato in modo alternativo. <b><u>IL PROGRAMMA POTREBBE NON FUNZIONARE CORRETTAMENTE</u></b>"; 
            }
        }
    });
}
function creaRigaHotRaggruppamentiMateriali(index,table,primaryKey)
{
    $.get("creaRigaHotRaggruppamentiMateriali.php",{table,primaryKey},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
                hot.setDataAtCell(index, 0, response);
        }
    });
}
function eliminaRigaHotRaggruppamentiMateriali(id,table,primaryKey)
{
    $.get("eliminaRigaHotRaggruppamentiMateriali.php",{id,table,primaryKey},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
        }
    });
}
function getHotRaggruppamentiMaterialiData(table)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getHotRaggruppamentiMaterialiData.php",{table},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
function getDataSPPesoQntCabine()
{
    return new Promise(function (resolve, reject) 
    {
        $.post("getDataSPPesoQntCabine.php",
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve('');
                }
                else
                    resolve(response);
            }
        });
    });
}
function getStatisticheMaterialiPivotData(materiali_statistiche,raggruppamentoMateriali)
{
    return new Promise(function (resolve, reject) 
    {
        var JSONmateriali_statistiche=JSON.stringify(materiali_statistiche);
        var JSONraggruppamentoMateriali=JSON.stringify(raggruppamentoMateriali);
        var id_commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;

        $.post("getStatisticheMaterialiPivotData.php",
        {
            JSONmateriali_statistiche,JSONraggruppamentoMateriali,id_commessa
        },
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
function eliminaRigaMaterialiCalcoloFabbisogno(id_importazione)
{
    $.get("eliminaRigaMaterialiCalcoloFabbisogno.php",{id_importazione},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire
                ({
                    icon:"error",
                    background:"#404040",
                    title: "Errore. Se il problema persiste contatta l' amministratore",
                    showCloseButton:true,
                    showConfirmButton:false,
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                }).then((result) => 
                {
                    document.getElementById("buttonTabellaDati").click();
                });
                console.log(response);
            }
        }
    });
}
async function getPopupNoteMaterialiCommesse(materiale,commessa,callback)
{
    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    shouldCallbackPopupNoteMaterialiCommesse=false;

    var id_utente=await getSessionValue("id_utente");

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","dark-popup-outer-container");
    outerContainer.setAttribute("style","margin:0px;margin-top:10px;margin-bottom:20px;width:100%");

    var row=document.createElement("div");
    row.setAttribute("style","color:#ddd;width:100%;margin-bottom:5px;display:flex;flex-direction:row;align-items:center;justify-content:flex-start;box-sizing:border-box;padding-left:20px;padding-right:20px");
    var i=document.createElement("i");
    i.setAttribute("class","fad fa-hashtag")
    row.appendChild(i);
    var span=document.createElement("span");
    span.setAttribute("style","font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-left:5px")
    span.innerHTML=materiale;
    row.appendChild(span);
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("style","color:#ddd;width:100%;margin-bottom:5px;display:flex;flex-direction:row;align-items:center;justify-content:flex-start;box-sizing:border-box;padding-left:20px;padding-right:20px");
    var i=document.createElement("i");
    i.setAttribute("class","fad fa-ship")
    row.appendChild(i);
    var span=document.createElement("span");
    span.setAttribute("style","font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-left:5px")
    span.innerHTML=commessa;
    row.appendChild(span);
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","dark-popup-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:5px;margin-bottom:5px;box-sizing:border-box;padding-left:20px;padding-right:20px");

    var confirmButton=document.createElement("button");
    confirmButton.setAttribute("class","dark-popup-button");
    confirmButton.setAttribute("style","width:100%;");
    confirmButton.setAttribute("onclick","shouldCallbackPopupNoteMaterialiCommesse=true;inserisciNotaMaterialeCommessa('"+materiale+"','"+commessa+"')");
    confirmButton.innerHTML='<span>Aggiungi</span><i class="fad fa-notes-medical"></i>';
    row.appendChild(confirmButton);    

    outerContainer.appendChild(row);

    var innerContainer=document.createElement("div");
    innerContainer.setAttribute("style","width:100%;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;max-height:600px;overflow-y:auto;box-sizing:border-box;padding-left:20px;padding-right:20px");
    innerContainer.setAttribute("id","innerContainerPopupNoteMaterialiCommesse");

    var note=await getNoteMaterialiCommesse(materiale,commessa);
    note.forEach(nota =>
    {
        var row=document.createElement("div");
        row.setAttribute("class","nota-elements-"+nota.id_nota);
        row.setAttribute("style","width:100%;margin-bottom:5px;margin-top:5px;display:flex;flex-direction:row;align-items:center;justify-content:space-between");
        var span=document.createElement("span");
        span.setAttribute("style","color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;")
        span.innerHTML=nota.username;
        row.appendChild(span);
        var span=document.createElement("span");
        span.setAttribute("style","color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-left:auto")
        span.innerHTML=nota.dataOra;
        row.appendChild(span);
        if(parseInt(id_utente)==parseInt(nota.id_utente))
        {
            var button=document.createElement("button");
            button.setAttribute("style","border:none;background-color:transparent;margin:0px;padding:0px;outline:none;margin-left:10px;color:#ddd");
            button.setAttribute("onclick","shouldCallbackPopupNoteMaterialiCommesse=true;eliminaNotaMaterialeCommessa("+nota.id_nota+")");
            button.innerHTML='<i class="fad fa-trash"></i>';
            row.appendChild(button);
        }
        innerContainer.appendChild(row);

        var row=document.createElement("div");
        row.setAttribute("class","nota-elements-"+nota.id_nota);
        row.setAttribute("style","width:100%;justify-content:flex-start;display:flex;align-items:center");
        var textarea=document.createElement("textarea");
        textarea.setAttribute("class","dark-popup-textarea");
        textarea.setAttribute("id","popupInserimentoFabbisognoNote");
        if(id_utente!=nota.id_utente)
            textarea.setAttribute("disabled","disabled");
        textarea.setAttribute("onfocusout","updateNotaMaterialeCommessa(this.value,"+nota.id_nota+")");
        textarea.innerHTML=nota.testo;
        row.appendChild(textarea);

        innerContainer.appendChild(row);
    });

    outerContainer.appendChild(innerContainer);
    
    Swal.fire
    ({
        background:"#404040",
        title:'Note materiale',
        html:outerContainer.outerHTML,
        allowOutsideClick:true,
        showCloseButton:true,
        showConfirmButton:true,
        allowEscapeKey:true,
        showCancelButton:false,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                    document.getElementsByClassName("swal2-title")[0].style.fontSize="12px";
                    document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                    document.getElementsByClassName("swal2-title")[0].style.width="100%";
                    document.getElementsByClassName("swal2-close")[0].style.width="40px";
                    document.getElementsByClassName("swal2-close")[0].style.height="40px";
                    document.getElementsByClassName("swal2-title")[0].style.margin="0px";
                    document.getElementsByClassName("swal2-title")[0].style.marginTop="5px";
                    document.getElementsByClassName("swal2-title")[0].style.fontFamily="'Montserrat',sans-serif";
                    document.getElementsByClassName("swal2-title")[0].style.textAlign="left";
                    document.getElementsByClassName("swal2-confirm")[0].style.display="none";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingBottom="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingRight="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingLeft="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingTop="10px";
                    document.getElementsByClassName("swal2-header")[0].style.paddingLeft="20px";
                    document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-actions")[0].style.margin="0px";
                }
    }).then((result) => 
    {
        if(shouldCallbackPopupNoteMaterialiCommesse)
            callback();
    });
}
function eliminaNotaMaterialeCommessa(id_nota)
{
    $.post("eliminaNotaMaterialeCommessa.php",{id_nota},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
            {
                $(".nota-elements-"+id_nota).hide(200);
                setTimeout(() => {
                    $(".nota-elements-"+id_nota).remove();
                }, 300);
            }
        }
    });
}
async function inserisciNotaMaterialeCommessa(materiale,commessa)
{
    var id_utente=await getSessionValue("id_utente");

    $.post("inserisciNotaMaterialeCommessa.php",{materiale,commessa},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
            {
                var nota=JSON.parse(response);

                var innerContainer=document.getElementById("innerContainerPopupNoteMaterialiCommesse");

                var row=document.createElement("div");
                row.setAttribute("class","nota-elements-"+nota.id_nota);
                row.setAttribute("style","width:100%;justify-content:flex-start;align-items:center;display:flex");
                var textarea=document.createElement("textarea");
                textarea.setAttribute("class","dark-popup-textarea");
                textarea.setAttribute("id","popupInserimentoFabbisognoNote");
                if(id_utente!=nota.id_utente)
                    textarea.setAttribute("disabled","disabled");
                textarea.setAttribute("onfocusout","updateNotaMaterialeCommessa(this.value,"+nota.id_nota+")");
                textarea.innerHTML=nota.testo;
                row.appendChild(textarea);
                innerContainer.insertBefore(row, innerContainer.firstChild);

                var row=document.createElement("div");
                row.setAttribute("class","nota-elements-"+nota.id_nota);
                row.setAttribute("style","width:100%;margin-bottom:5px;margin-top:5px;display:flex;flex-direction:row;align-items:center;justify-content:space-between");
                var span=document.createElement("span");
                span.setAttribute("style","color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;")
                span.innerHTML=nota.username;
                row.appendChild(span);
                var span=document.createElement("span");
                span.setAttribute("style","color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-left:auto")
                span.innerHTML=nota.dataOra;
                row.appendChild(span);
                if(parseInt(id_utente)==parseInt(nota.id_utente))
                {
                    var button=document.createElement("button");
                    button.setAttribute("style","border:none;background-color:transparent;margin:0px;padding:0px;outline:none;margin-left:10px;color:#ddd");
                    button.setAttribute("onclick","eliminaNotaMaterialeCommessa("+nota.id_nota+")");
                    button.innerHTML='<i class="fad fa-trash"></i>';
                    row.appendChild(button);
                }
                innerContainer.insertBefore(row, innerContainer.firstChild);
            }
        }
    });
}
function getNoteMaterialiCommesse(materiale,commessa)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getNoteMaterialiCommesse.php",{materiale,commessa},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
function updateNotaMaterialeCommessa(testo,id_nota)
{
    $.post("updateNotaMaterialeCommessa.php",{testo,id_nota},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
        }
    });
}
function searchRichieste(value,colonna)
{
    var richiesteItems=document.getElementsByClassName("richieste-materiali-item-inner-container");
    richiesteItems.forEach(element =>
    {
        if(element.getAttribute("id_richiesta").toLowerCase().indexOf(value.toLowerCase())>-1)
            element.style.display="";
        else
            element.style.display="none";
    });
}
function getFormatiLamiere()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getFormatiLamiereCalcoloFabbisogno.php",
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
/*function getPopupFormatiLamiere()
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("id","containerFormatiLamiere");
    outerContainer.setAttribute("class","hot as-you-type-demo handsontable htRowHeaders htColumnHeaders");
    outerContainer.setAttribute("style","width:calc(100% - 40px);height:550px;margin-left:20px;margin-right:20px;margin-top:15px");

    outerContainer.innerHTML="<i class='fad fa-spinner-third fa-spin'></i>";

    Swal.fire
    ({
        width:"90%",
        title:"Formati Lamiere",
        background:"#f1f1f1",
        html:outerContainer.outerHTML,
        allowOutsideClick:false,
        showCloseButton:true,
        showConfirmButton:true,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-header")[0].style.boxSizing="border-box";
                    document.getElementsByClassName("swal2-header")[0].style.paddingLeft="20px";
                    document.getElementsByClassName("swal2-header")[0].style.paddingTop="15px";
                    document.getElementsByClassName("swal2-header")[0].style.display="flex";
                    document.getElementsByClassName("swal2-header")[0].style.alignItems="center";
                    document.getElementsByClassName("swal2-header")[0].style.flexDirection="row";
                    document.getElementsByClassName("swal2-header")[0].style.justifyContent="flex-start";
                    document.getElementsByClassName("swal2-title")[0].style.margin="0px";
                    document.getElementsByClassName("swal2-confirm")[0].style.display="none";
                    document.getElementsByClassName("swal2-content")[0].style.fontFamily="initial";
                    document.getElementsByClassName("swal2-content")[0].style.fontSize="initial";
                    document.getElementsByClassName("swal2-header")[0].style.width="calc(100% - 50px)";

                    setTimeout(() => {
                        getHotFormatiLamiere("formati_lamiere","containerFormatiLamiere");
                    }, 100);
                }
    }).then((result) => 
    {
        getHotFormatiLamiere("formati_lamiere","containerFormatiLamiere");
    });
}*/
async function getHotFormatiLamiere(table,containerId)
{
    var container = document.getElementById(containerId);
    container.innerHTML="";

    var response=await getHotData(table);

    var height=container.offsetHeight;

    if(response.data.length>0)
    {
        // Event for `keydown` event. Add condition after delay of 200 ms which is counted from time of last pressed key.
        var debounceFn = Handsontable.helper.debounce(function (colIndex, event)
        {
            var filtersPlugin = hot.getPlugin('filters');

            filtersPlugin.removeConditions(colIndex);
            filtersPlugin.addCondition(colIndex, 'contains', [event.target.value]);
            filtersPlugin.filter();
        }, 200);

        var addEventListeners = function (input, colIndex)
        {
            input.addEventListener('keydown', function(event)
            {
                debounceFn(colIndex, event);
            });
        };

        // Build elements which will be displayed in header.
        var getInitializedElements = function(colIndex)
        {
            var div = document.createElement('div');
            var input = document.createElement('input');

            div.className = 'filterHeader';

            addEventListeners(input, colIndex);

            div.appendChild(input);

            return div;
        };

        // Add elements to header on `afterGetColHeader` hook.
        var addInput = function(col, TH)
        {
            // Hooks can return value other than number (for example `columnSorting` plugin use this).
            if (typeof col !== 'number')
            {
                return col;
            }

            if (col >= 0 && TH.childElementCount < 2)
            {
                TH.appendChild(getInitializedElements(col));
            }
        };

        // Deselect column after click on input.
        var doNotSelectColumn = function (event, coords)
        {
            if (coords.row === -1 && event.target.nodeName === 'INPUT')
            {
                event.stopImmediatePropagation();
                this.deselectCell();
            }
        };

        destroyHots();

        hot = new Handsontable
        (
            container,
            {
                className: 'as-you-type-demo',
                colWidths: 160,
                afterGetColHeader: addInput,
                beforeOnCellMouseDown: doNotSelectColumn,
                data: response.data,
                rowHeaders: true,
                manualColumnResize: true,
                colHeaders: response.colHeaders,
                filters: true,
                dropdownMenu: true,
                headerTooltips: true,
                language: 'it-IT',
                contextMenu: true,
                width:"100%",
                columnSorting: true,
                height,
                columns:response.columns,
                afterChange: (changes) =>
                {
                    if(changes!=null)
                    {
                        changes.forEach(([row, prop, oldValue, newValue]) =>
                        {
                            if(prop!=response.primaryKey)
                            {
                                var id=hot.getDataAtCell(row, 0);
                                aggiornaRigaHot(id,prop,newValue,table,response.primaryKey);
                            }
                        });
                    }
                },
                afterCreateRow: (index,amount,source) =>
                {
                    creaRigaHot(index,table,response.primaryKey,hot);
                },
                beforeRemoveRow: (index,amount,physicalRows,source)  =>
                {
                    for (let i = 0; i < physicalRows.length; i++)
                    {
                        const indice = physicalRows[i];
                        var id=hot.getDataAtCell(indice, 0);
                        eliminaRigaHot(id,table,response.primaryKey);
                    }
                },
                afterDropdownMenuShow: (dropdownMenu) =>
                {
                    document.getElementsByClassName("htUIMultipleSelectSearch")[0].getElementsByTagName("input")[0].addEventListener("click", function()
                    {
                        document.getElementsByClassName("htUIClearAll")[0].getElementsByTagName("a")[0].click();
                    });
                }
            }
        );
        hideHotDisplayLicenceInfo();
        $(".handsontable .changeType").css
        ({
            "background": "#eee",
            "border-radius": "0",
            "border": "none",
            "color": "#404040",
            "font-size": "14px",
            "line-height": "normal",
            "padding": "0px",
            "margin": "0px",
            "float": "right"
        });
    }
}
async function calcolaFormatiLamiera()
{
    var materiali=await getMateriali();
	
    var id_materiale=document.getElementById("selectMaterialePopupNuovaRichiesta").value;
    var materialeObj=getFirstObjByPropValue(materiali,"id_materiale",id_materiale);
    if(materialeObj.calcolo_progettato_alternativo=="true")
    {
        var id_formato_1=document.getElementById("select1xPopupNuovaRichiesta").value;
        var id_formato_2=document.getElementById("select2xPopupNuovaRichiesta").value;
        var qnt=document.getElementById("popupNuovaRichiestaQnt").value;
        var percentuale=document.getElementById("popupNuovaRichiestaPercentuale").value;

        if(qnt!=null && qnt!='' && percentuale!=null && percentuale!='')
        {
            if(id_formato_1!=null && id_formato_1!='')
            {
                //newMouseSpinner(event);
                var formati_lamiere=await getFormatiLamiere();
                //removeMouseSpinner();

                var riga_formato_1=getFirstObjByPropValue(formati_lamiere,"id_formato",id_formato_1);

                var fogli1=(((qnt*percentuale)/100)/riga_formato_1.altezza/riga_formato_1.larghezza)*1000000;
                document.getElementById("popupNuovaRichiestaFogli1").value=parseInt(fogli1.toString().split(".")[0])+1;
            }
            if(id_formato_2!=null && id_formato_2!='')
            {
                //newMouseSpinner(event);
                var formati_lamiere=await getFormatiLamiere();
                //removeMouseSpinner();

                var riga_formato_2=getFirstObjByPropValue(formati_lamiere,"id_formato",id_formato_2);

                var fogli2=(((qnt*(100-percentuale))/100)/riga_formato_2.altezza/riga_formato_2.larghezza)*1000000;
                document.getElementById("popupNuovaRichiestaFogli2").value=parseInt(fogli2.toString().split(".")[0])+1;
            }
        }
    } 
}
async function getTotaliMaterialePopupNuovaRichiesta()
{
    var id_gruppo=document.getElementById("selectGruppoPopupNuovaRichiesta").value;
    var id_materiale=document.getElementById("selectMaterialePopupNuovaRichiesta").value;
    var id_commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;

    var materiali=await getMateriali();

    var materialeObj=getFirstObjByPropValue(materiali,"id_materiale",id_materiale);

    $.get("getTotaliMaterialePopupNuovaRichiesta.php",{id_gruppo,id_materiale,id_commessa},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
            {
                try
                {
                    var responseObj=JSON.parse(response);
                    document.getElementById("popupNuovaRichiestaTotaleCalcolato").innerHTML="Calcolato: "+responseObj.calcolato.toFixed(2)+" "+materialeObj.um;
                    document.getElementById("popupNuovaRichiestaTotaleRichiesto").innerHTML="Richiesto: "+responseObj.richiesto.toFixed(2)+" "+materialeObj.um;
                }
                catch (error)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                }
            }
        }
    });
}
function getMascheraFormatiLamiere()
{
    var button=document.getElementById("btn_formati_lamiere");

    view="formati_lamiere";

    $(".in-page-nav-bar-button").css({"border-bottom-color":"","font-weight":""});
    button.style.borderBottomColor="#4C91CB";
    button.style.fontWeight="bold";

    document.getElementById("actionBarCalcoloFabbisogno").style.display="flex";
    $(".reusable-control-bar-items").hide();
    
    document.getElementById("actionBarFormatiLamiereItems").style.display="flex";
    $(".container-items").hide();
    document.getElementById("containerFormatiLamiere").style.display="flex";

    $("#selectCommessaCalcoloFabbisognoContainer").hide(200,"swing");

    getHotFormatiLamiere("formati_lamiere","containerFormatiLamiere");
}
function creaNuovaRichiesta(commessa)
{
    return new Promise(function (resolve, reject) 
    {
        $.post("creaNuovaRichiestaCalcoloFabbisogno.php",{commessa},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve(0);
                }
                else
                {
                    resolve(response);
                }
            }
        });
    });
}
function inserisciRigaDettagliRichiestaMateriale(materiale,qnt,richiesta,gruppo,formato_1,qnt_formato_1,formato_2,qnt_formato_2)
{
    return new Promise(function (resolve, reject) 
    {
        if(formato_1=="")
            formato_1="NULL";
        if(qnt_formato_1=="")
            qnt_formato_1="NULL";
        if(formato_2=="")
            formato_2="NULL";
        if(qnt_formato_2=="")
            qnt_formato_2="NULL";

        $.post("inserisciRigaDettagliRichiestaMateriale.php",{materiale,qnt,richiesta,gruppo,formato_1,qnt_formato_1,formato_2,qnt_formato_2},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                }
                else
                    resolve(response);
            }
        });
    });
}
function checkOverflow(el)
{
   var curOverflow = el.style.overflow;

   if ( !curOverflow || curOverflow === "visible" )
      el.style.overflow = "hidden";

   var isOverflowing = el.clientWidth < el.scrollWidth 
      || el.clientHeight < el.scrollHeight;

   el.style.overflow = curOverflow;

   return isOverflowing;
}
function esportaRichiestaMateriale(id_richiesta)
{
    var inputNomeFile=document.createElement("input");
    inputNomeFile.setAttribute("type","text");
    inputNomeFile.setAttribute("value","righe_richiesta_#"+id_richiesta);
    inputNomeFile.setAttribute("id","fileNameInputSwal");
    Swal.fire
    ({
        type: 'question',
        title: 'Scegli il nome del file',
        html : inputNomeFile.outerHTML
    }).then((result) => 
    {
        if (result.value)
        {
            swal.close();
            var filename=document.getElementById("fileNameInputSwal").value;
            if(filename==null || filename=='')
            {
                var filename="righe_richiesta_#"+id_richiesta;
            }
            exportTableToExcel("dettagliRichiestaTable"+id_richiesta, filename);
        }
        else
            swal.close();
    });
}
function hideHotDisplayLicenceInfo()
{
    try {
        document.getElementById("hot-display-license-info").style.display='none';
    } catch (error) {}
}
function destroyHots(keep)
{
    try {
        hot.destroy();
    } catch (error) {}
}
function esportaExcelFormatiLamiere()
{
    var inputNomeFile=document.createElement("input");
    inputNomeFile.setAttribute("type","text");
    inputNomeFile.setAttribute("value","formati_lamiere");
    inputNomeFile.setAttribute("id","fileNameInputSwal");
    Swal.fire
    ({
        type: 'question',
        title: 'Scegli il nome del file',
        html : inputNomeFile.outerHTML
    }).then((result) => 
    {
        if (result.value)
        {
            swal.close();
            var filename=document.getElementById("fileNameInputSwal").value;
            if(filename==null || filename=='')
            {
                var filename="formati_lamiere";
            }
            try {
                document.getElementById("esportaFormatiLamiereTable").remove();
            } catch (error) {}
        
            var table=document.createElement("table");
            table.setAttribute("style","display:none");
            table.setAttribute("id","esportaFormatiLamiereTable");
        
            var tr=document.createElement("tr");
            var colHeaders=hot.getColHeader();
            colHeaders.forEach(header =>
            {
                var th=document.createElement("th");
                th.innerHTML=header;
                tr.appendChild(th);
            });
            table.appendChild(tr);
        
            var data=hot.getData();
            data.forEach(row =>
            {
                var tr=document.createElement("tr");
                row.forEach(cell =>
                {
                    var td=document.createElement("td");
                    td.innerHTML=cell;
                    tr.appendChild(td);
                });
                table.appendChild(tr);
            });
        
            document.body.appendChild(table);
            exportTableToExcel("esportaFormatiLamiereTable", filename);
        }
        else
            swal.close();
    });
}
function startEsportaRichieste()
{
    esportaRichieste=true;
    richiesteSelezionateEsportaRichieste=[];

    document.getElementById("buttonStartEsportaRichieste").style.display="none";
    document.getElementById("buttonAnnullaEsportaRichieste").style.display="";
    document.getElementById("buttonConfermaEsportaRichieste").style.display="";

    var actionElementsRichieste=document.getElementsByClassName("action-element-richieste");
    actionElementsRichieste.forEach(actionElementRichieste =>
    {
        actionElementRichieste.disabled=true;
    });

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","esporta-richieste-outer-container");
    outerContainer.setAttribute("id","esportaRichiesteOuterContainer");

    var row=document.createElement("div");
    row.setAttribute("class","esporta-richieste-row");
    var span=document.createElement("span");
    span.innerHTML="<b id='esportaRichiesteN'>0</b> richieste selezionate";
    row.appendChild(span);
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","esporta-richieste-row");
    row.setAttribute("style","max-height:600px;max-width:600px;overflow:auto;margin-top: 20px;");
    var table=document.createElement("table");
    table.setAttribute("id","esportaRichiesteTable");
    var tr=document.createElement("tr");
    var th=document.createElement("th");
    th.setAttribute("style","text-align:left");
    th.innerHTML="Materiale";
    tr.appendChild(th);
    table.appendChild(tr);
    var th=document.createElement("th");
    th.setAttribute("style","text-align:center");
    th.innerHTML="Qnt";
    tr.appendChild(th);
    var th=document.createElement("th");
    th.setAttribute("style","text-align:right");
    th.innerHTML="Um";
    tr.appendChild(th);
    table.appendChild(tr);
    row.appendChild(table);
    outerContainer.appendChild(row);

    document.body.appendChild(outerContainer);
}
async function selectEsportaRichieste(id_richiesta)
{
    if(esportaRichieste)
    {
        if(!richiesteSelezionateEsportaRichieste.includes(id_richiesta))
        {
            document.getElementById("richiesteMaterialiItem"+id_richiesta).style.outline="2px solid rgb(76, 145, 203)";
            richiesteSelezionateEsportaRichieste.push(id_richiesta);
            document.getElementById("esportaRichiesteN").innerHTML=richiesteSelezionateEsportaRichieste.length;

            var response=await getHotDettagliRichiesteMaterialiViewData("dettagli_richieste_materiali_view",id_richiesta);

            var table=document.getElementById("esportaRichiesteTable");

            var materialiTbl=[];
            for (var i = 0, row; row = table.rows[i]; i++)
            {
                materialiTbl.push(row.cells[0].innerHTML);
            }

            var dettagliLcl=[];
            response.data.forEach(dettaglio =>
            {
                var newQnt=0;

                var dettaglioCheck=getFirstObjByPropValue(dettagliLcl,"materiale",dettaglio.materiale);
                if(dettaglioCheck!=null)
                {
                    newQnt=dettaglioCheck.qnt+dettaglio.qnt;
                    var i=0;
                    dettagliLcl.forEach(function(item)
                    {
                        if(item["materiale"]==dettaglio.materiale)
                        {
                            dettagliLcl.splice(i, 1);
                        }
                        i++;
                    });
                }
                else
                {
                    newQnt=dettaglio.qnt;
                }

                var dettaglioLcl=
                {
                    materiale:dettaglio.materiale,
                    qnt:newQnt,
                    um:dettaglio.um
                }
                dettagliLcl.push(dettaglioLcl);
            });

            dettagliLcl.forEach(dettaglio =>
            {
                if(materialiTbl.includes(dettaglio.materiale))
                {
                    var newQnt=0;
                    for (var i = 1, row; row = table.rows[i]; i++)
                    {
                        if(row.cells[0].innerHTML==dettaglio.materiale)
                        {
                            newQnt=parseFloat(row.cells[1].innerHTML);
                            newQnt+=dettaglio.qnt;
                            row.cells[1].innerHTML=newQnt;
                        }
                    }
                }
                else
                {
                    var tr=document.createElement("tr");
                    var td=document.createElement("td");
                    td.setAttribute("style","text-align:left");
                    td.innerHTML=dettaglio.materiale;
                    tr.appendChild(td);
                    table.appendChild(tr);
                    var td=document.createElement("td");
                    td.setAttribute("style","text-align:center");
                    td.innerHTML=dettaglio.qnt;
                    tr.appendChild(td);
                    var td=document.createElement("td");
                    td.setAttribute("style","text-align:right");
                    td.innerHTML=dettaglio.um;
                    tr.appendChild(td);
                    table.appendChild(tr);
                }
            });
            sortTable("esportaRichiesteTable",0);
        }
        else
        {
            var oldRichiesteSelezionateEsportaRichieste=richiesteSelezionateEsportaRichieste;
            var index=oldRichiesteSelezionateEsportaRichieste.indexOf(id_richiesta);
            oldRichiesteSelezionateEsportaRichieste.splice(index, 1);
            annullaEsportaRichieste();
            startEsportaRichieste();
            oldRichiesteSelezionateEsportaRichieste.forEach(id_richiestaLcl =>
            {
                selectEsportaRichieste(id_richiestaLcl);
            });
        }
    }
}
function annullaEsportaRichieste()
{
    try {
        esportaRichieste=false;
        richiesteSelezionateEsportaRichieste=[];

        document.getElementById("buttonStartEsportaRichieste").style.display="";
        document.getElementById("buttonAnnullaEsportaRichieste").style.display="none";
        document.getElementById("buttonConfermaEsportaRichieste").style.display="none";

        var actionElementsRichieste=document.getElementsByClassName("action-element-richieste");
        actionElementsRichieste.forEach(actionElementRichieste =>
        {
            actionElementRichieste.disabled=false;
        });

        document.getElementById("esportaRichiesteOuterContainer").remove();

        var richiesteItems=document.getElementsByClassName("richieste-materiali-item-inner-container");
        richiesteItems.forEach(richiestaItem =>
        {
            richiestaItem.style.outline="";
        });
    } catch (error) {}
}
function sortTable(tableId,index)
{
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById(tableId);
    switching = true;
    while (switching)
    {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++)
        {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[index];
            y = rows[i + 1].getElementsByTagName("TD")[index];
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase())
            {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch)
        {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
async function confermaEsportaRichieste()
{
    if(richiesteSelezionateEsportaRichieste.length>0)
    {
        Swal.fire
        ({
            width:"100%",
            background:"transparent",
            title:"Caricamento in corso...",
            html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
            allowOutsideClick:false,
            showCloseButton:false,
            showConfirmButton:false,
            allowEscapeKey:false,
            showCancelButton:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
        });

        var commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;
        var commessaObj=getFirstObjByPropValue(commesse,"id_commessa",commessa);

        try {
            document.getElementById("esportaRichiesteHiddenTable").remove();
        } catch (error) {}

        var colHeaders=[];
        var data=[];

        for (let index = 0; index < richiesteSelezionateEsportaRichieste.length; index++)
        {
            const id_richiestaLcl = richiesteSelezionateEsportaRichieste[index];
            var response=await getHotDettagliRichiesteMaterialiViewData("dettagli_richieste_materiali_view",id_richiestaLcl);
            if(colHeaders.length==0)
                colHeaders=response.colHeaders;
            response.data.forEach(row =>
            {
                row["id_richiesta"]=id_richiestaLcl;
                row["commessa"]=commessaObj.nome;
                data.push(row);
            });
        }
        colHeaders.push("id_richiesta");
        colHeaders.push("commessa");
        
        var table=document.createElement("table");
        table.setAttribute("id","esportaRichiesteHiddenTable");
        table.setAttribute("style","display:none");
        var tr=document.createElement("tr");
        colHeaders.forEach(header =>
        {
            var th=document.createElement("th");
            th.innerHTML=header;
            tr.appendChild(th);
        });
        table.appendChild(tr);
        data.forEach(row =>
        {
            var tr=document.createElement("tr");
            colHeaders.forEach(header =>
            {
                var th=document.createElement("th");
                th.innerHTML=row[header];
                tr.appendChild(th);
            });
            table.appendChild(tr);
        });
        document.body.appendChild(table);

        var inputNomeFile=document.createElement("input");
        inputNomeFile.setAttribute("type","text");
        inputNomeFile.setAttribute("value","richieste_materiali_"+commessaObj.nome);
        inputNomeFile.setAttribute("id","fileNameInputSwal");
        Swal.fire
        ({
            type: 'question',
            title: 'Scegli il nome del file',
            html : inputNomeFile.outerHTML
        }).then((result) => 
        {
            if (result.value)
            {
                swal.close();
                var filename=document.getElementById("fileNameInputSwal").value;
                if(filename==null || filename=='')
                {
                    var filename="richieste_materiali_"+commessaObj.nome;
                }

                updateStatoRichieste(richiesteSelezionateEsportaRichieste,"Trasferita");
            
                exportTableToExcel("esportaRichiesteHiddenTable", filename);
            }
            else
                swal.close();
        });
    }
}
function updateStatoRichieste(id_richieste,stato)
{
    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    var JSONid_richieste=JSON.stringify(id_richieste);
    $.post("updateStatoRichiesteCalcoloFabbisogno.php",
    {
        JSONid_richieste,
        stato
    },
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                console.log(response);
                Swal.fire
                ({
                    icon:"error",
                    title: "Errore. Se il problema persiste contatta l' amministratore.",
                    showCloseButton:true,
                    showConfirmButton:false,
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                });
            }
            else
            {
                Swal.fire
                ({
                    icon:"success",
                    title: "Richieste Trasferite",
                    showCloseButton:true,
                    showConfirmButton:false,
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                }).then((result) => 
                {
                    getElencoRichiesteMateriali();
                });
            }
        }
    });
}
function importaAnagraficheCommessa(callback)
{
    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Importazione anagrafiche in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    var id_commessa=document.getElementById("selectCommessaCalcoloFabbisogno").value;

    $.post("importaAnagraficheCommessa.php",
    {
        id_commessa
    },
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                console.log(response);
                Swal.fire
                ({
                    icon:"error",
                    title: "Errore. Se il problema persiste contatta l' amministratore.",
                    showCloseButton:true,
                    showConfirmButton:false,
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                });
            }
            else
            {
                Swal.fire
                ({
                    icon:"success",
                    title: "Anagrafiche importate",
                    showCloseButton:true,
                    showConfirmButton:false,
                    timer: 2000,
                    timerProgressBar: true,
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                }).then((result) => 
                {
                    if(callback)
                        getView();
                });
            }
        }
    });
}