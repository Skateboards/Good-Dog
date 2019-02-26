using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
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
    [AllowAnonymous]
    [Authorize(Roles = "Admin")]
    [RoutePrefix("api/activityentries")]
    public class ActivityEntryApiController : BaseApiController
    {
        IActivityEntryService _service = null;
        IAuthenticationService<int> _auth = null;

        public ActivityEntryApiController(IActivityEntryService service, IAuthenticationService<int> auth)
        {
            _service = service;
            _auth = auth;
        }

        [Route, HttpGet]
        public HttpResponseMessage Get()
        {
            ItemsResponse<ActivityEntry> responseBody = new ItemsResponse<ActivityEntry>();
            responseBody.Items = _service.Get();
            return Request.CreateResponse(HttpStatusCode.OK, responseBody);
        }

        [Route("{id:int}"), HttpGet]
        public HttpResponseMessage Get(int id)
        {
            ItemResponse<ActivityEntry> responseBody = new ItemResponse<ActivityEntry>();
            responseBody.Item = _service.Get(id);
            return Request.CreateResponse(HttpStatusCode.OK, responseBody);

        }

        [Route("{pageIndex:int}/{pageSize:int}"), HttpGet]
        public HttpResponseMessage Get(int pageIndex, int pageSize)
        {
            ItemResponse<Paged<ActivityEntry>> responseBody = new ItemResponse<Paged<ActivityEntry>>();
            responseBody.Item = _service.Get(pageIndex, pageSize);
            return Request.CreateResponse(HttpStatusCode.OK, responseBody);

        }

        [Route("{necessity}"), HttpGet]
        public HttpResponseMessage GetNecessity()
        {
            ItemsResponse<ActivityNecessity> responseBody = new ItemsResponse<ActivityNecessity>();
            responseBody.Items = _service.GetNecessity();
            return Request.CreateResponse(HttpStatusCode.OK, responseBody);
        }

        [Route("{necessity}/{pageIndex:int}/{pageSize:int}"), HttpGet]
        public HttpResponseMessage GetNecessityPage(int pageIndex, int pageSize)
        {
            ItemResponse<Paged<ActivityNecessity>> responseBody = new ItemResponse<Paged<ActivityNecessity>>();
            responseBody.Item = _service.GetNecessityPage(pageIndex, pageSize);
            return Request.CreateResponse(HttpStatusCode.OK, responseBody);

        }

        [Route, HttpPost]
        public HttpResponseMessage Add(ActivityEntryAddRequest model)
        {

            if (!ModelState.IsValid)
            {
                return CreateErrorResponse();
            }
            int userId = _auth.GetCurrentUserId();
            ItemResponse<int> response = new ItemResponse<int>();
            response.Item = _service.Insert(model, userId);
            return Request.CreateResponse(HttpStatusCode.Created, response);
        }

        [Route("{id:int}"), HttpPut]
        public HttpResponseMessage Update(ActivityEntryUpdateRequest model)
        {
            if (!ModelState.IsValid)
            {
                return CreateErrorResponse();
            }
            int userId = _auth.GetCurrentUserId();
            _service.Update(model, userId);
            SuccessResponse response = new SuccessResponse();
            return Request.CreateResponse(HttpStatusCode.Created, response);
        }

        [Route("{id:int}"), HttpDelete]
        public HttpResponseMessage Delete(int id)
        {
            _service.Delete(id);
            SuccessResponse responseBody = new SuccessResponse();
            return Request.CreateResponse(HttpStatusCode.OK, responseBody);
        }

        [Route, HttpGet]
        public HttpResponseMessage Get(string start, string end, int offset)
        {
            HttpStatusCode code = HttpStatusCode.OK;

            int userId = _auth.GetCurrentUserId();

            ItemsResponse<DailyActivityData> response = new ItemsResponse<DailyActivityData>();
            response.Items = _service.GetDateRange(userId, start, end, offset);

            if (response.Items == null)
            {
                code = HttpStatusCode.NotFound;
            }

            return Request.CreateResponse(code, response);
        }

    }
}
