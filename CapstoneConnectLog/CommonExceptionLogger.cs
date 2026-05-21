using log4net;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Reflection;

namespace CapstoneConnectLog
{
    public abstract class Logger
    {
        public virtual void Debug(ActionExecutingContext filterContext) { }
        public virtual void Info(ActionExecutingContext filterContext) { }
        public virtual void Error(ActionExecutingContext filterContext) { }
        public virtual void Error(ActionExecutedContext filterContext) { }

        public virtual void Debug(string message) { }
        public virtual void Info(string message) { }
        public virtual void Error(string message) { }
        public virtual void Error(Exception ex, string m) { }
    }
    public class CommonExceptionLogger : Logger
    {
        private readonly ILog _logger;
        public CommonExceptionLogger()
        {
            this._logger = LogManager.GetLogger(MethodBase.GetCurrentMethod()?.DeclaringType);
        }
        public override void Debug(ActionExecutingContext filterContext)
        {
            this._logger?.Debug(filterContext.ToString());
        }
        public override void Info(ActionExecutingContext filterContext)
        {
            this._logger?.Info(filterContext.ToString());
        }
        public override void Error(ActionExecutedContext filterContext)
        {
            this._logger?.Error(LogFormatter.Exception(filterContext.Exception), filterContext.Exception);
        }
        public override void Error(ActionExecutingContext filterContext)
        {
            this._logger?.Error(filterContext.ToString());
        }
        public override void Error(Exception ex, string message)
        {
            this._logger?.Error(message + LogFormatter.Exception(ex), ex);
        }


    }
}