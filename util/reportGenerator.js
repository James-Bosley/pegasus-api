const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

class EasyPDF extends PDFDocument {
  constructor(props) {
    super(props);
  }
  // Simplifies writing a line to PDF where fonts and sizes change regularly.
  writeLine(text, font, size, options, moveDown) {
    font && this.font(font);
    size && this.fontSize(size);
    text && this.text(text, options);
    moveDown && this.moveDown(Number(moveDown) || 1);
  }
}

const reportGenerator = data => {
  // Promisified to allow file to write asynchronously.
  const promise = new Promise((resolve, reject) => {
    try {
      const doc = new EasyPDF({
        size: "A4",
        margins: { top: 20, bottom: 20, left: 76, right: 76 },
      });

      const filePath = path.resolve(
        __dirname,
        "../temp-reports",
        `${data.reportName} - ${data.reportId}.pdf`
      );

      doc.pipe(fs.createWriteStream(filePath));

      // Styles for document.
      const headerFont = path.resolve(__dirname, "./fonts", "Kanit.ttf");
      const bodyFont = path.resolve(__dirname, "./fonts", "TitilliumWeb-Regular.ttf");
      const h1 = 50;
      const h2 = 20;
      const h3 = 14;
      const p = 12;

      // Headers.
      doc.writeLine("Pegasus", headerFont, h1, { align: "center" });
      doc.writeLine(data.reportName, headerFont, h2, { align: "center" }, 0.4);

      // Content.
      data.sections.forEach(section => {
        doc.writeLine(section.title, headerFont, h3, { underline: true }, 0.5);
        section.items.forEach(item => {
          doc.writeLine(`${item.name}: ${item.value}`, bodyFont, p);
        });
        doc.moveDown(0.5);
      });

      doc.end();

      // Timeout allows time for content write to complete to prevent server returning incomplete file.
      setTimeout(() => {
        if (fs.existsSync(filePath)) {
          resolve(filePath);
        }
        reject(new Error("Operation timed out"));
      }, 500);
    } catch (err) {
      reject(err.message || "Error in PDF creator");
    }
  });
  return promise;
};

module.exports = reportGenerator;
