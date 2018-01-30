function removeFileExtension(layerName){
	if([layerName containsString:@"."]){
		var nameArray = [layerName componentsSeparatedByString:@"."];
		var name = nameArray[0];
		return name;
	} else {
		return layerName;
	}
}

function cli(context,  command) {

	var task = NSTask.alloc().init()
	var pipe = NSPipe.pipe()

	var path = getCurrentDirectory(context)
	command = `cd "${path}" && ${command}`

	task.setLaunchPath_('/bin/bash')
	task.setArguments_(NSArray.arrayWithObjects_('-c', '-l', command, null))
	task.standardOutput = pipe
	task.launch()

	const data = pipe.fileHandleForReading().readDataToEndOfFile()
	return NSString.alloc().initWithData_encoding_(data, NSUTF8StringEncoding)
}

function getCurrentDirectory (context) {
	return context.document.fileURL().URLByDeletingLastPathComponent().path()
}

function getTheCurrentBranch (context) {
	return cli(context, "git rev-parse --abbrev-ref HEAD");
}

function getTheCurrentRemote (context) {
	return cli(context, "git ls-remote --get-url");
}

function unzip(context, name) {
	var docname = removeFileExtension(name);
	cli(context, `cp ${name} ${docname}.zip`);
	cli(context, `unzip -o ${docname}.zip -d ${docname} && rm -Rf ${docname}.zip`);
	cli(context, `rm -Rf ${docname}/previews`);
}

function reloadSketch(context, name) {
	var docname = removeFileExtension(name);
	cli(context, `cd ${docname} && zip ${docname}.zip -r .`);
	cli(context, `cd ${docname} && cp ${docname}.zip ../${docname}.sketch`);
	cli(context, `rm -Rf ${docname}/${docname}.zip`);
}

function commitToRepo(context, comment) {
	cli(context, "git add .");
	return cli(context, "git commit -m\"" + comment + "\"");
}

function pushToRepo(context) {
	return cli(context, "git push");
}

function pullFromRepo(context) {
	return cli(context, 'git pull');
}

function expandJSON(context, name) {
	var path = getCurrentDirectory(context)
	var expandedPath = path + '/' + removeFileExtension(name);
	var installJsBeautify = `which js-beautify || npm install js-beautify -g`
	var jsPretty = `cd "${expandedPath}" && find . | grep json | xargs -I "{}" js-beautify -f "{}" -o "{}"`
	
	return cli(context, jsPretty)
}