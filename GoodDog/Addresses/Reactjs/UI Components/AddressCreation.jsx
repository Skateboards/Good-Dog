import React, { Component } from "react";
import {
  FormGroup,
  Label,
  Input,
  Card,
  CardHeader,
  CardBody
} from "reactstrap";
import * as addressService from "../../services/addressService";
import { Form, Field, Formik } from "formik";
import * as schemas from "../../models/addressSchemas";
import Select from "react-select";
import ContentWrapper from "../Layout/ContentWrapper";
import * as prompts from "../NotificationMessage";

export default class AddressCreation extends Component {
  constructor(props) {
    super(props);
    this.validation = schemas.getAddressSchema;
    this.state = {
      stateProvincesArray: []
    };
    this.state.addressData = this.validation.initialValues;
  }

  componentDidMount = () => {
    addressService
      .getStates()
      .then(this.onGetStateProvincesSuccess)
      .catch(this.onGetStateProvincesFail);
    window.scrollTo(0, 0);
  };

  onGetStateProvincesSuccess = response => {
    console.log(response);
    let StateProvinces = response.items;
    let dropdownOptions = StateProvinces.map(StateProvince => {
      return { value: StateProvince.id, label: StateProvince.name };
    });
    this.setState({
      stateProvincesArray: dropdownOptions
    });
  };

  onGetStateProvincesFail = error => {
    console.log(error);
  };

  onCreateAddressSuccess = response => {
    if (this.props.responseHandler !== undefined) {
      this.props.responseHandler(response);
      prompts.success({ message: "Address created successfully" });
    } else {
      prompts.success({ message: "Address created successfully" });
      this.props.history.push("/addresses/display");
    }
  };

  onCreateAddressFail = error => {
    if (this.props.responsaHendler !== undefined) {
      this.props.responseHandler(error);
    }
    prompts.error({ message: "Oops, something went wrong" });
  };

  handleSubmit = (values, obj) => {
    addressService
      .create(values)
      .then(this.onCreateAddressSuccess)
      .catch(this.onCreateAddressFail)
      .then(() => {
        obj.setSubmitting(false);
      });
  };

  render() {
    const options = this.state.stateProvincesArray;
    return (
      <ContentWrapper>
        <Card className="card-flat">
          <CardHeader className="text-center bg-info">
            <h4 style={{ color: "white" }}>Register Your Address: </h4>
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
                  setFieldTouched
                } = props;
                return (
                  <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <div className="form-group">
                        <Label for="lineOne"> Address Line 1:</Label>
                        <Input
                          id="lineOne"
                          type="text"
                          value={values.lineOne || ""}
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
                          value={values.lineTwo || ""}
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
                          value={values.city || ""}
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
                          value={values.postalCode || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            errors.postalCode && touched.postalCode
                              ? "error"
                              : ""
                          }
                        />
                        {errors.postalCode && touched.postalCode && (
                          <label className="error">{errors.postalCode}</label>
                        )}
                      </div>
                    </FormGroup>
                    <div className="buttonGroup">
                      <button
                        type="button"
                        className="btn btn-outline-primary float-right submitForm"
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </CardBody>
        </Card>
      </ContentWrapper>
    );
  }
}
