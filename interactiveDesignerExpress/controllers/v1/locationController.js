// var fs = require('fs');
// const fs1 = require('fs').promises;
// const puppeteer = require('puppeteer');

// const _sendResponse = require('../../app/helper/global').sendResponse;
// const _errorResponse = require('../../app/helper/global').errorResponse;
// const _validationErrors = require('../../app/helper/global').validationErrors;

// // const creditRepositoryR = require('../../repositories/creditRepository');
// // const creditRepository = new creditRepositoryR();

// class locationController {
//     constructor() { }

//     async listlocation(req, res) {
//         try {
//             let listlocation = {
//                 "city": "Mumbai"
//             }
//             //var cartData1 = await cartdata(req,res)
//             _sendResponse(res, 200, "locationship List", listlocation);

//         } catch (err) {
//             if (err.errors) {
//                 _validationErrors(res, err.errors);
//             } else if (err.message == undefined) {
//                 let error = err.split('|');
//                 _sendResponse(res, error[1], error[0]);
//             } else {
//                 _errorResponse(res, 500, 'Internal Server Error :: ' + err.message);
//             }
//         }

//     }

//     async uploadHTML(req, res) {
//         try {

//             // var upload = uploadFile.single('file_new')
//             // let path =
//             //     __basedir + "/uploads/" + req.file.filename;
//             if (req.file == undefined) {
//                 _sendResponse(res, 400, "Please upload an html file!");
//                 return;
//                 //return res.status(400).send("Please upload an excel file!");
//             }
//             const htmlBuffer = req.file.buffer;
//             let path =
//                 __basedir + "/uploads/" + req.file.filename;

//             const browser = await puppeteer.launch({ headless: 'new' });
//             const page = await browser.newPage();
//             await page.goto(`file://${path}`, { waitUntil: 'networkidle2' });

//             // await page.evaluate(() => {
//             //     document.getElementById('defaultPDF').click();
//             // });
//             const client = await page.target().createCDPSession();
//             await client.send('Page.setDownloadBehavior', {
//                 behavior: 'allow',
//                 downloadPath: '/home/ubuntu/Projects/EAClub/downloads', // Specify your desired download path
//             });
//             // const browserContext = browser.defaultBrowserContext();

//             // // Set the download path for files
//             // await browserContext.setDefaultOptions({
//             //     downloadPath: '/home/ubuntu/EAClub/downloads', // Specify your desired download path
//             // });

//             // Open the temporary HTML file

//             // Generate PDF from the HTML file
//             const pdf = await page.pdf({ format: 'A4' });

//             // Close the browser
//             await browser.close();

//             // var fileUrl = await locationUtils.uploadFiles3(req, path);

//             res.setHeader('Content-Type', 'application/pdf');
//             res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');
//             res.status(200).send(pdf);
//             // _sendResponse(res, 200, "Excel File Uploaded", fileUrl);

//             // Clean up: Delete the temporary HTML file
//             await fs1.unlink(path);

//             //  var cartData1 = await cartdata(req, res)

//         } catch (err) {
//             //throw err;
//             if (err.errors) {
//                 _validationErrors(res, err.errors);
//             } else if (err.message == undefined) {
//                 let error = err.split('|');
//                 _sendResponse(res, error[1], error[0]);
//             } else {
//                 _errorResponse(res, 500, 'Internal Server Error :: ' + err.message);
//             }
//         }

//     }

// }
// module.exports = locationController;


















//venky
// var fs = require("fs");
// const fs1 = require("fs").promises;
// const puppeteer = require("puppeteer");
// const path = require("path");

// // const { _sendResponse, _errorResponse, _validationErrors } = require("../../app/helper/global");

// const _sendResponse = require("../../app/helper/global").sendResponse;
// const _errorResponse = require("../../app/helper/global").errorResponse;
// const _validationErrors = require("../../app/helper/global").validationErrors;

// class locationController {
//   constructor() {}

//   async listlocation(req, res) {
//     try {
//       let listlocation = {
//         city: "Mumbai",
//       };
//       _sendResponse(res, 200, "locationship List", listlocation);
//     } catch (err) {
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

//   async uploadHtmlSinglePage(req, res) {
//     try {
//       if (!req.file) {
//         _sendResponse(res, 400, "Please upload an HTML file!");
//         return;
//       }

//       const path = __basedir + "/uploads/" + req.file.filename;
      
//       let htmlContent = await fs1.readFile(path, "utf8");

