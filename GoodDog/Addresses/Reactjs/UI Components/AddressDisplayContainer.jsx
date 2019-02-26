import React, { Suspense } from "react";
import * as addressService from "../../services/addressService";
import AddressCard from "./AddressCard";
import Pagination from "react-js-pagination";
import MiniCard from "./MiniCard";
import { Modal } from "reactstrap";
import { Row } from "reactstrap";
import PageLoader from "../Common/PageLoader";
import { CardDeck } from "reactstrap";
import ContentWrapper from "../Layout/ContentWrapper";
import * as alerts from "../NotificationMessage";
import swal from "@sweetalert/with-react";

class AddressDisplayContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addresses: [],
      modal: false,
      addressData: {},
      total: 0,
      limit: 9,
      pageCount: 3,
      currentPage: 1
    };
  }

  componentDidMount() {
    if (this.props.match.params.id > 0) {
      this.onModalRequested();
    }
    let pageObject = { pageIndex: 0, pageSize: this.state.limit };
    addressService
      .getPaged(pageObject)
      .then(this.onGetAddressesSuccess)
      .catch(this.onGetAddressesError);
    window.scrollTo(0, 0);
  }

  onGetAddressesSuccess = response => {
    let addressesList = response.item;
    let flag = this.props.match.params.id > 0;
    this.setState({
      addresses: addressesList.pagedItems,
      total: addressesList.totalCount,
      limit: addressesList.pageSize,
      currentPage: addressesList.pageIndex + 1,
      modal: flag
    });
  };

  handlePageChange = address => {
    let pageObject = { pageIndex: address - 1, pageSize: this.state.limit };
    addressService
      .getPaged(pageObject)
      .then(this.onGetAddressesSuccess)
      .catch(this.onGetAddressesError);
    window.scrollTo(0, 0);
  };

  onGetAddressesError = error => {
    console.log(error);
  };

  onModalRequested = address => {
    this.setState({
      modal: true,
      addressData: address
    });
  };

  onEditRequested = address => {
    this.setState({
      addressData: address
    });

    this.props.history.push(`/addresses/${address.id}/edit`);
  };

  prompt = () => {
    alerts.prompt(
      {
        title: "Are you sure you want to delete this address?",
        text: "Once deleted, you will not be able to recover this.",
        icon: "warning",
        buttons: true,
        dangerMode: true
      },
      this.onDeleteRequested
    );
  };

  onDeleteRequested = willDelete => {
    let aid = this.state.addressData.id;
    if (willDelete) {
      addressService
        .remove(aid)
        .then(this.onRemoveSuccess)
        .catch(this.onRemoveFail);
      let pageObject = { pageIndex: 0, pageSize: this.state.limit };
      addressService
        .getPaged(pageObject)
        .then(this.onGetAddressesSuccess)
        .catch(this.onGetAddressesError);
      window.scrollTo(0, 0);
    }
  };

  onRemoveSuccess = () => {
    swal("Delete successful", { icon: "success" });
  };

  onRemoveFail = () => {
    alerts.error({ message: "Oops, something went wrong!" });
  };

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
    if (this.props.match.params.id > 0) {
      this.props.history.push("/addresses/");
    }
  };

  onGetIdSuccess = response => {
    console.log(response);
  };

  onGetIdError = error => {
    console.log(error);
  };

  getAllAddresses = address => {
    return (
      <AddressCard
        key={address.id}
        address={address}
        modalRequester={this.onModalRequested}
        editRequester={this.onEditRequested}
      />
    );
  };

  render() {
    return (
      <Suspense fallback={<PageLoader />}>
        <ContentWrapper>
          <CardDeck>{this.state.addresses.map(this.getAllAddresses)}</CardDeck>
          <Row className="m-5 justify-content-center">
            <Pagination
              hideDisabled
              activePage={this.state.currentPage}
              itemsCountPerPage={this.state.limit}
              totalItemsCount={this.state.total}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
            />
          </Row>
        </ContentWrapper>
        <Modal
          isOpen={this.state.modal}
          size="xl"
          centered={true}
          toggle={this.toggleModal}
        >
          <MiniCard
            {...this.state.addressData}
            {...this.props}
            editRequester={this.onEditRequested}
            deleteRequester={this.prompt}
          />
        </Modal>
      </Suspense>
    );
  }
}

export default AddressDisplayContainer;
