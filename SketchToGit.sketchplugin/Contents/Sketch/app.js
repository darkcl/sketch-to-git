@import 'common.js'

var onRun = function (context) {
    var doc = context.document;
    var sketch = context.api()

    sketch.alert('', 'File Unzipping.')

    unzip(context, doc.displayName());
    expandJSON(context, doc.displayName());
    
    sketch.alert('', 'File Unzipped.')
}

var onGenerateIgnore = function (context) {
    cli(context, 'echo "*.sketch" >> .gitignore');
}

var onRepoInfo = function (context) {
    var sketch = context.api(),
        branch = getTheCurrentBranch(context),
        remote = getTheCurrentRemote(context);
    sketch.alert(remote,branch);
}

var onReload = function (context) {
    var doc = context.document,
    sketch = context.api();
    var inputs = sketch.getSelectionFromUser("You confirm to reload ?", ["Yes"], 0);
    if (inputs[0] != "1001") {
        reloadSketch(context, doc.displayName());
        // [NSApp sendAction:'saveDocument:' to:nil from:doc]
    }

}

var onCommit = function(context) {
    var sketch = context.api()
    var doc = context.document;
    var result = [doc askForUserInput:"What did you change?" initialValue:""];
    commitToRepo(context, result)
}

var onPush = function(context) {
    var sketch = context.api()
    sketch.alert(pushToRepo(context), '')
}

var onPull = function(context) {
    var sketch = context.api()
    

    var doc = context.document;
    unzip(context, doc.displayName());
    reloadSketch(context, doc.displayName());
    sketch.alert(pullFromRepo(context), 'File Reloaded.')
}