//       htmlContent = htmlContent.replace(
//         /<iframe[^>]*src="https:\/\/maps\.google\.com[^"]*"[^>]*><\/iframe>/gi,
//         `<img src="https://staticmap.openstreetmap.de/staticmap.php?center=20,78&zoom=4&size=600x400&maptype=mapnik"
//             alt="Map" style="display:block;margin:auto;border:1px solid #ccc;" />`
//       );

//       const injectCSS = `
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
//           overflow: visible !important;
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
//           page-break-before: avoid !important;
//           page-break-after: avoid !important;
//           page-break-inside: avoid !important;
//           margin-bottom: 0 !important;
//         }
//       </style>
//     `;

//       if (htmlContent.includes("</head>")) {
//         htmlContent = htmlContent.replace("</head>", `${injectCSS}</head>`);
//       } else if (htmlContent.includes("<body>")) {
//         htmlContent = htmlContent.replace("<body>", `<body>${injectCSS}`);
//       } else {
//         htmlContent = injectCSS + htmlContent;
//       }

//       const modifiedPath = path.replace(".html", "_modified.html");
//       await fs1.writeFile(modifiedPath, htmlContent);

//       const browser = await puppeteer.launch({
//         headless: "new",
//         args: [
//           "--no-sandbox",
//           "--disable-setuid-sandbox",
//           "--enable-webgl",
//           "--ignore-gpu-blocklist",
//           "--use-gl=desktop",
//           "--enable-accelerated-2d-canvas",
//           "--enable-gpu-rasterization",
//           "--disable-dev-shm-usage",
//         ],
//       });
      

//       const page = await browser.newPage();

//       await page.goto(`file://${modifiedPath}`, {
//         waitUntil: "networkidle2",
//         timeout: 120000,
//       });
//       await page.waitForTimeout(2000);

//       const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
// const bodyWidth = await page.evaluate(() => document.body.scrollWidth);

// const pxToInch = px => px / 96;
// const pdf = await page.pdf({
//   printBackground: true,
//   width: `${pxToInch(bodyWidth)}in`,
//   height: `${pxToInch(bodyHeight)}in`,
//   margin: { top: 0, right: 0, bottom: 0, left: 0 },
//   preferCSSPageSize: false,
// });


//       // const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
//       // const bodyWidth = await page.evaluate(() => document.body.scrollWidth);

//       // const pdf = await page.pdf({
//       //   printBackground: true,
//       //   width: `${bodyWidth}px`,
//       //   height: `${bodyHeight}px`,
//       //   margin: { top: 0, right: 0, bottom: 0, left: 0 },
//       //   preferCSSPageSize: false,
//       //   pageRanges: "",
//       // });

//       await browser.close();

//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader(
//         "Content-Disposition",
//         `attachment; filename=uploadHTML_${Date.now()}.pdf`
//       );
//       res.status(200).send(pdf);

//       await fs1.unlink(path);
//       await fs1.unlink(modifiedPath);
//     } catch (err) {
//       if (err.errors) _validationErrors(res, err.errors);
//       else if (!err.message) {
//         let error = err.split("|");
//         _sendResponse(res, error[1], error[0]);
//       } else {
//         _errorResponse(res, 500, "Internal Server Error :: " + err.message);
//       }
//     }
//   }


// async uploadHTML(req, res) {
//   try {
//     if (req.file == undefined) {
//       _sendResponse(res, 400, "Please upload an html file!");
//       return;
//     }

//     const path = __basedir + "/uploads/" + req.file.filename;

//     const browser = await puppeteer.launch({ headless: "new" });
//     const page = await browser.newPage();
//     await page.setViewport({ width: 794, height: 1123 });

//     await page.goto(`file://${path}`, {
//       waitUntil: "networkidle2",
//       timeout: 60000,
//     });

//     const hasPageContainer = await page.evaluate(() => {
//       return document.querySelector(".page-container") !== null;
//     });

//     await page.waitForFunction(
//       () =>
//         Array.from(document.querySelectorAll("figure, .highcharts-container, canvas"))
//           .some(el => el.offsetHeight > 0 && el.offsetWidth > 0) ||
//         document.readyState === "complete",
//       { timeout: 10000 }
//     ).catch(() => {}); 

//     await page.waitForTimeout(2000);

//     let pdf;

//     if (hasPageContainer) {
//       await page.addStyleTag({
//         content: `
//           html, body {
//             margin: 0 !important;
//             padding: 0 !important;
//             width: 100% !important;
//             background: white !important;
//           }
//           .page-container {
//             width: 794px !important;
//             height: 1123px !important;
//             page-break-after: always !important;
//             page-break-before: avoid !important;
//             page-break-inside: avoid !important;
//             overflow: hidden !important;
//             -webkit-print-color-adjust: exact !important;
//             print-color-adjust: exact !important;
//           }
//           .page-container:last-child {
//             page-break-after: avoid !important;
//           }
//           @page {
//             size: A4 portrait;
//             margin: 0;
//           }
//         `,
//       });

