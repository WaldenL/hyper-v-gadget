System.Gadget.settingsUI = "settings.html";
System.Gadget.onSettingsClosed = onSettingsClosed;
System.Gadget.onShowSettings = onShowSettings;

var alertTimerId = 0;

function onLoad()
{
    loadSettings();
}

function onSettingsClosed(event) {
    if (event.closeAction == event.Action.commit) {
        loadSettings();
    }
    else {
	onTimer();
    }
}

function onShowSettings() {
    clearTimeout(alertTimerId);
}

function resetTimer() {
    clearTimeout(alertTimerId);
    alertTimerId = setInterval("onTimer()", System.Gadget.Settings.read("refreshtime") * 1000);
}

function showButtons(d) {
    var divs = d.getElementsByTagName('div');
    if (divs["buttons"] != null) {
        divs["buttons"].style.visibility = "visible";
    }

    if (divs["rdp"] != null) {
        divs["rdp"].style.visibility = "visible";
    }
}

function hideButtons(d) {
    var divs = d.getElementsByTagName('div');
    if (divs["buttons"] != null) {
        divs["buttons"].style.visibility = "hidden";
    }

    if (divs["rdp"] != null) {
        divs["rdp"].style.visibility = "hidden";
    }
}

function saveScrolloffSet(server, offSet) {
	var serverFound = false
	var i = 0
        var serverListArray = ServerList.value.split("///");

        while (i < serverListArray.length && serverFound != true) {
            var serverInfoArray = serverListArray[i].split("###");
	    if (serverInfoArray.length == 12 && serverInfoArray[0] == server) {
		serverFound = true
	    }
	    else {
		i++
	    }
		 
	}
	if (serverFound == true) {
		if (serverInfoArray[11] != offSet) {
			var username = "";
			var password = "";
			var serverMAC = "";
			var serverIP = "";
			var serverUDP = "";
			var serverConn = "";
			var servermaxVMs = "";
			var serverVMDetails = "";
			var serverVMs = "";
			var serverScroll = "";
			username = serverInfoArray[1];
			password = serverInfoArray[2];
			serverMAC = serverInfoArray[3];
			serverIP = serverInfoArray[4];
			serverUDP = serverInfoArray[5];
			serverConn = serverInfoArray[6];
			servermaxVMs = serverInfoArray[7];
			serverVMCPU = serverInfoArray[8];
			serverVMDetails = serverInfoArray[9];
			serverVMs = serverInfoArray[10];
			serverScroll = offSet;
			ServerList.value = saveServerinfo(ServerList.value, serverListArray[i], server, username, password, serverMAC, serverIP, serverUDP, serverConn, servermaxVMs, serverVMCPU, serverVMDetails, serverVMs, serverScroll)
			saveServerList(ServerList.value);
		}
	}

}

function scrollUpVM(server) {
	var VMContent=document.getElementById("VMcontent_" + server);
	if (parseInt(VMContent.style.top)<0) {
		saveScrolloffSet(server, parseInt(VMContent.style.top) + 17);
		VMContent.style.top=parseInt(VMContent.style.top) + 17 +"px";
	}
}

function scrollDownVM(server) {
	var VMContent=document.getElementById("VMContent_" + server);
	var VMContainer=document.getElementById("VMContainer_" + server);
	if (parseInt(VMContent.style.top)>((parseInt(VMContent.offsetHeight) - parseInt(VMContainer.style.height)) *(-1))) {
		saveScrolloffSet(server, parseInt(VMContent.style.top) - 17);
		VMContent.style.top=parseInt(VMContent.style.top) - 17 +"px";
	}		
}


function showVMs(server) {
	var serverFound = false
	var i = 0
        var serverListArray = ServerList.value.split("///");

        while (i < serverListArray.length && serverFound != true) {
            var serverInfoArray = serverListArray[i].split("###");
	    if (serverInfoArray.length == 12 && serverInfoArray[0] == server) {
		serverFound = true
	    }
	    else {
		i++
	    }
		 
	}
	if (serverFound == true) {
		if (serverInfoArray[10] == "hidden") {
			var username = "";
			var password = "";
			var serverMAC = "";
			var serverIP = "";
			var serverUDP = "";
			var serverConn = "";
			var servermaxVMs = "";
			var serverVMCPU = "";
			var serverVMDetails = "";
			var serverVMs = "";
			var serverScroll = "";
			username = serverInfoArray[1];
			password = serverInfoArray[2];
			serverMAC = serverInfoArray[3];
			serverIP = serverInfoArray[4];
			serverUDP = serverInfoArray[5];
			serverConn = serverInfoArray[6];
			servermaxVMs = serverInfoArray[7];
			serverVMCPU = serverInfoArray[8];
			serverVMDetails = serverInfoArray[9];
			serverVMs = "visible";
			serverScroll = serverInfoArray[11];
			ServerList.value = saveServerinfo(ServerList.value, serverListArray[i], server, username, password, serverMAC, serverIP, serverUDP, serverConn, servermaxVMs, serverVMCPU, serverVMDetails, serverVMs, serverScroll)
			saveServerList(ServerList.value);
			onTimer();
		}
	}
}


