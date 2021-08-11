<!-- PHP Inicio -->
<?php 
date_default_timezone_set('America/Tegucigalpa');
setlocale (LC_TIME, "es_HN");
$registrado = date('l d/m/Y');
$v_dia = date('w');
$dia = "";
$dia2 = date('d');
$v_mes = date('m');
$mes = "";
$year = date('Y');
$fecha = "";
if ($v_dia == '0') {
  $dia = "Domingo";
}elseif ($v_dia == '1'){
  $dia = "Lunes";
}elseif ($v_dia == '2'){
  $dia = "Martes";
}elseif ($v_dia == '3'){
  $dia = "Miercoles";
}elseif ($v_dia == '4'){
  $dia = "Jueves";
}elseif ($v_dia == '5'){
  $dia = "Viernes";
}elseif ($v_dia == '6'){
  $dia = "Sabado";
}

if ($v_mes == '01') {
  $mes = "Enero";
}elseif ($v_mes == '02'){
  $mes = "Febrero";
}elseif ($v_mes == '03'){
  $mes = "Marzo";
}elseif ($v_mes == '04'){
  $mes = "Abril";
}elseif ($v_mes == '05'){
  $mes = "Mayo";
}elseif ($v_mes == '06'){
  $mes = "Junio";
}elseif ($v_mes == '07'){
  $mes = "Julio";
}elseif ($v_mes == '08'){
  $mes = "Agosto";
}elseif ($v_mes == '09'){
  $mes = "Septiembre";
}elseif ($v_mes == '10'){
  $mes = "Octubre";
}elseif ($v_mes == '11'){
  $mes = "Noviembre";
}elseif ($v_mes == '12'){
  $mes = "Diciembre";
}
$fecha = "Hoy es ".$dia." ".$dia2. " de ".$mes. " de ".$year;
?>
<!-- PHP Fin -->

<!-- HTML Inicio -->
<div class="card-footer bg-dark" allign="center" > 
<span ><?php echo $fecha; ?> - </span><span id="reloj">00 : 00 : 00</span><br>
</div>
<!-- HTML Fin -->

<!-- JAVASCRIPT Inicio -->
<script type="text/javascript">
  function actual() {
         fecha=new Date(); //Actualizar fecha.
         hora=fecha.getHours(); //hora actual
         minuto=fecha.getMinutes(); //minuto actual
         segundo=fecha.getSeconds(); //segundo actual
         if (hora<10) { //dos cifras para la hora
             hora="0"+hora;
             }
         if (minuto<10) { //dos cifras para el minuto
             minuto="0"+minuto;
             }
         if (segundo<10) { //dos cifras para el segundo
             segundo="0"+segundo;
             }
         //devolver los datos:
         mireloj = hora+" : "+minuto+" : "+segundo; 
         return mireloj; 
         }
  function actualizar() { //función del temporizador
   mihora=actual(); //recoger hora actual
   mireloj=document.getElementById("reloj"); //buscar elemento reloj
   mireloj.innerHTML=mihora; //incluir hora en elemento
   }
setInterval(actualizar,1000); //iniciar temporizador
</script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<!-- JAVASCRIPT Fin -->