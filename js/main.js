//javascript // principal

//variables globales
resultados="";
mensaje="";
pagina=0;

window.onload=function(){
	localStorage.removeItem("pagina");
	localStorage.removeItem("filtro");
	document.getElementById('buscar').addEventListener('keyup', buscarContenido);
	if (!localStorage.pagina) {
		localStorage.setItem('pagina','1');
	} else {
		pagina=localStorage.getItem('pagina');
	}
	
	buscarContenido();
}

function buscarContenido() {
	//alert ('buscarContenido');
	pagina='1';
	filtro="";
	if (!localStorage.pagina) {
		localStorage.setItem('pagina','1');
	} else {
		pagina=localStorage.getItem('pagina');
	}
	
	//palabra a buscar
	texto=document.getElementById('buscar').value;
	if (texto=='' || texto==null) {
		return
	}
	if (!localStorage.filtro) {
		localStorage.setItem('filtro','');
	} else {
		filtro=localStorage.getItem('filtro');
	}
	if (filtro!=texto) {
		localStorage.setItem('pagina','1');
		localStorage.setItem('filtro',texto);
		pagina='1';
	}
	
	//PDO - formateo datos o encapsulado de datos al servidor 
	//para enviar al servidor clave:pareja:valor
	//creamos un objeto
	var datos = new FormData();
	datos.append('buscar',texto);
	datos.append('pagina',pagina);
	//ajax - obtener relación de pacientes
	fetch ('buscarContenido.php', {
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
		//alert (respuesta);
		//console.log(respuesta);
		
		codigo=respuesta[0].codigo;
		mensaje=respuesta[0].mensaje;

		if (codigo!='00') {
			throw mensaje, codigo;
		}
		datos=respuesta[1];
		mostrar_lista(datos);
		//montar los enlaces de paginación
		paginas=respuesta[2];
		mostrarPaginas(paginas);

	})
	.catch(function (error) {
		alert (error);
		if (error!='00') {
			alert (`error: ${error} - ${mensaje}`);
		}
	})

}

function mostrar_lista(datos) {
	resultados="";
	//los datos obtenidos en el servidor son cargados en el formulario
	for (i in datos) {
		film_Id=datos[i]['film_id'];
		titulo=datos[i]['title'];
		lanzamiento=datos[i]['release_year'];
		duracion=datos[i]['length']; 
		clasificacion=datos[i]['rating'];
		//console.log(datos[i]);
		resultados+="<p>";
		resultados+=" " + film_Id;
		resultados+=" | " + "<a href='detalle.html?film_id=" + film_Id + "'>" + titulo + "</a>";
		resultados+=" | " + lanzamiento;
		resultados+=" | " + duracion;
		resultados+=" | " + clasificacion;	
		resultados+="</p>";
	}
	document.getElementById('resultados').innerHTML=resultados;
	
	//console.log(datos);

}	

//montar los listener 
function mostrarPaginas(paginas) {
	var enlaces = '';
	for (i=1; i <= paginas; i++) {
		if (i==pagina) {
			enlaces+= "<span style='font-weight:bold; font-size:large;'>" + i + "</span>&nbsp&nbsp&nbsp ";
		} else {
			enlaces+= "<span> " + i + "</span>&nbsp&nbsp&nbsp ";
		}
		
	}
	document.getElementById('paginas').innerHTML = enlaces;
	//activar los listener para la paginación (id + span)
	var span=document.querySelectorAll('#paginas span');

	for (i=0; i<span.length; i++) {
		span[i].addEventListener('click', function() {
				//recuperar el número de página 
				pagina=this.innerText;
				//buscar nuevo contenido
				localStorage.setItem('pagina',pagina);
				buscarContenido();
		})
	}
}	