//       await page.emulateMediaType("screen");

//       pdf = await page.pdf({
//         format: "A4",
//         printBackground: true,
//         margin: { top: 0, bottom: 0, left: 0, right: 0 },
//         preferCSSPageSize: true,
//       });
//     } else {
//       pdf = await page.pdf({
//         format: "A4",
//         printBackground: true,
//       });
//     }

//     await browser.close();

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=uploadHTML_${Date.now()}.pdf`
//     );
//     res.status(200).send(pdf);

//     await fs1.unlink(path);
//   } catch (err) {
//     if (err.errors) {
//       _validationErrors(res, err.errors);
//     } else if (err.message == undefined) {
//       let error = err.split("|");
//       _sendResponse(res, error[1], error[0]);
//     } else {
//       _errorResponse(res, 500, "Internal Server Error :: " + err.message);
//     }
//   }
// }


// async uploadHTML5(req, res) {
//   try {
//     if (!req.file) {
//       _sendResponse(res, 400, "Please upload an HTML file!");
//       return;
//     }

//     const payload = req.body?.payload ? JSON.parse(req.body.payload) : {};
//     const pageSize = payload.pageSize || "A4";
//     const orientation = payload.orientation || "portrait";
//     const customSize = payload.customSize || {}; // { width: 800, height: 1000 }

//     const filePath = __basedir + "/uploads/" + req.file.filename;

//     const browser = await puppeteer.launch({
//       headless: "new",
//       args: [
//         "--no-sandbox",
//         "--disable-setuid-sandbox",
//         "--disable-dev-shm-usage",
//         "--disable-gpu",
//         "--disable-extensions",
//         "--no-zygote",
//         "--no-first-run",
//         "--disable-background-networking",
//         "--disable-default-apps",
//         "--disable-translate",
//         "--disable-sync",
//         "--metrics-recording-only",
//         "--mute-audio",
//         "--no-pings",
//         "--disable-background-timer-throttling",
//         "--disable-backgrounding-occluded-windows",
//         "--disable-renderer-backgrounding",
//       ],
//     });

//     const page = await browser.newPage();

//     const viewports = {
//       A5: { portrait: { width: 420, height: 595 }, landscape: { width: 595, height: 420 } },
//       A4: { portrait: { width: 794, height: 1123 }, landscape: { width: 1123, height: 794 } },
//       A3: { portrait: { width: 1123, height: 1587 }, landscape: { width: 1587, height: 1123 } },
//       A2: { portrait: { width: 1587, height: 2245 }, landscape: { width: 2245, height: 1587 } },
//       A1: { portrait: { width: 2245, height: 3179 }, landscape: { width: 3179, height: 2245 } },
//       A0: { portrait: { width: 3179, height: 4494 }, landscape: { width: 4494, height: 3179 } },
//       Letter: { portrait: { width: 816, height: 1056 }, landscape: { width: 1056, height: 816 } },
//       Legal: { portrait: { width: 816, height: 1344 }, landscape: { width: 1344, height: 816 } },
//     };

//     let vp;
//     if (pageSize.toLowerCase() === "custom" && customSize.width && customSize.height) {
//       vp =
//         orientation === "landscape"
//           ? { width: customSize.height, height: customSize.width }
//           : { width: customSize.width, height: customSize.height };
//     } else {
//       vp = viewports[pageSize]?.[orientation] || viewports["A4"]["portrait"];
//     }

//     await page.setViewport(vp);

//     await page.setRequestInterception(true);
//     page.on("request", (reqInt) => {
//       const type = reqInt.resourceType();
//       if (["image"].includes(type)) {
//         reqInt.abort();
//       } else {
//         reqInt.continue();
//       }
//     });

//     await page.goto(`file://${filePath}`, {
//       waitUntil: "networkidle2",
//       timeout: 60000,
//     });

//     await new Promise((r) => setTimeout(r, 1500));

//     const hasPageContainer = !!(await page.$(".page-container"));
//     const adjustedHeight = orientation === "landscape" ? vp.height - 2 : vp.height;
//     const bodyHeight = await page.evaluate(() => document.body.scrollHeight);

//         const pxToInch = px => px / 96;
//     const totalHeightInInch = pxToInch(bodyHeight);

