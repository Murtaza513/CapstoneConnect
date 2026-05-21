using MimeKit;
using System.IO;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using CapstoneConnect.Settings;
using MailKit.Net.Smtp;
using MailKit.Security;
using System.Text;
using CapstoneConnect.Helpers;
using static System.Net.WebRequestMethods;
using CapstoneConnect.Controllers;
using CapstoneConnect.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace CapstoneConnect.Services
{
    public class MailService// : Services.IMailService
    {
        private static Random random = new Random();

        private readonly APIHelper sessionContext;

        private readonly MailSettings _mailSettings;
        public MailService(IOptions<MailSettings> mailSettings, APIHelper context)
        {
            _mailSettings = mailSettings.Value;
            sessionContext = context;
        }


        public async Task<bool> SendEmailAsync(MailRequest mailRequest,string stdEmail, string Functionality)
        {
            try
            {
                var email = new MimeMessage();
                email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
                email.To.Add(MailboxAddress.Parse(stdEmail));
                email.Subject = mailRequest.Subject;
                var builder = new BodyBuilder();
                

                var pwd = GenerateRandomString(8);

                if (Functionality == "Share Credentials")
                {
                    builder.HtmlBody = $"Following are the credentials for CapstoneConnect Portal:-\r\nId: {mailRequest.Id}\r\nPassword: {pwd}";
                    sessionContext.SetValue(stdEmail, pwd);
                    var OTP_Set = sessionContext.GetValue(stdEmail);
                }
                else if (Functionality == "OTP Verification")
                {
                    builder.HtmlBody = $"Following is your OTP for CapstoneConnect Portal:-\r\nId: {mailRequest.Id}\r\nPassword: {pwd}";
                    sessionContext.SetValue(stdEmail, pwd);
                    var OTP_Set = sessionContext.GetValue(stdEmail);
                }
                else if (Functionality == "Results")
                {
                    builder.HtmlBody = mailRequest.Body;
                    if (mailRequest.Attachments != null)
                    {
                        byte[] fileBytes;
                        foreach (var file in mailRequest.Attachments)
                        {
                            if (file.Length > 0)
                            {
                                using (var ms = new MemoryStream())
                                {
                                    file.CopyTo(ms);
                                    fileBytes = ms.ToArray();
                                }
                                builder.Attachments.Add(file.FileName, fileBytes, ContentType.Parse(file.ContentType));
                            }
                        }
                    }
                }
                else
                    return false;

                email.Body = builder.ToMessageBody();

                using var smtp = new SmtpClient();
                smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
                smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
                await smtp.SendAsync(email);
                smtp.Disconnect(true);
                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw ex;
            }
            
        }

        public async Task<bool> VerifyEmailAsync(MailVerify mailVerify,string stdEmail)
        {

            if (mailVerify.Id != null)
            {
                var OTP_Set = sessionContext.GetValue(stdEmail);

                if (OTP_Set == mailVerify.Key)
                    return true;
            }
            return false;
        }


        public static string GenerateRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            StringBuilder stringBuilder = new StringBuilder(length);

            for (int i = 0; i < length; i++)
            {
                int index = random.Next(chars.Length);
                stringBuilder.Append(chars[index]);
            }

            return stringBuilder.ToString();
        }
    }
}
