var codici;
var codiciInput=[];
var totaliCodici;
var codiciNonTrovati;
var steps=100;
var oldSteps;
var stepsSize=100;
var tabella;
var colonna_codice;
var codiciHeaders=[];
var consistenzaCommessa;
var hot;
var view;

window.addEventListener("load", async function(event)
{
    $(".input-radio-tabella").prop("disabled",true);

    var radioCalcoloPesi=await getCookie("radioCalcoloPesi");
    if(radioCalcoloPesi!="" && radioCalcoloPesi!=null)
    {
        var radios=document.getElementsByClassName("input-radio-tabella");
        for (let index = 0; index < radios.length; index++) 
        {
            const radio = radios[index];
            if(radio.getAttribute("tabella")==radioCalcoloPesi)
                radio.checked=true;
        }
    }
    if(radioCalcoloPesi!="automatico")
        document.getElementById("buttonToggleRadioTabella").click();

    var outputCalcoloPesi=await getCookie("outputCalcoloPesi");
    if(outputCalcoloPesi!="" && outputCalcoloPesi!=null)
    {
        var options=document.getElementById("selectOutputCalcoloPesi").getElementsByTagName("option");
        for (let index = 0; index < options.length; index++) 
        {
            const option = options[index];
            if(option.value==outputCalcoloPesi)
                option.setAttribute("selected","selected");
        }
    }
    if(document.getElementById("selectOutputCalcoloPesi").value=="pivot")
        document.getElementById("selectColonnaPivotCalcoloPesiContainer").style.display="";
    else
        document.getElementById("selectColonnaPivotCalcoloPesiContainer").style.display="none";

    var dataAggiornamentoPesoQntCabine=await getDataSPPesoQntCabine();
    document.getElementById("aggiornamentoPesoQntCabine").innerHTML="Peso cabine aggiornato al <b>"+dataAggiornamentoPesoQntCabine+"</b>";
    
    /*if(document.getElementById("selectOutputCalcoloPesi").value=="esponente_di_carico")
    {
        document.getElementById("buttonToggleRadioTabella").style.display="none";
        $(".input-radio-tabella-hidden").show();

        $(".input-radio-tabella").first().hide();
        $(".input-radio-tabella").first().next().hide();

        var radios=document.getElementsByClassName("input-radio-tabella-hidden");
        for (let index = 0; index < radios.length; index++)
        {
            const element = radios[index];
            if(element.tagName.toLowerCase()=="input")
            {
                if(element.getAttribute("tabella")=="cabine")
                {
                    element.style.display="block";
                    element.checked=true;
                }
                else
                    element.style.display="none";
            }
            else
            {
                if(element.innerHTML=="Cabine")
                    element.style.display="block";
                else
                    element.style.display="none";
            }            
        }
    }
    else
    {
        document.getElementById("buttonToggleRadioTabella").style.display="";
        $(".input-radio-tabella-hidden").hide();
        $(".input-radio-tabella").first().show();
        $(".input-radio-tabella").first().next().show();
        $(".input-radio-tabella").first().prop("checked",true);
    }*/

    var colonnaPivotCalcoloPesi=await getCookie("colonnaPivotCalcoloPesi");
    if(colonnaPivotCalcoloPesi!="" && colonnaPivotCalcoloPesi!=null)
    {
        var options=document.getElementById("selectColonnaPivotCalcoloPesi").getElementsByTagName("option");
        for (let index = 0; index < options.length; index++) 
        {
            const option = options[index];
            if(option.value==colonnaPivotCalcoloPesi)
                option.setAttribute("selected","selected");
        }
    }

    $(".input-radio-tabella").prop("disabled",false);
});
function checkCodici()
{
    if(document.getElementById("selectOutputCalcoloPesi").value=="pivot")
        document.getElementById("selectColonnaPivotCalcoloPesiContainer").style.display="";
    else
        document.getElementById("selectColonnaPivotCalcoloPesiContainer").style.display="none";
    
    /*if(document.getElementById("selectOutputCalcoloPesi").value=="esponente_di_carico")
    {
        document.getElementById("buttonToggleRadioTabella").style.display="none";
        $(".input-radio-tabella-hidden").show();

        $(".input-radio-tabella").first().hide();
        $(".input-radio-tabella").first().next().hide();

        var radios=document.getElementsByClassName("input-radio-tabella-hidden");
        for (let index = 0; index < radios.length; index++)
        {
            const element = radios[index];
            if(element.tagName.toLowerCase()=="input")
            {
                if(element.getAttribute("tabella")=="cabine")
                {
                    element.style.display="block";
                    element.checked=true;
                }
                else
                    element.style.display="none";
            }
            else
            {
                if(element.innerHTML=="Cabine")
                    element.style.display="block";
                else
                    element.style.display="none";
            }            
        }
    }
    else
    {
        document.getElementById("buttonToggleRadioTabella").style.display="";
        $(".input-radio-tabella-hidden").hide();
        $(".input-radio-tabella").first().show();
        $(".input-radio-tabella").first().next().show();
        $(".input-radio-tabella").first().prop("checked",true);
    }*/

    codiciInput=[];
    var textarea=document.getElementById("textareaElencoCodici");
    var value=textarea.value;
    if(value!="")
    {
		//value=value.replace(" ","");
		value=value.replace(/ /g,"");
        codiciD=value.split("\n");
        codiciInput = cleanArray(codiciD);
        var outerContainer=document.createElement("div");
        outerContainer.setAttribute("class","conferma-codici-outer-container");

        var row=document.createElement("div");
        row.setAttribute("style","width:100%;display:flex;flex-direction:row;align-items:center;justify-content:center;align-items:center;margin-top:5px");
        var checkbox=document.createElement("input");
        checkbox.setAttribute("type","checkbox");
        checkbox.setAttribute("checked","checked");
        checkbox.setAttribute("id","checkboxValidaPesi");
        row.appendChild(checkbox);
        var span=document.createElement("span");
        span.setAttribute("style","font-family:'Montserrat',sans-serif;font-size:14px;margin-left:5px;font-weight:bold;color:black");
        span.innerHTML="Controlla validazione pesi";
        row.appendChild(span);
        outerContainer.appendChild(row);

        var innerContainer=document.createElement("div");
        innerContainer.setAttribute("class","conferma-codici-inner-container");
        var table=document.createElement("table");
        table.setAttribute("class","conferma-codici-table");
        codiciInput.forEach(function(codice)
        {
            var tr=document.createElement("tr");
            var td=document.createElement("td");
            td.style.textAlign="left";
            td.innerHTML=codice;
            tr.appendChild(td);
            var td=document.createElement("td");
            td.innerHTML='<i title="Rimuovi" class="fal fa-times" onclick="rimuoviCodicePopup(this.parentElement)"></i>';
            tr.appendChild(td);
            table.appendChild(tr);
        });
        innerContainer.appendChild(table);
        outerContainer.appendChild(innerContainer);
        Swal.fire
        ({
            title: "Riepilogo codici inseriti ("+codiciInput.length+")",
            html: outerContainer.outerHTML,
            confirmButtonText:"Conferma",
            showCloseButton:true,
            allowEscapeKey:false,
            allowOutsideClick:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
        }).then((result) => 
        {
            if (result.value)
            {
                getMascheraPesi();
            }
            else
                swal.close();
        });
    }
}
async function getMascheraPesi()
{
    view="tabella_pesi";
    var radios=document.getElementsByClassName("input-radio-tabella");
    for (let index = 0; index < radios.length; index++)
    {
        const radio = radios[index];
        if(radio.checked)
        {
            tabella=radio.getAttribute("tabella");
            colonna_codice=radio.getAttribute("colonna_codice");
        }
    }

    setCookie("radioCalcoloPesi",tabella);
    
    var output=document.getElementById("selectOutputCalcoloPesi").value;
    setCookie("outputCalcoloPesi",output);

    var colonnaPivot=document.getElementById("selectColonnaPivotCalcoloPesi").value;
    setCookie("colonnaPivotCalcoloPesi",colonnaPivot);

    document.getElementById("btnCheckCodici").disabled=true;

    var validaPesi=document.getElementById("checkboxValidaPesi").checked;

    var container=document.getElementById("calcoloPesiContainer");
    container.innerHTML="";

    Swal.fire
    ({
        title: "Caricamento in corso... ",
        background:"transparent",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-4x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });

    var arrayResponse=await getPesi(tabella,colonna_codice,output,colonnaPivot);
    console.log(arrayResponse);

    Swal.close();

    document.getElementById("btnCheckCodici").disabled=false;

    codiciHeaders=arrayResponse.codiciHeaders;
    tabella=arrayResponse.tabella;
    colonna_codice=arrayResponse.colonna_codice;
    codici=arrayResponse.codici;
    totaliCodici=arrayResponse.totaliCodici;

    var row=document.createElement("div");
    row.setAttribute("class","calcolo-superficie-row");
    row.setAttribute("style","height:25px;margin-left:25px;margin-right:25px;width: calc(100% - 50px);");

    var tableTitleCodici=document.createElement("div");
    tableTitleCodici.setAttribute("class","calcolo-superficie-table-title");

    var div=document.createElement("div");
    var i=document.createElement("i");
    i.setAttribute("class","fal fa-table");
    i.setAttribute("style","color:white;margin-right:5px");
    div.appendChild(i);
    var span=document.createElement("span");
    span.innerHTML=codici.length+" righe ("+tabella+")";
    div.appendChild(span);
    tableTitleCodici.appendChild(div);

    var div=document.createElement("div");
    div.setAttribute("style","margin-left:auto");

    var span=document.createElement("span");
    span.setAttribute("style","margin-right:5px");
    span.innerHTML="Peso totale: "+totaliCodici.peso.toFixed(2) +" Kg";
    div.appendChild(span);

    tableTitleCodici.appendChild(div);

    row.appendChild(tableTitleCodici);

    container.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","calcolo-superficie-row");
    row.setAttribute("style","height:calc(100% - 25px);min-height:calc(100% - 25px);max-height:calc(100% - 25px)");

    var tableCodiciContainer=document.createElement("div");
    tableCodiciContainer.setAttribute("id","tableCodiciContainer");
    row.appendChild(tableCodiciContainer);

    container.appendChild(row);

    getTableCodici();

    checkCodiciNonTrovati();

    if(validaPesi)
        checkValidazionePesi();
}
function checkValidazionePesi()
{
    Swal.fire
    ({
        title: "Controllo validazione pesi in corso... ",
        background:"transparent",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-4x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });

    var JSONcodiciInput=JSON.stringify(codiciInput);
    $.post("checkValidazionePesiCalcoloPesi.php",
    {
        JSONcodiciInput
    },
    function(response, status)
    {
        //console.log(response);
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
            {
                var data;
                try {
                    data=JSON.parse(response);
                } catch (error) {
                    data="error";
                }

                if(data=="error")
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                }
                else
                {
                    if(data.length==0)
                    {
                        let timerInterval;
                        Swal.fire
                        ({
                            icon:"success",
                            title: "Il peso di tutte le materie prime usate è validato",
                            background:"#404040",
                            showCloseButton:false,
                            showConfirmButton:false,
                            allowOutsideClick:false,
                            timer: 8000,
                            timerProgressBar: true,
                            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
                            onClose: () => {clearInterval(timerInterval)}
                        })
                    }
                    else
                    {
                        var outerContainer=document.createElement("div");
                        outerContainer.setAttribute("class","validazione-pesi-outer-container");

                        var titleBar=document.createElement("div");
                        titleBar.setAttribute("class","validazione-pesi-title-bar");

                        var span=document.createElement("span");
                        span.innerHTML=data.length+" materie prime usate con peso non validato";
                        titleBar.appendChild(span);

                        var i=document.createElement("i");
                        i.setAttribute("class","fad fa-file-excel");
                        i.setAttribute("onclick","esportaExcelValidazionePesi()");
                        i.setAttribute("style","margin-left:auto;margin-right:10px;font-size:18px");
                        titleBar.appendChild(i);

                        var i=document.createElement("i");
                        i.setAttribute("class","fal fa-times");
                        i.setAttribute("onclick","Swal.close()");
                        i.setAttribute("style","font-size:22px");
                        titleBar.appendChild(i);

                        outerContainer.appendChild(titleBar);

                        var tableContainer=document.createElement("div");
                        tableContainer.setAttribute("class","validazione-pesi-table-container");

                        var codiciHeaders=
                        [
                            {
                                value:"codice_cabina",
                                label:"Codice cabina"
                            },
                            {
                                value:"n_cabine",
                                label:"N. cabine"
                            },
                            {
                                value:"codice_materia_prima",
                                label:"Codice materia prima"
                            },
                            {
                                value:"descrizione",
                                label:"Descrizione"
                            },
                            {
                                value:"raggruppamento",
                                label:"Raggruppamento"
                            },
                            {
                                value:"peso",
                                label:"Peso (Kg)"
                            }
                        ];
                        
                        var validazionePesiTable=document.createElement("table");
                        validazionePesiTable.setAttribute("id","validazionePesiTable");

                        var thead=document.createElement("thead");
                        var tr=document.createElement("tr");
                        codiciHeaders.forEach(function (header)
                        {
                            var th=document.createElement("th");
                            th.setAttribute("class","validazionePesiTableCell"+header.value);
                            th.innerHTML=header.label;
                            tr.appendChild(th);
                        });
                        thead.appendChild(tr);
                        validazionePesiTable.appendChild(thead);

                        var tbody=document.createElement("tbody");
                        var i=0;
                        data.forEach(function (row)
                        {
                            var tr=document.createElement("tr");
                            codiciHeaders.forEach(function (header)
                            {
                                var td=document.createElement("td");
                                td.setAttribute("class","validazionePesiTableCell"+header.value);
                                td.innerHTML=row[header.value];
                                tr.appendChild(td);
                            });
                            tbody.appendChild(tr);
                            i++;
                        });
                        validazionePesiTable.appendChild(tbody);

                        tableContainer.appendChild(validazionePesiTable);

                        outerContainer.appendChild(tableContainer);

                        Swal.fire
                        ({
                            html: outerContainer.outerHTML,
                            showConfirmButton:false,
                            width:"70%",
                            showCloseButton:false,
                            allowEscapeKey:true,
                            allowOutsideClick:true,
                            onOpen : function(){document.getElementsByClassName("swal2-title")[0].remove();document.getElementsByClassName("swal2-popup")[0].style.padding="0px";document.getElementsByClassName("swal2-popup")[0].style.borderRadius="4px";fixTableValidazionePesi();}
                        });
                    }
                }
            }
        }
        else
        {
            Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
            console.log(response);
        }
    });
}
function fixTableValidazionePesi()
{
    try {
        var tableWidth=document.getElementById("validazionePesiTable").offsetWidth-8;
        //var tableColWidth=(10*tableWidth)/100;
		var tableColWidth=tableWidth/document.getElementById("validazionePesiTable").getElementsByTagName("thead")[0].getElementsByTagName("tr")[0].childElementCount;
        
        $("#validazionePesiTable th").css({"width":tableColWidth+"px"});
        $("#validazionePesiTable td").css({"width":tableColWidth+"px"});
    } catch (error) {}
}
function checkCodiciNonTrovati()
{
    $("#btnCodiciNonTrovati").hide("fast","swing");

    var codiciTrovati=[];
    codici.forEach(function(codice)
    {
        codiciTrovati.push(codice[colonna_codice]);
    });

    codiciNonTrovati=[];
    codiciInput.forEach(function(codice)
    {
        if(!codiciTrovati.includes(codice))
		{
            codiciNonTrovati.push(codice);
		}
    });
    if(codiciNonTrovati.length>0)
    {
        $("#btnCodiciNonTrovati").show(300,"swing");
    }
}
function getPopupCodiciNonTrovati()
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","conferma-codici-inner-container");
    var table=document.createElement("table");
    table.setAttribute("class","conferma-codici-table");
    codiciNonTrovati.forEach(function(codice)
    {
        var tr=document.createElement("tr");
        var td=document.createElement("td");
        td.setAttribute("style","text-align:center;width:100%");
        td.innerHTML=codice;
        tr.appendChild(td);
        table.appendChild(tr);
    });
    outerContainer.appendChild(table);
    Swal.fire
    ({
        title: "Codici non trovati ("+codiciNonTrovati.length+")",
        html: outerContainer.outerHTML,
        showConfirmButton:false,
        showCloseButton:true,
        allowEscapeKey:true,
        allowOutsideClick:true,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });
}
function getTableCodici()
{
    var oldScrollTop=0;
    if(document.getElementById("codiciTable")!=null)
    {
        var tableBody = document.getElementById("codiciTable").getElementsByTagName("tbody")[0];
        oldScrollTop=tableBody.scrollTop;
    }

    document.getElementById("tableCodiciContainer").innerHTML="";

    /*var codiciHeaders=
    [
        {
            value:colonna_codice,
            label:colonna_codice
        },
        {
            value:"peso",
            label:"Peso (Kg)"
        }
    ];*/
    
    var codiciTable=document.createElement("table");
    codiciTable.setAttribute("id","codiciTable");

    var thead=document.createElement("thead");
    var tr=document.createElement("tr");
    codiciHeaders.forEach(function (header)
    {
        var th=document.createElement("th");
        th.setAttribute("class","codiciTableCell"+header.value);
        th.innerHTML=header.label;
        tr.appendChild(th);
    });
    thead.appendChild(tr);
    codiciTable.appendChild(thead);

    var tbody=document.createElement("tbody");
    var i=0;
    codici.forEach(function (pannello)
    {
        if(i<steps)
        {
            var tr=document.createElement("tr");
            codiciHeaders.forEach(function (header)
            {
                var td=document.createElement("td");
                td.setAttribute("class","codiciTableCell"+header.value);
				if(header.value=="n_cabine")
				{
                    td.innerHTML=pannello[header.value];
				}
				else
				{
					try {
						td.innerHTML=pannello[header.value].toFixed(2);
					} catch (error) {
						td.innerHTML=pannello[header.value];
					}
				}
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        }
        i++;
    });
    codiciTable.appendChild(tbody);

    document.getElementById("tableCodiciContainer").appendChild(codiciTable);

    var caricaAltriButton=document.createElement("button");
    caricaAltriButton.setAttribute("class","carica-altri-button");
    caricaAltriButton.setAttribute("onclick","steps+=stepsSize;getTableCodici()");
    var span=document.createElement("span");
    span.innerHTML="Mostra altre righe";
    caricaAltriButton.appendChild(span);
    
    document.getElementById("tableCodiciContainer").appendChild(caricaAltriButton);

    fixTableCodici();
    
    var tableBody = document.getElementById("codiciTable").getElementsByTagName("tbody")[0];
    tableBody.scrollTop = oldScrollTop;
}
function fixTableCodici()
{
    try {
        var tableWidth=document.getElementById("codiciTable").offsetWidth-8;
        //var tableColWidth=(10*tableWidth)/100;
		var tableColWidth=tableWidth/document.getElementById("codiciTable").getElementsByTagName("thead")[0].getElementsByTagName("tr")[0].childElementCount;
        
        $("#codiciTable th").css({"width":tableColWidth+"px"});
        $("#codiciTable td").css({"width":tableColWidth+"px"});
    } catch (error) {}
}
function getPesi(tabella,colonna_codice,output,colonnaPivot)
{
    return new Promise(function (resolve, reject) 
    {
        var JSONcodiciInput=JSON.stringify(codiciInput);

        var tabelle=[];
        var radios=document.getElementsByClassName("input-radio-tabella");
        for (let index = 0; index < radios.length; index++)
        {
            const radio = radios[index];
            if(radio.getAttribute("tabella")!="automatico")
            {
                var tabellaObj=
                {
                    tabella:radio.getAttribute("tabella"),
                    colonna_codice:radio.getAttribute("colonna_codice")
                };

                tabelle.push(tabellaObj);
            }
        }

        var JSONtabelle=JSON.stringify(tabelle);
        $.post("getPesiCalcoloPesi.php",
        {
            tabella,colonna_codice,JSONcodiciInput,JSONtabelle,output,colonnaPivot
        },
        function(response, status)
        {
			//console.log(response);
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
                    if(response.toLowerCase().indexOf("codice_non_trovato")>-1)
                    {
                        Swal.fire({icon:"error",title: "I codici inseriti non appartengono a nessuna tabella",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
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
            }
            else
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
                resolve([]);
            }
        });
    });
}
function cleanArray(actual)
{
    var newArray = new Array();
    for (var i = 0; i < actual.length; i++) {
        if (actual[i]) {
        newArray.push(actual[i]);
        }
    }
    return newArray;
}
function rimuoviCodicePopup(td)
{
    var tr=td.parentElement;
    var codice=tr.firstChild.innerHTML;
    const index = codiciInput.indexOf(codice);
    if (index > -1)
    {
        codiciInput.splice(index, 1);
    }
    tr.remove();
}
function esportaExcel()
{
    if(document.getElementById("codiciTable")!=null)
    {
        if(view=="tabella_pesi")
            var fileNameHint='calcolo_peso_'+tabella;
        else
            var fileNameHint='esponente_di_carico';

        Swal.fire
        ({
            title: "Scegli il nome del file Excel",
            html: '<input tyle="text" id="inputNomeFileEsportaExcel" value="'+fileNameHint+'">',
            confirmButtonText:"Conferma",
            showCloseButton:true,
            allowEscapeKey:false,
            allowOutsideClick:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
        }).then((result) => 
        {
            if (result.value)
            {
                var fileName=document.getElementById("inputNomeFileEsportaExcel").value;
                if(fileName=="" || fileName==" " || fileName==null)
                    fileName=fileNameHint;

                Swal.fire
                ({
                    title: "Caricamento in corso... ",
                    background:"transparent",
                    html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-4x"></i>',
                    showConfirmButton:false,
                    showCloseButton:false,
                    allowEscapeKey:false,
                    allowOutsideClick:false,
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                });

                setTimeout(function()
                {
                    if(view=="tabella_pesi")
                    {
                        oldSteps=steps;
                        steps=codici.length;
                        getTableCodici();
                    }
    
                    var codiciTable=document.getElementById("codiciTable").cloneNode(true)
    
                    //codiciTable.id="codiciTableDownload";
                    var headerRow=codiciTable.getElementsByTagName("thead")[0].getElementsByTagName("tr")[0];
                    var thead=codiciTable.getElementsByTagName("thead")[0];
    
                    if(view=="tabella_pesi")
                    {
                        var rowTitolo=document.createElement("tr");
                        var td=document.createElement("td");
                        td.innerHTML="TOTALI";
                        rowTitolo.appendChild(td);
                        thead.appendChild(rowTitolo);

                        var rowTotali=document.createElement("tr");
                        var td=document.createElement("td");
                        td.innerHTML=totaliCodici.qnt+" codici";
                        rowTotali.appendChild(td);
                        var td=document.createElement("td");
                        td.innerHTML=totaliCodici.peso.toFixed(2)+" Kg";
                        rowTotali.appendChild(td);
                        thead.appendChild(rowTotali);
        
                        var spaceRow=document.createElement("tr");
                        thead.appendChild(spaceRow);
                    }
    
                    var newRow=document.createElement("tr");
                    var ths=headerRow.getElementsByTagName("th");
                    for (let index = 0; index < ths.length; index++)
                    {
                        const th = ths[index];
                        var td=document.createElement("td");
                        td.innerHTML=th.innerHTML;
                        newRow.appendChild(td);
                    }
                    headerRow.remove();
                    thead.appendChild(newRow);
    
                    var codiciTableString="<html>"+codiciTable.outerHTML+"</html>";

                    var blob;
                    var wb = {SheetNames:[], Sheets:{}};
    
                    var ws1 = XLSX.read(codiciTableString, {type:"binary"}).Sheets.Sheet1;
                    if(view=="tabella_pesi")
                    {
                        wb.SheetNames.push("peso_"+tabella); 
                        wb.Sheets["peso_"+tabella] = ws1;
                    }
                    else
                    {
                        wb.SheetNames.push("esponente_di_carico"); 
                        wb.Sheets["esponente_di_carico"] = ws1;
                    }                   
    
                    blob = new Blob([s2ab(XLSX.write(wb, {bookType:'xlsx', type:'binary'}))],
                    {
                        type: "application/octet-stream"
                    });
    
                    saveAs(blob, fileName+".xlsx");
    
                    if(view=="tabella_pesi")
                    {
                        steps=oldSteps;
                        getTableCodici();
                    }
                    //document.getElementById("codiciTableDownload").remove();
    
                    swal.close();
                }, 1500);
            }
            else
                swal.close();
        });
    }
}
function esportaExcelValidazionePesi()
{
    if(document.getElementById("validazionePesiTable")!=null)
    {
        var fileName="validazione_pesi";

        var validazionePesiTable=document.getElementById("validazionePesiTable").cloneNode(true)

        var headerRow=validazionePesiTable.getElementsByTagName("thead")[0].getElementsByTagName("tr")[0];
        var thead=validazionePesiTable.getElementsByTagName("thead")[0];

        var newRow=document.createElement("tr");
        var ths=headerRow.getElementsByTagName("th");
        for (let index = 0; index < ths.length; index++)
        {
            const th = ths[index];
            var td=document.createElement("td");
            td.innerHTML=th.innerHTML;
            newRow.appendChild(td);
        }
        headerRow.remove();
        thead.appendChild(newRow);

        var validazionePesiTableString="<html>"+validazionePesiTable.outerHTML+"</html>";

        var blob;
        var wb = {SheetNames:[], Sheets:{}};

        var ws1 = XLSX.read(validazionePesiTableString, {type:"binary"}).Sheets.Sheet1;
        wb.SheetNames.push("validazione_pesi"); 
        wb.Sheets["validazione_pesi"] = ws1;

        blob = new Blob([s2ab(XLSX.write(wb, {bookType:'xlsx', type:'binary'}))],
        {
            type: "application/octet-stream"
        });

        saveAs(blob, fileName+".xlsx");
    }
}
function s2ab(s)
{
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}
function disableCheckboxMostraCodici(event)
{
    event.stopPropagation();
}
function toggleRadioTabella(button)
{
     if(document.getElementsByClassName("input-radio-tabella-hidden")[1].style.display=="block")
        button.getElementsByTagName("i")[0].className="fal fa-plus-circle";
    else
        button.getElementsByTagName("i")[0].className="fal fa-times";
    $(".input-radio-tabella-hidden").toggle();
}
async function getPopupFiltraConsistenzaCommessa()
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
    outerContainer.setAttribute("class","filtra-consistenza-commessa-outer-container");

    var actionBar=document.createElement("div");
    actionBar.setAttribute("class","filtra-consistenza-commessa-action-bar");

    var selectContainer=document.createElement("div");
    selectContainer.setAttribute("class","rcb-select-container");
    selectContainer.setAttribute("style","margin-left:5px");
    var span=document.createElement("span");
    span.innerHTML="Commessa: ";
    selectContainer.appendChild(span);
    var select=document.createElement("select");
    select.setAttribute("id","selectCommessaPopupFiltraConsistenzaCommessa");
    select.setAttribute("onchange","getTabellaFiltraConsistenzaCommessa()");
    select.setAttribute("style","text-decoration:none");
    var commesse=await getCommesse();
    commesse.forEach(commessa => 
    {
        var option=document.createElement("option")        ;
        option.setAttribute("value",commessa.id_commessa);
        option.innerHTML=commessa.nome;
        select.appendChild(option);
    });
    selectContainer.appendChild(select);
    actionBar.appendChild(selectContainer);

    //<div class="rcb-text-container"><span style="margin-right: 5px;">Righe:</span><span id="rowsNumEditableTable" style="font-weight: normal; color: black;">6</span></div>
    var div=document.createElement("div");
    div.setAttribute("class","rcb-text-container");
    div.setAttribute("style","height:30px;border-radius:2px;background-color: rgba(255, 255, 255, 0.7);display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding-left:5px;padding-right:5px;color:black");
    var span=document.createElement("span");
    span.setAttribute("style","margin-right:5px");
    span.innerHTML="Cabine filtrate:";
    div.appendChild(span);
    var span=document.createElement("span");
    span.setAttribute("id","nCabinePopupFiltraConsistenzaCommessa");
    span.innerHTML="0";
    div.appendChild(span);
    actionBar.appendChild(div);

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("onclick","getCabinePopupFiltraConsistenzaCommessa()");
    button.setAttribute("style","margin-left:auto");
    var span=document.createElement("span");
    span.setAttribute("style","font-weight:bold;margin-right:5px;color:#70B085");
    span.innerHTML="Conferma";
    button.appendChild(span);
    var i=document.createElement("i");
    i.setAttribute("class","fad fa-search");
    i.setAttribute("style","font-weight:bold;color:#70B085");
    button.appendChild(i);
    actionBar.appendChild(button);

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("onclick","Swal.close()");
    button.setAttribute("style","background-color:transparent;border:none");
    var i=document.createElement("i");
    i.setAttribute("class","fal fa-times");
    i.setAttribute("style","color:#DA6969;font-size:20px");
    button.appendChild(i);
    actionBar.appendChild(button);

    outerContainer.appendChild(actionBar);

    var innerContainer=document.createElement("div");
    innerContainer.setAttribute("class","filtra-consistenza-commessa-inner-container");
    innerContainer.setAttribute("id","filtraConsistenzaCommessaInnerContainer");
    outerContainer.appendChild(innerContainer);

    Swal.fire
    ({
        width:"100%",
        background:"#f1f1f1",
        html:outerContainer.outerHTML,
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-popup")[0].style.height="100%";
                    document.getElementsByClassName("swal2-content")[0].style.height="100%";
                    setTimeout(() => {
                        getTabellaFiltraConsistenzaCommessa();
                    }, 500);
                }
    });
}
function getCabinePopupFiltraConsistenzaCommessa()
{
    try {
        var cabine=hot.getDataAtCol(23);
        document.getElementById("textareaElencoCodici").innerHTML=cabine.join("\n");

        checkCodici();
    } catch (error) {
        Swal.close();
    }
}
async function getTabellaFiltraConsistenzaCommessa()
{
    try {hot.destroy();} catch (error) {}

    var container = document.getElementById('filtraConsistenzaCommessaInnerContainer');
    container.innerHTML="<i class='fad fa-spinner-third fa-4x fa-spin'></i>";

    var commessa=document.getElementById("selectCommessaPopupFiltraConsistenzaCommessa").value;
    consistenzaCommessa=await getConsistenzaCommessa(commessa);

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
    
    container.innerHTML="";

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
                allowInsertRow: false,
                allowRemoveRow: false,
                allowInsertColumn: false,
                allowRemoveColumn: false,
                //className: "htMiddle",
                filters: true,
                dropdownMenu: true,
                headerTooltips: true,
                language: 'it-IT',
                contextMenu: true,
                width:"100%",
                height,
                afterFilter: (conditionsStack) =>
                {
                    var cabine=hot.getDataAtCol(18);
                    document.getElementById("nCabinePopupFiltraConsistenzaCommessa").innerHTML=cabine.length;
                },
                columns,
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
        try {
            document.getElementById("hot-display-license-info").remove();
        } catch (error) {}
        var tables=document.getElementsByClassName("htCore");
        for (let index = 0; index < tables.length; index++)
        {
            const element = tables[index];
            element.style.fontSize="12px";
        }
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
        var cabine=hot.getDataAtCol(18);
        document.getElementById("nCabinePopupFiltraConsistenzaCommessa").innerHTML=cabine.length;

        hot.render();
        
    }
    else
    {
        var div=document.createElement("div");
        div.setAttribute("style","font-family:'Montserrat',sans-serif;width:100%;text-align:left;font-weight:bold;font-size:13px;text-decoration:underline;height:100%");
        div.innerHTML="Consistenza commessa non importata";
        container.appendChild(div);
    }
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
async function getPopupEsponenteDiCarico()
{
    Swal.fire
    ({
        title: "Caricamento in corso... ",
        background:"transparent",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-4x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });

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
    select.setAttribute("id","popupEsponenteDiCaricoCommessa");

    var commesse=await getCommesse();

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
    row.setAttribute("style","display:flex;flex-direction:row;width:100%;margin-top:10px;justify-content:flex-start;align-items:center;margin-bottom:5px");

    var checkbox=document.createElement("input");
    checkbox.setAttribute("type","checkbox");
    checkbox.setAttribute("id","popupEsponenteDiCaricoCheckbox");
    checkbox.setAttribute("onchange","if(this.checked){$('.popup-esponente-di-carico-colonna-items').show();}else{$('.popup-esponente-di-carico-colonna-items').hide();}");
    checkbox.setAttribute("checked","checked");
    checkbox.setAttribute("style","margin:0px;margin-right:5px;");
    row.appendChild(checkbox);

    var label=document.createElement("span");
    label.setAttribute("style","width:100px;margin-right:7px;color:#ddd");
    label.innerHTML="Calcola media";
    row.appendChild(label);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;margin-top:10px;");
    row.setAttribute("class","popup-esponente-di-carico-colonna-items");
    row.innerHTML="Colonna raggruppamento";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");
    row.setAttribute("class","popup-esponente-di-carico-colonna-items");

    var select=document.createElement("select");
    select.setAttribute("class","dark-popup-select");
    select.setAttribute("id","popupEsponenteDiCaricoColonna");

    var colonne=await getColonneConsistenzaCommessa();

    colonne.forEach(colonna =>
    {
        var option=document.createElement("option");
        option.setAttribute("value",colonna);
        if(colonna=="tipo")
            option.setAttribute("selected","selected");
        option.innerHTML=colonna;
        select.appendChild(option);
    });
    
    row.appendChild(select);

    outerContainer.appendChild(row);
    
    var row=document.createElement("div");
    row.setAttribute("class","dark-popup-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:10px");

    var confirmButton=document.createElement("button");
    confirmButton.setAttribute("class","dark-popup-button");
    confirmButton.setAttribute("id","popupEsponenteDiCaricoButton");
    confirmButton.setAttribute("style","width:100%;");
    confirmButton.setAttribute("onclick","getTabellaEsponenteDiCarico()");
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
function getColonneConsistenzaCommessa()
{
    return new Promise(function (resolve, reject) 
    {
        $.post("getColonneConsistenzaCommessa.php",
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
        });
    });
}
async function getTabellaEsponenteDiCarico()
{
    view="esponente_di_carico";

    var container=document.getElementById("calcoloPesiContainer");
    container.innerHTML="";
    
    var commessa=document.getElementById("popupEsponenteDiCaricoCommessa").value;
    var calcola_media=document.getElementById("popupEsponenteDiCaricoCheckbox").checked;
    var colonna=document.getElementById("popupEsponenteDiCaricoColonna").value;

    Swal.fire
    ({
        title: "Caricamento in corso... ",
        background:"transparent",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-4x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });

    var commesse=await getCommesse();

    var data=await getEsponenteDiCarico(commessa,calcola_media,colonna);
    console.log(data);

    Swal.close();

    var row=document.createElement("div");
    row.setAttribute("class","calcolo-superficie-row");
    row.setAttribute("style","height:25px;margin-left:25px;margin-right:25px;width: calc(100% - 50px);");

    var tableTitleCodici=document.createElement("div");
    tableTitleCodici.setAttribute("class","calcolo-superficie-table-title");

    var div=document.createElement("div");
    var i=document.createElement("i");
    i.setAttribute("class","fal fa-table");
    i.setAttribute("style","color:white;margin-right:5px");
    div.appendChild(i);
    var span=document.createElement("span");
    if(calcola_media)
        span.innerHTML=data.length+" righe (colonna "+colonna+")";
    else
        span.innerHTML=data.length+" righe";
    div.appendChild(span);
    tableTitleCodici.appendChild(div);

    var div=document.createElement("div");
    div.setAttribute("style","margin-left:auto");

    var span=document.createElement("span");
    span.setAttribute("style","margin-right:5px");
    var commessaObj=getFirstObjByPropValue(commesse,"id_commessa",commessa);
    span.innerHTML="Commessa: "+commessaObj.nome;
    div.appendChild(span);

    tableTitleCodici.appendChild(div);

    row.appendChild(tableTitleCodici);

    container.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","calcolo-superficie-row");
    row.setAttribute("style","height:calc(100% - 25px);min-height:calc(100% - 25px);max-height:calc(100% - 25px)");

    var tableCodiciContainer=document.createElement("div");
    tableCodiciContainer.setAttribute("id","tableCodiciContainer");
    row.appendChild(tableCodiciContainer);

    container.appendChild(row);

    if(calcola_media)
    {
        var headers=
        [
            {
                value:colonna,
                label:capitalizeFirstLetter(colonna)
            },
            {
                value:"n_cabine",
                label:"N. cabine"
            },
            {
                value:"peso",
                label:"Peso medio (kg)"
            }
        ];
    }
    else
    {
        var headers=
        [
            {value:"codice_cabina",label:"Codice cabina"},
            {value:"ponte",label:"Ponte"},
            {value:"firezone",label:"Firezone"},
            {value:"lato_nave",label:"Lato nave"},
            {value:"n_cabina",label:"N. cabina"},
            {value:"verso_cabina",label:"Verso cabina"},
            {value:"tipo_cabina",label:"Tipo cabina"},
            {value:"tipo",label:"Tipo"},
            {value:"peso",label:"Peso (kg)"}
        ];
    }
    
    var codiciTable=document.createElement("table");
    codiciTable.setAttribute("id","codiciTable");

    var thead=document.createElement("thead");
    var tr=document.createElement("tr");
    headers.forEach(function (header)
    {
        var th=document.createElement("th");
        th.setAttribute("class","codiciTableCell"+header.value);
        th.innerHTML=header.label;
        tr.appendChild(th);
    });
    thead.appendChild(tr);
    codiciTable.appendChild(thead);

    var tbody=document.createElement("tbody");
    var i=0;
    data.forEach(function (row)
    {
        var tr=document.createElement("tr");
        headers.forEach(function (header)
        {
            var td=document.createElement("td");
            td.setAttribute("class","codiciTableCell"+header.value);
            if(header.value=="n_cabine")
                td.innerHTML=parseInt(row[header.value]);
            else
            {
                try {
                    td.innerHTML=row[header.value].toFixed(2);
                } catch (error) {
                    td.innerHTML=row[header.value];
                }
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
        i++;
    });
    codiciTable.appendChild(tbody);

    tableCodiciContainer.appendChild(codiciTable);

    fixTableCodici();
}
function getEsponenteDiCarico(commessa,calcola_media,colonna)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getEsponenteDiCarico.php",
        {
            commessa,calcola_media,colonna
        },
        function(response, status)
        {
            //console.log(response);
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
                    if(response.toLowerCase().indexOf("codice_non_trovato")>-1)
                    {
                        Swal.fire({icon:"error",title: "I codici inseriti non appartengono a nessuna tabella",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
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
            }
            else
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
                resolve([]);
            }
        });
    });
}
function capitalizeFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
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