function hideVMs(server) {
	var serverFound = false
	var i = 0
        var serverListArray = ServerList.value.split("///");
        while (i < serverListArray.length && serverFound != true) {
            var serverInfoArray = serverListArray[i].split("###");
	    if (serverInfoArray.length == 12 && serverInfoArray[0] == server) {
		serverFound = true
	    }
	    else {
		i++
	    }
		 
	}
	if (serverFound == true) {
		if (serverInfoArray[10] == "visible") {
			var username = "";
			var password = "";
			var serverMAC = "";
			var serverIP = "";
			var serverUDP = "";
			var serverConn = "";
			var servermaxVMs = "";
			var serverVMCPU = "";
			var serverVMDetails = "";
			var serverVMs = "";
			var serverScroll = "";
			username = serverInfoArray[1];
			password = serverInfoArray[2];
			serverMAC = serverInfoArray[3];
			serverIP = serverInfoArray[4];
			serverUDP = serverInfoArray[5];
			serverConn = serverInfoArray[6];
			servermaxVMs = serverInfoArray[7];
			serverVMCPU = serverInfoArray[8];
			serverVMDetails = serverInfoArray[9];
			serverVMs = "hidden";
			serverScroll = serverInfoArray[11];
			ServerList.value = saveServerinfo(ServerList.value, serverListArray[i], server, username, password, serverMAC, serverIP, serverUDP, serverConn, servermaxVMs, serverVMCPU, serverVMDetails, serverVMs, serverScroll)
			saveServerList(ServerList.value);
			onTimer();
		}
	}
}

function loadSettings()
{
    // Set default refresh time
    if (System.Gadget.Settings.read("refreshtime") == "")
        System.Gadget.Settings.write("refreshtime", 30);
        
    if (System.Gadget.Settings.read("vmclicktype") == "")
        System.Gadget.Settings.write("vmclicktype", "ondblclick");

    if (System.Gadget.Settings.read("language") == "")
        System.Gadget.Settings.write("language", "en-us");

    loadLanguage(System.Gadget.Settings.read("language"));

    dockStateChange();
    System.Gadget.onDock = dockStateChange;
    System.Gadget.onUndock = dockStateChange;

    VMMenu.value = System.Gadget.Settings.read("vmmenu");

    if (System.Gadget.Settings.read("serverlist") != "") {
        try {
            ServerList.value = GibberishAES.dec(System.Gadget.Settings.read("serverlist"), System.Environment.machineName);
        }
        catch (e) {
            ServerList.value = "";
        }
    }
    else {
        ServerList.value = "";
    }
    VMConnect.value = GetHyperVPath();
    VMClickType.value = System.Gadget.Settings.read("vmclicktype");

    onTimer();
}

function dockStateChange()
{
	if(!System.Gadget.docked) 
	{
		undockedState();
		onTimer();
	} 
	else
	{
		dockedState(); 
		onTimer();
	}
}

function dockedState()
{
	document.body.style.width = 130;
}

function undockedState()
{
	document.body.style.width = 200;
}

function onTimer()
{
    clearTimeout(alertTimerId);
    getServers();
    resetTimer();
}

