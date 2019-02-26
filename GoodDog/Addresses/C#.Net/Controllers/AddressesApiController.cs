using Sabio.Web.Models.Responses;
using Sabio.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Sabio.Services;
using Sabio.Models.Domain;
using Sabio.Models;

namespace Sabio.Web.Controllers.Api
{
    [AllowAnonymous]
    [Authorize(Roles = "Admin")]
    [RoutePrefix("api/addresses")]
    public class AddressesApiController : BaseApiController
    {
        IAddressService _service = null;
        IAuthenticationService<int> _auth = null;
        public AddressesApiController(IAddressService service, IAuthenticationService<int> auth)
        {
            _service = service;
            _auth = auth;
        }

        [Route, HttpPost]
        public HttpResponseMessage Add(AddressAddRequest model)
        {
            if (!ModelState.IsValid)
            {
                return CreateErrorResponse();
            }
            int userId = _auth.GetCurrentUserId();
            ItemResponse<int> response = new ItemResponse<int>
            {
                Item = _service.Add(model, userId)
            };
            return Request.CreateResponse(HttpStatusCode.Created, response);
        }

        [Route("{id:int}"), HttpPut]
        public HttpResponseMessage Update(AddressUpdateRequest model)
        {
            if (!ModelState.IsValid)
            {
                return CreateErrorResponse();
            }
            int userId = _auth.GetCurrentUserId();
            _service.Update(model, userId);
            SuccessResponse response = new SuccessResponse();
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        [Route("{id:int}"), HttpGet]
        public HttpResponseMessage Get(int id)
        {
            ItemResponse<Address> response = new ItemResponse<Address>();
            response.Item = _service.Get(id);

            if (response.Item == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, response);
            }
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        [Route("myaddress"), HttpGet]
        public HttpResponseMessage GetByUserId()
        {
            ItemResponse<Address> response = new ItemResponse<Address>();
            int userId = _auth.GetCurrentUserId();
            response.Item = _service.GetByUserId(userId);

            if (response.Item == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, response);
            }
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        [Route("{pageIndex:int}/{pageSize:int}"), HttpGet]
        public HttpResponseMessage Get(int pageIndex, int pageSize)
        {
            ItemResponse<Paged<Address>> responseBody = new ItemResponse<Paged<Address>>();
            responseBody.Item = _service.Get(pageIndex, pageSize);
            if (responseBody.Item == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, responseBody);
            }
            return Request.CreateResponse(HttpStatusCode.OK, responseBody);
        }

        [Route("{id:int}"), HttpDelete]
        public HttpResponseMessage Delete(int id)
        {
            _service.Delete(id);
            SuccessResponse response = new SuccessResponse();
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }
    }
}
