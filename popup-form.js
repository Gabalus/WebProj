"use strict";

const {
  Formik,
  Field,
  Form
} = window.Formik;
const {
  createSlice,
  configureStore
} = window.RTK;
const {
  combineReducers
} = window.Redux;
const {
  Provider,
  connect
} = window.ReactRedux;
const callFormSlice = createSlice({
  name: 'callForm',
  initialState: "",
  reducers: {
    requestOpen: (state, action) => {
      if (state === "") return action.payload;
      return state;
    },
    requestFulfilled: state => ""
  }
});
const mainReducer = combineReducers({
  callForm: callFormSlice.reducer
});
const store = configureStore({
  reducer: mainReducer
});

class MainForm extends React.Component {
  render() {
    return React.createElement("div", null, React.createElement(Formik, {
      initialValues: {
        yourName: '',
        email: '',
        phone: '',
        message: '',
        policy: false
      },
      validate: values => {
        return {};
      },
      onSubmit: (values, {
        setSubmitting
      }) => {
        console.log(JSON.stringify(values));
        const prom = fetch('https://formcarry.com/s/H4_67oHdy', {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(values)
        });
        prom.then(response => {
          alert("Форма отправлена");
          console.log(response);
          setSubmitting(false);
          
        });
      }
    }, ({
      isSubmitting,
      handleChange,
      handleBlur,
      values
    }) => React.createElement(Form, null, React.createElement(Field, {
      type: "text",
      name: "yourName",
      placeholder: "Ваше имя",
      required: true
    }), React.createElement(Field, {
      type: "text",
      name: "phone",
      placeholder: "Телефон",
      required: true
    }), React.createElement(Field, {
      type: "email",
      name: "email",
      placeholder: "E-mail",
      required: true
    }), React.createElement("textarea", {
      name: "message",
      onChange: handleChange,
      onBlur: handleBlur,
      value: values.message,
      placeholder: "Вам комментарий"
    }), React.createElement("label", {
      htmlFor: "policy",
      className: "chb-block"
    }, React.createElement(Field, {
      type: "checkbox",
      className: "chb",
      id: "policy",
      name: "policy"
    }), React.createElement("span", {
      className: "chb-place"
    }), React.createElement("div", null,React.createElement("span", {
      className: "checkbox-text"
    }, "Отправляя заявку, я даю согласие на ",React.createElement("a", {
      href: ""
    }, "обработку своих персональных данных."), "."))),React.createElement("div", {
      id: "recaptcha-store"
    }, React.createElement("div", {
      id: "recaptcha",
      className: "g-recaptcha",
      "data-sitekey": "6LeXO4YjAAAAAMJ6PqwVuMuzawdg-6CSqouUgjTv",
      "data-theme": "dark",
      "data-callback": "captchaCallback"
    })), React.createElement("button", {
      type: "submit",
      disabled: isSubmitting
    }, "Отправить"))));
  }

}

class ModalWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      finallyOpen: false,
      finallyClosed: true
    };

    this.stepOpen = this.stepOpen.bind(this);
    this.playOpen = this.playOpen.bind(this);
    this.stepClose = this.stepClose.bind(this);
    this.playClose = this.playClose.bind(this);
    this.handleOffClick = this.handleOffClick.bind(this);
  }

  stepOpen(timestamp) {
    if (this.startOpen === undefined) this.startOpen = timestamp;
    let elapsed = timestamp - this.startOpen;
    const time = 700;
    document.getElementById('moving-overlay').style.transform = 'scale(' + Math.min(elapsed / time, 1) + ')';
    if (this.centerString) document.getElementById('moving-overlay').style.transformOrigin = this.centerString;
    document.getElementById('captured-overlay').style.backgroundColor = 'rgba(20, 20, 20, ' + Math.min(elapsed / time * 0.8, 0.8) + ')';

    if (elapsed < time) {
      window.requestAnimationFrame(this.stepOpen);
    } else {
      this.setState({
        finallyOpen: true
      });
    }
  }

  playOpen(id) {
    if (!this.state.finallyClosed) return;
    this.setState({
      finallyClosed: false
    });
    this.startOpen = undefined;
    let elem = document.getElementById(id);

    if (elem) {
      this.id = id;
      let rect = elem.getBoundingClientRect();
      let centerX = (rect.left + rect.right) / 2;
      let centerY = (rect.top + rect.bottom) / 2;
      this.centerString = centerX + "px " + centerY + "px";
    }

    window.requestAnimationFrame(this.stepOpen);
  }

  stepClose(timestamp) {
    if (this.startClose === undefined) this.startClose = timestamp;
    let elapsed = timestamp - this.startClose;
    const time = 700;
    document.getElementById('moving-overlay').style.transform = 'scale(' + (1 - Math.min(elapsed / time, 1)) + ')';
    if (this.centerString) document.getElementById('moving-overlay').style.transformOrigin = this.centerString;
    document.getElementById('captured-overlay').style.backgroundColor = 'rgba(20, 20, 20, ' + (0.8 - Math.min(elapsed / time * 0.8, 0.8)) + ')';

    if (elapsed < time) {
      window.requestAnimationFrame(this.stepClose);
    } else {
      this.setState({
        finallyClosed: true
      });
    }
  }

  playClose() {
    if (!this.state.finallyOpen) return;
    this.setState({
      finallyOpen: false
    });
    this.startClose = undefined;

    if (this.id) {
      let elem = document.getElementById(this.id);
      let rect = elem.getBoundingClientRect();
      let centerX = (rect.left + rect.right) / 2;
      let centerY = (rect.top + rect.bottom) / 2;
      this.centerString = centerX + "px " + centerY + "px";
    }

    window.requestAnimationFrame(this.stepClose);
  }

  componentDidUpdate() {
    if (this.props.openRequest !== "") {
      this.playOpen(this.props.openRequest);
      this.props.requestFulfilled();
    }
  }

  handleOffClick(e) {
    if (document.getElementById('popup-form').contains(e.target)) return;
    this.playClose();
  }

  render() {
    if (this.state.finallyClosed) {
      return null;
    }

    return React.createElement("div", {
      id: "captured-overlay"
    }, React.createElement("div", {
      id: "moving-overlay",
      onClick: this.handleOffClick
    }, React.createElement("div", {
      id: "popup-form"
    }, this.props.children)));
  }

}

function mapState(state) {
  const {
    callForm
  } = state;
  return {
    openRequest: callForm
  };
}

const mapDispatch = {
  requestFulfilled: callFormSlice.actions.requestFulfilled
};
const WrappedModalWindow = connect(mapState, mapDispatch)(ModalWindow);
ReactDOM.render( React.createElement(Provider, {
  store: store
}, React.createElement(WrappedModalWindow, null, React.createElement(MainForm, null))), document.getElementById('react-block'));

function clickHandler(e) {
  e.preventDefault();
  store.dispatch(callFormSlice.actions.requestOpen(e.target.id));
}

document.querySelectorAll(".call-form").forEach(elem => elem.addEventListener("click", clickHandler));
