
// // // var fs = require('fs');
// // // const fs1 = require('fs').promises;
// // // const puppeteer = require('puppeteer');

// // // const _sendResponse = require('../../app/helper/global').sendResponse;
// // // const _errorResponse = require('../../app/helper/global').errorResponse;
// // // const _validationErrors = require('../../app/helper/global').validationErrors;

// // // // const creditRepositoryR = require('../../repositories/creditRepository');
// // // // const creditRepository = new creditRepositoryR();

// // // class locationController {
// // //     constructor() { }


// // //     async listlocation(req, res) {
// // //         try {
// // //             let listlocation = {
// // //                 "city": "Mumbai"
// // //             }
// // //             //var cartData1 = await cartdata(req,res)
// // //             _sendResponse(res, 200, "locationship List", listlocation);

// // //         } catch (err) {
// // //             if (err.errors) {
// // //                 _validationErrors(res, err.errors);
// // //             } else if (err.message == undefined) {
// // //                 let error = err.split('|');
// // //                 _sendResponse(res, error[1], error[0]);
// // //             } else {
// // //                 _errorResponse(res, 500, 'Internal Server Error :: ' + err.message);
// // //             }
// // //         }

// // //     }

// // //     async uploadHTML(req, res) {
// // //         try {

// // //             // var upload = uploadFile.single('file_new')
// // //             // let path =
// // //             //     __basedir + "/uploads/" + req.file.filename;
// // //             if (req.file == undefined) {
// // //                 _sendResponse(res, 400, "Please upload an html file!");
// // //                 return;
// // //                 //return res.status(400).send("Please upload an excel file!");
// // //             }
// // //             const htmlBuffer = req.file.buffer;
// // //             let path =
// // //                 __basedir + "/uploads/" + req.file.filename;

// // //             const browser = await puppeteer.launch({ headless: 'new' });
// // //             const page = await browser.newPage();
// // //             await page.goto(`file://${path}`, { waitUntil: 'networkidle2' });

// // //             // await page.evaluate(() => {
// // //             //     document.getElementById('defaultPDF').click();
// // //             // });
// // //             const client = await page.target().createCDPSession();
// // //             await client.send('Page.setDownloadBehavior', {
// // //                 behavior: 'allow',
// // //                 downloadPath: '/home/ubuntu/Projects/EAClub/downloads', // Specify your desired download path
// // //             });
// // //             // const browserContext = browser.defaultBrowserContext();

// // //             // // Set the download path for files
// // //             // await browserContext.setDefaultOptions({
// // //             //     downloadPath: '/home/ubuntu/EAClub/downloads', // Specify your desired download path
// // //             // });




// // //             // Open the temporary HTML file


// // //             // Generate PDF from the HTML file
// // //             const pdf = await page.pdf({ format: 'A4' });

// // //             // Close the browser
// // //             await browser.close();

// // //             // var fileUrl = await locationUtils.uploadFiles3(req, path);


// // //             res.setHeader('Content-Type', 'application/pdf');
// // //             res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');
// // //             res.status(200).send(pdf);
// // //             // _sendResponse(res, 200, "Excel File Uploaded", fileUrl);

// // //             // Clean up: Delete the temporary HTML file
// // //             await fs1.unlink(path);

// // //             //  var cartData1 = await cartdata(req, res)


// // //         } catch (err) {
// // //             //throw err;
// // //             if (err.errors) {
// // //                 _validationErrors(res, err.errors);
// // //             } else if (err.message == undefined) {
// // //                 let error = err.split('|');
// // //                 _sendResponse(res, error[1], error[0]);
// // //             } else {
// // //                 _errorResponse(res, 500, 'Internal Server Error :: ' + err.message);
// // //             }
// // //         }

// // //     }



// // // }
// // // module.exports = locationController;














// // //  async uploadHtmlSinglePage(req, res) {
// // //   try {
// // //     if (!req.file) {
// // //       _sendResponse(res, 400, "Please upload an HTML file!");
// // //       return;
// // //     }

// // //     const path = __basedir + "/uploads/" + req.file.filename;

