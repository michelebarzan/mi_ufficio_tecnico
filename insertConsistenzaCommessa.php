<?php

    include "Session.php";
    include "connessione.php";

    $headers=json_decode($_REQUEST["JSONheaders"]);
    $data=json_decode($_REQUEST["JSONdata"]);
    $commessa=$_REQUEST["commessa"];
    $descrizione=$_REQUEST["descrizione"];
    $operation=$_REQUEST["operation"];
    if(isset($_REQUEST["id_commessa"]))
        $id_commessa=$_REQUEST["id_commessa"];

    $headers_string="[".implode("],[",$headers)."],[commessa]";

    if ( sqlsrv_begin_transaction( $conn ) === false )
    {
        die( print_r( sqlsrv_errors(), true ));
    }

    $stmts=[];

    if($operation=="insert")
    {
        $q = "INSERT INTO [dbo].[anagrafica_commesse] ([nome],[descrizione]) VALUES ('$commessa','$descrizione')";
        $stmt=sqlsrv_query( $conn, $q);
        array_push($stmts,$stmt);
        if($stmt==FALSE)
        {
            sqlsrv_rollback( $conn );
            die("error1");
        }
        else
        {
            $q = "SELECT * FROM [dbo].[anagrafica_commesse] WHERE nome='$commessa'";
            $r=sqlsrv_query($conn,$q);
            if($r==FALSE)
            {
                sqlsrv_rollback( $conn );
                die("error2");
            }
            else
            {
                while($row=sqlsrv_fetch_array($r))
                {
                    $id_commessa=$row["id_commessa"];
                }
            }
        }
    }
    else
    {
        $q = "UPDATE [dbo].[anagrafica_commesse] SET nome='$commessa', descrizione='$descrizione' WHERE id_commessa=$id_commessa";
        $stmt=sqlsrv_query( $conn, $q);
        array_push($stmts,$stmt);
        if($stmt==FALSE)
        {
            sqlsrv_rollback( $conn );
            die("error1");
        }
    }

    $q = "DROP TABLE [dbo].[consistenza_commesse_tmp]";
    array_push($stmts,sqlsrv_query( $conn, $q));

    $q = "CREATE TABLE [dbo].[consistenza_commesse_tmp]
        ([id_consistenza_commessa] [int] IDENTITY(1,1) NOT NULL
        ,[commessa] [int] NULL";
    foreach ($headers as $header)
    {
        $q.=",[$header] VARCHAR(MAX) NULL";
    }
    $q.=",CONSTRAINT [PK_consistenza_commessa_tmp] PRIMARY KEY CLUSTERED ([id_consistenza_commessa] ASC)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
        ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]";
    array_push($stmts,sqlsrv_query( $conn, $q));

    foreach ($data as $JSONrow)
    {
        $row=json_decode(json_encode($JSONrow, true),true);
        array_push($row,$id_commessa);
        $row_string="|".implode("|,|",$row)."|";
        $row_string=str_replace("'","''",$row_string);
        $row_string=str_replace("|","'",$row_string);

        $q = "INSERT INTO [dbo].[consistenza_commesse_tmp] ($headers_string) VALUES ($row_string)";
        array_push($stmts,sqlsrv_query( $conn, $q));
    }

    $q = "DROP TABLE consistenza_commesse_bk";
    array_push($stmts,sqlsrv_query( $conn, $q));

    $q = "SELECT * INTO consistenza_commesse_bk FROM consistenza_commesse";
    array_push($stmts,sqlsrv_query( $conn, $q));

    $q = "DROP TABLE consistenza_commesse";
    array_push($stmts,sqlsrv_query( $conn, $q));
    
    $q = "SELECT * INTO consistenza_commesse FROM consistenza_commesse_tmp";
    array_push($stmts,sqlsrv_query( $conn, $q));
    
    $commit=true;
    foreach ($stmts as $stmt) 
    {
        if(!$stmt)
            $commit=false;
    }
    if( $commit )
    {
        sqlsrv_commit( $conn );
        echo "ok";
    }
    else
    {
        sqlsrv_rollback( $conn );
        echo "error3";
    }

?>