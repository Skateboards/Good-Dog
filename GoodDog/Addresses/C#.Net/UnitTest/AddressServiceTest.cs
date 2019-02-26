using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services;

namespace Sabio.Tests.Services
{
    [TestClass]
    public class AddressServiceTest
    {
        private readonly IAddressService _addressService;

        public AddressServiceTest()
        {
            List<Address> addressList = new List<Address>();
            Address a1 = new Address();
            a1.StateProvince = new StateProvince();
            Address a2 = new Address();
            a2.StateProvince = new StateProvince();
            Address a3 = new Address();
            a3.StateProvince = new StateProvince();

            a1.Id = 1;
            a1.LineOne = "777 S. Alameda Ave";
            a1.LineTwo = "200";
            a1.City = "Los Angeles";
            a1.StateProvince.Id = 9;
            a1.PostalCode = "90021";

            a2.Id = 2;
            a2.LineOne = "1229 N. New Hampshire Ave";
            a2.LineTwo = "2";
            a2.City = "Los Angeles";
            a2.StateProvince.Id = 9;
            a2.PostalCode = "90029";

            a3.Id = 3;
            a3.LineOne = "1111 S. Figueroa St.";
            a3.LineTwo = "";
            a3.City = "Los Angeles";
            a3.StateProvince.Id = 9;
            a3.PostalCode = "90015";

            addressList.Add(a1);
            addressList.Add(a2);
            addressList.Add(a3);

            List<AddressAddRequest> addressAddAddressList = new List<AddressAddRequest>();
            AddressAddRequest aar1 = new AddressAddRequest();
            //int userId = 41;
            aar1.LineOne = "777 S. Alameda Ave";
            aar1.LineTwo = "200";
            aar1.City = "Los Angeles";
            aar1.StateId = 9;
            aar1.PostalCode = "90021";

            addressAddAddressList.Add(aar1);

            List<AddressUpdateRequest> addressUpdateAddressList = new List<AddressUpdateRequest>();
            AddressUpdateRequest aur1 = new AddressUpdateRequest();
            aur1.Id = 1;
            aur1.LineOne = "123 Fake St.";
            aur1.LineTwo = "4";
            aur1.City = "New York";
            aur1.StateId = 4;
            aur1.PostalCode = "10101";

            addressUpdateAddressList.Add(aur1);

            var mock = new Mock<IAddressService>();

            mock.Setup(m => m.Add(It.IsAny<AddressAddRequest>(), It.IsAny<int>())).Returns(
                (AddressAddRequest insertRequestModel, int userId) =>
                {
                    List<ValidationResult> valididationResults = ValidateModel(insertRequestModel);

                    if (valididationResults.Count > 0)
                    {
                        throw new ValidationException(valididationResults[0], null, insertRequestModel);
                    }
                    return addressAddAddressList.Count + 1;
                }
                );

            mock.Setup(m => m.Get(It.IsAny<int>())).Returns((int id) =>
            {
                Address model = addressList.Where(m => m.Id == id).FirstOrDefault();

                Address newModel = null;
                if (model != null)
                {
                    newModel = new Address();
                    newModel.StateProvince = new StateProvince();

                    newModel.Id = model.Id;
                    newModel.LineOne = model.LineOne;
                    newModel.LineTwo = model.LineTwo;
                    newModel.City = model.City;
                    newModel.StateProvince.Id = model.StateProvince.Id;
                    newModel.PostalCode = model.PostalCode;
                }
                return newModel;
            });

            mock.Setup(m => m.Update(It.IsAny<AddressUpdateRequest>(), It.IsAny<int>())).Callback(
                (AddressUpdateRequest updateRequestModel, int userId) =>
                {
                    List<ValidationResult> validationResults = ValidateModel(updateRequestModel);

                    if (validationResults.Count > 0)
                    {
                        throw new ValidationException(validationResults[0], null, updateRequestModel);
                    }
                    Address model = addressList.Where(m => m.Id == updateRequestModel.Id).Single();
                    model.LineOne = updateRequestModel.LineOne;
                    model.LineTwo = updateRequestModel.LineTwo;
                    model.City = updateRequestModel.City;
                    model.StateProvince.Id = updateRequestModel.StateId;
                    model.PostalCode = updateRequestModel.PostalCode;
                }
                );

            mock.Setup(m => m.Delete(It.IsAny<int>())).Callback(
                (int id) =>
                {
                    Address address = addressList.Where(m => m.Id == id).Single();
                    addressList.Remove(address);
                });

            mock.Setup(m => m.Get(It.IsAny<int>(), It.IsAny<int>())).Returns(
                (int pageIndex, int pageSize) =>
                {
                    List<Address> addressesList = new List<Address>();
                    int count = (pageIndex) * pageSize;

                    for (int i = count; i < addressList.Count; i++)
                    {
                        if (i < count + pageSize)
                        {
                            addressesList.Add(addressList[i]);
                        }
                        else
                        {
                            break;
                        }
                    }
                    Paged<Address> paged = new Paged<Address>(addressesList, pageIndex, pageSize, addressList.Count);
                    return paged;
                });

            mock.Setup(m => m.GetByUserId(It.IsAny<int>())).Returns((int userId) =>
            {
                Address model = addressList.Where(m => m.UserId == userId).FirstOrDefault();

                Address newModel = null;
                if (model != null)
                {
                    newModel = new Address();
                    newModel.StateProvince = new StateProvince();

                    newModel.Id = model.Id;
                    newModel.LineOne = model.LineOne;
                    newModel.LineTwo = model.LineTwo;
                    newModel.City = model.City;
                    newModel.StateProvince.Id = model.StateProvince.Id;
                    newModel.PostalCode = model.PostalCode;
                    newModel.UserId = model.UserId;
                }
                return newModel;
            });

            _addressService = mock.Object;
        }

