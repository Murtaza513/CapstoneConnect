using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CapstoneConnect.Helpers
{
    public partial class Helper : DateTimeConverterBase
    {
        public override object? ReadJson(JsonReader reader, Type objectType, object? existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.String)
            {
                if (DateTime.TryParse((string)reader.Value, out DateTime date))
                {
                    return date;
                }
                else
                {
                    throw new JsonSerializationException($"Invalid date format: {reader.Value}");
                }
            }
            throw new JsonSerializationException($"Unexpected token type: {reader.TokenType}");
        }

        public override void WriteJson(JsonWriter writer, object? value, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }
    }
}
