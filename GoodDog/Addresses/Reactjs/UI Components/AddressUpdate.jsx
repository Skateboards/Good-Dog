import React, { Component } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardHeader,
  CardBody
} from "reactstrap";
import * as addressService from "../../services/addressService";
import * as schemas from "../../models/addressSchemas";
import { Formik, Field } from "formik";
import Select from "react-select";
import * as prompts from "../NotificationMessage";

export default class AddressUpdate extends Component {
  constructor(props) {
    super(props);
    this.validation = schemas.getAddressSchema;
    this.aid =
      this.props.addressId === undefined
        ? this.props.match.params.addressId
        : this.props.addressId;
    this.state = {
      addressData: this.validation.initialValues,
      stateProvincesArray: [],
      defaultValue: null
    };
  }

  componentDidMount = () => {
    if (this.aid) {
      this.getAddressById();
    } else {
      this.getAddressByUserId();
    }
  };

  getAddressById = () => {
    addressService
      .getStates()
      .then(this.onGetStateProvincesSuccess)
      .catch(this.onGetStateProvincesFail)
      .then(
        addressService
          .getById(this.aid)
          .then(this.onGetByIdSuccess)
          .catch(this.onGetByIdFail)
      );
    window.scrollTo(0, 0);
  };

  getAddressByUserId = () => {
    addressService
      .getStates()
      .then(this.onGetStateProvincesSuccess)
      .catch(this.onGetStateProvincesFail)
      .then(
        addressService
          .getByUserId()
          .then(this.onGetByIdSuccess)
          .catch(this.onGetByIdFail)
      );
    window.scrollTo(0, 0);
  };

  onGetByIdSuccess = response => {
    const formData = response.item;
    this.aid = response.item.id;
    this.setState({
      addressData: {
        lineOne: formData.lineOne,
        lineTwo: formData.lineTwo,
        city: formData.city,
        stateId: formData.stateProvince.id,
        stateName: formData.stateProvince.name,
        postalCode: formData.postalCode
      }
    });
  };

  onGetByIdFail = error => {
    console.error(error);
  };

  onGetStateProvincesSuccess = response => {
    let stateProvinces = response.items;
    let dropdownOptions = stateProvinces.map(stateProvince => {
      return { value: stateProvince.id, label: stateProvince.name };
    });
    this.setState({
      stateProvincesArray: dropdownOptions
    });
  };

  onGetStateProvincesFail = error => {
    console.error(error);
  };

  handleSubmit = (values, obj) => {
    addressService
      .update(this.aid, values)
      .then(this.onUpdateSuccess)
      .catch(this.onUpdateFail)
      .then(() => {
        obj.setSubmitting(false);
      });
  };

  onUpdateSuccess = response => {
    if (this.props.responseHandler !== undefined) {
      this.props.responseHandler(response);
      prompts.success({ message: "Update Successful" });
    } else {
      prompts.success({ message: "Update Successful" });
    }
  };

  onUpdateFail = error => {
    if (this.props.responseHandler !== undefined) {
      this.props.responseHandler(error);
    }
    prompts.error({ message: "Oops, something went wrong" });
    console.error(error);
  };

  render() {
    const options = this.state.stateProvincesArray;
    return (
      <Card>
        <CardHeader className="text-center dynamic-card-header">
          <h4 style={{ color: "white" }}>Edit Address</h4>
        </CardHeader>
        <CardBody>
          <Formik
            enableReinitialize={true}
            initialValues={this.state.addressData}
            onSubmit={this.handleSubmit}
            validationSchema={this.validation()}
          >
            {props => {
              const {
                values,
                touched,
                errors,
                isSubmitting,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                setFieldTouched,
                handleReset
              } = props;
              this.fakeReset = handleReset;
              return (
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <div className="form-group">
                      <Label for="lineOne"> Address Line 1:</Label>
                      <Input
                        id="lineOne"
                        type="text"
                        value={values.lineOne}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.lineOne && touched.lineOne ? "error" : ""
                        }
                      />
                      {errors.lineOne && touched.lineOne && (
                        <label className="error">{errors.lineOne}</label>
                      )}
                    </div>
                    <div className="form-group">
                      <Label for="lineTwo">Address Line 2:</Label>
                      <Input
                        id="lineTwo"
                        type="text"
                        value={values.lineTwo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.lineTwo && touched.lineTwo ? "error" : ""
                        }
                      />
                      {errors.lineTwo && touched.lineTwo && (
                        <label className="error">{errors.lineTwo}</label>
                      )}
                    </div>
                    <div className="form-group">
                      <Label for="city">City:</Label>
                      <Input
                        id="city"
                        type="text"
                        value={values.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.city && touched.city ? "error" : ""}
                      />
                      {errors.city && touched.city && (
                        <label className="error">{errors.city}</label>
                      )}
                    </div>
                    <div className="form-group">
                      <Label for="stateId">State:</Label>
                      <Field
                        name="stateId"
                        render={({ field }) => (
                          <Select
                            {...field}
                            onChange={value =>
                              setFieldValue("stateId", value.value)
                            }
                            onBlur={() => setFieldTouched("options", true)}
                            value={values.options}
                            options={options}
                            placeholder={this.state.addressData.stateName}
                            className={
                              errors.stateId && touched.stateId ? "error" : ""
                            }
                          />
                        )}
                      />
                      {errors.stateId && touched.stateId && (
                        <label className="error">{errors.stateId}</label>
                      )}
                    </div>
                    <div className="form-group">
                      <Label for="postalCode">ZIP:</Label>
                      <Input
                        id="postalCode"
                        type="text"
                        value={values.postalCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.postalCode && touched.postalCode ? "error" : ""
                        }
                      />
                      {errors.postalCode && touched.postalCode && (
                        <label className="error">{errors.postalCode}</label>
                      )}
                    </div>
                  </FormGroup>
                  <div className="d-flex">
                    <button
                      type="submit"
                      className="btn btn-primary ml-auto submitForm"
                      disabled={isSubmitting}
                    >
                      Submit
                    </button>
                    {this.props.handleCancel && (
                      <button
                        type="button"
                        className="btn btn-default ml-2 submitForm"
                        onClick={this.props.handleCancel}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </Form>
              );
            }}
          </Formik>
        </CardBody>
      </Card>
    );
  }
}
