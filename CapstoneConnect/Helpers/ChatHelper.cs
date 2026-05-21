using CapstoneConnect.ViewModels;
using CapstoneConnectDatabase.Models;
using Newtonsoft.Json;
using System.Text;
using CapstoneConnectLog;

namespace CapstoneConnect.Helpers
{
    public class ChatHelper
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly CapstoneConnectContext _context;
        private readonly string _communicationApiUrl;
        private readonly CommonExceptionLogger _logger;

        public ChatHelper(IHttpClientFactory clientFactory, CapstoneConnectContext context,
           IConfiguration configuration, CommonExceptionLogger logger)
        {
            _clientFactory = clientFactory;
            _context = context;
            _communicationApiUrl = configuration["CommunicationApiUrl"] ?? "";
            _logger = logger;
        }

        public async Task CreateChat(List<NewChat> chats)
        {
            try
            {
              foreach(var chat in chats)
                {
                    var client = _clientFactory.CreateClient();
                    var content = new StringContent(JsonConvert.SerializeObject(chat),
                        Encoding.UTF8, "application/json");

                    var response = await client.PostAsync($"{_communicationApiUrl}/Chat/CreateChat", content);
                    if (response.IsSuccessStatusCode)
                    {
                        string jsonResponse = await response.Content.ReadAsStringAsync();
                        JsonConvert.DeserializeObject<Notification>(jsonResponse);
                    }
                    else
                    {
                        _logger.Error("Failed to create chat between {chat.fypGroup} and" +
                            $"{chat.supervisor}. Status code: {response.StatusCode}");  
                    }
                }

            }
            catch(Exception ex)
            {
                _logger.Error(ex, "Error creating chat!");
            }
        }
    }
}
