function newCircleSpinner(message)
{
	var container=document.createElement("div");
	container.setAttribute("id","containerCircleSpinner");
	
	var middle=document.createElement("div");
	middle.setAttribute("id","middleCircleSpinner");
	
	var inner=document.createElement("div");
	inner.setAttribute("id","innerCircleSpinner");
	
	var spinWrapper=document.createElement("div");
	spinWrapper.setAttribute("class","cirlceSpinner-spin-wrapper");
	
	var spinner=document.createElement("div");
	spinner.setAttribute("class","circleSpinner-spinner");
	
	var spinnerLabel=document.createElement("div");
	spinnerLabel.setAttribute("class","circleSpinner-spinnerLabel");
	spinnerLabel.innerHTML=message;
	
	spinWrapper.appendChild(spinner);
	spinWrapper.appendChild(spinnerLabel);
	
	inner.appendChild(spinWrapper);
	
	middle.appendChild(inner);
	
	container.appendChild(middle);
	
	document.body.appendChild(container);
	
	//document.body.innerHTML+='<div id="containerCircleSpinner"><div id="middle"><div id="inner"><div class="spin-wrapper"><div class="spinner"></div><div class="spinnerLabel">'+message+'</div></div></div></div></div>';
}
function removeCircleSpinner()
{
	document.getElementById("containerCircleSpinner").remove();
}
function newGridSpinner(message,container,spinnerContainerStyle,spinnerStyle,messageStyle)
{
	document.getElementById(container).innerHTML='<div id="gridSpinnerContainer"  style="'+spinnerContainerStyle+'"><div  style="'+spinnerStyle+'" class="sk-cube-grid"><div class="sk-cube sk-cube1"></div><div class="sk-cube sk-cube2"></div><div class="sk-cube sk-cube3"></div><div class="sk-cube sk-cube4"></div><div class="sk-cube sk-cube5"></div> <div class="sk-cube sk-cube6"></div><div class="sk-cube sk-cube7"></div><div class="sk-cube sk-cube8"></div><div class="sk-cube sk-cube9"></div></div><div id="messaggiSpinner" style="'+messageStyle+'">'+message+'</div></div>';
}
function newMouseSpinner(event)
{
	var mouseSpinner=document.createElement("span");
	mouseSpinner.setAttribute("id","mouseSpinner");
	document.body.appendChild(mouseSpinner);
	$('#mouseSpinner').css({'top':event.pageY+10,'left':event.pageX+15});

	document.addEventListener("mousemove", followMouse);
}
function followMouse(event)
{
	$('#mouseSpinner').css({'top':event.pageY+10,'left':event.pageX+15});
}
function removeMouseSpinner()
{
	document.getElementById("mouseSpinner").remove();
	document.removeEventListener("mousemove", followMouse);
}