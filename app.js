const formValidator = (form, fieldsConfig, onValidateSuccess, onValidationError) => {

  const validateField = (fieldElement, fieldConfig) => {
    const value = fieldElement.value;
    const rules = fieldConfig.rules;
    const formGroup = fieldElement.closest('.form-group');
    const errorElement =  formGroup.querySelector('.form-error-message');

    const fieldValidationResult = {name: fieldConfig.name, value: value, errors: []};
    rules.forEach(rule => {
      if (rule.required && !value) {
        fieldValidationResult.errors.push(rule.message);
      }
      if (rule.maxLength && `${value}`.length > rule.maxLength) {
        fieldValidationResult.errors.push(rule.message);
      }
      if (rule.mobileNumber && value) {
        if (value.startsWith('+') && value.length !== 13) {
          fieldValidationResult.errors.push(rule.message);
        }
        if (!value.startsWith('+') && value.length !== 9) {
          fieldValidationResult.errors.push(rule.message);
        }
      }
      if (rule.pn && value) {
        if (value.length !== 11) {
          fieldValidationResult.errors.push(rule.message);
        }
        // if(isNaN(Number(value))) {
        //   fieldValidationResult.errors.push(rule.message);
        // }
        if (/^[0-9]+$/.test(value) === false) {
          fieldValidationResult.errors.push(rule.message);
        }
      }
    });

    if (fieldValidationResult.errors.length > 0) {
      errorElement.innerText = fieldValidationResult.errors.join('\n');
    } else {
      errorElement.innerText = '';
    }
    // console.log(fieldValidationResult);

    return fieldValidationResult;
  }

  const validateOnChange = () => {
    fieldsConfig.forEach((fieldConfig) => {
      const fieldElement = form.querySelector(`[name="${fieldConfig.name}"]`);
      fieldElement.addEventListener('input', e => {
        validateField(e.target, fieldConfig);
      });
    })
  }

  const validateOnSubmit = () => {
    const validatedFields = [];
    fieldsConfig.forEach((fieldConfig) => {
      const fieldElement = form.querySelector(`[name="${fieldConfig.name}"]`);
      validatedFields.push(validateField(fieldElement, fieldConfig));
    });

    return validatedFields;
  }

  const listenFormSubmit = () => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      console.log('submit');
      const errors = [];
      const values = {};
      const validationResult = validateOnSubmit();
      validationResult.forEach(result => {
        values[result.name] = result.value;
        errors.push(...result.errors);
      });
      if (errors.length === 0) {
        onValidateSuccess(values);
      } else {
        onValidationError(errors);
      }
      console.log(values);
    });
  }
  listenFormSubmit();
  validateOnChange();

  function setFields(dataObject){
    fieldsConfig.forEach((fieldConfig) => {
      const fieldElement = form.querySelector(`[name="${fieldConfig.name}"]`);
      fieldElement.value = dataObject.hasOwnProperty(fieldConfig.name) ? dataObject[fieldConfig.name]: '';
    })
  }

  return {
    setFields,
  }
}

const fieldsConfig = [
  {name: 'id', rules: [{required: false}]},
  {
    name: 'first_name',
    rules: [
      {required: true, message: 'First name is required.'},
      {maxLength: 10, message: 'სიბოლოების რაოდენობა უნდა იყოს 10 ზე ნაკლები ან ტოლი'},
    ]
  },
  {
    name: 'last_name',
    rules: [
      {required: true, message: 'Last name is required.'},
    ]
  },
  {
    name: 'zip',
    rules: [
      {required: true, message: 'Zip Code name is required.'},
    ]
  },
  {
    name: 'mobile',
    rules: [
      {required: true, message: 'Mobile is required.'},
      {mobileNumber: true, message: 'lorem mobile'},
    ]
  },
  {
    name: 'pn',
    rules: [
      {required: true, message: 'Zip Code name is required.'},
      {pn: true, message: 'lorem pn'},
    ]
  },
  {
    name: 'email',
    rules: [
      {required: true, message: 'Zip Code name is required.'},
    ]
  },
  {
    name: 'status',
    rules: [
      {required: true, message: 'Zip Code name is required.'},
    ]
  },
  {
    name: 'gender',
    rules: [
      {required: true, message: 'Zip Code name is required.'},
    ]
  }
];

