const fs = require("fs");
const path = require("path");
const HTMLTOPDF = require("html-pdf");
const searchFileDetails = document.querySelector("#searchFileDetails");
const activityName = document.querySelector("#activityName");
const showSuccessMsg = document.querySelector("#showSuccessMsg");
const headingDetails = document.querySelector("#headingDetails");
const distUrl = document.querySelector("#distUrl");
const inputFile = document.querySelector("#inputFile");
const inputFile2 = document.querySelector("#inputFile");
const htmltopdf = document.querySelector("#htmltopdf");
const columnNumber = document.querySelector("#columnNumber");
const width = document.querySelector("#width");
const height = document.querySelector("#height");
const imagePlaceholder = document.querySelector("#imagePlaceholder");
const isDimensionRequired = document.getElementById("isDimensionRequired");
const isJapanRecquirement = document.querySelector("#isJapanRecquirement");
const isCtaExists = document.querySelector("#isCtaExists");
const addAnchor = document.querySelector("#addAnchor");

const tempPathJPG = "../components/template/jpg";
const tempPathHTML = "../components/template/html-pdf";

const fsPromises = fs.promises;

const loadFIle = (files) => {
  if (files === 0) {
    let dataTitle = inputFile.getAttribute("data-count");
    inputFile.setAttribute("data-count", `(0) File converting...`);
  } else {
    inputFile.classList.remove("success");
    let dataTitle = inputFile.getAttribute("data-count");
    inputFile.setAttribute(
      "data-count",
      `${
        inputFile.files.length == 1
          ? inputFile.files.length + " File converting..."
          : inputFile.files.length + " Files converting..."
      }`
    );
  }
};

inputFile.addEventListener("change", (e) => {
  loadFIle(e.target.files.length);
});

htmltopdf.addEventListener("click", (e) => {
  // console.log(inputFile.files);
  if (inputFile.files.length === 0) {
    let dataTitle = inputFile.getAttribute("data-count");
    inputFile.setAttribute(
      "data-count",
      `\nPlease Select at least one or more file, before Convert`
    );
    inputFile.classList.add("error");

    return;
  } else {
    inputFile.classList.remove("error");
    inputFile.classList.remove("success");

    if (inputFile.files.length !== 0) {
      let dataTitle = inputFile.getAttribute("data-count");
      inputFile.setAttribute(
        "data-count",
        `${
          inputFile.files.length == 1
            ? inputFile.files.length + " File converting..."
            : inputFile.files.length + " Files converting..."
        }`
      );
      inputFile.classList.remove("success");
    }

    let filePath = path.join(inputFile.files[0].path);
    let dirname = path.dirname(filePath);

    let originalFileName = path.join(inputFile.files[0].name);
    let filenameForPdf = originalFileName.match(/([^\/]+)(?=\.\w+$)/)[0];
    let ext = originalFileName.split(".")[1];

    let pdfwidth = "2000"; // need to set dynamic input value #input.value;
    let pdfheight = "2000"; // need to set dynamic input value #input.value;

    makeHtmlFileFirst(
      inputFile.files,
      dirname,
      originalFileName,
      filenameForPdf,
      ext,
      pdfwidth,
      pdfheight
    );
    // htmltopdfGenerator(
    //   "pdf",
    //   dirname,
    //   originalFileName,
    //   filenameForPdf,
    //   ext,
    //   pdfwidth,
    //   pdfheight
    // );
  } //else
});

function getMeta(originalImagePath, callback) {
  var img = new Image();
  img.src = originalImagePath;
  img.onload = function () {
    callback(this.width, this.height);
  };
}

/**
 *
 * @param {*} inputFile
 * @returns html content with image
 */
// function buildHtml(inputFile) {
//   let fileName = "";
//   let originalImagePath = "";

//   let htmlDoc = document.implementation.createHTMLDocument("Draggable Images");

//   let head = htmlDoc.head;
//   let title = htmlDoc.createElement("title");
//   title.textContent = "Draggable Images";

//   let metaViewport = htmlDoc.createElement("meta");
//   metaViewport.name = "viewport";
//   metaViewport.content = "width=device-width, initial-scale=1.0";

//   // Create and append dynamic styles to head
//   let style = htmlDoc.createElement("style");
//   style.innerHTML = `
//       .draggable {
//           position: absolute; /* Ensure the element is positioned absolutely */
//           cursor: grab;
//       }
//       body {
//           width: 1800px; /* Ensure width has px */
//       }
//   `;

//   head.appendChild(title);
//   head.appendChild(metaViewport);
//   head.appendChild(style);

//   let body = htmlDoc.body;

//   for (let i = 0; i < inputFile.length; i++) {
//       originalImagePath = inputFile[i].path;
//       fileName = originalImagePath
//           .substring(
//               originalImagePath.lastIndexOf("\\") + 1,
//               originalImagePath.length
//           )
//           .match(/([^\/]+)(?=\.\w+$)/).input;

