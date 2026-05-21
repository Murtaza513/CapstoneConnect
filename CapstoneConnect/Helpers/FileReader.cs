using iText.Kernel.Pdf;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System;
using System.IO;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using iText.Kernel.Pdf.Canvas.Parser;

namespace CapstoneConnect.Helpers
{
    public class FileReader
    {
        public async Task<string> GetContentFromFile(string filePath, string title)
        {
            if(File.Exists(filePath)) 
            {
                string extension = Path.GetExtension(filePath);

                if (extension != null && extension.Equals(".pdf", StringComparison.OrdinalIgnoreCase))
                {
                    return GetContentFromPdf(filePath, title);
                }
                else if (extension != null && (extension.Equals(".doc", StringComparison.OrdinalIgnoreCase) || extension.Equals(".docx", StringComparison.OrdinalIgnoreCase)))
                {
                    return GetContentFromWord(filePath, title);
                }
                else
                {
                    throw new ArgumentException("Unsupported file format.");
                }
            }
            return null;
        }

        public string GetContentFromPdf(string filePath, string startTitle)//, string endTitle)
        {
            using (PdfReader reader = new PdfReader(filePath))
            {
                using (PdfDocument pdfDoc = new PdfDocument(reader))
                {
                    string text = string.Empty;
                    for (int i = 1; i <= pdfDoc.GetNumberOfPages(); i++)
                    {
                        var page = pdfDoc.GetPage(i);
                        var strategy = new LocationTextExtractionStrategy();
                        text += PdfTextExtractor.GetTextFromPage(page, strategy);
                    }

                    // Split the text into lines
                    string[] lines = text.Split('\n', StringSplitOptions.RemoveEmptyEntries);

                    // Find the start and end index of the titles
                    int startIndex = Array.FindIndex(lines, line => line.Equals(startTitle, StringComparison.OrdinalIgnoreCase));
                    int endIndex = Array.FindIndex(lines, startIndex + 1, line => line.Equals("Workflow:", StringComparison.OrdinalIgnoreCase));

                    // If either title is not found, return null
                    if (startIndex == -1 || endIndex == -1)
                        return null;

                    // Extract the content between the two titles
                    string[] contentLines = lines.Skip(startIndex + 1).Take(endIndex - startIndex - 1).ToArray();

                    // Concatenate the content lines into a single string
                    string content = string.Join(Environment.NewLine, contentLines);

                    return content.Trim();
                }
            }
        }


        private string GetContentFromWord(string filePath, string title)
        {
            string content = null;

            using (WordprocessingDocument doc = WordprocessingDocument.Open(filePath, false))
            {
                var body = doc.MainDocumentPart.Document.Body;
                foreach (var paragraph in body.Elements<Paragraph>())
                {
                    if (paragraph.InnerText.Trim().Equals(title, StringComparison.OrdinalIgnoreCase))
                    {
                        var nextParagraph = paragraph.NextSibling();
                        if (nextParagraph != null && nextParagraph is Paragraph)
                        {
                            content = ((Paragraph)nextParagraph).InnerText;
                        }
                        break;
                    }
                }
            }

            return content;
        }
    }
}
