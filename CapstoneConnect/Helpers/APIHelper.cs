//using MailVerification.Services;
using CapstoneConnect.ViewModels;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Hosting;
using MimeKit;
using OfficeOpenXml;

namespace CapstoneConnect.Helpers
{
    public class APIHelper 
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private ISession _session;

        private readonly IHttpContextAccessor _context;

        public APIHelper(IHttpContextAccessor httpContextAccessor, IWebHostEnvironment webHostEnvironment)
        {
            _context = httpContextAccessor;
            _session = _context.HttpContext.Session;
            _webHostEnvironment = webHostEnvironment;
        }

        // Constructor with ISession directly
        public APIHelper(ISession session)
        {
            _session = session;
        }

        // Setter method to add or update an OTP
        public void SetValue(string key, string value)
        {
            _context.HttpContext.Session.SetString(key, value);
        }

        
        public string GetValue(string key)
        {
            return _context.HttpContext.Session.GetString(key);
        }
        public string SaveSubmission(int FypGroupId, string Type, IFormFile Files)
        {
            // Construct the base path where files will be stored
            string basePath = "\\uploads\\" + FypGroupId + "\\" + Type + "\\";

            // Combine base path with original file name
            string storedPath = basePath + Files.FileName;
            string completePath = _webHostEnvironment.WebRootPath + storedPath;

            // Check if directory exists, create if it doesn't
            if (!Directory.Exists(Path.GetDirectoryName(completePath)))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(completePath));
            }
            else
            {
                // If directory already exists, find a unique file name
                int count = 1;
                string fileName = Path.GetFileNameWithoutExtension(Files.FileName);
                string fileExtension = Path.GetExtension(Files.FileName);

                // Loop until a unique file name is found
                while (File.Exists(completePath))
                {
                    storedPath = basePath + fileName + "_" + count + fileExtension;
                    completePath = _webHostEnvironment.WebRootPath + storedPath;
                    count++;
                }
            }

            // Save the file to the unique path
            using (FileStream fileStream = System.IO.File.Create(completePath))
            {
                Files.CopyTo(fileStream);
                fileStream.Flush();
            }

            // Return the stored path where the file was saved
            return storedPath;
        }



        public async Task<(byte[] content, string mimeType, string filePath)> DownloadDocumentAsync(string path)
        {
            string Complete_Path = _webHostEnvironment.WebRootPath + "\\" + path;
            if (!File.Exists(Complete_Path))
            {
                throw new FileNotFoundException("File not found", Complete_Path);
            }

            byte[] bytes = await File.ReadAllBytesAsync(Complete_Path);

            // Determine the MIME type based on the file extension
            string mimeType = GetMimeType(Complete_Path);

            return (bytes, mimeType, Complete_Path);
        }


        // Helper method to determine MIME type
        private string GetMimeType(string filePath)
        {
            var mimeType = "application/octet-stream";
            var extension = Path.GetExtension(filePath).ToLowerInvariant();

            if (extension == ".pdf")
            {
                mimeType = "application/pdf";
            }
            else if (extension == ".doc")
            {
                mimeType = "application/msword";
            }
            else if (extension == ".docx")
            {
                mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            }
            // Add other MIME types as needed

            return mimeType;
        }

        public string GuidelineUpload(string section, IFormFile Files)
        {
            try
            {
                string Stored_Path = "\\Templates\\" + section + "\\" + Files.FileName;
                string Complete_Path = _webHostEnvironment.WebRootPath + Stored_Path;


                if (!Directory.Exists(Path.GetDirectoryName(Complete_Path)))
                {
                    Directory.CreateDirectory(Path.GetDirectoryName(Complete_Path));
                }
                //Complete_Path = Complete_Path + Files.FileName;
                using (FileStream fileStream = System.IO.File.Create(Complete_Path))
                {
                    Files.CopyTo(fileStream);
                    fileStream.Flush();
                }
                return Stored_Path;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return null;
            }
        }

        // Method to convert letter grade to numeric value
        public double ConvertGradeToNumeric(string grade)
        {
            switch (grade)
            {
                case "A": return 4.0;
                case "A-": return 3.7;
                case "B+": return 3.3;
                case "B": return 3.0;
                case "B-": return 2.7;
                case "C+": return 2.3;
                case "C": return 2.0;
                case "C-": return 1.7;
                case "D+": return 1.3;
                case "D": return 1.0;
                case "F": return 0.0;
                default: return 0.0;
            }
        }

        // Method to convert numeric value back to letter grade
        public string ConvertNumericToGrade(double average)
        {
            if (average >= 3.85) return "A";
            if (average >= 3.7) return "A-";
            if (average >= 3.3) return "B+";
            if (average >= 3.0) return "B";
            if (average >= 2.7) return "B-";
            if (average >= 2.3) return "C+";
            if (average >= 2.0) return "C";
            if (average >= 1.7) return "C-";
            if (average >= 1.3) return "D+";
            if (average >= 1.0) return "D";
            return "F";
        }


        public bool UpdateDataSet(int FypId, string Title, string ProjectDescription)
        {
            try
            {
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                string excelFilePath = @"D:\FYPP\Merged CapstoneConnect\dataset\fyp_repository.xlsx";
                FileInfo fileInfo = new FileInfo(excelFilePath);
                if (!fileInfo.Exists)
                {
                    return false;
                    //throw new FileNotFoundException("The specified Excel file does not exist.", excelFilePath);
                }
                using (ExcelPackage package = new ExcelPackage(fileInfo))
                {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                    if (worksheet == null)
                    {
                        throw new Exception("The specified worksheet does not exist.");
                    }

                    // Find the next available row
                    int lastRow = worksheet.Dimension.End.Row + 1;

                    // Find the column indexes for the respective headers
                    int fypIdColumnIndex = -1;
                    int titleColumnIndex = -1;
                    int descriptionColumnIndex = -1;

                    for (int col = 1; col <= worksheet.Dimension.End.Column; col++)
                    {
                        string header = worksheet.Cells[1, col].Text;
                        if (header == "FYPId")
                        {
                            fypIdColumnIndex = col;
                        }
                        else if (header == "Title")
                        {
                            titleColumnIndex = col;
                        }
                        else if (header == "ProjectDescription")
                        {
                            descriptionColumnIndex = col;
                        }

                        if (fypIdColumnIndex != -1 && titleColumnIndex != -1 && descriptionColumnIndex != -1)
                            break;
                    }

                    if (fypIdColumnIndex == -1 || titleColumnIndex == -1 || descriptionColumnIndex == -1)
                    {
                        throw new Exception("One or more required columns not found in the Excel sheet.");
                    }

                    // Add the values to the respective columns
                    worksheet.Cells[lastRow, fypIdColumnIndex].Value = FypId;
                    worksheet.Cells[lastRow, titleColumnIndex].Value = Title;
                    worksheet.Cells[lastRow, descriptionColumnIndex].Value = ProjectDescription;

                    package.Save();
                }

                Console.WriteLine("Project added to Excel file successfully.");
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return false;
            }
        }
    }
}
   