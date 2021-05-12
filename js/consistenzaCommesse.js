var commesse;
var hot;

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
	
    var check=await checkAccessoEsclusivoConsistenzaCommesse();
    setTimeout(function()
    {
        if(!check)
        {
            Swal.close();
            getSelectCommesse();
            insertAccessoEsclusivoConsistenzaCommesse();
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
                    getSelectCommesse();
                }
            })
        }
    }, 1500);
});
window.onbeforeunload = function() 
{
	deleteAccessoEsclusivoConsistenzaCommesse();
};
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
        document.getElementById("popupModificaCommessaCheckboxTipCab").disabled=false;
        document.getElementById("popupModificaCommessaTipCab").disabled=false;
        document.getElementById("popupModificaCommessaCheckboxTipCor").disabled=false;
        document.getElementById("popupModificaCommessaTipCor").disabled=false;
        document.getElementById("popupModificaCommessaButton").disabled=false;
        var infoCommessa=await getInfoCabineCommessa(id_commessa,"tip_cab");
        document.getElementById("popupModificaCommessaDescrizione").value=infoCommessa.descrizione;
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
    else
    {
        document.getElementById("popupModificaCommessaDescrizione").value="";
        document.getElementById("popupModificaCommessaDescrizione").disabled=true;
        document.getElementById("labelTipCabConsistenzaCommessaPopup").innerHTML="Tip cab";
        document.getElementById("popupModificaCommessaCheckboxTipCab").disabled=true;
        document.getElementById("popupModificaCommessaTipCab").disabled=true;
        document.getElementById("labelTipCorConsistenzaCommessaPopup").innerHTML="Tip cor";
        document.getElementById("popupModificaCommessaCheckboxTipCor").disabled=true;
        document.getElementById("popupModificaCommessaTipCor").disabled=true;
        document.getElementById("popupModificaCommessaButton").disabled=true;
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

    var row=document.createElement("div");
    row.setAttribute("class","dark-popup-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:10px");

    var confirmButton=document.createElement("button");
    confirmButton.setAttribute("class","dark-popup-button");
    confirmButton.setAttribute("style","width:calc(50% - 10px);margin-right:10px;");
    confirmButton.setAttribute("onclick","inserisciNuovaCommessa(false)");
    confirmButton.innerHTML='<span>Conferma</span><i class="fal fa-check-circle"></i>';
    row.appendChild(confirmButton);

    var nextButton=document.createElement("button");
    nextButton.setAttribute("class","dark-popup-button");
    nextButton.setAttribute("style","width:calc(50% - 10px);margin-left:10px;");
    nextButton.setAttribute("onclick","inserisciNuovaCommessa(true)");
    nextButton.innerHTML='<span>Collegamento tabelle</span><i class="fas fa-long-arrow-alt-right"></i>';
    row.appendChild(nextButton);

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
    var fileTipCab=document.getElementById("popupModificaCommessaTipCab").files[0];
    var fileTipCor=document.getElementById("popupModificaCommessaTipCor").files[0];
    var utente=await getSessionValue("username");
    var nome=await getNomeCommessa(id_commessa);
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
            $.post("insertAnagraficaCommessa.php",{nome,descrizione},
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
/*function parseExcelConsistenzaCommessa(excelFile,operation,commessa,descrizione,id_commessa)
{
    if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx"))))
    {
        Swal.fire
        ({
            width:"100%",
            background:"transparent",
            title:"Lettura file excel in corso...",
            html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
            allowOutsideClick:false,
            showCloseButton:false,
            showConfirmButton:false,
            allowEscapeKey:false,
            showCancelButton:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
        });

        var data = [];
        var headers = [];

        var fileReader = new FileReader();

        fileReader.onload = function (e)
        {
            var buffer = new Uint8Array(fileReader.result);

            $.ig.excel.Workbook.load(buffer, function (workbook)
            {
                var worksheets=[];

                for (let index = 0; index < 100; index++)
                {
                    try
                    {
                        var worksheet = workbook.worksheets(index);
                        worksheets.push(worksheet["_ah"]);
                    } catch (error){}
                }

                if(worksheets.includes("tip-cab"))
                {
                    var column, row, newRow, cellValue, columnIndex, i,worksheet = workbook.worksheets(worksheets.indexOf("tip-cab")),columnsNumber = 0,gridColumns = [],worksheetRowsCount;

                    data = [];
                    headers = [];

                    while (worksheet.rows(1).getCellValue(columnsNumber))
                    {
                        columnsNumber++;
                    }

                    for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++)
                    {
                        var col = worksheet.rows(1).getCellText(columnIndex);
                        col=col.replaceAll(" ","_");
                        col=col.replaceAll("'","");
                        col=col.replaceAll('"','');
                        col=col.replaceAll(".","");
                        col=col.replaceAll("à","a");
                        col=col.replaceAll("è","e");
                        col=col.replaceAll("ì","i");
                        col=col.replaceAll("ò","o");
                        col=col.replaceAll("ù","u");
                        col=col.replaceAll("=","");
                        col=col.replaceAll("-","");
                        col=col.replaceAll("#","");
                        col=col.replaceAll("(","");
                        col=col.replaceAll(")","");
                        col=col.replaceAll("+","");
                        col=col.replaceAll("/","");
                        col=col.replaceAll("\\","");
                        col=col.replaceAll("°","_");
                        col = col.replaceAll(/\r?\n/g, "_");
                        col = col.toLowerCase();

                        gridColumns.push({ headerText: col, key: col });
                    }
                    gridColumns.forEach(function(gridColumn)
                    {
                        var col=gridColumn["key"];
                        col=col.replaceAll(" ","_");
                        col=col.replaceAll("'","");
                        col=col.replaceAll('"','');
                        col=col.replaceAll(".","");
                        col=col.replaceAll("à","a");
                        col=col.replaceAll("è","e");
                        col=col.replaceAll("ì","i");
                        col=col.replaceAll("ò","o");
                        col=col.replaceAll("ù","u");
                        col=col.replaceAll("=","");
                        col=col.replaceAll("-","");
                        col=col.replaceAll("#","");
                        col=col.replaceAll("(","");
                        col=col.replaceAll(")","");
                        col=col.replaceAll("+","");
                        col=col.replaceAll("/","");
                        col=col.replaceAll("\\","");
                        col=col.replaceAll("°","_");
                        col = col.replaceAll(/\r?\n/g, "_");
                        col = col.toLowerCase();

                        headers.push(col);
                    });

                    if(!headers.includes("n_cabina") && !headers.includes("nrcodice_pareti_kit"))
                    {
                        Swal.fire
                        ({
                            icon:"error",
                            background:"#404040",
                            title: "Colonna [N°Cabina]/[Nr. Codice Pareti kit] non trovata",
                            showCloseButton:true,
                            showConfirmButton:false,
                            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                        });
                    }
                    else
                    {
                        var length=headers.length;
                        for (let index = 0; index < length; index++)
                        {
                            var header = headers[index];
                            var occourences=countOccourences(header,headers);
                            if(occourences>1)
                            {
                                for (let index2 = 0; index2 < occourences; index2++)
                                {
                                    for (let index3 = 0; index3 < headers.length; index3++)
                                    {
                                        const headerObj = headers[index3];
                                        if(headerObj==header)
                                        {
                                            if(index2==0)
                                                headers[index3]=headerObj;
                                            else
                                                headers[index3]=headerObj+"_"+index2;
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        for (i = 2, worksheetRowsCount = worksheet.rows().count() ; i < worksheetRowsCount; i++)
                        {
                            newRow = {};
                            row = worksheet.rows(i);

                            for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++)
                            {
                                cellValue = row.getCellText(columnIndex);
                                newRow[headers[columnIndex]] = cellValue;
                            }

                            data.push(newRow);
                        }

                        var cleanData=[];
                        data.forEach(row =>
                        {
                            var push=false;
                            headers.forEach(header =>
                            {
                                if(row[header]!="")
                                    push=true;
                            });
                            if(push)
                                cleanData.push(row);
                        });

                        var JSONheaders=JSON.stringify(headers);
                        var JSONdata=JSON.stringify(cleanData);

                        Swal.fire
                        ({
                            width:"100%",
                            background:"transparent",
                            title:"Inserimento dati in corso...",
                            html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
                            allowOutsideClick:false,
                            showCloseButton:false,
                            showConfirmButton:false,
                            allowEscapeKey:false,
                            showCancelButton:false,
                            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
                        });

                        $.post("insertConsistenzaCommessa.php",{JSONheaders,JSONdata,commessa,descrizione,operation,id_commessa},
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
                                    getSelectCommesse();
                                    $.post("insertLogImportazioneConsistenzaCommessa.php",{commessa,response},
                                    function(response, status)
                                    {
                                        console.log(response);
                                        Swal.fire
                                        ({
                                            icon:"success",
                                            title: "Inserimento completato",
                                            showCloseButton:true,
                                            showConfirmButton:false,
                                            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                                        });
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
                        icon:"error",
                        background:"#404040",
                        title: "Foglio [tip-cab] mancante",
                        showCloseButton:true,
                        showConfirmButton:false,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#ddd";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                    });
                }           
            }, function (error)
            {
                Swal.fire
                ({
                    icon: 'error',
                    title: 'File illeggibile',
                    showCloseButton:true,
                    showConfirmButton:false,
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                });
            });
        }

        fileReader.readAsArrayBuffer(excelFile);
    }
    else
    {
        Swal.fire
        ({
            icon:"error",
            title: "Formato file non valido",
            showCloseButton:true,
            showConfirmButton:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
        });
    }
}*/
/*function insertLogImportazioneConsistenzaCommessa(commessa,response)
{
    return new Promise(function (resolve, reject) 
    {
        $.post("insertLogImportazioneConsistenzaCommessa.php",{commessa,response},
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
        });
    });
}*/
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
                /*afterChange: (changes) =>
                {
                    if(changes!=null)
                    {
                        changes.forEach(([row, prop, oldValue, newValue]) =>
                        {
                            if(prop!="id_consistenza_commessa")
                            {
                                var id_consistenza_commessa=hot.getDataAtCell(row, 0);
                                aggiornaRigaConsistenzaCommessa(id_consistenza_commessa,prop,newValue);
                            }
                        });
                    }
                },
                afterCreateRow: (index,amount,source) =>
                {
                    creaRigaConsistenzaCommessa(index);
                },
                beforeRemoveRow: (index,amount,physicalRows,source)  =>
                {
                    for (let i = 0; i < physicalRows.length; i++)
                    {
                        const indice = physicalRows[i];
                        var id_consistenza_commessa=hot.getDataAtCell(indice, 0);
                        eliminaRigaConsistenzaCommessa(id_consistenza_commessa);
                    }
                },*/
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