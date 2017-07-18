Function getWMIPath(server, username, password)
    Set objLocator = CreateObject("WbemScripting.SwbemLocator")

    If username = "" Then
        Set objWMIService = objLocator.ConnectServer(server, "root\virtualization")
    Else
        Set objWMIService = objLocator.ConnectServer(server, "root\virtualization", username, password)
    End IF
            
    Set colItem = objWMIService.ExecQuery("select * from __namespace where name='v2'")
	
	If colItem.count > 0 Then
		getWMIPath = "root\virtualization\v2"
	Else 
		getWMIPath = "root\virtualization"
	End IF
   
	Set objWMIService = Nothing
    Set colItem = Nothing
    Set objLocator = Nothing           
End Function

Function ChangeState(server, machine, stateId, username, password)
	Set objLocator = CreateObject("WbemScripting.SwbemLocator")

	WMIPath = getWMIPath(server, username, password)
	
	If username = "" Then
		Set objWMIService = objLocator.ConnectServer(server, WMIPath)
	Else
		Set objWMIService = objLocator.ConnectServer(server, WMIPath)
	End IF
	        
	Set colItem = objWMIService.ExecQuery("select * from Msvm_ComputerSystem where Name='" + machine + "'")
	colItem.ItemIndex(0).RequestStateChange(stateId)
    
    Set objWMIService = Nothing
	Set colItem = Nothing
	Set objLocator = Nothing	       
End Function
        
Function ShutDown(server, machine, username, password)
	Set objLocator = CreateObject("WbemScripting.SwbemLocator")

	If machine <> "" Then
	
		WMIPath = getWMIPath(server, username, password)
	        
		If username = "" Then
			Set objWMIService = objLocator.ConnectServer(server, WMIPath)
		Else
			Set objWMIService = objLocator.ConnectServer(server, WMIPath, username, password)
		End IF
			            
		Set shutdownItem = objWMIService.ExecQuery("select * from Msvm_ShutdownComponent where SystemName='" + machine + "'")
		vmReturn = shutDownItem.ItemIndex(0).InitiateShutdown(True,"Scripted Shutdown")
	Else
		If username = "" Then
			Set objWMIService = objLocator.ConnectServer(server, "root\cimv2")
		Else
			Set objWMIService = objLocator.ConnectServer(server, "root\cimv2", username, password)
		End if
		Set shutdownItem = objWMIService.ExecQuery("select * from Win32_OperatingSystem where Primary=true")
		shutDownItem.ItemIndex(0).Win32Shutdown(12)
	End if
    
    Set objWMIService = Nothing
	Set shutdownItem = Nothing
	Set objLocator = Nothing
End Function

Function IsAlive(strTarget)
	Set objLocalWMI = GetObject("winmgmts:\\.\root\cimv2")
	Set colPingStatus = objLocalWMI.ExecQuery ("Select * from Win32_PingStatus Where Address = '" & strTarget & "'")
	IsAlive = false
	For Each objPingStatus in colPingStatus	
		If objPingStatus.StatusCode = 0 Then
			IsAlive = True
		End if
	Next
	Set colPingStatus = Nothing
	Set objLocalWMI = Nothing
End Function

Function IsIPv4(sIPAddress)
  aOctets = Split(sIPAddress,".")
  
  If IsArray(aOctets) Then
    If UBound(aOctets) = 3 Then
      For Each sOctet In aOctets
        On Error Resume Next
        sOctet = Trim(sOctet)
        sOctet = sOctet + 0
        On Error Goto 0
        
        If IsNumeric(sOctet) Then
          If sOctet < 0 Or sOctet > 256 Then
            IsIPv4 = False
            Exit Function
          End If
        Else
          IsIPv4 = False
          Exit Function
        End If
      Next
      IsIPv4 = True
    Else
      IsIPv4 = False
    End If
  Else
    IsIPv4 = False
  End If
End Function