function getHtmlVm(server, serverConn, username, password, name, elementName, enabledState, cpuHistory, ProcessorLoad, NumberOfProcessors, MemoryUsage, HeartBeat, Uptime, GuestOperatingSystem, HealthState) {
    var vmUsername = username.replace("\\", "\\\\");
    var vmPassword = password.replace("\\", "\\\\");
    var vmStart = "<img style=\"margin:0px 0px\" src=\"start.png\" " + VMClickType.value + "='VMChangeState(\"" + server + "\",\"" + name + "\",\"2\", \"" + vmUsername + "\", \"" + vmPassword + "\")' alt=\"" + messages.start + "\" />";
    var vmSave = "<img style=\"margin:0px 0px\" src=\"save.png\" " + VMClickType.value + "='VMChangeState(\"" + server + "\",\"" + name + "\",\"32769\", \"" + vmUsername + "\", \"" + vmPassword + "\")' alt=\"" + messages.save + "\" />";
    var vmShutDown = "<img style=\"margin:0px 0px\" src=\"shut_down.png\" " + VMClickType.value + "='VMShutDown(\"" + server + "\",\"" + name + "\", \"" + vmUsername + "\", \"" + vmPassword + "\")' alt=\"" + messages.shutDown + "\" />";
    var vmTurnOff = "<img style=\"margin:0px 0px\" src=\"off.png\" " + VMClickType.value + "='VMChangeState(\"" + server + "\",\"" + name + "\",\"3\", \"" + vmUsername + "\", \"" + vmPassword + "\")' alt=\"" + messages.turnOff + "\" />";
    var vmPause = "<img style=\"margin:0px 0px\" src=\"pause.png\" " + VMClickType.value + "='VMChangeState(\"" + server + "\",\"" + name + "\",\"32768\", \"" + vmUsername + "\", \"" + vmPassword + "\")' alt=\"" + messages.pause + "\" />";
    var vmResume = "<img style=\"margin:0px 0px\" src=\"resume.png\" " + VMClickType.value + "='VMChangeState(\"" + server + "\",\"" + name + "\",\"2\", \"" + vmUsername + "\", \"" + vmPassword + "\")' alt=\"" + messages.resume + "\" />";
    
    var rButtons = "";
    switch (enabledState) {
        case 2:
            rButtons += vmTurnOff;
            rButtons += vmShutDown;
            rButtons += vmSave;
            rButtons += vmPause;
            break;
        case 3:
            rButtons += vmStart;
            break;
        case 32769:
            rButtons += vmStart;
            break;
        case 32768:
            rButtons += vmTurnOff;
            rButtons += vmSave;
            rButtons += vmResume;
            break;
        default:
            break;
    }


    var r = "<div class=\"hyperVVm\" onmouseover=\"showButtons(this);\" onmouseout=\"hideButtons(this);\">";
    
    var vmConnectText = "";
    var vmInfoText = "";
    if (VMConnect.value != "") {
        vmConnectText = "style=\"cursor:hand;\" " + VMClickType.value + "='runVMConnect(\"" + server + "\",\"" + name + "\");'";

        if (serverConn != "" && serverConn != "None" && enabledState == "2") {
            r += "<div class=\"rdp\" id=\"rdp\"><img src=\"rdp.png\" alt=\"" + messages.terminalOption + "\" " + VMClickType.value + "='runVMRDP(\"" + server + "\",\"" + name + "\",\"" + vmUsername + "\",\"" + vmPassword + "\", false);'/>"
		if (serverConn == "Both") {
		    r += "<img src=\"rdp.png\" alt=\"" + messages.consoleOption + "\" " + VMClickType.value + "='runVMRDP(\"" + server + "\",\"" + name + "\",\"" + vmUsername + "\",\"" + vmPassword + "\", true);'/>";
		}
		r += "</div>";
        }
    }
    else if (serverConn != "" && serverConn != "None" && enabledState == "2") {
	if (serverConn != "Console") {
		if (serverConn == "Both") {
		    r += "<div class=\"rdp\" id=\"rdp\"><img src=\"rdp.png\" alt=\"" + messages.consoleOption + "\" " + VMClickType.value + "='runVMRDP(\"" + server + "\",\"" + name + "\",\"" + vmUsername + "\",\"" + vmPassword + "\", true);'/></div>";
		}
         vmConnectText = "style=\"cursor:hand;\" " + VMClickType.value + "='runVMRDP(\"" + server + "\",\"" + name + "\",\"" + vmUsername + "\",\"" + vmPassword + "\", false);'";
	}
	else {
	    vmConnectText = "style=\"cursor:hand;\" " + VMClickType.value + "='runVMRDP(\"" + server + "\",\"" + name + "\",\"" + vmUsername + "\",\"" + vmPassword + "\", true);'";
	}
    }

    r += "<div class=\"name\" " + vmConnectText + "><span"
    if (GuestOperatingSystem != null) {
	if (vmInfoText != "") {
		vmInfoText += "&#13&#10";
	}
	vmInfoText += messages.GuestOperatingSystem + " " + GuestOperatingSystem;
    }
    if (Uptime != null && Uptime != 0) {
	if (vmInfoText != "") {
		vmInfoText += "&#13&#10";
	}
	var uptDays = 0;
	var uptHours = 0;
	var uptMinutes = 0;
	var uptSeconds = 0;

	uptSeconds = parseInt(Uptime / 1000);
	uptDays = parseInt(uptSeconds / 86400);
	uptSeconds = parseInt(uptSeconds % 86400);
	uptHours = parseInt(uptSeconds / 3600);
	uptSeconds = parseInt(uptSeconds % 3600);
	uptMinutes = parseInt(uptSeconds / 60);
	uptSeconds = parseInt(uptSeconds % 60);
	if (uptDays > 0) {
		vmInfoText += messages.Uptime + " " + uptDays + messages.Uptimedays + " " + uptHours + messages.Uptimehours + " " + uptMinutes + messages.Uptimeminutes + " " + uptSeconds + messages.Uptimeseconds;
	}
	else {
		vmInfoText += messages.Uptime + " " + uptHours + messages.Uptimehours + " " + uptMinutes + messages.Uptimeminutes + " " + uptSeconds + messages.Uptimeseconds;
	}
    }
    if (MemoryUsage != null) {
	if (vmInfoText != "") {
		vmInfoText += "&#13&#10";
	}
	vmInfoText += messages.MemoryUsage + " " + MemoryUsage + " MB";
    }
    if (NumberOfProcessors != null) {
	if (vmInfoText != "") {
		vmInfoText += "&#13&#10";
	}
	vmInfoText += messages.NumberOfProcessors + " " + NumberOfProcessors;
    }
    if (ProcessorLoad != null) {
	if (vmInfoText != "") {
		vmInfoText += "&#13&#10";
	}
	vmInfoText += messages.ProcessorLoad + " " + ProcessorLoad + "%";
    }
    if (HealthState == 5 || HealthState == 20 || HealthState == 25) {
	if (vmInfoText != "") {
		vmInfoText += "&#13&#10";
	}
	vmInfoText += messages.HealthState + " ";
	if (HealthState == 5) {
		vmInfoText += messages.HealthStateOK;
	}
	else {
		if (HealthState == 20) {
			vmInfoText += messages.HealthStateERR;
		}
		else {
			vmInfoText += messages.HealthStateCRI;
		}
	}
    }
    if (HeartBeat == 2 || HeartBeat == 6 || HeartBeat == 12 || HeartBeat == 13) {
	if (vmInfoText != "") {
		vmInfoText += "&#13&#10";
	}
	vmInfoText += messages.HeartBeat + " ";
	if (HeartBeat == 2) {
		vmInfoText += messages.HeartBeatOK;
	}
	else {
		if (HeartBeat == 6) {
			vmInfoText += messages.HeartBeatERR;
		}
		else {
			if (HeartBeat == 12) {
				vmInfoText += messages.HeartBeatNCO;
			}
			else {
				vmInfoText += messages.HeartBeatLCO;
			}
		}
	}
    }
    
    if (vmConnectText != "") {
       if (vmInfoText != "") {
             vmInfoText += "&#13&#10";
       }
       if (VMConnect.value != "") {
             vmInfoText += messages.ConnectionType + " VMConnect";
       }
       else
       {
             if (serverConn != "None") {
                    if (serverConn == "Console") {

                           vmInfoText += messages.ConnectionType + " " + messages.consoleOption;
                    }
                    else {
                           vmInfoText += messages.ConnectionType + " " + messages.terminalOption;
                    }
             }
       }
    }


    if (vmInfoText != "") {
	r += " title=\"" + vmInfoText + "\" >";
    }
    else {
	r += ">";
    }
    r += elementName + "</span></div>";
    
    if (enabledState != "2") {
        switch (enabledState) {
            case 3:
                r += "<div class=\"state\" style=\"background-color: #c03131;\">" + messages.stopped + "</div>";
                break;
            case 32768:
                r += "<div class=\"state\" style=\"background-color: #c7953a;\">" + messages.paused + "</div>";
                break;
            case 32769:
                r += "<div class=\"state\" style=\"background-color: #c03131;\">" + messages.suspended + "</div>";
                break;
            case 32770:
                r += "<div class=\"state\" style=\"background-color: #c7953a;\">" + messages.starting + "</div>";
                break;
            case 32771:
                r += "<div class=\"state\" style=\"background-color: #0d6b92;\">" + messages.snapshot + "</div>";
                break;
            case 32773:
                r += "<div class=\"state\" style=\"background-color: #c7953a;\">" + messages.saving + "</div>";
                break;
            case 32774:
                r += "<div class=\"state\" style=\"background-color: #c7953a;\">" + messages.stopping + "</div>";
                break;
            case 32776:
                r += "<div class=\"state\" style=\"background-color: #c7953a;\">" + messages.pausing + "</div>";
                break;
            case 32777:
                r += "<div class=\"state\" style=\"background-color: #c7953a;\">" + messages.resume + "</div>";
                break;
            default:
                r += "<div class=\"state\" style=\"background-color: #c03131;\">" + messages.unknown + "</div>";
        }
    }
    else {

        if (cpuHistory == "") {
		if (HeartBeat != 2) {
                	r += "<div class=\"state\" style=\"background-color: #c7953a; color:White;\">" + messages.running + "</div>";
		}
		else {
                	r += "<div class=\"state\" style=\"background-color: #2d782d; color:White;\">" + messages.running + "</div>";
		}
	}
	else {  
        	r += "<div class=\"cpuHistory\"";

		if (HeartBeat != 2) {
			r += " style=\"background-color: #c7953a;\"";
		}
	
		r += ">";

        	var cpuHistoryArray = cpuHistory.split(",");

        	for (i = 2; i < cpuHistoryArray.length; i += 2) {
            		if (cpuHistoryArray[i] != "" && cpuHistoryArray[i - 1] != "") {
                		var cpuPerc = Math.round(((Math.max(parseInt(cpuHistoryArray[i]),parseInt(cpuHistoryArray[i - 1]))) / 100) * 17);
                		if (cpuPerc == 0) { cpuPerc = 1; }                    
                		r += "<div class=\"cpuHistoryLine\"";
				if (HeartBeat != 2) {
					r += " style=\"background-color: #c7953a;\"";
				}
				r += "><div class=\"line\" style=\"height: " + cpuPerc + "px;\"></div></div>";
            		}
        	}
            
        	r += "</div>";
    	}
    }

    if (VMMenu.value != "false") {
        r += "<div class=\"buttons\" id=\"buttons\">";
            r += rButtons;
        r += "</div>";
    }
        
    r += "</div>";

    return r;
}

