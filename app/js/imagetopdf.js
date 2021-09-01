const { remote } = require("electron");
const paths = require("path");
let run = require("../js/pdfmaker-pdf-lib");

const imagetopdf = document.getElementById("imagetopdf");
const inputFile = document.getElementById("inputFile");
const distUrl = document.getElementById("distUrl");

let searchFileDetails = document.getElementById("searchFileDetails");
let showSuccessMsg = document.getElementById("showSuccessMsg");
let headingDetails = document.getElementById("headingDetails");

var myModal = new bootstrap.Modal(
  document.getElementById("exampleModalLabel"),
  {
    keyboard: false,
  }
);

/**
 * Close and Exit Process when Close
 */
function closeWindow() {
  var window = remote.getCurrentWindow();

  window.close();
  process.exit(1);
}

const loadFIle = (files) => {
  if (files === 0) {
    let dataTitle = inputFile.getAttribute("data-count");
    inputFile.setAttribute("data-count", `(0) File converting...`);
  } else {
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

imagetopdf.addEventListener("click", (e) => {
  
  convertImageToPDF();
  setTimeout(() => {
    myModal.hide();
  }, 500)
  myModal.show();
});

const convertImageToPDF = async () => {

  headingDetails.innerText = "Processing please wait...";
  searchFileDetails.innerHTML = "Converting Log details: ";
  showSuccessMsg.innerHTML = "";

  if (inputFile.files.length === 0) {
    setTimeout(() => {
      myModal.hide();
      let p7 = document.createElement("p");
      p7.textContent = "Can't convert image to pdf, please check image path!";
      p7.style.color = "red";
      searchFileDetails.appendChild(p7);
   }, 500)

  }



  try {
    let distFilePath = "";
    for (const iterator of inputFile.files) {
      let imageFullPath = paths.join(iterator.path);
      let filenameForPdf = imageFullPath.match(/([^\/]+)(?=\.\w+$)/)[0];
      let onlyFileName = imageFullPath
        .substring(imageFullPath.lastIndexOf("\\") + 1, imageFullPath.length)
        .match(/([^\/]+)(?=\.\w+$)/)[0];
      let ext = imageFullPath.split(".").pop();
      if (distUrl.value != "") {
        distFilePath = paths.join(distUrl.value, `${onlyFileName}.pdf`);
      } else {
        distFilePath = paths.join(`${filenameForPdf}.pdf`);
      }

      const done = await run(distFilePath, imageFullPath, ext).catch((err) =>
        console.log(err)
      );

      if (done) {
        setTimeout(() => {
          myModal.hide();
       }, 500)
        let p4 = document.createElement("p");
        p4.textContent = `Image Source: 🗃 ${imageFullPath}, \n \tDist: 🗃 ${distFilePath}`;
        p4.style.padding = "0 0 0 30px";
        searchFileDetails.appendChild(p4);

        showSuccessMsg.innerHTML =
          "PDF Successfully Converted, please check Distination Folder";
        headingDetails.innerText = "Done 😇 ";
        
         
      }

    
    }
  } catch (error) {
    let p6 = document.createElement("p");
    p6.textContent = "Can't convert image to pdf, please check image path!";
    p6.style.color = "red";
    searchFileDetails.appendChild(p6);

    log(error);
    myModal.hide();
  }
 
};

//OnClose Window Process will exit
// closeWindow()