Function IPv4EqualOctets(sIPAddress)
	ServerOctetArray = split (sIPAddress, ".")
	HighestOctets = 0
	Set objWMIService = GetObject("winmgmts:\\.\root\cimv2")
	Set colNetAdapters = objWMIService.ExecQuery ("Select * from Win32_NetworkAdapterConfiguration where IPEnabled=TRUE")
	For Each objNetAdapter in colNetAdapters
		For Each AdapterIPAddress in objNetAdapter.IPAddress
			If IsIPv4(AdapterIPAddress) = true Then
				AdapteroctetArray = split (AdapterIPAddress, ".")
				if ServerOctetArray(0) = AdapteroctetArray(0) and ServerOctetArray(1) = AdapteroctetArray(1) and ServerOctetArray(2) = AdapteroctetArray(2) and ServerOctetArray(3) = AdapteroctetArray(3) Then
					Octets = 4
				else
					if ServerOctetArray(0) = AdapteroctetArray(0) and ServerOctetArray(1) = AdapteroctetArray(1) and ServerOctetArray(2) = AdapteroctetArray(2) Then
						Octets = 3
					else
						if ServerOctetArray(0) = AdapteroctetArray(0) and ServerOctetArray(1) = AdapteroctetArray(1) Then
							Octets = 2
						else
							if ServerOctetArray(0) = AdapteroctetArray(0) and ServerOctetArray(1) = AdapteroctetArray(1) Then
								OctetMatch = 1
							else
								if ServerOctetArray(0) = AdapteroctetArray(0) Then
									Octets = 1
								else
									Octets = 0
								end if
							end if
						end if
					end if
				end if
				if Octets > HighestOctets then
					HighestOctets = Octets
				end if
			End If
		Next
	Next
	set ColNetAdapters = Nothing
	set objWMIService = Nothing
	IPv4EqualOctets = HighestOctets
End Function

'WakeUp "192.168.1.100", "", "001B3409D6C3", "9", "", ""
'WakeUp "Servername", "192.168.1.100", "001B3409D6C3", "9", "", "" 
'WakeUp "Servername", "", "001B3409D6C3", "9", "", "" --> Does not yet work DNS or Hosts table lookup needed (How?)
Function WakeUp(Server, IPAddress, MACAddress, PortNumber, username, password)
dim useIPAddress
dim SubNetSearch
dim SubNetFound
dim NetMask
	If IPAddress <> "" Then
		useIPAddress = IPAddress
	Else
		If IsIPv4(Server) = True then
			useIPAddress = Server
		Else
			'Would be nice if we could determine the IPAddress from the DNS server or Hosts table
			useIPAddress = ""
		End If
	End If
	If Not useIPAddress = "" Then
		'By default use exact (internet) broadcast
		NetMask = "255.255.255.255"
		octetArray = split (useIPAddress, ".")
		SubNetSearch = octetArray(0) + "." + octetArray(1) + "." + octetArray(2)
		Set objWMIService = GetObject("winmgmts:\\.\root\cimv2")
		Set colNetAdapters = objWMIService.ExecQuery ("Select * from Win32_NetworkAdapterConfiguration where IPEnabled=TRUE")
		For Each objNetAdapter in colNetAdapters
			For Each AdapterIPAddress in objNetAdapter.IPAddress
				If isIPv4(AdapterIPAddress) = true Then
					octetArray = split (AdapterIPAddress, ".")
					SubNetFound = octetArray(0) + "." + octetArray(1) + "." + octetArray(2)
					If SubNetFound = SubNetSearch Then
						'Use SubNet broadcast since the server is on the same subnet
						NetMask = "0.0.0.0"
						Exit For
 					End If
				End If
			Next
			If NetMask = "0.0.0.0" Then
				Exit For
			End If
		Next
		set ColNetAdapters = Nothing
		set objWMIService = Nothing
		set WakeOnLan = createobject("WolCom.Wol")
		WakeOnLan.TheMacAddress(MACAddress)
		WakeOnLan.TheIpNumber(useIPAddress)
		WakeOnLan.TheSubnetMask(NetMask)
		WakeOnLan.ThePortNumber(PortNumber)
		WakeOnLan.WakeMeUp
		set WakeOnLan = Nothing
	End If
End Function

Function GetServerMemory(server, username, password)
	Set objLocator = CreateObject("WbemScripting.SwbemLocator")
    
	If Len(username) = 0 Then
		Set objcimv2WMIService = objLocator.ConnectServer(server, "root\cimv2")
	Else
		Set objcimv2WMIService = objLocator.ConnectServer(server, "root\cimv2", username, password)
	End If
    	    
	Set HostItem = objcimv2WMIService.ExecQuery("select FreePhysicalMemory from Win32_OperatingSystem where Primary=true")
    
	freeRam = 0
	For Each servItem in HostItem
		FreeRam = servItem.FreePhysicalMemory
	Next	
	freeRam2 = FormatNumber(Left(FreeRam, Len(FreeRam) - 3))
	GetServerMemory = Left(freeRam2, Len(freeRam2) - 3) + " MB"
    
	Set objcimv2WMIService = Nothing
	Set HostItem = Nothing
	Set objLocator = Nothing
