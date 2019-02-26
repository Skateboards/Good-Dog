using Sabio.Models.Domain;
using Sabio.Services;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sabio.Web.Controllers.Api
{
    [RoutePrefix("api/activities")]
    public class ActivityApiController : ApiController
    {
        ActivityService _service = null;

        public ActivityApiController(ActivityService service, IAuthenticationService<int> auth)
        {
            _service = service;
        }

        [Route, HttpGet]
        public HttpResponseMessage Get()
        {
            ItemsResponse<Activity> responseBody = new ItemsResponse<Activity>();
            responseBody.Items = _service.Get();
            return Request.CreateResponse(HttpStatusCode.OK, responseBody);
        }

        [Route("{id:int}"), HttpGet]
        public HttpResponseMessage Get(int id)
        {

            ItemResponse<Activity> responseBody = new ItemResponse<Activity>();
            responseBody.Item = _service.Get(id);
            return Request.CreateResponse(HttpStatusCode.OK, responseBody);

        }
    }
}