//       let imgDiv = document.createElement("div");
//       let imgTable = document.createElement("table");

//       let tr1 = document.createElement("tr");
//       let tr2 = document.createElement("tr");
//       let td1 = document.createElement("td");
//       let td2 = document.createElement("td");

//       var img = new Image();
//       img.src = inputFile[i].path;
//       img.onload = function () {
//           imgDiv.style.display = "inline";
//           imgDiv.style.verticalAlign = "top";
//           imgDiv.style.marginRight = "20px";
//           imgDiv.style.marginBottom = "20px";
//           imgDiv.className = "draggable"; // Add draggable class

//           imgTable.style.border = "0";
//           imgTable.style.display = "inline-block";
//           td1.innerHTML = `<p>${this.width} x ${this.height}</p>`;
//           td2.innerHTML = `<img src='../jpg/${fileName}' width="${this.width}" height="${this.height}" />`;

//           tr1.appendChild(td1);
//           tr2.appendChild(td2);
//           imgTable.appendChild(tr1);
//           imgTable.appendChild(tr2);

//           imgDiv.appendChild(imgTable);
//           body.appendChild(imgDiv);

//           makeElementDraggable(imgDiv); // Make imgDiv draggable
//       };
//   }

//   return `<!DOCTYPE html>${htmlDoc.documentElement.outerHTML}`;
// }

// function makeElementDraggable(element) {
//   let shiftX, shiftY;

//   element.addEventListener('mousedown', (event) => {
//       shiftX = event.clientX - element.getBoundingClientRect().left;
//       shiftY = event.clientY - element.getBoundingClientRect().top;

//       element.style.position = 'absolute';
//       element.style.zIndex = 1000;
//       document.body.append(element);

//       moveAt(event.pageX, event.pageY);

//       function moveAt(pageX, pageY) {
//           element.style.left = pageX - shiftX + 'px';
//           element.style.top = pageY - shiftY + 'px';
//       }

//       function onMouseMove(event) {
//           moveAt(event.pageX, event.pageY);
//       }

//       document.addEventListener('mousemove', onMouseMove);

//       element.addEventListener('mouseup', () => {
//           document.removeEventListener('mousemove', onMouseMove);
//           element.onmouseup = null;
//       });
//   });

//   element.ondragstart = () => false;
// }

/**
 *
 * @param {*} inputFile
 * @param {*} dirname
 * @param {*} originalFileName
 * @param {*} filenameForPdf
 * @param {*} ext
 * @param {*} pdfwidth
 * @param {*} pdfheight
 */
