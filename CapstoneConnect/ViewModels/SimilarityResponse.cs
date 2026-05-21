using Newtonsoft.Json;
namespace CapstoneConnect.ViewModels
{
    public class SimilarityResponse
    {
        [JsonProperty("message")]
        public string Message { get; set; }

        [JsonProperty("similar_projects")]
        public List<SimilarProject> SimilarProjects { get; set; }
    }
}
