System.Gadget.onSettingsClosing = SettingsClosing;

function onLoad()
{
    initSettings();

    showTab("generalTab");
}


function clearTabColors() {
    generalTab.style.backgroundColor = "";
    serverTab.style.backgroundColor = "";
}

function showTab(tabName) {
    clearTabColors();
    
    switch (tabName) {
        case "serverTab":
            serverTab.style.backgroundColor = "#ddd";
            serverTabPanel.style.display = "";
            generalTabPanel.style.display = "none";
            break;
        default:
            generalTab.style.backgroundColor = "#ddd";
            generalTabPanel.style.display = "";
            serverTabPanel.style.display = "none";
            break;
    }
}

function SettingsClosing(event)
{
	if (event.closeAction == event.Action.commit) {
		saveSettings();
        }
	event.cancel = false;
}

function initSettings()
{
    loadSettings();
}

function tempLoadLanguage() {
    loadLanguage(languageSelect.options[languageSelect.selectedIndex].value);
    populateLanguage();
}

function loadSettings() {
    if (System.Gadget.Settings.read("serverlist") != "") {
        try {
            serverListString.value = GibberishAES.dec(System.Gadget.Settings.read("serverlist"), System.Environment.machineName);
        }
        catch (e) {
        }
    } 
    RefreshTime.value = System.Gadget.Settings.read("refreshtime");    
    GadgetVersion.innerText = System.Gadget.version;
    VMClickType.value = System.Gadget.Settings.read("vmclicktype");
    languageSelect.value = System.Gadget.Settings.read("language");
    VMMenu.checked = System.Gadget.Settings.read("vmmenu");
    loadServers();

    loadLanguage(System.Gadget.Settings.read("language"));
    populateLanguage();
}

function populateLanguage() {
    addServer.value = messages.newServer;
    moveUpServer.value = messages.moveUpServer;
    moveDownServer.value = messages.moveDownServer;
    removeServer.value = messages.removeServer;
    saveServer.value = messages.saveServer;

    serverLabel2.innerHTML = messages.serverLabel;
    requiredLabel.innerHTML = messages.requiredLabel;

    usernameLabel.innerHTML = messages.usernameLabel;
    passwordLabel.innerHTML = messages.passwordLabel;
    connectionLabel.innerHTML = messages.connectionLabel;
    consoleOption.innerHTML = messages.consoleOption;
    terminalOption.innerHTML = messages.terminalOption;
    bothOption.innerHTML = messages.bothOption;
    noneOption.innerHTML = messages.noneOption;
    macAddressLabel.innerHTML = messages.macAddressLabel;
    ipAddressLabel.innerHTML = messages.ipAddressLabel;
    udpPortLabel.innerHTML = messages.udpPortLabel;
    wakeOnLanLabel.innerHTML = messages.wakeOnLanLabel;
    wakeOnLanLabel2.innerHTML = messages.wakeOnLanLabel;
    wakeOnLanLabel3.innerHTML = messages.wakeOnLanLabel;

    refreshTimeLabel.innerHTML = messages.refreshTime;
    secondsLabel.innerHTML = messages.seconds;
    showVMLabel.innerHTML = messages.showVMLabel;
    VMLabel.innerHTML = messages.VMLabel;
    VMCPU.innerHTML = messages.VMCPULabel;
    VMDetails.innerHTML = messages.VMDetailsLabel;

    clickBehaviourLabel.innerHTML = messages.clickBehaviour;
    ondblclickOption.innerHTML = messages.ondblclickOption;
    onclickOption.innerHTML = messages.onclickOption;
    serverControlLabel.innerHTML = messages.serverControl;

    madeByLabel.innerHTML = messages.madeBy;
    andLabel.innerHTML = messages.and;
    versionLabel.innerHTML = messages.version;
    checkUpdatesLabel.innerHTML = messages.checkUpdates;

    generalTabLabel.innerHTML = messages.generalTab;
    serverTabLabel.innerHTML = messages.serverTab;

    languageLabel.innerHTML = messages.language;
    translationdByLabel.innerHTML = messages.translationdBy;
    translationdByNameLabel.innerHTML = messages.translationdByName;
}

function saveSettings() {
    saveServerList(serverListString.value);

    if (/^-?\d+$/.test(RefreshTime.value))
        System.Gadget.Settings.write("refreshtime", RefreshTime.value);
    
    System.Gadget.Settings.write("vmmenu", VMMenu.checked);
    System.Gadget.Settings.write("vmclicktype", VMClickType.options[VMClickType.selectedIndex].value);
    System.Gadget.Settings.write("language", languageSelect.options[languageSelect.selectedIndex].value);
}

function clearServerSelect()
{
	while (serverList.options.length > 0) 
	{
    		serverList.options[0] = null;
	}

}

function saveServerEnter()
{
    if (event.keyCode == 13)
    {
        event.cancelBubble = true;
        event.returnValue = false;
        addServerSave();
    }
}

function saveServerEnter_MAC()
{
    if (event.keyCode == 13)
    {
        event.cancelBubble = true;
        event.returnValue = false;
        addServerSave();
    }
    else
    {
	if (event.keyCode > 31 && (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 65 || event.keyCode > 72) && (event.keyCode < 97 || event.keyCode > 104)) {
            event.cancelBubble = true;
	    event.returnValue = false;
	}
    }
}

function saveServerEnter_IP()
{
    if (event.keyCode == 13)
    {
        event.cancelBubble = true;
        event.returnValue = false;
        addServerSave();
    }
    else
    {
	if (event.keyCode > 31 && event.keyCode != 46 && (event.keyCode < 48 || event.keyCode > 57)) {
            event.cancelBubble = true;
	    event.returnValue = false;
	}
    }
}

