const fs = require('fs');
const path = require('path');
const HTMLTOPDF = require('html-pdf');
const searchFileDetails = document.querySelector('#searchFileDetails');
const activityName = document.querySelector('#activityName');
const showSuccessMsg = document.querySelector('#showSuccessMsg');
const headingDetails = document.querySelector('#headingDetails');
const distUrl = document.querySelector('#distUrl');
const inputFile = document.querySelector('#inputFile');
const inputFile2 = document.querySelector('#inputFile');
const htmltopdf = document.querySelector('#htmltopdf');
const width = document.querySelector('#width');
const height = document.querySelector('#height');
const imagePlaceholder = document.querySelector('#imagePlaceholder');

const tempPathJPG = '../components/template/jpg';
const tempPathHTML = '../components/template/html-pdf';

const fsPromises = fs.promises;

const loadFIle = (files) => {
  if (files === 0) {
    let dataTitle = inputFile.getAttribute('data-count');
    inputFile.setAttribute('data-count', `(0) File converting...`);
  } else {
    inputFile.classList.remove('success');
    let dataTitle = inputFile.getAttribute('data-count');
    inputFile.setAttribute(
      'data-count',
      `${
        inputFile.files.length == 1
          ? inputFile.files.length + ' File converting...'
          : inputFile.files.length + ' Files converting...'
      }`
    );
  }
};

inputFile.addEventListener('change', (e) => {
  loadFIle(e.target.files.length);
});

