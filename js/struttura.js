	function mainNavBarOpen()
	{
		const speed=200;
		$('.main-nav-bar').show(speed);
		setTimeout(function()
		{
			$('.main-nav-bar-hidden-elements').css("visibility", "visible");
		}, speed);
		getPageList();
	}
	function getPageList()
	{
		document.getElementById("main-nav-bar-sections-outer-container").innerHTML="";
		$.get("getPageList.php",{hideIndex:"false"},
		function(response, status)
		{
			if(status=="success")
			{
				var responseArray=[];
				var responseArrayObj = JSON.parse(response);
				for (var key in responseArrayObj)
				{
					responseArray.push(responseArrayObj[key]);							
				}
				
				var pagine_preferite=JSON.parse(responseArray[0]);
				var sezioni=JSON.parse(responseArray[1]);

				if(pagine_preferite.length>0)
				{
					var mainNavBarSectionContainer=document.createElement("div");
					mainNavBarSectionContainer.setAttribute("class","main-nav-bar-section-container");

					var mainNavBarSectionTitle=document.createElement("div");
					mainNavBarSectionTitle.setAttribute("class","main-nav-bar-section-title");
					mainNavBarSectionTitle.innerHTML="Preferiti";

					mainNavBarSectionContainer.appendChild(mainNavBarSectionTitle);
					for(var i=0;i<pagine_preferite.length;i++)
					{
						var pagina=pagine_preferite[i];

						var mainNavBarSectionRow=document.createElement("div");
						mainNavBarSectionRow.setAttribute("class","main-nav-bar-section-row");

						var mainNavBarSectionRowLink=document.createElement("a");
						mainNavBarSectionRowLink.setAttribute("class","main-nav-bar-section-row-link");
						mainNavBarSectionRowLink.setAttribute("href",pagina['pagina']);

						//icona------------------------------------------------------------------------
						var mainNavBarSectionRowItem=document.createElement("div");
						mainNavBarSectionRowItem.setAttribute("class","main-nav-bar-section-row-item");
						mainNavBarSectionRowItem.setAttribute("style","width:30px;");

						var icona=document.createElement("i");
						icona.setAttribute("class",pagina['icona']);

						mainNavBarSectionRowItem.appendChild(icona);

						mainNavBarSectionRowLink.appendChild(mainNavBarSectionRowItem);

						//nome-------------------------------------------------------------------------
						var mainNavBarSectionRowItem=document.createElement("div");
						mainNavBarSectionRowItem.setAttribute("class","main-nav-bar-section-row-item");
						mainNavBarSectionRowItem.setAttribute("style","width:200px;padding-left:5px;");
						mainNavBarSectionRowItem.innerHTML=pagina['nomePagina'];

						mainNavBarSectionRowLink.appendChild(mainNavBarSectionRowItem);

						//stella------------------------------------------------------------------------
						var mainNavBarSectionRowItem=document.createElement("div");
						mainNavBarSectionRowItem.setAttribute("class","main-nav-bar-section-row-item");
						mainNavBarSectionRowItem.setAttribute("style","width:30px;text-align:right;");

						var stella=document.createElement("i");
						stella.setAttribute("class","fas fa-star");
						stella.setAttribute("style","color:#F2CE5A;cursor:pointer");
						stella.setAttribute("title","Rimuovi dai preferiti");
						stella.setAttribute("onclick","rimuoviPaginaPreferiti(event,"+pagina['id_pagina_preferita_utente']+")");

						mainNavBarSectionRowItem.appendChild(stella);

						mainNavBarSectionRowLink.appendChild(mainNavBarSectionRowItem);
						//-----------------------------------------------------------------------------

						mainNavBarSectionRow.appendChild(mainNavBarSectionRowLink);

						mainNavBarSectionContainer.appendChild(mainNavBarSectionRow);
					}
					document.getElementById("main-nav-bar-sections-outer-container").appendChild(mainNavBarSectionContainer);
				}
				
				function compare( a, b )
				{
					if ( a.ordinamento < b.ordinamento ){
						return -1;
					}
					if ( a.ordinamento > b.ordinamento ){
						return 1;
					}
					return 0;
				}
				
				sezioni.sort( compare );
				for(var i=0;i<sezioni.length;i++)
				{
					var sezione=sezioni[i];

					var mainNavBarSectionContainer=document.createElement("div");
					mainNavBarSectionContainer.setAttribute("class","main-nav-bar-section-container");

					var mainNavBarSectionTitle=document.createElement("div");
					mainNavBarSectionTitle.setAttribute("class","main-nav-bar-section-title");
					mainNavBarSectionTitle.innerHTML=sezione["sezione"];

					mainNavBarSectionContainer.appendChild(mainNavBarSectionTitle);
					
					var pagine_sezioni=sezione['pagine'];
					for(var k=0;k<pagine_sezioni.length;k++)
					{
						var pagina=pagine_sezioni[k];

						var mainNavBarSectionRow=document.createElement("div");
						mainNavBarSectionRow.setAttribute("class","main-nav-bar-section-row");

						var mainNavBarSectionRowLink=document.createElement("a");
						mainNavBarSectionRowLink.setAttribute("class","main-nav-bar-section-row-link");
						mainNavBarSectionRowLink.setAttribute("href",pagina['pagina']);

						//icona------------------------------------------------------------------------
						var mainNavBarSectionRowItem=document.createElement("div");
						mainNavBarSectionRowItem.setAttribute("class","main-nav-bar-section-row-item");
						mainNavBarSectionRowItem.setAttribute("style","width:30px;");

						var icona=document.createElement("i");
						icona.setAttribute("class",pagina['icona']);

						mainNavBarSectionRowItem.appendChild(icona);

						mainNavBarSectionRowLink.appendChild(mainNavBarSectionRowItem);

						//nome-------------------------------------------------------------------------
						var mainNavBarSectionRowItem=document.createElement("div");
						mainNavBarSectionRowItem.setAttribute("class","main-nav-bar-section-row-item");
						mainNavBarSectionRowItem.setAttribute("style","width:200px;padding-left:5px;");
						mainNavBarSectionRowItem.innerHTML=pagina['nomePagina'];

						mainNavBarSectionRowLink.appendChild(mainNavBarSectionRowItem);

						//stella------------------------------------------------------------------------
						var mainNavBarSectionRowItem=document.createElement("div");
						mainNavBarSectionRowItem.setAttribute("class","main-nav-bar-section-row-item");
						mainNavBarSectionRowItem.setAttribute("style","width:30px;text-align:right;");

						var stella=document.createElement("i");
						stella.setAttribute("class","fal fa-star");
						stella.setAttribute("style","color:#F2CE5A;cursor:pointer");
						stella.setAttribute("title","Aggiungi ai preferiti");
						stella.setAttribute("onclick","aggiungiPaginaPreferiti(event,"+pagina['id_pagina']+")");

						mainNavBarSectionRowItem.appendChild(stella);

						mainNavBarSectionRowLink.appendChild(mainNavBarSectionRowItem);
						//-----------------------------------------------------------------------------

						mainNavBarSectionRow.appendChild(mainNavBarSectionRowLink);

						mainNavBarSectionContainer.appendChild(mainNavBarSectionRow);
					}
					document.getElementById("main-nav-bar-sections-outer-container").appendChild(mainNavBarSectionContainer);
					try {mainNavBarLoaded();} catch (error) {}
				}
			}
			else
				console.log(status);
		});
	}
	function mainNavBarClose()
	{
		const speed=200;
		$('.main-nav-bar-hidden-elements').css("visibility", "hidden");
		$('.main-nav-bar').hide(speed);
	}
	function aggiungiPaginaPreferiti(event,id_pagina)
	{
		event.preventDefault();
		$.post("aggiungiPaginaPreferiti.php",
		{
			id_pagina
		},
		function(response, status)
		{
			if(status=="success")
			{
				getPageList()
			}
			else
				console.log(status);
		});
	}
	function rimuoviPaginaPreferiti(event,id_pagina_preferita_utente)
	{
		event.preventDefault();
		$.post("rimuoviPaginaPreferiti.php",
		{
			id_pagina_preferita_utente
		},
		function(response, status)
		{
			if(status=="success")
			{
				getPageList()
			}
			else
				console.log(status);
		});
	}
	function topFunction() 
	{
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
	}
	function apri()
	{
		topFunction();
		var body = document.body,html = document.documentElement;
		var offsetHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
		document.getElementById('stato').value="Aperto";
		document.getElementById('navBar').style.width="300px";
		document.getElementById('nascondi2').style.display="inline-block";
		document.getElementById('nascondi2').value="ME";
		document.getElementById('nascondi3').style.display="inline-block";
		document.getElementById('nascondi3').value="NU";
		document.getElementById('navBar').style.height = offsetHeight+"px";
		var all = document.getElementsByClassName("btnGoToPath");
		for (var i = 0; i < all.length; i++) 
		{
		all[i].style.width = '100%';
		all[i].style.height='50px';
		all[i].style.borderBottom='1px solid #ddd';
		}
	}
	function chiudi()
	{
		document.getElementById('navBar').style.width = "0px";
		document.getElementById('stato').value="Chiuso";
		document.getElementById('nascondi2').value="";
		document.getElementById('nascondi3').value="";
		setTimeout(function()
		{ 
		document.getElementById('navBar').style.height = "0px";
		document.getElementById('nascondi2').style.display="none";
		document.getElementById('nascondi3').style.display="none";
		var all = document.getElementsByClassName("btnGoToPath");
		for (var i = 0; i < all.length; i++) 
		{
		all[i].style.width = '0px';
		all[i].style.height='0px';
		all[i].style.borderBottom='';
		}
		}, 1000);
	}
	function logoutB()
	{
		window.location = 'logout.php';
	}
	function gotopath(path)
	{
		window.location = path;
	}
	function homepage()
	{
		window.location = 'index.php';
	}
	function nascondi()
	{
		var stato=document.getElementById('stato').value;
		if(stato=="Aperto")
		{
		chiudi();
		}
		else
		{
		apri();
		}
	}
	function goToPath(path)
	{
		window.location = path;
	}
	function apriUserSettings()
	{
		document.getElementById("userSettings").style.display="inline-block";
		document.getElementById("userSettingsPadding").style.display="inline-block";
		chiudiNotifiche();
	}
	function chiudiUserSettings()
	{
		document.getElementById("userSettings").style.display="none";
		document.getElementById("userSettingsPadding").style.display="none";
	}
	function apriNotifiche()
	{
		document.getElementById("notifiche").style.display="inline-block";
		document.getElementById("notifichePadding").style.display="inline-block";
		notificaVista();
		chiudiUserSettings();
	}
	function chiudiNotifiche()
	{
		document.getElementById("notifiche").style.display="none";
		document.getElementById("notifichePadding").style.display="none";
	}
	function eliminaNotifiche()
	{
		document.getElementById('containerNotifiche').innerHTML="";
	}
	function aggiungiNotifica(testo)
	{
		document.getElementById('containerNotifiche').innerHTML+="<div class='notificheRow'>"+testo+"</div>";
		document.getElementById("btnNuovaNotifica").style.visibility = "visible";
	}
	function notificaVista()
	{
		document.getElementById("btnNuovaNotifica").style.visibility = "hidden";
	}
	function setCookie(name,value)
    {
        $.post("setCookie.php",{name,value},
		function(response, status)
		{
            if(status!="success")
				console.log(status);
		});
    }
    function getCookie(name)
    {
        return new Promise(function (resolve, reject) 
        {
            $.get("getCookie.php",{name},
            function(response, status)
            {
                if(status=="success")
                {
                    resolve(response);
                }
                else
                    reject({status});
            });
        });
	}
	function getUsernameSession(){return document.getElementById("username").innerHTML}
	/*function importaDati()
	{
		chiudiUserSettings();
		const Toast = Swal.mixin({
			toast: true,
			position: 'top-end',
			showConfirmButton: false,
			customClass:
			{
				container: 'swalContainerMarginTop'
			}
		});
		
		var spinnerContainer=document.createElement("div");
		spinnerContainer.setAttribute("class","toastSpinnerContainer");
		
		var spinWrapper=document.createElement("div");
		spinWrapper.setAttribute("class","toast-spin-wrapper");
		
		var spinner=document.createElement("div");
		spinner.setAttribute("class","toastSpinner");
		
		var spinnerLabel=document.createElement("div");
		spinnerLabel.setAttribute("class","toastSpinnerLabel");
		spinnerLabel.innerHTML="Importazione dati in corso...";
		
		spinWrapper.appendChild(spinner);
		
		spinnerContainer.appendChild(spinWrapper);
		spinnerContainer.appendChild(spinnerLabel);
		
		Toast.fire
		({
			html: spinnerContainer.outerHTML
		})
		$.get("importaDati.php",
		function(response, status)
		{
			if(status=="success")
			{
				console.log(response);
				if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
				{
					Toast.fire
					({
						type: 'error',
						html: "<span class='importazioneDatiResult'>Errore. Contatta l' amministratore<span>"
					})
				}
				else
				{
					Toast.fire
					({
						type: 'success',
						html: "<span class='importazioneDatiResult'>Dati importati<span>",
						timer: 4000
					})
				}
			}
			else
				console.log(status);
		});
	}*/