// // //     // Launch Puppeteer
// // //     const browser = await puppeteer.launch({ headless: 'new' });
// // //     const page = await browser.newPage();

// // //     // Load the HTML file
// // //     await page.goto(`file://${path}`, {
// // //       waitUntil: 'networkidle2',
// // //       timeout: 60000,
// // //     });

// // //     // Wait for all resources (CSS, JS, fonts) to load
// // //     await page.waitForTimeout(2000);

// // //     // Optional: scale down content to fit page width
// // //     // await page.evaluate(() => {
// // //     //   document.body.style.transformOrigin = 'top left';
// // //     //   document.body.style.transform = 'scale(1)'; // 1 = no scale, adjust if needed
// // //     // });

// // //     // Get full page height to ensure everything fits in a single page
// // //     // const bodyHandle = await page.$('body');
// // //     // const boundingBox = await bodyHandle.boundingBox();
// // //     // await bodyHandle.dispose();

// // //     // Generate PDF with dynamic height
// // //     const pdf = await page.pdf({
// // //       width: A4, // A4 width
// // //       height: `${Math.ceil(boundingBox.height)}px`, // full HTML height
// // //       printBackground: true
// // //     //   margin: { top: '10px', right: '10px', bottom: '10px', left: '10px' },
// // //     });

// // //     await browser.close();

// // //     // Send PDF as response
// // //     res.setHeader('Content-Type', 'application/pdf');
// // //     res.setHeader(
// // //       'Content-Disposition',
// // //       `attachment; filename=uploadHtmlSinglePage_${Date.now()}.pdf`
// // //     );
// // //     res.status(200).send(pdf);

// // //     // Clean up uploaded HTML file
// // //     await fs1.unlink(path);

// // //   } catch (err) {
// // //     if (err.errors) {
// // //       _validationErrors(res, err.errors);
// // //     } else if (err.message === undefined) {
// // //       const error = err.split('|');
// // //       _sendResponse(res, error[1], error[0]);
// // //     } else {
// // //       _errorResponse(res, 500, 'Internal Server Error :: ' + err.message);
// // //     }
// // //   }
// // // }

























// // //full width of screen
// // var fs = require('fs');
// // const fs1 = require('fs').promises;
// // const puppeteer = require('puppeteer');

// // const _sendResponse = require('../../app/helper/global').sendResponse;
// // const _errorResponse = require('../../app/helper/global').errorResponse;
// // const _validationErrors = require('../../app/helper/global').validationErrors;

// // class locationController {
// //     constructor() { }

// //     async listlocation(req, res) {
// //         try {
// //             let listlocation = {
// //                 "city": "Mumbai"
// //             }
// //             _sendResponse(res, 200, "locationship List", listlocation);
// //         } catch (err) {
// //             if (err.errors) {
// //                 _validationErrors(res, err.errors);
// //             } else if (err.message == undefined) {
// //                 let error = err.split('|');
// //                 _sendResponse(res, error[1], error[0]);
// //             } else {
// //                 _errorResponse(res, 500, 'Internal Server Error :: ' + err.message);
// //             }
// //         }
// //     }

// // async uploadHtmlSinglePage(req, res) {
// //   try {
// //     if (req.file == undefined) {
// //       _sendResponse(res, 400, "Please upload an html file!");
// //       return;
// //     }

// //     const path = __basedir + "/uploads/" + req.file.filename;

// //     // ✅ Launch Puppeteer with proper flags (for loading external CSS)
// //     // const browser = await puppeteer.launch({
// //     //   headless: 'new',
// //     //   args: [
// //     //     '--no-sandbox',
// //     //     '--disable-setuid-sandbox',
// //     //     '--disable-dev-shm-usage',
// //     //     '--disable-gpu'
// //     //   ]
// //     // });
// //     const browser = await puppeteer.launch({ headless: 'new' });

// //     const page = await browser.newPage();

// //     await page.goto(`file://${path}`, {
// //       waitUntil: 'networkidle2',
// //       timeout: 60000,
// //     });

