const http = require("http")
const fsPromises = require("fs/promises")
const fs = require("fs")
const path = require("path");
const port = 3000
const shouldSpamConsole = false;
function spam(msg) {
    if (shouldSpamConsole) {
        console.log(msg)
    }
}
const serveFile = async (filePath, contentType, response) => {
    try {
        const data = await fsPromises.readFile(
            filePath,
            contentType === "text/html" || contentType === "text/css" || contentType === "text/js"
            ? "utf8"
            : ""
        );
        response.writeHead(200, {"Content-Type":contentType});
        response.end(data);

    } catch (err) {
        spam(err)
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer(function(req,res) {
    if (req.url === "/favicon.ico") {
        res.end();
        return;
    }
    const extension = path.extname(req.url);
    let contenttype;
    switch (extension) {
        case ".html":
            contenttype = "text/html"
            break;
        case ".css":
            contenttype = "text/css"
            break;
        case ".js":
            contenttype = "text/js"
            break;
        case ".json":
            contenttype = "application/json"
            break;
        case ".txt":
            contenttype = "text/plain"
            break;
        case ".jpg" || ".jpeg":
            contenttype = "image/jpeg"
            break;
        case ".png":
            contenttype = "image/png"
            break;
        default:
            contenttype = "text/html"
            break;
    }


    spam("Requested URL:" + req.url)
    spam("Content type:" + contenttype)
    let filePath;
    if (contenttype === "text/html") {
        filePath = "index.html";
    }
    if (contenttype === "image/png" || contenttype === "image/jpeg") {
        filePath = req.url.slice(1)
    }
    if (!filePath) {
        spam("Invalid content type: " + contenttype);
        filePath = "";
    }
    spam("File path: " + filePath)
    //if no extension found, defaults to html
    if (!extension && req.url.slice(-1) !== "/") {
        filePath += "index.html";
    }
    spam("Does file exist? " + fs.existsSync(filePath))
    const fileExists = fs.existsSync(filePath);
    if (fileExists) {
        spam("Serving file " + filePath + " with content type " + contenttype)
        serveFile(filePath, contenttype, res);
    } else {
        switch(path.parse(filePath).base) {
            case "old-page.html":
                res.writeHead(301, {"Location":"/new-page.html"});
                res.end();
                break;
            case "www-page.html":
                res.writeHead(301, {"Location":"/"});
                res.end();
                break;
            default:
                serveFile(path.join(__dirname, "404.html"), "text/html", res);
        }
    }

})

server .listen(port, function(error) {
    if (error) {
        spam("An error occurred", error)
    } else {
        console.log(`Server listening on port ${port}`)
    }
})