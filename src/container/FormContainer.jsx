import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FormComponent from '../component/FormComponent.jsx';
import ReactDOM from 'react-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { Button, Container, Header, Icon, Modal, Segment } from 'semantic-ui-react';

class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recaptchaSuccess: false,
      showForm: false,
      captchaHidden: 'block',
      showModal: false,
    };
    console.log(process.env.NODE_ENV);
    this.loadedForm = this.loadedForm.bind(this);
    this.returnToAgendaItem = this.returnToAgendaItem.bind(this);
    this.returnToFeed = this.returnToFeed.bind(this);
    this.thankYou = this.thankYou.bind(this);
    this.onVerify = this.onVerify.bind(this);
  }
  onVerify(evt) {
    this.setState({
      showForm: true,
      captchaHidden: 'none',
      captchaVerify: evt,
    });
  }
  returnToAgendaItem() {
    this.props.history.goBack();
  }
  returnToFeed() {
    this.props.history.push('/feed');
  }
  thankYou() {
    console.log('Thank you');
    this.setState({ showForm: false, showModal: true });
  }
  loadedForm(ref) {
    // Super ugly! and non-performant, but window scrollTo would not work
    // If you find a better way, please do it! It may be at the router level
    // At every route change, the menu should be scrolled into view!
    let node = ReactDOM.findDOMNode(ref);
    if (node) {
      node.scrollIntoView();
    }
  }

  render() {
    return (
      <div>
        <div style={{ position: 'relative', display: this.state.captchaHidden }}>
          <ReCAPTCHA
            ref="recaptcha"
            sitekey="6LcnmVUUAAAAAKaVa9eHX41Nxpzg42_yEsGh0IOH"
            onChange={this.onVerify}
          />
        </div>
        {this.state.showForm && (
          <div style={{ position: 'relative', zIndex: 50 }} ref={this.loadedForm}>
            <FormComponent
              Title={this.props.Title}
              Recommendations={this.props.Recommendations}
              Summary={this.props.Summary}
              Id={this.props.Id}
              Pro={this.props.Pro}
              thankYou={this.thankYou}
              verify={this.state.captchaVerify}
            />
          </div>
        )}
        <div>
          <Modal style={{ color: 'black' }} defaultOpen={this.state.showModal}>
            <Modal.Header>{'Thank You For Your Opinion'}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <p>
                  Although we keep your opinion we don't directly send comments to the City Council.
                  We send grouped summaries of opinions we receive.
                </p>
                <p>Now that your opinion was recorded, where would you like to go?</p>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button primary onClick={this.returnToFeed}>
                <Icon name="angle double left" />Back to feed
              </Button>
              <Button primary onClick={this.returnToAgendaItem}>
                <Icon name="angle left" />Back to agenda item
              </Button>
            </Modal.Actions>
          </Modal>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { Form } = state;
  if (state.Form) {
    return {
      Title: Form.Title,
      Recommendations: Form.Recommendations,
      Summary: Form.Summary,
      Id: Form.Id,
      Pro: Form.Pro,
    };
  } else {
    return {};
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(FormContainer);
