var json_data = {};

$(document).ready(function () {

    $(document).ajaxStart(function(){
        $("#loader").show();
    });
    $(document).ajaxStop(function(){
        $("#loader").hide();
    });

    $.ajax({
        dataType: "json",
        url: "xml.php?plugin=complete&json",
        success: function (data) {
            json_data = data;
            console.log(data);
            renderVitals();
            renderHardware();
            renderMemory();
            renderFilesystem();
            renderNetwork();
        }
    });
});


function renderVitals() {
    var directives = {
        Uptime: {
            text: function() {
                return secondsToString(this["Uptime"]);
            }
        },
        Distro: {
            html: function() {
                return "<img src=\"gfx/images/"+this["Distroicon"]+"\" style=\"width:24px\"/>" + this["Distro"];
            }
        }
    };

    $('#vitals').render(json_data["Vitals"]["@attributes"],directives);
}

function renderHardware() {
    $('#hardware').render(json_data["Hardware"]["CPU"]["CpuCore"][0]["@attributes"]);
}

function renderMemory() {
    var directives = {
        Total: {
            text: function() {
                return bytesToSize(this["Total"]);
            }
        },
        Free: {
            text: function() {
                return bytesToSize(this["Free"]);
            }
        },
        Used: {
            text: function() {
                return bytesToSize(this["Used"]);
            }
        },
        Usage: {
            text: function() {
                return this["Percent"]+"%";
            }
        },
        Type: {
            text: function() {
                return "Physical Memory"
            }
        }
    };

    $('#memory').render(json_data["Memory"]["@attributes"], directives);
}

function renderFilesystem() {
    var directives = {
        Total: {
            text: function() {
                return bytesToSize(this["Total"]);
            }
        },
        Free: {
            text: function() {
                return bytesToSize(this["Free"]);
            }
        },
        Used: {
            text: function() {
                return bytesToSize(this["Used"]);
            }
        },
        Percent: {
            html: function() {
                return '<div class="progress">' +
                    '<div class="progress-bar" style="width: '+this["Percent"]+'%;"></div>' +
                    '</div>' + '<div class="percent">' + this["Percent"]+'%</div>';
            }
        }
    };

    var fs_data = [];
    for(var i=0;i<json_data["FileSystem"]["Mount"].length;i++) {
        fs_data.push(json_data["FileSystem"]["Mount"][i]["@attributes"]);
    }
    $('#filesystem-data').render(fs_data, directives);
}


function renderNetwork() {
    var directives = {
        RxBytes: {
            text: function() {
                return bytesToSize(this["RxBytes"]);
            }
        },
        TxBytes: {
            text: function() {
                return bytesToSize(this["TxBytes"]);
            }
        },
        Drops: {
            text: function() {
                return this["Drops"] + "/" + this["Err"];
            }
        }
    };

    var network_data = [];
    for(var i=0;i<json_data["Network"]["NetDevice"].length;i++) {
        network_data.push(json_data["Network"]["NetDevice"][i]["@attributes"]);
    }
    $('#network-data').render(network_data, directives);
}

// from http://scratch99.com/web-development/javascript/convert-bytes-to-mb-kb/
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + '' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + '' + sizes[i];
}

function secondsToString(seconds) {
    var numyears = Math.floor(seconds / 31536000);
    var numdays = Math.floor((seconds % 31536000) / 86400);
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = Math.floor((((seconds % 31536000) % 86400) % 3600) % 60);
    return numyears + " years " +  numdays + " days " + numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
}