const makeHtmlFileFirst = (
  inputFile,
  dirname,
  originalFileName,
  filenameForPdf,
  ext,
  pdfwidth,
  pdfheight
) => {
  let html = "";
  let imgAttr = [];
  let headerName = "";

  for (let i = 0; i < inputFile.length; i++) {
    let originalImagePath = inputFile[i].path;

    let fileName = originalImagePath
      .substring(
        originalImagePath.lastIndexOf("\\") + 1,
        originalImagePath.length
      )
      .match(/([^\/]+)(?=\.\w+$)/).input;

    headerName = fileName; // Activity name

    let templateImagePath = path.join(__dirname, `${tempPathJPG}/${fileName}`);

    let distPath = path.join(__dirname, tempPathHTML);

    let template = path.join(`${distPath}/index_SA.html`);

    let html_file_path =
      distUrl.value != ""
        ? path.join(distUrl.value, "/html-pdf/index_SA.html")
        : template;

    if (distUrl.value != "") {
      let baseDistHtmlPath = path.join(distUrl.value, "/html-pdf");

      if (!fs.existsSync(baseDistHtmlPath)) {
        fs.mkdirSync(baseDistHtmlPath);
      }
    } else {
      let tempHTMLPath = path.join(__dirname, tempPathHTML);
      let templateJpgPath = path.join(__dirname, "../components/template/");

      if (!fs.existsSync(tempHTMLPath)) {
        fs.mkdirSync(tempHTMLPath);
        if (!fs.existsSync(path.join(__dirname, tempPathJPG))) {
          fs.mkdirSync(path.join(__dirname, tempPathJPG));
        }
      }
    }

    if (!fs.existsSync(html_file_path)) {
      fs.createWriteStream(html_file_path);
    }

    distUrl.value == ""
      ? fs.copyFileSync(originalImagePath, templateImagePath)
      : "";

    let dimensionPattern = /([0-9]{1,4}[W-Yw-y][0-9]{1,4})/g;
    let size = fileName.match(dimensionPattern);

    let dim = size[1].split("x");

    imgAttr.push({
      width: parseInt(dim[0]),
      height: parseInt(dim[1]),
      fileName: fileName,
      dimension: size[1],
    });
  }

  // Sort images by their area (width * height)
  imgAttr.sort((a, b) => a.width * a.height - b.width * b.height);

  // Generate HTML
  imgAttr.forEach((img, index) => {
    html += `
      <div id=${index} style="display:inline-block; vertical-align:top; float:left; margin-right:20px; margin-bottom:20px;">
        <table border="0" style="display:inline-block;">
          <tbody>
            <tr>
              <td><p style="font-family: arial">${
                isDimensionRequired.checked
                  ? img.dimension +
                    (isCtaExists.checked ? "_No_CTA" : " ") +
                    (isJapanRecquirement.checked
                      ? `<span style="color:red; font-weight:bold;padding-left:calc(${
                          img.dimension.split("x")[0]
                        }px - 400px)"> [Place Your Product name here]</span>` +
                        (addAnchor.checked
                          ? `<span><a style="${
                              index == 0
                                ? "display:none"
                                : "display:inline-block"
                            }" href="#${index - 1}">↟</a> <a style="${
                              index == imgAttr.length - 1
                                ? "display:none"
                                : "display:inline-block"
                            }" href="#${index + 1}">↡</a></span>`
                          : "")
                      : "")
                  : img.dimension
              }</p></td>
            </tr>
            <tr>
              <td><img src="../jpg/${img.fileName}" width="${
      img.width
    }" height="${img.height}" /></td>
            </tr>
          </tbody>
        </table>
      </div>`;
    let col = columnNumber.value;
    if ((index + 1) % col === 0) {
      html += `<div style="clear:both">&nbsp;</div>`;
    }
  });

  let distPaths = path.join(__dirname, tempPathHTML);
  let template = path.join(`${distPaths}/index_SA.html`);
  let html_file_path =
    distUrl.value != ""
      ? path.join(distUrl.value, "/html-pdf/index_SA.html")
      : template;

  if (!fs.existsSync(html_file_path)) {
    fs.createWriteStream(html_file_path);
  }

  setTimeout(() => {
    fs.writeFile(
      html_file_path,
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${
            activityName.value != "" ? activityName.value : headerName
          }</title>
          <style>
              body {
                  width: 1800px;
              }
          </style>
      </head>
      <body>
          <p style="font-family: arial">${
            activityName.value != "" ? activityName.value : headerName
          }</p>
          ${html}
      </body>
      </html>`,
      "utf8",
      function (err) {
        if (err) {
          console.log(err);
        } else {
          require("electron").shell.openExternal(html_file_path);
          inputFile2.setAttribute(
            "data-count",
            `\nHTML File Created Successfully, Please have a look in browser.`
          );
          inputFile2.classList.add("success");
        }
      }
    );
  }, 1000);
};

/****************************************** PDF GENERATOR *****************************************************/
//Function Start  PDF Generator

/**
 *
 * @param {*} typeOfConvertion
 * @param {*} distPath
 * @param {*} originalFileName
 * @param {*} fileName
 * @param {*} ext
 * @param {*} pdfwidth
 * @param {*} pdfheight
 * @returns
 */
//Function Start  PDF Generator

const htmltopdfGenerator = (
  typeOfConvertion,
  distPaths,
  templatePath,
  fileName,
  ext,
  pdfwidth,
  pdfheight
) => {
  const pdfFilePath =
    distUrl.value == ""
      ? path.join(distPaths, `${fileName}.${typeOfConvertion}`)
      : path.join(distUrl.value, `${fileName}.${typeOfConvertion}`);
  const htmlFilePath = templatePath;
  console.log(pdfFilePath);
  try {
    // required for html file
    //C:\Users\sali2\Downloads
    if (!fs.existsSync(htmlFilePath)) {
      alert(
        "Template/html-pdf file does not exists, please add demo html file with the name 'index_SA.html'"
      );
      return;
    }
    const readHTMLFile = fs.readFileSync(htmlFilePath, "utf-8");

    const quality = typeOfConvertion == "pdf" ? 200 : 300;

    const option = {
      type: typeOfConvertion,
      quality: quality,
      renderDelay: 2000,
      format: "undefined",
      width: `${pdfwidth}px`,
      height: `${pdfheight}px`,
      orientation: "portrait",
    };

    HTMLTOPDF.create(readHTMLFile, option).toFile(
      pdfFilePath,
      (err, result) => {
        if (err) {
          alert(err);
        } else {
          // console.log(result);
          require("electron").shell.openExternal(htmlFilePath);

          let dataTitle = inputFile.getAttribute("data-count");
          inputFile.setAttribute(
            "data-count",
            `\nHTML File Created Successfully, Please have a look in browser.`
          );
          inputFile.classList.add("success");
        }
      }
    );
  } catch (error) {
    alert(error.message);
  }
};