//     await page.addStyleTag({
//       content: `
//         html, body {
//           margin: 0 !important;
//           padding: 0 !important;
//           background: white !important;
//           width: ${vp.width}px !important;
//           height: ${vp.height}px !important;
//           -webkit-print-color-adjust: exact !important;
//           print-color-adjust: exact !important;
//         }
//         ${
//           hasPageContainer
//             ? `
//           .page-container {
//             width: ${vp.width}px !important;
//             height: ${adjustedHeight}px !important;
//             page-break-after: always !important;
//             page-break-inside: avoid !important;
//             overflow: hidden !important;
//           }
//           .page-container:last-child { page-break-after: avoid !important; }
//         `
//             : ""
//         }
//         @page { size: ${
//           pageSize === "custom"
//             ? `${vp.width}px ${vp.height}px`
//             : `${pageSize} ${orientation}`
//         }; margin: 0; }
//       `,
//     });

//     await page.emulateMediaType("screen");

//         const pdf = await page.pdf({
//       format: pageSize,
//       landscape: orientation === "landscape",
//       printBackground: true,
//       margin: { top: 0, bottom: 0, left: 0, right: 0 },
//       preferCSSPageSize: true,
//       height: `${totalHeightInInch}in`,
//     });

//     // // 🧾 Generate PDF
//     // const pdf = await page.pdf({
//     //   format: pageSize !== "custom" ? pageSize : undefined,
//     //   width: pageSize === "custom" ? `${vp.width}px` : undefined,
//     //   height: `${totalHeightInInch}in`,
//     //   landscape: orientation === "landscape",
//     //   printBackground: true,
//     //   margin: { top: 0, bottom: 0, left: 0, right: 0 },
//     //   preferCSSPageSize: true,
//     // });