const form = document.querySelector('#user-registraion-form');

const onFormSubmitSuccess = (fields) => {
  if(fields.id){
    updateUser(fields);
  }else {
    createUser(fields);
  }
}
const onFormSubmitError = (fields) => {
  console.log('Error', fields);
}

const formManager = formValidator(form, fieldsConfig, onFormSubmitSuccess, onFormSubmitError);

const userModalId = '#user-form-modal';

function modal(modalId) {
  const modalWrapper = document.querySelector(modalId);
  const modalContent = modalWrapper.querySelector('.modal-content');
  const closeBtn = modalContent.querySelector('.close');

  modalWrapper.style.display = 'block';

  modalContent.addEventListener('click', e => {
    e.stopPropagation();
  });

  modalWrapper.addEventListener('click', e => {
    modalWrapper.style.display = 'none';
  });

  closeBtn.addEventListener('click', e => {
    modalWrapper.style.display = 'none';
  });

  function close(){
    modalWrapper.style.display = 'none';
  }

  return {
    close
  }
}

function renderUsers(items){
  // აქ წამოღებილი მომხმარებლები უკვე გადმოეცემა getUsers-იდან
  // უნდა დააგენერირო html table რომელიც გავაკეთეთ ლექცია 17-ში

  // userTableBody.innerHTML = userItems.join('');
  userActions();
}

function userActions(){
  // ცხრილში ღილაკებზე უნდა მიამაგროთ event listener-ები
  // იქნება 2 ღილაკი რედაქტირება და წაშლა
  // id შეინახეთ data-user-id ატრიბუტად ღილაკებზე
  // წაშლა ღილაკზე უნდა გაიგზავნოს წაშლის მოთხოვნა და გადაეცეს id
  // ეიდტის ღილაკზე უნდა გაიხსნას მოდალ სადაც ფორმი იქნება
  // ეიდტის ღილაკზე უნდა გამოიძახოთ getUser ფუნქცია და რომ დააბრუნებს ერთი მომხმარებლის დატას (ობიექტს და არა მასივს)
  // ეს დატა უნდა შეივსოს ფორმში formManager აქვს ახალი შესაძლებლობა formManager.setFields(userObject)
  // ეს ფუნქცია გამოიძახე და გადაეცი user-ის დატა
}

userActions();


fetch('http://api.kesho.me/v1/user-test/index')
.then(function(response){
  console.log(response);
  return response.json();
})
.then(function(json){
  renderUsers(json);
  console.log(json);
  var users = document.getElementById('users')
  json.forEach((element) => {
    let wrapperElement = document.createElement('table');
    let first_name = document.createElement('td');
    let last_name = document.createElement('td');
    let gender = document.createElement('td');
    let pn = document.createElement('td');
    let mobile = document.createElement('td')
    let email = document.createElement('td');
    let zip = document.createElement('td');
    let status = document.createElement('td');


    first_name.innerText = element.first_name;
    last_name.innerText = element.last_name;
    gender.innerText = element.gender;
    pn.innerText = element.pn;
    mobile.innerText = element.mobile;
    email.innerText = element.email;
    zip.innerText = element.zip;
    status.innerText = element.status;

    
    wrapperElement.appendChild(first_name);
    wrapperElement.appendChild(last_name);
    wrapperElement.appendChild(gender);
    wrapperElement.appendChild(pn);
    wrapperElement.appendChild(mobile);
    wrapperElement.appendChild(email);
    wrapperElement.appendChild(zip);
    wrapperElement.appendChild(status);
    users.appendChild(wrapperElement);
  });
})


async function createUser(userData){
  try {
    const response = await fetch('http://api.kesho.me/v1/user-test/create', {
      method: 'post',
      body: JSON.stringify(userData),
      headers: {'Content-Type': 'application/json'}
    });
    await response.json();
    getUsers(); // შენახვის ედიტირების და წაშლის შემდეგ ახლიდან წამოიღეთ უსერები
  }catch (e){
    console.log('Error - ', e);
  }
}