import { delay } from 'redux-saga'
import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects'

import { SEND_LOGIN, ERROR_LOGIN } from "./constants";
import { successfulLogin, errorLogin, deleteErrorLogin } from "./actions";
import BrowserStorage from '../../api/browserStorage';
import ApiCalls from '../../api/api';

// import { take, call, put, select } from 'redux-saga/effects';

// var sendLogin = (username, password) => {
  
//   console.log("sendLoginApi: user="+username+" y pass="+password);
//   api.userLogin(username, password).then((response) => {
//     return response.json();
//   });
// }

var objectIsEmpty = obj => {
  try {
      return Object.keys(obj).length === 0 && obj.constructor === Object
  } catch (err) {
      console.log("Error: "+err);
  }
  return false;
}

function* apiCaller(action) {
  console.log("Api caller for send login");
  var api = new ApiCalls('http://localhost:8080/predictor/webapi');
  // yield call();  // To really call 
  try {
    const response = yield call(api.userLogin, action.username, action.password);
    
    if (response.status === 200) {
      const user = yield call([response, response.json]);
      if (user != undefined && !objectIsEmpty(user)) {
        // Update state on browser
        var brwst = new BrowserStorage();
        brwst.saveUser(user.username, user.email, user.jwt);
  
        // Update state of successful login
        yield put(successfulLogin(user.username, user.email, user.jwt));
      }
    } else {
      console.log("Error found on API:")
      const err = yield call([response, response.json])
      console.log("The error is: "+JSON.stringify(err))
      yield put(errorLogin(action.user, err));
    }
    
  } catch (e) {
    console.log("err="+e);
    console.error(e)
    yield put(errorLogin(action.user, e));
  }
  
}


function* delayDeletion(action) {
  console.log("Delete error msg");
  // yield call();  // To really call to api // TODO
  yield delay(10 * 1000);
  yield put(deleteErrorLogin());
}

function* sendLoginUserSaga() {
  yield takeEvery(SEND_LOGIN, apiCaller);
}

function* errorLoginSaga() {
  yield takeEvery(ERROR_LOGIN, delayDeletion);
}

// Individual exports for testing
export default function* defaultSaga() {
  // See example in containers/HomePage/saga.js
  yield all([
    sendLoginUserSaga(),
    errorLoginSaga(),
  ])
}
