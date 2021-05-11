//Cargue de datos
Promise.all([
    d3.json("https://raw.githubusercontent.com/shperez23/Unir/main/trimestrales.json"),
    d3.json("https://raw.githubusercontent.com/shperez23/Unir/main/anuales.json")
  ]).then(function(datos) {

    //console.log(datos) 
    //filtro los hurtos desde el 2016 
    var dsTrimestrales = filtroHurtos(datos[0].Datos.Metricas[0].Datos); 
    //console.log(dsTrimestrales);

    //totalizo los hurtos por año
    var dsHurtosPorAnio = datos[1].Datos.Metricas[0].Datos;  
    //console.log(dsHurtosPorAnio);

    //Personalización de márgenes en el área de trabajo
	var margin = {top: 20, right: 40, bottom: 90, left: 60},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

   


//************* Inicio primero grafico ******************/
 //Creación de objeto SVG para el dvHurtos
 var svg = d3.select("#dvBody")
 .append("svg")
 .attr("width", width + margin.left + margin.right)
 .attr("height", height + margin.top + margin.bottom)
 .append("g")
 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Titulo de la grafica del eje x del grafico  
svg.append("text")
.attr("x", -60)
.attr("y", -5)
.text("Total de hurtos")
 

//consideramos un scaleLinear para dibujar el grid
var x_cuadros = d3.scaleLinear()
.domain(d3.extent(dsHurtosPorAnio, d=>d.anio))   
.range([ 0, width ]); 


//visualización del eje horizontal (X) para la gráfica de barras
 
var xBar = d3.scaleBand()
.range([ 0, width])
.domain(dsHurtosPorAnio.map(function(d) { return d.anio }))
.padding(0); 


//eje pintamos el eje x  

svg.append("g")  
.attr("class", "ejes") 
.style("font-size", "12")
.attr("transform", "translate(0," + (height) + ")")  
.call(d3.axisBottom(xBar))


//visualización del eje vertical (Y) para la gráfica de barras
//obtenemos los valores maximos y minimos de nuestro set de datos
var yma2 = d3.max(dsHurtosPorAnio, function(d) { return  d.valor; }) * 1.5;
var ymi2 = d3.min(dsHurtosPorAnio, function(d) { return  d.valor; }) / 2;

var yBar = d3.scaleLinear()
.domain([ymi2,   yma2])
.range([ height,0 ]);

 //pintamos el eje Y
svg.append("g")
.attr("class", "ejes")
.style("font-size", "12")
.call(d3.axisLeft(yBar));


//agregamos el grid a los ejes x, y

grid = g => g
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.1)    
    .call(g => g.append("g")
      .selectAll("line")
      .data(x_cuadros.ticks())
      .join("line") 
        .attr("y1", margin.top -17)
        .attr("y2", height))
    .call(g => g.append("g")
      .selectAll("line")
      .data(yBar.ticks())
      .join("line")
        .attr("y1", d => 0.5 + yBar(d))
        .attr("y2", d => 0.5 + yBar(d))
        .attr("x1", margin.left - 60)
        .attr("x2", width ));

svg.append("g")
.call(grid);




//creamos los eventos 

//Creación del tooltip
var TooltipBar = d3.select("#dvBody")
       .append("div")
       .attr("class","tooltip")

//Función para el tooltip 
//cuando el cursor se posiciona sobre una barra del gráfico dejándolo demarcado
var mouseoverBar = function(d) {
    TooltipBar.style("opacity", 0.8)
    d3.select(this)
    .style("stroke", "black") 
     
}

//Función para el tootltip 
//cuando el cursor se posiciona sobre un punto del gráfico mostrando la información
var mousemoveBar = function(d) {
    TooltipBar.html("<p>A&ntilde;o: " + d.anio + "<br/>Variación de hurtos: <b>"+ d.valor +"</b></p>")				
  .style ("top", d3.event.pageY + 20 + "px")
  .style ("left", d3.event.pageX + 20 + "px")
  .style("opacity",0.8)
  .transition()
  
}

//Función para borrar el tooltip cuando el cursor se aleja
var mouseleaveBar = function(d) {
    TooltipBar.style("opacity", 0)
    d3.select(this)
    .style("stroke", "none") 
}
 


//pintamos las barras y asignamos los eventos
 
/**/

svg.append("g")
.attr("fill",  "#09689E")
.selectAll("rect")
.data(dsHurtosPorAnio)
.enter()
.append("rect")
.on("mouseover", mouseoverBar) 
.on("mousemove", d => {
    pintarLinea(d.anio)
    mousemoveBar(d)})
.on("mouseleave", mouseleaveBar)

.join("rect")
.attr("x", function(d) { return xBar(d.anio); })
.attr("y", function(d) { return yBar(d.valor); }) 
.attr("width", xBar.bandwidth() - 20)
.attr("height", function(d) { return height - yBar(d.valor); })
.attr("fill", function(d) {    
    switch(d.anio)
    {
        case 2016:
            return "#1E90FF"
        case 2017:
        return "#00BFFF"
        case 2018:
        return "#87CEFA"
        case 2019:
        return "#ADD8E6"
        case 2020:
        return "#B0C4DE"
        default:
        return "000"; 
    }


});

//label del eje x del grafico de barras
svg.append("text")
.attr("x", 350)
.attr("y", 530)
.text("Años")

 
//************* segundo grafico ******************/
 

//funcion para pintar la grafica de lineas
function pintarLinea(vanio) {
    
    d3.select("#dvVariacion").attr("style", "opacity:1");    
    d3.select("#dvBodyVariacion").selectAll('*').remove();
    var svgLinea = d3.select("#dvBodyVariacion")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    //Titulo de la grafica del eje x del grafico  
    svgLinea.append("text")
    .attr("x", -60)
    .attr("y", -5)
    .text("Variación de hurtos")


    var xLinea = d3.scaleLinear()
    .domain(d3.extent(dsTrimestrales, d=>d.numTrimestre))   
    .range([ 0, width ]); 


    //visualización del eje horizontal (X) para la gráfica de lineas
    

    //eje pintamos el eje x  
    var formatNumber = d3.format("d");
    svgLinea.append("g")  
    .attr("class",function(d) {
        return d % 1 ? "ejes" :  null;
    })
    .style("font-size", "12")
    .attr("transform", "translate(0," + (height) + ")")  
    .call(d3.axisBottom(xLinea).tickFormat( function(d) {
        return d % 1 ? null : d;
    } ))


    //visualización del eje vertical (Y) para la gráfica de barras
    //obtenemos los valores maximos y minimos de nuestro set de datos
    var ymaxLinea = d3.max(dsTrimestrales, function(d) { return d.valor; }) * 10;
    var yminLinea = d3.min(dsTrimestrales, function(d) { return d.valor; });
    //console.log(ymaxLinea);
    //console.log(yminLinea);
    var yLinea = d3.scaleLinear()
    .domain([yminLinea,   ymaxLinea])
    .range([height , 0]);

    //pintamos el eje Y
    svgLinea.append("g")
    .attr("class", "ejes")
    .style("font-size", "12")
    .call(d3.axisLeft(yLinea));


    //agregamos el grid a los ejes x, y
    gridLinea = p => p
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.1)    
        .call(p => p.append("g")
        .selectAll("line")
        .data(xLinea.ticks())
        .join("line")
            .attr("x1", d => 0.5 + xLinea(d))
            .attr("x2", d => 0.5 + xLinea(d))
            .attr("y1", margin.top -10)
            .attr("y2", height))
        .call(p => p.append("g")
        .selectAll("line")
        .data(yLinea.ticks())
        .join("line")
            .attr("y1", d => 0.5 + yLinea(d))
            .attr("y2", d => 0.5 + yLinea(d))
            .attr("x1", margin.left - 70)
            .attr("x2", width ));

    svgLinea.append("g")
    .call(gridLinea);
    

    //dibujamos linea divisora x = 0

    svgLinea.append("line")          
        .style("stroke", "black")  
        .attr("stroke-dasharray", "10, 5")
        .attr("x1", 0)      
        .attr("y1", 152)      
        .attr("x2", 800)     
        .attr("y2", 152); 

    //agregamos los eventos

    //Creación del segundo tooltip
    var TooltipLine = d3.select("#dvBodyVariacion")
        .append("div")
        .attr("class","tooltip")

    //Función para el segundo tooltip 
    //cuando el cursor se posiciona sobre una barra del gráfico dejándolo demarcado
    var mouseoverLine = function(d) {
        TooltipLine.style("opacity", 0.8)
        d3.select(this)
        .style("stroke", "black") 
    }

    //Función para el segundo tootltip 
    //cuando el cursor se posiciona sobre un punto del gráfico mostrando la información
    var mousemoveLine = function(d) {
        TooltipLine.html("<p>A&ntilde;o: " + d.anio + "<br/>Variación de hurtos: <b>"+ d.valor +"</b></p>")				
    .style ("top", d3.event.pageY + 20 + "px")
    .style ("left", d3.event.pageX + 20 + "px")
    .style("opacity",0.8)
    .transition()
    
    }

    //Función para borrar el segundo tooltip cuando el cursor se aleja
    var mouseleaveLine = function(d) {
        TooltipLine.style("opacity", 0)
        d3.select(this)
        .style("stroke", "none") 
    }

 

 
    dsSeleccion = dsTrimestrales.filter(function (d) { return d.anio === vanio; });	
  
    //d3.select("#path").selectAll('*').remove();
    
    svgLinea.append("path")	    
    .datum(dsSeleccion)
    //.exit()
    .transition()
   // .delay(20)
    .duration(10000)    
    .ease(d3.easeLinear)   
    .attr("fill", "none")
    .attr("stroke", function() {             
            switch(vanio)
            {
                case 2016:
                    return "#1E90FF"
                case 2017:
                return "#00BFFF"
                case 2018:
                return "#87CEFA"
                case 2019:
                return "#ADD8E6"
                case 2020:
                return "#B0C4DE"
                default:
                return "nano"; 
            }
        })	     
    //.attr("stroke", "#0B64B3")
    .attr("stroke-width", 3)    
    .attr("d", d3.line()
        .x(function(d) { return xLinea(d.numTrimestre ) })		
        .y(function(d) { return yLinea(d.valor ) })
    )   
    .remove();     
    
    

    
    
    //asociamos los eventos al grafico    
    svgLinea.append("g")    
    .selectAll("dot")
    .data(dsSeleccion)
    .enter()   
    .append("circle")
    .attr("cx", function(d) { return xLinea(d.numTrimestre) } )
    .attr("cy", function(d) { return yLinea(d.valor) } )
    .attr("r", 5)  
    .attr("fill", function() {             
        switch(vanio)
        {
            case 2016:
                return "#1E90FF"
            case 2017:
            return "#00BFFF"
            case 2018:
            return "#87CEFA"
            case 2019:
            return "#ADD8E6"
            case 2020:
            return "#B0C4DE"
            default:
            return "nano"; 
        }
    }) 
    .on("mouseover", mouseoverLine) 
    .on("mousemove", d=> { mousemoveLine(d)})
    .on("mouseleave",mouseleaveLine)    
    .transition()
    .duration(10000) 
    .remove();

   //label del eje x del grafico de lineas
   svgLinea.append("text")
   .attr("x", 350)
   .attr("y", 530)
   .text("Trimestres")
 

  } 
 
 
    
//Filtramos los datos desde el año 2016 para nuestra representación grafica
function filtroHurtos(datosEA){
    var resultados=[];
    datosEA.forEach(UnificarDatos) 
    //Función que nos permite recorrer los datos
    function UnificarDatos(item, index, arr) { 
        if (parseInt(item.Agno) >= 2016 ) { 

            var resultadoSuma = {
                trimestre: item.Periodo,
                numTrimestre: parseInt(item.Periodo.substring(item.Periodo.length -1, item.Periodo.length)),
                anio: parseInt(item.Agno),
                valor: parseInt(item.Valor)  
            } 

            resultados.push(resultadoSuma)
        }  
    }
    return resultados
}
 


/*funciones */
 


 
});  