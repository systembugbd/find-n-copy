
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { sendCopyInfo } = require('./renderer');

console.log(sendCopyInfo.sourceurl, sendCopyInfo)

// let findPath = process.argv[2];
// let distPath = process.argv[3];
askQuestion();
async function askQuestion() {
  const answers = await inquirer.prompt([
    {
      type: "text",
      name: "sourceurl",
      message: "From where are you looking for?",
      default: "Source URL",
    },
    {
      type: "text",
      name: "filename",
      message: "Which file you are looking for",
      default: "trustmark.png",
      when: (a) => a.sourceurl,
    },
    {
      type: "text",
      name: "disturl",
      message: "Where to copy file?",
      default: "Distination URL",
      when: (a) => a.filename,
    },
  ]);
    
     const { sourceurl, filename, disturl } = answers;
     findncopy(sourceurl, filename, disturl);
}

/**
 * FindnCopy method 
 * @param {*} sourceurl 
 * @param {*} filename 
 * @param {*} disturl 
 */
function findncopy(sourceurl, filename, disturl) {
 
  const sourceFullPath = path.join(sourceurl, filename);
  const disturlFullPath = path.join(disturl, 'fileFound', filename);
     
try {
  if (!fs.existsSync(sourceFullPath)) {
     
    const allfolder = fs.readdirSync(sourceurl);
   
    allfolder.forEach(folder => {
      const newPath = path.join(sourceurl, folder)
      const newFilePath = path.join(newPath, filename)
      
      if (fs.lstatSync(newPath).isDirectory()) {
        // console.log("Folder: "+ folder,)
        // console.log("new File Path : " + newFilePath,)
        // console.log("New Folder Path : " + newPath)

        if (fs.existsSync(newFilePath)) {
          console.log("File Found", newFilePath)
          fs.mkdirSync(path.join(disturl, 'fileFound'))
          fs.copyFileSync(newFilePath, disturlFullPath)
          console.log("File Copied Successfully, please check", disturlFullPath)
          process.exit(1)
        } else {
          findncopy(newPath, filename, disturl)
        }

      } else {

        console.log(folder, 'There are some other folder');
       
      }
    

    })

    console.log(allfolder.forEach(file => { file }));
}
} catch (error) {
  console.log(error.message)
}

}




/*
C:\Users\Shaheb.Ali\Downloads
trustmark.png
C:\Users\Shaheb.Ali\Downloads
*/