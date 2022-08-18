var input = d3.select('#selDataset').property("value")
console.log(input)

var filepath = "samples.json"

d3.json(".../Instructions/StarterCode/samples.json", function(data) {
    console.log(data);
});

function init() {
    trace = {
        x: [1,1,1,1,2,2,2,2,3,3],
        y: ["default", "default2","default3","default4","default5","default6","default7","default8","default9","default10"],
        type: "bar",
        orientation: "h",
        marker: {
            color: 'rgb(248, 194, 247)',
            line: {
                color: 'rgb(248, 194, 11)',
                width: 2
            }
        }
    };

    data = [trace]

    layout = {
        title: "Top 10 OTU per Individual",
    }

    Plotly.newPlot("bar", data, layout)
}



// d3.select("#selDataset").on("change", updatePlotly())

// init()