//     await browser.close();

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=uploadHTML_${Date.now()}.pdf`
//     );
//     res.status(200).send(pdf);

//     await fs1.unlink(filePath);
//   } catch (err) {
//     console.error("error:", err.message);
//     if (err.errors) _validationErrors(res, err.errors);
//     else if (!err.message) {
//       let error = err.split("|");
//       _sendResponse(res, error[1], error[0]);
//     } else {
//       _errorResponse(res, 500, "Internal Server Error :: " + err.message);
//     }
//   }
// }

// }

// module.exports = locationController;





















//Updated Code
var fs = require("fs");
const fs1 = require("fs").promises;
const puppeteer = require("puppeteer");
const path = require("path");

// const { _sendResponse, _errorResponse, _validationErrors } = require("../../app/helper/global");

const _sendResponse = require("../../app/helper/global").sendResponse;
const _errorResponse = require("../../app/helper/global").errorResponse;
const _validationErrors = require("../../app/helper/global").validationErrors;

class locationController {
  constructor() {}

async listlocation(req, res) {
    try {
      let listlocation = {
        city: "Mumbai",
      };
      _sendResponse(res, 200, "locationship List", listlocation);
    } catch (err) {
      if (err.errors) {
        _validationErrors(res, err.errors);
      } else if (err.message == undefined) {
        let error = err.split("|");
        _sendResponse(res, error[1], error[0]);
      } else {
        _errorResponse(res, 500, "Internal Server Error :: " + err.message);
      }
    }
}

async uploadHtmlSinglePage(req, res) {
    try {
      if (!req.file) {
        _sendResponse(res, 400, "Please upload an HTML file!");
        return;
      }

      const path = __basedir + "/uploads/" + req.file.filename;
      
      let htmlContent = await fs1.readFile(path, "utf8");

      htmlContent = htmlContent.replace(
        /<iframe[^>]*src="https:\/\/maps\.google\.com[^"]*"[^>]*><\/iframe>/gi,
        `<img src="https://staticmap.openstreetmap.de/staticmap.php?center=20,78&zoom=4&size=600x400&maptype=mapnik"
            alt="Map" style="display:block;margin:auto;border:1px solid #ccc;" />`
      );

      const injectCSS = `
      <style>
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          box-sizing: border-box !important;
        }

        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: auto !important;
          background: transparent !important;
          overflow: visible !important;
        }

        /* Prevent page breaks */
        * {
          page-break-before: avoid !important;
          page-break-after: avoid !important;
          page-break-inside: avoid !important;
        }

        /* Remove Bootstrap outer spacing */
        .container, .container-fluid {
          padding-left: 0 !important;
          padding-right: 0 !important;
          margin: 0 !important;
          max-width: none !important;
        }

        .row {
          margin-left: 0 !important;
          margin-right: 0 !important;
        }

        .col, [class*="col-"] {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        @page {
          size: auto;
          margin: 0mm !important;
        }

        body::after {
          content: none !important;
          display: none !important;
        }
      </style>
    `;

      if (htmlContent.includes("</head>")) {
        htmlContent = htmlContent.replace("</head>", `${injectCSS}</head>`);
      } else if (htmlContent.includes("<body>")) {
        htmlContent = htmlContent.replace("<body>", `<body>${injectCSS}`);
      } else {
        htmlContent = injectCSS + htmlContent;
      }

      const modifiedPath = path.replace(".html", "_modified.html");
      await fs1.writeFile(modifiedPath, htmlContent);

      const browser = await puppeteer.launch({
        headless: "new",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--enable-webgl",
          "--ignore-gpu-blocklist",
          "--use-gl=desktop",
          "--enable-accelerated-2d-canvas",
          "--enable-gpu-rasterization",
          "--disable-dev-shm-usage",
        ],
      });
      
      const page = await browser.newPage();
 
      await page.setViewport({
        width: 1200,
        height: 3000, // Larger height for big content
        deviceScaleFactor: 1
      });

      await page.goto(`file://${modifiedPath}`, {
        waitUntil: "networkidle2",
        timeout: 200000,
      });


      await page.evaluate(async () => {
  const MAX_WIDTH = 1600;   // adjust if needed
  const MAX_HEIGHT = 1600;  // adjust if needed
  const JPEG_QUALITY = 0.75; // 75% = good balance

  const images = document.querySelectorAll('img[src^="data:image"]');

  for (const img of images) {
    try {
      const src = img.src;

      // Extract mime type
      const mimeMatch = src.match(/^data:(image\/[a-zA-Z+]+);base64,/);
      if (!mimeMatch) continue;

      const mimeType = mimeMatch[1];

      const response = await fetch(src);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);

      let { width, height } = bitmap;

      // 🔹 Maintain aspect ratio
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const scale = Math.min(
          MAX_WIDTH / width,
          MAX_HEIGHT / height
        );
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = width;
      canvas.height = height;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bitmap, 0, 0, width, height);

      // 🔹 Keep base64, same format
      if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
        img.src = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
      } else if (mimeType === "image/png") {
        // PNG has no quality param → size reduced mainly by scaling
        img.src = canvas.toDataURL("image/png");
      } else {
        // fallback
        img.src = canvas.toDataURL(mimeType);
      }

    } catch (e) {
      console.error("Base64 compression failed", e);
    }
  }
});

      await page.waitForTimeout(7000);

      // Get exact content dimensions (minimum bounding box)
      const dimensions = await page.evaluate(() => {
        const allElements = Array.from(document.body.querySelectorAll('*'));
        let maxBottom = 0;
        let maxRight = 0;
        let minTop = Infinity;
        let minLeft = Infinity;
        
        allElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            if (rect.top < minTop) minTop = rect.top;
            if (rect.left < minLeft) minLeft = rect.left;
            if (rect.bottom > maxBottom) maxBottom = rect.bottom;
            if (rect.right > maxRight) maxRight = rect.right;
          }
        });
        
        return {
          width: Math.ceil(maxRight - minLeft),
          height: Math.ceil(maxBottom - minTop)
        };
      });

      const pxToInch = px => px / 96;
      const pdf = await page.pdf({
        printBackground: true,
        width: `${pxToInch(dimensions.width)}in`,
        height: `${pxToInch(dimensions.height)}in`,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        preferCSSPageSize: false,
        pageRanges: '1',
      });

      await browser.close();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=uploadHTML_${Date.now()}.pdf`
      );
      res.status(200).send(pdf);

      await fs1.unlink(path);
      await fs1.unlink(modifiedPath);
    } catch (err) {
      if (err.errors) _validationErrors(res, err.errors);
      else if (!err.message) {
        let error = err.split("|");
        _sendResponse(res, error[1], error[0]);
      } else {
        _errorResponse(res, 500, "Internal Server Error :: " + err.message);
      }
    }
}

async uploadHTML(req, res) {
  try {
    if (req.file == undefined) {
      _sendResponse(res, 400, "Please upload an html file!");
      return;
    }

    const path = __basedir + "/uploads/" + req.file.filename;

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });

    await page.goto(`file://${path}`, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await page.evaluate(async () => {
  const MAX_WIDTH = 1600;   // adjust if needed
  const MAX_HEIGHT = 1600;  // adjust if needed
  const JPEG_QUALITY = 0.75; // 75% = good balance

  const images = document.querySelectorAll('img[src^="data:image"]');

  for (const img of images) {
    try {
      const src = img.src;

      // Extract mime type
      const mimeMatch = src.match(/^data:(image\/[a-zA-Z+]+);base64,/);
      if (!mimeMatch) continue;

      const mimeType = mimeMatch[1];

      const response = await fetch(src);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);

      let { width, height } = bitmap;

      // 🔹 Maintain aspect ratio
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const scale = Math.min(
          MAX_WIDTH / width,
          MAX_HEIGHT / height
        );
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = width;
      canvas.height = height;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bitmap, 0, 0, width, height);

      // 🔹 Keep base64, same format
      if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
        img.src = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
      } else if (mimeType === "image/png") {
        // PNG has no quality param → size reduced mainly by scaling
        img.src = canvas.toDataURL("image/png");
      } else {
        // fallback
        img.src = canvas.toDataURL(mimeType);
      }

    } catch (e) {
      console.error("Base64 compression failed", e);
    }
  }
});

    const hasPageContainer = await page.evaluate(() => {
      return document.querySelector(".page-container") !== null;
    });

    await page.waitForFunction(
      () =>
        Array.from(document.querySelectorAll("figure, .highcharts-container, canvas"))
          .some(el => el.offsetHeight > 0 && el.offsetWidth > 0) ||
        document.readyState === "complete",
      { timeout: 10000 }
    ).catch(() => {}); 

    // await page.waitForTimeout(2000);

    await page.waitForFunction(() => {
  // Highcharts specific
  if (window.Highcharts && Highcharts.charts.length > 0) {
    return Highcharts.charts.every(c => c && c.hasRendered);
  }

  // Canvas fallback
  const canvas = document.querySelector("canvas");
  if (canvas && canvas.width > 0 && canvas.height > 0) return true;

  return false;
}, { timeout: 15000 }).catch(() => {});

    let pdf;

    if (hasPageContainer) {
      await page.addStyleTag({
        content: `
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            background: white !important;
          }
          .page-container {
            width: 794px !important;
            height: 1123px !important;
            page-break-after: always !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .page-container:last-child {
            page-break-after: avoid !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        `,
      });

      await page.emulateMediaType("screen");

      pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: 0, bottom: 0, left: 0, right: 0 },
        preferCSSPageSize: true,
      });
    } else {
      pdf = await page.pdf({
        format: "A4",
        printBackground: true,
      });
    }

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=uploadHTML_${Date.now()}.pdf`
    );
    res.status(200).send(pdf);

    await fs1.unlink(path);
  } catch (err) {
    if (err.errors) {
      _validationErrors(res, err.errors);
    } else if (err.message == undefined) {
      let error = err.split("|");
      _sendResponse(res, error[1], error[0]);
    } else {
      _errorResponse(res, 500, "Internal Server Error :: " + err.message);
    }
  }
}

async uploadNoramlPdf(req, res) {
  try {
    if (!req.file) {
      _sendResponse(res, 400, "Please upload an HTML file!");
      return;
    }

    const payload = req.body?.payload ? JSON.parse(req.body.payload) : {};
    const pageSize = payload.pageSize || "A4";
    const orientation = payload.orientation || "portrait";

    const filePath = __basedir + "/uploads/" + req.file.filename;

    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
      ],
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 1300,
      height: 1500
    });

    const chartData = req.body?.chartData || "{}";
    await page.evaluateOnNewDocument((data) => {
      localStorage.setItem("common_json", data);
    }, chartData);

    await page.goto(`file://${filePath}`, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    await page.waitForFunction(() => {
      const charts = document.querySelectorAll('.highcharts-container');
      // if (!charts.length) return false;
  if (charts.length === 0) return true;

      return Array.from(charts).every(c =>
        c.querySelector('svg')
      );
    }, { timeout: 20000 });