// //     await page.addStyleTag({ url: 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css' });
// //     await page.addStyleTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.19.1/css/mdb.min.css' });
// //     await page.addStyleTag({ url: 'https://use.fontawesome.com/releases/v5.8.2/css/all.css' });
// //     await page.addStyleTag({ url: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' });
// //     await page.addStyleTag({ url: 'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css' });
// //     await page.addStyleTag({ url: 'https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css' });

// //     await page.waitForTimeout(2000); // allow styles to load

// //     const pdf = await page.pdf({
// //       format: 'A3',
// //       printBackground: true,
// //       margin: {
// //         top: '0px',
// //         right: '0px',
// //         bottom: '0px',
// //         left: '0px',
// //       },
// //     });

// //     await browser.close();

// //     // ✅ Send the PDF response
// //     res.setHeader('Content-Type', 'application/pdf');
// //     res.setHeader('Content-Disposition', `attachment; filename=uploadHtmlSinglePage_${Date.now()}.pdf`);
// //     res.status(200).send(pdf);

// //     // ✅ Clean up uploaded file
// //     await fs1.unlink(path);

// //   } catch (err) {
// //     if (err.errors) {
// //       _validationErrors(res, err.errors);
// //     } else if (err.message == undefined) {
// //       let error = err.split('|');
// //       _sendResponse(res, error[1], error[0]);
// //     } else {
// //       _errorResponse(res, 500, 'Internal Server Error :: ' + err.message);
// //     }
// //   }
// // }



// //         async uploadHTML(req, res) {
// //         try {

// //             // var upload = uploadFile.single('file_new')
// //             // let path =
// //             //     __basedir + "/uploads/" + req.file.filename;
// //             if (req.file == undefined) {
// //                 _sendResponse(res, 400, "Please upload an html file!");
// //                 return;
// //                 //return res.status(400).send("Please upload an excel file!");
// //             }
// //             const htmlBuffer = req.file.buffer;
// //             let path =
// //                 __basedir + "/uploads/" + req.file.filename;

// //             const browser = await puppeteer.launch({ headless: 'new' });
// //             const page = await browser.newPage();

            
// //             // await page.goto(`file://${path}`, { waitUntil: 'networkidle2' });

// //              await page.goto(`file://${path}`, {
// //       waitUntil: 'networkidle2',
// //       timeout: 60000,
// //     });

// //     await page.addStyleTag({ url: 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css' });
// //     await page.addStyleTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.19.1/css/mdb.min.css' });
// //     await page.addStyleTag({ url: 'https://use.fontawesome.com/releases/v5.8.2/css/all.css' });
// //     await page.addStyleTag({ url: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' });
// //     await page.addStyleTag({ url: 'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css' });
// //     await page.addStyleTag({ url: 'https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css' });

// //     await page.waitForTimeout(2000); // allow styles to load

    
// //             // await page.evaluate(() => {
// //             //     document.getElementById('defaultPDF').click();
// //             // });
// //             const client = await page.target().createCDPSession();
// //             await client.send('Page.setDownloadBehavior', {
// //                 behavior: 'allow',
// //                 downloadPath: '/home/ubuntu/Projects/EAClub/downloads', // Specify your desired download path
// //             });
// //             // const browserContext = browser.defaultBrowserContext();

// //             // // Set the download path for files
// //             // await browserContext.setDefaultOptions({
// //             //     downloadPath: '/home/ubuntu/EAClub/downloads', // Specify your desired download path
// //             // });




// //             // Open the temporary HTML file


// //             // Generate PDF from the HTML file
// //             // const pdf = await page.pdf({ format: 'A3' });
// // const pdf = await page.pdf({
// //       format: 'A4',
// //       printBackground: true,
// //       margin: {
// //         top: '0px',
// //         right: '0px',
// //         bottom: '0px',
// //         left: '0px',
// //       },
// //     });
// //             // Close the browser
// //             await browser.close();

// //             // var fileUrl = await locationUtils.uploadFiles3(req, path);


// //             res.setHeader('Content-Type', 'application/pdf');
// //             res.setHeader('Content-Disposition', `attachment; filename=uploadHTML_${Date.now()}.pdf`);
// //             res.status(200).send(pdf);
// //             // _sendResponse(res, 200, "Excel File Uploaded", fileUrl);

