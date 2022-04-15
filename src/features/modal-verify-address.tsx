import React, { Fragment, useState, useEffect } from 'react'
import { Button, Row, Col, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap'
// import { AvGroup, AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
// import axios from 'axios';
// import AgGrid from 'app/shared/components/AgGrid';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import xml2js from 'xml2js';
// import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
// import { Translate } from 'react-jhipster';

// MODAL STATE

const ModalVerifyAddress = props => {
  const [closeModal, setCloseModal] = useState(props.isOpen)
  const [continueUnverified, setContinueUnverified] = useState(false)
  const toggleSubModal = () => props.closeAddressVerificationModal()

  return (
    <Modal isOpen={props.isOpen} toggle={toggleSubModal} centered={true} size="md" backdrop="static">
      <ModalHeader>Address Verificatio</ModalHeader>
      <ModalBody>
        <Col md="12">
          <Row>
            <Col md="6">
              {props.addressVerificationStatus === 'verifying' && (
                <div className="uspsAdressVerification">
                  <h5>Verifying address with USPS...</h5>
                </div>
              )}

              {props.addressVerificationStatus === 'failed' && (
                <div className="uspsAdressVerificationFailed">
                  <h5>Address verification failed! Please fix the address and try again</h5>
                </div>
              )}
              {props.addressVerificationStatus === 'success' && (
                <div className="uspsAdressVerificationSuccess">
                  <h5>Address verification Passed</h5>
                </div>
              )}
            </Col>
            <Col md="6">
              <div>
                {props.addressVerificationStatus === 'verifying' && (
                  <img src="content/images/spinner.gif" className="spinner" />
                )}
                {props.addressVerificationStatus === 'failed' && (
                  <img src="content/images/failed.png" className="spinner" />
                )}
                {props.addressVerificationStatus === 'success' && (
                  <img src="content/images/checkmark.gif" className="spinner" />
                )}
              </div>
            </Col>
          </Row>
        </Col>
      </ModalBody>
      <ModalFooter className="FooterSpaceBetween custom-modal">
        <Label check className="d-flex align-items-center">
          <input
            type="checkbox"
            className="mr-1"
            // onChange={setContinueUnverified} value={continueUnverified}
          />{' '}
          Continue with unverified address
        </Label>
        onChange
        <div className="d-flex align-items-center">
          <Button
            color="primary"
            id="save-entity"
            onClick={props.save}
            disabled={!continueUnverified || props.addressVerificationStatus === 'verifying'}
            className="btn btn-primary jh-create-entity "
          >
            {/* <SaveRoundedIcon /> */}
            Save
          </Button>
          <Button color="secondary" onClick={toggleSubModal} className="ml-2">
            Close
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}

export default ModalVerifyAddress