function getHtmlServer(server, username, password, serverMAC, serverIP, serverUDP, serverConn, collapse, scroll, freemem, serverColor, serverInfo) {

    var vmUsername = username.replace("\\", "\\\\");
    var vmPassword = password.replace("\\", "\\\\");
    var r = "<div class=\"hyperVServer\" onmouseover=\"showButtons(this);\" onmouseout=\"hideButtons(this);\">";
    var rdp = ""
    if (serverConn != "" && serverConn != "None") {
	if (serverConn != "Console") { 
		rdp = VMClickType.value + "='runRDP(\"" + server + "\", false);'";
	}
	else {
		rdp = VMClickType.value + "='runRDP(\"" + server + "\", true);'";
	}
	r += "<div class=\"name\" style=\"cursor:hand;\" " + rdp + ">";
    }

    r += "<span";
    if (serverConn != "" && serverConn != "None") {
	r += " title=\""
	if (serverInfo != "") {
		r += messages.ConnectionType + " ";
	}
	if (serverConn != "Console") {
		r += messages.terminalOption;
	}
	else {
		r += messages.consoleOption;
	}
	if (serverInfo != "") {
		r += "&#13&#10" + serverInfo;
	}
	r += "\" ";
    }
    else {
	if (serverInfo != "") {
		r += " title=\"" + serverInfo + "\" ";
	}
    }
    r += ">";
    if (serverColor  == "") {
	r += server;
    }
    else {
	r += "<font color=\"" + serverColor + "\">" + server + "</font>";
    }
    r += "</span>";
    if (serverConn != "" && serverConn != "None") {
	r += "</div>";
    }

    r += "<div class=\"rdp\" id=\"rdp\">";

    if (scroll) {
	r += "<img src=\"Scroll_Up.png\" style=\"cursor:hand;\" onclick='scrollUpVM(\"" + server + "\");'/><img src=\"Scroll_Down.png\" style=\"cursor:hand;\" onclick='scrollDownVM(\"" + server + "\");'/>";
    }

    if (serverConn == "Both") {
	r += "<img src=\"rdp.png\" alt=\"" + messages.consoleOption + "\" style=\"cursor:hand;\"" + VMClickType.value + "='runRDP(\"" + server + "\", true);'/>";
    }

    r += "</div>";

    r += "<div class=\"memory\">" + freemem + "</div>";

    r += "<div class=\"buttons\" id=\"buttons\">";
    if (collapse) {
	r += "<img src=\"collapse.png\" onclick ='hideVMs(\"" + server + "\")'/><img src=\"expand.png\" onclick ='showVMs(\"" + server + "\")'/>";
    }
    if (VMMenu.value != "false" && serverIP != "" && serverMAC != "" && serverUDP != "") {
        r += "<img src=\"shut_down.png\" " + VMClickType.value + "='VMShutDown(\"" + server + "\",\"\", \"" + vmUsername + "\", \"" + vmPassword + "\")' alt=\"" + messages.shutDown + "\" />";
    }
    r += "</div>";      
    r += "</div>";

    return r;
}

