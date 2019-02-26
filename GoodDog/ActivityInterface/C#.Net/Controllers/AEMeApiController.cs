using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.ActivityEntryMe;
using Sabio.Services;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sabio.Web.Controllers.Api.Me
{
    [RoutePrefix("api/activityentry/me")]
    public class AEMeApiController : BaseApiController
    {
        private IActivityEntryService _service;
        private IAuthenticationService<int> _auth;

        public AEMeApiController(IActivityEntryService service, IAuthenticationService<int> auth)
        {
            _service = service;
            _auth = auth;
        }
        [Route, HttpPost]

        public HttpResponseMessage Add(AEMeAddRequest model)
        {
            if (!ModelState.IsValid)
            {
                return CreateErrorResponse();
            }
            ItemResponse<int> responseBody = new ItemResponse<int>();
            int userId = _auth.GetCurrentUserId();
            responseBody.Item = _service.Insert(model, userId);
            return Request.CreateResponse(HttpStatusCode.Created, responseBody);
        }

        [Route("{id:int}"), HttpPut]
        public HttpResponseMessage UpdateNotesPhotoActivity(AEMeUpdateNotesPhotoRequest model)
        {
            if (!ModelState.IsValid)
            {
                return CreateErrorResponse();
            }
            _service.UpdateNotesPhotoActivity(model);
            return Request.CreateResponse(HttpStatusCode.OK, new SuccessResponse());
        }

        [Route("start/{id:int}"), HttpPut]
        public HttpResponseMessage UpdateStartActivity(AEMeUpdateStartEndRequest model)
        {
            if (!ModelState.IsValid)
            {
                return CreateErrorResponse();
            }
            _service.UpdateStartActivity(model);
            return Request.CreateResponse(HttpStatusCode.OK, new SuccessResponse());
        }

        [Route("pause/{id:int}"), HttpPut]
        public HttpResponseMessage UpdatePauseActivity(AEMeUpdateStartEndRequest model)
        {
            if (!ModelState.IsValid)
            {
                return CreateErrorResponse();
            }
            _service.UpdatePauseActivity(model);
            return Request.CreateResponse(HttpStatusCode.OK, new SuccessResponse());
        }

        [Route("end/{id:int}"), HttpPut]
        public HttpResponseMessage UpdateEndActivity(AEMeUpdateStartEndRequest model)
        {
            if (!ModelState.IsValid)
            {
                return CreateErrorResponse();
            }
            _service.UpdateEndActivity(model);
            return Request.CreateResponse(HttpStatusCode.OK, new SuccessResponse());
        }

        [Route, HttpGet]
        public HttpResponseMessage GetOpenActivities()
        {
            int userId = _auth.GetCurrentUserId();
            ItemsResponse<ActivityEntry> responseBody = new ItemsResponse<ActivityEntry>();
            responseBody.Items = _service.GetOpenActivities(userId);
            HttpStatusCode statusCode = HttpStatusCode.OK;

            return Request.CreateResponse(statusCode, responseBody);

        }

        [Route("{pageIndex:int}/{pageSize:int}"), HttpGet]
        public HttpResponseMessage GetAllActivitiesForUserId(int pageIndex, int pageSize)
        {
            int userId = _auth.GetCurrentUserId();
            ItemResponse<Paged<ActivityEntry>> responseBody = new ItemResponse<Paged<ActivityEntry>>();
            responseBody.Item = _service.GetAllActivitiesForUserId(userId, pageIndex, pageSize);
            HttpStatusCode statusCode = HttpStatusCode.OK;
            if (responseBody.Item == null)
            {
                statusCode = HttpStatusCode.NotFound;
            }
            return Request.CreateResponse(statusCode, responseBody);
        }
    }
}