htmltopdf.addEventListener('click', (e) => {
  // console.log(inputFile.files);
  if (inputFile.files.length === 0) {
    let dataTitle = inputFile.getAttribute('data-count');
    inputFile.setAttribute(
      'data-count',
      `\nPlease Select at least one or more file, before Convert`
    );
    inputFile.classList.add('error');

    return;
  } else {
    inputFile.classList.remove('error');
    inputFile.classList.remove('success');

    if (inputFile.files.length !== 0) {
      let dataTitle = inputFile.getAttribute('data-count');
      inputFile.setAttribute(
        'data-count',
        `${
          inputFile.files.length == 1
            ? inputFile.files.length + ' File converting...'
            : inputFile.files.length + ' Files converting...'
        }`
      );
      inputFile.classList.remove('success');
    }

    let filePath = path.join(inputFile.files[0].path);
    let dirname = path.dirname(filePath);

    let originalFileName = path.join(inputFile.files[0].name);
    let filenameForPdf = originalFileName.match(/([^\/]+)(?=\.\w+$)/)[0];
    let ext = originalFileName.split('.')[1];

    let pdfwidth = '2000'; // width.value;
    let pdfheight = '2000'; //height.value;
    makeHtmlFileFirst(
      inputFile.files,
      dirname,
      originalFileName,
      filenameForPdf,
      ext,
      pdfwidth,
      pdfheight
    );
    // htmltopdfGenerator("pdf", dirname, originalFileName, filenameForPdf, ext, pdfwidth, pdfheight);
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
function buildHtml(inputFile) {
  let fileName = '';
  let originalImagePath = '';

  let html = document.createElement('html');
  let head = document.createElement('head');
  let title = document.createElement('title');

  let body = document.createElement('body');

  body.style.width = '1800';

  for (let i = 0; i < inputFile.length; i++) {
    originalImagePath = inputFile[i].path;
    fileName = originalImagePath
      .substring(
        originalImagePath.lastIndexOf('\\') + 1,
        originalImagePath.length
      )
      .match(/([^\/]+)(?=\.\w+$)/).input;

    let imgDiv = document.createElement('div');
    let imgTable = document.createElement('table');

    let tr1 = document.createElement('tr');
    let tr2 = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');

    var img = new Image();
    img.src = inputFile[i].path;
    img.onload = function () {
      imgDiv.style.display = 'inline';
      imgDiv.style.verticalAlign = 'top';
      imgDiv.style.float = 'left';
      imgDiv.style.marginRight = '20px';
      imgDiv.style.marginBottom = '20px';

      imgTable.style.border = '0';
      imgTable.style.display = 'inline-block';

      td1.innerHTML = `<p>${this.width} x ${this.height}</p>`;
      td2.innerHTML = `<img src='../jpg/${fileName}' width="${this.width}" height="${this.height}" />`;

      tr1.appendChild(td1);
      tr2.appendChild(td2);
      imgTable.appendChild(tr1);
      imgTable.appendChild(tr2);

      imgDiv.appendChild(imgTable);
      body.appendChild(imgDiv);
    };
  }

  title.innerHTML = fileName;

  head.appendChild(title);
  html.appendChild(head);
  html.appendChild(body);

  return html;
}

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
  let distPath = path.join(__dirname, `../components/template/html-pdf`);
  let html = '';

  let imgAttr = {};
  let headerName = '';

  for (let i = 0; i < inputFile.length; i++) {
    let originalImagePath = inputFile[i].path;

    let fileName = originalImagePath
      .substring(
        originalImagePath.lastIndexOf('\\') + 1,
        originalImagePath.length
      )
      .match(/([^\/]+)(?=\.\w+$)/).input;

    headerName = fileName; //Activity name

    let templateImagePath = path.join(__dirname, `${tempPathJPG}/${fileName}`);

    let distPath = path.join(__dirname, tempPathHTML);

    let template = path.join(`${distPath}/index_SA.html`);

    // let template = path.join(`${distPaths}/index_SA.html`);
    let html_file_path =
      distUrl.value != ''
        ? path.join(distUrl.value, '/html-pdf/index_SA.html')
        : template;

    if (distUrl.value != '') {
      let baseDistHtmlPath = path.join(distUrl.value, '/html-pdf');

      if (!fs.existsSync(baseDistHtmlPath)) {
        fs.mkdirSync(baseDistHtmlPath);
      }
    } else {
      let tempHTMLPath = path.join(__dirname, tempPathHTML);
      let templateJpgPath = path.join(__dirname, '../components/template/');

      if (!fs.existsSync(tempHTMLPath)) {
        fs.mkdirSync(tempHTMLPath);
        if (!fs.existsSync(path.join(__dirname, tempPathJPG))) {
          fs.mkdirSync(path.join(__dirname, tempPathJPG));
        }
      }
    }

    //write file after few second as per image
    if (!fs.existsSync(html_file_path)) {
      fs.createWriteStream(html_file_path);
    }

    // let htmlFile = fs.readFileSync(html_file_path, "utf8"); //not in use

    distUrl.value == ''
      ? fs.copyFileSync(originalImagePath, templateImagePath)
      : '';

    imgAttr[i] = {}; //for multidimension dimention array

    var dimensionPattern = /([0-9]{1,4}[W-Yw-y][0-9]{1,4})/g;
    var size = fileName.match(dimensionPattern);

    // console.log(fileName, dimensionPattern);
    var dim = size[1].split('x');

    html += `
      \n
        
         <div style="display:inline-block; vertical-align:top; float:left; margin-right:20px; margin-bottom:20px;">
          <table border="0" style="display:inline-block;">
            <tbody>
              <tr>
                <td><p style="font-family: arial">${size[1]}</p></td>
              </tr>
              <tr>
                <td><img src="../jpg/${fileName}" width="${dim[0]}" height="${dim[1]}" /></td>
              </tr>
            </tbody>
          </table>
          </div>    
          
 `;
  } //for loop clonsed*************************HTML GENERATEOR LOOP END *****************************

  // console.log(html)

  let distPaths = path.join(__dirname, tempPathHTML);
  // let template = path.join();
  let template = path.join(`${distPaths}/index_SA.html`);
  let html_file_path =
    distUrl.value != ''
      ? path.join(distUrl.value, '/html-pdf/index_SA.html')
      : template;

  // let htmlContent = buildHtml(inputFile)

  //write file after few second as per image

  if (!fs.existsSync(html_file_path)) {
    fs.createWriteStream(html_file_path);
  }

  setTimeout(() => {
    fs.writeFile(
      html_file_path,
      `<p style="font-family: arial">${
        activityName.value != '' ? activityName.value : headerName
      }</p>`,
      'utf8',
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
    appendImageContentInHTML();
    // alert('HTML is Ready, will Open shortly in your browser, please few sec.');
  }, 1000);

  function appendImageContentInHTML() {
    setTimeout(() => {
      fs.appendFile(html_file_path, html, 'utf8', function (err) {
        if (err) {
          console.log(err);
        }
      });
      require('electron').shell.openExternal(html_file_path);
      // alert('HTML is Ready, will Open shortly in your browser, please few sec.');
    }, inputFile.length * 50);

    inputFile2.setAttribute(
      'data-count',
      `\nHTML File Created Successfully, Please have a look in browser.`
    );
    inputFile2.classList.add('success');
  }
  // console.log(html_file_path) //Once PDF is one then make below line uncomment
  // htmltopdfGenerator( "pdf", distPaths, template, filenameForPdf, ext,  pdfwidth, pdfheight)
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
    distUrl.value == ''
      ? path.join(distPaths, `${fileName}.${typeOfConvertion}`)
      : path.join(distUrl.value, `${fileName}.${typeOfConvertion}`);
  const htmlFilePath = templatePath;

  try {
    // required for html file
    if (!fs.existsSync(htmlFilePath)) {
      alert(
        "Template file does not exists, please demo html file with the name 'index_SA.html'"
      );
      return;
    }

    const readHTMLFile = fs.readFileSync(htmlFilePath, 'utf-8');

    const quality = typeOfConvertion == 'pdf' ? 200 : 300;

    const option = {
      type: typeOfConvertion,
      quality: quality,
      renderDelay: 2000,
      format: 'undefined',
      width: `${pdfwidth}px`,
      height: `${pdfheight}px`,
      orientation: 'portrait',
    };

    HTMLTOPDF.create(readHTMLFile, option).toFile(
      pdfFilePath,
      (err, result) => {
        if (err) {
          alert(err);
        } else {
          // console.log(result);
          require('electron').shell.openExternal(htmlFilePath);

          let dataTitle = inputFile.getAttribute('data-count');
          inputFile.setAttribute(
            'data-count',
            `\nHTML File Created Successfully, Please have a look in browser.`
          );
          inputFile.classList.add('success');
        }
      }
    );
  } catch (error) {
    alert(error.message);
  }
};
