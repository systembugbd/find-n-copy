console.clear();
const {remote} = require('electron');

const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
 
 

const fsPromises = fs.promises;


let searchFileDetails = document.getElementById("searchFileDetails");
let showSuccessMsg = document.getElementById("showSuccessMsg");
let headingDetails = document.getElementById("headingDetails");
let stopfinding = document.getElementById("stopfinding");
let syncAsync = document.getElementsByName("flexRadioDefault");



function closeWindow () {        
  
    var window = remote.getCurrentWindow();
    window.close();
  
}


var myModal = new bootstrap.Modal(document.getElementById('exampleModalLabel'), {
  keyboard: false
})




if (syncAsync[0].checked) {
  // console.time('Sync Total Time start')
  /**
   * Sync Function
   */
  findncopybtn.addEventListener("click", (e) => {
    
    myModal.show();
    setTimeout(() => {
      getValue() 
},1000)
    headingDetails.innerText = "Processing please wait..."
    searchFileDetails.innerHTML = "Searching Log details: "
    showSuccessMsg.innerHTML = ""
 
  });
  
  const getValue = () => {
    let findncopybtn = document.getElementById("findncopybtn");
    let sourceurl = document.getElementById("sourceurl");
    let filename = document.getElementById("filename");
    let disturl = document.getElementById("disturl");
   
    headingDetails.innerText = `Searching file for : \n ${filename.value}`
    
    findncopy(sourceurl.value, filename.value, disturl.value);
  }
  
  
  /**
   * FindnCopy method 
   * @param {*} sourceurl 
   * @param {*} filename 
   * @param {*} disturl 
   */
  function findncopy(sourceurl, filename, disturl) {
 
   
    const splitFile = filename.split(",");
    try {
    for (let i = 0; i < splitFile.length; i++){
      let filename = splitFile[i].trim();
      const sourceFullPath = path.join(sourceurl, filename);
      const disturlFullPath = path.join(disturl, 'findNcopy', filename);
      
   
        if (!fs.existsSync(sourceFullPath)) {
          
          const allfolder = fs.readdirSync(sourceurl);
          
          allfolder.forEach(folder => {
            const newPath = path.join(sourceurl, folder)
            const newFilePath = path.join(newPath, filename)
         
            
            if (fs.lstatSync(newPath).isDirectory()) {
              
              if (fs.existsSync(newFilePath)) {
                // console.log("File Found", newFilePath)
                if (!fs.existsSync(path.join(disturl, 'findNcopy'))){
                  fs.mkdirSync(path.join(disturl, 'findNcopy'))
                }
                fs.copyFileSync(newFilePath, disturlFullPath)
                let p = document.createElement('p')
                p.textContent = `File Found:🗃  ${newFilePath}`
                searchFileDetails.appendChild(p)
                
                let p2 = document.createElement('p')
                p2.textContent = `File FindNCopy Successfully, please check...`
                setTimeout(() => {
                  p2.textContent = "";
                  
                },2000)
                showSuccessMsg.appendChild(p2)
               
                // console.log("File Copied Successfully, please check your locatlion", disturlFullPath)
                
                
                myModal.hide();
               

              } else {
                let p3 = document.createElement('p')
                // p3.textContent = `Directory 📂  ${newPath}`
                p3.textContent = `📁  ${folder}`;
                p3.style.fontSize= "15px"
                searchFileDetails.appendChild(p3)
                //recursive
                findncopy(newPath, filename, disturl)
                myModal.hide();
              
               
              }
            } else {
              let p4 = document.createElement('p')
              p4.textContent = `      🗃 ${newPath}`
              p4.style.padding= "0 0 0 30px"
                searchFileDetails.appendChild(p4)
              // console.log(folder, 'There are some other item which cant scan...');
              myModal.hide();
            }
         
         
            
          })
       
          // closeWindow()
          // process.exit(1);
          myModal.hide();
        } else {
          let p6 = document.createElement('p')
          p6.textContent = `"File not Found, Please provide proper file name with extention"`
          p6.style.color="red"
          searchFileDetails.appendChild(p6)
          myModal.hide();

          // console.log("File not Found, Please provide proper file name with extention")
      
    }
  }
} catch (error) {
      console.log(error.message)
      myModal.hide();
    }
   
  }
 
 
} else {
   

 // console.time('Sync Total Time start')
  /**
   * Sync Function
   */
   findncopybtn.addEventListener("click", (e) => {
    
    myModal.show();
    setTimeout(() => {
      getValueAsync() 
},1000)
    headingDetails.innerText = "Processing please wait..."
    searchFileDetails.innerHTML = "Searching Log: "
    showSuccessMsg.innerHTML = ""
 
  });
  
   const getValueAsync = async () => {
    let findncopybtn = document.getElementById("findncopybtn");
    let sourceurl = document.getElementById("sourceurl");
    let filename = document.getElementById("filename");
    let disturl = document.getElementById("disturl");
   
    headingDetails.innerText = `Searching file for : \n ${filename.value}`
    
    await findncopy(sourceurl.value, filename.value, disturl.value);
  }
  
  
  /**
   * FindnCopy method Async Function
   * @param {*} sourceurl 
   * @param {*} filename 
   * @param {*} disturl 
   */
   async function findncopy(sourceurl, filename, disturl) {
    
    const splitFile = filename.split(",");
    try {
    for (let i = 0; i < splitFile.length; i++){
      let filename = splitFile[i].trim();
      const sourceFullPath = path.join(sourceurl, filename);
      const disturlFullPath = path.join(disturl, 'findNcopy', filename);
      
   
        if (await !fsPromises.existsSync(sourceFullPath)) {
          
          const allfolder = await fsPromises.readdirSync(sourceurl);
          
          allfolder.forEach(folder => {
            const newPath = path.join(sourceurl, folder)
            const newFilePath = path.join(newPath, filename)
            
            
            if (fsPromises.lstatSync(newPath).isDirectory()) {
              
              if (fsPromises.existsSync(newFilePath)) {
                // console.log("File Found", newFilePath)
                if (!fsPromises.existsSync(path.join(disturl, 'findNcopy'))){
                  fsPromises.mkdirSync(path.join(disturl, 'findNcopy'))
                }
                fsPromises.copyFileSync(newFilePath, disturlFullPath)
                let p = document.createElement('p')
                p.textContent = `File Found:🗃  ${newFilePath}`
                searchFileDetails.appendChild(p)
                
                let p2 = document.createElement('p')
                p2.textContent = `File FindNCopy Successfully, please check...`
                setTimeout(() => {
                  p2.textContent = "";
                  
                },2000)
                showSuccessMsg.appendChild(p2)
               
                // console.log("File Copied Successfully, please check your locatlion", disturlFullPath)
                
                
                myModal.hide();

              } else {
                let p3 = document.createElement('p')
                // p3.textContent = `Directory 📂  ${newPath}`
                p3.textContent = `📁  ${folder}`;
                p3.style.fontSize= "15px"
                searchFileDetails.appendChild(p3)
                //recursive
                findncopy(newPath, filename, disturl)
                myModal.hide();
                  
               
              }
            } else {
              let p4 = document.createElement('p')
              p4.textContent = `      🗃 ${newPath}`
              p4.style.padding= "0 0 0 30px"
                searchFileDetails.appendChild(p4)
              // console.log(folder, 'There are some other item which cant scan...');
              myModal.hide();
            }
         
            
            
          })
       
         
          myModal.hide();
        } else {
          let p6 = document.createElement('p')
          p6.textContent = `"File not Found, Please provide proper file name with extention"`
          searchFileDetails.appendChild(p6)
          myModal.hide();

          // console.log("File not Found, Please provide proper file name with extention")
      
    }
  }
} catch (error) {
      console.log(error.message)
      myModal.hide();
    }
   
  }
 


  
}//Else Close of Async


 










/*
C:\Users\Shaheb.Ali\Downloads
trustmark.png
C:\Users\Shaheb.Ali\Downloads
*/





