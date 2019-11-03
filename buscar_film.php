<?php 

	require 'conexion_sakilaPDO.php';
	try {
		$id=$_POST['film_id'];
		if ($id=='') {
			return;
		}
		//la sentencia es preparada con los parametros //parametro LIMIT filainicial y filas a mostrar
		$stmt=$dbh->PREPARE("SELECT * FROM film WHERE film_id= :film_id");
		/*$stmt=$dbh->PREPARE("
			SELECT film.film_id, film.title, actor.first_name, actor.last_name FROM film
 			INNER JOIN film_actor ON film.film_id=film_actor.film_id 
			INNER JOIN actor ON film_actor.actor_id=actor.actor_id WHERE film_id= :film_id
			");
		*/
		//bind de los parametros // asigna los valores a la sentencia preparada
		$stmt->bindParam(':film_id', $id);
		// Especificar como se quieren devolver los datos
		$stmt->setFetchMode(PDO::FETCH_ASSOC);
		//Ejecutar la sentencia
		$stmt->execute();
		//numero de filas modificadas
		$row=$stmt->rowCount();

		//bucle para obtener cada una de las filas obtenidas
		$film = array();		
		while ($fila = $stmt->fetch()) {
			array_push($film, $fila);
			//echo "<br>";
			//print_r($elementos);
		}	
		$codigo='00';
		$mensaje="OK";
		$control=array('codigo'=>$codigo, 'mensaje'=> $mensaje);
		$respuesta=array($control, $film, $row);

	} catch (PDOException $e) {
		//echo $e->getCode().' '.$e->getMessage();
		if ($stmt->errorInfo()[1] == 1146) {
			$codigo=$stmt->errorInfo()[1];
			$mensaje='tabla no existe'.$e->getMessage();
		} else {
			$codigo=$e->getCode();
			$mensaje=$e->getMessage();
		}
		$respuesta=array('codigo'=>$codigo, 'mensaje'=> $mensaje);

	}catch (Exception $e) {
		$codigo=$e->getCode();
		$mensaje=$e->getMessage();
		$respuesta=array('codigo'=>$codigo, 'mensaje'=> $mensaje);

	}
	echo json_encode($respuesta);






 ?>