// //             // Clean up: Delete the temporary HTML file
// //             await fs1.unlink(path);

// //             //  var cartData1 = await cartdata(req, res)


// //         } catch (err) {
// //             //throw err;
// //             if (err.errors) {
// //                 _validationErrors(res, err.errors);
// //             } else if (err.message == undefined) {
// //                 let error = err.split('|');
// //                 _sendResponse(res, error[1], error[0]);
// //             } else {
// //                 _errorResponse(res, 500, 'Internal Server Error :: ' + err.message);
// //             }
// //         }

// //     }


// // async uploadHTML2(req, res) {
// //   try {
// //     if (req.file == undefined) {
// //       _sendResponse(res, 400, "Please upload an HTML file!");
// //       return;
// //     }

// //     const path = __basedir + "/uploads/" + req.file.filename;

// //     // // Launch Puppeteer
// //     // const browser = await puppeteer.launch({
// //     //   headless: 'new',
// //     //   args: [
// //     //     '--no-sandbox',
// //     //     '--disable-setuid-sandbox',
// //     //     '--disable-dev-shm-usage',
// //     //     '--disable-gpu'
// //     //   ]
// //     // });
// //             const browser = await puppeteer.launch({ headless: 'new' });

// //     const page = await browser.newPage();

// //     // ✅ Set viewport to exact A4 size (portrait)
// //     await page.setViewport({ width: 794, height: 1123 }); // A4 size in pixels (96 DPI)

// //     // Load HTML file
// //     await page.goto(`file://${path}`, {
// //       waitUntil: 'networkidle2',
// //       timeout: 60000
// //     });

// //     await page.waitForTimeout(2000);

// //     // ✅ Generate A4-sized PDF (fixed, no scaling beyond A4)
// //     const pdf = await page.pdf({
// //       format: 'A4',
// //       printBackground: true,
// //       margin: {
// //         top: '0px',
// //         right: '0px',
// //         bottom: '0px',
// //         left: '0px'
// //       }
// //     //   scale: 1
// //     });

// //     await browser.close();

// //     // Send PDF response
// //     res.setHeader('Content-Type', 'application/pdf');
// //     res.setHeader('Content-Disposition', `attachment; filename=uploadHTML2${Date.now()}.pdf`);
// //     res.status(200).send(pdf);

// //     // Clean up uploaded HTML file
// //     await fs1.unlink(path);

// //   } catch (err) {
// //     if (err.errors) {
// //       _validationErrors(res, err.errors);
// //     } else if (err.message == undefined) {
// //       let error = err.split('|');
// //       _sendResponse(res, error[1], error[0]);
// //     } else {
// //       _errorResponse(res, 500, 'Internal Server Error :: ' + err.message);
// //     }
// //   }
// // }



// // }

// // module.exports = locationController;


    

//  async uploadHtmlSinglePage(req, res) {
//   try {
//     if (!req.file) {
//       _sendResponse(res, 400, "Please upload an html file!");
//       return;
//     }

//     const path = __basedir + "/uploads/" + req.file.filename;
//     let htmlContent = await fs1.readFile(path, "utf8");

//     // ✅ Inject aggressive reset styles
//     const injectCSS = `
//       <style>
//         * {
//           -webkit-print-color-adjust: exact !important;
//           print-color-adjust: exact !important;
//           box-sizing: border-box !important;
//         }

//         html, body {
//           margin: 0 !important;
//           padding: 0 !important;
//           width: 100% !important;
//           height: auto !important;
//           overflow: hidden !important;
//           background: transparent !important;
//         }

//         @page {
//           size: auto;
//           margin: 0mm !important;
//         }

//         body::after {
//           content: none !important;
//           display: none !important;
//         }

//         div, section, article, table, ul, ol, p, h1, h2, h3, h4, h5, h6 {
//           page-break-inside: avoid !important;
//           margin-bottom: 0 !important;
//         }
//       </style>
//     `;