function saveServerEnter_Numeric()
{
    if (event.keyCode == 13)
    {
        event.cancelBubble = true;
        event.returnValue = false;
        addServerSave();
    }
    else {
	if (event.keyCode > 31 && (event.keyCode < 48 || event.keyCode > 57)) {
	    event.cancelBubble = true;
	    event.returnValue = false;
	}
    }
}

function onlyNumeric()
{
    if (event.keyCode > 31 && (event.keyCode < 48 || event.keyCode > 57)) {
	event.cancelBubble = true;
	event.returnValue = false;
    }
}

function loadServers()
{
	clearServerSelect();

	var serverListArray = serverListString.value.split("///");

	for (i=0; i < serverListArray.length; i++)
	{
		var serverInfoArray = serverListArray[i].split("###");

		if (serverInfoArray.length >= 1)
		{
			serverList.options.add(new Option(serverInfoArray[0], serverListArray[i], false, false));
		}
	}
}

function showServerInfo(selObj)
{
	addServerOldServer.value = selObj.options[selObj.selectedIndex].value
	
	var serverInfo = addServerOldServer.value.split("###");
	
	if (serverInfo.length == 12)
	{
		addServerName.value = serverInfo[0];
		addServerUser.value = serverInfo[1];
		addServerPass.value = serverInfo[2];
		addServerMAC.value = serverInfo[3];
		addServerIP.value = serverInfo[4];
		addServerUDP.value = serverInfo[5];
		addServerConn.value = serverInfo[6];
		addServerMaxVMs.value = serverInfo[7];
		if (serverInfo[8] == "true") {
			addServerVMCPU.checked = true;
		}
		else {
			addServerVMCPU.checked = false;
		}
		if (serverInfo[9] == "true") {
			addServerVMDetails.checked = true;
		}
		else {
			addServerVMDetails.checked = false;
		}
		addServerVMs.value = serverInfo[10];
		addServerScroll.value = serverInfo[11];
	}
    	addServerDiv.style.visibility = 'visible'; 
    	addServerDiv2.style.visibility = 'visible'; 
}

function addServerAdd()
{
	serverList.selectedIndex = -1;
	addServerOldServer.value = "";
	addServerName.value = "";
	addServerUser.value = "";
	addServerPass.value = "";
	addServerMAC.value = "";
	addServerIP.value = "";
	addServerUDP.value = "";
	addServerConn.value = "Terminal";
	addServerMaxVMs.value = "10";
	addServerVMCPU.checked = true;
	addServerVMDetails.checked = false;
	addServerVMs.value = "visible";
	addServerScroll.value = "0";
	addServerDiv.style.visibility = 'visible'; 
	addServerDiv2.style.visibility = 'visible'; 
	addServerName.focus();
}

function addServerSave()
{
	if (addServerName.value.length > 1)
	{
		if (addServerMaxVMs.value == "") {
			addServerMaxVMs.value = "10"
		}
		serverListString.value = saveServerinfo(serverListString.value, addServerOldServer.value, addServerName.value, addServerUser.value, addServerPass.value, addServerMAC.value, addServerIP.value, addServerUDP.value, addServerConn.options[addServerConn.selectedIndex].value, addServerMaxVMs.value, addServerVMCPU.checked, addServerVMDetails.checked, addServerVMs.value, "0")
		loadServers();
		serverList.selectedIndex = -1;
		addServerDiv.style.visibility = 'hidden';
		addServerDiv2.style.visibility = 'hidden';
	}
}

function addServerRemove()
{
	serverListString.value = saveServerinfo(serverListString.value, addServerOldServer.value, "", "", "", "", "", "", "", "", "", "", "", "");
	loadServers();
	serverList.selectedIndex = -1;
	addServerDiv.style.visibility = 'hidden';
	addServerDiv2.style.visibility = 'hidden';
}

function MoveUp() {
   if ( serverList.length > 1) {
      var selected = serverList.selectedIndex;
      if (selected != -1) {
            if ( selected != 0 ) {
               var moveText1 = serverList[selected-1].text;
               var moveText2 = serverList[selected].text;
               var moveValue1 = serverList[selected-1].value;
               var moveValue2 = serverList[selected].value;
               serverList[selected].text = moveText1;
               serverList[selected].value = moveValue1;
               serverList[selected-1].text = moveText2;
               serverList[selected-1].value = moveValue2;
               serverList.selectedIndex = selected-1;

		SaveList();
            }
         }
      }
}

function MoveDown() {
   if ( serverList.length > 1) {
      var selected = serverList.selectedIndex;
      if (selected != -1) {
            if ( selected != serverList.length-1 ) {
               var moveText1 = serverList[selected+1].text;
               var moveText2 = serverList[selected].text;
               var moveValue1 = serverList[selected+1].value;
               var moveValue2 = serverList[selected].value;
               serverList[selected].text = moveText1;
               serverList[selected].value = moveValue1;
               serverList[selected+1].text = moveText2;
               serverList[selected+1].value = moveValue2;
               serverList.selectedIndex = selected+1; 

		SaveList();
            } 
         }
      }
}

function SaveList()
{
	var newList = "";
	var separator = "";

	for (i = 0; i < serverList.length; i++) {
	    if (serverList.options[i].value != "") {
	        newList = newList + separator + serverList.options[i].value;
	        separator = "///";
	    }
	}

	serverListString.value = newList;

	var selectedIndex = serverList.selectedIndex;	
	loadServers();
	serverList.selectedIndex = selectedIndex;	
}