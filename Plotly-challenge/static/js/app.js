
var filepath = "../Plotly-challenge/samples.json";
const dataPromise = d3.json(filepath)

////////////////////////////////////////////////////////////////////////////

function dropDownList () {
    dataPromise.then(function(data) {
        arr = []
        var ids = data[0].names;
        for(var x = 0; x < ids.length; x++) {
            arr.push(ids[x])
        } 
        // console.log(`oppyyysss: ${arr}`)
        var dropDown = ""
        for (var x = 0; x < arr.length; x++) {
            dropDown += '<option>' + arr[x] + '</option>'
        }
        // console.log(arr)
        document.getElementById("selDataset").innerHTML = dropDown;
        })    
}

dropDownList()

////////////////////////////////////////////////////////////////////////////

function init() {

    // BAR CHART

    var trace1 = {
        x: [1,1,1,1,2,2,2,2,3,3],
        y: ["default", "default2","default3","default4","default5","default6","default7","default8","default9","default10"],
        // text: ["default", "default2","default3","default4","default5","default6","default7","default8","default9","default10"],
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

    var data1 = [trace1]

    var layout1 = {
        title: "Top 10 OTU per Individual",
        padding: 0,
        margin: 0,
        yaxis: {
            showticklabels: true
        },
        width: 600,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    }

    Plotly.newPlot("bar", data1, layout1)


    // BUBBLE CHART
    var trace2 = {
        x: [1,2,3,4,5,6,7,8,9,10],
        y: [1,2,2,4,1,8,4,9,9,7],
        text: ["default", "default2","default3","default4","default5","default6","default7","default8","default9","default10"],
        mode: "markers",
        marker: {
            colorscale: [[0, 'rgb(253, 255, 0)'], [1, 'rgb(253, 0, 241)']],
            color: [1,1,1,1,2,2,2,2,3,3],
            size: [10,10,10,10,20,20,20,20,30,30],
            
        },
    };

    var data2 = [trace2]

    var layout2 = {
        showlegend: false,
        height: 400,
        width: 1200,
        paper_bgcolor: 'rgb(255, 230, 255)',
        plot_bgcolor:  'rgb(255, 230, 255)'
    };

    Plotly.newPlot("bubble", data2, layout2)

    // GAUGE CHART
    var trace3 = {
          domain: { x: [0, 1], y: [0, 1] },
          value: 5,
          title: { text: "Belly Button Washing Frequency"},
          type: "indicator",
          mode: "gauge+number",
          delta: { reference: 5 },
          gauge: { 
            axis: { range: [null, 9] },
            bar: {color: "hotpink"},
            steps: [
                { range: [0, 9], color: "greenyellow" },
              ]}
        };
    
    var layout3 = {
         width: 600, 
         height: 400,
         paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
         
    };

    data3 = [trace3]

    Plotly.newPlot("gauge", data3, layout3)

    


};

////////////////////////////////////////////////////////////////////////////

d3.select("#selDataset").on("change", optionChanged())

function optionChanged() {
    dataPromise.then(function(data) {
        
        // PRINT DATA
        console.log(data)

        // GRAB INPUT VALUE
        var input = d3.select('#selDataset').property("value")
    
        // GET ARRAY OF NAMEIDS
        var names = data[0].names
        // console.log(names)
    
        // GET NAME AND INDEX
        var selectName = names.filter(d => d == input)
        // console.log(selectName)
        var selectIndex = names.findIndex(d => d == input)
        // console.log(selectIndex)
    
        // GET SAMPLE DATA AND FILTER BY NAME
        var samples = data[0].samples
        console.log(data[0].samples)
        var selectSample = samples.filter(d => d.id == selectName)
        console.log(selectSample)
    
        // GET OTU_IDS, SAMPLE_VALUES AND OTU_LABELS
        var otu_ids = selectSample[0].otu_ids
        console.log(`otu ids: ${otu_ids}`)
        var sample_values = selectSample[0].sample_values
        console.log(`sample_values: ${sample_values}`)
        var otu_labels = selectSample[0].otu_labels
        // console.log(`otu labels: ${otu_labels}`)     
        // console.log(`otu labels: ${otu_labels}`) 
        
        // COMBINE, SORT AND SLICE ARRAYS
        var sortingList = []
        for (var x = 0; x < sample_values.length; x++) {
            sortingList.push({'sample_value': sample_values[x], 'otu_id': otu_ids[x], 'otu_label': otu_labels[x]})
        }
        // console.log(`Sorting List: ${JSON.stringify(sortingList)}`)
        sortingList = sortingList.sort((a,b) => b.sample_value - a.sample_value)
        for (var y = 0; y < sortingList.length; y++) {
            sample_values[y] = sortingList[y].sample_value;
            otu_ids[y] = sortingList[y].otu_id;
            otu_labels[y] = sortingList[y].otu_label
        }
        console.log(`Sorting List: ${JSON.stringify(sortingList)}`)
        slicedSample_values = sample_values.slice(0,10).sort((a,b) => a -b)
        slicedOtu_ids = otu_ids.slice(0,10).sort((a,b) => a -b)
        stringOtu_ids = slicedOtu_ids.join(" ")
        slicedOtu_labels = otu_labels.slice(0,10).sort((a,b) => a -b);
        console.log(`OTU IDS: ${otu_ids}`)

        // console.log(`SLICED AND SORTED - sample_vs: ${sample_values}, otu_ids: ${otu_ids}, otu_labels: ${otu_labels}`)

        // CREATE DATA TO REPLACE IN BAR CHART
        var xBar = slicedSample_values
        var yBar = stringOtu_ids
        var textBar = slicedOtu_labels
        var xBubble = otu_ids
        var yBubble = sample_values
        var sizeBubble = sample_values
        var colourBubble = otu_ids
        var textBubble = otu_labels

        // GET DEMOGRAPHIC DATA
        var demographicArr = data[0].metadata.filter(d => d.id == input)
        // console.log(`demoObj: ${JSON.stringify(demographicArr)}`)
        var id = demographicArr[0].id
        var ethnicity = demographicArr[0].ethnicity
        var gender = demographicArr[0].gender
        var age = demographicArr[0].age
        var location = demographicArr[0].location
        var bbtype = demographicArr[0].bbtype
        var wfreq = demographicArr[0].wfreq

        // APPEND DEMOGRAPHIC INFO
        var list = d3.select(".demographicInfo")
        list.html("")
        list.append("li").text(`ID: ${id}`)
        list.append("li").text(`Ethnicity: ${ethnicity}`)
        list.append("li").text(`Gender: ${gender}`)
        list.append("li").text(`Age: ${age}`)
        list.append("li").text(`Location: ${location}`)
        list.append("li").text(`Bbtype: ${bbtype}`)
        list.append("li").text(`Wfreq: ${wfreq}`)

        // UPDATE PLOTLY DATA
        restylePlotly(xBar,yBar,textBar,xBubble,yBubble,sizeBubble,colourBubble,textBubble, wfreq)
        
    });
}      

////////////////////////////////////////////////////////////////////////////

function restylePlotly(a,b,c,d,e,f,g,h, i) {
    Plotly.restyle("bar", "x", [a]);
    Plotly.restyle("bar", "y", [b]);
    Plotly.restyle("bar", "text", [c]);
    Plotly.restyle("bubble", "x", [d]);
    Plotly.restyle("bubble", "y", [e]);
    Plotly.restyle("bubble", "size", [f]);
    Plotly.restyle("bubble", "color", [g]);
    Plotly.restyle("bubble", "text", [h]);
    Plotly.restyle("gauge", "value", [i])
}

init();
