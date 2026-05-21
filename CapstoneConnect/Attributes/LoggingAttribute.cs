using Microsoft.AspNetCore.Mvc.Filters;
using log4net;
using log4net.Config;
using System.Reflection;
using CapstoneConnectLog;

namespace CapstoneConnect.Attributes
{
    public class LoggingAttribute : ActionFilterAttribute
    {
        private DateTimeOffset _requestStartTime = DateTimeOffset.MinValue;
        private static CommonExceptionLogger _Logger;

        static LoggingAttribute()
        {
            log4net.Util.LogLog.InternalDebugging = true;
            var logRepository = LogManager.GetRepository(Assembly.GetEntryAssembly());
            XmlConfigurator.Configure(logRepository, new FileInfo("log4net.config"));

            _Logger = new CommonExceptionLogger();
        }
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            try
            {
                _Logger?.Info(filterContext);
            }
            catch (Exception ex)
            {
                _Logger?.Error(filterContext);
            }

        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Exception != null)
            {
                _Logger.Error(context);

                //context.Result = new JsonResult(context.Exception.Message + context.HttpContext.Response.StatusCode);

            }
        }

    }
}
