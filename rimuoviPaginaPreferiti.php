
<?php

include "Session.php";
include "connessione.php";

$id_pagina_preferita_utente=$_REQUEST['id_pagina_preferita_utente'];

$qPreferiti="DELETE FROM [mi_webapp].[dbo].pagine_preferite_utenti WHERE id_pagina_preferita_utente=$id_pagina_preferita_utente";
$rPreferiti=sqlsrv_query($conn,$qPreferiti);

?>