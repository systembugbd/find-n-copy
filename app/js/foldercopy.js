console.clear();
const { remote } = require("electron");

const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");

const fsPromises = fs.promises;

let searchFileDetails = document.getElementById("searchFileDetails");
let showSuccessMsg = document.getElementById("showSuccessMsg");
let headingDetails = document.getElementById("headingDetails");
let findfolderncopy = document.getElementById("findfolderncopy");
let syncAsync = document.getElementsByName("flexRadioDefault");

function closeWindow() {
  var window = remote.getCurrentWindow();

  window.close();
  process.exit(1);
}

var myModal = new bootstrap.Modal(
  document.getElementById("exampleModalLabel"),
  {
    keyboard: false,
  }
);

if (syncAsync[0].checked) {
  // console.time('Sync Total Time start')
  /**
   * Sync Function
   */
  findfolderncopy.addEventListener("click", (e) => {
    myModal.show();
    setTimeout(() => {
      getValue();
    }, 1000);
    headingDetails.innerText = "Processing please wait...";
    searchFileDetails.innerHTML = "Searching Log details: ";
    showSuccessMsg.innerHTML = "";
  });

  const getValue = () => {
    let sourceurl = document.getElementById("sourceurl");
    let foldername = document.getElementById("foldername");
    // let disturl = document.getElementById("disturl");

    headingDetails.innerText = `Searching file for : \n ${foldername.value}`;

    findncopyfolder(sourceurl.value, foldername.value);
  };

  const readDir = (folderPath, foldername, disturl) => {
    //read subfolder of the current directory
    fs.readdirSync(folderPath).forEach((subfolder) => {
      //make subfolder path
      const subfolderPath = path.join(folderPath, subfolder);

      //check weather folder is directory or matched with the given folder name
      if (
        fs.lstatSync(subfolderPath).isDirectory() &&
        subfolder == foldername
      ) {
        console.log("Folder found and match", subfolder, foldername);
        //make a new distination path to create a dist folder
        const newDistPath = path.join(disturl, subfolder);
        !fs.existsSync(newDistPath) ? fs.mkdirSync(newDistPath) : "";
      } else {
        console.log("files", subfolderPath);
      }
    });
  };

  const deleteUnnecessaryFiles = (sourceurl, folder) => {
    // delete unnecessary file like desktop.init .db file etc
    const ext = path.extname(path.join(sourceurl, folder));
    if (ext === ".ini" || ext == ".db") {
      fs.unlinkSync(path.join(sourceurl, folder));
    }
  };

 
  const openFolderInWindowsExplorer = (folder) => {
    const { shell } = require("electron"); // deconstructing assignment

    shell.showItemInFolder(folder); // Show the given file in a file manager. If possible, select the file.
    // shell.openPath(folder); // Open the given file in the desktop's default manner.
  };

  /**
   * FindnCopy method
   * @param {*} sourceurl
   * @param {*} filename
   * @param {*} disturl
   */

  function findncopyfolder(sourceurl, foldername) {
    let log = console.log;

    try {
      const initSourcePath = path.join(sourceurl, foldername);

      fs.readdirSync(sourceurl).forEach((folder) => {
        const newpath = path.join(sourceurl, folder);

        const matched = folder
          .trim()
          .includes(document.getElementById("foldername").value.trim());

        if (fs.lstatSync(newpath).isDirectory() && matched) {
          const newFolderPath = path.join(sourceurl, folder);
          // log(newFolderPath, 'found')
          openFolderInWindowsExplorer(newFolderPath);
          if (
            confirm(
              "Your Desired folder is opened in windows explorer, Please Check. Press Ok to close."
            )
          ) {
            closeWindow();
          }
          
        } else {
          if (fs.lstatSync(newpath).isDirectory()) {
            let p3 = document.createElement("p");
            p3.textContent = `📁  ${folder}`;
            p3.style.fontSize = "15px";
            searchFileDetails.appendChild(p3);

            //recursive
            const newFolderPath = path.join(sourceurl, folder);
            findncopyfolder(newFolderPath, folder);
            myModal.hide();

          } else {
            let p4 = document.createElement("p");
            p4.textContent = `🗃 ${newpath}`;
            p4.style.padding = "0 0 0 30px";
            searchFileDetails.appendChild(p4);
            
            myModal.hide();
          }
        }
      });

    

      myModal.hide();
    } catch (error) {
      let p6 = document.createElement('p')
      p6.textContent = "Not found! Please provide proper location and folder name"
      p6.style.color="red"
      searchFileDetails.appendChild(p6)
      
      log(error.message);
      myModal.hide();
      // closeWindow();
    }
  }
} //if close sync

//OnClose Window Process will exit
// closeWindow()