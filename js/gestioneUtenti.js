
var orderBy='username ASC';
var utenti;
var oldSearchBarValue;

window.addEventListener("load", async function(event)
{
    mi_webapp_params=await getMiWebappParams();
    getElencoUtenti();

});
function toggleOrderIcon(button)
{
    if(orderBy=="username ASC")
    {
        orderBy='username DESC';
        getElencoUtenti();
        var icon=button.getElementsByClassName("fal")[0];
        icon.className="fal fa-sort-alpha-down-alt";
    }
    else
    {
        orderBy='username ASC';
        getElencoUtenti();
        var icon=button.getElementsByClassName("fal")[0];
        icon.className="fal fa-sort-alpha-down";
    }    
}
async function getElencoUtenti()
{
    var container=document.getElementById("containerGestioneUtenti");
    container.innerHTML="";

    //getSystemToast("<i class='fad fa-spinner-third fa-spin'></i><span>Caricamento in corso...</span>");  

    utenti=await getUtenti();
    //console.log(utenti);

    let i=0;
    utenti.forEach(utente => 
    {
        var outerContainer=document.createElement("div");
        outerContainer.setAttribute("class","gestione-utenti-item-outer-container");
        if(i==utenti.length-1)
            outerContainer.setAttribute("style","border-bottom: 0.5px solid transparent;");
        else
            outerContainer.setAttribute("style","border-bottom: 0.5px solid #ccc;");

        var button=document.createElement("button");
        button.setAttribute("class","gestione-utenti-item-button");
        var JSONutente=JSON.stringify(utente);
        //button.setAttribute("onlongtouch","popupAnagraficaUtente("+utente.id_utente+")");
        button.setAttribute("onclick","popupAzioniUtenti("+utente.id_utente+",'"+utente.username+"','"+utente.eliminato+"')");
        
        /*var img=document.createElement("img");
        img.setAttribute("onerror","javascript:userImgError(this,'"+utente.nome+"','"+utente.cognome+"')");
        img.setAttribute("src","http://remote.oasisgroup.it/oasisusersimages/"+utente.username+".png");
        button.appendChild(img);*/

        var div=document.createElement("div");
        div.setAttribute("class","user-img-error");
        div.innerHTML="<span>"+utente.nome.charAt(0)+"</span><span>"+utente.cognome.charAt(0)+"</span>";

        button.appendChild(div);

        var span=document.createElement("span");
        span.setAttribute("class","gestione-utenti-item-button-span");
        span.setAttribute("style","color:black");
        span.innerHTML=utente.username;
        button.appendChild(span);

        var span=document.createElement("span");
        span.setAttribute("class","gestione-utenti-item-button-span");
        span.setAttribute("style","color:gray;margin-left:auto");
        span.innerHTML="#"+utente.id_utente;
        button.appendChild(span);

        var icon=document.createElement("i");
        icon.setAttribute("class","fal fa-ellipsis-v");
        button.appendChild(icon);

        outerContainer.appendChild(button);

        container.appendChild(outerContainer);

        i++;
    });
    //removeSystemToast();
}
function popupAzioniUtenti(id_utente,username,eliminato)
{
    //var utente=JSON.parse(onlongtouchArguments[0]);
    /*var id_utente=onlongtouchArguments[0];
    var username=onlongtouchArguments[1];
    var eliminato=onlongtouchArguments[2];*/

    var utente=getFirstObjByPropValue(utenti,"id_utente",id_utente);
    var JSONutente=JSON.stringify(utente);

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","popup-utenti-outer-container");
    outerContainer.setAttribute("style","margin-top:0px");

    var row=document.createElement("div");
    row.setAttribute("class","popup-utenti-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:center;flex-direction:column;");

    var anagraficaButton=document.createElement("button");
    anagraficaButton.setAttribute("class","popup-utenti-button");
    anagraficaButton.setAttribute("style","width:100%;margin-top:10px");
    anagraficaButton.setAttribute("onclick","popupAnagraficaUtente("+utente.id_utente+")");
    anagraficaButton.innerHTML='<span>Anagrafica utente</span><i class="fal fa-user-edit"></i>';
    row.appendChild(anagraficaButton);

    var passwordButton=document.createElement("button");
    passwordButton.setAttribute("class","popup-utenti-button");
    passwordButton.setAttribute("style","width:100%;margin-top:10px");
    passwordButton.setAttribute("onclick","popupPasswordUtente('"+JSONutente+"')");
    passwordButton.innerHTML='<span>Reimposta password</span><i class="fal fa-key"></i>';
    row.appendChild(passwordButton);

    var eliminaButton=document.createElement("button");
    eliminaButton.setAttribute("class","popup-utenti-button");
    eliminaButton.setAttribute("style","width:100%;margin-top:10px");
    if(eliminato=="false")
    {
        eliminaButton.setAttribute("onclick","eliminaRiattivaUtente("+id_utente+",'true')");
        eliminaButton.innerHTML='<span>Disattiva utente</span><i class="fal fa-user-slash"></i>';
    }
    else
    {
        eliminaButton.setAttribute("onclick","eliminaRiattivaUtente("+id_utente+",'false')");
        eliminaButton.innerHTML='<span>Riattiva utente</span><i class="fal fa-user-check"></i>';
    }
    row.appendChild(eliminaButton);

    var permessiButton=document.createElement("button");
    permessiButton.setAttribute("class","popup-utenti-button");
    permessiButton.setAttribute("style","width:100%;margin-top:10px");
    permessiButton.setAttribute("onclick","popupPermessiUtente('"+JSONutente+"')");
    permessiButton.innerHTML='<span>Permessi utente</span><i class="fal fa-user-unlock"></i>';
    row.appendChild(permessiButton);

    outerContainer.appendChild(row);

    Swal.fire
    ({
        //position:"top",
        width:700,
        background:"#404040",
        title:"#"+id_utente+"&nbsp&#9679;&nbsp"+username,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.color="white";
                    document.getElementsByClassName("swal2-title")[0].style.maxWidth="70%";
                    document.getElementsByClassName("swal2-title")[0].style.boxSizing="border-box";
                    document.getElementsByClassName("swal2-title")[0].style.marginLeft="10px";
                    document.getElementsByClassName("swal2-title")[0].style.marginTop="15px";
                    document.getElementsByClassName("swal2-title")[0].style.marginRight="10px";
                    document.getElementsByClassName("swal2-title")[0].style.whiteSpace="nowrap";
                    document.getElementsByClassName("swal2-title")[0].style.overflow="hidden";
                    document.getElementsByClassName("swal2-title")[0].style.textOverflow="ellipsis";
                    document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-close")[0].style.outline="none";
                },
        showCloseButton:true,
        showConfirmButton:false,
        showCancelButton:false,
        html:outerContainer.outerHTML
    }).then((result) => 
    {
        
    });
}
function getPermessiPagine(id_utente)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getPermessiPagine.php",
        {
            id_utente
        },
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                    resolve(JSON.parse(response));
            }
            else
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(status);
                resolve([]);
            }
        });
    });
}
var id_pagine;
async function popupPermessiUtente(JSONutente)
{
    var utente=JSON.parse(JSONutente);

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","popup-utenti-outer-container");
    outerContainer.setAttribute("style","margin-top:0px");

    var permessi_pagine=await getPermessiPagine(utente.id_utente);
    //console.log(permessi_pagine);

    var dirty_permessi_pagine_sezioni=[];
    permessi_pagine.forEach(function (pagina)
    {
        dirty_permessi_pagine_sezioni.push(pagina.sezione);
    });
    var permessi_pagine_sezioni = [];
    $.each(dirty_permessi_pagine_sezioni, function(i, el){
        if($.inArray(el, permessi_pagine_sezioni) === -1) permessi_pagine_sezioni.push(el);
    });

    id_pagine=[];

    var innerContainer=document.createElement("div");
    innerContainer.setAttribute("class","popup-utenti-inner-container");

    var np=0;
    permessi_pagine_sezioni.forEach(function (sezione)
    {
        var row=document.createElement("div");
        row.setAttribute("class","popup-foto-ordini-row");
        row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;text-decoration:underline;margin-top:10px");
        row.innerHTML=sezione;
       
        innerContainer.appendChild(row);

        permessi_pagine.forEach(function (pagina)
        {
            if(pagina.sezione==sezione)
            {
                var row=document.createElement("div");
                row.setAttribute("class","popup-foto-ordini-row");
                row.setAttribute("style","width:100%;text-align:left");

                var labelCheckbox=document.createElement("label");
                labelCheckbox.setAttribute("class","pure-material-checkbox");
                labelCheckbox.setAttribute("style","-webkit-appearance:none;width:100%");

                var inputCheckbox=document.createElement("input");
                inputCheckbox.setAttribute("style","-webkit-appearance:none;");
                inputCheckbox.setAttribute("type","checkbox");
                if(pagina.checked=="checked")
                {
                    inputCheckbox.setAttribute("checked","checked");
                    np++;
                }
                inputCheckbox.setAttribute("id","checkboxPermessoPagina"+pagina.id_pagina);
                labelCheckbox.appendChild(inputCheckbox);

                var spanCheckbox=document.createElement("span");
                spanCheckbox.setAttribute("style","color:#ddd;font-size:12px;-webkit-appearance:none;text-align:left");
                spanCheckbox.innerHTML="<div>"+pagina.nomePagina+"</div>";
                labelCheckbox.appendChild(spanCheckbox);

                row.appendChild(labelCheckbox);

                innerContainer.appendChild(row);

                id_pagine.push(pagina.id_pagina);
            }
        });
    });

    outerContainer.appendChild(innerContainer);

    //console.log(np);

    var row=document.createElement("div");
    row.setAttribute("class","popup-utenti-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:10px");

    var confermaButton=document.createElement("button");
    confermaButton.setAttribute("class","popup-utenti-button");
    confermaButton.setAttribute("style","width:100%;");
    confermaButton.setAttribute("onclick","confermaPermessiPagine('"+utente.id_utente+"')");
    confermaButton.innerHTML='<span>Conferma</span><i class="fal fa-check-circle"></i>';
    row.appendChild(confermaButton);

    outerContainer.appendChild(row);

    Swal.fire
    ({
        //position:"top",
        width:700,
        background:"#404040",
        title:"Permessi "+utente.username,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.color="white";
                    document.getElementsByClassName("swal2-title")[0].style.maxWidth="70%";
                    document.getElementsByClassName("swal2-title")[0].style.boxSizing="border-box";
                    document.getElementsByClassName("swal2-title")[0].style.marginLeft="10px";
                    document.getElementsByClassName("swal2-title")[0].style.marginTop="15px";
                    document.getElementsByClassName("swal2-title")[0].style.marginRight="10px";
                    document.getElementsByClassName("swal2-title")[0].style.whiteSpace="nowrap";
                    document.getElementsByClassName("swal2-title")[0].style.overflow="hidden";
                    document.getElementsByClassName("swal2-title")[0].style.textOverflow="ellipsis";
                    document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-close")[0].style.outline="none";
                },
        showCloseButton:true,
        showConfirmButton:false,
        showCancelButton:false,
        html:outerContainer.outerHTML
    }).then((result) => 
    {
        
    });
}
function confermaPermessiPagine(id_utente)
{
    var permessi_pagine=[];
    for (let index = 0; index < id_pagine.length; index++) {
        const id_pagina = id_pagine[index];
        if(document.getElementById("checkboxPermessoPagina"+id_pagina).checked)
            permessi_pagine.push(id_pagina);
    }
    let JSONpermessi_pagine=JSON.stringify(permessi_pagine);
    Swal.close();

    Swal.fire
    ({
        title: "Caricamento in corso...",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-2x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        background:"transparent",
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });
    
    $.post("confermaPermessiPagine.php",
    {
        id_utente,
        JSONpermessi_pagine
    },
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
            {
                Swal.fire
                ({
                    width:700,
                    background:"#404040",
                    icon:"success",
                    title: "Permessi aggiornati",
                    onOpen : function()
                    {
                        document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                        document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
                        document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.color="white";
                    }
                }).then((result) => 
                {
                    getElencoUtenti();
                });
            }
        }
        else
        {
            Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
            console.log(response);
        }
    });
}
function popupAnagraficaUtente(id_utente)
{
    //var id_utente=onlongtouchArguments[0];
    var utente=getFirstObjByPropValue(utenti,"id_utente",id_utente);

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","popup-utenti-outer-container");

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML="Username";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("type","text");
    input.setAttribute("class","popup-utenti-input");
    input.setAttribute("id","popupUtentiUsername");
    input.setAttribute("value",utente.username);
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML="Nome";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("type","text");
    input.setAttribute("class","popup-utenti-input");
    input.setAttribute("id","popupUtentiNome");
    input.setAttribute("value",utente.nome);
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML="Cognome";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("type","text");
    input.setAttribute("class","popup-utenti-input");
    input.setAttribute("id","popupUtentiCognome");
    input.setAttribute("value",utente.cognome);
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML="Username PC";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("type","text");
    input.setAttribute("class","popup-utenti-input");
    input.setAttribute("id","popupUtentiUsernamePC");
    if(utente.usernamePC!=null)
        input.setAttribute("value",utente.usernamePC);
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML="Mail";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("type","text");
    input.setAttribute("class","popup-utenti-input");
    input.setAttribute("id","popupUtentiMail");
    if(utente.mail!=null)
        input.setAttribute("value",utente.mail);
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-utenti-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:10px");

    var rinominaButton=document.createElement("button");
    rinominaButton.setAttribute("class","popup-utenti-button");
    rinominaButton.setAttribute("style","width:100%;");
    rinominaButton.setAttribute("onclick","salvaModificheUtente("+utente.id_utente+")");
    rinominaButton.innerHTML='<span>Salva modifiche</span><i class="fal fa-save"></i>';
    row.appendChild(rinominaButton);    

    outerContainer.appendChild(row);

    Swal.fire
    ({
        //position:"top",
        width:700,
        background:"#404040",
        title:"Anagrafica "+utente.username,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.color="white";
                    document.getElementsByClassName("swal2-title")[0].style.maxWidth="70%";
                    document.getElementsByClassName("swal2-title")[0].style.boxSizing="border-box";
                    document.getElementsByClassName("swal2-title")[0].style.marginLeft="10px";
                    document.getElementsByClassName("swal2-title")[0].style.marginTop="15px";
                    document.getElementsByClassName("swal2-title")[0].style.marginRight="10px";
                    document.getElementsByClassName("swal2-title")[0].style.whiteSpace="nowrap";
                    document.getElementsByClassName("swal2-title")[0].style.overflow="hidden";
                    document.getElementsByClassName("swal2-title")[0].style.textOverflow="ellipsis";
                    document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-close")[0].style.outline="none";
                },
        showCloseButton:true,
        showConfirmButton:false,
        showCancelButton:false,
        html:outerContainer.outerHTML
    }).then((result) => 
    {
        
    });
}
function popupPasswordUtente(JSONutente)
{
    oldSearchBarValue=document.getElementById("searcBarGestioneUtenti").value;

    var utente=JSON.parse(JSONutente);

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","popup-utenti-outer-container");

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML="Password";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("type","password");
    input.setAttribute("class","popup-utenti-input");
    input.setAttribute("autocomplete","off");
    input.setAttribute("id","popupUtentiPassword");
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML="Conferma password";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("type","password");
    input.setAttribute("class","popup-utenti-input");
    input.setAttribute("autocomplete","off");
    input.setAttribute("id","popupUtentiConfermaPassword");
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-utenti-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:10px");

    var passwordButton=document.createElement("button");
    passwordButton.setAttribute("class","popup-utenti-button");
    passwordButton.setAttribute("style","width:100%;");
    passwordButton.setAttribute("onclick","reimpostaPasswordUtente('"+utente.id_utente+"')");
    passwordButton.innerHTML='<span>Reimposta password</span><i class="fal fa-key"></i>';
    row.appendChild(passwordButton);

    outerContainer.appendChild(row);

    Swal.fire
    ({
        //position:"top",
        width:700,
        background:"#404040",
        title:"Reimposta password "+utente.username,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.color="white";
                    document.getElementsByClassName("swal2-title")[0].style.maxWidth="70%";
                    document.getElementsByClassName("swal2-title")[0].style.boxSizing="border-box";
                    document.getElementsByClassName("swal2-title")[0].style.marginLeft="10px";
                    document.getElementsByClassName("swal2-title")[0].style.marginTop="15px";
                    document.getElementsByClassName("swal2-title")[0].style.marginRight="10px";
                    document.getElementsByClassName("swal2-title")[0].style.whiteSpace="nowrap";
                    document.getElementsByClassName("swal2-title")[0].style.overflow="hidden";
                    document.getElementsByClassName("swal2-title")[0].style.textOverflow="ellipsis";
                    document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-close")[0].style.outline="none";

                    setTimeout(function()
                    {
                        document.getElementById("searcBarGestioneUtenti").value=oldSearchBarValue;
                        document.getElementById("popupUtentiPassword").value="";
                        document.getElementById("popupUtentiConfermaPassword").value="";
                    }, 500);
                },
        showCloseButton:true,
        showConfirmButton:false,
        showCancelButton:false,
        html:outerContainer.outerHTML
    }).then((result) => 
    {
        
    });
}
function reimpostaPasswordUtente(id_utente)
{
    var password=document.getElementById("popupUtentiPassword").value;
    var confermaPassword=document.getElementById("popupUtentiConfermaPassword").value;
    if(password=="" || confermaPassword=="")
        window.alert("Immetti una password valida");
    else
    {
        if(password!=confermaPassword)
            window.alert("Le password non corrispondono");
        else
        {
            Swal.close();
            $.post("reimpostaPasswordUtente.php",
            {
                id_utente,
                password
            },
            function(response, status)
            {
                if(status=="success")
                {
                    if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                    {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                    }
                    else
                    {
                        Swal.fire
                        ({
                            width:700,
                            background:"#404040",
                            icon:"success",
                            title: "Password reimpostata",
                            onOpen : function()
                            {
                                document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                                document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
                                document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.color="white";
                            }
                        }).then((result) => 
                        {
                            getElencoUtenti();
                        });
                    }
                }
                else
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                }
            });
        }
    }
}
function salvaModificheUtente(id_utente)
{
    var username=document.getElementById("popupUtentiUsername").value;
    var nome=document.getElementById("popupUtentiNome").value;
    var cognome=document.getElementById("popupUtentiCognome").value;
    var usernamePC=document.getElementById("popupUtentiUsernamePC").value;
    var mail=document.getElementById("popupUtentiMail").value;

    Swal.close();
    $.post("salvaModificheUtente.php",
    {
        id_utente,
        username,
        nome,
        cognome,
        usernamePC,
        mail
    },
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
            {
                Swal.fire
                ({
                    width:700,
                    background:"#404040",
                    icon:"success",
                    title: "Modifiche salvate",
                    onOpen : function()
                    {
                        document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                        document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
                        document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.color="white";
                    }
                }).then((result) => 
                {
                    getElencoUtenti();
                });
            }
        }
        else
        {
            Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
            console.log(response);
        }
    });
}
function eliminaRiattivaUtente(id_utente,eliminato)
{
    if(eliminato=="true")
        var message="disattivato";
    else
        var message="riattivato";
    Swal.close();
    $.post("eliminaRiattivaUtente.php",
    {
        id_utente,
        eliminato
    },
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
            {
                Swal.fire
                ({
                    width:700,
                    background:"#404040",
                    icon:"success",
                    title: "Utente "+message,
                    onOpen : function()
                    {
                        document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                        document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
                        document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.color="white";
                    }
                }).then((result) => 
                {
                    getElencoUtenti();
                });
            }
        }
        else
        {
            Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
            console.log(response);
        }
    });
}
function getUtenti()
{
    return new Promise(function (resolve, reject) 
    {
        var eliminato=document.getElementById("selectFiltroGestioneUtenti").value;
        $.get("getUtentiGestione.php",
        {
            eliminato,
            orderBy
        },
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                    resolve(JSON.parse(response));
            }
            else
                resolve([]);
        });
    });
}
function userImgError(img,nome,cognome)
{
    var div=document.createElement("div");
    div.setAttribute("class","user-img-error");
    div.innerHTML="<span>"+nome.charAt(0)+"</span><span>"+cognome.charAt(0)+"</span>";

    img.parentNode.replaceChild(div, img);

    console.clear();
}
function searchGestioneUtenti(value)
{
    $(".gestione-utenti-item-outer-container").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
}
function getFirstObjByPropValue(array,prop,propValue)
{
    var return_item;
    array.forEach(function(item)
    {
        if(item[prop]==propValue)
        {
            return_item= item;
        }
    });
    return return_item;
}
function popupAggiungiUtente()
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","popup-utenti-outer-container");

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML="Username";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("type","text");
    input.setAttribute("class","popup-utenti-input");
    input.setAttribute("id","popupAggiungiUtenteUsername");
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML="Nome";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("type","text");
    input.setAttribute("class","popup-utenti-input");
    input.setAttribute("id","popupAggiungiUtenteNome");
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML="Cognome";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("type","text");
    input.setAttribute("class","popup-utenti-input");
    input.setAttribute("id","popupAggiungiUtenteCognome");
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML="Username PC";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("type","text");
    input.setAttribute("class","popup-utenti-input");
    input.setAttribute("id","popupAggiungiUtenteUsernamePC");
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Montserrat',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML="Mail";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("type","text");
    input.setAttribute("class","popup-utenti-input");
    input.setAttribute("id","popupAggiungiUtenteMail");
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-utenti-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:10px");

    var rinominaButton=document.createElement("button");
    rinominaButton.setAttribute("class","popup-utenti-button");
    rinominaButton.setAttribute("style","width:100%;");
    rinominaButton.setAttribute("onclick","aggiungiUtente()");
    rinominaButton.innerHTML='<span>Aggiungi utente</span><i class="fal fa-user-plus"></i>';
    row.appendChild(rinominaButton);    

    outerContainer.appendChild(row);

    Swal.fire
    ({
        //position:"top",
        width:700,
        background:"#404040",
        title:"Aggiungi utente",
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.color="white";
                    document.getElementsByClassName("swal2-title")[0].style.maxWidth="70%";
                    document.getElementsByClassName("swal2-title")[0].style.boxSizing="border-box";
                    document.getElementsByClassName("swal2-title")[0].style.marginLeft="10px";
                    document.getElementsByClassName("swal2-title")[0].style.marginTop="15px";
                    document.getElementsByClassName("swal2-title")[0].style.marginRight="10px";
                    document.getElementsByClassName("swal2-title")[0].style.whiteSpace="nowrap";
                    document.getElementsByClassName("swal2-title")[0].style.overflow="hidden";
                    document.getElementsByClassName("swal2-title")[0].style.textOverflow="ellipsis";
                    document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-close")[0].style.outline="none";
                },
        showCloseButton:true,
        showConfirmButton:false,
        showCancelButton:false,
        html:outerContainer.outerHTML
    }).then((result) => 
    {
        
    });
}
function aggiungiUtente()
{
    var username=document.getElementById("popupAggiungiUtenteUsername").value;
    var nome=document.getElementById("popupAggiungiUtenteNome").value;
    var cognome=document.getElementById("popupAggiungiUtenteCognome").value;
    var usernamePC=document.getElementById("popupAggiungiUtenteUsernamePC").value;
    var mail=document.getElementById("popupAggiungiUtenteMail").value;

    if(username=="" || nome=="" || cognome=="")
        window.alert("Compila i campi username, nome e cognome");
    else
    {
        $.post("aggiungiUtenteGestioneUtenti.php",
        {
            username,
            nome,
            cognome,
            usernamePC,
            mail
        },
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                }
                else
                {
                    if(response.indexOf("esistente")>-1)
                    {
                        window.alert(response);
                    }
                    else
                    {
                        Swal.close();
                        Swal.fire
                        ({
                            width:700,
                            background:"#404040",
                            icon:"success",
                            title: "Utente aggiunto",
                            onOpen : function()
                            {
                                document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                                document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
                                document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.color="white";
                            }
                        }).then((result) => 
                        {
                            getElencoUtenti();
                        });
                    }
                }
            }
            else
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
        });
    }
}