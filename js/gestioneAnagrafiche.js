var databases;
var tabelleCheckboxesAggiornaAnagrafiche=[];
var errorMessages=[];
var hot;
var hot3;
var view;
var tabellaMateriePrime='materie_prime';

window.addEventListener("load", async function(event)
{
	getMascheraGestioneAnagrafiche();
});
window.onbeforeunload = function() 
{
	allineaMateriePrime(false);
};
function getMascheraGestioneAnagrafiche()
{
    var actionBar=document.getElementById("gestioneAnagraficheActionBar");
    actionBar.style.display="";
    actionBar.innerHTML="";

    document.getElementById("gestioneAnagraficheContainer").innerHTML="";

    var div=document.createElement("div");
    div.setAttribute("class","rcb-text-container toggle-tabella-materie-prime");
    var button=document.createElement("button");
    button.setAttribute("style","border-top-left-radius:2px;border-bottom-left-radius:2px");
    button.setAttribute("id","bntTabellaMateriePrime");
    button.setAttribute("onclick","tabellaMateriePrime='materie_prime';getTabellaMateriePrime()");
    button.innerHTML='<span>Materie prime</span><i class="fal fa-table" style="margin-left:10px"></i>';
    div.appendChild(button);
    var button=document.createElement("button");
    button.setAttribute("style","border-top-left-radius:2px;border-bottom-left-radius:2px");
    button.setAttribute("id","bntTabellaMateriePrimeS");
    button.setAttribute("onclick","tabellaMateriePrime='materie_prime_s';getTabellaMateriePrime()");
    button.innerHTML='<span>Materie prime filtri Autocad</span><i class="fal fa-table" style="margin-left:10px"></i>';
    div.appendChild(button);
    actionBar.appendChild(div);
	
	var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("id","btnCancellaFiltri");
    button.setAttribute("onclick","getTabellaMateriePrime()");
    button.innerHTML='<span>Cancella filtri</span><i class="fad fa-filter" style="margin-left:10px"></i>';
    actionBar.appendChild(button);

	var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("id","bntNuovaMateriaPrima");
    button.setAttribute("onclick","getPopupNuovaMateriaPrima()");
    button.innerHTML='<span>Nuova materia prima</span><i class="fad fa-plus-circle" style="margin-left:10px"></i>';
    actionBar.appendChild(button);

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("id","bntEliminaMateriaPrima");
    button.setAttribute("onclick","getPopupEliminaMateriaPrima()");
    button.innerHTML='<span>Elimina materia prima</span><i class="fad fa-times-circle" style="margin-left:10px"></i>';
    actionBar.appendChild(button);
	
    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("id","bntRaggruppamenti");
    button.setAttribute("onclick","getPopupRaggruppamenti(this)");
    button.innerHTML='<span>Raggruppamenti materie prime</span><i class="fad fa-object-group" style="margin-left:10px"></i>';
    actionBar.appendChild(button);
	
	var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("id","bntAggiornaAnagraficheTxt");
    button.setAttribute("onclick","aggiornaAnagraficheTxt()");
    button.innerHTML='<span>Aggiorna anagrafiche txt</span><i class="fad fa-sync" style="margin-left:10px"></i>';
    actionBar.appendChild(button);
	
	var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("id","bntAllineaAnagrafiche");
    button.setAttribute("onclick","allineaMateriePrime(true)");
    button.innerHTML='<span>Allinea anagrafiche produzione</span><i class="fad fa-copy" style="margin-left:10px"></i>';
    actionBar.appendChild(button);

    getTabellaMateriePrime();
}
async function getTabellaMateriePrime()
{
    if(tabellaMateriePrime=="materie_prime")
    {
        document.getElementById("bntTabellaMateriePrime").style.backgroundColor="rgb(76, 145, 203)";
        document.getElementById("bntTabellaMateriePrime").style.color="white";
        document.getElementById("bntTabellaMateriePrimeS").style.backgroundColor="";
        document.getElementById("bntTabellaMateriePrimeS").style.color="";
    }
    else
    {
        document.getElementById("bntTabellaMateriePrime").style.backgroundColor="";
        document.getElementById("bntTabellaMateriePrime").style.color="";
        document.getElementById("bntTabellaMateriePrimeS").style.backgroundColor="rgb(76, 145, 203)";
        document.getElementById("bntTabellaMateriePrimeS").style.color="white";
    }

    var container = document.getElementById('gestioneAnagraficheContainer');
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

    var materiePrime=await getMateriePrime();

    Swal.close();

    var height=container.offsetHeight;

    if(materiePrime.data.length>0)
    {
		try {hot.destroy();} catch (error) {}

        hot = new Handsontable
        (
            container,
            {
                data: materiePrime.data,
                rowHeaders: true,
                manualColumnResize: true,
                colHeaders: materiePrime.colHeaders,
                className: "htMiddle",
                filters: true,
                dropdownMenu: true,
                headerTooltips: true,
                language: 'it-IT',
                contextMenu: false,
                columnSorting: true,
                width:"100%",
                height,
                columns:materiePrime.columns,
                afterChange: (changes) =>
                {
                    if(changes!=null)
                    {
                        changes.forEach(([row, prop, oldValue, newValue]) =>
                        {
                            if(tabellaMateriePrime=="materie_prime")
                            {
                                if(prop!="id_materia_prima" && prop!="codice_materia_prima")
                                {
                                    var id_materia_prima=hot.getDataAtCell(row, 0);
                                    aggiornaRigaMateriePrime(id_materia_prima,prop,newValue,oldValue);
                                }
                                else
                                {
                                    if(prop=="codice_materia_prima")
                                    {
                                        Swal.fire
                                        ({
                                            icon:"error",
                                            title: 'Errore. La colonna "'+prop+'" è in sola lettura',
                                            onOpen : function()
                                                    {
                                                        document.getElementsByClassName("swal2-title")[0].style.color="gray";
                                                        document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
                                                    }
                                        }).then((result) =>
                                        {
                                            try {hot.destroy();} catch (error) {}
                                            getTabellaMateriePrime();
                                        });
                                    }
                                }
                            }
                            else
                            {
                                if(prop!="id_materia_prima_s" && prop!="codice_materia_prima_s")
                                {
                                    var id_materia_prima=hot.getDataAtCell(row, 0);
                                    aggiornaRigaMateriePrime(id_materia_prima,prop,newValue,oldValue);
                                }
                                else
                                {
                                    if(prop=="codice_materia_prima_s")
                                    {
                                        Swal.fire
                                        ({
                                            icon:"error",
                                            title: 'Errore. La colonna "'+prop+'" è in sola lettura',
                                            onOpen : function()
                                                    {
                                                        document.getElementsByClassName("swal2-title")[0].style.color="gray";
                                                        document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
                                                    }
                                        }).then((result) =>
                                        {
                                            try {hot.destroy();} catch (error) {}
                                            getTabellaMateriePrime();
                                        });
                                    }
                                }
                            }
                        });
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
    }
}
function aggiornaRigaMateriePrime(id_materia_prima,colonna,valore,oldValue)
{
    $.get("aggiornaRigaMateriePrime.php",{id_materia_prima,colonna,valore,oldValue,tabellaMateriePrime},
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
				if(response.toLowerCase().indexOf("aggiorna")>-1)
				{
					Swal.fire
					({
						icon:"warning",
						title: 'La tabella verrà ricaricata',
						onOpen : function()
								{
									document.getElementsByClassName("swal2-title")[0].style.color="gray";
									document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
								}
					}).then((result) =>
					{
						try {hot.destroy();} catch (error) {}
						getTabellaMateriePrime();
					});
				}
			}
        }
    });
}
function creaRigaMateriePrime(index)
{
    $.get("creaRigaMateriePrime.php",
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
/*function eliminaRigaMateriePrime(id_materia_prima)
{
    Swal.fire
    ({
        title: "Caricamento in corso...",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-4x"></i>',
		background:"transparent",
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });
    
    $.get("eliminaRigaMateriePrime.php",{id_materia_prima},
    function(response, status)
    {
        if(status=="success")
        {
            Swal.close();
            if(response.toLowerCase().indexOf("vincolo_di_chiave")>-1)
            {
                Swal.fire
                ({
                    icon:"error",
                    title: "Errore. Questa materia prima è gia stata utilizzata e non può essere eliminata",
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
                }).then((result) =>
                {
                    getTabellaMateriePrime(document.getElementById("bntMateriePrime"));
                });
                console.log(response);
            }
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
        }
    });
}*/
function getMateriePrime()
{
    return new Promise(function (resolve, reject) 
    {
        console.log(tabellaMateriePrime)
        $.get("getMateriePrimeHot.php",{tabellaMateriePrime},
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
function getPopupRaggruppamenti()
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("id","containerPopupRaggruppamenti");
    outerContainer.setAttribute("style","width:calc(100% - 40px);height:550px;margin-left:20px;margin-right:20px;margin-top:15px");

    outerContainer.innerHTML="<i class='fad fa-spinner-third fa-spin'></i>";

    Swal.fire
    ({
        width:"90%",
        title:"Raggruppamenti materie prime",
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
                    alertSpan.setAttribute("id","alertSpanRaggruppamentiMateriePrime");
                    document.getElementsByClassName("swal2-header")[0].appendChild(alertSpan);

                    setTimeout(() => {
                        getHotRaggruppamentiMateriePrime();
                    }, 100);
                }
    }).then((result) => 
    {
        getTabellaMateriePrime(document.getElementById("bntMateriePrime"));
    });
}
async function getHotRaggruppamentiMateriePrime()
{
    var container = document.getElementById("containerPopupRaggruppamenti");
    container.innerHTML="";

    var table="raggruppamenti_materie_prime";

    var response=await getHotRaggruppamentiMateriePrimeData(table);

    var height=container.offsetHeight;

    if(response.data.length>0)
    {
		try {hot3.destroy();} catch (error) {}

        hot3 = new Handsontable
        (
            container,
            {
                data: response.data,
                rowHeaders: true,
                manualColumnResize: true,
                colHeaders: response.colHeaders,
                filters: false,
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
                            if(prop!=response.primaryKey && prop!="nome")
                            {
                                var id=hot3.getDataAtCell(row, 0);
                                aggiornaRigaHotRaggruppamentiMateriePrime(id,prop,newValue,table,response.primaryKey);
                            }
							else
							{
								if(prop=="nome")
								{
									Swal.fire
									({
										icon:"error",
										title: 'Errore. La colonna "'+prop+'" è in sola lettura',
										onOpen : function()
												{
													document.getElementsByClassName("swal2-title")[0].style.color="gray";
													document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
												}
									}).then((result) =>
									{
										try {hot3.destroy();} catch (error) {}
										getPopupRaggruppamenti();
									});
								}
							}
                        });
                    }
                },
				beforeCreateRow:() =>
				{
					getPopupNuovoRaggruppamentoMateriePrime();
				},
                beforeRemoveRow: (index,amount,physicalRows,source)  =>
                {
                    for (let i = 0; i < physicalRows.length; i++)
                    {
                        const indice = physicalRows[i];
                        var id=hot3.getDataAtCell(indice, 0);
                        eliminaRigaHotRaggruppamentiMateriePrime(id,table,response.primaryKey);
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

        if(response.n==1)
            document.getElementById("alertSpanRaggruppamentiMateriePrime").innerHTML="";
        if(response.n>1)
            document.getElementById("alertSpanRaggruppamentiMateriePrime").innerHTML="Può essere utilizzato solo un gruppo per calcolare il progettato in modo alternativo. <b><u>IL PROGRAMMA POTREBBE NON FUNZIONARE CORRETTAMENTE</u></b>";
        if(response.n==0)
            document.getElementById("alertSpanRaggruppamentiMateriePrime").innerHTML="Almeno un gruppo deve essere utilizzato per calcolare il progettato in modo alternativo. <b><u>IL PROGRAMMA POTREBBE NON FUNZIONARE CORRETTAMENTE</u></b>"; 
    }
}
function getPopupEliminaMateriaPrima()
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("style","width:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-start");

    var selectSwal=document.createElement("select");
    selectSwal.setAttribute("id","selectSwal");
	selectSwal.setAttribute("class","input-text-swal");
    selectSwal.setAttribute("style","margin-bottom:10px");
    var option=document.createElement("option");
    option.setAttribute("value","materie_prime|codice_materia_prima");
    option.innerHTML="Tabella materie prime";
    selectSwal.appendChild(option);
    var option=document.createElement("option");
    option.setAttribute("value","materie_prime_s|codice_materia_prima_s");
    option.innerHTML="Tabella materie prime filtri Autocad";
    selectSwal.appendChild(option);
    outerContainer.appendChild(selectSwal);

    var inputTextSwal=document.createElement("input");
	inputTextSwal.setAttribute("type","text");
	inputTextSwal.setAttribute("id","inputTextSwal");
	inputTextSwal.setAttribute("placeholder","Codice...");
	inputTextSwal.setAttribute("class","input-text-swal");
    outerContainer.appendChild(inputTextSwal);

	Swal.fire
	({
		icon: 'question',
        width:600,
		showCloseButton:true,
		title: 'Scegli il codice e la tabella di origine della materia prima da eliminare',
		html : outerContainer.outerHTML
	}).then((result) => 
	{
		if (result.value)
		{
			var codice_materia_prima=document.getElementById("inputTextSwal").value;
            var tabella=document.getElementById("selectSwal").value.split("|")[0];
            var colonna=document.getElementById("selectSwal").value.split("|")[1];

            Swal.fire
            ({
                title: "Caricamento in corso...",
                html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-4x"></i>',
                background:"transparent",
                showConfirmButton:false,
                showCloseButton:false,
                allowEscapeKey:false,
                allowOutsideClick:false,
                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
            });
            
			if(codice_materia_prima==null || codice_materia_prima=='')
			{
				Swal.fire
				({
					icon: 'error',
					title: 'Inserisci un codice valido',
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
				}).then((result) => 
				{
					getPopupEliminaMateriaPrima();
				});
			}
			else
			{
				$.get("eliminaMateriaPrima.php",{codice_materia_prima,tabella,colonna},
				function(response, status)
				{
					if(status=="success")
					{
                        var success=true;
						if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
						{
                            success=false;
							Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
							console.log(response);
						}
                        if(response.toLowerCase().indexOf("vincolo_di_chiave")>-1)
                        {
                            success=false;
                            Swal.fire
                            ({
                                icon:"error",
                                title: "Errore. Questa materia prima ("+codice_materia_prima+") è gia stata utilizzata e non può essere eliminata",
                                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
                            }).then((result) =>
                            {
                                getTabellaMateriePrime();
                            });
                            console.log(response);
                        }
                        if(response.toLowerCase().indexOf("non_trovata")>-1)
                        {
                            success=false;
                            Swal.fire
                            ({
                                icon:"error",
                                title: "Errore. Questa materia prima ("+codice_materia_prima+") non esiste nella tabella selezionata",
                                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
                            }).then((result) =>
                            {
                                getTabellaMateriePrime();
                            });
                            console.log(response);
                        }
                        if(success)
                        {
                            Swal.fire
                            ({
                                icon:"success",
                                title: "Materia prima eliminata",
                                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
                            }).then((result) =>
                            {
                                getTabellaMateriePrime();
                            });
                        }
					}
				});
			}
		}
		else
			getTabellaMateriePrime();
	});
}
function getPopupNuovaMateriaPrima()
{
	/*var inputTextSwal=document.createElement("input");
	inputTextSwal.setAttribute("type","text");
	inputTextSwal.setAttribute("id","inputTextSwal");
	inputTextSwal.setAttribute("placeholder","Codice...");
	inputTextSwal.setAttribute("class","input-text-swal");
	Swal.fire
	({
		icon: 'question',
		showCloseButton:true,
		title: 'Scegli il codice della nuova materia prima',
		html : inputTextSwal.outerHTML
	}).then((result) => 
	{
		if (result.value)
		{
			swal.close();
			var codice_materia_prima=document.getElementById("inputTextSwal").value;
			if(codice_materia_prima==null || codice_materia_prima=='')
			{
				Swal.fire
				({
					icon: 'error',
					title: 'Inserisci un codice valido',
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
				}).then((result) => 
				{
					getPopupNuovaMateriaPrima();
				});
			}
			else
			{
				$.get("creaNuovaMateriaPrima.php",{codice_materia_prima},
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
									title: "Esiste gia una materia prima con questo codice",
									onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
								}).then((result) => 
								{
									getPopupNuovaMateriaPrima();
								});
							}
							else
							{
								getTabellaMateriePrime();
							}
						}
					}
				});
			}
		}
		else
			getTabellaMateriePrime();
	});*/
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("style","width:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-start");

    var selectSwal=document.createElement("select");
    selectSwal.setAttribute("id","selectSwal");
	selectSwal.setAttribute("class","input-text-swal");
    selectSwal.setAttribute("style","margin-bottom:10px");
    var option=document.createElement("option");
    option.setAttribute("value","materie_prime|codice_materia_prima");
    option.innerHTML="Tabella materie prime";
    selectSwal.appendChild(option);
    var option=document.createElement("option");
    option.setAttribute("value","materie_prime_s|codice_materia_prima_s");
    option.innerHTML="Tabella materie prime filtri Autocad";
    selectSwal.appendChild(option);
    outerContainer.appendChild(selectSwal);

    var inputTextSwal=document.createElement("input");
	inputTextSwal.setAttribute("type","text");
	inputTextSwal.setAttribute("id","inputTextSwal");
	inputTextSwal.setAttribute("placeholder","Codice...");
	inputTextSwal.setAttribute("class","input-text-swal");
    outerContainer.appendChild(inputTextSwal);

	Swal.fire
	({
		icon: 'question',
        width:600,
		showCloseButton:true,
		title: 'Scegli il codice e la tabella in cui vuoi creare la materia prima',
		html : outerContainer.outerHTML
	}).then((result) => 
	{
		if (result.value)
		{
			var codice_materia_prima=document.getElementById("inputTextSwal").value;
            var tabella=document.getElementById("selectSwal").value.split("|")[0];
            var colonna=document.getElementById("selectSwal").value.split("|")[1];

            Swal.fire
            ({
                title: "Caricamento in corso...",
                html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-4x"></i>',
                background:"transparent",
                showConfirmButton:false,
                showCloseButton:false,
                allowEscapeKey:false,
                allowOutsideClick:false,
                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
            });
            
			if(codice_materia_prima==null || codice_materia_prima=='')
			{
				Swal.fire
				({
					icon: 'error',
					title: 'Inserisci un codice valido',
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
				}).then((result) => 
				{
					getPopupNuovaMateriaPrima();
				});
			}
			else
			{
				$.get("creaNuovaMateriaPrima.php",{codice_materia_prima,tabella,colonna},
				function(response, status)
				{
					if(status=="success")
					{
                        var success=true;
						if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
						{
                            success=false;
							Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
							console.log(response);
						}
                        if(response.toLowerCase().indexOf("duplicato")>-1)
                        {
                            success=false;
                            Swal.fire
                            ({
                                icon:"error",
                                title: "Esiste gia una materia prima con questo codice",
                                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
                            }).then((result) => 
                            {
                                getPopupNuovaMateriaPrima();
                            });
                        }
                        if(success)
                        {
                            Swal.fire
                            ({
                                icon:"success",
                                title: "Materia prima creata",
                                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
                            }).then((result) =>
                            {
                                getTabellaMateriePrime();
                            });
                        }
					}
				});
			}
		}
		else
			getTabellaMateriePrime();
	});
}
function getPopupNuovoRaggruppamentoMateriePrime()
{
	var inputTextSwal=document.createElement("input");
	inputTextSwal.setAttribute("type","text");
	inputTextSwal.setAttribute("id","inputTextSwal");
	inputTextSwal.setAttribute("placeholder","Nome...");
	inputTextSwal.setAttribute("class","input-text-swal");
	Swal.fire
	({
		icon: 'question',
		showCloseButton:true,
		title: 'Scegli il nome del raggruppamento',
		html : inputTextSwal.outerHTML
	}).then((result) => 
	{
		if (result.value)
		{
			swal.close();
			var nome=document.getElementById("inputTextSwal").value;
			if(nome==null || nome=='')
			{
				Swal.fire
				({
					icon: 'error',
					title: 'Inserisci un nome valido',
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
				}).then((result) => 
				{
					getPopupNuovoRaggruppamentoMateriePrime();
				});
			}
			else
			{
				$.get("creaNuovoRaggruppamentoMateriePrime.php",{nome},
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
									title: "Esiste gia un raggruppamento con questo nome",
									onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
								}).then((result) => 
								{
									getPopupNuovoRaggruppamentoMateriePrime();
								});
							}
							else
							{
								getPopupRaggruppamenti();
							}
						}
					}
				});
			}
		}
		else
			getPopupRaggruppamenti();
	});
}
function aggiornaRigaHotRaggruppamentiMateriePrime(id,colonna,valore,table,primaryKey)
{
    $.get("aggiornaRigaHotRaggruppamentiMateriePrime.php",{id,colonna,valore,table,primaryKey},
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
                    document.getElementById("alertSpanRaggruppamentiMateriePrime").innerHTML="";
                if(response>1)
                    document.getElementById("alertSpanRaggruppamentiMateriePrime").innerHTML="Può essere utilizzato solo un gruppo per il calcolo del fabbisogno. <b><u>IL PROGRAMMA POTREBBE NON FUNZIONARE CORRETTAMENTE</u></b>";
                if(response==0)
                    document.getElementById("alertSpanRaggruppamentiMateriePrime").innerHTML="Almeno un gruppo deve essere utilizzato per il calcolo del fabbisogno. <b><u>IL PROGRAMMA POTREBBE NON FUNZIONARE CORRETTAMENTE</u></b>"; 
            }
        }
    });
}
function creaRigaHotRaggruppamentiMateriePrime(index,table,primaryKey)
{
    $.get("creaRigaHotRaggruppamentiMateriePrime.php",{table,primaryKey},
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
                hot3.setDataAtCell(index, 0, response);
        }
    });
}
function eliminaRigaHotRaggruppamentiMateriePrime(id,table,primaryKey)
{
    $.get("eliminaRigaHotRaggruppamentiMateriePrime.php",{id,table,primaryKey},
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
function getHotRaggruppamentiMateriePrimeData(table)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getHotRaggruppamentiMateriePrimeData.php",{table},
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
function allineaMateriePrime(popups)
{
    if(popups)
    {
        Swal.fire
        ({
            title: "Caricamento in corso...",
            html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-4x"></i>',
            background:"transparent",
            showConfirmButton:false,
            showCloseButton:false,
            allowEscapeKey:false,
            allowOutsideClick:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
        });
    }
	$.post("allineaMateriePrime.php",
	function(response, status)
	{
		if(status=="success")
		{
			if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
			{
                if(popups)
				    Swal.fire({icon:"error",title: "Errore. Impossibile allineare le anagrafiche con la produzione. Contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
				console.log(response);
			}
			else
			{
                if(popups)
				    Swal.fire({icon:"success",title: "Anagrafiche allineate con la produzione",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
			}
		}
	});
}
function aggiornaAnagraficheTxt()
{
	Swal.fire
    ({
        title: "Caricamento in corso...",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-4x"></i>',
		background:"transparent",
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });
	$.post("aggiornaAnagraficheTxt.php",
	function(response, status)
	{
		if(status=="success")
		{
			if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
			{
				Swal.fire({icon:"error",title: "Errore. Impossibile allineare le anagrafiche con la produzione. Contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
				console.log(response);
			}
			else
			{
				Swal.fire({icon:"success",title: "Anagrafiche aggiornate",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
			}
		}
	});
}