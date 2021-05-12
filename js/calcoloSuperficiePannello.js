var codici=[];
var pannelli;
var totaliPannelli;
var kit;
var totaliKit;
var cabineTrovate;
var cabineNonTrovate;
var stepsPannelli=100;
var oldStepsPannelli;
var stepsPannelliSize=100;
var stepsKit=100;
var oldStepsKit;
var stepsKitSize=100;
var mostraCodiciCabina;

function checkCodiciCabina()
{
    codici=[];
    var textarea=document.getElementById("textareaElencoCodiciCabina");
    var value=textarea.value;
    if(value!="")
    {
		//value=value.replace(" ","");
		value=value.replace(/ /g,"");
        codiciD=value.split("\n");
        codici = cleanArray(codiciD);
        var outerContainer=document.createElement("div");
        outerContainer.setAttribute("class","conferma-codici-outer-container");
        var table=document.createElement("table");
        table.setAttribute("class","conferma-codici-table");
        codici.forEach(function(codice)
        {
            var tr=document.createElement("tr");
            var td=document.createElement("td");
            td.style.textAlign="left";
            td.innerHTML=codice;
            tr.appendChild(td);
            var td=document.createElement("td");
            td.innerHTML='<i title="Rimuovi" class="fal fa-times" onclick="rimuoviCodiceCabinaPopup(this.parentElement)"></i>';
            tr.appendChild(td);
            table.appendChild(tr);
        });
        outerContainer.appendChild(table);
        Swal.fire
        ({
            title: "Riepilogo codici inseriti",
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
                printInfoSuperficiePannello();
            }
            else
                swal.close();
        });
    }
}
async function printInfoSuperficiePannello()
{
    //document.getElementById("textareaElencoCodiciCabina").value="";

    mostraCodiciCabina=document.getElementById("checkboxMostraCodiciCabina").checked;
    //console.log(mostraCodiciCabina);

    document.getElementById("btnCheckCodiciCabina").disabled=true;

    var container=document.getElementById("calcoloSuperficiePannelloContainer");
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

    var arrayResponse=await getInfoSuperficiePannello();

    console.log(arrayResponse);

    Swal.close();

    document.getElementById("btnCheckCodiciCabina").disabled=false;

    pannelli=arrayResponse.pannelli;
    totaliPannelli=arrayResponse.totaliPannelli;

    kit=arrayResponse.kit;
    totaliKit=arrayResponse.totaliKit;

    cabineTrovate=arrayResponse.cabineTrovate;

    var row=document.createElement("div");
    row.setAttribute("class","calcolo-superficie-row");
    row.setAttribute("style","height:25px;margin-left:25px;margin-right:25px;width: calc(100% - 50px);");

    var tableTitlePannelli=document.createElement("div");
    tableTitlePannelli.setAttribute("class","calcolo-superficie-table-title");

    var div=document.createElement("div");
    var i=document.createElement("i");
    i.setAttribute("class","fal fa-table");
    i.setAttribute("style","color:white;margin-right:5px");
    div.appendChild(i);
    var span=document.createElement("span");
    span.innerHTML="Pannelli ("+pannelli.length+" righe)";
    div.appendChild(span);
    tableTitlePannelli.appendChild(div);

    var div=document.createElement("div");
    div.setAttribute("style","margin-left:auto");

    var i=document.createElement("i");
    i.setAttribute("class","fal fa-sigma");
    i.setAttribute("style","color:white;margin-right:5px");
    div.appendChild(i);
    var span=document.createElement("span");
    span.innerHTML="TOTALI";
    div.appendChild(span);

    var span=document.createElement("span");
    span.setAttribute("style","margin-left:20px;margin-right:10px");
    span.innerHTML="Quantita: "+totaliPannelli.qnt;
    div.appendChild(span);

    /*var span=document.createElement("span");
    span.setAttribute("style","margin-left:10px;margin-right:10px");
    span.innerHTML="M.Q.: "+totaliPannelli.mq;
    div.appendChild(span);*/

    var span=document.createElement("span");
    span.setAttribute("style","margin-left:10px;margin-right:10px");
    span.innerHTML="M.Q. Totali: "+totaliPannelli.mq_totali;
    div.appendChild(span);

    var span=document.createElement("span");
    span.setAttribute("style","margin-left:10px;margin-right:5px");
    span.innerHTML="Forati: "+totaliPannelli.forati;
    div.appendChild(span);

    tableTitlePannelli.appendChild(div);

    row.appendChild(tableTitlePannelli);

    var tableTitleKit=document.createElement("div");
    tableTitleKit.setAttribute("class","calcolo-superficie-table-title");

    var div=document.createElement("div");
    var i=document.createElement("i");
    i.setAttribute("class","fal fa-table");
    i.setAttribute("style","color:white;margin-right:5px");
    div.appendChild(i);
    var span=document.createElement("span");
    span.innerHTML="Kit ("+kit.length+" righe)";
    div.appendChild(span);
    tableTitleKit.appendChild(div);

    var div=document.createElement("div");
    div.setAttribute("style","margin-left:auto");

    var i=document.createElement("i");
    i.setAttribute("class","fal fa-sigma");
    i.setAttribute("style","color:white;margin-right:5px");
    div.appendChild(i);
    var span=document.createElement("span");
    span.innerHTML="TOTALI";
    div.appendChild(span);

    var span=document.createElement("span");
    span.setAttribute("style","margin-left:20px;margin-right:10px");
    span.innerHTML="Quantita: "+totaliKit.qnt;
    div.appendChild(span);

    /*var span=document.createElement("span");
    span.setAttribute("style","margin-left:10px;margin-right:10px");
    span.innerHTML="M.Q.: "+totaliKit.mq;
    div.appendChild(span);*/

    var span=document.createElement("span");
    span.setAttribute("style","margin-left:10px;margin-right:5px");
    span.innerHTML="M.Q. Totali: "+totaliKit.mq_totali;
    div.appendChild(span);

    tableTitleKit.appendChild(div);

    row.appendChild(tableTitleKit);

    container.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","calcolo-superficie-row");
    row.setAttribute("style","height:calc(100% - 25px);min-height:calc(100% - 25px);max-height:calc(100% - 25px)");

    var tablePannelliContainer=document.createElement("div");
    tablePannelliContainer.setAttribute("id","tablePannelliContainer");
    row.appendChild(tablePannelliContainer);

    var tableKitContainer=document.createElement("div");
    tableKitContainer.setAttribute("id","tableKitContainer");
    row.appendChild(tableKitContainer);

    container.appendChild(row);

    getTablePannelli();
    getTableKit();

    checkCabineNonTrovate();
}
function checkCabineNonTrovate()
{
    $("#btnCabineNonTrovate").hide("fast","swing");

    cabineNonTrovate=[];
    codici.forEach(function(codice)
    {
		
        if(!cabineTrovate.includes(codice))
		{
            cabineNonTrovate.push(codice);
		}
    });
    if(cabineNonTrovate.length>0)
    {
        $("#btnCabineNonTrovate").show(300,"swing");
    }
}
function getPopupCabineNonTrovate()
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","conferma-codici-outer-container");
    var table=document.createElement("table");
    table.setAttribute("class","conferma-codici-table");
    cabineNonTrovate.forEach(function(codice)
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
        title: "Cabine non trovate",
        html: outerContainer.outerHTML,
        showConfirmButton:false,
        showCloseButton:true,
        allowEscapeKey:true,
        allowOutsideClick:true,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });
}
function getTablePannelli()
{
    var oldScrollTop=0;
    if(document.getElementById("pannelliTable")!=null)
    {
        var tableBody = document.getElementById("pannelliTable").getElementsByTagName("tbody")[0];
        oldScrollTop=tableBody.scrollTop;
    }

    document.getElementById("tablePannelliContainer").innerHTML="";

    if(mostraCodiciCabina)
    {
        var pannelliHeaders=
        [
            /*{
                value:"database",
                label:"Database"
            },*/
            {
                value:"codcab",
                label:"Cabina"
            },
            {
                value:"codele",
                label:"Pannello"
            },
            {
                value:"lung1",
                label:"Lunghezza 1"
            },
            {
                value:"lung2",
                label:"Lunghezza 2"
            },
            {
                value:"halt",
                label:"Altezza"
            },
            {
                value:"qnt",
                label:"Quantita"
            },
            {
                value:"ang",
                label:"Angolo"
            },
            {
                value:"mq",
                label:"M.Q. (netti)"
            },
            {
                value:"mq_totali",
                label:"M.Q. totali (netti)"
            },
            {
                value:"forati",
                label:"Forati"
            }
        ];
    }
    else
    {
        var pannelliHeaders=
        [
            /*{
                value:"database",
                label:"Database"
            },*/
            {
                value:"codele",
                label:"Pannello"
            },
            {
                value:"lung1",
                label:"Lunghezza 1"
            },
            {
                value:"lung2",
                label:"Lunghezza 2"
            },
            {
                value:"halt",
                label:"Altezza"
            },
            {
                value:"qnt",
                label:"Quantita"
            },
            {
                value:"ang",
                label:"Angolo"
            },
            {
                value:"mq",
                label:"M.Q. (netti)"
            },
            {
                value:"mq_totali",
                label:"M.Q. totali (netti)"
            },
            {
                value:"forati",
                label:"Forati"
            }
        ];
    }
    
    var pannelliTable=document.createElement("table");
    pannelliTable.setAttribute("id","pannelliTable");

    var thead=document.createElement("thead");
    var tr=document.createElement("tr");
    pannelliHeaders.forEach(function (header)
    {
        var th=document.createElement("th");
        th.setAttribute("class","pannelliTableCell"+header.value);
        th.innerHTML=header.label;
        tr.appendChild(th);
    });
    thead.appendChild(tr);
    pannelliTable.appendChild(thead);

    var tbody=document.createElement("tbody");
    var i=0;
    pannelli.forEach(function (pannello)
    {
        if(i<stepsPannelli)
        {
            var tr=document.createElement("tr");
            pannelliHeaders.forEach(function (header)
            {
                var td=document.createElement("td");
                td.setAttribute("class","pannelliTableCell"+header.value);
                td.innerHTML=pannello[header.value];
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        }
        i++;
    });
    pannelliTable.appendChild(tbody);

    document.getElementById("tablePannelliContainer").appendChild(pannelliTable);

    var caricaAltriButton=document.createElement("button");
    caricaAltriButton.setAttribute("class","carica-altri-button");
    caricaAltriButton.setAttribute("onclick","stepsPannelli+=stepsPannelliSize;getTablePannelli()");
    var span=document.createElement("span");
    span.innerHTML="Mostra altre righe";
    caricaAltriButton.appendChild(span);
    
    document.getElementById("tablePannelliContainer").appendChild(caricaAltriButton);

    fixTablePannelli();
    
    var tableBody = document.getElementById("pannelliTable").getElementsByTagName("tbody")[0];
    tableBody.scrollTop = oldScrollTop;
}
function getTableKit()
{
    var oldScrollTop=0;
    if(document.getElementById("kitTable")!=null)
    {
        var tableBody = document.getElementById("kitTable").getElementsByTagName("tbody")[0];
        oldScrollTop=tableBody.scrollTop;
    }

    document.getElementById("tableKitContainer").innerHTML="";

    if(mostraCodiciCabina)
    {
        var kitHeaders=
        [
            /*{
                value:"database",
                label:"Database"
            },*/
            {
                value:"codcab",
                label:"Cabina"
            },
            {
                value:"codkit",
                label:"Kit"
            },
            {
                value:"halt",
                label:"Altezza"
            },
            {
                value:"lung",
                label:"Lunghezza"
            },
            {
                value:"qnt",
                label:"Quantita"
            },
            {
                value:"mq",
                label:"M.Q. (netti)"
            },
            {
                value:"mq_totali",
                label:"M.Q. totali (netti)"
            }
        ];
    }
    else
    {
        var kitHeaders=
        [
            /*{
                value:"database",
                label:"Database"
            },*/
            {
                value:"codkit",
                label:"Kit"
            },
            {
                value:"halt",
                label:"Altezza"
            },
            {
                value:"lung",
                label:"Lunghezza"
            },
            {
                value:"qnt",
                label:"Quantita"
            },
            {
                value:"mq",
                label:"M.Q. (netti)"
            },
            {
                value:"mq_totali",
                label:"M.Q. totali (netti)"
            }
        ];
    }
    
    var kitTable=document.createElement("table");
    kitTable.setAttribute("id","kitTable");

    var thead=document.createElement("thead");
    var tr=document.createElement("tr");
    kitHeaders.forEach(function (header)
    {
        var th=document.createElement("th");
        th.setAttribute("class","kitTableCell"+header.value);
        th.innerHTML=header.label;
        tr.appendChild(th);
    });
    thead.appendChild(tr);
    kitTable.appendChild(thead);

    var tbody=document.createElement("tbody");
    var i=0;
    kit.forEach(function (kitItem)
    {
        if(i<stepsKit)
        {
            var tr=document.createElement("tr");
            kitHeaders.forEach(function (header)
            {
                var td=document.createElement("td");
                td.setAttribute("class","kitTableCell"+header.value);
                td.innerHTML=kitItem[header.value];
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        }
        i++;
    });
    kitTable.appendChild(tbody);
    
    document.getElementById("tableKitContainer").appendChild(kitTable);

    var caricaAltriButton=document.createElement("button");
    caricaAltriButton.setAttribute("class","carica-altri-button");
    caricaAltriButton.setAttribute("onclick","stepsKit+=stepsKitSize;getTableKit()");
    var span=document.createElement("span");
    span.innerHTML="Mostra altre righe";
    caricaAltriButton.appendChild(span);
    
    document.getElementById("tableKitContainer").appendChild(caricaAltriButton);

    fixTableKit();
    
    var tableBody = document.getElementById("kitTable").getElementsByTagName("tbody")[0];
    tableBody.scrollTop = oldScrollTop;
}
function fixTablePannelli()
{
    try {
        var tableWidth=document.getElementById("pannelliTable").offsetWidth-8;
        //var tableColWidth=(10*tableWidth)/100;
		var tableColWidth=tableWidth/document.getElementById("pannelliTable").getElementsByTagName("thead")[0].getElementsByTagName("tr")[0].childElementCount;
        
        $("#pannelliTable th").css({"width":tableColWidth+"px"});
        $("#pannelliTable td").css({"width":tableColWidth+"px"});
    } catch (error) {}
}
function fixTableKit()
{
    try {
        var tableWidth=document.getElementById("kitTable").offsetWidth-8;
        //var tableColWidth=(14.3*tableWidth)/100;
		var tableColWidth=tableWidth/document.getElementById("kitTable").getElementsByTagName("thead")[0].getElementsByTagName("tr")[0].childElementCount;
        
        $("#kitTable th").css({"width":tableColWidth+"px"});
        $("#kitTable td").css({"width":tableColWidth+"px"});
    } catch (error) {}
}
function getInfoSuperficiePannello()
{
    return new Promise(function (resolve, reject) 
    {
        var JSONcodici=JSON.stringify(codici);
        $.post("getInfoSuperficiePannello.php",
        {
            JSONcodici,
            mostraCodiciCabina
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
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
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
function rimuoviCodiceCabinaPopup(td)
{
    var tr=td.parentElement;
    var codice=tr.firstChild.innerHTML;
    const index = codici.indexOf(codice);
    if (index > -1)
    {
        codici.splice(index, 1);
    }
    tr.remove();
}
function esportaExcel()
{
    if(document.getElementById("pannelliTable")!=null && document.getElementById("kitTable")!=null)
    {
        Swal.fire
        ({
            title: "Scegli il nome del file Excel",
            html: '<input tyle="text" id="inputNomeFileEsportaExcel" value="calcolo_superficie">',
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

                setTimeout(function(){
                    oldStepsPannelli=stepsPannelli;
                    stepsPannelli=pannelli.length;
                    getTablePannelli();
                    oldStepsKit=stepsKit;
                    stepsKit=kit.length;
                    getTableKit();
    
                    var pannelliTable=document.getElementById("pannelliTable").cloneNode(true)
    
                    var headerRow=pannelliTable.getElementsByTagName("thead")[0].getElementsByTagName("tr")[0];
                    var thead=pannelliTable.getElementsByTagName("thead")[0];
    
                    var rowTotali=document.createElement("tr");
                    var td=document.createElement("td");
                    if(mostraCodiciCabina)
                        td.setAttribute("colspan","6");
                    else
                        td.setAttribute("colspan","5");
                    td.innerHTML="TOTALI";
                    rowTotali.appendChild(td);
                    var td=document.createElement("td");
                    if(mostraCodiciCabina)
                        td.setAttribute("colspan","3");
                    else
                        td.setAttribute("colspan","2");
                    td.innerHTML=totaliPannelli.qnt;
                    rowTotali.appendChild(td);
                    var td=document.createElement("td");
                    td.innerHTML=totaliPannelli.mq;
                    rowTotali.appendChild(td);
                    var td=document.createElement("td");
                    td.innerHTML=totaliPannelli.mq_totali;
                    rowTotali.appendChild(td);
                    var td=document.createElement("td");
                    td.innerHTML=totaliPannelli.forati;
                    rowTotali.appendChild(td);
                    thead.appendChild(rowTotali);
    
                    var spaceRow=document.createElement("tr");
                    thead.appendChild(spaceRow);
    
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
    
                    var pannelliTableString="<html>"+pannelliTable.outerHTML+"</html>";
    
                    var kitTable=document.getElementById("kitTable").cloneNode(true)
    
                    var headerRow=kitTable.getElementsByTagName("thead")[0].getElementsByTagName("tr")[0];
                    var thead=kitTable.getElementsByTagName("thead")[0];
    
                    var rowTotali=document.createElement("tr");
                    var td=document.createElement("td");
                    td.setAttribute("colspan","4");
                    td.innerHTML="TOTALI";
                    rowTotali.appendChild(td);
                    var td=document.createElement("td");
                    td.innerHTML=totaliKit.qnt;
                    rowTotali.appendChild(td);
                    var td=document.createElement("td");
                    td.innerHTML=totaliKit.mq;
                    rowTotali.appendChild(td);
                    var td=document.createElement("td");
                    td.innerHTML=totaliKit.mq_totali;
                    rowTotali.appendChild(td);
                    thead.appendChild(rowTotali);
    
                    var spaceRow=document.createElement("tr");
                    thead.appendChild(spaceRow);
    
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
    
                    var kitTableString="<html>"+kitTable.outerHTML+"</html>";
                    
                    var blob;
                    var wb = {SheetNames:[], Sheets:{}};
                    
                    var codiciString="<tr><td>"+codici.join("</td><tr><td>");
                    codiciString += "</td></tr>";
                    var ws0 = XLSX.read("<html><table>"+codiciString+"</table></html>", {type:"binary"}).Sheets.Sheet1;
                    wb.SheetNames.push("Cabine"); 
                    wb.Sheets["Cabine"] = ws0;
    
                    var ws1 = XLSX.read(pannelliTableString, {type:"binary"}).Sheets.Sheet1;
                    wb.SheetNames.push("Pannelli"); 
                    wb.Sheets["Pannelli"] = ws1;
    
                    var ws2 = XLSX.read(kitTableString, {type:"binary"}).Sheets.Sheet1;
                    wb.SheetNames.push("Kit"); 
                    wb.Sheets["Kit"] = ws2;
    
                    blob = new Blob([s2ab(XLSX.write(wb, {bookType:'xlsx', type:'binary'}))],
                    {
                        type: "application/octet-stream"
                    });
    
                    saveAs(blob, fileName+".xlsx");
    
                    stepsPannelli=oldStepsPannelli;
                    getTablePannelli();
                    stepsKit=oldStepsKit;
                    getTableKit();
    
                    swal.close();
                }, 1500);
            }
            else
                swal.close();
        });
    }   
}
function s2ab(s)
{
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}
function disableCheckboxMostraCodiciCabina(event)
{
    event.stopPropagation();
}