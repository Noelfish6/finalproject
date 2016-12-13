 var width = 700;
    var height = 580;

    var svg = d3.select( ".canvas" )
        .select( "svg" );
    var g = svg.append( "g" ).attr("class", "map");

    var albersProjection = d3.geoAlbers()
        .scale( 190000 )
        .rotate( [71.057,0] )
        .center( [0, 42.313] )
        .translate( [width/2,height/2] );

//Mapping
    var geoPath = d3.geoPath()
        .projection( albersProjection );

    g.selectAll( "path" )
        .data( neighborhoods_json.features )
        .enter()
        .append( "path" )
        .attr("id", function(d){
            return d.properties.Name.replace(" ", "").toLowerCase(); 
        })
        .attr( "fill", "#ccc" )
        .attr( "stroke", "#333")
        .attr( "d", geoPath );

var plot = svg.append("g");


//d3.map for data
var rate = d3.map();
var masterData;

d3.queue()
    .defer(d3.csv, 'day20_assets/boston_listings_cleaned.csv', parseData)
    .await(function(err, data){
        console.log(data[0]);
        masterData = data;
        // counties.on('click', function(d){
        //     console.log(d.properties.STATE + d.properties.COUNTY);
        // });
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
            var x = plot.selectAll("circle")
                    .data(data, function(d){return d.roomId});
                    x.exit().remove();
                    x.enter()
                    .append("circle")
                    .attr("transform", function(d){
                        return "translate("+albersProjection([d.longitude, d.latitude])+")"; 
                    })
                    .merge(x)
                    .transition().duration(1000)
                    .attr("r", function(d){ return d.price/500; });
            break;
        case 2:
            var x = plot.selectAll("circle")
                .data(data, function(d){return d.roomId});
                x.exit().remove();
                x.enter()
                .append("circle")
                .attr("transform", function(d){
                    return "translate("+albersProjection([d.longitude, d.latitude])+")"; 
                })
                .merge(x)
                .transition().duration(1000)
                .attr("r", function(d){ return d.reviews/50; });
            break;
        case 3:
            var x = plot.selectAll("circle")
                    .data(data, function(d){return d.roomId});
                    x.exit().remove();
                    x.enter()
                    .append("circle")
                    .attr("transform", function(d){
                        return "translate("+albersProjection([d.longitude, d.latitude])+")"; 
                    })
                    .merge(x)
                    .transition().duration(1000)
                    .attr("r", function(d){ return d.bedrooms; });
            break;
    }


}


function getData(slideNumber) {
    switch (slideNumber) {
        case 1:
            console.log("one");
            return masterData;
        case 2:
            console.log("two")
            // Write the code to filter data for slide 2
            // call draw with filtered data
            return masterData;
        case 3:
            console.log('three')
            // data filtering
            // return filteredData;
            return masterData
            break;
    }

    // if (slideNumber == 1) {
    //     console.log("one")
    // } else if (slideNumber == 2) {
    //     console.log("two")
    // }
}


function updateSlide(slideNumber) {
    var data = getData(slideNumber);
    draw(data, slideNumber);
}