function getHtmlOfflineServer(server, username, password, serverMAC, serverIP, serverUDP) {
    var vmUsername = username.replace("\\", "\\\\");
    var vmPassword = password.replace("\\", "\\\\");
    var r = "<div class=\"hyperVServer\" ";
    if (VMMenu.value != "false" && serverIP != "" && serverMAC != "" && serverUDP != "") { r += "onmouseover=\"showButtons(this);\" onmouseout=\"hideButtons(this);\""; }
    r += ">";

    r += "<div class=\"name\">" + server + "</div>";
    r += "<div class=\"offline\">" + messages.offline + "</div>";

    if (VMMenu.value != "false" && serverIP != "" && serverMAC != "" && serverUDP != "") {
        r += "<div class=\"buttons\" style=\"cursor:hand;\" id=\"buttons\">";
        r += "<img src=\"start.png\" " + VMClickType.value + "='WakeUp(\"" + server + "\", \"" + serverIP + "\" ,\"" + serverMAC + "\",\"" + serverUDP + "\",\"" + vmUsername + "\",\"" + vmPassword + "\")' alt=\"" + messages.start + "\" />";
        r += "</div>";
    }

    r += "</div>";

    return r;
}

function getHtmlErrorMessage(message) {
    var r = "<div class=\"hyperVVm\">";
    r += "<div class=\"name\" style=\"color:red; text-align:center;\">" + message + "</div>";
    r += "</div>";

    return r;
}


