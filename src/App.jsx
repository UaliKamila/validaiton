import './App.css';
import {useEffect, useState} from "react";

const useValidation = (value, validations) => {
    const [isEmpty, setEmpty] = useState(true)
    const [minLength, setMinLength]= useState(false)
    const [maxLength, setMaxLength]= useState(false)
    const [emailError, setEmailError] = useState(false)
    const [inputValid, setInputValid] = useState(false)

    useEffect(() => {
        for (const validation in validations) {
            switch (validation) {
                case 'minLength':
                    value.length < validations[validation] ? setMinLength(true) : setMinLength(false)
                    break;
                case 'isEmpty':
                    value ? setEmpty(false) : setEmpty(true)
                    break;
                case 'maxLength':
                    value.length > validations[validation] ? setMaxLength(true) : setMaxLength(false)
                    break
                case 'isEmail':
                    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    re.test(String(value).toLowerCase()) ? setEmailError(false) : setEmailError(true)
                    break
            }
        }
    }, [value])

    useEffect(() => {
        if (isEmpty || maxLength || minLength || emailError) {
            setInputValid(false)
        } else {
            setInputValid(true)
        }
    }, [isEmpty, maxLength, minLength, emailError])

    return {
        isEmpty,
        minLength,
        emailError,
        maxLength,
        inputValid
    }
}

const useInput = (initialValue, validations) => {
    const [value, setValue] = useState(initialValue)
    const [isDirty, setDirty] = useState(false)
    const valid = useValidation(value, validations)

    const onChange = (e) => {
        setValue(e.target.value)
    }

    const onSpace = (e) => {
        setDirty(true)
    }

    return {
        value,
        onChange,
        onSpace,
        isDirty,
        ...valid
    }
}


const App = () => {
    const email = useInput('', {isEmpty: true, minLength: 3, isEmail: true})
    const password = useInput('', {isEmpty: true, minLength: 5, maxLength: 8})

    function saySuccess() {
        alert('Авторизация успешна!');
    }


    return (
    <div className="App">
      <form>
          <h1 className="title">Авторизация</h1>

          <div className="form-group fp">
          <label htmlFor="exampleInputEmail1">Email адрес</label>
              {(email.isDirty && email.isEmpty) && <div style ={{color:'red'}}>Вы не заполнили поле</div>}
              {(email.isDirty && email.minLength) && <div style ={{color:'red'}}>Неккоректная длина</div>}
              {(email.isDirty && email.emailError) && <div style ={{color:'red'}}>Неккоректный email</div>}
              <input onChange={e => email.onChange(e)} onSpace={e => email.onSpace(e)} value={email.value} name="email" type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                 placeholder="Введите email" />
              <div style ={{color:'red'}}>Длина emaila должна быть не менее 3 букв</div>
          </div>

          <div className="form-group fp">
          <label htmlFor="exampleInputPassword1">Пароль</label>
              {(password.isDirty && password.isEmpty) && <div style ={{color:'red'}}>Вы не заполнили поле</div>}
              {(password.isDirty && password.maxLength) && <div style ={{color:'red'}}>Слишком длинный пароль</div>}
              {(password.isDirty && password.minLength) && <div style ={{color:'red'}}>Неккоректная длина</div>}
              <input onChange={e => password.onChange(e)} onSpace={e => password.onSpace(e)} value={password.value} name="password" type="password" className="form-control" id="exampleInputPassword1" placeholder="Пароль" />
              <div style ={{color:'red'}}>Длина пароля должна быть не менее 5 и не более 8 символов</div>
          </div>
          <button disabled={!email.inputValid || !password.inputValid} onClick={saySuccess} type="submit" className="btn btn-primary">Отправить</button>
      </form>
    </div>
  );
};

export default App;
