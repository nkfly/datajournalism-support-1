function historgram(id,data,pie_data,color,type_name){
	
	var numset = [];
	var nameset = [];
	var padding = 45;
	var rect_padding = 3;
	var ypadding = 80;
	var ybotpadding = 10;
	var legend_height = padding;
	var icon_height = 20;
	var icon_width = 50;
	var legend_font_size = 15;
	for(var i=0;i<data.length;i++){
		numset.push(data[i][1]);
		//alert(data[i][1]);
		nameset.push(data[i][0]);
	}
	//alert(numset.length);
	var w = 500;
	var h = 420;
	var legend_width = w;
	var svg = d3.select(id)
			.append("svg")
			.attr("width",w)
			.attr("height",h);
	var xscale = d3.scale.linear()
			.domain([d3.max(numset),0])
			.range([w-2.5*padding,0]);
	var xaxis = d3.svg.axis();
	xaxis.scale(xscale)
		.ticks(10)
		.orient("top");
	svg.append("g")
		.attr("class","x axis")
		.attr("transform", "translate(" + padding + ","+ (h-padding/2) +")")
		.call(xaxis);
	
	var rect = svg.selectAll("rect")
                        .data(numset)
                        .enter()
                        .append("rect")
			.attr("x",padding)
                        .attr("y",function(d,i){ return i*((h-2*padding)/numset.length) + padding;})
                        .attr("height",((h-2*padding)/(numset.length) - rect_padding))
                        .attr("width",function(d){return xscale(d);})
                        .on("mouseover",function(d,i){
                                mouseover(d,i);
                        })
                        .on("mouseout",function(){
                                d3.select("#tooltip1")
                                        .style("display","None");
                        })
                        .attr("fill",function(d,i){
                                return color;
                        });
	var num_text = svg.selectAll("text.values")
			.data(numset)
			.enter()
			.append("text")
			.text(function(d){
				return d;
			})
			.attr("x",function(d){return (padding + xscale(d));})
                        .attr("y",function(d,i){ 
				return i*((h-2*padding)/numset.length)+padding + (h-2*padding)/(numset.length)-rect_padding;
				//return h-padding/2;
			})
			.attr("fill","black")
	                .attr("font-size","13");
	
	var text = svg.selectAll("text.names")
        	.data(nameset)
                .enter()
                .append("text")
                .text(function(d){return d;})
		.attr("x",0)
                .attr("y",function(d,i){ return i*((h-2*padding)/numset.length)+padding + (h-2*padding)/(numset.length)-2.5*rect_padding;})
                .attr("fill","black")
                .attr("font-size","15");
	var color = d3.scale.category10();
	var legend = svg.append("g")
                        .attr("class", "legend")
                        .attr("height", legend_height)
                        .attr("width", legend_width);
        var legend_icon = legend.append("rect")
		.attr("x",legend_width - icon_width - 10*legend_font_size)
		.attr("y",padding/5)
                .attr("width", icon_width)
                .attr("height", icon_height)
                .style("fill", function(){
			return color(0);
		});
	var legend_text = legend.append("text")
		.attr("x",legend_width - icon_width - 5*legend_font_size)
                .attr("y",padding/5 + legend_font_size)
		.attr("fill","black")
		.text("研究所以上")
                .attr("font-size",legend_font_size);
	var hg = {};
	hg.update = function(ndata,color,typename){
	    var nameset = [];
	    var numset = [];
	    for(var i=0;i<ndata.length;i++){
                numset.push(ndata[i][1]);
                //alert(data[i][1]);
                nameset.push(ndata[i][0]);
	        }

            // update the domain of the y-axis map to reflect change in frequencies.
            //y.domain([0, d3.max(ndata, function(d) { return d[1]; })]);
            xscale.domain([d3.max(numset),0]).range([w-2.5*padding,0]);
		//range([w-padding,0]);
            // Attach the new data to the bars.
            //var bars = svg.selectAll(".bar").data(nD);
            
            // transition the height and color of rectangles.
            svg.selectAll("rect").data(numset).transition().duration(500)
                //.attr("y", function(d,i){ return i*((h-padding)/numset.length)+padding;})
                .attr("width",function(d){return xscale(d);})
                .attr("fill", color);
	    d3.select("#type").text(function(d){return typename + ":"});
	    svg.select(".x.axis")
		.transition()
		.duration(500)
		.call(xaxis);
	    num_text.data(numset)
		.transition()
		.duration(500)
		.attr("x",function(d){return (padding + xscale(d));})
		.text(function(d){
			return d;
		});
	    legend_icon
		.transition()
		.duration(500)
		.style("fill",color);
	    legend_text.text(typename);
        }
	function mouseover(d,i){
		d3.select("#dis_name")
                .text(nameset[i]);	
                pie.update(pie_data[i]);
	}
	//alert("fuck");
	return hg;
	
}
function piechart(id,data,his_data,type_list){
	var w = 340;
	var h = 340;
	var outerRadius = w/2;
	var innerRadius = 0;
	var r = Math.min(w,h) / 2;
	var numset = [];
        var nameset = [];
	var font_size = 15;
        nameset.push(data[0]);
        numset = [data[1],data[2],data[3],data[4]];
	var color = d3.scale.category10();
	var pie = d3.layout.pie()
                   .sort(null);
	var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
	var svg = d3.select(id).append("svg")
                           .attr("width", w)
                           .attr("height", h)
                           .append("g")
                           .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");
	var path = svg.selectAll("path").data(pie(numset))
                           .enter().append("path")
                           .attr("fill", function(d,i){
				return color(i);
			   })
                           .attr("d", arc)
			   .on("mouseover",function(d,i){
					hg.update(his_data[i],color(i),type_list[i]);	
				})
                           .each(function(d) { this._current = d; });
	var text = svg.selectAll("text") 
			.data(pie(numset))
			.enter()
			.append("text")
			.attr("text-anchor","middle")
			.attr("x",function(d){
				return arc.centroid(d)[0];
			})
			.attr("y",function(d){
				return arc.centroid(d)[1];
			})
			.text(function(d,i){
				if(numset[i]>0){
					return numset[i] + '%';	
				}
			})
			.attr("font-size",font_size)
               	 	.attr("stroke","black");
			
	var pc = {};
        pc.update = function(ndata){
            var numset = [];
	    var nameset = [ndata[0]];
            numset = [ndata[1],ndata[2],ndata[3],ndata[4]];
            path = path.data(pie(numset))
               .attr("fill", function(d,i) {return color(i);});
	    path.transition().duration(500).attrTween("d", function(a) {
         	var i = d3.interpolate(this._current, a);
             	//k = d3.interpolate(arc.outerRadius()(), newRadius);
         	this._current = i(0);
         	return function(t) {
             		return  arc(i(t));
         	};
    		});    
		text.data(pie(numset))
			.transition()
			.duration(500)
			.text(function(d,i){
				if(numset[i]>0){
					return numset[i] + "%";
				}
			})
			.attr("x",function(d){
                                return arc.centroid(d)[0];
                        })
                        .attr("y",function(d){
                                return arc.centroid(d)[1];
                        });
			/*
			.attr("transform", function(d) {
                                return "translate(" + arc.centroid(d) + ")";
                        });
			*/
        } 
	return pc;	
}
function legend(id,type_list){
	var w = 200;
	var h = 200;
	var legend_height = 20;
	var legend_width = 50;
	var legend_padding = 10;
	var padding = 50;
	var text_padding = 10;
	var color = d3.scale.category10();
	var font_size = 13;
	var svg = d3.select(id)
			.append("svg")
			.attr("width",w)
			.attr("height",h);
	var legend = svg.append("g")
  			.attr("class", "legend")
			.attr("x",200)
 			.attr("height", h)
  			.attr("width", w);
	legend.selectAll("rect")
		.data(type_list)
		.enter()
		.append("rect")
		.attr("x",padding)
		.attr("y",function(d,i){
			return padding + i*((h-2*padding)/type_list.length);
		})
  		.attr("width", legend_width)
  		.attr("height", (((h-2*padding)/type_list.length) - legend_padding))
  		.style("fill", function(d,i){
			return color(i);
		});
	
	legend.selectAll("text")
		.data(type_list)
		.enter()
		.append("text")
		.attr("x",padding + legend_width + text_padding)
                .attr("y",function(d,i){
                        return padding + i*((h-2*padding)/type_list.length) + font_size;
                })
  		.text(function(d){
			return d;
		})
		.attr("font-family","sans-serif")
      		.attr("font-size",font_size)
      		.attr("stroke","black");
	
}
