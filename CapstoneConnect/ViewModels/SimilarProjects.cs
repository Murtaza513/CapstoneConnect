using Newtonsoft.Json;
namespace CapstoneConnect.ViewModels
{
    public class SimilarProject
    {
        [JsonProperty("fyp_id")]
        public int? FypId { get; set; }

        [JsonProperty("similarity")]
        public double Similarity { get; set; }
    }
}
