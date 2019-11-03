//comprobar si llega el id del titular
//recuperar la url
var url=window.location.href;
//buscar si existe el parametro id
var posicionId=url.indexOf('film_id=');
//si no existe retornamos a la pantalla de titulares
if (posicionId==-1) {
	window.location.href = 'index.html';
} else {
	//si existe recuperamos el código de la pelicula
	var filmId=url.substring(posicionId+8);
	//alert (filmId);
}	

window.onload=function(){
	document.getElementById('volver').addEventListener('click', volveraConsulta);

}

buscar_film(filmId);
buscar_actores(filmId);

function buscar_film(id) {
	//alert ('buscar_film');

	//PDO - formateo datos o encapsulado de datos al servidor 
	//para enviar al servidor clave:pareja:valor
	//creamos un objeto
	var datos = new FormData();
	datos.append('film_id',id);
	//ajax - obtener relación de pacientes
	fetch ('buscar_film.php', {
		method: 'POST',
		body: datos
	})
	.then(function(respuesta) {
		if (respuesta.ok) {
			//cambiar el json a text, si queremos ver el error
			return respuesta.json();
		} else {
			throw "error en la petición AJAX",88;
		}
	})
	.then(function(respuesta) {
		//console.log(respuesta)
		//datos es un array js
		//alert (respuesta);
		control=respuesta[0];
		datos=respuesta[1];
		resultados="";
		//los datos obtenidos en el servidor son cargados en el formulario
		for (i in datos) {
			film_Id=datos[i]['film_id'];
			titulo=datos[i]['title'];
			lanzamiento=datos[i]['release_year'];
			duracion=datos[i]['length']; 
			clasificacion=datos[i]['rating'];
			//console.log(datos[i]);
			document.getElementById('titulo').innerHTML=titulo;
			document.getElementById('anyo').innerHTML=lanzamiento;
			document.getElementById('duracion').innerHTML=duracion;
			document.getElementById('clasificacion').innerHTML=clasificacion;
		}
		
		//console.log(control);	
		//console.log(datos);
	})
	.catch(function (error) {
		if (error.codigo!='00') {
			alert ('error:' + error.codigo + ' ' + error.mensaje);
		} else {alert (error);}

	})
}	

function buscar_actores(id) {
	//alert ('buscar_film');

	//PDO - formateo datos o encapsulado de datos al servidor 
	//para enviar al servidor clave:pareja:valor
	//creamos un objeto
	var datos = new FormData();
	datos.append('film_id',id);
	//ajax - obtener relación de pacientes
	fetch ('buscar_actores.php', {
		method: 'POST',
		body: datos
	})
	.then(function(respuesta) {
		if (respuesta.ok) {
			//cambiar el json a text, si queremos ver el error
			return respuesta.json();
		} else {
			throw "error en la petición AJAX",88;
		}
	})
	.then(function(respuesta) {
		console.log(respuesta)
		//datos es un array js
		//alert (respuesta);
		control=respuesta[0];
		if (control['codigo']!='00') {
			throw control['mensaje'], control['codigo'];
		}
		datos=respuesta[1];
		resultados="";
		resultados="<br><h4>ACTORES</h4>";
		//los datos obtenidos en el servidor son cargados en el formulario
		for (i in datos) {
			film_Id=datos[i]['film_id'];
			titulo=datos[i]['title'];
			nombreActor=datos[i]['first_name'];
			apellidosActor=datos[i]['last_name'];
			//console.log(datos[i]);
			resultados+="<p>";
			resultados+="" + nombreActor;
			resultados+=" " + apellidosActor;
			resultados+="</p>";
		}
		document.getElementById('actores').innerHTML=resultados;
		
		//console.log(control);	
		//console.log(datos);
	})
	.catch(function (error) {
		alert(error);
		if (error.codigo!='00') {
			alert ('error:' + error.codigo + ' ' + error.mensaje);
		} else {alert (error);}

	})
}

function volveraConsulta() {
	//alert ('volveraConsulta');
	window.location.href='index.html';
}

			