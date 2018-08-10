import { delay } from 'redux-saga'
import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects'
// import { take, call, put, select } from 'redux-saga/effects';
import { DEFAULT_ACTION, LOAD_TEMPLATES, LOGOUT_ACTION, LOGOUT_ERROR } from './constants';
import { loadedTemplates, logoutAction, logoutSuccess, logoutError, deleteErrorUserPage } from './actions';
import BrowserStorage from '../../api/browserStorage';
import ApiCalls from '../../api/api';
import { API_ROUTE } from '../../api/defaults';

function* apiCaller(action) {

  // console.log("Api caller for logout. Action="+JSON.stringify(action))
  var api = new ApiCalls(API_ROUTE());
  // yield call();  // To really call 
  try {
    // Remove login credentials even if API call fails
    var brwst = new BrowserStorage();
    brwst.removeUser();

    const response = yield call(api.userLogout, action.username, action.jwt);
    
    if (response.status === 204) {
      // send actual action
      yield put(logoutSuccess());
      yield put(deleteErrorUserPage());
      
    } else {
      const err = yield call([response, response.json])
      console.error("The error is: "+JSON.stringify(err))
      yield put(logoutError(action.username, err));
    }
    
  } catch (e) {
    var errorString = e.message;
    console.error("ErrorString: "+errorString)
    yield put(logoutError(action.username, errorString));
  }
}


function* delayErrorDeletion(action) {
  yield delay(10 * 1000);
  yield put(deleteErrorUserPage());
}

function* sagaApiCall() {
  yield takeEvery(LOGOUT_ACTION, apiCaller);
}

function* sagaApiCallDelete() {
  yield takeEvery(LOGOUT_ERROR, delayErrorDeletion);
}

export default function* rootSaga() {
  yield all([
    sagaApiCall(),
    sagaApiCallDelete()
  ]);
}