End Function

Function GetServerRDP(server, username, password)
dim RDP

	Set objLocator = CreateObject("WbemScripting.SwbemLocator")
    
	If Len(username) = 0 Then
		Set objcimv2WMIService = objLocator.ConnectServer(server, "root\cimv2")
	Else
		Set objcimv2WMIService = objLocator.ConnectServer(server, "root\cimv2", username, password)
	End If
    	    
	Set HostItem = objcimv2WMIService.ExecQuery("select Caption from Win32_OperatingSystem where Primary=true")
    
	RDP = false
	For Each servItem in HostItem
		if not isempty(servItem.Caption) and not isnull(servItem.Caption) then
			if instr(servItem.Caption, "2008 R2") > 0 then
				RDP = true
			end if
		end if
	Next	
	GetServerRDP = RDP
    
	Set objcimv2WMIService = Nothing
	Set HostItem = Nothing
	Set objLocator = Nothing
End Function

Function GetVMIP(server, VM, username, password)
	Err.Clear
	IPAddress = ""
	Set objLocator = CreateObject("WbemScripting.SwbemLocator")
    
	WMIPath = getWMIPath(server, username, password)
	
	If Len(username) = 0 Then
		Set objWMIService = objLocator.ConnectServer(server, WMIPath)
	Else
		Set objWMIService = objLocator.ConnectServer(server, WMIPath, username, password)
	End If
	If Err = 0 Then
 		On Error Resume Next
       
		Set colItems = objWMIService.ExecQuery("select Name, EnabledState from Msvm_ComputerSystem where Name = '" & VM & "'")
		If Err = 0 and colItems.Count = 1 Then
			For Each vmItem in colItems
       			 	If vmItem.EnabledState = 2 Then
					Set vmKVP = (vmItem.Associators_("Msvm_SystemDevice", "Msvm_KvpExchangeComponent")).ItemIndex(0)
					If Err = 0 Then
						Set xmlDoc = CreateObject("Microsoft.XMLDOM")
						xmlDoc.async = "false"
						for each exchangeDataItem in vmKVP.GuestIntrinsicExchangeItems
							xmlDoc.loadXML(exchangeDataItem)
 							xpath = "/INSTANCE/PROPERTY[@NAME='Name']/VALUE/child:text()"
							set node = xmlDoc.selectSingleNode(xpath)
							nodeType = node.text
							if nodeType = "RDPAddressIPv4" or nodeType = "NetworkAddressIPv4" then
								xpath = "/INSTANCE/PROPERTY[@NAME='Data']/VALUE/child:text()"
								set node = xmlDoc.selectSingleNode(xpath)
								If not node is Nothing Then
									if node.text <> "" Then
										'IPv4 Address available so use the "best" = "nearest" IP address available
										IPList = Split(node.text, ";")
										HighestOctetMatch = 0
										IPIndex = 0
										while IPIndex <= Ubound(IPList)
											OctetMatch = Ipv4EqualOctets(IPList(IPIndex))
											if OctetMatch >= HighestOctetMatch Then
												IPAddress = IPList(IPIndex)
											end if
											IPIndex = IPIndex + 1
										Wend
										if nodeType = "RDPAddressIPv4" Then
											exit for
										End If
									end if
								end if
							Else
								if IPAddress = "" Then
									'Only use IPv6 Addresses when no IPv4 Address is found yet.
									if nodeType = "RDPAddressIPv6" or nodeType = "NetworkAddressIPv6" then
										xpath = "/INSTANCE/PROPERTY[@NAME='Data']/VALUE/child:text()"
										set node = xmlDoc.selectSingleNode(xpath)
										If not node is Nothing Then
											If node.text <> "" Then
												'Get the last Ip address from the list
												IPList = Split(node.text, ";")
												IPAddress = IPList(Ubound(IPList))
												if nodeType = "RDPAddressIPv6" Then
													exit for
												end if
											end if
										End if
									end if
								End if
							End if
						next
						Set xmlDoc = Nothing
					End If
					Set vmKVP = Nothing
				End If
			next
		End If
		Set colItems = Nothing
	End If
 	GetVMIP = IPAddress
	Set objWMIService = Nothing
	Set objLocator = Nothing