//     await page.waitForFunction(() => {
//   const charts = document.querySelectorAll('.highcharts-container');

//   // ✅ If NO charts → proceed immediately
//   if (charts.length === 0) return true;

//   // ✅ If charts exist → wait for SVG render
//   return Array.from(charts).every(c =>
//     c.querySelector('svg')
//   );
// }, { timeout: 10000 }).catch(() => {
//   console.log("No charts or charts not fully loaded, continuing...");
// });

    await new Promise(r => setTimeout(r, 1500));

    await page.addStyleTag({
      content: `
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
        }

        .page-container {
          width: 100% !important;
          page-break-after: always;
        }

        .highcharts-container {
          width: 100% !important;
        }

        svg {
          max-width: 100% !important;
        }
      `
    });

    await page.emulateMediaType("screen");
                                                                
    const pdf = await page.pdf({
      format: pageSize,
      landscape: orientation === "landscape",
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      preferCSSPageSize: true,
      scale: 1
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=uploadHTML_${Date.now()}.pdf`
    );

    res.status(200).send(pdf);

    await fs1.unlink(filePath);

  } catch (err) {
    console.error("error:", err.message);
    _errorResponse(res, 500, "Internal Server Error :: " + err.message);
  }
}

async uploadHTML5(req, res) {
  try {
    if (!req.file) {
      _sendResponse(res, 400, "Please upload an HTML file!");
      return;
    }

    const payload = req.body?.payload ? JSON.parse(req.body.payload) : {};
    const pageSize = payload.pageSize || "A4";
    const orientation = payload.orientation || "portrait";
    const customSize = payload.customSize || {};

    const filePath = __basedir + "/uploads/" + req.file.filename;

    const browser = await puppeteer.launch({
      headless: "new",
            args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
         "--disable-web-security",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-extensions",
        "--no-zygote",
        "--no-first-run",
        "--disable-background-networking",
        "--disable-default-apps",
        "--disable-translate",
        "--disable-sync",
        "--metrics-recording-only",
        "--mute-audio",
        "--no-pings",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
      ],
    });

    // const page = await browser.newPage();

// const chartData = req.body?.chartData || "{}";

// await page.evaluateOnNewDocument((data) => {
//   try {
//     localStorage.setItem("common_json", data);
//   } catch (e) {}
// }, chartData);

const page = await browser.newPage();

// ✅ ADD THIS BLOCK
const chartData = req.body?.chartData || "{}";
const chartName = req.body?.name || "default";

await page.evaluateOnNewDocument((data, name) => {
  try {
    localStorage.setItem(`common_json_${name}`, data);
    localStorage.setItem('common_json_files', name);
    localStorage.setItem('common_json', data); 
  } catch (e) {}
}, chartData, chartName);

    const viewports = {
      A5: { portrait: { width: 420, height: 595 }, landscape: { width: 595, height: 420 } },
      A4: { portrait: { width: 794, height: 1123 }, landscape: { width: 1123, height: 794 } },
      A3: { portrait: { width: 1123, height: 1587 }, landscape: { width: 1587, height: 1123 } },
      A2: { portrait: { width: 1587, height: 2245 }, landscape: { width: 2245, height: 1587 } },
      A1: { portrait: { width: 2245, height: 3179 }, landscape: { width: 3179, height: 2245 } },
      A0: { portrait: { width: 3179, height: 4494 }, landscape: { width: 4494, height: 3179 } },
      Letter: { portrait: { width: 816, height: 1056 }, landscape: { width: 1056, height: 816 } },
      Legal: { portrait: { width: 816, height: 1344 }, landscape: { width: 1344, height: 816 } },
    };

    let vp;
    if (pageSize.toLowerCase() === "custom" && customSize.width && customSize.height) {
      vp =
        orientation === "landscape"
          ? { width: customSize.height, height: customSize.width }
          : { width: customSize.width, height: customSize.height };
    } else {
      vp = viewports[pageSize]?.[orientation] || viewports["A4"]["portrait"];
    }

    await page.setViewport(vp);

    await page.goto(`file://${filePath}`, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    

    const hasPageContainer = !!(await page.$(".page-container"));

    const adjustedHeight =
    orientation === "landscape" ? vp.height - 4 : vp.height;

    await page.addStyleTag({
      content: `
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          width: ${vp.width}px !important;
          overflow: hidden !important;
        }

        ${
          hasPageContainer
            ? `
        .page-container {
          width: ${vp.width}px !important;
          height: ${adjustedHeight}px !important;
          overflow: hidden !important;
          page-break-after: always !important;
          page-break-inside: avoid !important;
        }

        .page-container:last-child {
          page-break-after: avoid !important;
        }
        `
            : ""
        }

        @page {
          size: ${pageSize} ${orientation};
          margin: 0;
        }
      `,
    });

    await page.emulateMediaType("screen");

    const pdf = await page.pdf({
      format: pageSize,
      landscape: orientation === "landscape",
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      preferCSSPageSize: true,
      scale: 0.999   
 });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=uploadHTML_${Date.now()}.pdf`
    );
    res.status(200).send(pdf);

    await fs1.unlink(filePath);
  } catch (err) {
    console.error("error:", err.message);
    _errorResponse(res, 500, "Internal Server Error :: " + err.message);
  }
}

}

module.exports = locationController;





//old code
// async uploadHTML5(req, res) {
//   try {
//     if (!req.file) {
//       _sendResponse(res, 400, "Please upload an HTML file!");
//       return;
//     }

//     const payload = req.body?.payload ? JSON.parse(req.body.payload) : {};
//     const pageSize = payload.pageSize || "A4";
//     const orientation = payload.orientation || "portrait";
//     const customSize = payload.customSize || {};

//     const filePath = __basedir + "/uploads/" + req.file.filename;

//     const browser = await puppeteer.launch({
//       headless: "new",
//             args: [
//         "--no-sandbox",
//         "--disable-setuid-sandbox",
//         "--disable-dev-shm-usage",
//         "--disable-gpu",
//         "--disable-extensions",
//         "--no-zygote",
//         "--no-first-run",
//         "--disable-background-networking",
//         "--disable-default-apps",
//         "--disable-translate",
//         "--disable-sync",
//         "--metrics-recording-only",
//         "--mute-audio",
//         "--no-pings",
//         "--disable-background-timer-throttling",
//         "--disable-backgrounding-occluded-windows",
//         "--disable-renderer-backgrounding",
//       ],
//     });

//     const page = await browser.newPage();

//     // ✅ KEEP YOUR VIEWPORTS EXACTLY SAME

//     // ---- Inject chart data into localStorage for Puppeteer ----
// const chartData = req.body?.chartData || "{}";

// await page.evaluateOnNewDocument((data) => {
//   try {
//     localStorage.setItem("common_json", data);
//   } catch (e) {}
// }, chartData);

//     const viewports = {
//       A5: { portrait: { width: 420, height: 595 }, landscape: { width: 595, height: 420 } },
//       A4: { portrait: { width: 794, height: 1123 }, landscape: { width: 1123, height: 794 } },
//       A3: { portrait: { width: 1123, height: 1587 }, landscape: { width: 1587, height: 1123 } },
//       A2: { portrait: { width: 1587, height: 2245 }, landscape: { width: 2245, height: 1587 } },
//       A1: { portrait: { width: 2245, height: 3179 }, landscape: { width: 3179, height: 2245 } },
//       A0: { portrait: { width: 3179, height: 4494 }, landscape: { width: 4494, height: 3179 } },
//       Letter: { portrait: { width: 816, height: 1056 }, landscape: { width: 1056, height: 816 } },
//       Legal: { portrait: { width: 816, height: 1344 }, landscape: { width: 1344, height: 816 } },
//     };

//     let vp;
//     if (pageSize.toLowerCase() === "custom" && customSize.width && customSize.height) {
//       vp =
//         orientation === "landscape"
//           ? { width: customSize.height, height: customSize.width }
//           : { width: customSize.width, height: customSize.height };
//     } else {
//       vp = viewports[pageSize]?.[orientation] || viewports["A4"]["portrait"];
//     }

//     await page.setViewport(vp);

//     await page.goto(`file://${filePath}`, {
//       waitUntil: "networkidle2",
//       timeout: 60000,
//     });

//     const hasPageContainer = !!(await page.$(".page-container"));

//     // ✅ ONLY FIX: reduce landscape height slightly
//     const adjustedHeight =
//     orientation === "landscape" ? vp.height - 4 : vp.height;

//     await page.addStyleTag({
//       content: `
//         html, body {
//           margin: 0 !important;
//           padding: 0 !important;
//           background: white !important;
//           width: ${vp.width}px !important;
//           overflow: hidden !important;
//         }

//         ${
//           hasPageContainer
//             ? `
//         .page-container {
//           width: ${vp.width}px !important;
//           height: ${adjustedHeight}px !important;
//           overflow: hidden !important;
//           page-break-after: always !important;
//           page-break-inside: avoid !important;
//         }

//         .page-container:last-child {
//           page-break-after: avoid !important;
//         }
//         `
//             : ""
//         }

//         @page {
//           size: ${pageSize} ${orientation};
//           margin: 0;
//         }
//       `,
//     });

//     await page.emulateMediaType("screen");

//     // ✅ ONLY FIX: scale to prevent rounding overflow
//     const pdf = await page.pdf({
//       format: pageSize,
//       landscape: orientation === "landscape",
//       printBackground: true,
//       margin: { top: 0, bottom: 0, left: 0, right: 0 },
//       preferCSSPageSize: true,
//       scale: 0.999,
//     });

//     await browser.close();

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=uploadHTML_${Date.now()}.pdf`
//     );
//     res.status(200).send(pdf);

//     await fs1.unlink(filePath);
//   } catch (err) {
//     console.error("error:", err.message);
//     _errorResponse(res, 500, "Internal Server Error :: " + err.message);
//   }
// }
