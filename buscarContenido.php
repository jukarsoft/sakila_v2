<?php 
	require 'conexion_sakilaPDO.php';
	try {
		$filaInicial=0;
		$numFilasMostrar=10;
		$pagina=0;
	
		
		//recuperar el número de página a consultar
		if (isset($_POST['pagina'])) {
			$pagina=$_POST['pagina'];
			//recalcular la fila inicial que corresponde a la página a mostrar
			$filaInicial=($pagina-1)*$numFilasMostrar;
		}

		if (isset($_POST['buscar'])) {
			$buscar=$_POST['buscar'];
		} else {return;}

		
		//la sentencia es preparada con los parametros //parametro LIMIT filainicial y filas a mostrar
		$stmt=$dbh->PREPARE("SELECT * FROM film WHERE title LIKE :buscar ORDER BY title LIMIT $filaInicial, $numFilasMostrar");
		//bind de los parametros // asigna los valores a la sentencia preparada
		$buscar="%$buscar%";
		$stmt->bindParam(':buscar', $buscar);
		//$stmt->bindParam(':fila', $filaInicial);
		//$stmt->bindParam(':numfilas', $numFilasMostrar);
				
		// Especificar como se quieren devolver los datos
		$stmt->setFetchMode(PDO::FETCH_ASSOC);
		//Ejecutar la sentencia
		$stmt->execute();
		//bucle para obtener cada una de las filas obtenidas
		$elementos = array();		
		while ($fila = $stmt->fetch()) {
			array_push($elementos, $fila);
			//echo "<br>";
			//print_r($elementos);
		}	

		//calcular el número de páginas
		
		$stmt=$dbh->PREPARE("SELECT COUNT(*) AS numeroFilas FROM film WHERE title LIKE :buscar");
		$stmt->bindParam(':buscar', $buscar);
		// Especificar como se quieren devolver los datos
		$stmt->setFetchMode(PDO::FETCH_ASSOC);
						//$stmt->setFetchMode(PDO::FETCH_NUM);
						//$stmt->setFetchMode(PDO::FETCH_BOTH);
		//Ejecutar la sentencia
		$stmt->execute();
		$filas=$stmt->fetch();
		//recuperar filas totales
		$numFilas=$filas['numeroFilas'];
		//calcular el número de páginas 
		$paginas=ceil($numFilas/$numFilasMostrar);

		//retorna codigo error + la lista de pacientes obtenida y el número de paginas a montar
		$codigo='00';
		$mensaje="OK";
		$control=array('codigo'=>$codigo, 'mensaje'=> $mensaje);
		$respuesta=array($control, $elementos,$paginas);

	} catch (PDOException $e) {
		//echo $e->getCode().' '.$e->getMessage();
		if ($stmt->errorInfo()[1] == 1146) {
			$codigo=$stmt->errorInfo()[1];
			$mensaje='tabla no existe'.$e->getMessage();
		} else {
			$codigo=$e->getCode();
			$mensaje=$e->getMessage();
		}
		$control=array('codigo'=>$codigo, 'mensaje'=> $mensaje);
		$respuesta=array($control);

	}catch (Exception $e) {
		$codigo=$e->getCode();
		$control=array('codigo'=>$codigo, 'mensaje'=> $mensaje);
		$respuesta=array($control);

	}
	echo json_encode($respuesta);
?>