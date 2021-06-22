var mi_webapp_params;
var view;
var id_commessa_gestione_macro_attivita="";
var hot;
var gestione_macro_attivita_id_macro_attivita;
var gestione_macro_attivita_selected_row;
var intervalHighlightMacroAttivitaSelezionata;
var consistenzaTronconiCellWidth=180;
var gestioneMacroAttivitaChartsAndamento=[];

window.addEventListener("load", async function(event)
{
    mi_webapp_params=await getMiWebappParams();

    var cookie_commessa=await getCookie("id_commessa_gestione_macro_attivita");
    if(cookie_commessa!=null && cookie_commessa!="")
        id_commessa_gestione_macro_attivita=cookie_commessa;
});
function getView()
{
    if(view!=null)
        document.getElementById("btn_"+view).click();
}
async function getMascheraGestioneAttivita(button)
{
    view="gestione_attivita";

    $(".in-page-nav-bar-button").css({"border-bottom-color":"","font-weight":""});
    button.style.borderBottomColor="#4C91CB";
    button.style.fontWeight="bold";

    document.getElementById("actionBarPianificazioneCommesse").style.display="";
    document.getElementById("actionBarPianificazioneCommesse").innerHTML="";

    resetContainerStyle();
    clearViewIntervals();

    document.getElementById("pianificazioneCommesseContainer").style.display="";
    document.getElementById("pianificazioneCommesseContainer").innerHTML="";

    var actionBar=document.getElementById("actionBarPianificazioneCommesse");

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("onclick","getPopupNuovaAttivita()");
    var span=document.createElement("span");
    span.innerHTML="Nuova attività";
    button.appendChild(span);
    var i=document.createElement("i");
    i.setAttribute("class","fad fa-plus-circle");
    button.appendChild(i);
    actionBar.appendChild(button);

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("onclick","getPopupEliminaAttivita()");
    var span=document.createElement("span");
    span.innerHTML="Elimina attività";
    button.appendChild(span);
    var i=document.createElement("i");
    i.setAttribute("class","fad fa-trash");
    button.appendChild(i);
    actionBar.appendChild(button);

    getHotGestioneAttivita();
}
async function getHotGestioneAttivita()
{
    var container = document.getElementById('pianificazioneCommesseContainer');
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

    var response=await getHotAttivita();

    Swal.close();

	var height=container.offsetHeight;

    if(response.data.length>0)
    {
        try
        {
            hot.destroy();
        }
        catch (error) {};

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
                contextMenu: false,
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
                            if(prop!="id_attivita")
                            {
                                if(oldValue!=newValue)
                                {
                                    var id_attivita=hot.getDataAtCell(row, 0);
                                    aggiornaRigaAttivita(id_attivita,prop,newValue,row);
                                }
                            }
                        });
                    }
                },
                beforeCreateRow: (index,amount,source) =>
                {
                    return false;
                },
                beforeRemoveRow: (index,amount,physicalRows,source)  =>
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
function getHotAttivita()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getHotAttivitaPianificazioneCommesse.php",
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
async function aggiornaRigaAttivita(id,colonna,valore,row)
{
    var update=false;
    if(colonna=="nome")
    {
        var duplicato=await checkDuplicateValue(valore,"nome","anagrafica_attivita","mi_pianificazione");
        if(duplicato)
        {
            Swal.fire
            ({
                icon:"error",
                title: 'Esiste gia un attività chiamata "'+valore+'"',
                background:"#404040",
                showCloseButton:true,
                showConfirmButton:false,
                allowOutsideClick:true,
                allowEscapeKey:true,
                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
            }).then((result) => 
            {
                getHotGestioneAttivita();
            });
        }
        else
            update=true;
    }
    else
        update=true;
    if(update)
    {
        $.get("aggiornaRigaHotAttivitaPianificazioneCommesse.php",{id,colonna,valore},
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
                    if(response.toLowerCase().indexOf("refresh")>-1)
                        getHotGestioneAttivita();
                }
            }
        });
    }
}
async function getPopupNuovaAttivita()
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

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","dark-popup-outer-container");

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row
    row.innerHTML="Nome";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("class","dark-popup-input");input.setAttribute("type","text");
    input.setAttribute("id","popupNuovaAttivitaNome");
    
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
    textarea.setAttribute("id","popupNuovaAttivitaDescrizione");
    
    row.appendChild(textarea);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Macro attivita";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var select=document.createElement("select");
    select.setAttribute("class","dark-popup-select");
    select.setAttribute("id","popupNuovaAttivitaMacroAttivita");

    var option=document.createElement("option");
    option.setAttribute("value","NULL");
    option.innerHTML="Nessuna";
    select.appendChild(option);

    var macro_attivita=await getMacroAttivita();
    macro_attivita.forEach(macro_attivita_item =>
    {
        var option=document.createElement("option");
        option.setAttribute("value",macro_attivita_item.id_macro_attivita);
        option.innerHTML=macro_attivita_item.nome;
        select.appendChild(option);
    });
    
    row.appendChild(select);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","dark-popup-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:10px");

    var confirmButton=document.createElement("button");
    confirmButton.setAttribute("class","dark-popup-button");
    confirmButton.setAttribute("style","width:100%;");
    confirmButton.setAttribute("onclick","inserisciNuovaAttivita()");
    confirmButton.innerHTML='<span>Conferma</span><i class="fal fa-check-circle"></i>';
    row.appendChild(confirmButton);    

    outerContainer.appendChild(row);

    Swal.fire
    ({
        background:"#404040",
        title:"Nuova attivita",
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
                    document.getElementsByClassName("swal2-title")[0].style.backgroundColor="#363636";
                    document.getElementsByClassName("swal2-title")[0].style.height="40px";
                    document.getElementsByClassName("swal2-title")[0].style.lineHeight="40px";
                    document.getElementsByClassName("swal2-title")[0].style.borderTopLeftRadius="8px";
                    document.getElementsByClassName("swal2-title")[0].style.borderTopRightRadius="8px";
                    document.getElementsByClassName("swal2-title")[0].style.paddingLeft="20px";
                    document.getElementsByClassName("swal2-title")[0].style.boxSizing="border-box";
                    document.getElementsByClassName("swal2-title")[0].style.margin="0px";
                    document.getElementsByClassName("swal2-title")[0].style.fontFamily="'Montserrat',sans-serif";
                    document.getElementsByClassName("swal2-title")[0].style.textAlign="left";

                    document.getElementsByClassName("swal2-close")[0].style.width="40px";
                    document.getElementsByClassName("swal2-close")[0].style.height="40px";
                    document.getElementsByClassName("swal2-confirm")[0].style.display="none";
                    document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-header")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-actions")[0].style.margin="0px";
                }
    });
}
async function inserisciNuovaAttivita()
{
    $(".dark-popup-input").css("border","");

    var nome=document.getElementById("popupNuovaAttivitaNome").value.replace("'","");
    var descrizione=document.getElementById("popupNuovaAttivitaDescrizione").value;
    var macro_attivita=document.getElementById("popupNuovaAttivitaMacroAttivita").value;

    if(nome=="" || nome==null)
        document.getElementById("popupNuovaAttivitaNome").style.border="2px solid #DA6969";
    else
    {
        var duplicato=await checkDuplicateValue(nome,"nome","anagrafica_attivita","mi_pianificazione");
        if(duplicato)
        {
            Swal.fire
            ({
                icon:"error",
                title: 'Esiste gia un attività chiamata "'+nome+'"',
                background:"#404040",
                showCloseButton:true,
                showConfirmButton:false,
                allowOutsideClick:true,
                allowEscapeKey:true,
                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
            }).then((result) => 
            {
                getPopupNuovaAttivita();
            });
        }
        else
        {
            $.post("inserisciNuovaAttivitaPianificazioneCommesse.php",{nome,descrizione,macro_attivita},
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
                        let timerInterval;
                        Swal.fire
                        ({
                            icon:"success",
                            title: "Attività inserita",
                            background:"#404040",
                            showCloseButton:true,
                            showConfirmButton:false,
                            allowOutsideClick:true,
                            allowEscapeKey:true,
                            timer: 2000,
                            timerProgressBar: true,
                            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
                            onClose: () => {clearInterval(timerInterval)}
                        }).then((result) => 
                        {
                            getHotGestioneAttivita();
                        });
                    }
                }
            });
        }
    }
}
function getMacroAttivita()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getMacroAttivitaPianificazioneCommesse.php",
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
async function getPopupEliminaAttivita()
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

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","dark-popup-outer-container");

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;");
    row.innerHTML="Nome";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var select=document.createElement("select");
    select.setAttribute("class","dark-popup-select");
    select.setAttribute("id","popupEliminaAttivitaIdAttivita");

    var attivita=await getAttivita();
    attivita.forEach(attivita_item =>
    {
        var option=document.createElement("option");
        option.setAttribute("value",attivita_item.id_attivita);
        option.innerHTML=attivita_item.nome;
        select.appendChild(option);
    });
    
    row.appendChild(select);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","dark-popup-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:10px");

    var confirmButton=document.createElement("button");
    confirmButton.setAttribute("class","dark-popup-button");
    confirmButton.setAttribute("style","width:100%;");
    confirmButton.setAttribute("onclick","eliminaAttivita()");
    confirmButton.innerHTML='<span>Conferma</span><i class="fad fa-trash"></i>';
    row.appendChild(confirmButton);    

    outerContainer.appendChild(row);

    Swal.fire
    ({
        background:"#404040",
        title:"Elimina attivita",
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
                    document.getElementsByClassName("swal2-title")[0].style.backgroundColor="#363636";
                    document.getElementsByClassName("swal2-title")[0].style.height="40px";
                    document.getElementsByClassName("swal2-title")[0].style.lineHeight="40px";
                    document.getElementsByClassName("swal2-title")[0].style.borderTopLeftRadius="8px";
                    document.getElementsByClassName("swal2-title")[0].style.borderTopRightRadius="8px";
                    document.getElementsByClassName("swal2-title")[0].style.paddingLeft="20px";
                    document.getElementsByClassName("swal2-title")[0].style.boxSizing="border-box";
                    document.getElementsByClassName("swal2-title")[0].style.margin="0px";
                    document.getElementsByClassName("swal2-title")[0].style.fontFamily="'Montserrat',sans-serif";
                    document.getElementsByClassName("swal2-title")[0].style.textAlign="left";

                    document.getElementsByClassName("swal2-close")[0].style.width="40px";
                    document.getElementsByClassName("swal2-close")[0].style.height="40px";
                    document.getElementsByClassName("swal2-confirm")[0].style.display="none";
                    document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-header")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-actions")[0].style.margin="0px";

                    $("#popupEliminaAttivitaIdAttivita").multipleSelect(
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
function getAttivita()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getAttivitaPianificazioneCommesse.php",
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
function eliminaAttivita()
{
    var id_attivita=document.getElementById("popupEliminaAttivitaIdAttivita").value;

    $.post("eliminaAttivitaPianificazioneCommesse.php",{id_attivita},
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
                let timerInterval;
                Swal.fire
                ({
                    icon:"success",
                    title: "Attività eliminata",
                    background:"#404040",
                    showCloseButton:true,
                    showConfirmButton:false,
                    allowOutsideClick:true,
                    allowEscapeKey:true,
                    timer: 2000,
                    timerProgressBar: true,
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
                    onClose: () => {clearInterval(timerInterval)}
                }).then((result) => 
                {
                    getHotGestioneAttivita();
                });
            }
        }
    });
}
async function getHotMacroAttivita()
{
    var container = document.getElementById("gestioneMacroAttivitaHotContainer");
    container.innerHTML="";

    table="macro_attivita";

    var response=await getHotMacroAttivitaData(table);

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
                filters: true,
                dropdownMenu: true,
                headerTooltips: true,
                language: 'it-IT',
                contextMenu: true,
                colWidths:[150,150,175,75],
                enterBeginsEditing:false,
                width:"100%",
                columnSorting: true,
                height,
                columns:response.columns,
                afterSelectionEnd: (row,column,row2,column2,selectionLayerLevel) =>
                {
                    clearHotMacroAttivitaRowSelection();
                    if(row==row2)
                    {
                        if(gestione_macro_attivita_selected_row!=row)
                        {
                            gestione_macro_attivita_id_macro_attivita=hot.getDataAtCell(row, 0);
                            gestione_macro_attivita_selected_row=row;
                            getMascheraDettagliMacroAttivita();
                        }
                    }
                    else
                    {
                        gestione_macro_attivita_id_macro_attivita=null;
                        gestione_macro_attivita_selected_row=null;
                        document.getElementById("gestioneMacroAttivitaDettagliContainer").innerHTML="";

                        var div=document.createElement("div");
                        div.setAttribute("style","height:100%;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center");
                        var i=document.createElement("i");
                        i.setAttribute("style","font-size:45px;margin-bottom:10px");
                        i.setAttribute("class","fa-duotone fa-arrow-pointer");
                        div.appendChild(i);
                        var span=document.createElement("span");
                        span.setAttribute("style","font-family: 'Montserrat',sans-serif;color:black;font-weight: bold;font-size:14px;");
                        span.innerHTML="Seleziona una sola macro attività";
                        div.appendChild(span);
                        document.getElementById("gestioneMacroAttivitaDettagliContainer").appendChild(div);
                    }
                },
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
                                    aggiornaRigaHotMacroAttivita(id,prop,newValue,table,response.primaryKey);
                                }
                            }
                        });
                    }
                },
                afterCreateRow: (index,amount,source) =>
                {
                    creaRigaHotMacroAttivita(index,table,response.primaryKey);
                },
                beforeRemoveRow: (index,amount,physicalRows,source)  =>
                {
                    for (let i = 0; i < physicalRows.length; i++)
                    {
                        const indice = physicalRows[i];
                        var id=hot.getDataAtCell(indice, 0);
                        eliminaRigaHotMacroAttivita(id,table,response.primaryKey);
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
function clearHotMacroAttivitaRowSelection(row)
{
    try
    {
        var data=hot.getData();
        var colHeaders=hot.getColHeader();
        for (let row = 0; row < data.length; row++)
        {
            for (let index = 0; index < colHeaders.length; index++)
            {
                var td=hot.getCell(row,index,true);
                td.style.background="";
                td.style.color="";
            }
        }
    }
    catch (error) {}
}
function displayHotMacroAttivitaRowSelection(row)
{
    try
    {
        var colHeaders=hot.getColHeader();
        for (let index = 0; index < colHeaders.length; index++)
        {
            var td=hot.getCell(row,index,true);
            td.style.background="#4C91CB";
            td.style.color="white";
        }
    }
    catch (error) {}
}
async function aggiornaRigaHotMacroAttivita(id,colonna,valore,table,primaryKey)
{
    var update=false;
    if(colonna=="nome")
    {
        if(valore!=="")
        {
            var duplicato=await checkDuplicateValue(valore,"nome","macro_attivita","mi_pianificazione");
            if(duplicato)
            {
                Swal.fire
                ({
                    icon:"error",
                    title: 'Esiste gia un macro attività chiamata "'+valore+'"',
                    background:"#404040",
                    showCloseButton:true,
                    showConfirmButton:false,
                    allowOutsideClick:true,
                    allowEscapeKey:true,
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
                }).then((result) => 
                {
                    getHotMacroAttivita();
                });
            }
            else
                update=true;
        }
    }
    else
    {
        if(colonna=="durata")
        {
            if (valore === parseInt(valore, 10))
                update=true;
            else
            {
                Swal.fire
                ({
                    icon:"error",
                    title: 'Il campo durata deve contenere un valore numerico intero',
                    background:"#404040",
                    showCloseButton:true,
                    showConfirmButton:false,
                    allowOutsideClick:true,
                    allowEscapeKey:true,
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
                }).then((result) => 
                {
                    getHotMacroAttivita();
                });
            }
        }
        else
            update=true;
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
                else
                {
                    if(response.toLowerCase().indexOf("refresh")>-1)
                        getHotGestioneAttivita();
                }
            }
        });
    }
}
function creaRigaHotMacroAttivita(index,table,primaryKey)
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
function eliminaRigaHotMacroAttivita(id,table,primaryKey)
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
                    title: "Impossibile eliminare la macro attività",
                    text:"Controlla che non sia già stata usata",
                    background:"#404040",
                    showCloseButton:true,
                    showConfirmButton:false,
                    allowOutsideClick:true,
                    allowEscapeKey:true,
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-content")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
                }).then((result) => 
                {
                    getHotMacroAttivita();
                });
                console.log(response);
            }
        }
    });
}
function getHotMacroAttivitaData(table)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getHotMacroAttivitaDataPianificazioneCommesse.php",{table},
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
function getMascheraGestioneCommesse(button)
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

    view="gestione_commesse";

    $(".in-page-nav-bar-button").css({"border-bottom-color":"","font-weight":""});
    button.style.borderBottomColor="#4C91CB";
    button.style.fontWeight="bold";

    document.getElementById("actionBarPianificazioneCommesse").style.display="";
    document.getElementById("actionBarPianificazioneCommesse").innerHTML="";

    resetContainerStyle();
    clearViewIntervals();

    document.getElementById("pianificazioneCommesseContainer").style.display="";
    document.getElementById("pianificazioneCommesseContainer").innerHTML="";

    setTimeout(() => {
        gotopath('consistenzaCommesse.php?view=gestione_tronconi');
    }, 500);
}
async function getMascheraGestioneMacroAttivita(button)
{
    view="gestione_macro_attivita";

    $(".in-page-nav-bar-button").css({"border-bottom-color":"","font-weight":""});
    button.style.borderBottomColor="#4C91CB";
    button.style.fontWeight="bold";

    document.getElementById("actionBarPianificazioneCommesse").style.display="";
    document.getElementById("actionBarPianificazioneCommesse").innerHTML="";

    resetContainerStyle();
    clearViewIntervals();

    document.getElementById("pianificazioneCommesseContainer").style.display="";
    document.getElementById("pianificazioneCommesseContainer").innerHTML="";

    document.getElementById("pianificazioneCommesseContainer").style.width="100%";
    document.getElementById("pianificazioneCommesseContainer").style.maxWidth="100%";
    document.getElementById("pianificazioneCommesseContainer").style.minWidth="100%";
    document.getElementById("pianificazioneCommesseContainer").style.marginLeft="0px";
    document.getElementById("pianificazioneCommesseContainer").style.marginRight="0px";

    gestione_macro_attivita_id_macro_attivita=null;
    gestione_macro_attivita_selected_row=null;

    intervalHighlightMacroAttivitaSelezionata=setInterval(() =>
    {
        if(gestione_macro_attivita_selected_row!=null)
        {
            try
            {
                displayHotMacroAttivitaRowSelection(gestione_macro_attivita_selected_row);
            } catch (error) {}
        }
        else
            clearHotMacroAttivitaRowSelection();
    }, 100);

    var actionBar=document.getElementById("actionBarPianificazioneCommesse");

    var div=document.createElement("div");
    div.setAttribute("class","rcb-select-container");
    var span=document.createElement("span");
    span.innerHTML="Commessa: ";
    div.appendChild(span);
    var select=document.createElement("select");
    select.setAttribute("style","text-decoration:none");
    select.setAttribute("id","selectCommessa");
    select.setAttribute("onchange","setCookie('id_commessa_gestione_macro_attivita',this.value);id_commessa_gestione_macro_attivita=this.value;getMascheraDettagliMacroAttivita()");
    var option=document.createElement("option");
    option.setAttribute("selected","selected");
    option.innerHTML="seleziona";
    select.appendChild(option);

    commesse=await getCommesse();
    commesse.forEach(commessa =>
    {
        var option=document.createElement("option");
        option.setAttribute("value",commessa.id_commessa);
        if(parseInt(id_commessa_gestione_macro_attivita)==parseInt(commessa.id_commessa))
            option.setAttribute("selected","selected");
        option.innerHTML=commessa.nome;
        select.appendChild(option);
    });
    div.appendChild(select);
    actionBar.appendChild(div);    

    var innerContainer=document.createElement("div");
    innerContainer.setAttribute("class","gestione-macro-attivita-container");

    var hotContainer=document.createElement("div");
    hotContainer.setAttribute("class","gestione-macro-attivita-hot-container");
    hotContainer.setAttribute("id","gestioneMacroAttivitaHotContainer");
    innerContainer.appendChild(hotContainer);

    var dettagliMacroAttivitaContainer=document.createElement("div");
    dettagliMacroAttivitaContainer.setAttribute("class","gestione-macro-attivita-dettagli-container");
    dettagliMacroAttivitaContainer.setAttribute("id","gestioneMacroAttivitaDettagliContainer");
    innerContainer.appendChild(dettagliMacroAttivitaContainer);

    document.getElementById("pianificazioneCommesseContainer").appendChild(innerContainer);

    getHotMacroAttivita();

    getMascheraDettagliMacroAttivita();
}
async function getMascheraDettagliMacroAttivita()
{
    var alert=true;
    var alertMessage="";

    var container=document.getElementById("gestioneMacroAttivitaDettagliContainer");
    container.innerHTML="";

    clearHotMacroAttivitaRowSelection();

    var id_commessa=document.getElementById("selectCommessa").value;

    if(gestione_macro_attivita_id_macro_attivita!=null && id_commessa!="seleziona")
    {
        alert=false;

        var macro_attivita_array=await getMacroAttivita();
        var macro_attivita=getFirstObjByPropValue(macro_attivita_array,"id_macro_attivita",gestione_macro_attivita_id_macro_attivita);

        var tronconi=await getTronconi(id_commessa);
    
        if(tronconi.length==0)
            aggiungiTroncone(getMascheraDettagliMacroAttivita,id_commessa);
        else
        {
            var anagrafica_andamenti=await getAnagraficaAndamenti();
            gestioneMacroAttivitaChartsAndamento=[];

            for (let index = 0; index < tronconi.length; index++)
            {
                var troncone=tronconi[index];
                
                var macro_attivita_milestone=await getMacroAttivitaMilestone(troncone.id_troncone,gestione_macro_attivita_id_macro_attivita);

                var milestones=await getMilestones(troncone.id_troncone);

                var totali=await getTotaliTronconeGestioneMacroAttivita(troncone.id_troncone,gestione_macro_attivita_id_macro_attivita);

                var tronconeOuterContainer=document.createElement("div");
                tronconeOuterContainer.setAttribute("class","gestione-macro-attivita-troncone-outer-container");

                var titleContainer=document.createElement("div");
                titleContainer.setAttribute("class","gestione-macro-attivita-troncone-title-container");
                titleContainer.setAttribute("style","box-sizing:border-box");

                var span=document.createElement("span");
                span.setAttribute("class","gestione-macro-attivita-troncone-title-container-span");
                span.innerHTML="Troncone <b style='color:#4C91CB'>"+troncone.nome+"</b>";
                titleContainer.appendChild(span);

                var span=document.createElement("span");
                span.setAttribute("class","gestione-macro-attivita-troncone-title-container-span");
                span.setAttribute("style","color:rgb(218, 105, 105);margin-left:auto;margin-right:15px");
                span.setAttribute("id","gestioneMacroAttivitaTronconeTitleContainerSpanError"+troncone.id_troncone);
                titleContainer.appendChild(span);

                var div=document.createElement("div");
                div.setAttribute("style","display:flex;flex-direction:column;align-items: flex-start;justify-content: space-evenly;margin-right:10px");

                var span=document.createElement("span");
                span.setAttribute("class","gestione-macro-attivita-troncone-title-container-span");
                span.setAttribute("id","gestioneMacroAttivitaTronconeTitleContainerSpanDurata"+troncone.id_troncone);
                if(totali.durata>0)
                    span.innerHTML="<b style='color:#4C91CB'>"+totali.durata+"</b> settimane";
                else
                    span.innerHTML="<b style='color:#DA6969'>"+totali.durata+"</b> settimane";
                div.appendChild(span);

                var span=document.createElement("span");
                span.setAttribute("class","gestione-macro-attivita-troncone-title-container-span");
                span.setAttribute("id","gestioneMacroAttivitaTronconeTitleContainerSpanCabine"+troncone.id_troncone);
                span.innerHTML="<b style='color:#4C91CB'>"+totali.cabine+"</b> cabine";
                div.appendChild(span);

                titleContainer.appendChild(div);

                var button=document.createElement("button");
                button.setAttribute("id","gestioneMacroAttivitaDurataSaveButton"+troncone.id_troncone);
                button.setAttribute("onclick","salvaModificheMacroAttivita("+troncone.id_troncone+","+gestione_macro_attivita_id_macro_attivita+","+macro_attivita_milestone.id_macro_attivita_milestone+")");
                var span=document.createElement("span");
                span.innerHTML="Salva modifiche";
                button.appendChild(span);
                var i=document.createElement("i");
                i.setAttribute("class","fa-solid fa-save");
                button.appendChild(i);
                titleContainer.appendChild(button);

                tronconeOuterContainer.appendChild(titleContainer);

                var tronconeInnerContainer=document.createElement("div");
                tronconeInnerContainer.setAttribute("class","gestione-macro-attivita-troncone-inner-container");
                tronconeOuterContainer.appendChild(tronconeInnerContainer);

                //----------------------------------------------------------------------------------------------------------------------------

                var row=document.createElement("row");
                row.setAttribute("class","gestione-macro-attivita-durata-row");

                var i=document.createElement("i");
                i.setAttribute("class","fa-duotone fa-calendar-check");
                row.appendChild(i);

                var span=document.createElement("span");
                span.innerHTML="<b>"+macro_attivita.nome+"</b> inizia";
                row.appendChild(span);

                var input=document.createElement("input");
                input.setAttribute("type","number");
                input.setAttribute("onchange","document.getElementById('gestioneMacroAttivitaDurataSaveButton"+troncone.id_troncone+"').style.backgroundColor='#DA6969'");
                input.setAttribute("id","gestioneMacroAttivitaDurataSettimaneInizia"+troncone.id_troncone);
                input.setAttribute("value",macro_attivita_milestone.settimane_inizio);
                input.setAttribute("min","1");
                row.appendChild(input);

                var span=document.createElement("span");
                span.innerHTML="settimane";
                row.appendChild(span);

                var select=document.createElement("select");
                select.setAttribute("id","gestioneMacroAttivitaDurataPrimaDopoInizio"+troncone.id_troncone);
                select.setAttribute("style","width:95px");
                select.setAttribute("onchange","document.getElementById('gestioneMacroAttivitaDurataSaveButton"+troncone.id_troncone+"').style.backgroundColor='#DA6969'");
                var option=document.createElement("option");
                option.setAttribute("value","");
                option.innerHTML="";
                select.appendChild(option);
                var option=document.createElement("option");
                option.setAttribute("value","dopo");
                if(macro_attivita_milestone.prima_dopo_inizio=="dopo")
                    option.setAttribute("selected","selected");
                option.innerHTML="dopo la";
                select.appendChild(option);
                var option=document.createElement("option");
                option.setAttribute("value","prima");
                if(macro_attivita_milestone.prima_dopo_inizio=="prima")
                    option.setAttribute("selected","selected");
                option.innerHTML="prima della";
                select.appendChild(option);
                row.appendChild(select);

                var span=document.createElement("span");
                span.innerHTML="milestone";
                row.appendChild(span);

                var select=document.createElement("select");
                select.setAttribute("id","gestioneMacroAttivitaDurataMilestoneInizio"+troncone.id_troncone);
                select.setAttribute("style","width:140px");
                select.setAttribute("onchange","document.getElementById('gestioneMacroAttivitaDurataSaveButton"+troncone.id_troncone+"').style.backgroundColor='#DA6969'");
                var option=document.createElement("option");
                option.setAttribute("value","");
                option.innerHTML="";
                select.appendChild(option);
                milestones.forEach(milestone =>
                {
                    var option=document.createElement("option");
                    option.setAttribute("value",milestone.id_milestone);
                    if(parseInt(macro_attivita_milestone.milestone_inizio)==parseInt(milestone.id_milestone))
                        option.setAttribute("selected","selected");
                    option.innerHTML=milestone.nome + " - " + milestone.settimana + "/" + milestone.anno;
                    select.appendChild(option);
                });
                row.appendChild(select);

                tronconeInnerContainer.appendChild(row);

                var row=document.createElement("row");
                row.setAttribute("class","gestione-macro-attivita-durata-row");

                var i=document.createElement("i");
                i.setAttribute("class","fa-duotone fa-calendar-xmark");
                row.appendChild(i);

                var span=document.createElement("span");
                span.innerHTML="<b>"+macro_attivita.nome+"</b> finisce";
                row.appendChild(span);

                var input=document.createElement("input");
                input.setAttribute("type","number");
                input.setAttribute("onchange","document.getElementById('gestioneMacroAttivitaDurataSaveButton"+troncone.id_troncone+"').style.backgroundColor='#DA6969'");
                input.setAttribute("id","gestioneMacroAttivitaDurataSettimaneFine"+troncone.id_troncone);
                input.setAttribute("value",macro_attivita_milestone.settimane_fine);
                input.setAttribute("min","1");
                row.appendChild(input);

                var span=document.createElement("span");
                span.innerHTML="settimane";
                row.appendChild(span);

                var select=document.createElement("select");
                select.setAttribute("id","gestioneMacroAttivitaDurataPrimaDopoFine"+troncone.id_troncone);
                select.setAttribute("style","width:95px");
                select.setAttribute("onchange","document.getElementById('gestioneMacroAttivitaDurataSaveButton"+troncone.id_troncone+"').style.backgroundColor='#DA6969'");
                var option=document.createElement("option");
                option.setAttribute("value","");
                option.innerHTML="";
                select.appendChild(option);
                var option=document.createElement("option");
                option.setAttribute("value","prima");
                if(macro_attivita_milestone.prima_dopo_fine=="prima")
                    option.setAttribute("selected","selected");
                option.innerHTML="prima della";
                select.appendChild(option);
                var option=document.createElement("option");
                option.setAttribute("value","dopo");
                if(macro_attivita_milestone.prima_dopo_fine=="dopo")
                    option.setAttribute("selected","dopo");
                option.innerHTML="dopo la";
                select.appendChild(option);
                row.appendChild(select);

                var span=document.createElement("span");
                span.innerHTML="milestone";
                row.appendChild(span);

                var select=document.createElement("select");
                select.setAttribute("id","gestioneMacroAttivitaDurataMilestoneFine"+troncone.id_troncone);
                select.setAttribute("style","width:140px");
                select.setAttribute("onchange","document.getElementById('gestioneMacroAttivitaDurataSaveButton"+troncone.id_troncone+"').style.backgroundColor='#DA6969'");
                var option=document.createElement("option");
                option.setAttribute("value","");
                option.innerHTML="";
                select.appendChild(option);
                milestones.forEach(milestone =>
                {
                    var option=document.createElement("option");
                    option.setAttribute("value",milestone.id_milestone);
                    if(parseInt(macro_attivita_milestone.milestone_fine)==parseInt(milestone.id_milestone))
                        option.setAttribute("selected","selected");
                    option.innerHTML=milestone.nome + " - " + milestone.settimana + "/" + milestone.anno;
                    select.appendChild(option);
                });
                row.appendChild(select);

                tronconeInnerContainer.appendChild(row);

                //----------------------------------------------------------------------------------------------------------------------------

                var row=document.createElement("row");
                row.setAttribute("class","gestione-macro-attivita-composizione-row");

                var macro_attivita_tronconi=await getMacroAttivitaTronconi(troncone.id_troncone,gestione_macro_attivita_id_macro_attivita);

                var consistenza_troncone=await getConsistenzaTroncone(troncone.id_troncone);
    
                var columns=consistenza_troncone.voci_1.length+1;
                var gridTemplateColumns="";
                for (let index = 0; index < columns; index++)
                {
                    gridTemplateColumns+="auto ";
                }
                gridTemplateColumns = gridTemplateColumns.substring(0, gridTemplateColumns.length - 1);
    
                var composizioneContainer=document.createElement("div");
                composizioneContainer.setAttribute("class","gestione-macro-attivita-composizione-inner-container");
                composizioneContainer.setAttribute("style","grid-template-columns: "+gridTemplateColumns+";");
                
                var cell=document.createElement("div");
                cell.setAttribute("class","gestione-macro-attivita-composizione-cell-voci");
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
                composizioneContainer.appendChild(cell);
    
                consistenza_troncone.voci_1.forEach(voce_1 =>
                {
                    var cell=document.createElement("div");
                    cell.setAttribute("class","gestione-macro-attivita-composizione-cell-voce");
                    cell.setAttribute("style","width:"+consistenzaTronconiCellWidth+"px;box-sizing:border-box");
                    cell.setAttribute("title",voce_1.voce_consistenza_troncone_1);
    
                    var row=document.createElement("div");
                    row.setAttribute("style","display:flex;flex-direction:row;align-items:center;justify-content:flex-start;width:100%;max-width:100%;min-width:100%;overflow:hidden");
                    var span=document.createElement("span");
                    span.setAttribute("style","text-shadow: 2px 4px 3px rgba(0,0,0,0.3);");
                    span.innerHTML=voce_1.voce_consistenza_troncone_1;
                    row.appendChild(span);
                    var i=document.createElement("i");
                    i.setAttribute("class","fa-regular fa-sigma");
                    i.setAttribute("style","margin-left:auto;margin-right:5px;font-size:12px;color:black");
                    row.appendChild(i);
                    var span=document.createElement("span");
                    span.setAttribute("style","color:black");
                    span.innerHTML=voce_1.quantita;
                    row.appendChild(span);
                    cell.appendChild(row);
    
                    composizioneContainer.appendChild(cell);
                });
    
                consistenza_troncone.voci_2.forEach(voce_2 =>
                {
                    var cell=document.createElement("div");
                    cell.setAttribute("class","gestione-macro-attivita-composizione-cell-voce");
                    cell.setAttribute("style","width:"+consistenzaTronconiCellWidth+"px;box-sizing:border-box");
                    cell.setAttribute("title",voce_2.voce_consistenza_troncone_2);
    
                    var row=document.createElement("div");
                    row.setAttribute("style","display:flex;flex-direction:row;align-items:center;justify-content:flex-start;width:100%;max-width:100%;min-width:100%;overflow:hidden");
                    var span=document.createElement("span");
                    span.setAttribute("style","text-shadow: 2px 4px 3px rgba(0,0,0,0.3);");
                    span.innerHTML=voce_2.voce_consistenza_troncone_2;
                    row.appendChild(span);
                    var i=document.createElement("i");
                    i.setAttribute("class","fa-regular fa-sigma");
                    i.setAttribute("style","margin-left:auto;margin-right:5px;font-size:12px;color:black");
                    row.appendChild(i);
                    var span=document.createElement("span");
                    span.setAttribute("style","color:black");
                    span.innerHTML=voce_2.quantita;
                    row.appendChild(span);
                    cell.appendChild(row);
    
                    composizioneContainer.appendChild(cell);
    
                    consistenza_troncone.voci_1.forEach(voce_1 =>
                    {
                        consistenza_troncone.tabled.forEach(consistenza_row =>
                        {
                            if(consistenza_row.id_voce_consistenza_troncone_1==voce_1.id_voce_consistenza_troncone_1 && consistenza_row.id_voce_consistenza_troncone_2==voce_2.id_voce_consistenza_troncone_2)
                            {
                                var cell=document.createElement("div");
                                cell.setAttribute("class","gestione-macro-attivita-composizione-cell-quantita");
                                cell.setAttribute("style","width:"+consistenzaTronconiCellWidth+"px");
                                var button=document.createElement("button");
                                button.setAttribute("class","gestione-macro-attivita-composizione-cell-quantita-button"+troncone.id_troncone);
                                button.setAttribute("id_consistenza_troncone",consistenza_row.id_consistenza_troncone);
                                var active=false;
                                macro_attivita_tronconi.forEach(macro_attivita_troncone =>
                                {
                                    if(macro_attivita_troncone.consistenza_troncone==consistenza_row.id_consistenza_troncone)
                                        active=true;
                                });
                                if(active)
                                {
                                    button.setAttribute("active","true");
                                    button.setAttribute("style","background-color:#70B085");
                                }
                                else
                                    button.setAttribute("active","false");
                                button.setAttribute("onclick","toggleVoceConsistenzaTronconeMacroAttivita(this,"+troncone.id_troncone+")");
                                button.innerHTML=consistenza_row.quantita;
                                cell.appendChild(button);
                                composizioneContainer.appendChild(cell);
                            }
                        });
                    });
                });
    
                row.appendChild(composizioneContainer);

                tronconeInnerContainer.appendChild(row);

                //----------------------------------------------------------------------------------------------------------------------------

                var row=document.createElement("row");
                row.setAttribute("class","gestione-macro-attivita-andamento-row");

                anagrafica_andamenti.forEach(andamento =>
                {
                    var chartContainer=document.createElement("div");
                    chartContainer.setAttribute("class","gestione-macro-attivita-andamento-chart-container gestione-macro-attivita-andamento-chart-container"+troncone.id_troncone);
                    chartContainer.setAttribute("onclick","toggleAndamentoConsistenzaTronconeMacroAttivita(this,"+troncone.id_troncone+","+andamento.id_andamento+")");
                    chartContainer.setAttribute("id","gestioneMacroAttivitaAndamentoChartContainer"+troncone.id_troncone+"_"+andamento.id_andamento);
                    chartContainer.setAttribute("id_andamento",andamento.id_andamento);
                    row.appendChild(chartContainer);
                });

                tronconeInnerContainer.appendChild(row);
                
                //----------------------------------------------------------------------------------------------------------------------------

                container.appendChild(tronconeOuterContainer);
            }
        }

        var rowItems=4;
        for (let index = 0; index < tronconi.length; index++)
        {
            const troncone = tronconi[index];
            
            var andamento_macro_attivita=await getAndamentoMacroAttivitaTroncone(troncone.id_troncone,gestione_macro_attivita_id_macro_attivita);
            
            var i=1;
            anagrafica_andamenti.forEach(andamento =>
            {
                if(andamento.id_andamento==andamento_macro_attivita.id_andamento)
                {
                    document.getElementById("gestioneMacroAttivitaAndamentoChartContainer"+troncone.id_troncone+"_"+andamento.id_andamento).style.backgroundColor="#70B085";
                    document.getElementById("gestioneMacroAttivitaAndamentoChartContainer"+troncone.id_troncone+"_"+andamento.id_andamento).setAttribute("active","true");
                }
                else
                {
                    document.getElementById("gestioneMacroAttivitaAndamentoChartContainer"+troncone.id_troncone+"_"+andamento.id_andamento).style.backgroundColor="white";
                    document.getElementById("gestioneMacroAttivitaAndamentoChartContainer"+troncone.id_troncone+"_"+andamento.id_andamento).setAttribute("active","false");
                }

                if(i==rowItems)
                {
                    document.getElementById("gestioneMacroAttivitaAndamentoChartContainer"+troncone.id_troncone+"_"+andamento.id_andamento).style.width="calc(100% / 4)";
                    document.getElementById("gestioneMacroAttivitaAndamentoChartContainer"+troncone.id_troncone+"_"+andamento.id_andamento).style.marginRight="0px";
                }
                else
                {
                    document.getElementById("gestioneMacroAttivitaAndamentoChartContainer"+troncone.id_troncone+"_"+andamento.id_andamento).style.width="calc(calc(100% / 4) - 10px)";
                    document.getElementById("gestioneMacroAttivitaAndamentoChartContainer"+troncone.id_troncone+"_"+andamento.id_andamento).style.marginRight="10px";
                }

                var chart = new CanvasJS.Chart("gestioneMacroAttivitaAndamentoChartContainer"+troncone.id_troncone+"_"+andamento.id_andamento,
                {
                    animationEnabled: true,
                    interactivityEnabled: false,
                    backgroundColor:"transparent",
                    title:
                    {
                        text: "Andamento "+andamento.nome,
                        fontFamily: "'Montserrat',sans-serif",
                        fontSize: 12,
                        fontWeight: "bold",
                        fontColor: "black",
                        margin: 0,
                        padding: 5

                    },
                    axisY:
                    {
                        valueFormatString: " ",
                        tickLength: 0,
                        gridThickness: 0,
                        margin: 0,
                        padding: 0,
                        lineThickness: 1,
                        lineColor:"transparent"
                    },
                    axisX:
                    {
                        valueFormatString: " ",
                        tickLength: 0,
                        gridThickness: 0,
                        margin: 0,
                        padding: 0,
                        lineThickness: 1,
                        lineColor:"transparent"
                    },
                    data: 
                    [
                        {
                            type: "splineArea",
                            color:"#4C91CB",
                            dataPoints:andamento.dataPoints
                        }
                    ]
                });
                chart.render();

                gestioneMacroAttivitaChartsAndamento.push(chart);

                i++;
            });
        }
    }
    else
    {
        if(gestione_macro_attivita_id_macro_attivita==null)
            alertMessage="Seleziona una macro attività";
        if(id_commessa=="seleziona")
            alertMessage="Seleziona una commessa";   
    }

    if(alert)
    {
        var div=document.createElement("div");
        div.setAttribute("style","height:100%;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center");
        var i=document.createElement("i");
        i.setAttribute("style","font-size:45px;margin-bottom:10px");
        i.setAttribute("class","fa-duotone fa-arrow-pointer");
        div.appendChild(i);
        var span=document.createElement("span");
        span.setAttribute("style","font-family: 'Montserrat',sans-serif;color:black;font-weight: bold;font-size:14px;");
        span.innerHTML=alertMessage;
        div.appendChild(span);
        container.appendChild(div);
    }
}
function getAndamentoMacroAttivitaTroncone(id_troncone,id_macro_attivita)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getAndamentoMacroAttivitaTronconePianificazioneCommesse.php",{id_troncone,id_macro_attivita},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve(null);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve(null);
                    }
                }
            }
        });
    });
}
function getAnagraficaAndamenti()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getAnagraficaAndamentiPianificazioneCommesse.php",
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
function getTotaliTronconeGestioneMacroAttivita(id_troncone,id_macro_attivita)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getTotaliTronconeGestioneMacroAttivitaPianificazioneCommesse.php",{id_troncone,id_macro_attivita},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve(null);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve(null);
                    }
                }
            }
        });
    });
}
function getMacroAttivitaTronconi(id_troncone,id_macro_attivita)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getMacroAttivitaTronconiPianificazioneCommesse.php",{id_troncone,id_macro_attivita},
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
function toggleAndamentoConsistenzaTronconeMacroAttivita(button,id_troncone,id_andamento)
{
    document.getElementById("gestioneMacroAttivitaDurataSaveButton"+id_troncone).style.backgroundColor='#DA6969';
    
    var buttons=document.getElementsByClassName("gestione-macro-attivita-andamento-chart-container"+id_troncone);
    buttons.forEach(btn =>
    {
        btn.style.backgroundColor="";
        btn.setAttribute("active","false");
    });
    
    button.style.backgroundColor="#70B085";
    button.setAttribute("active","true");
}
function toggleVoceConsistenzaTronconeMacroAttivita(button,id_troncone)
{
    document.getElementById("gestioneMacroAttivitaDurataSaveButton"+id_troncone).style.backgroundColor='#DA6969';

    if(button.getAttribute("active")=="true")
    {
        button.style.backgroundColor="";
        button.style.color="";
        button.setAttribute("active","false");
    }
    else
    {
        button.style.backgroundColor="#70B085";
        button.style.color="white";
        button.setAttribute("active","true");
    }
}
function getMacroAttivitaMilestone(id_troncone,id_macro_attivita)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getMacroAttivitaMilestonePianificazioneCommesse.php",{id_troncone,id_macro_attivita},
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
function salvaModificheMacroAttivita(id_troncone,id_macro_attivita,id_macro_attivita_milestone)
{
    var error=false;

    document.getElementById("gestioneMacroAttivitaDurataMilestoneInizio"+id_troncone).style.border="";
    document.getElementById("gestioneMacroAttivitaDurataPrimaDopoInizio"+id_troncone).style.border="";
    document.getElementById("gestioneMacroAttivitaDurataSettimaneInizia"+id_troncone).style.border="";
    document.getElementById("gestioneMacroAttivitaDurataMilestoneFine"+id_troncone).style.border="";
    document.getElementById("gestioneMacroAttivitaDurataPrimaDopoFine"+id_troncone).style.border="";
    document.getElementById("gestioneMacroAttivitaDurataSettimaneFine"+id_troncone).style.border="";

    document.getElementById("gestioneMacroAttivitaTronconeTitleContainerSpanError"+id_troncone).innerHTML="";

    var milestone_inizio=document.getElementById("gestioneMacroAttivitaDurataMilestoneInizio"+id_troncone).value;
    if(milestone_inizio=="" || milestone_inizio==null)
    {
        document.getElementById("gestioneMacroAttivitaDurataMilestoneInizio"+id_troncone).style.border="1px solid #DA6969";
        error=true;
    }
    var prima_dopo_inizio=document.getElementById("gestioneMacroAttivitaDurataPrimaDopoInizio"+id_troncone).value;
    if(prima_dopo_inizio=="" || prima_dopo_inizio==null)
    {
        document.getElementById("gestioneMacroAttivitaDurataPrimaDopoInizio"+id_troncone).style.border="1px solid #DA6969";
        error=true;
    }
    var settimane_inizio=document.getElementById("gestioneMacroAttivitaDurataSettimaneInizia"+id_troncone).value;
    if(settimane_inizio=="" || settimane_inizio==null)
    {
        document.getElementById("gestioneMacroAttivitaDurataSettimaneInizia"+id_troncone).style.border="1px solid #DA6969";
        error=true;
    }
    var milestone_fine=document.getElementById("gestioneMacroAttivitaDurataMilestoneFine"+id_troncone).value;
    if(milestone_fine=="" || milestone_fine==null)
    {
        document.getElementById("gestioneMacroAttivitaDurataMilestoneFine"+id_troncone).style.border="1px solid #DA6969";
        error=true;
    }
    var prima_dopo_fine=document.getElementById("gestioneMacroAttivitaDurataPrimaDopoFine"+id_troncone).value;
    if(prima_dopo_fine=="" || prima_dopo_fine==null)
    {
        document.getElementById("gestioneMacroAttivitaDurataPrimaDopoFine"+id_troncone).style.border="1px solid #DA6969";
        error=true;
    }
    var settimane_fine=document.getElementById("gestioneMacroAttivitaDurataSettimaneFine"+id_troncone).value;
    if(settimane_fine=="" || settimane_fine==null)
    {
        document.getElementById("gestioneMacroAttivitaDurataSettimaneFine"+id_troncone).style.border="1px solid #DA6969";
        error=true;
    }

    if(error)
    {
        document.getElementById("gestioneMacroAttivitaDurataSaveButton"+id_troncone).style.backgroundColor="#DA6969";
        document.getElementById("gestioneMacroAttivitaTronconeTitleContainerSpanError"+id_troncone).innerHTML="Compila tutti i campi";
    }
    else
    {
        var consistenza_troncone_array=[];
        var buttons=document.getElementsByClassName("gestione-macro-attivita-composizione-cell-quantita-button"+id_troncone);
        buttons.forEach(button =>
        {
            if(button.getAttribute("active")=="true")
                consistenza_troncone_array.push(button.getAttribute("id_consistenza_troncone"));
        });
        var JSONconsistenza_troncone_array=JSON.stringify(consistenza_troncone_array);

        var andamento=null;
        var buttons=document.getElementsByClassName("gestione-macro-attivita-andamento-chart-container"+id_troncone);
        buttons.forEach(button =>
        {
            if(button.getAttribute("active")=="true")
                andamento=button.getAttribute("id_andamento");
        });

        $.post("salvaModificheMacroAttivitaPianificazioneCommesse.php",{milestone_inizio,prima_dopo_inizio,settimane_inizio,milestone_fine,prima_dopo_fine,settimane_fine,id_macro_attivita,id_macro_attivita_milestone,JSONconsistenza_troncone_array,id_troncone,andamento},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    document.getElementById("gestioneMacroAttivitaDurataSaveButton"+id_troncone).style.backgroundColor="#DA6969";
                }
                else
                {
                    document.getElementById("gestioneMacroAttivitaDurataSaveButton"+id_troncone).style.backgroundColor="";

                    setTotaliTronconeGestioneMacroAttivita(id_troncone,id_macro_attivita);
                }
            }
        });
    }
}
async function setTotaliTronconeGestioneMacroAttivita(id_troncone,id_macro_attivita)
{
    document.getElementById("gestioneMacroAttivitaTronconeTitleContainerSpanDurata"+id_troncone).innerHTML="<i style='margin-right:5px;color:#4C91CB' class='fa-duotone fa-spinner-third fa-spin'></i> settimane";
    document.getElementById("gestioneMacroAttivitaTronconeTitleContainerSpanCabine"+id_troncone).innerHTML="<i style='margin-right:5px;color:#4C91CB' class='fa-duotone fa-spinner-third fa-spin'></i> cabine";

    var totali=await getTotaliTronconeGestioneMacroAttivita(id_troncone,id_macro_attivita);
    if(totali.durata>0)
        document.getElementById("gestioneMacroAttivitaTronconeTitleContainerSpanDurata"+id_troncone).innerHTML="<b style='color:#4C91CB'>"+totali.durata+"</b> settimane";
    else
        document.getElementById("gestioneMacroAttivitaTronconeTitleContainerSpanDurata"+id_troncone).innerHTML="<b style='color:#DA6969'>"+totali.durata+"</b> settimane";

    document.getElementById("gestioneMacroAttivitaTronconeTitleContainerSpanCabine"+id_troncone).innerHTML="<b style='color:#4C91CB'>"+totali.cabine+"</b> cabine";
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
function resetContainerStyle()
{
    document.getElementById("pianificazioneCommesseContainer").remove();
    var container=document.createElement("div");
    container.setAttribute("id","pianificazioneCommesseContainer");
    document.body.insertBefore(container, document.getElementById("footer"));
}
function clearViewIntervals()
{
    clearInterval(intervalHighlightMacroAttivitaSelezionata);
}
function getTronconi(id_commessa)
{
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
function aggiungiTroncone(callback,id_commessa)
{
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
function getMilestones(id_troncone)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getMilestones.php",{id_troncone},
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