        private List<ValidationResult> ValidateModel(object insertRequestModel)
        {
            List<ValidationResult> validationResults = new List<ValidationResult>();
            ValidationContext ctx = new ValidationContext(insertRequestModel, null, null);
            Validator.TryValidateObject(insertRequestModel, ctx, validationResults, true);
            return validationResults;
        }

        [TestMethod]
        public void Add_Test()
        {
            //Arrange
            int userId = 1;
            AddressAddRequest address = new AddressAddRequest
            {
                LineOne = "123 Fake St",
                LineTwo = "4",
                City = "New York",
                StateId = 45,
                PostalCode = "10101",
            };

            //Act
            int result = _addressService.Add(address, userId);

            //Assert
            Assert.IsInstanceOfType(result, typeof(int), "Id must be an int");
            Assert.IsTrue(result > 0);
        }

        [TestMethod]
        public void Update_Test()
        {
            Address address = new Address();
            StateProvince stateProvince = new StateProvince();
            address = _addressService.Get(1);

            //Arrange
            int userId = 1;
            AddressUpdateRequest addressUpdate = new AddressUpdateRequest
            {
                Id = address.Id,
                LineOne = "1382 Emir St",
                LineTwo = "",
                City = "Green Bay",
                StateId = 50,
                PostalCode = "54313",
            };

            //Act
            _addressService.Update(addressUpdate, userId);
            Address newAddress = new Address();
            newAddress.StateProvince = new StateProvince();
            newAddress = _addressService.Get(1);

            //Assert
            Assert.IsTrue(address.Id == newAddress.Id, "Id doesn't match");
            Assert.IsFalse(address.LineOne == newAddress.LineOne, "LineOne hasn't changed");
            Assert.IsFalse(address.LineTwo == newAddress.LineTwo, "LineOne hasn't changed");
            Assert.IsFalse(address.City == newAddress.City, "LineOne hasn't changed");
            Assert.IsFalse(address.StateProvince.Id == newAddress.StateProvince.Id, "LineOne hasn't changed");
            Assert.IsFalse(address.PostalCode == newAddress.PostalCode, "LineOne hasn't changed");
        }

        [TestMethod]
        public void GetById_Test()
        {
            Address address = _addressService.Get(1);
            Assert.IsNotNull(address, "Address can't be null");
            Assert.IsInstanceOfType(address, typeof(Address), "The return type is not correct");
        }

        [TestMethod]
        public void Delete()
        {
            Address address = _addressService.Get(1);

            _addressService.Delete(1);

            Address addressDefault = _addressService.Get(1);

            Assert.IsNull(addressDefault, "Delete is not a success");
        }

    }
}