End Function

Function GetVMs(server, username, password, CPU, Details)
	Err.Clear
	Set objLocator = CreateObject("WbemScripting.SwbemLocator")
    
	WMIPath = getWMIPath(server, username, password)
	
	If Len(username) = 0 Then
		Set objWMIService = objLocator.ConnectServer(server, WMIPath)
	Else
		Set objWMIService = objLocator.ConnectServer(server, WMIPath, username, password)
	End If

	If Err = 0 Then
 		On Error Resume Next
 
		vmNumber = 0
		if Details = "true" Then
			Set objVMService = objWMIService.ExecQuery("SELECT * FROM Msvm_VirtualSystemManagementService").ItemIndex(0) 
			If Err = 0 Then
				SummaryInfo = Array(0,1,4,100,101,103,104,105,106,109)
				If objVMService.GetSummaryInformation(NULL,SummaryInfo,colItems) = 0 Then
					for each objItem in colItems 
						vmNumber = vmNumber + 1
					next
				End If
      			End If
		End if
 
		Dim vmArray()
		If Err = 0 and vmNumber > 0 Then
			ReDim vmArray(vmNumber - 1, 10)
    
			vmNumber = 0
			For Each vmItem in colItems
				vmArray(vmNumber, 0) = vmItem.Name
				vmArray(vmNumber, 1) = vmItem.ElementName
       	 			vmArray(vmNumber, 2) = vmItem.EnabledState
        			vmArray(vmNumber, 3) = ""
        			vmArray(vmNumber, 4) = vmItem.ProcessorLoad
				vmArray(vmNumber, 5) = vmItem.NumberOfProcessors
        			vmArray(vmNumber, 6) = vmItem.MemoryUsage
        			vmArray(vmNumber, 7) = vmItem.Heartbeat
        			vmArray(vmNumber, 8) = vmItem.Uptime
        			vmArray(vmNumber, 9) = vmItem.GuestOperatingSystem
        			vmArray(vmNumber, 10) = vmItem.HealthState
        			vmNumber = vmNumber + 1
			Next
		else
			'Fallback in case Msvm_VirtualSystemManagementService is not available on the server or flag to show details is off.
			Err.clear
			Set colItems = objWMIService.ExecQuery("select Name,ElementName,HealthState,EnabledState,OnTimeInMilliseconds from Msvm_ComputerSystem where ElementName<>Name")
			If Err = 0 Then
				ReDim vmArray(colItems.Count - 1, 10)
    
				vmNumber = 0
				For Each vmItem in colItems
					vmArray(vmNumber, 0) = vmItem.Name
					vmArray(vmNumber, 1) = vmItem.ElementName
	       	 			vmArray(vmNumber, 2) = vmItem.EnabledState
	        			vmArray(vmNumber, 3) = ""
	        			vmArray(vmNumber, 4) = Null
					vmArray(vmNumber, 5) = Null
	        			vmArray(vmNumber, 6) = Null
	        			vmArray(vmNumber, 7) = 2 'Heart beat is allways show as OK
	        			vmArray(vmNumber, 8) = vmItem.OnTimeInMilliseconds
	        			vmArray(vmNumber, 9) = Null
	        			vmArray(vmNumber, 10) = vmItem.HealthState
	        			vmNumber = vmNumber + 1
				Next
			end if

		end if
		If Err = 0 and vmNumber > 0 and CPU = "true" Then
			'Get the cpu usage for the virtual machines
   			Set cpuItems = objWMIService.ExecQuery("select Name,LoadPercentageHistory from Msvm_Processor")
        		For Each cpuItem in cpuItems
				found = false
				vmEntry = 0
				while vmEntry < vmNumber and found = false
            				if vmArray(vmEntry, 0) = cpuItem.Name then
            					found = true
            					cpuPerc = ""
            					For Each loadPerc in cpuItem.LoadPercentageHistory
                					 cpuPerc = cpuPerc + "," + CStr(loadPerc)
            					Next
            					vmArray(vmEntry, 3) = cpuPerc
					else
						vmEntry = vmEntry + 1
					end if
            			wend
		        Next
			Set cpuItems = Nothing
		end if
		GetVMs = vmArray
		Set objVMService = Nothing
	end if
	Set objWMIService = Nothing
	Set objLocator = Nothing
End Function