function getVMList(server, username, password, CPU, Details) {
    var vbVM = null;
    vbVM = GetVMs(server, username, password, CPU, Details);

    if (vbVM != null) {
        var a = new VBArray(vbVM);
        var b = a.toArray();
        var vmList = new Array();

        var y = 0;
        for (var z = 0; z < b.length / 11; z++) {
            var vm = new Array();
            vm[0] = b[z];
            vm[1] = b[z + (b.length / 11 * 1)];
            vm[2] = b[z + (b.length / 11 * 2)];
            vm[3] = b[z + (b.length / 11 * 3)];
            vm[4] = b[z + (b.length / 11 * 4)];
            vm[5] = b[z + (b.length / 11 * 5)];
            vm[6] = b[z + (b.length / 11 * 6)];
            vm[7] = b[z + (b.length / 11 * 7)];
            vm[8] = b[z + (b.length / 11 * 8)];
            vm[9] = b[z + (b.length / 11 * 9)];
            vm[10] = b[z + (b.length / 11 * 10)];
            vmList[y] = vm;
            y++;
        }

        return vmList.sort(function (x, y) {
            var a = String(x[1]).toUpperCase();
            var b = String(y[1]).toUpperCase();
            if (a > b)
                return 1
            if (a < b)
                return -1
            return 0;
        });
    }

    return null;
}

