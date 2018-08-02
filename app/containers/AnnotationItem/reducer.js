/*
 *
 * AnnotationItem reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, SEND_VOTE, VOTE_ACCEPTED, VOTE_REJECTED, DELETE_VOTE_ERROR } from './constants';

export const initialState = fromJS({});

function annotationItemReducer(state = initialState, action) {
  console.log("AnnotationItem reducer with action="+JSON.stringify(action))
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SEND_VOTE:
      // The saga will launch API request
      return state;

    case VOTE_ACCEPTED:
      // Update the state of the annotation
      var newState = state.set(action.annotationId, {annotation: action.payload});
      return newState

    case VOTE_REJECTED:
      // Message error is saved on a separate property
      var newState = state.set(action.annotationId, {error: action.payload});
      return newState;
    
    case DELETE_VOTE_ERROR:
      var prevState = state.get(action.annotationId)
      var st = prevState.error = undefined;
      var newState = state.set(action.annotationId, st);
      return newState;
      
    default:
      return state;
  }
}

export default annotationItemReducer;
