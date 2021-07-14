<?php

	include "connessione.php";

    set_time_limit(240);
	
	$databases=["BeB","grimaldi","po00","spareti","newpan"];
	
	exec("inserisci_password.bat");
	
	foreach($databases as $database)
    {
		if($database=="newpan")
			$percorso_anag="//10.28.25.1/GrpMI/Ut/PARETI/NEWPAN/";
		else
			$percorso_anag="//10.28.25.1/GrpMI/$database/";
		
		//Elimino il file di bk
		unlink($percorso_anag."anagBK.txt");
		//Ricreo il file di bk
		copy($percorso_anag."anag.txt",$percorso_anag."anagBK.txt");
		//Scrivo nel file
		$q2="SELECT [codice_materia_prima],[um],[descrizione] FROM [mi_db_tecnico].[dbo].[view_anagraf_txt] ORDER BY [ordine]";
		$r2=sqlsrv_query($conn,$q2);
		if($r2==FALSE)
		{
			die("error".$q2);
		}
		else
		{
			$file_anag = fopen($percorso_anag."anag.txt", "w") or die("error");
			while($row2=sqlsrv_fetch_array($r2))
			{
				$line = $row2['codice_materia_prima']."\t".$row2['um']."\t".$row2['descrizione']."\r\n";
				fwrite($file_anag, $line);
			}
			fclose($file_anag);
		}
	}

?>