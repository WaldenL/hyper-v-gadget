// This file contains the functions that are used by both the gadget and the settings

function saveServerList(prmServerList) {
    if (prmServerList != "") {
        System.Gadget.Settings.write("serverlist", GibberishAES.enc(prmServerList, System.Environment.machineName));
    }
    else {
        System.Gadget.Settings.write("serverlist", "");
    }
}

function saveServerinfo(oldServerList, oldServerInfo, server, user, pass, mac, ip, port, conn, maxVMs, vmCPU, vmDetails, VMs, Scroll)
{
    var newServerInfo = server + "###" + user + "###" + pass + "###" + mac + "###" + ip + "###" + port + "###" + conn + "###" + maxVMs + "###" + vmCPU + "###" + vmDetails + "###" + VMs + "###" + Scroll;
    var newServerList = "";

	if (oldServerInfo.length > 1)
	{
		var serverListArray = oldServerList.split("///");

		for (i=0; i < serverListArray.length; i++)
		{
		    if (serverListArray[i] == oldServerInfo) {
		        if (server == "") {
		            serverListArray[i] = "";
		        }
		        else {
		            serverListArray[i] = newServerInfo;
		        }
		        i = serverListArray.length;
		    }
		}
	
		var separator = "";

		for (i=0; i < serverListArray.length; i++)
		{
			if (serverListArray[i].length > 1) {
				newServerList = newServerList + separator + serverListArray[i];
				separator = "///";
			}
		}
		
	}
	else if (newServerInfo.length > 1)
	{
		if (oldServerList != "")
		{
			newServerList = oldServerList + "///" + newServerInfo;
		}
		else
		{
			newServerList = newServerInfo;
		}	
	}
    return newServerList
}

