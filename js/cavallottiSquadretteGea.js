var commesse;
var hot;

window.addEventListener("load", async function(event)
{
    document.getElementById("selectCommessaCavallottiSquadrette").innerHTML="";
    commesse=await getCommesse();
    commesse.forEach(commessa =>
    {
        var option=document.createElement("option");
        option.setAttribute("value",commessa.id_commessa);
        option.innerHTML=commessa.nome;
        document.getElementById("selectCommessaCavallottiSquadrette").appendChild(option);
    });
    getHotCavallottiSquadrette();
});

async function getHotCavallottiSquadrette()
{
    var container = document.getElementById('cavallottiSquadretteGeaContainer');
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

    var response=await getHotDataCavallottiSquadrette();

    Swal.close();

    var height=container.offsetHeight;

    if(response.data.length>0)
    {
		try {hot.destroy();} catch (error) {}

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
                columnSorting: true,
                width:"100%",
                height,
                columns:response.columns,
                beforeChange: (changes) =>
                {
                    return false;
                },
                beforeCreateRow: (index,amount,source) =>
                {
                    return false;
                },
                beforeRemoveRow: (index,amount,physicalRows,source)  =>
                {
                    return false;
                }
            }
        );
        exportPlugin1 = hot.getPlugin('exportFile');
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
function getHotDataCavallottiSquadrette()
{
    return new Promise(function (resolve, reject) 
    {
        var id_commessa=document.getElementById("selectCommessaCavallottiSquadrette").value;
        $.post("getHotDataCavallottiSquadrette.php",{id_commessa},
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
function getCommesse()
{
    return new Promise(function (resolve, reject) 
    {
        $.post("getAnagraficaCommesse.php",
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
function esportaCsvCavallottiSquadrette()
{
    var id_commessa=document.getElementById("selectCommessaCavallottiSquadrette").value;
    var commessaObj=getFirstObjByPropValue(commesse,"id_commessa",id_commessa);
    exportPlugin1.downloadFile('csv',
    {
        bom: false,
        columnDelimiter: ';',
        columnHeaders: false,
        exportHiddenColumns: true,
        exportHiddenRows: true,
        fileExtension: 'csv',
        filename: commessaObj.nome+"_cavallotti",
        mimeType: 'text/csv',
        rowDelimiter: '\r\n',
        rowHeaders: false
    });
}