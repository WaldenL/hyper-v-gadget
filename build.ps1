#Build the src directory into the gadget (which is nothing more than a zip file with the .gadget extension)
#Assumes PowerShell 3 and at least .Net 4.0

del hyper-v-gadget.gadget
Add-Type -A System.IO.Compression.FileSystem
[IO.Compression.ZipFile]::CreateFromDirectory('src', 'hyper-v-gadget.gadget')