//     // Insert the CSS
//     if (htmlContent.includes("</head>")) {
//       htmlContent = htmlContent.replace("</head>", `${injectCSS}</head>`);
//     } else if (htmlContent.includes("<body>")) {
//       htmlContent = htmlContent.replace("<body>", `<body>${injectCSS}`);
//     } else {
//       htmlContent = injectCSS + htmlContent;
//     }

//     const modifiedPath = path.replace(".html", "_modified.html");
//     await fs1.writeFile(modifiedPath, htmlContent);

//     // const browser = await puppeteer.launch({
//     //   headless: "new"    });

//     const browser = await puppeteer.launch({
//   headless: "new",
//   args: [
//     '--no-sandbox',
//     '--disable-setuid-sandbox',
//     '--disable-web-security', // allow iframes
//     '--allow-running-insecure-content',
//   ],
// });

//     const page = await browser.newPage();
//     await page.setBypassCSP(true);

//     await page.goto(`file://${modifiedPath}`, {
//   waitUntil: ['networkidle0', 'domcontentloaded'],
//   timeout: 120000,
// });
// await page.waitForTimeout(8000); 


// //     await page.goto(`file://${modifiedPath}`, {
// //       // waitUntil: "networkidle2",
// //         waitUntil: ['networkidle2', 'domcontentloaded'],

// //       timeout: 90000,
// //     });

// // await page.waitForTimeout(5000);

//     // ✅ Trim the actual visible bounding box (not scrollHeight)
//     const clip = await page.evaluate(() => {
//       const body = document.body;
//       const rect = body.getBoundingClientRect();
//       return {
//         x: 0,
//         y: 0,
//         width: Math.ceil(rect.width),
//         height: Math.ceil(rect.height),
//       };
//     });

//     // ✅ Set viewport to exact content size (no overflow)
//     await page.setViewport({
//       width: Math.ceil(clip.width),
//       height: Math.ceil(clip.height),
//     });

//     // ✅ Use clip-based screenshot PDF (prevents phantom footer space)
//     const pdf = await page.pdf({
//       printBackground: true,
//       width: `${clip.width}px`,
//       height: `${clip.height}px`,
//       margin: { top: 0, right: 0, bottom: 0, left: 0 },
//       preferCSSPageSize: false,
//       pageRanges: "1",
//     });

//     await browser.close();

//     // Send PDF
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=uploadHTML_${Date.now()}.pdf`
//     );
//     res.status(200).send(pdf);

//     // Cleanup
//     await fs1.unlink(path);
//     await fs1.unlink(modifiedPath);
//   } catch (err) {
//     if (err.errors) _validationErrors(res, err.errors);
//     else if (!err.message) {
//       let error = err.split("|");
//       _sendResponse(res, error[1], error[0]);
//     } else {
//       _errorResponse(res, 500, "Internal Server Error :: " + err.message);
//     }
//   }
// }










// async uploadHTML(req, res) {
//     try {
//       if (req.file == undefined) {
//         _sendResponse(res, 400, "Please upload an html file!");
//         return;
//       }
//       const path = __basedir + "/uploads/" + req.file.filename;

//       const browser = await puppeteer.launch({ headless: "new" });
//       const page = await browser.newPage();
//       await page.setViewport({ width: 794, height: 1123 }); // A4 size in pixels (96 DPI)

//       await page.goto(`file://${path}`, {
//         waitUntil: "networkidle2",
//         timeout: 60000,
//       });

//       await page.waitForTimeout(2000);

//       const pdf = await page.pdf({
//         format: "A4",
//         printBackground: true,
//         margin: {
//           top: "0px",
//           right: "0px",
//           bottom: "0px",
//           left: "0px",
//         },
//       });

//       await browser.close();

//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader(
//         "Content-Disposition",
//         `attachment; filename=uploadHTML_${Date.now()}.pdf`
//       );
//       res.status(200).send(pdf);

//       await fs1.unlink(path);
//     } catch (err) {
//       //throw err;
//       if (err.errors) {
//         _validationErrors(res, err.errors);
//       } else if (err.message == undefined) {
//         let error = err.split("|");
//         _sendResponse(res, error[1], error[0]);
//       } else {
//         _errorResponse(res, 500, "Internal Server Error :: " + err.message);
//       }
//     }
//   }



