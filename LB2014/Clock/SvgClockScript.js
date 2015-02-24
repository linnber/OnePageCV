var width = 350,
	height = 350,
	radius = Math.min(width, height) / 2,
	spacing = .085;

var formatSecond = d3.time.format("%S"),
	formatMinute = d3.time.format("%M"),
	formatHour = d3.time.format("%H");

var color = d3.scale.linear()
	.range(["hsl(0,0%,20%)", "hsl(0,0%,95%)"])
	.interpolate(interpolateHsl);

var arc = d3.svg.arc()
	.startAngle(0)
	.endAngle(function(d) { return d.value * 2 * Math.PI; })
	.innerRadius(function(d) { return d.index * width; })
	.outerRadius(function(d) { return (d.index + spacing) * width; });

var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height)
	.append("g")
	.attr("transform", "translate(" + radius + "," + radius + ")");

//use the HrMinSec data to create g's. Enter returns reference to entering selection(data)
var field = svg.selectAll("g")
	.data(HrMinSec)
	.enter().append("g");

field.append("path");
field.append("text");
d3.transition().duration(0).each(tick);

d3.select(self.frameElement).style("height", height + "px");

function tick() {
	field = field
		.each(function(d) { this._value = d.value; })
		.data(HrMinSec)
		.each(function(d) { d.previousValue = this._value; });

	field.select("path")
		.transition()
		.ease("elastic")
		.attrTween("d", arcTween)
		.style("fill", function(d) {
			return color(d.value);
		});

	field.select("text")
		.attr("dy", function(d) { return d.value < .5 ? "-.5em" : "1em"; })
		.text(function(d) { return d.text; })
		.transition()
		.ease("elastic")
		.style("color", function(d) { return color((100 - d.value)); })
		.attr("transform", function(d) {
			var transl = -(d.index + spacing / 2) * width;
			return "rotate(" + 360 * d.value + ")"
				+ "translate(0," + transl + ")"
				+ "rotate(" + (d.value < .5 ? -90 : 90) + ")";
		});
	setTimeout(tick, 1000 - Date.now() % 1000);
}

function arcTween(d) {
	var i = d3.interpolateNumber(d.previousValue, d.value);
	return function(t) {
		d.value = i(t);
		return arc(d);
	};
}

function HrMinSec() {
	var now = new Date;
	return [
		{ index: .28, text: formatSecond(now), value: now.getSeconds() / 60 },
		{ index: .17, text: formatMinute(now), value: now.getMinutes() / 60 },
		{ index: .06, text: formatHour(now), value: now.getHours() / 24 }
	];
}

// Avoid shortest-path interpolation.
function interpolateHsl(a, b) {
	var i = d3.interpolateString(a, b);
	return function(t) {
		return d3.hsl(i(t));
	};
}