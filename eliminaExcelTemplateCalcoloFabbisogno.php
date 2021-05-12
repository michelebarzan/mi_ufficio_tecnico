<?php

    include "Session.php";
    include "connessione.php";

    $id_template=$_REQUEST["id_template"];

    /*$q2="SELECT [fileName] FROM template_excel_importazione_fabbisogni WHERE id_template=$id_template";
    $r2=sqlsrv_query($conn,$q2);
    if($r==FALSE)
    {
        die("error".$q2);
    }
    else
    {
        while($row2=sqlsrv_fetch_array($r2))
        {
            $fileName=$row2["fileName"];
        }*/
        $q="DELETE FROM template_excel_importazione_fabbisogni WHERE id_template=$id_template";
        $r=sqlsrv_query($conn,$q);
        if($r==FALSE)
            die("error".$q);
        /*else
            deleteDir("C:/xampp/htdocs/mi_ufficio_tecnico/files/calcoloFabbisogno/templates/".$fileName);
    }*/

    function deleteDir($dir) 
    {
        $it = new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS);
        $files = new RecursiveIteratorIterator($it,
                    RecursiveIteratorIterator::CHILD_FIRST);
        foreach($files as $file) {
            if ($file->isDir()){
                rmdir($file->getRealPath());
            } else {
                unlink($file->getRealPath());
            }
        }
        rmdir($dir);
    }
?>