function getServers() {
var serverStatus = 0;
var vmStatus = 0;
var serverColor = "";
var serverInfo = ""
var running = 0;
var stopped = 0;
var paused = 0;
var suspended = 0;
var starting = 0;
var saving = 0;
var snapshot = 0;
var stopping = 0;
var pausing = 0;
var resume = 0;
var unknown = 0;
	if (ServerList.value == "") {
		DataArea.innerHTML = "";
		document.body.style.height = 100;
	}
	else {
		var resultHtml = "";
		var gadgetHeight = 18;

		var serverListArray = ServerList.value.split("///");

		for (var i = 0; i < serverListArray.length; i++) {
			var serverInfoArray = serverListArray[i].split("###");
			var vmList = null;
			var vmCpuList = null;
			var server = "";
			var username = "";
			var password = "";
			var serverMAC = "";
			var serverIP = "";
			var serverUDP = "";
			var serverConn = "";
			var servermaxVMs = "";
			var serverVMCPU = "";
			var serverVMDetails = "";
			var serverVMs = "";
			var serverScroll = "";
			var serverRDP = false;
            
			try {
				if (serverInfoArray.length == 12 && serverInfoArray[0] != "") {
					server = serverInfoArray[0];
					username = serverInfoArray[1];
					password = serverInfoArray[2];
					serverMAC = serverInfoArray[3];
					serverIP = serverInfoArray[4];
					serverUDP = serverInfoArray[5];
					serverConn = serverInfoArray[6];
					servermaxVMs = serverInfoArray[7];
					serverVMCPU = serverInfoArray[8];
					serverVMDetails = serverInfoArray[9];
					serverVMs = serverInfoArray[10];
					serverScroll = serverInfoArray[11];

					var VMShown = 1;

					if (IsAlive(server)) {
 						try {
							var serverMemory = GetServerMemory(server, username, password);
							try {
								vmList = getVMList(server, username, password, serverVMCPU, serverVMDetails);
							} catch (e) {
								// server is alive and correct login, but Hyper-V not running
								VMShown = 0;
							}
							if (serverConn != "None") {
								// Remote desktop is only allowed for Windows Server 2008 R2 servers
								serverRDP = GetServerRDP(server, username, password);
							}
							serverColor = "";
							serverInfo = "";
							running = 0;
							stopped = 0;
							paused = 0;
							suspended = 0;
							starting = 0;
							saving = 0;
							snapshot = 0;
							stopping = 0;
							pausing = 0;
							resume = 0;
							unknown = 0;
							if (vmList != null && serverVMs == "visible" && servermaxVMs > 0) {
								if (vmList.length > servermaxVMs) {
									serverStatus = 1;
									vmStatus = 0;
									for (var j = 0; j < vmList.length; j++) {
									        switch (vmList[j][2]) {
									            case 2:
									                running += 1;
									                break;
									            case 3:
									                stopped += 1;
									                break;
									            case 32768:
									                paused += 1;
									                break;
									            case 32769:
									                suspended += 1;
									                break;
									            case 32770:
									                starting += 1;
									                break;
									            case 32771:
									                snapshot += 1;
									                break;
									            case 32773:
									                saving += 1;
									                break;
									            case 32774:
									                stopping += 1;
									                break;
									            case 32776:
									                pausing += 1;
									                break;
									            case 32777:
									                resume += 1;
									                break;
									            default:
									       	        unknown += 1;
									        }
										if (vmList[j][2] == 2) {
											vmStatus = 1;
										}
										else {
											if (vmList[j][2] == 32768 || vmList[j][2] == 32770 || vmList[j][2] == 32776 || vmList[j][2] == 32777) {
												vmStatus = 2;
											}
											else {
												vmStatus = 3;
											}
										}
										if (vmStatus > serverStatus) {
											serverStatus = vmStatus;
										}
									}
									if (serverStatus == 2) {
										serverColor = "#c7953a";
									}
									else {
										if (serverStatus == 3) {
											serverColor = "#c03131";
										}
									}
									serverInfo += messages.VMLabel
									if (running > 0) {
										serverInfo += "&#13&#10" + messages.running + ": " + running;
									}
									if (pausing > 0) {
										serverInfo += "&#13&#10" + messages.pausing + ": " + pausing;
									}
									if (paused > 0) {
										serverInfo += "&#13&#10" + messages.paused + ": " + paused;
									}
									if (resume > 0) {
										serverInfo += "&#13&#10" + messages.resume + ": " + resume;
									}
									if (stopping > 0) {
										serverInfo += "&#13&#10" + messages.stopping + ": " + stopping;
									}
									if (stopped > 0) {
										serverInfo += "&#13&#10" + messages.stopped + ": " + stopped;
									}
									if (suspended > 0) {
										serverInfo += "&#13&#10" + messages.suspended + ": " + suspended;
									}
									if (starting > 0) {
										serverInfo += "&#13&#10" + messages.starting + ": " + starting;
									}
									if (saving > 0) {
										serverInfo += "&#13&#10" + messages.saving + ": " + saving;
									}
									if (snapshot > 0) {
										serverInfo += "&#13&#10" + messages.snapshot + ": " + snapshot;
									}
									if (unknown > 0) {
										serverInfo += "&#13&#10" + messages.unknown + ": " + unknown;
									}
									VMShown = servermaxVMs
									resultHtml += getHtmlServer(server, username, password, serverMAC, serverIP, serverUDP, serverConn, true, true, serverMemory, serverColor,serverInfo);
								}
								else {
 									VMShown = vmList.length;
									resultHtml += getHtmlServer(server, username, password, serverMAC, serverIP, serverUDP, serverConn, true, false, serverMemory, serverColor, serverInfo);
								}
							}
							else {
								if (vmList != null) {
									serverStatus = 1;
									vmStatus = 0;
									for (var j = 0; j < vmList.length; j++) {
									        switch (vmList[j][2]) {
									            case 2:
									                running += 1;
									                break;
									            case 3:
									                stopped += 1;
									                break;
									            case 32768:
									                paused += 1;
									                break;
									            case 32769:
									                suspended += 1;
									                break;
									            case 32770:
									                starting += 1;
									                break;
									            case 32771:
									                snapshot += 1;
									                break;
									            case 32773:
									                saving += 1;
									                break;
									            case 32774:
									                stopping += 1;
									                break;
									            case 32776:
									                pausing += 1;
									                break;
									            case 32777:
									                resume += 1;
									                break;
									            default:
									       	        unknown += 1;
									        }
										if (vmList[j][2] == 2) {
											vmStatus = 1;
										}
										else {
											if (vmList[j][2] == 32768 || vmList[j][2] == 32770 || vmList[j][2] == 32776 || vmList[j][2] == 32777) {
												vmStatus = 2;
											}
											else {
												vmStatus = 3;
											}
										}
										if (vmStatus > serverStatus) {
											serverStatus = vmStatus;
										}
									}
									if (serverStatus == 2) {
										serverColor = "#c7953a";
									}
									else {
										if (serverStatus == 3) {
											serverColor = "#c03131";
										}
									}
									serverInfo += messages.VMLabel
									if (running > 0) {
										serverInfo += "&#13&#10" + messages.running + ": " + running;
									}
									if (pausing > 0) {
										serverInfo += "&#13&#10" + messages.pausing + ": " + pausing;
									}
									if (paused > 0) {
										serverInfo += "&#13&#10" + messages.paused + ": " + paused;
									}
									if (resume > 0) {
										serverInfo += "&#13&#10" + messages.resume + ": " + resume;
									}
									if (stopping > 0) {
										serverInfo += "&#13&#10" + messages.stopping + ": " + stopping;
									}
									if (stopped > 0) {
										serverInfo += "&#13&#10" + messages.stopped + ": " + stopped;
									}
									if (suspended > 0) {
										serverInfo += "&#13&#10" + messages.suspended + ": " + suspended;
									}
									if (starting > 0) {
										serverInfo += "&#13&#10" + messages.starting + ": " + starting;
									}
									if (saving > 0) {
										serverInfo += "&#13&#10" + messages.saving + ": " + saving;
									}
									if (snapshot > 0) {
										serverInfo += "&#13&#10" + messages.snapshot + ": " + snapshot;
									}
									if (unknown > 0) {
										serverInfo += "&#13&#10" + messages.unknown + ": " + unknown;
									}
								}
								VMShown = 0;
								if (servermaxVMs > 0) {
									resultHtml += getHtmlServer(server, username, password, serverMAC, serverIP, serverUDP, serverConn, true, false, serverMemory, serverColor, serverInfo);
								}
								else {
									resultHtml += getHtmlServer(server, username, password, serverMAC, serverIP, serverUDP, serverConn, false, false, serverMemory, serverColor, serverInfo);
								}
							}
						} catch (e) {
							// server is alive, but invalid login
							resultHtml += getHtmlServer(server, username, password, "", "", "", "", false, "", "", "");
 							resultHtml += getHtmlErrorMessage(e.message);
						}
					}
					else {
						resultHtml += getHtmlOfflineServer(server, username, password, serverMAC, serverIP, serverUDP);
						VMShown = 0;
					}
					gadgetHeight += 17 + (VMShown * 17);  //server
 				}
 			} catch (e) {
 				resultHtml += getHtmlErrorMessage(e.message);
 				gadgetHeight += 17;
 			}

			if (vmList != null) {
				resultHtml += "<div id=\"VMContainer_"+ server + "\" style=\"position:relative;width:" + document.body.style.width + ";height:" + (VMShown * 17) + "px;border:0px;overflow:hidden\"><div id=\"VMContent_"+ server + "\" style=\"position:absolute;width:" + document.body.style.width + ";left:0;top:"
				if ((serverScroll != 0) && (serverScroll < (servermaxVMs - vmList.length) * 17)) {
					serverScroll = (servermaxVMs - vmList.length) * 17;
					if (serverScroll > 0) {
						serverScroll = 0;
					}
					saveScrolloffSet(server, serverScroll)
				}
				resultHtml += serverScroll;
				resultHtml += "\"><ilayer name=\"VMiLayer_" + server + "\" width=" + document.body.style.width + " height=" + (vmList.length * 17) + "px clip=\"0px,0px," + document.body.style.width + "," + (vmList.length * 17) + "px\"><layer name=\"VMLayer_" + server + "\" width=" + document.body.style.width + " height=" + (vmList.length * 17) + "px visibility=\"show\">";
				for (var x = 0; x < vmList.length; x++) {
					if (serverRDP == true && vmList[x][7] == 2) {
						resultHtml += getHtmlVm(server, serverConn, username, password, vmList[x][0], vmList[x][1], vmList[x][2], vmList[x][3], vmList[x][4], vmList[x][5], vmList[x][6], vmList[x][7], vmList[x][8], vmList[x][9], vmList[x][10]);
					}
					else {
						resultHtml += getHtmlVm(server, "None", username, password, vmList[x][0], vmList[x][1], vmList[x][2], vmList[x][3], vmList[x][4], vmList[x][5], vmList[x][6], vmList[x][7], vmList[x][8], vmList[x][9], vmList[x][10]);
					}
				}
				resultHtml += "</layer></ilayer></div></div>";
			}
        	}
 		DataArea.innerHTML = resultHtml;
 		document.body.style.height = gadgetHeight;
	}
}

