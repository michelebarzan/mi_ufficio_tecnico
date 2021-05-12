var databases;
var tabelleCheckboxesAggiornaAnagrafiche=[];
var errorMessages=[];
var hot;
var hot3;
var view;

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
	
    var check=await checkAccessoEsclusivoImportaDati();
    setTimeout(function()
    {
        if(!check)
        {
            Swal.close();
            getMascheraImportazioneDatabase(document.getElementById("btn_importazione_database"));
            insertAccessoEsclusivoImportaDati();
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
                    deleteAccessoEsclusivoImportaDati();
                    insertAccessoEsclusivoImportaDati();
                    Swal.close();
                    getMascheraImportazioneDatabase(document.getElementById("btn_importazione_database"));
                }
            })
        }
    }, 1500);
});
window.onbeforeunload = function() 
{
	deleteAccessoEsclusivoImportaDati();
};
function insertAccessoEsclusivoImportaDati()
{
    $.post("insertAccessoEsclusivoImportaDati.php",
    function(response, status)
    {
        if(status=="success")
        {
            //console.log(response);
        }
    });
}
function deleteAccessoEsclusivoImportaDati()
{
    $.post("deleteAccessoEsclusivoImportaDati.php",
    function(response, status)
    {
        if(status=="success")
        {
            //console.log(response);
        }
    });
}
function checkAccessoEsclusivoImportaDati()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("checkAccessoEsclusivoImportaDati.php",
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
function getMascheraImportazioneDatabase(button)
{
    view="importazioneDatabase";

    $(".in-page-nav-bar-button").css({"border-bottom-color":"","font-weight":""});
    button.style.borderBottomColor="#4C91CB";
    button.style.fontWeight="bold";

    var actionBar=document.getElementById("importaDatiActionBar");
    actionBar.style.display="";
    actionBar.innerHTML="";

    document.getElementById("importaDatiContainer").innerHTML="";

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("id","bntImportaSingoloDatabase");
    button.setAttribute("onclick","getPopupScegliDatabase(this)");
    button.innerHTML='<span>Importa database txt</span><i style="margin-left:10px" class="fad fa-file-upload"></i>';
    actionBar.appendChild(button);

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("id","bntImportaDatabaseSql");
    button.setAttribute("onclick","getPopupImportaDatabase(this)");
    button.innerHTML='<span>Importa database sql</span><i style="margin-left:10px" class="fad fa-database"></i>';
    actionBar.appendChild(button);

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("id","bntSvuotaDatabaseSqlUt");
	var sql_server_ip='10.128.150.60';
	var sql_server_label='Ufficio_tecnico';
	var sql_server_password='Serglo123';
	var sql_server_username='servizio_globale_sa';
    button.setAttribute("onclick","getPopupSvuotaDatabaseSql(this,'"+sql_server_label+"','"+sql_server_ip+"','"+sql_server_username+"','"+sql_server_password+"')");
    button.innerHTML='<span>Svuota database sql ufficio tecnico</span><i style="margin-left:10px" class="fad fa-eraser"></i>';
    actionBar.appendChild(button);
	
	var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("id","bntSvuotaDatabaseSqlP");
	var sql_server_ip='10.128.151.62';
	var sql_server_label='Produzione';
	var sql_server_password='Serglo123';
	var sql_server_username='sa';
    button.setAttribute("onclick","getPopupSvuotaDatabaseSql(this,'"+sql_server_label+"','"+sql_server_ip+"','"+sql_server_username+"','"+sql_server_password+"')");
    button.innerHTML='<span>Svuota database sql produzione</span><i style="margin-left:10px" class="fad fa-eraser"></i>';
    actionBar.appendChild(button);

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("id","bntAggiornaAnagrafiche");
    button.setAttribute("onclick","getPopupAggiornaAnagrafiche(this)");
    button.innerHTML='<span>Aggiorna anagrafiche</span><i style="margin-left:10px" class="fad fa-edit"></i>';
    actionBar.appendChild(button);

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("id","bntSvuotaDistinte");
    button.setAttribute("onclick","getPopupSvuotaDistinte(this)");
    button.innerHTML='<span>Svuota distinte</span><i style="margin-left:10px" class="fad fa-eraser"></i>';
    actionBar.appendChild(button);

    getElencoLogImportazioni();
}
function getMascheraGestioneAnagrafiche(button)
{
    view="gestioneAnagrafiche";

    $(".in-page-nav-bar-button").css({"border-bottom-color":"","font-weight":""});
    button.style.borderBottomColor="#4C91CB";
    button.style.fontWeight="bold";

    var actionBar=document.getElementById("importaDatiActionBar");
    actionBar.style.display="";
    actionBar.innerHTML="";

    document.getElementById("importaDatiContainer").innerHTML="";

	var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("id","bntNuovaMateriaPrima");
    button.setAttribute("onclick","getPopupNuovaMateriaPrima()");
    button.innerHTML='<span>Nuova materia prima</span><i class="fad fa-plus-circle" style="margin-left:10px"></i>';
    actionBar.appendChild(button);
	
	var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("id","btnCancellaFiltri");
    button.setAttribute("onclick","getTabellaMateriePrime()");
    button.innerHTML='<span>Cancella filtri</span><i class="fad fa-filter" style="margin-left:10px"></i>';
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
    button.setAttribute("onclick","allineaMateriePrime()");
    button.innerHTML='<span>Allinea anagrafiche produzione</span><i class="fad fa-copy" style="margin-left:10px"></i>';
    actionBar.appendChild(button);

    getTabellaMateriePrime();
}
function getMascheraGenerale(button)
{
    view="generale";

    $(".in-page-nav-bar-button").css({"border-bottom-color":"","font-weight":""});
    button.style.borderBottomColor="#4C91CB";
    button.style.fontWeight="bold";

    var actionBar=document.getElementById("importaDatiActionBar");
    actionBar.style.display="";
    actionBar.innerHTML="";

    document.getElementById("importaDatiContainer").innerHTML="";

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("id","buttonRunSPPesoQntCabine");
    button.setAttribute("onclick","getPopupSPPesoQntCabine(this)");
    button.innerHTML='<span>Ricalcola peso cabine</span><i class="fad fa-weight-hanging" style="margin-left:10px"></i>';
    actionBar.appendChild(button);
}
async function importaTutto(button)
{
    //button.disabled=true;
    var icon=button.getElementsByTagName("i")[0];
    icon.className="fad fa-spinner-third fa-spin";

    databases=["BeB","grimaldi","po00","spareti","NEWPAN"];

    Swal.fire
    ({
        title: "Importazione in corso... ("+databases.join(',')+")",
        html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });

    var response=await importaDbTecnico();

    Swal.close();
    
    checkResponseImportaDbTecnico(response);

    //button.disabled=false;
    icon.className="fad fa-upload";
}
function importaDbTecnico()
{
    $(".action-bar-text-icon-button").prop("disabled",true);
    return new Promise(function (resolve, reject) 
    {
        var JSONdatabases=JSON.stringify(databases);
        $.post("importaDbTecnico.php",
        {
            JSONdatabases
        },
        function(response, status)
        {
            if(status=="success")
            {
                $(".action-bar-text-icon-button").prop("disabled",false);
                //console.log(response);
                resolve(response);
            }
            else
                resolve("error");
        });
    });
}
function closePopupScegliDatabase()
{
    $("#selectScegliDatabase").hide(50,"swing");
}
/*async function getSelectsScegliDatabase()
{
    var selected=[]

    var options=document.getElementsByClassName("custom-select-option");
    for (let index = 0; index < options.length; index++) 
    {
        const option = options[index];
        var checked=option.getAttribute("checked")=="true";
        if(checked)
            selected.push(option.value);
    }

    closePopupScegliDatabase();

    if(selected.length==0)
    {
        Swal.fire({icon:"error",title: "Nessun database selezionato",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
    }
    else
    {
        var button=document.getElementById("bntImportaSingoloDatabase");
        //button.disabled=true;
        var icon=button.getElementsByTagName("i")[0];
        icon.className="fad fa-spinner-third fa-spin";

        databases=selected;

        Swal.fire
        ({
            title: "Importazione in corso... ("+databases.join(',')+")",
            html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
            showConfirmButton:false,
            showCloseButton:false,
            allowEscapeKey:false,
            allowOutsideClick:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
        });

        var response=await importaDbTecnico();

        Swal.close();

        checkResponseImportaDbTecnico(response);
        
        //button.disabled=false;
        icon.className="fad fa-file-upload";
    }
}*/
async function getSelectsScegliDatabase()
{
    var selected=[]

    var options=document.getElementsByClassName("custom-select-option");
    for (let index = 0; index < options.length; index++) 
    {
        const option = options[index];
        var checked=option.getAttribute("checked")=="true";
        if(checked)
            selected.push(option.value);
    }

    closePopupScegliDatabase();

    if(selected.length==0)
    {
        Swal.fire({icon:"error",title: "Nessun database selezionato",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
    }
    else
    {
        databases=selected;

        var outerContainer=document.createElement("div");
        outerContainer.setAttribute("class","importazione-mi-bd-tecnico-outer-container");
        outerContainer.setAttribute("id","importazioneMiDdTecnicoOuterContainer");

        Swal.fire
        ({
            title: "Importazione database ("+databases.join(',')+")",
            width: 550,
            position:"top",
            //html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
            html:outerContainer.outerHTML,
            showConfirmButton:false,
            showCloseButton:false,
            allowEscapeKey:false,
            allowOutsideClick:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
        });
        
        var tot_rows=0;
        var tot_time_elapsed_secs=0;
        errorMessages=[];

        switch (databases[0])
        {
            case "newpan":
				var tabelle=[{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'doghe'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'doghelm'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'doghelr'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'dogherf'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'doghex'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'pannellis'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'pesicab'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'soffitti'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'tabcolli'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'travinf'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'travsup'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'cabine'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'cabkit'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'kit'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'kitpan'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'pannelli'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBpaS'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'pannellil'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBpan'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'sviluppi'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'dibsvi'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'cesoiati'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBces'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'mater'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBldr'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'tabrinf'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBrin'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'rinfpiede'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBrinp'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'lanacer'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBlcr'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'corridoi'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'dibcor'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'carrelli'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'dibcar'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBlams'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBldrs'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBrind'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBtri'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBtrs'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'cab_colli'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'cabsof'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'dibdog'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'doghe'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'doghelm'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'doghelr'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'dogherf'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'doghex'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'pannellis'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'pesicab'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'soffitti'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'tabcolli'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'travinf'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'travsup'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'cabine'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'cabkit'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'kit'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'kitpan'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'pannelli'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBpaS'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'pannellil'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBpan'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'sviluppi'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'dibsvi'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'cesoiati'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBces'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'mater'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBldr'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'tabrinf'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBrin'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'rinfpiede'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBrinp'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'lanacer'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBlcr'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'corridoi'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'dibcor'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'carrelli'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'dibcar'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBlams'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBldrs'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBrind'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBtri'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBtrs'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'cab_colli'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'cabsof'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'dibdog'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'cavallotti'}];
            break;
            default:
				var tabelle=[{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'doghe'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'doghelm'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'doghelr'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'dogherf'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'doghex'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'pannellis'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'pesicab'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'soffitti'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'tabcolli'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'travinf'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'travsup'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'cabine'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'cabkit'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'kit'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'kitpan'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'pannelli'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBpaS'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'pannellil'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBpan'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'sviluppi'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'dibsvi'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'cesoiati'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBces'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'mater'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBldr'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'tabrinf'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBrin'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'rinfpiede'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBrinp'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'lanacer'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBlcr'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'corridoi'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'dibcor'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'carrelli'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'dibcar'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBlams'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBldrs'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBrind'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBtri'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'DIBtrs'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'cab_colli'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'cabsof'},{sql_server_ip:'10.128.150.60',sql_server_label:'Ufficio_tecnico',sql_server_password:'Serglo123',sql_server_username:'servizio_globale_sa',database:'mi_webapp',tabella:'dibdog'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'doghe'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'doghelm'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'doghelr'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'dogherf'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'doghex'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'pannellis'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'pesicab'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'soffitti'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'tabcolli'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'travinf'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'travsup'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'cabine'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'cabkit'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'kit'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'kitpan'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'pannelli'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBpaS'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'pannellil'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBpan'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'sviluppi'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'dibsvi'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'cesoiati'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBces'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'mater'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBldr'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'tabrinf'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBrin'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'rinfpiede'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBrinp'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'lanacer'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBlcr'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'corridoi'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'dibcor'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'carrelli'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'dibcar'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBlams'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBldrs'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBrind'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBtri'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'DIBtrs'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'cab_colli'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'cabsof'},{sql_server_ip:'10.128.151.62',sql_server_label:'Produzione',sql_server_password:'Serglo123',sql_server_username:'sa',database:'mi_produzione',tabella:'dibdog'}];
            break;
        }
        //var tabelle=["dibcar"];

        var result="ok";
        for (let index = 0; index < tabelle.length; index++)
        {
            const tabellaObj = tabelle[index];
			const tabella=tabellaObj.tabella;

            /*var intervalPercentualeImportazioneTxt=setInterval(() =>
            {
                $.post("checkPercentualeImportazioneTxt.php",{tabella,database:databases[0]},
                function(response, status)
                {
                    if(status=="success")
                    {
                        if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                        {
                            console.log(response);
                            document.getElementById("result_span_"+tabella).getElementsByTagName("span")[0].innerHTML="0%";
                        }
                        else
                        {
                            document.getElementById("result_span_"+tabella).getElementsByTagName("span")[0].innerHTML=parseInt(response)+"%";
                        }
                    }
                });
            }, 1000);*/

            var row=document.createElement("div");
            row.setAttribute("class","importazione-mi-bd-tecnico-row");
            row.setAttribute("id","result_row_"+tabella+"_"+tabellaObj.sql_server_label);

            var span=document.createElement("span");
            span.setAttribute("style","color:black;font-weight: bold;");
            span.innerHTML=tabella+" ("+tabellaObj.sql_server_label+")";
            row.appendChild(span);

            var span=document.createElement("div");
            span.setAttribute("style","margin-left:auto;display:flex;flex-direction:row;align-items:center;justify-content:flex-start");
            span.setAttribute("id","result_span_"+tabella+"_"+tabellaObj.sql_server_label);
            /*var progressSpan=document.createElement("span");
            progressSpan.setAttribute("style","margin-right:5px;font-family:'Montserrat',sans-serif;font-size:12px;color:black;width:50px;text-align: right;");
            progressSpan.innerHTML="0%";
            span.appendChild(progressSpan);*/
            var spinner=document.createElement("i");
            spinner.setAttribute("class","fad fa-spinner-third fa-spin");
            spinner.setAttribute("style","color:#4C91CB;font-size:14px");
            span.appendChild(spinner);
            row.appendChild(span);

            document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(row);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

            var response=await importaTabellaTxt(tabella,databases,tabellaObj.database,tabellaObj.sql_server_username,tabellaObj.sql_server_password,tabellaObj.sql_server_ip);
            console.log(response);
            
            //clearInterval(intervalPercentualeImportazioneTxt);

            if(response.length==0 || response.result=="error")
            {
                errorMessages.push("Errore generico "+tabella);

                document.getElementById("result_span_"+tabella+"_"+tabellaObj.sql_server_label).innerHTML='<i style="color:#d43f3a;font-size:14px" class="fad fa-times-circle"></i>';
                document.getElementById("result_span_"+tabella+"_"+tabellaObj.sql_server_label).style.marginLeft="5px";

                var span=document.createElement("span");
                span.setAttribute("style","margin-left:auto;font-size:12px");
                span.innerHTML="<b>0</b> righe inserite";
                document.getElementById("result_row_"+tabella+"_"+tabellaObj.sql_server_label).insertBefore(span,document.getElementById("result_span_"+tabella+"_"+tabellaObj.sql_server_label));
            }
            else
            {
                if(response.errorMessages.length>0)
                    errorMessages.push(response.errorMessages);

                if(response.result=="ok")
                    document.getElementById("result_span_"+tabella+"_"+tabellaObj.sql_server_label).innerHTML='<i style="color:#70B085;font-size:14px" class="fad fa-check-circle"></i>';
                else
                    document.getElementById("result_span_"+tabella+"_"+tabellaObj.sql_server_label).innerHTML='<i style="color:#d43f3a;font-size:14px" class="fad fa-times-circle"></i>';
                document.getElementById("result_span_"+tabella+"_"+tabellaObj.sql_server_label).style.marginLeft="5px";

                var span=document.createElement("span");
                span.setAttribute("style","margin-left:auto;font-size:12px");
                if(response.rows!=(response.rows+response.righeNonInserite-1))
                    var color="#d43f3a";
                else
                    var color="black";
                span.innerHTML="<b style='color:"+color+"'>"+response.rows+" / "+(response.rows+response.righeNonInserite-1)+"</b> righe inserite in <b>"+response.time_elapsed_secs+"</b> secondi";
                document.getElementById("result_row_"+tabella+"_"+tabellaObj.sql_server_label).insertBefore(span,document.getElementById("result_span_"+tabella+"_"+tabellaObj.sql_server_label));

                tot_rows+=response.rows;
                tot_time_elapsed_secs+=parseFloat(response.time_elapsed_secs);
            }
        }

        tot_time_elapsed_secs=tot_time_elapsed_secs.toFixed(2);

        var row=document.createElement("div");
        row.setAttribute("class","importazione-mi-bd-tecnico-row");
        row.setAttribute("id","result_row_operazioni_finali");

        var span=document.createElement("span");
        span.setAttribute("style","color:black;font-weight: bold;");
        span.setAttribute("id","result_text_operazioni_finali");
        row.appendChild(span);

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto");
        span.setAttribute("id","result_span_operazioni_finali");
        row.appendChild(span);

        document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(row);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

        document.getElementById("result_span_operazioni_finali").innerHTML='<i style="color:#70B085;font-size:14px" class="fad fa-check-circle"></i>';
        document.getElementById("result_span_operazioni_finali").style.marginLeft="5px";

        document.getElementById("result_text_operazioni_finali").innerHTML="Esito";

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto;font-size:12px;color#4C91CB");
        span.innerHTML="<b>"+tot_rows/2+"</b> righe inserite in <b>"+tot_time_elapsed_secs+"</b> secondi";
        document.getElementById("result_row_operazioni_finali").insertBefore(span,document.getElementById("result_span_operazioni_finali"));

        //console.log(errorMessages);

        var row=document.createElement("div");
        row.setAttribute("class","importazione-mi-bd-tecnico-row");
        row.setAttribute("id","result_row_error_messages");

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto");
        span.setAttribute("id","result_span_error_messages");
        row.appendChild(span);

        document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(row);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

        if(errorMessages.length==0)
                document.getElementById("result_span_error_messages").innerHTML='<i style="color:#70B085;font-size:14px" class="fad fa-check-circle"></i>';
            else
                document.getElementById("result_span_error_messages").innerHTML='<i style="color:#d43f3a;font-size:14px" class="fad fa-times-circle"></i>';
            document.getElementById("result_span_error_messages").style.marginLeft="5px";

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto;font-size:12px;color#4C91CB;text-decoration:underline;cursor:pointer");
        span.setAttribute("title","Visualizza errori");
        span.setAttribute("onclick","alertErrorMessages()");
        span.innerHTML="Errori in <b>"+errorMessages.length+"</b> tabelle";
        document.getElementById("result_row_error_messages").insertBefore(span,document.getElementById("result_span_error_messages"));

        var button=document.createElement("button");
        button.setAttribute("id","btnImportazioneMiDdTecnico");
        button.setAttribute("onclick","Swal.close()");
        button.innerHTML='<span>Chiudi</span>';

        document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(button);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

        var JSONdatabases=JSON.stringify(databases);
        $.post("inserisciLogImortazione.php",
        {
            risultato:result,
            JSONdatabases
        },
        function(response, status)
        {
            if(status=="success")
            {
                getElencoLogImportazioni();
            }
        });
    }
}
function alertErrorMessages()
{
    var errorMessagesArray=[];
    /*errorMessages.forEach(errorMessagesElement =>
    {
        errorMessagesElement.forEach(errorMessage =>
        {
            errorMessagesArray.push(errorMessage);
        });
    });*/
    errorMessages.forEach(errorMessage =>
    {
        errorMessagesArray.push(errorMessage);
    });

    var ul=document.createElement("ul");
    ul.setAttribute("style","text-align:left");

    var li=document.createElement("li");

    var b=document.createElement("b");
    b.innerHTML="Errori: "+errorMessagesArray.length;
    li.appendChild(b);

    var div=document.createElement("div");
    div.setAttribute("id","containerErroriImportazione");
    div.setAttribute("style","display:block");
    div.innerHTML="<br>"+errorMessagesArray.join('<br>')+"<br>";
    li.appendChild(div);

    ul.appendChild(li);

    Swal.fire
    ({
        icon:"warning",
        title: "Errori importazione ("+databases.join(',')+")",
        html:ul.outerHTML,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });
}
function aggiornamentiTabelleTxt(databases)
{
    return new Promise(function (resolve, reject) 
    {
        var JSONdatabases=JSON.stringify(databases);
        $.post("aggiornamentiTabelleTxt.php",
        {
            JSONdatabases
        },
        function(response, status)
        {
            if(status=="success")
            {
                try {
                    resolve(JSON.parse(response));
                } catch (error) {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
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
function getTabelleImportazioneTxt()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getTabelleImportazioneTxt.php",
        function(response, status)
        {
            if(status=="success")
            {
                try {
                    resolve(JSON.parse(response));
                } catch (error) {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
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
function importaTabellaTxt(tabella,databases,help_database,sql_server_username,sql_server_password,sql_server_ip)
{
    return new Promise(function (resolve, reject) 
    {
        var JSONdatabases=JSON.stringify(databases);
        //$.post("importaTabellaTxt.php",
        $.post("bulkInsertTabellaTxt.php",
        {
            tabella,
            JSONdatabases,
			help_database,
			sql_server_username,
			sql_server_password,
			sql_server_ip
        },
        function(response, status)
        {
            if(status=="success")
            {
                try {
                    resolve(JSON.parse(response));
                } catch (error) {
                    //Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
            }
            else
            {
                //Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
                resolve([]);
            }
        });
    });
}
function checkResponseImportaDbTecnico(response)
{
    try {
        var arrayResponse=JSON.parse(response);
        var ul=document.createElement("ul");ul.setAttribute("style","text-align:left");
        var li=document.createElement("li");
        li.innerHTML="<b>Righe inserite: </b>"+arrayResponse["righeInserite"];
        ul.appendChild(li);
        var li=document.createElement("li");
        li.innerHTML="<b>Righe non inserite: </b>"+arrayResponse["righeNonInserite"];
        ul.appendChild(li);
        var li=document.createElement("li");
        var b=document.createElement("b");
        b.innerHTML="Errori: "+arrayResponse.errorMessages.length;
        li.appendChild(b);
        if(arrayResponse.errorMessages.length>0)
        {
            var button=document.createElement("button");
            button.setAttribute("id","buttonErroriImportazione");
            button.setAttribute("onclick","showDettagliErroriImportazione()");
            button.innerHTML="Dettagli";
            li.appendChild(button);

            var div=document.createElement("div");
            div.setAttribute("id","containerErroriImportazione");
            div.innerHTML="<br>"+arrayResponse["errorMessages"].join('<br>')+"<br>";
            li.appendChild(div);
        }
        //li.innerHTML="<b>Errori: </b>"+arrayResponse.errorMessages.length+"<button id='buttonErroriImportazione' onclick='showDettagliErroriImportazione()'>Dettagli</button><div id='containerErroriImportazione'>"+arrayResponse["errorMessages"].join('<br>')+"</div>";
        ul.appendChild(li);
        var li=document.createElement("li");
        li.innerHTML="<b>Tempo impiegato</b>"+arrayResponse["time_elapsed_secs"];
        ul.appendChild(li);
        Swal.fire
        ({
            icon:"success",
            title: "Importazione completata ("+databases.join(',')+")",
            html:ul.outerHTML,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
        });
        logImortazione("ok");
    } catch (error) {
        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
        console.log(error);
        console.log(response);
        logImortazione("error");
    }
}
function showDettagliErroriImportazione()
{
    $("#containerErroriImportazione").show("fast","swing");
}
function logImortazione(risultato)
{
    var JSONdatabases=JSON.stringify(databases);
    $.post("inserisciLogImortazione.php",
    {
        risultato,
        JSONdatabases
    },
    function(response, status)
    {
        if(status=="success")
        {
            getElencoLogImportazioni();
        }
        else
            resolve("error");
    });
}
function checkOptionScegliDatabase(option)
{
    var options=document.getElementsByClassName("custom-select-option");
    for (let index = 0; index < options.length; index++)
    {
        var element = options[index];
        var checkbox_element=element.getElementsByClassName("custom-select-checkbox")[0];
        checkbox_element.setAttribute("class","custom-select-item custom-select-checkbox fal fa-square");
        element.setAttribute("checked","false");
    }

    var checked=option.getAttribute("checked")=="true";
    var checkbox=option.getElementsByClassName("custom-select-checkbox")[0];
    if(checked)
    {
        checkbox.setAttribute("class","custom-select-item custom-select-checkbox fal fa-square");
        option.setAttribute("checked","false");
    }
    else
    {
        checkbox.setAttribute("class","custom-select-item custom-select-checkbox fad fa-check-square");
        option.setAttribute("checked","true");
    }
}
function getPopupScegliDatabase(button)
{
    closePopupScegliDatabase();

    if(document.getElementById("selectScegliDatabase")==null)
    {
        var selectOuterContainer=document.createElement("div");
        selectOuterContainer.setAttribute("class","custom-select-outer-container");
        selectOuterContainer.setAttribute("id","selectScegliDatabase");

        document.body.appendChild(selectOuterContainer);

        databases=["Beb","Grimaldi","po00","Spareti","newpan"];

        databases.forEach(function(database)
        {
            var option=document.createElement("button");
            option.setAttribute("class","custom-select-item custom-select-option");
            option.setAttribute("value",database);
            option.setAttribute("checked","false");
            option.setAttribute("onclick","checkOptionScegliDatabase(this,'"+database+"')");

            var checkbox=document.createElement("i");
            checkbox.setAttribute("class","custom-select-item custom-select-checkbox fal fa-square");
            checkbox.setAttribute("value",database);
            option.appendChild(checkbox);

            var span=document.createElement("span");
            span.setAttribute("class","custom-select-item custom-select-span");
            span.innerHTML=database;
            option.appendChild(span);

            selectOuterContainer.appendChild(option);
        });
        
        var confirmButton=document.createElement("button");
        confirmButton.setAttribute("class","custom-select-item custom-select-confirm-button");
        confirmButton.setAttribute("onclick","getSelectsScegliDatabase()");
        var span=document.createElement("span");
        span.setAttribute("class","custom-select-item");
        span.innerHTML="Conferma";
        confirmButton.appendChild(span);
        var i=document.createElement("i");
        i.setAttribute("class","custom-select-item fad fa-check-double");
        confirmButton.appendChild(i);

        selectOuterContainer.appendChild(confirmButton);
    }
    
    var rect = button.getBoundingClientRect();

    var width=button.offsetWidth;
    var buttonHeight=button.offsetHeight;

    var left=rect.left;
    var top=rect.top+buttonHeight;

    $("#selectScegliDatabase").show(50,"swing");
    
    setTimeout(function(){
        $("#selectScegliDatabase").css
        ({
            "left":left+"px",
            "top":top+"px",
            "display":"flex",
            "width":width+"px"
        });
    }, 120);
}
window.addEventListener("click", windowClick, false);
function windowClick(e)
{
    try
    {
        if(e.target.id!="bntImportaSingoloDatabase" && e.target.parentElement.id!="bntImportaSingoloDatabase" && e.target.className.indexOf("custom-select-item")==-1 && e.target.className!="custom-select-outer-container")
            closePopupScegliDatabase();
        if(e.target.id!="bntAggiornaAnagrafiche" && e.target.parentElement.id!="bntAggiornaAnagrafiche" && e.target.className.indexOf("custom-select-item")==-1 && e.target.className!="custom-select-outer-container")
            closePopupAggiornaAnagrafiche();
        if(e.target.id!="bntSvuotaDistinte" && e.target.parentElement.id!="bntSvuotaDistinte" && e.target.className.indexOf("custom-select-item")==-1 && e.target.className!="custom-select-outer-container")
            closePopupSvuotaDistinte();
    }
    catch (error) {}
}
function closePopupAggiornaAnagrafiche()
{
    $("#selectAggiornaAnagrafiche").hide(50,"swing");
}
function closePopupSvuotaDistinte()
{
    $("#selectSvuotaDistinte").hide(50,"swing");
}
async function getElencoLogImportazioni()
{
    try {hot.destroy();} catch (error) {}

    document.getElementById("importaDatiContainer").style.overflowY="";

    /*var button=document.getElementById("bntLogImportazioni");
    button.getElementsByTagName("span")[0].style.color="#4C91CB";
    button.getElementsByTagName("i")[0].style.color="#4C91CB";

    document.getElementById("bntMateriePrime").getElementsByTagName("span")[0].style.color="";
    document.getElementById("bntMateriePrime").getElementsByTagName("i")[0].style.color="";*/

    var container=document.getElementById("importaDatiContainer");
    container.innerHTML="";

    var tableTitle=document.createElement("div");
    tableTitle.setAttribute("class","log-importazione-table-title");

    var i=document.createElement("i");
    i.setAttribute("class","fad fa-history");
    tableTitle.appendChild(i);
    var span=document.createElement("span");
    span.innerHTML="Log importazioni";
    tableTitle.appendChild(span);

    container.appendChild(tableTitle);

    var logImportazioni=await getLogImportazioni();

    var headers=
    [
        {
            value:"id_importazione",
            label:"#"
        },
        {
            value:"database",
            label:"Database"
        },
        {
            value:"utente",
            label:"Utente"
        },
        {
            value:"data",
            label:"Data importazione"
        },
        {
            value:"risultato",
            label:"Esito"
        },
    ];
    
    var table=document.createElement("table");
    table.setAttribute("id","logImportazioniTable");

    var thead=document.createElement("thead");
    var tr=document.createElement("tr");
    headers.forEach(function (header)
    {
        var th=document.createElement("th");
        th.setAttribute("class","logImportazioniTableCell"+header.value);
        th.innerHTML=header.label;
        tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);

    var tbody=document.createElement("tbody");
    logImportazioni.forEach(function (logImportazione)
    {
        var tr=document.createElement("tr");
        headers.forEach(function (header)
        {
            var td=document.createElement("td");
            td.setAttribute("class","logImportazioniTableCell"+header.value);
            td.innerHTML=logImportazione[header.value];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    container.appendChild(table);

    fixTable();
}
function fixTable()
{
    try {
        var tableWidth=document.getElementById("logImportazioniTable").offsetWidth-8;
        var tableColWidth=(20*tableWidth)/100;

        var tbodyHeight=document.getElementById("logImportazioniTable").offsetHeight-25;
        $("#logImportazioniTable tbody").css({"max-height":tbodyHeight+"px"});
        
        $("#logImportazioniTable th").css({"width":tableColWidth+"px"});
        $("#logImportazioniTable td").css({"width":tableColWidth+"px"});
    } catch (error) {}
}
function getLogImportazioni()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getLogImportazioni.php",
        function(response, status)
        {
            if(status=="success")
            {
                try {
                    resolve(JSON.parse(response));
                } catch (error) {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
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
function toggleCheckboxSvuotaDistinte(checked)
{
    var checkboxes=document.getElementsByClassName("importazione-mi-bd-tecnico-checkbox-svuota-distinte");
    for (let index = 0; index < checkboxes.length; index++)
    {
        const checkbox = checkboxes[index];
        checkbox.checked=checked;
        if(checked)
            checkbox.parentElement.style.display="flex";
        else
            checkbox.parentElement.style.display="none";
    }
}
function toggleCheckboxAggiornaAnagrafiche(checked)
{
    var checkboxes=document.getElementsByClassName("importazione-mi-bd-tecnico-checkbox-aggiorna-anagrafiche");
    for (let index = 0; index < checkboxes.length; index++)
    {
        const checkbox = checkboxes[index];
        checkbox.checked=checked;
        if(checked)
            checkbox.parentElement.style.display="flex";
        else
            checkbox.parentElement.style.display="none";
    }
}
async function getPopupImportaDatabase(btn)
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
	
    var distinte=['materie_prime_pannelli','materie_prime_cabine','materie_prime_kit','materie_prime_sottoinsiemi_corridoi','lane_pannelli','traversine_inferiori_kit','traversine_superiori_kit','rinforzi_piede_pannelli','rinforzi_pannelli','rinforzi_kit','lane_ceramiche_kit','pannelli_cabine','cavallotti','kit_sottoinsiemi_corridoi','kit_cabine','cabine_carrelli','pannelli_kit','lavorazioni_lamiere','lavorazioni_lana','lavorazioni_sviluppi'];
    var anagrafiche=["carrelli","sottoinsiemi_corridoi","cabine","kit","pannelli","rinforzi_piede","lamiere","sviluppi","traversine_superiori","lane_ceramiche","traversine_inferiori","rinforzi","lane","cesoiati"];

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","importazione-mi-bd-tecnico-outer-container");
    outerContainer.setAttribute("style","border:none");

    var row=document.createElement("div");
    row.setAttribute("class","importazione-mi-bd-tecnico-row");
    row.setAttribute("style","margin-left:-20px;margin-right:-20px;background-color:#ddd;width:calc(100% + 40px);border:none;padding-left:30px;padding-right:30px;");

    var span=document.createElement("span");
    span.setAttribute("style","color:black;font-weight: bold;text-decoration:underline");
    span.innerHTML="Svuota distinte";
    row.appendChild(span);

    var checkbox=document.createElement("input");
    checkbox.setAttribute("style","margin-left:auto");
    checkbox.setAttribute("onchange","toggleCheckboxSvuotaDistinte(this.checked)");
    checkbox.setAttribute("type","checkbox");
    checkbox.setAttribute("checked","checked");
    row.appendChild(checkbox);

    outerContainer.appendChild(row);

    for (let index = 0; index < distinte.length; index++)
    {
        const distinta = distinte[index];
        
        var row=document.createElement("div");
        row.setAttribute("class","importazione-mi-bd-tecnico-row");
        if(index==0)
            row.setAttribute("style","border-top: 1px solid #ddd;margin-top:20px");

        if(index == distinte.length - 1)
            row.setAttribute("style","margin-bottom:20px");
        
        var checkbox=document.createElement("input");
        checkbox.setAttribute("style","margin-right:10px");
        checkbox.setAttribute("class","importazione-mi-bd-tecnico-checkbox-svuota-distinte");
        checkbox.setAttribute("type","checkbox");
        checkbox.setAttribute("distinta",distinta);
        checkbox.setAttribute("onchange","setCookie('checked_"+distinta+"',this.checked.toString())");

        var checked=await getCookie("checked_"+distinta);
        if(checked=="true")
            checkbox.setAttribute("checked","checked");

        row.appendChild(checkbox);

        var span=document.createElement("span");
        span.setAttribute("style","color:black;font-weight: bold;");
        span.innerHTML=distinta;
        row.appendChild(span);

        outerContainer.appendChild(row);
    }

    var row=document.createElement("div");
    row.setAttribute("class","importazione-mi-bd-tecnico-row");
    row.setAttribute("style","margin-left:-20px;margin-right:-20px;background-color:#ddd;width:calc(100% + 40px);border:none;padding-left:30px;padding-right:30px;");

    var span=document.createElement("span");
    span.setAttribute("style","color:black;font-weight: bold;text-decoration:underline");
    span.innerHTML="Aggiorna anagrafiche";
    row.appendChild(span);

    var checkbox=document.createElement("input");
    checkbox.setAttribute("style","margin-left:auto");
    checkbox.setAttribute("onchange","toggleCheckboxAggiornaAnagrafiche(this.checked)");
    checkbox.setAttribute("type","checkbox");
    checkbox.setAttribute("checked","checked");
    row.appendChild(checkbox);

    outerContainer.appendChild(row);

    for (let index = 0; index < anagrafiche.length; index++)
    {
        const anagrafica = anagrafiche[index];
        
        var row=document.createElement("div");
        row.setAttribute("class","importazione-mi-bd-tecnico-row");
        if(index==0)
            row.setAttribute("style","border-top: 1px solid #ddd;margin-top:20px");
        
        var checkbox=document.createElement("input");
        checkbox.setAttribute("style","margin-right:10px");
        checkbox.setAttribute("class","importazione-mi-bd-tecnico-checkbox-aggiorna-anagrafiche");
        checkbox.setAttribute("type","checkbox");
        checkbox.setAttribute("anagrafica",anagrafica);
        checkbox.setAttribute("onchange","setCookie('checked_"+anagrafica+"',this.checked.toString())");

        var checked=await getCookie("checked_"+anagrafica);
        if(checked=="true")
            checkbox.setAttribute("checked","checked");

        row.appendChild(checkbox);

        var span=document.createElement("span");
        span.setAttribute("style","color:black;font-weight: bold;");
        span.innerHTML=anagrafica;
        row.appendChild(span);

        outerContainer.appendChild(row);
    }

    var button=document.createElement("button");
    button.setAttribute("id","btnImportazioneMiDdTecnico");
    button.setAttribute("onclick","checkSvuotaDistinte()"); 
    button.innerHTML='<span>Conferma</span>';
    outerContainer.appendChild(button);

    Swal.fire
    ({
        title: "Importazione database",
        width: 550,
        position:"top",
        //html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
        html:outerContainer.outerHTML,
        showConfirmButton:false,
        showCloseButton:true,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });
}
function checkSvuotaDistinte()
{
    var checkboxesAggiornaAnagrafiche=document.getElementsByClassName("importazione-mi-bd-tecnico-checkbox-aggiorna-anagrafiche");
    for (let index = 0; index < checkboxesAggiornaAnagrafiche.length; index++)
    {
        const checkbox = checkboxesAggiornaAnagrafiche[index];
        if(checkbox.checked)
        {
            tabelleCheckboxesAggiornaAnagrafiche.push(checkbox.getAttribute("anagrafica"));
        }
    }

    var svuota_distinte=false;
    var tabelle=[];

    var checkboxes=document.getElementsByClassName("importazione-mi-bd-tecnico-checkbox-svuota-distinte");
    for (let index = 0; index < checkboxes.length; index++)
    {
        const checkbox = checkboxes[index];
        if(checkbox.checked)
        {
            svuota_distinte=true;
            tabelle.push(checkbox.getAttribute("distinta"));
        }
    }
    if(svuota_distinte)
        svuotaDistinte(tabelle,true);
    else
        checkAggiornaAnagrafiche();
}
function checkAggiornaAnagrafiche()
{
    var aggiorna_anagrafiche=false;
    var tabelle=tabelleCheckboxesAggiornaAnagrafiche;
    if(tabelle.length>0)
        aggiorna_anagrafiche=true;

    console.log(tabelle);
    console.log(aggiorna_anagrafiche);
    if(aggiorna_anagrafiche)
        aggiornaAnagrafiche(tabelle,true);
    else
        importaDatabase();
}
async function importaDatabase()
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","importazione-mi-bd-tecnico-outer-container");
    outerContainer.setAttribute("id","importazioneMiDdTecnicoOuterContainer");

    Swal.fire
    ({
        title: "Importazione database",
        width: 550,
        position:"top",
        //html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
        html:outerContainer.outerHTML,
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });

    var tabelleMiDbTecnico=await getTabelleMiDbTecnico();
	var tabelle=[];
	for (let index = 0; index < tabelleMiDbTecnico.length; index++)
    {
        const tabella = tabelleMiDbTecnico[index];

		var tabellaObj=
		{
			sql_server_ip:'10.128.150.60',
			sql_server_label:'Ufficio_tecnico',
			sql_server_password:'Serglo123',
			sql_server_username:'servizio_globale_sa',
			tabella
		}
		tabelle.push(tabellaObj);
	}
	for (let index = 0; index < tabelleMiDbTecnico.length; index++)
    {
        const tabella = tabelleMiDbTecnico[index];

		var tabellaObj=
		{
			sql_server_ip:'10.128.151.62',
			sql_server_label:'Produzione',
			sql_server_password:'Serglo123',
			sql_server_username:'sa',
			tabella
		}
		tabelle.push(tabellaObj);
	}
	
    var tot_rows=0;
    var tot_time_elapsed_secs=0;

    for (let index = 0; index < tabelle.length; index++)
    {
        var tabellaObj = tabelle[index];
		var tabella=tabellaObj.tabella;

        var row=document.createElement("div");
        row.setAttribute("class","importazione-mi-bd-tecnico-row");
        row.setAttribute("id","result_row_"+tabella+"_"+tabellaObj.sql_server_label);

        var span=document.createElement("span");
        span.setAttribute("style","color:black;font-weight: bold;");
        span.innerHTML=tabella+" ("+tabellaObj.sql_server_label+")";
        row.appendChild(span);

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto");
        span.setAttribute("id","result_span_"+tabella+"_"+tabellaObj.sql_server_label);
        span.innerHTML='<i style="color:#4C91CB;font-size:14px" class="fad fa-spinner-third fa-spin"></i>';
        row.appendChild(span);

        document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(row);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

        var response=await importaTabella(tabella,tabellaObj.sql_server_ip,tabellaObj.sql_server_password,tabellaObj.sql_server_username);
        console.log(response);

        if(response.result=="ok")
            document.getElementById("result_span_"+tabella+"_"+tabellaObj.sql_server_label).innerHTML='<i style="color:#70B085;font-size:14px" class="fad fa-check-circle"></i>';
        else
            document.getElementById("result_span_"+tabella+"_"+tabellaObj.sql_server_label).innerHTML='<i style="color:#d43f3a;font-size:14px" class="fad fa-times-circle"></i>';
        document.getElementById("result_span_"+tabella+"_"+tabellaObj.sql_server_label).style.marginLeft="5px";

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto;font-size:12px");
        span.innerHTML="<b>"+response.rows+"</b> righe inserite in <b>"+response.time_elapsed_secs+"</b> secondi";
        document.getElementById("result_row_"+tabella+"_"+tabellaObj.sql_server_label).insertBefore(span,document.getElementById("result_span_"+tabella+"_"+tabellaObj.sql_server_label));

        tot_rows+=response.rows;
        tot_time_elapsed_secs+=parseFloat(response.time_elapsed_secs);
    }

    tot_time_elapsed_secs=tot_time_elapsed_secs.toFixed(2);

    var row=document.createElement("div");
    row.setAttribute("class","importazione-mi-bd-tecnico-row");
    row.setAttribute("id","result_row_operazioni_finali");

    var span=document.createElement("span");
    span.setAttribute("style","color:black;font-weight: bold;");
    span.setAttribute("id","result_text_operazioni_finali");
    span.innerHTML="Operazioni finali";
    row.appendChild(span);

    var span=document.createElement("span");
    span.setAttribute("style","margin-left:auto");
    span.setAttribute("id","result_span_operazioni_finali");
    span.innerHTML='<i style="color:#4C91CB;font-size:14px" class="fad fa-spinner-third fa-spin"></i>';
    row.appendChild(span);

    document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(row);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

    var response=await cleanColonnaImportazione();
    console.log(response);

    document.getElementById("result_span_operazioni_finali").innerHTML='<i style="color:#70B085;font-size:14px" class="fad fa-check-circle"></i>';
    document.getElementById("result_span_operazioni_finali").style.marginLeft="5px";

    document.getElementById("result_text_operazioni_finali").innerHTML="Esito";

    var span=document.createElement("span");
    span.setAttribute("style","margin-left:auto;font-size:12px;color#4C91CB");
    span.innerHTML="<b>"+tot_rows/2+"</b> righe inserite in <b>"+tot_time_elapsed_secs+"</b> secondi";
    document.getElementById("result_row_operazioni_finali").insertBefore(span,document.getElementById("result_span_operazioni_finali"));

    var button=document.createElement("button");
    button.setAttribute("id","btnImportazioneMiDdTecnico");
    button.setAttribute("onclick","Swal.close()");
    button.innerHTML='<span>Chiudi</span>';

    document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(button);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

    var JSONdatabases=JSON.stringify(["db_tecnico"]);
    $.post("inserisciLogImortazione.php",
    {
        risultato:"ok",
        JSONdatabases
    },
    function(response, status)
    {
        if(status=="success")
        {
            getElencoLogImportazioni();
        }
    });
}
function cleanColonnaImportazione()
{
    return new Promise(function (resolve, reject) 
    {
        $.post("cleanColonnaImportazione.php",
        function(response, status)
        {
            if(status=="success")
            {
                try {
                    resolve(JSON.parse(response));
                } catch (error) {
                    Swal.fire({icon:"error",title: "Errore. Impossibile ripristinare lo stato di importazione. Contatta l'amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
            }
            else
            {
                Swal.fire({icon:"error",title: "Errore. Impossibile ripristinare lo stato di importazione. Contatta l'amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
                resolve([]);
            }
        });
    });
}
function importaTabella(tabella,sql_server_ip,sql_server_password,sql_server_username)
{
    return new Promise(function (resolve, reject) 
    {
        $.post("importaTabellaMiDdTecnico.php",
        {
            tabella,sql_server_ip,sql_server_password,sql_server_username
        },
        function(response, status)
        {
            if(status=="success")
            {
                try {
                    resolve(JSON.parse(response));
                } catch (error) {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
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
function getTabelleMiDbTecnico()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getTabelleMiDbTecnico.php",
        function(response, status)
        {
            if(status=="success")
            {
                try {
                    resolve(JSON.parse(response));
                } catch (error) {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
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
function getPopupAggiornaAnagrafiche(button)
{
    closePopupAggiornaAnagrafiche();

    if(document.getElementById("selectAggiornaAnagrafiche")==null)
    {
        var selectOuterContainer=document.createElement("div");
        selectOuterContainer.setAttribute("class","custom-select-outer-container");
        selectOuterContainer.setAttribute("id","selectAggiornaAnagrafiche");

        document.body.appendChild(selectOuterContainer);

        anagrafiche=["carrelli","sottoinsiemi_corridoi","cabine","kit","pannelli","rinforzi_piede","lamiere","sviluppi","traversine_superiori","lane_ceramiche","traversine_inferiori","rinforzi","lane","cesoiati"];

        anagrafiche.forEach(function(anagrafica)
        {
            var option=document.createElement("button");
            option.setAttribute("class","custom-select-item custom-select-option");
            option.setAttribute("value",anagrafica);
            option.setAttribute("checked","false");
            option.setAttribute("onclick","checkOptionAggiornaAnagrafiche(this,'"+anagrafica+"')");

            var checkbox=document.createElement("i");
            checkbox.setAttribute("class","custom-select-item custom-select-checkbox fal fa-square");
            checkbox.setAttribute("value",anagrafica);
            option.appendChild(checkbox);

            var span=document.createElement("span");
            span.setAttribute("class","custom-select-item custom-select-span");
            span.innerHTML=anagrafica;
            option.appendChild(span);

            selectOuterContainer.appendChild(option);
        });
        
        var confirmButton=document.createElement("button");
        confirmButton.setAttribute("class","custom-select-item custom-select-confirm-button");
        confirmButton.setAttribute("onclick","getSelectsAggiornaAnagrafiche()");
        var span=document.createElement("span");
        span.setAttribute("class","custom-select-item");
        span.innerHTML="Conferma";
        confirmButton.appendChild(span);
        var i=document.createElement("i");
        i.setAttribute("class","custom-select-item fad fa-check-double");
        confirmButton.appendChild(i);

        selectOuterContainer.appendChild(confirmButton);
    }
    
    var rect = button.getBoundingClientRect();

    var width=button.offsetWidth;
    var buttonHeight=button.offsetHeight;

    var left=rect.left;
    var top=rect.top+buttonHeight;

    $("#selectAggiornaAnagrafiche").show(50,"swing");
    
    setTimeout(function(){
        $("#selectAggiornaAnagrafiche").css
        ({
            "left":left+"px",
            "top":top+"px",
            "display":"flex",
            "width":width+"px"
        });
    }, 120);
}
async function getSelectsAggiornaAnagrafiche()
{
    var selected=[]

    var options=document.getElementsByClassName("custom-select-option");
    for (let index = 0; index < options.length; index++) 
    {
        const option = options[index];
        var checked=option.getAttribute("checked")=="true";
        if(checked)
            selected.push(option.value);
    }

    closePopupAggiornaAnagrafiche();

    if(selected.length==0)
    {
        Swal.fire({icon:"error",title: "Nessuna tabella selezionata",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
    }
    else
    {
        tabelle=selected;
        aggiornaAnagrafiche(tabelle,false);
    }
    
}
async function aggiornaAnagrafiche(tabelleAggiornaAnagrafiche,run_importazione)
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","importazione-mi-bd-tecnico-outer-container");
    outerContainer.setAttribute("id","importazioneMiDdTecnicoOuterContainer");

    Swal.fire
    ({
        title: "Aggiornamento anagrafiche",
        width: 550,
        position:"top",
        //html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
        html:outerContainer.outerHTML,
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });
	
	var tabelle=[];
	for (let index = 0; index < tabelleAggiornaAnagrafiche.length; index++)
    {
        const tabella = tabelleAggiornaAnagrafiche[index];

		var tabellaObj=
		{
			sql_server_ip:'10.128.150.60',
			sql_server_label:'Ufficio_tecnico',
			sql_server_password:'Serglo123',
			sql_server_username:'servizio_globale_sa',
			tabella
		}
		tabelle.push(tabellaObj);
	}
	for (let index = 0; index < tabelleAggiornaAnagrafiche.length; index++)
    {
        const tabella = tabelleAggiornaAnagrafiche[index];

		var tabellaObj=
		{
			sql_server_ip:'10.128.151.62',
			sql_server_label:'Produzione',
			sql_server_password:'Serglo123',
			sql_server_username:'sa',
			tabella
		}
		tabelle.push(tabellaObj);
	}

    var tot_rows=0;
    var tot_time_elapsed_secs=0;

    for (let index = 0; index < tabelle.length; index++)
    {
        const tabellaObj = tabelle[index];
		var tabella=tabellaObj.tabella;

        var row=document.createElement("div");
        row.setAttribute("class","importazione-mi-bd-tecnico-row");
        row.setAttribute("id","result_row_"+tabella+"_"+tabellaObj.sql_server_label);

        var span=document.createElement("span");
        span.setAttribute("style","color:black;font-weight: bold;");
        span.innerHTML=tabella +" ("+tabellaObj.sql_server_label+")";
        row.appendChild(span);

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto");
        span.setAttribute("id","result_span_"+tabella+"_"+tabellaObj.sql_server_label);
        span.innerHTML='<i style="color:#4C91CB;font-size:14px" class="fad fa-spinner-third fa-spin"></i>';
        row.appendChild(span);

        document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(row);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

        var response=await aggiornaAnagrafica(tabella,tabellaObj.sql_server_username,tabellaObj.sql_server_password,tabellaObj.sql_server_ip);
        console.log(response);

        if(response.result=="ok")
            document.getElementById("result_span_"+tabella+"_"+tabellaObj.sql_server_label).innerHTML='<i style="color:#70B085;font-size:14px" class="fad fa-check-circle"></i>';
        else
            document.getElementById("result_span_"+tabella+"_"+tabellaObj.sql_server_label).innerHTML='<i style="color:#d43f3a;font-size:14px" class="fad fa-times-circle"></i>';
        document.getElementById("result_span_"+tabella+"_"+tabellaObj.sql_server_label).style.marginLeft="5px";

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto;font-size:12px");
        span.innerHTML="<b>"+response.rows+"</b> righe aggiornate in <b>"+response.time_elapsed_secs+"</b> secondi";
        document.getElementById("result_row_"+tabella+"_"+tabellaObj.sql_server_label).insertBefore(span,document.getElementById("result_span_"+tabella+"_"+tabellaObj.sql_server_label));

        tot_rows+=response.rows;
        tot_time_elapsed_secs+=parseFloat(response.time_elapsed_secs);
    }

    tot_time_elapsed_secs=tot_time_elapsed_secs.toFixed(2);

    var row=document.createElement("div");
    row.setAttribute("class","importazione-mi-bd-tecnico-row");
    row.setAttribute("id","result_row_operazioni_finali");

    var span=document.createElement("span");
    span.setAttribute("style","color:black;font-weight: bold;");
    span.setAttribute("id","result_text_operazioni_finali");
    row.appendChild(span);

    var span=document.createElement("span");
    span.setAttribute("style","margin-left:auto");
    span.setAttribute("id","result_span_operazioni_finali");
    row.appendChild(span);

    document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(row);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

    document.getElementById("result_span_operazioni_finali").innerHTML='<i style="color:#70B085;font-size:14px" class="fad fa-check-circle"></i>';
    document.getElementById("result_span_operazioni_finali").style.marginLeft="5px";

    document.getElementById("result_text_operazioni_finali").innerHTML="Esito";

    var span=document.createElement("span");
    span.setAttribute("style","margin-left:auto;font-size:12px;color#4C91CB");
    span.innerHTML="<b>"+tot_rows+"</b> righe aggiornate in <b>"+tot_time_elapsed_secs+"</b> secondi";
    document.getElementById("result_row_operazioni_finali").insertBefore(span,document.getElementById("result_span_operazioni_finali"));

    var button=document.createElement("button");
    button.setAttribute("id","btnImportazioneMiDdTecnico");

    if(run_importazione)
    {
        button.setAttribute("onclick","importaDatabase()");
        button.innerHTML='<span>Prosegui</span>';
    }
    else
    {
        button.setAttribute("onclick","Swal.close()");
        button.innerHTML='<span>Chiudi</span>';
    }

    document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(button);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;
}
function aggiornaAnagrafica(tabella,sql_server_username,sql_server_password,sql_server_ip)
{
    return new Promise(function (resolve, reject) 
    {
        $.post("aggiornaAnagraficaMiDdTecnico.php",
        {
            tabella,sql_server_username,sql_server_password,sql_server_ip
        },
        function(response, status)
        {
            if(status=="success")
            {
                try {
                    resolve(JSON.parse(response));
                } catch (error) {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
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
function checkOptionAggiornaAnagrafiche(option)
{
    var checked=option.getAttribute("checked")=="true";
    var checkbox=option.getElementsByClassName("custom-select-checkbox")[0];
    if(checked)
    {
        checkbox.setAttribute("class","custom-select-item custom-select-checkbox fal fa-square");
        option.setAttribute("checked","false");
    }
    else
    {
        checkbox.setAttribute("class","custom-select-item custom-select-checkbox fad fa-check-square");
        option.setAttribute("checked","true");
    }
}
function getPopupSvuotaDistinte(button)
{
    closePopupSvuotaDistinte();

    if(document.getElementById("selectSvuotaDistinte")==null)
    {
        var selectOuterContainer=document.createElement("div");
        selectOuterContainer.setAttribute("class","custom-select-outer-container");
        selectOuterContainer.setAttribute("id","selectSvuotaDistinte");

        document.body.appendChild(selectOuterContainer);

        var distinte=['materie_prime_pannelli','materie_prime_cabine','materie_prime_kit','materie_prime_sottoinsiemi_corridoi','lane_pannelli','traversine_inferiori_kit','traversine_superiori_kit','rinforzi_piede_pannelli','rinforzi_pannelli','rinforzi_kit','lane_ceramiche_kit','pannelli_cabine','cavallotti','kit_sottoinsiemi_corridoi','kit_cabine','cabine_carrelli','pannelli_kit','lavorazioni_lamiere','lavorazioni_lana','lavorazioni_sviluppi'];

        distinte.forEach(function(distinta)
        {
            var option=document.createElement("button");
            option.setAttribute("class","custom-select-item custom-select-option");
            option.setAttribute("value",distinta);
            option.setAttribute("checked","false");
            option.setAttribute("onclick","checkOptionSvuotaDistinte(this,'"+distinta+"')");

            var checkbox=document.createElement("i");
            checkbox.setAttribute("class","custom-select-item custom-select-checkbox fal fa-square");
            checkbox.setAttribute("value",distinta);
            option.appendChild(checkbox);

            var span=document.createElement("span");
            span.setAttribute("class","custom-select-item custom-select-span");
            span.innerHTML=distinta;
            option.appendChild(span);

            selectOuterContainer.appendChild(option);
        });
        
        var confirmButton=document.createElement("button");
        confirmButton.setAttribute("class","custom-select-item custom-select-confirm-button");
        confirmButton.setAttribute("onclick","getSelectsSvuotaDistinte()");
        var span=document.createElement("span");
        span.setAttribute("class","custom-select-item");
        span.innerHTML="Conferma";
        confirmButton.appendChild(span);
        var i=document.createElement("i");
        i.setAttribute("class","custom-select-item fad fa-check-double");
        confirmButton.appendChild(i);

        selectOuterContainer.appendChild(confirmButton);
    }
    
    var rect = button.getBoundingClientRect();

    var width=button.offsetWidth;
    var buttonHeight=button.offsetHeight;

    var left=rect.left;
    var top=rect.top+buttonHeight;

    $("#selectSvuotaDistinte").show(50,"swing");
    
    setTimeout(function(){
        $("#selectSvuotaDistinte").css
        ({
            "left":left+"px",
            "top":top+"px",
            "display":"flex",
            "width":"auto"
        });
    }, 120);
}
async function getSelectsSvuotaDistinte()
{
    var selected=[]

    var options=document.getElementsByClassName("custom-select-option");
    for (let index = 0; index < options.length; index++) 
    {
        const option = options[index];
        var checked=option.getAttribute("checked")=="true";
        if(checked)
            selected.push(option.value);
    }

    closePopupSvuotaDistinte();

    if(selected.length==0)
    {
        Swal.fire({icon:"error",title: "Nessuna tabella selezionata",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
    }
    else
    {
        tabelle=selected;
        svuotaDistinte(tabelle,false);
    }
    
}
async function svuotaDistinte(tabelle,run_importazione)
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","importazione-mi-bd-tecnico-outer-container");
    outerContainer.setAttribute("id","importazioneMiDdTecnicoOuterContainer");

    Swal.fire
    ({
        title: "Svuota distinte",
        width: 550,
        position:"top",
        //html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
        html:outerContainer.outerHTML,
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });

    var tot_rows=0;
    var tot_time_elapsed_secs=0;

    var anagrafiche=[];

    for (let index = 0; index < tabelle.length; index++)
    {
        const tabella = tabelle[index];

        //['','','','','','','','','','','','','',''];
        
        if(tabella=="materie_prime_pannelli" || tabella=="rinforzi_piede_pannelli" || tabella=="lane_pannelli" || tabella=="rinforzi_pannelli")
            anagrafiche.push("pannelli");
        if(tabella=="pannelli_cabine" || tabella=="materie_prime_cabine" || tabella=="kit_cabine")
            anagrafiche.push("cabine");
        if(tabella=="materie_prime_kit" || tabella=="traversine_inferiori_kit" || tabella=="rinforzi_kit" || tabella=="traversine_superiori_kit" || tabella=="pannelli_kit" || tabella=="lane_ceramiche_kit")
            anagrafiche.push("kit");
        if(tabella=="materie_prime_sottoinsiemi_corridoi" || tabella=="kit_sottoinsiemi_corridoi")
            anagrafiche.push("sottoinsiemi_corridoi");
        if(tabella=="cabine_carrelli")
            anagrafiche.push("carrelli");

        var row=document.createElement("div");
        row.setAttribute("class","importazione-mi-bd-tecnico-row");
        row.setAttribute("id","result_row_"+tabella);

        var span=document.createElement("span");
        span.setAttribute("style","color:black;font-weight: bold;");
        span.innerHTML=tabella;
        row.appendChild(span);

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto");
        span.setAttribute("id","result_span_"+tabella);
        span.innerHTML='<i style="color:#4C91CB;font-size:14px" class="fad fa-spinner-third fa-spin"></i>';
        row.appendChild(span);

        document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(row);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

        var response=await svuotaDistinta(tabella);
        console.log(response);

        if(response.result=="ok")
            document.getElementById("result_span_"+tabella).innerHTML='<i style="color:#70B085;font-size:14px" class="fad fa-check-circle"></i>';
        else
            document.getElementById("result_span_"+tabella).innerHTML='<i style="color:#d43f3a;font-size:14px" class="fad fa-times-circle"></i>';
        document.getElementById("result_span_"+tabella).style.marginLeft="5px";

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto;font-size:12px");
        span.innerHTML="<b>"+response.rows+"</b> righe eliminate in <b>"+response.time_elapsed_secs+"</b> secondi";
        document.getElementById("result_row_"+tabella).insertBefore(span,document.getElementById("result_span_"+tabella));

        tot_rows+=response.rows;
        tot_time_elapsed_secs+=parseFloat(response.time_elapsed_secs);
    }

    var uniqueAnagrafiche = [];
    $.each(anagrafiche, function(i, el){
        if($.inArray(el, uniqueAnagrafiche) === -1) uniqueAnagrafiche.push(el);
    });
    var response=await updateColonnaImportazione(uniqueAnagrafiche);
    console.log(response);

    tot_time_elapsed_secs=tot_time_elapsed_secs.toFixed(2);

    var row=document.createElement("div");
    row.setAttribute("class","importazione-mi-bd-tecnico-row");
    row.setAttribute("id","result_row_operazioni_finali");

    var span=document.createElement("span");
    span.setAttribute("style","color:black;font-weight: bold;");
    span.setAttribute("id","result_text_operazioni_finali");
    row.appendChild(span);

    var span=document.createElement("span");
    span.setAttribute("style","margin-left:auto");
    span.setAttribute("id","result_span_operazioni_finali");
    row.appendChild(span);

    document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(row);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

    document.getElementById("result_span_operazioni_finali").innerHTML='<i style="color:#70B085;font-size:14px" class="fad fa-check-circle"></i>';
    document.getElementById("result_span_operazioni_finali").style.marginLeft="5px";

    document.getElementById("result_text_operazioni_finali").innerHTML="Esito";

    var span=document.createElement("span");
    span.setAttribute("style","margin-left:auto;font-size:12px;color#4C91CB");
    span.innerHTML="<b>"+tot_rows+"</b> righe eliminate in <b>"+tot_time_elapsed_secs+"</b> secondi";
    document.getElementById("result_row_operazioni_finali").insertBefore(span,document.getElementById("result_span_operazioni_finali"));

    var button=document.createElement("button");
    button.setAttribute("id","btnImportazioneMiDdTecnico");

    if(run_importazione)
    {
        button.setAttribute("onclick","checkAggiornaAnagrafiche()");
        button.innerHTML='<span>Prosegui</span>';
    }
    else
    {
        button.setAttribute("onclick","Swal.close()");
        button.innerHTML='<span>Chiudi</span>';
    }

    document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(button);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;
}
function updateColonnaImportazione(anagrafiche)
{
    return new Promise(function (resolve, reject) 
    {
        var JSONanagrafiche=JSON.stringify(anagrafiche);
        $.post("updateColonnaImportazione.php",
        {
            JSONanagrafiche
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
function svuotaDistinta(tabella)
{
    return new Promise(function (resolve, reject) 
    {
        $.post("svuotaDistintaMiDdTecnico.php",
        {
            tabella
        },
        function(response, status)
        {
            if(status=="success")
            {
                try {
                    resolve(JSON.parse(response));
                } catch (error) {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
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
function checkOptionSvuotaDistinte(option)
{
    var checked=option.getAttribute("checked")=="true";
    var checkbox=option.getElementsByClassName("custom-select-checkbox")[0];
    if(checked)
    {
        checkbox.setAttribute("class","custom-select-item custom-select-checkbox fal fa-square");
        option.setAttribute("checked","false");
    }
    else
    {
        checkbox.setAttribute("class","custom-select-item custom-select-checkbox fad fa-check-square");
        option.setAttribute("checked","true");
    }
}
async function getTabellaMateriePrime()
{
    /*document.getElementById("bntLogImportazioni").getElementsByTagName("span")[0].style.color="";
    document.getElementById("bntLogImportazioni").getElementsByTagName("i")[0].style.color="";

    button.getElementsByTagName("span")[0].style.color="#4C91CB";
    button.getElementsByTagName("i")[0].style.color="#4C91CB";*/

    document.getElementById("importaDatiContainer").style.width="calc(100% - 100px)";
    document.getElementById("importaDatiContainer").style.maxWidth="calc(100% - 100px)";
    document.getElementById("importaDatiContainer").style.minWidth="calc(100% - 100px)";
    document.getElementById("importaDatiContainer").style.padding="0px";
    document.getElementById("importaDatiContainer").style.marginLeft="50px";
    document.getElementById("importaDatiContainer").style.marginRight="50px";

    //document.getElementById("importaDatiContainer").style.paddingRight="15px";

    var container = document.getElementById('importaDatiContainer');
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
                contextMenu: true,
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
                            if(prop!="id_materia_prima" && prop!="codice_materia_prima")
                            {
                                var id_materia_prima=hot.getDataAtCell(row, 0);
                                aggiornaRigaMateriePrime(id_materia_prima,prop,newValue,oldValue);
								//allineaMateriePrime();
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
                        });
                    }
                },
				beforeCreateRow:() =>
				{
					getPopupNuovaMateriaPrima();
					return false;
				},
                beforeRemoveRow: (index,amount,physicalRows,source)  =>
                {
                    for (let i = 0; i < physicalRows.length; i++)
                    {
                        const indice = physicalRows[i];
                        var id_materia_prima=hot.getDataAtCell(indice, 0);
                        eliminaRigaMateriePrime(id_materia_prima);
						//allineaMateriePrime();
                    }
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
    $.get("aggiornaRigaMateriePrime.php",{id_materia_prima,colonna,valore,oldValue},
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
function eliminaRigaMateriePrime(id_materia_prima)
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
}
function getMateriePrime()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getMateriePrimeHot.php",
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
function getTable(table,orderBy,orderType)
{
    getEditableTable
    ({
        table,
        primaryKey: "id_materia_prima",
        editable: true,
        container:'importaDatiContainer',
        noFilterColumns:['descrizione','um'],
        orderBy:orderBy,
        orderType:orderType,
        readOnlyColumns:["id_materia_prima"]
    });
}
function editableTableLoad()
{

}
function getPopupSvuotaDatabaseTxt(button)
{
	Swal.fire
	({
		icon: 'warning',
		title: "Vuoi svuotare tutti i database txt?",
		width:550,
		showCancelButton: true,
		showConfirmButton: true,
		cancelButtonText: `Annulla`,
		confirmButtonText: `Elimina`,
		onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-confirm")[0].style.fontSize="14px";document.getElementsByClassName("swal2-cancel")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
	}).then((result) =>
	{
		if (result.value)
		{
			button.disabled=true;
			var icon=button.getElementsByTagName("i")[0];
			icon.className="fad fa-spinner-third fa-spin";

			Swal.fire
			({
				title: "Eliminazione in corso...",
				html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
				showConfirmButton:false,
				showCloseButton:false,
				allowEscapeKey:false,
				allowOutsideClick:false,
				onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
			});

			$.post("svuotaDatabaseTxt.php",
			function(response, status)
			{
				if(status=="success")
				{
					if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
					{
						Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}});
						console.log(response);
					}
					else
					{
						Swal.fire
						({
							icon:"success",
							showConfirmButton:false,
							showCloseButton:true,
							title: "Database txt svuotati",
							onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
						});
					}
				}
			});

			button.disabled=false;
			icon.className="fad fa-eraser";
		}
	});
}
function getPopupSvuotaDatabaseSql(button,sql_server_label,sql_server_ip,sql_server_username,sql_server_password)
{
	Swal.fire
	({
		icon: 'warning',
		title: "Vuoi svuotare il database sql ("+sql_server_label+")?",
		width:550,
		showCancelButton: true,
		showConfirmButton: true,
		cancelButtonText: `Annulla`,
		confirmButtonText: `Elimina`,
		onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-confirm")[0].style.fontSize="14px";document.getElementsByClassName("swal2-cancel")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
	}).then((result) =>
	{
		if (result.value)
		{
			button.disabled=true;
			var icon=button.getElementsByTagName("i")[0];
			icon.className="fad fa-spinner-third fa-spin";

			Swal.fire
			({
				title: "Eliminazione in corso...",
				html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
				showConfirmButton:false,
				showCloseButton:false,
				allowEscapeKey:false,
				allowOutsideClick:false,
				onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
			});

			$.post("svuotaDatabaseSql.php",
			{sql_server_ip,sql_server_username,sql_server_password},
			function(response, status)
			{
				if(status=="success")
				{
					if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
					{
						Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}});
						console.log(response);
					}
					else
					{
						Swal.fire
						({
							icon:"success",
							showConfirmButton:false,
							showCloseButton:true,
							title: "Database sql svuotato",
							onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
						});
					}
				}
			});

			button.disabled=false;
			icon.className="fad fa-eraser";
		}
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
								//allineaMateriePrime();
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
						//allineaMateriePrime();
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
        document.getElementById("hot-display-license-info").remove();
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
function getPopupNuovaMateriaPrima()
{
	var inputTextSwal=document.createElement("input");
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
					title: 'Inserisci un codice valido'
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
								//allineaMateriePrime();
							}
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
					title: 'Inserisci un nome valido'
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
								//allineaMateriePrime();
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
async function getPopupSPPesoQntCabine()
{
    var data=await getDataSPPesoQntCabine();
	Swal.fire
	({
		icon: 'warning',
		title: "Vuoi ricalcolare il peso delle cabine? La procedura può impiegare fino a 10 minuti. Gli utenti collegati portebbero riscontrare problemi",
        html:"Ultimo aggiornamento: <b>"+data+"</b>",
		width:550,
		showCancelButton: true,
		showConfirmButton: true,
		cancelButtonText: `Annulla`,
		confirmButtonText: `Conferma`,
		onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-confirm")[0].style.fontSize="14px";document.getElementsByClassName("swal2-cancel")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
	}).then((result) =>
	{
		if (result.value)
		{
			Swal.fire
			({
				title: "Aggiornamento in corso...",
				html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
				showConfirmButton:false,
				showCloseButton:false,
				allowEscapeKey:false,
				allowOutsideClick:false,
				onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
			});

			$.post("runSPPesoQntCabine.php",
			function(response, status)
			{
				if(status=="success")
				{
					if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
					{
						Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}});
						console.log(response);
					}
					else
					{
						Swal.fire
						({
							icon:"success",
							showConfirmButton:false,
							showCloseButton:true,
							title: "Peso cabine ricalcolato",
							onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
						});
					}
				}
			});
		}
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
function allineaMateriePrime()
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
	$.post("allineaMateriePrime.php",
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