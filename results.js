
// define the background names
params = [ "bg1", "bg2" ];

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

var table = document.getElementById("resultsTable");
// header row
var row = table.insertRow(0);
var cell1 = row.insertCell(0);
var cell2 = row.insertCell(1);
cell1.innerHTML = "<b>Background</b>";
cell2.innerHTML = "<b>Result</b>";

// table rows
var dataStr = getURLParameter("data");
for (var i = 0; i < params.length; i++) {
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = params[i];
    //cell2.innerHTML = getURLParameter(params[i]);
    switch ( dataStr.charAt(i) ) {
        case "y":
            cell2.innerHTML = "Yes";
            break;
        case "n":
            cell2.innerHTML = "No";
            break;
        default:
            cell2.innerHTML = "?";
            break;
    }
}
