const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

// run().catch(err => console.log(err));

async function run(filenameForPdf, imageFullPath, ext) {
  // Create a new document and add a new page
  const doc = await PDFDocument.create();
  const page = doc.addPage();

  // Load the image and store it as a Node.js buffer in memory
  let img = fs.readFileSync(imageFullPath);
  if (ext == 'png') {
    img = await doc.embedPng(img);
  } else {
    img = await doc.embedJpg(img);
  }

  // Draw the image on the center of the page
  const {width, height} = img.scale(1);
  page.setWidth(width);
  page.setHeight(height);
  page.drawImage(img, {
    x: page.getWidth() / 2 - width / 2,
    y: page.getHeight() / 2 - height / 2
  });

 
  // console.log(`${filenameForPdf}.pdf`);
  // Write the PDF to a file
fs.writeFileSync(filenameForPdf, await doc.save());
  return true;
}



module.exports = run;