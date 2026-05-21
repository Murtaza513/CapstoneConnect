using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapstoneConnectLog
{
    public static class LogFormatter
    {
        public static string Exception(Exception exception)
        {
            var stringBuilder = new StringBuilder();
            log4net.LogicalThreadContext.Properties["trace"] = exception.StackTrace;

            AddException(stringBuilder, exception);
            stringBuilder.AppendLine("=======================================================================================");
            stringBuilder.AppendLine("Outer Exception: ");
            stringBuilder.AppendFormat("Stack Trace: {0}", exception.StackTrace).AppendLine();
            stringBuilder.AppendLine("=======================================================================================");

            return stringBuilder.ToString();
        }

        private static void AddException(StringBuilder stringBuilder, Exception exception)
        {
            stringBuilder.AppendFormat("Exception: '{0}', Message: {1}. ", exception.GetType(),
                exception.Message).AppendLine();

            var i = 0;
            foreach (DictionaryEntry kv in exception.Data)
            {
                if (i == exception.Data.Count - 1)
                    break;

                var sa = kv.Value as string[];
                if (sa != null && sa.Length > 0)
                {
                    stringBuilder.AppendFormat("Data {0}: {1}", i, ((string[])(kv.Value))[0]).AppendLine();
                }
                i++;
            }

            if (exception.InnerException != null)
            {
                stringBuilder.AppendLine("Inner Exception: ");
                log4net.LogicalThreadContext.Properties["inner_exception"] = exception.InnerException;
                log4net.LogicalThreadContext.Properties["inner_trace"] = exception.InnerException.StackTrace;
                AddException(stringBuilder, exception.InnerException);
            }
        }
    }
}