//  async uploadHtmlSinglePage(req, res) {
//   try {
//     if (!req.file) {
//       _sendResponse(res, 400, "Please upload an html file!");
//       return;
//     }

//     const path = __basedir + "/uploads/" + req.file.filename;
//     let htmlContent = await fs1.readFile(path, "utf8");



//    htmlContent = htmlContent.replace(
//   /<iframe[^>]*src="https:\/\/maps\.google\.com[^"]*"[^>]*><\/iframe>/gi,
//   `<img src="https://staticmap.openstreetmap.de/staticmap.php?center=20,78&zoom=4&size=600x400&maptype=mapnik"
//         alt="Map" style="display:block;margin:auto;border:1px solid #ccc;" />`
// );

//     const injectCSS = `
//       <style>
//         * {
//           -webkit-print-color-adjust: exact !important;
//           print-color-adjust: exact !important;
//           box-sizing: border-box !important;
//         }

//         html, body {
//           margin: 0 !important;
//           padding: 0 !important;
//           width: 100% !important;
//           height: auto !important;
//           background: transparent !important;
//         }

//         @page {
//           size: auto;
//           margin: 0mm !important;
//         }

//         body::after {
//           content: none !important;
//           display: none !important;
//         }

//         div, section, article, table, ul, ol, p, h1, h2, h3, h4, h5, h6 {
//           page-break-inside: avoid !important;
//           margin-bottom: 0 !important;
//         }
//       </style>
//     `;

//     if (htmlContent.includes("</head>")) {
//       htmlContent = htmlContent.replace("</head>", `${injectCSS}</head>`);
//     } else if (htmlContent.includes("<body>")) {
//       htmlContent = htmlContent.replace("<body>", `<body>${injectCSS}`);
//     } else {
//       htmlContent = injectCSS + htmlContent;
//     }

//     const modifiedPath = path.replace(".html", "_modified.html");
//     await fs1.writeFile(modifiedPath, htmlContent);

// const browser = await puppeteer.launch({
//   headless: "new",
//   args: [
//     "--no-sandbox",
//     "--disable-setuid-sandbox",
//     "--enable-webgl",
//     "--ignore-gpu-blocklist",
//     "--use-gl=desktop",
//     "--enable-accelerated-2d-canvas",
//     "--enable-gpu-rasterization",
//     "--disable-dev-shm-usage",
//   ],
// });


//     const page = await browser.newPage(); 

// await page.goto(`file://${modifiedPath}`, {
//   waitUntil: 'networkidle2',
//   timeout: 120000,
// });
// await page.waitForTimeout(5000);


//     const clip = await page.evaluate(() => {
//       const body = document.body;
//       const rect = body.getBoundingClientRect();
//       return {
//         x: 0,
//         y: 0,
//         width: Math.ceil(rect.width),
//         height: Math.ceil(rect.height),
//       };
//     });

//     const pdf = await page.pdf({
//       printBackground: true,
//       width: `${clip.width}px`,
//       height: `${clip.height}px`,
//       margin: { top: 0, right: 0, bottom: 0, left: 0 },
//       preferCSSPageSize: false,
//       pageRanges: "1",
//     });

//     await browser.close();

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=uploadHTML_${Date.now()}.pdf`
//     );
//     res.status(200).send(pdf);

//     await fs1.unlink(path);
//     await fs1.unlink(modifiedPath);
//   } catch (err) {
//     if (err.errors) _validationErrors(res, err.errors);
//     else if (!err.message) {
//       let error = err.split("|");
//       _sendResponse(res, error[1], error[0]);
//     } else {
//       _errorResponse(res, 500, "Internal Server Error :: " + err.message);
//     }
//   }
// }
















//   async uploadHtmlSinglePage(req, res) {
//   try {
//     if (!req.file) {
//       _sendResponse(res, 400, "Please upload an HTML file!");
//       return;
//     }

//     const path = __basedir + "/uploads/" + req.file.filename;
//     let htmlContent = await fs1.readFile(path, "utf8");

//     htmlContent = htmlContent.replace(
//       /<iframe[^>]*src="https:\/\/maps\.google\.com[^"]*"[^>]*><\/iframe>/gi,
//       `<img src="https://staticmap.openstreetmap.de/staticmap.php?center=20,78&zoom=4&size=600x400&maptype=mapnik"
//           alt="Map" style="display:block;margin:auto;border:1px solid #ccc;" />`
//     );

