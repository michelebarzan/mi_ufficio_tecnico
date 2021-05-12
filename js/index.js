var mi_webapp_params;

window.addEventListener("load", async function(event)
{
    mi_webapp_params=await getMiWebappParams();
    getSezioniHomepage();
});
async function getSezioniHomepage()
{
    var responseArray=await getPagine();
    var pagine_preferite=JSON.parse(responseArray[0]);
    var sezioni=JSON.parse(responseArray[1]);

    var obj_preferiti=
    {
        id_sezione:null,
        sezione:"Preferiti",
        descrizione:null,
        pagine:pagine_preferite,
        ordinamento:0
    }

    sezioni.push(obj_preferiti);

    function compare( a, b ) {
    if ( a.ordinamento < b.ordinamento ){
        return -1;
    }
    if ( a.ordinamento > b.ordinamento ){
        return 1;
    }
    return 0;
    }
    
    sezioni.sort( compare );

    var outerContainer=document.getElementById("indexOuterContainer");
    outerContainer.innerHTML="";
    sezioni.forEach(sezione =>
    {
        if(sezione.pagine.length>0)
        {
            var sezioneOuterContainer=document.createElement("div");
            sezioneOuterContainer.setAttribute("class","sezione-outer-container");

            var sezioneTitleContainer=document.createElement("div");
            sezioneTitleContainer.setAttribute("class","sezione-title-container");
            var span=document.createElement("span");
            span.innerHTML=sezione.sezione;
            sezioneTitleContainer.appendChild(span);
            sezioneOuterContainer.appendChild(sezioneTitleContainer);

            var sezioneInnerContainer=document.createElement("div");
            sezioneInnerContainer.setAttribute("class","sezione-inner-container");
            sezione.pagine.forEach(pagina =>
            {
                var indexLinkOuterContainer=document.createElement("a");
            indexLinkOuterContainer.setAttribute("class","index-link-outer-container");
            indexLinkOuterContainer.setAttribute("data-tooltip",pagina.descrizione);
            indexLinkOuterContainer.setAttribute("href",mi_webapp_params.web_server_info.protocol+"://"+mi_webapp_params.web_server_info.name+":"+mi_webapp_params.web_server_info.port+"/mi_ufficio_tecnico/"+pagina.pagina);

            var indexLinkIcon=document.createElement("i");
            indexLinkIcon.setAttribute("class",pagina.icona);
            indexLinkOuterContainer.appendChild(indexLinkIcon);

            var indexLinkSpan=document.createElement("span");
            indexLinkSpan.innerHTML=pagina.nomePagina;
            indexLinkOuterContainer.appendChild(indexLinkSpan);

            sezioneInnerContainer.appendChild(indexLinkOuterContainer);
            });
            sezioneOuterContainer.appendChild(sezioneInnerContainer);

            outerContainer.appendChild(sezioneOuterContainer);
        }
    });
}
function getPagine()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getPageList.php",{hideIndex:"true"},
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