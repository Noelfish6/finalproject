    var width = 700;
    var height = 580;

    var svg = d3.select( ".canvas" )
        .select( "svg" );
    var g = svg.append( "g" ).attr("class", "map");

    var albersProjection = d3.geoAlbers()
        .scale( 90000 )
        .rotate( [71.057,0] )
        .center( [0, 42.413] )
        .translate( [width/2,height/2] );

//Mapping
    var geoPath = d3.geoPath()
        .projection( albersProjection );

    g.selectAll( "path" )
        .data( ma_towns.features )
        .enter()
        .append( "path" )
        .attr("id", function(d){
            return d.properties.TOWN.replace(" ", "").toLowerCase(); 
        })
        .style( "fill", "white" )
        .style('opacity', .7)
        .style( "stroke", "#333")
        .attr( "d", geoPath )

var plot = svg.append("g");


//d3.map for data
var rate = d3.map();
var masterData;


//scale
var scaleColor1 = d3.scaleOrdinal()
                    .range(['#7DB9DE','#261E47','#7B90D2']);

var scaleColor2 = d3.scaleOrdinal()
                    .range(['#7DB9DE','#261E47','#7B90D2']);

var scalePrice = d3.scaleLinear()
                    .range([50, width]);

var scaleReviews = d3.scaleLinear()
                     .range([height,10]);

var scaleRadius = d3.scaleLinear()
                    .range([0, 10])
var maxPrice;

var maxReviews;

var scaleX, scaleY, scaleSize;


d3.queue()
    .defer(d3.csv, 'day20_assets/boston_listings_cleaned.csv', parseData)
    .await(function(err, data){
        console.log(data[0]);
        masterData = data;

        maxPrice = d3.max(data, function(d){return d.price});
        minPrice = d3.min(data, function(d){return d.price});

        scaleColor1.domain(["cheap","expensive","average"]);

        scalePrice.domain(d3.extent(data,function(d){
            return d.price
        }));

        maxReviews = d3.max(data, function(d){return d.reviews});
        minReviews = d3.min(data, function(d){return d.reviews});

        scaleColor2.domain(["low","high","medium"]);

        scaleReviews.domain(d3.extent(data, function(d){
            return d.reviews
        }));

        scaleRadius.domain(d3.extent(data, function(d){
            return d.price
        }));

//another scale
        scaleX = d3.scalePow()
            .exponent(.5)
            .domain([minPrice, maxPrice])
            .range([0,width]);

        scaleY = d3.scalePow()
            .exponent(.5)
            .domain([minReviews, maxReviews])
            .range([height,0]);


        updateSlide(1);
    });





function parseData(d){
    if (d.town == "") { return; }
    return {
        x:+d.X,
        y:+d.Y,
        roomId:+d.room_id,
        hostId:+d.host_id,
        roomType:d.room_type,
        country:d.country,
        city:d.city,
        neighborhood:d.neighborho,
        address:d.address,
        reviews:+d.reviews,
        bedrooms:+d.bedrooms,
        price:+d.price,
        latitude:+d.latitude,
        longitude:+d.longitude,
        town:d.town
    };
}






function draw(data, slideNumber) {
    switch (slideNumber) {
        case 1:
        d3.select('.map').selectAll('path').style('opacity', .7)
        d3.selectAll('.axis').remove()
            var x = plot.selectAll(".case")
                    .data(data, function(d){return d.roomId});
                    x.exit().remove();
                    x.enter()
                    .append("circle").attr('class','case')
                    .merge(x)
                    .on("mouseenter", null)
                    .on("mouseleave", null)
                    // .attr("transform", function(d){
                    //     return "translate("+albersProjection([d.longitude, d.latitude])+")"; 
                    // })
                    .attr('cx',function(d){var location=albersProjection([d.longitude, d.latitude]);return location[0]})
                    .attr('cy',function(d){var location=albersProjection([d.longitude, d.latitude]);return location[1]})
                    .transition().duration(1000)
                    .attr("r", function(d){ return d.price/80; })
                    .style('opacity', .7)
                    .style('fill', function(d){
                        if (d.price < maxPrice/3) {
                            return scaleColor1("cheap");
                        } else if (d.price < maxPrice*(2/3)) {
                            return scaleColor1("average");
                        } else {
                            return scaleColor1("expensive");
                        }
                    });


            break;

        case 2:
            d3.select('.map').selectAll('path').style('opacity', .7)
            d3.selectAll('.axis').remove()
            var x = plot.selectAll(".case")
                .data(data, function(d){return d.roomId});
                x.exit().remove();
                x.enter()
                .append("circle").attr('class','case')
                .merge(x)
                .on("mouseenter", null)
                .on("mouseleave", null)
                .attr('cx',function(d){var location=albersProjection([d.longitude, d.latitude]);return location[0]})
                .attr('cy',function(d){var location=albersProjection([d.longitude, d.latitude]);return location[1]})
                .transition().duration(1000)
                .attr("r", function(d){ return d.reviews/18; })
                .style('fill',function(d){
                        if (d.reviews < maxReviews/3) {
                            return scaleColor2("low");
                        } else if (d.reviews < maxReviews*(2/3)) {
                            return scaleColor2("medium");
                        } else {
                            return scaleColor2("high");}
                });


            break;

        case 3:
            d3.select('.map').selectAll('path').transition().duration(1000).style('opacity', 0)
            var x = plot
                    .selectAll(".case")
                    .data(data, function(d){return d.roomId});
                    x.exit().remove();
                    x.enter()
                    .append("circle").attr('class','case')
                    .merge(x)
                    .on("mouseenter", function(d){
                        
                        d3.selectAll('.case')
                            .style("opacity", function(e){
                                return d.town == e.town ? 1 : 0.2;
                            })
                    })
                    .on("mouseleave", function(d){

                    })
                    .transition().duration(2000)
                    .attr('r', function(d){return d.reviews})
                    .attr('cx',function(d){return scalePrice(d.price)+20})
                    .attr('cy',function(d){return scaleReviews(d.reviews)+180})
                    .style('fill','#7B90D2');

            var axisX = d3.axisBottom()
                .scale(scaleX)
                .tickSize(-height);
            var axisY = d3.axisLeft()
                .scale(scaleY)
                .tickSize(-width);
            plot.append('g').attr('class','axis axis-x')
                .attr('transform','translate(60,'+(height+180)+')')
                //.attr('trasnform','translate(200,0)')
                .call(axisX);
            plot.append('g').attr('class','axis axis-y')
                .attr('transform','translate(60,180)')
                .call(axisY);

//Problems:

//how to change the color of scale?

//add tooltip

//circle size cannot reflect the amounts of reviews

        
            break;
    }


}


function getData(slideNumber) {
    switch (slideNumber) {
        case 1:
            return masterData;
        case 2:
            return masterData;
        case 3:
            return masterData
            break;
    }

}


function updateSlide(slideNumber) {
    var data = getData(slideNumber);
    draw(data, slideNumber);
}