//     // ✅ Inject single-page CSS
//     const injectCSS = `
//     <style>
//       * {
//         -webkit-print-color-adjust: exact !important;
//         print-color-adjust: exact !important;
//         box-sizing: border-box !important;
//       }

//       html, body {
//         margin: 0 !important;
//         padding: 0 !important;
//         width: 100% !important;
//         height: auto !important;
//         background: transparent !important;
//         overflow: visible !important;
//       }

//       @page {
//         size: auto;
//         margin: 0mm !important;
//       }

//       body::after {
//         content: none !important;
//         display: none !important;
//       }

//       div, section, article, table, ul, ol, p, h1, h2, h3, h4, h5, h6 {
//         page-break-before: avoid !important;
//         page-break-after: avoid !important;
//         page-break-inside: avoid !important;
//         margin-bottom: 0 !important;
//       }
//     </style>
//   `;

//     if (htmlContent.includes("</head>")) {
//       htmlContent = htmlContent.replace("</head>", `${injectCSS}</head>`);
//     } else if (htmlContent.includes("<body>")) {
//       htmlContent = htmlContent.replace("<body>", `<body>${injectCSS}`);
//     } else {
//       htmlContent = injectCSS + htmlContent;
//     }

//     const modifiedPath = path.replace(".html", "_modified.html");
//     await fs1.writeFile(modifiedPath, htmlContent);

//     const browser = await puppeteer.launch({
//       headless: "new",
//       args: [
//         "--no-sandbox",
//         "--disable-setuid-sandbox",
//         "--enable-webgl",
//         "--ignore-gpu-blocklist",
//         "--use-gl=desktop",
//         "--enable-accelerated-2d-canvas",
//         "--enable-gpu-rasterization",
//         "--disable-dev-shm-usage",
//       ],
//     });

//     const page = await browser.newPage();

//     // Set a wide viewport to simulate desktop view and prevent responsive stacking
//     await page.setViewport({ width: 1280, height: 1024 });

//     await page.goto(`file://${modifiedPath}`, {
//       waitUntil: "networkidle2",
//       timeout: 120000,
//     });

//     // Wait longer for dynamic content like charts to fully render
//     await page.waitForTimeout(5000);

//     // Optionally wait for Highcharts container if present
//     try {
//       await page.waitForSelector('.highcharts-container', { timeout: 10000 });
//     } catch (e) {
//       // Ignore if no chart or timeout
//     }

//     const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);

//     // Calculate exact content height by finding the maximum bottom position of all elements
//     const bodyHeight = await page.evaluate(() => {
//       let maxBottom = 0;
//       document.querySelectorAll('body *').forEach(el => {
//         const rect = el.getBoundingClientRect();
//         if (rect.height > 0) {
//           maxBottom = Math.max(maxBottom, rect.bottom);
//         }
//       });
//       return Math.ceil(maxBottom);
//     });

//     const pdf = await page.pdf({
//       printBackground: true,
//       width: `${bodyWidth}px`,
//       height: `${bodyHeight}px`,
//       margin: { top: 0, right: 0, bottom: 0, left: 0 },
//       preferCSSPageSize: false,
//       pageRanges: "1",  // Explicitly limit to the first (and only) page
//     });

//     await browser.close();

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=uploadHTML_${Date.now()}.pdf`
//     );
//     res.status(200).send(pdf);

//     await fs1.unlink(path);
//     await fs1.unlink(modifiedPath);
//   } catch (err) {
//     if (err.errors) _validationErrors(res, err.errors);
//     else if (!err.message) {
//       let error = err.split("|");
//       _sendResponse(res, error[1], error[0]);
//     } else {
//       _errorResponse(res, 500, "Internal Server Error :: " + err.message);
//     }
//   }
// }