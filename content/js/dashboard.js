/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.75481382196214, "KoPercent": 0.24518617803785675};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6960368232173506, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4131326949384405, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.6956819739547635, 500, 1500, "https://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [0.899452804377565, 500, 1500, "https://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [0.9288645690834473, 500, 1500, "https://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [0.6788896504455106, 500, 1500, "https://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [0.6230294722412612, 500, 1500, "https://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [0.7864976010966416, 500, 1500, "https://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.3559614059269469, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [0.7052775873886223, 500, 1500, "https://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [0.7799862919808088, 500, 1500, "https://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [0.9230506155950753, 500, 1500, "https://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [0.9251025991792066, 500, 1500, "https://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [0.8830369357045144, 500, 1500, "https://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.7821477428180574, 500, 1500, "https://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.7095994475138122, 500, 1500, "https://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [0.7866022099447514, 500, 1500, "https://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [0.7669198895027625, 500, 1500, "https://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [0.0, 500, 1500, "Flights"], "isController": true}, {"data": [0.7997237569060773, 500, 1500, "https://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [0.8791436464088398, 500, 1500, "https://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.28214774281805743, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.7078729281767956, 500, 1500, "https://blazedemo.com/confirmation.php-0"], "isController": false}, {"data": [0.0, 500, 1500, "Home"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 30589, 75, 0.24518617803785675, 971.645885775934, 43, 169470, 431.0, 1349.0, 1992.0, 5470.670000000053, 0.05886337892305784, 1.3587195502609528, 0.06937367589750247], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/purchase.php", 1462, 0, 0.0, 1213.2441860465103, 741, 10342, 927.5, 1943.7, 2574.0999999999976, 4811.379999999992, 0.0028137815865748052, 0.13606515015414886, 0.011722258055007928], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-0", 1459, 0, 0.0, 1418.2762165867023, 407, 66282, 499.0, 1620.0, 3890.0, 34979.60000000001, 0.0028079174874412523, 0.020173725726845174, 0.0018388956179633917], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 1462, 0, 0.0, 415.1703146374828, 311, 3891, 331.0, 590.1000000000001, 651.349999999999, 2034.9399999999932, 0.002813784256387079, 4.809014049573147E-4, 0.001977068137178226], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 1462, 0, 0.0, 399.52325581395314, 311, 7458, 331.0, 581.4000000000001, 622.8499999999999, 1493.5099999999975, 0.002813784245556187, 4.8639707546081843E-4, 0.001977068129568044], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 1459, 9, 0.6168608636052091, 1238.836874571626, 313, 65146, 514.0, 1836.0, 4120.0, 18064.00000000003, 0.0028079265121097566, 0.05455167297517364, 0.001842506310901441], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 1459, 10, 0.6854009595613434, 1649.8896504455088, 312, 41021, 684.0, 2959.0, 7166.0, 19677.800000000032, 0.0028079265283217883, 0.1744550786238433, 0.0018398844905101995], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-1", 1459, 0, 0.0, 1168.6662097326926, 45, 38999, 126.0, 2307.0, 5702.0, 18773.200000000008, 0.002807928392706665, 0.11567436155943046, 0.0018497302713175723], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 1451, 10, 0.6891798759476223, 1681.887663680218, 741, 47812, 1148.0, 2805.5999999999995, 5139.599999999998, 10796.120000000003, 0.0027926123305743893, 0.13257115958193685, 0.011909880074439074], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 1459, 4, 0.27416038382453733, 1139.1343385880741, 313, 66327, 440.0, 1571.0, 2882.0, 17819.20000000001, 0.002807926517513767, 0.04007663799577869, 0.001843276888438743], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 1459, 8, 0.5483207676490747, 1101.2159013022615, 311, 167725, 342.0, 1531.0, 2979.0, 12965.400000000098, 0.002807926517513767, 0.005874764016654357, 0.0018451281454666135], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 1462, 0, 0.0, 403.063611491109, 312, 5392, 332.0, 569.5000000000002, 640.3999999999996, 1543.0999999999967, 0.002813784245556187, 4.8365675730315444E-4, 0.001977068129568044], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 1462, 0, 0.0, 400.88372093023304, 312, 4829, 331.0, 588.7, 630.5499999999997, 1723.9999999999782, 0.0028137842401407412, 4.836492383526799E-4, 0.001971572453418928], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-1", 1462, 0, 0.0, 340.37961696306445, 43, 9813, 105.0, 893.6000000000004, 1461.3999999999996, 2642.1399999999976, 0.0028137858485290613, 0.11567901271057604, 0.001853416557453957], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-0", 1462, 0, 0.0, 587.3392612859097, 408, 4920, 478.0, 824.0, 1027.85, 2715.769999999987, 0.0028137834873939774, 0.018451722476856048, 0.0019660762551078036], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-5", 1448, 1, 0.06906077348066299, 647.9544198895045, 313, 18049, 515.0, 1025.2000000000003, 1595.55, 4928.73, 0.0027868423396103428, 4.801256286826664E-4, 0.0019570983899643885], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-4", 1448, 2, 0.13812154696132597, 560.2610497237561, 312, 10744, 340.0, 870.1000000000001, 1400.8499999999997, 2996.5599999999995, 0.0027868422377019804, 4.893896993814995E-4, 0.001955850325985193], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 1448, 2, 0.13812154696132597, 576.2783149171278, 313, 10619, 345.5, 881.1000000000001, 1420.3499999999992, 3307.0899999999992, 0.0027868422377019804, 4.866944868517813E-4, 0.001955850325985193], "isController": false}, {"data": ["Flights", 725, 10, 1.3793103448275863, 5785.892413793107, 3112, 50703, 4805.0, 9414.199999999999, 11649.599999999999, 15415.620000000003, 0.001395335722172468, 0.2673479764427327, 0.02352823402086984], "isController": true}, {"data": ["https://blazedemo.com/confirmation.php-2", 1448, 2, 0.13812154696132597, 541.8895027624304, 312, 11032, 339.0, 816.2000000000003, 1189.199999999999, 3425.6099999999997, 0.0027868422377019804, 4.8667945079861687E-4, 0.0019504147927662636], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-1", 1448, 0, 0.0, 415.1602209944758, 44, 11346, 146.5, 894.5000000000007, 1545.8499999999997, 4005.1099999999997, 0.002786844061326436, 0.11488625333694505, 0.0018356909083412011], "isController": false}, {"data": ["https://blazedemo.com/reserve.php", 1462, 27, 1.8467852257181943, 3789.1928864569095, 737, 169470, 1369.5, 6023.5, 19818.249999999985, 41050.60999999999, 0.002813688828636687, 0.4108246537450134, 0.01105938176616264], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-0", 1448, 0, 0.0, 702.6857734806629, 409, 9337, 518.0, 1024.1000000000001, 1508.1, 3587.439999999997, 0.0027868405910784193, 0.01573045391324345, 0.0022549912713140667], "isController": false}, {"data": ["Home", 731, 27, 3.6935704514363885, 7578.3857729138035, 1823, 176070, 3220.0, 22165.2, 29520.199999999993, 44331.99999999993, 0.0014068441435644687, 0.4108245746798618, 0.011059379637732205], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, 1.3333333333333333, 0.0032691490405047565], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 15, 20.0, 0.049037235607571346], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 28, 37.333333333333336, 0.09153617313413319], "isController": false}, {"data": ["Assertion failed", 31, 41.333333333333336, 0.10134362025564746], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 30589, 75, "Assertion failed", 31, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 28, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 15, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 1459, 9, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 1459, 10, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 7, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 1451, 10, "Assertion failed", 7, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 1459, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 1459, 8, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 4, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-5", 1448, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-4", 1448, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 1448, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 1448, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/reserve.php", 1462, 27, "Assertion failed", 24, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
