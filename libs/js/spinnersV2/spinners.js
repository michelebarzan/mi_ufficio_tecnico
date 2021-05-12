function getFaSpinner(container,containerName,messageText,color)
{
    if(color=="" || color==null || color==undefined)
        color="#404040";

    var spinnerCointainer=document.createElement("div");
    spinnerCointainer.setAttribute("class","fa-spinner-container");
    spinnerCointainer.setAttribute("style","color:"+color);
    spinnerCointainer.setAttribute("id","faSpinner_"+containerName);    
    
    var spinner=document.createElement("i");
    spinner.setAttribute("class","fad fa-spinner-third fa-spin");
    spinnerCointainer.appendChild(spinner);

    if(messageText!=undefined)
    {
        var message=document.createElement("span");
        message.innerHTML=messageText;
        spinnerCointainer.appendChild(message);
    }

    container.appendChild(spinnerCointainer);
}
function removeFaSpinner(containerName)
{
    try {
        document.getElementById("faSpinner_"+containerName).remove();
    } catch (error) {
        
    }
    
}