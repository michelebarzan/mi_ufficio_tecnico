var commesse;
var hot;
var view;
var consistenzaTronconiCellWidth=180;
var voci_aggiunte_troncone;
var id_commessa_gestione_tronconi="";

window.addEventListener("load", async function(event)
{
    Swal.fire
    ({
        title: "Controllo accesso esclusivo...",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-4x"></i>',
		background:"transparent",
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });

    var cookie_commessa=await getCookie("id_commessa_gestione_tronconi");
    if(cookie_commessa!=null && cookie_commessa!="")
        id_commessa_gestione_tronconi=cookie_commessa;
	
    var check=await checkAccessoEsclusivoConsistenzaCommesse();
    setTimeout(function()
    {
        if(!check)
        {
            Swal.close();
            insertAccessoEsclusivoConsistenzaCommesse();
            try
            {
                view=document.getElementById("parameter_view").value;
                getView();
            } catch (error) {}
        }
        else
        {
            Swal.fire
            ({
                icon: 'warning',
                title: check+' sta usando la pagina',
                width:550,
                showCancelButton: true,
                showConfirmButton: true,
                cancelButtonText: `Procedi comunque (non consigliato)`,
                confirmButtonText: `Riprova`,
                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-confirm")[0].style.fontSize="14px";document.getElementsByClassName("swal2-cancel")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
            }).then((result) =>
            {
                if (result.value)
                {
                    Swal.fire
                    ({
                        title: "Controllo accesso esclusivo...",
                        html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
                        showConfirmButton:false,
                        showCloseButton:false,
                        allowEscapeKey:false,
                        allowOutsideClick:false,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                    });
                    location.reload();
                }
                else
                {
                    deleteAccessoEsclusivoConsistenzaCommesse();
                    insertAccessoEsclusivoConsistenzaCommesse();
                    Swal.close();
                    try
                    {
                        view=document.getElementById("parameter_view").value;
                        getView();
                    } catch (error) {}
                }
            })
        }
    }, 1500);
});
function getView()
{
    if(view!=null)
        document.getElementById("btn_"+view).click();
}
async function getMascheraCollegamentoTabelle(button)
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

    view="collegamento_tabelle";

    resetContainerStyle();

    $(".in-page-nav-bar-button").css({"border-bottom-color":"","font-weight":""});
    button.style.borderBottomColor="#4C91CB";
    button.style.fontWeight="bold";

    document.getElementById("consistenzaCommesseActionBar").style.display="";
    document.getElementById("consistenzaCommesseActionBar").innerHTML="";

    document.getElementById("consistenzaCommesseContainer").style.display="";
    document.getElementById("consistenzaCommesseContainer").innerHTML="";

    var actionBar=document.getElementById("consistenzaCommesseActionBar");

    var div=document.createElement("div");
    div.setAttribute("class","rcb-select-container");
    var span=document.createElement("span");
    span.innerHTML="Commessa: ";
    div.appendChild(span);
    var select=document.createElement("select");
    select.setAttribute("style","text-decoration:none");
    select.setAttribute("id","selectCommessaConsistenzaCommesse");
    select.setAttribute("onchange","getTabellaConsistenzaCommessa(this.value)");
    div.appendChild(select);
    actionBar.appendChild(div);

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("onclick","getPopupNuovaCommessa()");
    var span=document.createElement("span");
    span.innerHTML="Nuova commessa";
    button.appendChild(span);
    var i=document.createElement("i");
    i.setAttribute("class","fad fa-layer-plus");
    i.setAttribute("style","margin-left:5px");
    button.appendChild(i);
    actionBar.appendChild(button);

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("onclick","if(document.getElementById('selectCommessaConsistenzaCommesse').value!='seleziona'){getPopupModificaCommessa(document.getElementById('selectCommessaConsistenzaCommesse').value)}else{getPopupModificaCommessa()}");
    var span=document.createElement("span");
    span.innerHTML="Modifica commessa";
    button.appendChild(span);
    var i=document.createElement("i");
    i.setAttribute("class","fa-duotone fa-pen-to-square");
    i.setAttribute("style","margin-left:5px");
    button.appendChild(i);
    actionBar.appendChild(button);

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("onclick","getPopupCronologia()");
    var span=document.createElement("span");
    span.innerHTML="Cronologia";
    button.appendChild(span);
    var i=document.createElement("i");
    i.setAttribute("class","fad fa-history");
    i.setAttribute("style","margin-left:5px");
    button.appendChild(i);
    actionBar.appendChild(button);

    var select=document.getElementById("selectCommessaConsistenzaCommesse");
    select.innerHTML="";

    var option=document.createElement("option");
    option.setAttribute("selected","selected");
    option.innerHTML="seleziona";
    select.appendChild(option);

    commesse=await getCommesse();
    commesse.forEach(commessa =>
    {
        var option=document.createElement("option");
        option.setAttribute("value",commessa.id_commessa);
        option.innerHTML=commessa.nome;
        select.appendChild(option);
    });

    Swal.close();
}
function resetContainerStyle()
{
    document.getElementById("consistenzaCommesseContainer").style.margin="";
    document.getElementById("consistenzaCommesseContainer").style.width="";
    document.getElementById("consistenzaCommesseContainer").style.maxWidth="";
    document.getElementById("consistenzaCommesseContainer").style.minWidth="";
    document.getElementById("consistenzaCommesseContainer").style.height="";
    document.getElementById("consistenzaCommesseContainer").style.maxHeight="";
    document.getElementById("consistenzaCommesseContainer").style.minHeight="";
}
async function getMascheraGestioneTronconi(button)
{
    try
    {
        hot.destroy();
    } catch (error) {}

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

    view="gestione_tronconi";

    resetContainerStyle();

    $(".in-page-nav-bar-button").css({"border-bottom-color":"","font-weight":""});
    button.style.borderBottomColor="#4C91CB";
    button.style.fontWeight="bold";

    document.getElementById("consistenzaCommesseActionBar").style.display="";
    document.getElementById("consistenzaCommesseActionBar").innerHTML="";

    document.getElementById("consistenzaCommesseContainer").style.display="";
    document.getElementById("consistenzaCommesseContainer").innerHTML="";

    document.getElementById("consistenzaCommesseContainer").style.margin="0px";
    document.getElementById("consistenzaCommesseContainer").style.width="100%";
    document.getElementById("consistenzaCommesseContainer").style.maxWidth="100%";
    document.getElementById("consistenzaCommesseContainer").style.minWidth="100%";
    document.getElementById("consistenzaCommesseContainer").style.height="calc(100% - 250px)";
    document.getElementById("consistenzaCommesseContainer").style.maxHeight="calc(100% - 250px)";
    document.getElementById("consistenzaCommesseContainer").style.minHeight="calc(100% - 250px)";

    var actionBar=document.getElementById("consistenzaCommesseActionBar");

    var div=document.createElement("div");
    div.setAttribute("class","rcb-select-container");
    var span=document.createElement("span");
    span.innerHTML="Commessa: ";
    div.appendChild(span);
    var select=document.createElement("select");
    select.setAttribute("style","text-decoration:none");
    select.setAttribute("id","selectCommessaGestioneTronconi");
    select.setAttribute("onchange","setCookie('id_commessa_gestione_tronconi',this.value);getMascheraConsistenzaTronconi()");
    div.appendChild(select);
    actionBar.appendChild(div);

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("onclick","getPopupNuovaCommessa()");
    var span=document.createElement("span");
    span.innerHTML="Nuova commessa";
    button.appendChild(span);
    var i=document.createElement("i");
    i.setAttribute("class","fad fa-layer-plus");
    i.setAttribute("style","margin-left:5px");
    button.appendChild(i);
    actionBar.appendChild(button);

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("onclick","if(document.getElementById('selectCommessaGestioneTronconi').value!='seleziona'){getPopupModificaCommessa(document.getElementById('selectCommessaGestioneTronconi').value)}else{getPopupModificaCommessa()}");
    var span=document.createElement("span");
    span.innerHTML="Modifica commessa";
    button.appendChild(span);
    var i=document.createElement("i");
    i.setAttribute("class","fa-duotone fa-pen-to-square");
    i.setAttribute("style","margin-left:5px");
    button.appendChild(i);
    actionBar.appendChild(button);

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("onclick","aggiungiTroncone(getMascheraConsistenzaTronconi)");
    var span=document.createElement("span");
    span.innerHTML="Aggiungi troncone";
    button.appendChild(span);
    var i=document.createElement("i");
    i.setAttribute("class","fa-duotone fa-split");
    i.setAttribute("style","margin-left:5px");
    button.appendChild(i);
    actionBar.appendChild(button);

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("onclick","getPopupGestioneVoci()");
    var span=document.createElement("span");
    span.innerHTML="Gestione voci";
    button.appendChild(span);
    var i=document.createElement("i");
    i.setAttribute("class","fa-duotone fa-database");
    i.setAttribute("style","margin-left:5px");
    button.appendChild(i);
    actionBar.appendChild(button);

    var div=document.createElement("div");
    div.setAttribute("class","rcb-select-container");
    div.setAttribute("style","margin-left:auto;padding:0px;background-color:transparent");
    var link=document.createElement("a");
    link.setAttribute("style","color:black;font-family:'Montserrat',sans-serif;font-size:12px")
    link.setAttribute("href","pianificazioneCommesse.php");
    link.innerHTML="Pianificazione Commesse";
    div.appendChild(link);
    var i=document.createElement("i");
    i.setAttribute("class","fa-duotone fa-chart-gantt");
    i.setAttribute("style","margin:0px;margin-left:10px;margin-right:5px");
    div.appendChild(i);
    actionBar.appendChild(div);

    var select=document.getElementById("selectCommessaGestioneTronconi");
    select.innerHTML="";

    var option=document.createElement("option");
    option.setAttribute("selected","selected");
    option.innerHTML="seleziona";
    select.appendChild(option);

    commesse=await getCommesse();
    commesse.forEach(commessa =>
    {
        var option=document.createElement("option");
        option.setAttribute("value",commessa.id_commessa);
        if(parseInt(id_commessa_gestione_tronconi)==parseInt(commessa.id_commessa))
            option.setAttribute("selected","selected");
        option.innerHTML=commessa.nome;
        select.appendChild(option);
    });

    Swal.close();

    getMascheraConsistenzaTronconi();
}
window.onbeforeunload = function() 
{
	deleteAccessoEsclusivoConsistenzaCommesse();
};
function getPopupGestioneVoci()
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("id","containerPopupVoci");
    outerContainer.setAttribute("style","max-width:calc(100% - 40px);height:550px;margin-left:20px;margin-right:20px;margin-top:15px");

    outerContainer.innerHTML="<i class='fad fa-spinner-third fa-spin'></i>";

    Swal.fire
    ({
        width:"90%",
        title:"Gestione voci",
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
                        getHotVoci();
                    }, 100);
                }
    }).then((result) => 
    {
        getMascheraConsistenzaTronconi();
    });
}
async function getHotVoci()
{
    var container = document.getElementById("containerPopupVoci");
    container.innerHTML="";

    table="voci_consistenza_tronconi";

    var response=await getHotVociData(table);

    var height=container.offsetHeight;

    if(response.data.length>0)
    {
        try
        {
            hot.destroy();
        } catch (error) {}
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
                                if(oldValue!=newValue)
                                {
                                    var id=hot.getDataAtCell(row, 0);
                                    aggiornaRigaHotVoci(id,prop,newValue,table,response.primaryKey);
                                }
                            }
                        });
                    }
                },
                afterCreateRow: (index,amount,source) =>
                {
                    creaRigaHotVoci(index,table,response.primaryKey);
                },
                beforeRemoveRow: (index,amount,physicalRows,source)  =>
                {
                    for (let i = 0; i < physicalRows.length; i++)
                    {
                        const indice = physicalRows[i];
                        var id=hot.getDataAtCell(indice, 0);
                        eliminaRigaHotVoci(id,table,response.primaryKey);
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
async function aggiornaRigaHotVoci(id,colonna,valore,table,primaryKey)
{
    var update=false;
    if(colonna=="nome")
    {
        if(valore!=="")
        {
            var duplicato=await checkDuplicateValue(valore,"nome",table,"mi_pianificazione");
            if(duplicato)
            {
                Swal.fire
                ({
                    icon:"error",
                    title: 'Esiste gia un voce chiamata "'+valore+'"',
                    background:"#404040",
                    showCloseButton:true,
                    showConfirmButton:false,
                    allowOutsideClick:true,
                    allowEscapeKey:true,
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
                }).then((result) => 
                {
                    getPopupGestioneVoci();
                });
            }
            else
                update=true;
        }
    }
    if(update)
    {
        $.get("aggiornaRigaHotPianificazioneCommesse.php",{id,colonna,valore,table,primaryKey},
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
function creaRigaHotVoci(index,table,primaryKey)
{
    $.get("creaRigaHotPianificazioneCommesse.php",{table,primaryKey},
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
function eliminaRigaHotVoci(id,table,primaryKey)
{
    $.get("eliminaRigaHotPianificazioneCommesse.php",{id,table,primaryKey},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire
                ({
                    icon:"error",
                    title: "Impossibile eliminare la voce",
                    text:"Controlla che non sia già stata usata",
                    background:"#404040",
                    showCloseButton:true,
                    showConfirmButton:false,
                    allowOutsideClick:true,
                    allowEscapeKey:true,
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-content")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
                }).then((result) => 
                {
                    getPopupGestioneVoci();
                });
                console.log(response);
            }
        }
    });
}
function getHotVociData(table)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getHotVociDataPianificazioneCommesse.php",{table},
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
function insertAccessoEsclusivoConsistenzaCommesse()
{
    $.post("insertAccessoEsclusivoConsistenzaCommesse.php",
    function(response, status)
    {
        if(status=="success")
        {
            //console.log(response);
        }
    });
}
function deleteAccessoEsclusivoConsistenzaCommesse()
{
    $.post("deleteAccessoEsclusivoConsistenzaCommesse.php",
    function(response, status)
    {
        if(status=="success")
        {
            console.log(response);
        }
    });
}
function checkAccessoEsclusivoConsistenzaCommesse()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("checkAccessoEsclusivoConsistenzaCommesse.php",
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
async function getSelectCommesse(selected)
{
    if(view=="gestione_tronconi")
        var select=document.getElementById("selectCommessaGestioneTronconi");
    else
        var select=document.getElementById("selectCommessaConsistenzaCommesse");
    select.innerHTML="";

    var option=document.createElement("option");
    option.innerHTML="seleziona";
    select.appendChild(option);

    commesse=await getCommesse();
    commesse.forEach(commessa =>
    {
        var option=document.createElement("option");
        option.setAttribute("value",commessa.id_commessa);
        if(selected==commessa.id_commessa)
            option.setAttribute("selected","selected");
        option.innerHTML=commessa.nome;
        select.appendChild(option);
    });
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
async function getPopupModificaCommessa(id_commessa)
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

    commesse=await getCommesse();
    commesse.forEach(commessa =>
    {
        var option=document.createElement("option");
        option.setAttribute("value",commessa.id_commessa);
        if(id_commessa==commessa.id_commessa)
            option.setAttribute("selected","selected");
        option.innerHTML=commessa.nome;
        select.appendChild(option);
    });
    
    row.appendChild(select);

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

    if(view=="collegamento_tabelle")
    {
        var row=document.createElement("div");
        
        row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
        row.setAttribute("id","labelTipCabConsistenzaCommessaPopup");
        row.innerHTML="Tip cab";
        outerContainer.appendChild(row);
    
        var row=document.createElement("div");
        row.setAttribute("style","display:flex;flex-direction:row;width:100%;margin-bottom:5px;justify-content:flex-start;align-items:center");
    
        var checkbox=document.createElement("input");
        checkbox.setAttribute("type","checkbox");
        checkbox.setAttribute("id","popupModificaCommessaCheckboxTipCab");
        //checkbox.setAttribute("class","dark-popup-input");
        checkbox.setAttribute("disabled","disabled");
        checkbox.setAttribute("checked","checked");
        checkbox.setAttribute("style","margin:0px;margin-right:5px;");
        row.appendChild(checkbox);
    
        var label=document.createElement("span");
        label.setAttribute("style","width:70px;margin-right:7px;color:#ddd");
        label.innerHTML="Sovrascrivi";
        row.appendChild(label);
    
        var input=document.createElement("input");
        input.setAttribute("type","file");
        input.setAttribute("accept","xlsx");
        input.setAttribute("id","popupModificaCommessaTipCab");
        input.setAttribute("class","dark-popup-input");
        input.setAttribute("disabled","disabled");
        /*input.setAttribute("onmouseover","getTooltip(this)");
        input.setAttribute("onmouseout","closeTooltip()");*/
        input.setAttribute("onchange","getSelectFoglio(this,'tip_cab')");
        input.setAttribute("style","height:auto;cursor:pointer;width:calc(100% - 95px)");
        row.appendChild(input);
    
        var select=document.createElement("select");
        select.setAttribute("id","popupModificaCommessaFoglioTipCab");
        select.setAttribute("class","dark-popup-input");
        select.setAttribute("style","display:none;width:120px;margin-left:10px;height:34px;padding-left:10px;padding-right:10px");
        row.appendChild(select);
    
        outerContainer.appendChild(row);
    
        var row=document.createElement("div");
        
        row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
        row.setAttribute("id","labelTipCorConsistenzaCommessaPopup");
        row.innerHTML="Tip cor";
        outerContainer.appendChild(row);
    
        var row=document.createElement("div");
        row.setAttribute("style","display:flex;flex-direction:row;width:100%;margin-bottom:5px;justify-content:flex-start;align-items:center");
    
        var checkbox=document.createElement("input");
        checkbox.setAttribute("type","checkbox");
        checkbox.setAttribute("id","popupModificaCommessaCheckboxTipCor");
        //checkbox.setAttribute("class","dark-popup-input");
        checkbox.setAttribute("disabled","disabled");
        checkbox.setAttribute("checked","checked");
        checkbox.setAttribute("style","margin:0px;margin-right:5px;");
        row.appendChild(checkbox);
    
        var label=document.createElement("span");
        label.setAttribute("style","width:70px;margin-right:7px;color:#ddd");
        label.innerHTML="Sovrascrivi";
        row.appendChild(label);
    
        var input=document.createElement("input");
        input.setAttribute("type","file");
        input.setAttribute("accept","xlsx");
        input.setAttribute("id","popupModificaCommessaTipCor");
        input.setAttribute("class","dark-popup-input");
        input.setAttribute("disabled","disabled");
        input.setAttribute("onchange","getSelectFoglio(this,'tip_cor')");
        input.setAttribute("style","height:auto;cursor:pointer;width:calc(100% - 95px)");
        row.appendChild(input);
    
        var select=document.createElement("select");
        select.setAttribute("id","popupModificaCommessaFoglioTipCor");
        select.setAttribute("class","dark-popup-input");
        select.setAttribute("style","display:none;width:120px;margin-left:10px;height:34px;padding-left:10px;padding-right:10px");
        row.appendChild(select);
    
        outerContainer.appendChild(row);
    }
    
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
        title:"Modifica commessa",
        animation:false,
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

                    if(id_commessa!=undefined)
                        getInfoCommessaPopupModificaCommessa(id_commessa);
                }
    });
}
function getSelectFoglio(input,origine)
{
    if(origine=="tip_cab")
    {
        document.getElementById("popupModificaCommessaFoglioTipCab").style.display="none";
        document.getElementById("popupModificaCommessaTipCab").style.width="calc(100% - 95px)";
        document.getElementById("popupModificaCommessaFoglioTipCab").innerHTML="";
        var option=document.createElement("option");
        option.setAttribute("value","");
        option.innerHTML="Lettura file...";
        document.getElementById("popupModificaCommessaFoglioTipCab").appendChild(option);
        document.getElementById("popupModificaCommessaFoglioTipCab").disabled=true;
    }
    else
    {
        document.getElementById("popupModificaCommessaFoglioTipCor").style.display="none";
        document.getElementById("popupModificaCommessaTipCor").style.width="calc(100% - 95px)";
        document.getElementById("popupModificaCommessaFoglioTipCor").innerHTML="";
        var option=document.createElement("option");
        option.setAttribute("value","");
        option.innerHTML="Lettura file...";
        document.getElementById("popupModificaCommessaFoglioTipCor").appendChild(option);
        document.getElementById("popupModificaCommessaFoglioTipCor").disabled=true;
    }
    if(input.files.length>0)
    {
        var file=input.files[0];

        var xl2json = new ExcelToJSON(origine);
        xl2json.parseExcel(file);

        if(origine=="tip_cab")
        {
            document.getElementById("popupModificaCommessaFoglioTipCab").style.display="block";
            document.getElementById("popupModificaCommessaTipCab").style.width="calc(100% - 225px)";
        }
        else
        {
            document.getElementById("popupModificaCommessaFoglioTipCor").style.display="block";
            document.getElementById("popupModificaCommessaTipCor").style.width="calc(100% - 225px)";
        }
    }
}
var ExcelToJSON = function(origine)
{
    this.parseExcel = function(file)
    {
        var reader = new FileReader();

        reader.onload = function(e)
        {
            var data = e.target.result;
            var workbook = XLSX.read(data,
            {
                type: 'binary'
            });

            if(origine=="tip_cab")
            {
                document.getElementById("popupModificaCommessaFoglioTipCab").innerHTML="";
                document.getElementById("popupModificaCommessaFoglioTipCab").disabled=false;
            }
            else
            {
                document.getElementById("popupModificaCommessaFoglioTipCor").innerHTML="";
                document.getElementById("popupModificaCommessaFoglioTipCor").disabled=false;
            }

            workbook.SheetNames.forEach(function(sheetName)
            {
                var option=document.createElement("option");
                option.setAttribute("value",sheetName);
                if(origine=="tip_cab" && sheetName=="tip-cab")
                    option.setAttribute("selected","selected");
                option.innerHTML="Foglio: "+sheetName;
                if(origine=="tip_cab")
                    document.getElementById("popupModificaCommessaFoglioTipCab").appendChild(option);
                else
                    document.getElementById("popupModificaCommessaFoglioTipCor").appendChild(option);
            });
        };

        reader.onerror = function(ex)
        {
            window.alert("Errore. Impossibile leggere il file");
        };

        reader.readAsBinaryString(file);
    };
};
async function getInfoCommessaPopupModificaCommessa(id_commessa)
{
    if(id_commessa!="" && id_commessa!=null)
    {
        document.getElementById("popupModificaCommessaDescrizione").disabled=false;
        document.getElementById("popupModificaCommessaButton").disabled=false;
        var infoCommessa=await getInfoCabineCommessa(id_commessa,"tip_cab");
        document.getElementById("popupModificaCommessaDescrizione").value=infoCommessa.descrizione;
        if(view=="collegamento_tabelle")
        {
            document.getElementById("popupModificaCommessaCheckboxTipCab").disabled=false;
            document.getElementById("popupModificaCommessaTipCab").disabled=false;
            document.getElementById("popupModificaCommessaCheckboxTipCor").disabled=false;
            document.getElementById("popupModificaCommessaTipCor").disabled=false;
            if(infoCommessa.dataImportazione==null)
                document.getElementById("labelTipCabConsistenzaCommessaPopup").innerHTML="Tip cab <i style='float:right'>Nessuna importazione</i>";
            else
                document.getElementById("labelTipCabConsistenzaCommessaPopup").innerHTML="Tip cab <i style='float:right'>Ultima importazione il "+infoCommessa.dataImportazione+"</i>";
            var infoCommessa=await getInfoCabineCommessa(id_commessa,"tip_cor");
            if(infoCommessa.dataImportazione==null)
                document.getElementById("labelTipCorConsistenzaCommessaPopup").innerHTML="Tip cor <i style='float:right'>Nessuna importazione</i>";
            else
                document.getElementById("labelTipCorConsistenzaCommessaPopup").innerHTML="Tip cor <i style='float:right'>Ultima importazione il "+infoCommessa.dataImportazione+"</i>";
        }
    }
    else
    {
        document.getElementById("popupModificaCommessaDescrizione").value="";
        document.getElementById("popupModificaCommessaDescrizione").disabled=true;
        document.getElementById("popupModificaCommessaButton").disabled=true;
        if(view=="collegamento_tabelle")
        {
            document.getElementById("labelTipCabConsistenzaCommessaPopup").innerHTML="Tip cab";
            document.getElementById("popupModificaCommessaCheckboxTipCab").disabled=true;
            document.getElementById("popupModificaCommessaTipCab").disabled=true;
            document.getElementById("labelTipCorConsistenzaCommessaPopup").innerHTML="Tip cor";
            document.getElementById("popupModificaCommessaCheckboxTipCor").disabled=true;
            document.getElementById("popupModificaCommessaTipCor").disabled=true;
        }
    }
}
function getInfoCabineCommessa(id_commessa,origine)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getInfoCabineCommessaCalcoloFabbisogno.php",{id_commessa,origine},
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

    if(view=="gestione_tronconi")
    {
        var row=document.createElement("div");
    
        row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
        row.innerHTML="N. tronconi";
        outerContainer.appendChild(row);

        var row=document.createElement("div");
        
        row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

        var input=document.createElement("input");
        input.setAttribute("class","dark-popup-input");
        input.setAttribute("type","number");
        input.setAttribute("value","1");
        input.setAttribute("id","popupNuovaCommessaNTronconi");
        
        row.appendChild(input);

        outerContainer.appendChild(row);
    }

    var row=document.createElement("div");
    row.setAttribute("class","dark-popup-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:10px");

    var confirmButton=document.createElement("button");
    confirmButton.setAttribute("class","dark-popup-button");
    if(view=="gestione_tronconi")
        confirmButton.setAttribute("style","width:100%");
    else
        confirmButton.setAttribute("style","width:calc(50% - 10px);margin-right:10px;");
    confirmButton.setAttribute("onclick","inserisciNuovaCommessa(false)");
    confirmButton.innerHTML='<span>Conferma</span><i class="fal fa-check-circle"></i>';
    row.appendChild(confirmButton);

    if(view=="collegamento_tabelle")
    {
        var nextButton=document.createElement("button");
        nextButton.setAttribute("class","dark-popup-button");
        nextButton.setAttribute("style","width:calc(50% - 10px);margin-left:10px;");
        nextButton.setAttribute("onclick","inserisciNuovaCommessa(true)");
        nextButton.innerHTML='<span>Collegamento tabelle</span><i class="fas fa-long-arrow-alt-right"></i>';
        row.appendChild(nextButton);
    }

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
function getNomeCommessa(id_commessa)
{
    return new Promise(function (resolve, reject) 
    {
        $.post("getNomeCommessa.php",{id_commessa},
        function(response, status)
        {
            if(status=="success")
            {
                resolve(response);
            }
        });
    });
}
async function modificaCommessa()
{
    var id_commessa=document.getElementById("popupModificaCommessaCommessa").value;
    var descrizione=document.getElementById("popupModificaCommessaDescrizione").value;
    var utente=await getSessionValue("username");
    var nome=await getNomeCommessa(id_commessa);

    if(view=="collegamento_tabelle")
    {
        var fileTipCab=document.getElementById("popupModificaCommessaTipCab").files[0];
        var fileTipCor=document.getElementById("popupModificaCommessaTipCor").files[0];
        var sovrascriviTipCab=document.getElementById("popupModificaCommessaCheckboxTipCab").checked;
        var foglioTipCab=document.getElementById("popupModificaCommessaFoglioTipCab").value;
        var sovrascriviTipCor=document.getElementById("popupModificaCommessaCheckboxTipCor").checked;
        var foglioTipCor=document.getElementById("popupModificaCommessaFoglioTipCor").value;

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

        if(fileTipCab==undefined && fileTipCor==undefined)
            updateAnagraficaCommessa(id_commessa,nome,descrizione);
        else
        {
            Swal.fire
            ({
                width:"100%",
                background:"transparent",
                title:"Upload file in corso...",
                html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
                allowOutsideClick:false,
                showCloseButton:false,
                showConfirmButton:false,
                allowEscapeKey:false,
                showCancelButton:false,
                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
            });
            var data= new FormData();

            var errorFile=false;

            if(fileTipCab!==undefined)
            {
                data.append('fileTipCab',fileTipCab);
                if(foglioTipCab==null || foglioTipCab=="")
                    errorFile=true;
            }
            else
                var sovrascriviTipCab=false;
            if(fileTipCor!==undefined)
            {
                data.append('fileTipCor',fileTipCor);
                if(foglioTipCor==null || foglioTipCor=="")
                    errorFile=true;
            }
            else
                var sovrascriviTipCor=false;
            
            $.ajax
            ({
                url:'uploadExcelFileConsistenzaCommessa.php',
                data:data,
                processData:false,
                contentType:false,
                type:'POST',
                success:function(response)
                        {
                            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                            {
                                if(response.indexOf("Resource temporarily unavailable")>-1)
                                {
                                    Swal.fire
                                    ({
                                        icon:"error",
                                        title: "Impossibile aprire il file perchè aperto da un'altro programma",
                                        showCloseButton:true,
                                        showConfirmButton:false,
                                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                                    }).then((result) => 
                                    {
                                        getSelectCommesse(id_commessa);
                                        getTabellaConsistenzaCommessa(id_commessa);
                                    });
                                }
                                else
                                {
                                    console.log(response);
                                    Swal.fire
                                    ({
                                        icon:"error",
                                        title: "Errore. Se il problema persiste contatta l' amministratore.",
                                        showCloseButton:true,
                                        showConfirmButton:false,
                                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                                    }).then((result) => 
                                    {
                                        getSelectCommesse(id_commessa);
                                        getTabellaConsistenzaCommessa(id_commessa);
                                    });
                                }
                            }
                            else
                            {
                                Swal.fire
                                ({
                                    width:"100%",
                                    background:"transparent",
                                    title:"Lettura file in corso...",
                                    html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
                                    allowOutsideClick:false,
                                    showCloseButton:false,
                                    showConfirmButton:false,
                                    allowEscapeKey:false,
                                    showCancelButton:false,
                                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
                                });
                                var percorsi=JSON.parse(response);
                                var JSONpercorsi=JSON.stringify(percorsi);
                                $.post("importaConsistenzaCommessa.php",{commessa:nome,utente,JSONpercorsi,sovrascriviTipCab,sovrascriviTipCor,foglioTipCab,foglioTipCor},
                                function(response, status)
                                {
                                    if(status=="success")
                                    {
                                        //console.log(response);
                                        if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1 || response.toLowerCase().indexOf("Errore")>-1)
                                        {
                                            console.log(response);
                                            Swal.fire
                                            ({
                                                icon:"error",
                                                title: response,
                                                showCloseButton:true,
                                                showConfirmButton:false,
                                                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                                            }).then((result) => 
                                            {
                                                getSelectCommesse(id_commessa);
                                                getTabellaConsistenzaCommessa(id_commessa);
                                            });
                                        }
                                        else
                                        {
                                            Swal.fire
                                            ({
                                                icon:"success",
                                                title: "Importazione completata",
                                                showCloseButton:true,
                                                showConfirmButton:false,
                                                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                                            }).then((result) => 
                                            {
                                                getSelectCommesse(id_commessa);
                                                getTabellaConsistenzaCommessa(id_commessa);
                                            });
                                        }
                                    }
                                });
                            }
                        }
            });
        }
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

        updateAnagraficaCommessa(id_commessa,nome,descrizione);
    }
}
function updateAnagraficaCommessa(id_commessa,nome,descrizione)
{
    $.post("updateAnagraficaCommessa.php",{id_commessa,nome,descrizione},
    function(response, status)
    {
        if(status=="success")
        {
            //console.log(response);
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
                    getSelectCommesse();
                });
            }
        }
    });
}
async function inserisciNuovaCommessa(consistenzaCommessa)
{
    var nome=document.getElementById("popupNuovaCommessaNome").value;
    var descrizione=document.getElementById("popupNuovaCommessaDescrizione").value;
    var tronconi=false;
    var n_tronconi=1;
    if(view=="gestione_tronconi")
    {
        tronconi=true;
        n_tronconi=document.getElementById("popupNuovaCommessaNTronconi").value;

        if(n_tronconi=="" || n_tronconi==null)
            n_tronconi=1;
    };

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
        var n_commesse=await checkNomeCommessa(nome);
        if(n_commesse==0)
        {
            $.post("insertAnagraficaCommessa.php",{nome,descrizione,tronconi,n_tronconi},
            function(response, status)
            {
                if(status=="success")
                {
                    //console.log(response);
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
                        var id_commessa=response;
                        if(consistenzaCommessa)
                            getPopupModificaCommessa(id_commessa);
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
                                getSelectCommesse();
                            });
                        }
                    }
                }
            });
        }
        else
        {
            Swal.fire
            ({
                icon:"error",
                background:"#404040",
                title: "Esiste gia una commessa con questo nome",
                showCloseButton:true,
                showConfirmButton:false,
                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
            }).then((result) => 
            {
                getPopupNuovaCommessa();
            });
        }
    }
}
function countOccourences(header,headers)
{
    var n=0;
    headers.forEach(headerObj => 
    {
        if(headerObj==header)
            n++;
    });
    return n;
}
function checkNomeCommessa(nome)
{
    return new Promise(function (resolve, reject) 
    {
        $.post("checkNomeCommessaConsistenzaCommesse.php",{nome},
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
        });
    });
}
function getTooltip(element)
{
    if(document.getElementById("tooltipOuterContainer")==null)
    {
        var rect = element.getBoundingClientRect();

        var outerContainer=document.createElement("div");
        outerContainer.setAttribute("class","tooltip-outer-container");
        outerContainer.setAttribute("id","tooltipOuterContainer");

        var innerContainer=document.createElement("div");
        innerContainer.setAttribute("class","tooltip-inner-container");

        var span=document.createElement("span");
        span.innerHTML="Il file deve contenere un foglio chiamato [tip-cab]";
        innerContainer.appendChild(span);

        /*var span=document.createElement("span");
        span.innerHTML="Il file deve contenere almeno:";
        innerContainer.appendChild(span);

        var ul=document.createElement("ul");
        var li=document.createElement("li");li.innerHTML="un foglio chiamato [tip-cab]";ul.appendChild(li);
        var li=document.createElement("li");li.innerHTML="una colonna chiamata [N°Cabina]";ul.appendChild(li);
        var li=document.createElement("li");li.innerHTML="una colonna chiamata [Nr. Codice Pareti kit]";ul.appendChild(li);

        innerContainer.appendChild(ul);*/

        outerContainer.appendChild(innerContainer);

        var arrow=document.createElement("div");
        arrow.setAttribute("class","tooltip-arrow fas fa-caret-right");
        outerContainer.appendChild(arrow);

        document.body.appendChild(outerContainer);

        var width=document.getElementById("tooltipOuterContainer").offsetWidth;
        width=rect.left-width-3;
        document.getElementById("tooltipOuterContainer").style.left=width;

        var height=document.getElementById("tooltipOuterContainer").offsetHeight;
        height=height/40;
        height=rect.top-height;
        document.getElementById("tooltipOuterContainer").style.top=height;
    }
}
function closeTooltip()
{
    try {
        document.getElementById("tooltipOuterContainer").remove();
    } catch (error) {}
}
async function getPopupCronologia()
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

    cronologia=await getCronologiaConsistenzaCommesse();

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","popup-importazione-outer-container");
    outerContainer.setAttribute("style","margin-top:15px;margin-bottom:20px;padding-bottom:0px");

    /*var button=document.createElement("div");
    button.setAttribute("style","background-color:none;border:none;border-bottom:1px solid #ddd;cursor:pointer;display:flex;align-items:center;justify-content:flex-start;flex-direction:row;margin-left:20px;margin-top:15px;margin-bottom:10px;color:#ddd;");
    button.setAttribute("onclick","getPopupNuovoTemplateExcel()");
    var span=document.createElement("span");
    span.setAttribute("style","font-size: 12px;font-weight: normal;font-family: 'Montserrat',sans-serif;");
    span.innerHTML="Consulta ultimo backup ("+cronologia[cronologia.length-1].data+")";
    button.appendChild(span);
    var i=document.createElement("i");
    i.setAttribute("style","margin-left:5px");
    i.setAttribute("class","fal fa-table");
    button.appendChild(i);
    outerContainer.appendChild(button);*/

    var i=0;
    cronologia.forEach(importazione => 
    {
        var importazioneItem=document.createElement("div");
        importazioneItem.setAttribute("class","popup-importazione-item");
        if(i==0)
            importazioneItem.setAttribute("style","margin-top:0px");

        var div=document.createElement("div");

        var span=document.createElement("span");
        span.setAttribute("style","color:#4C91CB;font-weight:bold;letter-spacing:1px;");
        span.innerHTML=importazione.origine+" "+importazione.commessa;
        div.appendChild(span);

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto");
        span.innerHTML=importazione.utente+", "+importazione.data;
        div.appendChild(span);

        importazioneItem.appendChild(div);
        
        outerContainer.appendChild(importazioneItem);
        i++;
    });

    Swal.fire
    ({
        background:"#404040",
        title:"Cronologia importazioni",
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
function getCronologiaConsistenzaCommesse()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getCronologiaConsistenzaCommesse.php",
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
async function getTabellaConsistenzaCommessa(id_commessa)
{
    var container = document.getElementById('consistenzaCommesseContainer');
    container.innerHTML="";

    if(hot!=undefined)
        hot.destroy();

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

    var consistenzaCommessa=await getConsistenzaCommessa(id_commessa);

    Swal.close();

    var columns=[];
    consistenzaCommessa.columns.forEach(title =>
    {
        var column=
        {
            data:title,
            readOnly: true
        }
        columns.push(column);
    });

    var height=container.offsetHeight;
    
    if(consistenzaCommessa.data.length>0)
    {
        hot = new Handsontable
        (
            container,
            {
                data: consistenzaCommessa.data,
                rowHeaders: true,
                manualColumnResize: true,
                colHeaders: consistenzaCommessa.columns,
                className: "htMiddle",
                filters: true,
                dropdownMenu: true,
                headerTooltips: true,
                language: 'it-IT',
                contextMenu: true,
                width:"100%",
                height,
                beforeChange: () =>
                {
                    return false;
                },
                beforeCreateRow: () =>
                {
                    return false;
                },
                beforeRemoveRow: () =>
                {
                    return false;
                },
                columns
            }
        );
        try {
            document.getElementById("hot-display-license-info").remove();
        } catch (error) {}
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
        //$('.handsontable .changeType').html('<i class="fad fa-filter"></i>');
        //$('.handsontable .changeType').append('<style>.handsontable .changeType:before{content:normal;}</style>');
    }
    else
    {
        var div=document.createElement("div");
        div.setAttribute("style","font-family:'Montserrat',sans-serif;font-size:12px;width:100%;text-align:left;font-weight:bold;margin-top:10px");
        div.innerHTML="Tabelle commessa non importate";
        container.appendChild(div);
    }
}
function aggiornaRigaConsistenzaCommessa(id_consistenza_commessa,colonna,valore)
{
    $.get("aggiornaRigaConsistenzaCommessa.php",{id_consistenza_commessa,colonna,valore},
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
function creaRigaConsistenzaCommessa(index)
{
    var id_commessa=document.getElementById("selectCommessaConsistenzaCommesse").value;
    $.get("creaRigaConsistenzaCommesse.php",{id_commessa},
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
function eliminaRigaConsistenzaCommessa(id_consistenza_commessa)
{
    $.get("eliminaRigaConsistenzaCommesse.php",{id_consistenza_commessa},
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
function getConsistenzaCommessa(id_commessa)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getConsistenzaCommessa.php",{id_commessa},
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
async function getMascheraConsistenzaTronconi()
{
    var outerContainer=document.getElementById("consistenzaCommesseContainer");
    outerContainer.innerHTML="";

    var id_commessa=document.getElementById("selectCommessaGestioneTronconi").value;
    if(id_commessa!="seleziona")
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

        var tronconi=await getTronconi(id_commessa);
    
        if(tronconi.length==0)
            aggiungiTroncone(getMascheraConsistenzaTronconi);
        else
        {
            var innerContainer=document.createElement("div");
            innerContainer.setAttribute("class","consistenza-tronconi-inner-container");
            innerContainer.setAttribute("id","consistenzaTronconiInnerContainer");
    
            for (let index = 0; index < tronconi.length; index++)
            {
                const troncone = tronconi[index];
    
                var consistenza_troncone=await getConsistenzaTroncone(troncone.id_troncone);
                console.log(consistenza_troncone);
    
                var columns=consistenza_troncone.voci_1.length+1;
                var gridTemplateColumns="";
                for (let index = 0; index < columns; index++)
                {
                    gridTemplateColumns+="auto ";
                }
                gridTemplateColumns = gridTemplateColumns.substring(0, gridTemplateColumns.length - 1);
    
                var tronconeOuterContainer=document.createElement("div");
                tronconeOuterContainer.setAttribute("class","consistenza-tronconi-troncone-outer-container");
                
                var titleContainer=document.createElement("div");
                titleContainer.setAttribute("class","consistenza-tronconi-troncone-title-container");
                titleContainer.setAttribute("style","box-sizing:border-box");

                var span=document.createElement("span");
                span.innerHTML="Troncone";
                titleContainer.appendChild(span);

                var input=document.createElement("input");
                input.setAttribute("type","text");
                input.setAttribute("onfocusout","modificaNomeTroncone(this,'"+troncone.nome+"',"+troncone.id_troncone+")");
                input.setAttribute("onkeydown","checkEnterModificaNomeTroncone(event,this)");
                input.setAttribute("value",troncone.nome);
                titleContainer.appendChild(input);

                var button=document.createElement("button");
                button.setAttribute("onclick","eliminaTroncone("+troncone.id_troncone+","+consistenza_troncone.tabled.length+")");
                button.innerHTML='<i class="fa-light fa-xmark"></i>';
                titleContainer.appendChild(button);

                tronconeOuterContainer.appendChild(titleContainer);
    
                var containerRow=document.createElement("div");
                containerRow.setAttribute("style","display:flex;flex-direction:row;align-items:flex-start;justify-content:flex-start;width:100%");
    
                var tronconeInnerContainer=document.createElement("div");
                tronconeInnerContainer.setAttribute("class","consistenza-tronconi-troncone-inner-container");
                tronconeInnerContainer.setAttribute("style","grid-template-columns: "+gridTemplateColumns+";");
                
                var cell=document.createElement("div");
                cell.setAttribute("class","consistenza-tronconi-troncone-cell-voci");
                cell.setAttribute("style","width:"+consistenzaTronconiCellWidth+"px;flex-direction:row;align-items:center;justify-content:center");
                var i=document.createElement("i");
                i.setAttribute("class","fa-regular fa-sigma");
                i.setAttribute("style","margin-right:5px;font-size:12px;color:#DA6969");
                cell.appendChild(i);
                var span=document.createElement("span");
                span.setAttribute("style","color:#DA6969;font-weight:bold;");
                span.setAttribute("id","quantitaTotaleTronconeSpan"+troncone.id_troncone);
                if(consistenza_troncone.totale==null)
                    span.innerHTML=0;
                else
                    span.innerHTML=consistenza_troncone.totale;
                cell.appendChild(span);
                tronconeInnerContainer.appendChild(cell);
    
                consistenza_troncone.voci_1.forEach(voce_1 =>
                {
                    var cell=document.createElement("div");
                    cell.setAttribute("class","consistenza-tronconi-troncone-cell-voce");
                    cell.setAttribute("style","width:"+consistenzaTronconiCellWidth+"px;box-sizing:border-box");
                    cell.setAttribute("title",voce_1.voce_consistenza_troncone_1);
    
                    var row=document.createElement("div");
                    row.setAttribute("style","display:flex;flex-direction:row;align-items:center;justify-content:flex-start;width:100%;max-width:100%;min-width:100%;overflow:hidden");
                    var span=document.createElement("span");
                    span.setAttribute("style","text-shadow: 2px 4px 3px rgba(0,0,0,0.3);");
                    span.innerHTML=voce_1.voce_consistenza_troncone_1;
                    row.appendChild(span);
                    var button=document.createElement("button");
                    button.setAttribute("onclick","eliminaVoceTroncone("+troncone.id_troncone+",1,"+voce_1.id_voce_consistenza_troncone_1+")");
                    button.setAttribute("title","Rimuovi voce");
                    button.innerHTML='<i class="fa-solid fa-xmark"></i>';
                    row.appendChild(button);
                    cell.appendChild(row);
                    
                    var row=document.createElement("div");
                    row.setAttribute("style","display:flex;flex-direction:row;align-items:center;justify-content:flex-start;width:100%");
                    var i=document.createElement("i");
                    i.setAttribute("class","fa-regular fa-sigma");
                    i.setAttribute("style","margin-left:auto;margin-right:5px;font-size:12px;color:black");
                    row.appendChild(i);
                    var span=document.createElement("span");
                    span.setAttribute("style","color:black");
                    span.innerHTML=voce_1.quantita;
                    row.appendChild(span);
                    cell.appendChild(row);
    
                    tronconeInnerContainer.appendChild(cell);
                });
    
                consistenza_troncone.voci_2.forEach(voce_2 =>
                {
                    var cell=document.createElement("div");
                    cell.setAttribute("class","consistenza-tronconi-troncone-cell-voce");
                    cell.setAttribute("style","width:"+consistenzaTronconiCellWidth+"px;box-sizing:border-box");
                    cell.setAttribute("title",voce_2.voce_consistenza_troncone_2);
    
                    var row=document.createElement("div");
                    row.setAttribute("style","display:flex;flex-direction:row;align-items:center;justify-content:flex-start;width:100%;max-width:100%;min-width:100%;overflow:hidden");
                    var span=document.createElement("span");
                    span.setAttribute("style","text-shadow: 2px 4px 3px rgba(0,0,0,0.3);");
                    span.innerHTML=voce_2.voce_consistenza_troncone_2;
                    row.appendChild(span);
                    var button=document.createElement("button");
                    button.setAttribute("onclick","eliminaVoceTroncone("+troncone.id_troncone+",2,"+voce_2.id_voce_consistenza_troncone_2+")");
                    button.setAttribute("title","Rimuovi voce");
                    button.innerHTML='<i class="fa-solid fa-xmark"></i>';
                    row.appendChild(button);
                    cell.appendChild(row);
                    
                    var row=document.createElement("div");
                    row.setAttribute("style","display:flex;flex-direction:row;align-items:center;justify-content:flex-start;width:100%");
                    var i=document.createElement("i");
                    i.setAttribute("class","fa-regular fa-sigma");
                    i.setAttribute("style","margin-left:auto;margin-right:5px;font-size:12px;color:black");
                    row.appendChild(i);
                    var span=document.createElement("span");
                    span.setAttribute("style","color:black");
                    span.innerHTML=voce_2.quantita;
                    row.appendChild(span);
                    cell.appendChild(row);
    
                    tronconeInnerContainer.appendChild(cell);
    
                    consistenza_troncone.voci_1.forEach(voce_1 =>
                    {
                        consistenza_troncone.tabled.forEach(consistenza_row =>
                        {
                            if(consistenza_row.id_voce_consistenza_troncone_1==voce_1.id_voce_consistenza_troncone_1 && consistenza_row.id_voce_consistenza_troncone_2==voce_2.id_voce_consistenza_troncone_2)
                            {
                                var cell=document.createElement("div");
                                cell.setAttribute("class","consistenza-tronconi-troncone-cell-quantita");
                                cell.setAttribute("style","width:"+consistenzaTronconiCellWidth+"px");
                                var input=document.createElement("input");
                                input.setAttribute("type","number");
                                input.setAttribute("onfocusout","aggiornaQuantitaVoceTroncone(this,"+consistenza_row.id_consistenza_troncone+")");
                                input.setAttribute("onkeydown","checkEnterAggiornaQuantitaVoceTroncone(event,this)");
                                input.setAttribute("value",consistenza_row.quantita);
                                cell.appendChild(input);
                                tronconeInnerContainer.appendChild(cell);
                            }
                        });
                    });
                });
    
                containerRow.appendChild(tronconeInnerContainer);
    
                var button=document.createElement("button");
                button.setAttribute("class","consistenza-tronconi-troncone-plus-button");
                button.setAttribute("style","margin-top:10px;margin-right:10px;height:40px");
                button.setAttribute("onclick","voci_aggiunte_troncone=[];getPopupAggiungiVoce("+troncone.id_troncone+",this,1,"+consistenza_troncone.tabled.length+")");
                button.setAttribute("title","Aggiungi voce");
                button.innerHTML='<i class="fa-duotone fa-circle-plus"></i>';
                containerRow.appendChild(button);
    
                tronconeOuterContainer.appendChild(containerRow);
    
                var containerRow=document.createElement("div");
                containerRow.setAttribute("style","display:flex;flex-direction:row;align-items:flex-start;justify-content:flex-start;width:100%;");
    
                var button=document.createElement("button");
                button.setAttribute("class","consistenza-tronconi-troncone-plus-button");
                button.setAttribute("style","margin-bottom:10px;margin-left:10px;");
                button.setAttribute("onclick","voci_aggiunte_troncone=[];getPopupAggiungiVoce("+troncone.id_troncone+",this,2,"+consistenza_troncone.tabled.length+")");
                button.setAttribute("title","Aggiungi voce");
                button.innerHTML='<i class="fa-duotone fa-circle-plus"></i>';
                containerRow.appendChild(button);
    
                tronconeOuterContainer.appendChild(containerRow);
    
                innerContainer.appendChild(tronconeOuterContainer);
            }
    
            outerContainer.appendChild(innerContainer);
    
            Swal.close();
        }
    }
}
async function modificaNomeTroncone(input,oldValue,id_troncone)
{
    var value=input.value;
    if(value=="" || value==null)
    {
        value=oldValue;
        input.value=value;
    }
    if(value.indexOf("'")>-1)
    {
        value=value.replace("'","");
        input.value=value;
    }
    if(value!=oldValue)
    {
        var duplicato=await checkDuplicateValue(value,"nome","anagrafica_tronconi","mi_pianificazione");
        if(duplicato)
        {
            Swal.fire
            ({
                icon:"error",
                title: 'Esiste già un troncone chiamato "'+value+'"',
                background:"#404040",
                showCloseButton:true,
                showConfirmButton:false,
                allowOutsideClick:true,
                allowEscapeKey:true,
                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
            });
            input.value=oldValue;
        }
        else
        {
            $.post("modificaNomeTronconePianificazioneCommesse.php",{nome:value,id_troncone},
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
function checkEnterModificaNomeTroncone(event,input)
{
    if (event.keyCode === 13 || event.keyCode === 9)
    {
        event.preventDefault();
        input.blur();
    }
}
function checkEnterAggiornaQuantitaVoceTroncone(event,input)
{
    if (event.keyCode === 13 || event.keyCode === 9)
    {
        event.preventDefault();
        input.blur();
        try
        {
            if(input.parentElement.nextSibling.className=="consistenza-tronconi-troncone-cell-quantita")
                input.parentElement.nextSibling.firstChild.focus();
        } catch (error) {}
    }
}
function aggiornaQuantitaVoceTroncone(input,id_consistenza_troncone)
{
    var value=input.value;
    if(value=="" || value==null)
    {
        value=0;
        input.value=value;
    }
    if(value.toString().indexOf(",")>-1 || value.toString().indexOf(".")>-1)
    {
        value=parseInt(value.toString());
        input.value=value;
    }
    $.post("aggiornaQuantitaVoceTronconePianificazioneCommesse.php",{quantita:value,id_consistenza_troncone},
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
                    document.getElementById("quantitaTotaleTronconeSpan"+responseObj.id_troncone).innerHTML=responseObj.totale;

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
function eliminaVoceTroncone(id_troncone,n,id_voce)
{
    $.post("eliminaVoceTronconePianificazioneCommesse.php",{id_troncone,n,id_voce},
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
                getMascheraConsistenzaTronconi();
        }
    });
}
async function getPopupAggiungiVoce(id_troncone,element,n,n_voci)
{
    var voci=await getVociNonUsate(id_troncone);

    var outerContainer=document.createElement("div");
    if(n_voci==0)
    {
        outerContainer.setAttribute("class","popup-aggiungi-voci-outer-container");
        outerContainer.setAttribute("style","width:"+((consistenzaTronconiCellWidth*2)+10)+"px");
    }
    else
        outerContainer.setAttribute("class","popup-aggiungi-voce-outer-container");

    voci.forEach(voce =>
    {
        var button=document.createElement("button");
        button.setAttribute("class","popup-aggiungi-voce-button");
        button.setAttribute("id","popupAggiungiVoceButton"+voce.id_voce);
        button.setAttribute("title",voce.nome);
        button.setAttribute("style","width:"+consistenzaTronconiCellWidth+"px;");
        if(n_voci==0)
            button.setAttribute("onclick","checkVoceTroncone(this,"+voce.id_voce+")");
        else
            button.setAttribute("onclick","aggiungiVoceTroncone("+id_troncone+","+n+","+voce.id_voce+")");

        var span=document.createElement("span");
        span.innerHTML=voce.nome;
        button.appendChild(span);

        outerContainer.appendChild(button);
    });

    var div=document.createElement("div");
    div.setAttribute("class","popup-aggiungi-voce-button");
    div.setAttribute("style","width:"+consistenzaTronconiCellWidth+"px;cursor:default");

    var input=document.createElement("input");
    input.setAttribute("value","Nuova voce...");
    input.setAttribute("onkeydown","checkNuovaVoceKeyDown(this,event,"+id_troncone+","+n+","+n_voci+")");
    div.appendChild(input);

    outerContainer.appendChild(div);

    if(n_voci==0)
    {
        Swal.fire
        ({
            title:"Scegli due voci per il troncone",
            background:"white",
            html:outerContainer.outerHTML,
            allowOutsideClick:true,
            showCloseButton:true,
            showConfirmButton:true,
            confirmButtonText:"Conferma",
            confirmButtonColor:"gray",
            allowEscapeKey:true,
            allowEnterKey:false,
            showCancelButton:false,
            onOpen : function()
                    {
                        document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";
                        document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
                        document.getElementsByClassName("swal2-title")[0].style.color="black";
                        document.getElementsByClassName("swal2-title")[0].style.fontFamily="'Montserrat',sans-serif";

                        document.getElementsByClassName("swal2-popup")[0].style.width="auto";

                        voci_aggiunte_troncone.forEach(id_voce =>
                        {
                            document.getElementById("popupAggiungiVoceButton"+id_voce).style.backgroundColor="#70B085";
                        });
                    }
        }).then((result) =>
        {
            if (result.value)
            {
                if(voci_aggiunte_troncone.length==2)
                {
                    $.post("aggiungiVociTronconePianificazioneCommesse.php",{id_troncone,voce_consistenza_troncone_1:voci_aggiunte_troncone[0],voce_consistenza_troncone_2:voci_aggiunte_troncone[1]},
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
                                getMascheraConsistenzaTronconi();
                        }
                    });
                }
                else
                {
                    Swal.fire
                    ({
                        icon:"error",
                        title: 'Scegli due voci per il troncone',
                        background:"#404040",
                        showCloseButton:true,
                        showConfirmButton:false,
                        allowOutsideClick:true,
                        allowEscapeKey:true,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
                    }).then((result) =>
                    {
                        getPopupAggiungiVoce(id_troncone,element,n,n_voci);
                    })
                }
            }
        })
    }
    else
    {
        Swal.fire
        ({
            background:"white",
            html:outerContainer.outerHTML,
            allowOutsideClick:true,
            showCloseButton:false,
            showConfirmButton:false,
            allowEscapeKey:true,
            showCancelButton:false,
            onOpen : function()
                    {
                        document.getElementsByClassName("swal2-title")[0].style.display="none";
                        document.getElementsByClassName("swal2-header")[0].style.padding="0px";
                        document.getElementsByClassName("swal2-content")[0].style.padding="0px";
    
                        document.getElementsByClassName("swal2-container")[0].style.display="block";
                        document.getElementsByClassName("swal2-container")[0].style.flexDirection="";
                        document.getElementsByClassName("swal2-container")[0].style.alignItems="";
                        document.getElementsByClassName("swal2-container")[0].style.justifyContent="";
                        document.getElementsByClassName("swal2-container")[0].style.padding="0px";
                        //document.getElementsByClassName("swal2-container")[0].style.background="transparent";
    
                        document.getElementsByClassName("swal2-popup")[0].style.margin="0px";
                        document.getElementsByClassName("swal2-popup")[0].style.boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)";
                        document.getElementsByClassName("swal2-popup")[0].style.width=(consistenzaTronconiCellWidth+10)+"px";
                        document.getElementsByClassName("swal2-popup")[0].style.boxSizing="border-box";
                        document.getElementsByClassName("swal2-popup")[0].style.padding="2.5px";

                        var rect = element.getBoundingClientRect();
                        if(n==1)
                        {
                            document.getElementsByClassName("swal2-popup")[0].style.top=rect.top+"px";
                            document.getElementsByClassName("swal2-popup")[0].style.left=(rect.left-10-document.getElementsByClassName("swal2-popup")[0].offsetWidth)+"px";
                        }
                        else
                        {
                            document.getElementsByClassName("swal2-popup")[0].style.top=rect.top+"px";
                            document.getElementsByClassName("swal2-popup")[0].style.left=(rect.left+10+element.offsetWidth)+"px";
                        }
                    }
        });
    }
}
function checkVoceTroncone(button,id_voce)
{
    if(voci_aggiunte_troncone.length==2)
    {
        document.getElementById("popupAggiungiVoceButton"+voci_aggiunte_troncone[0]).style.backgroundColor="";
        voci_aggiunte_troncone.shift();
    }
    voci_aggiunte_troncone.push(id_voce);
    document.getElementById("popupAggiungiVoceButton"+id_voce).style.backgroundColor="#70B085";
}
function checkNuovaVoceKeyDown(input,event,id_troncone,n,n_voci)
{
    if(input.value=='Nuova voce...')
        input.value='';
        
    input.style.color='white';

    if (event.keyCode === 13)
    {
        creaNuovaVoceConsistenzaTronconi(input.value,id_troncone,n,n_voci);
    }
}
async function creaNuovaVoceConsistenzaTronconi(nome,id_troncone,n,n_voci)
{
    if(nome!="" && nome!=null && nome!="Nuova voce...")
    {
        nome=nome.replace("'","");
        var duplicato=await checkDuplicateValue(nome,"nome","voci_consistenza_tronconi","mi_pianificazione");
        if(duplicato)
        {
            Swal.fire
            ({
                icon:"error",
                title: 'Esiste già una voce chiamata "'+nome+'"',
                background:"#404040",
                showCloseButton:true,
                showConfirmButton:false,
                allowOutsideClick:true,
                allowEscapeKey:true,
                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
            });
        }
        else
        {
            $.post("creaNuovaVoceConsistenzaTronconiPianificazioneCommesse.php",{nome},
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
                        if(n_voci==0)
                        {
                            if(voci_aggiunte_troncone.length==2)
                                voci_aggiunte_troncone.shift();
                            voci_aggiunte_troncone.push(response);
                            getPopupAggiungiVoce(id_troncone,null,n,n_voci);
                        }
                        else
                            aggiungiVoceTroncone(id_troncone,n,response);
                    }
                }
            });
        }
    }
}
function aggiungiVoceTroncone(id_troncone,n,id_voce)
{
    $.post("aggiungiVoceTronconePianificazioneCommesse.php",{id_troncone,n,id_voce},
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
                getMascheraConsistenzaTronconi();
        }
    });
}
function getVociNonUsate(id_troncone)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getVociNonUsatePianificazioneCommesse.php",{id_troncone},
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
function getConsistenzaTroncone(id_troncone)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getConsistenzaTroncone.php",{id_troncone},
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
function aggiungiTroncone(callback)
{
    var id_commessa=document.getElementById("selectCommessaGestioneTronconi").value;
    if(id_commessa!="seleziona")
    {
        $.post("aggiungiTroncone.php",{id_commessa},
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
                    callback();
            }
        });
    }
}
function getTronconi()
{
    var id_commessa=document.getElementById("selectCommessaGestioneTronconi").value;

    return new Promise(function (resolve, reject) 
    {
        $.get("getTronconi.php",{id_commessa},
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
function eliminaTroncone(id_troncone,n_voci)
{
    if(n_voci==0)
    {
        $.post("eliminaTroncone.php",{id_troncone},
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
                        title: "Impossibile eliminare il troncone",
                        text:"Controlla che non sia già stata usato",
                        background:"#404040",
                        showCloseButton:true,
                        showConfirmButton:false,
                        allowOutsideClick:true,
                        allowEscapeKey:true,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-content")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
                    });
                }
                else
                    getMascheraConsistenzaTronconi();
            }
        });
    }
    else
    {
        Swal.fire
        ({
            icon:"error",
            title: 'Prima di eliminare un troncone devi rimuovere tutte le voci',
            background:"#404040",
            showCloseButton:true,
            showConfirmButton:false,
            allowOutsideClick:true,
            allowEscapeKey:true,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
        });
    }
}