function runVMConnect(server, vm)
{
    System.Shell.execute(VMConnect.value + "\\vmconnect.exe", server + " -G \"" + vm + "\"");
}

function runVMManager()
{
    System.Shell.execute(VMConnect.value + "\\virtmgmt.msc");
}

function runRDP(server, console)
{
    if (console) {
	System.Shell.execute("mstsc", "/admin /v " + server);
    } 
    else {
	System.Shell.execute("mstsc", "/v " + server);
    }
}

function runVMRDP(server, VM, username, password, console)
{
	var IPAddress = "";
	IPAddress = GetVMIP(server, VM, username, password);
	if (IPAddress != "") {
	
		if (console) {
			System.Shell.execute("mstsc", "/admin /v " + IPAddress);
		} 
		else {
			System.Shell.execute("mstsc", "/v " + IPAddress);
		}
	}
}

function HideMenu(divMenu)
{
    document.getElementById(divMenu).style.display = 'none';
}

function ShowMenu(divMenu)
{
    document.getElementById(divMenu).style.display = 'block';
    focus();
}

function VMChangeState(server, machine, stateId, username, password)
{
    ChangeState(server, machine, stateId, username, password);
    setTimeout("onTimer()", 1000);
}

function VMShutDown(server, machine, username, password)
{
    ShutDown(server, machine, username, password);
    setTimeout("onTimer()", 1000);
}

function GetHyperVPath()
{
    try
    {
        result = System.Shell.itemFromPath(System.Shell.knownFolderPath("ProgramFiles") + "\\Hyper-V\\vmconnect.exe");
        return System.Shell.knownFolderPath("ProgramFiles") + "\\Hyper-V";
    }
    catch(notFound)
    {
        return "";
    }
}