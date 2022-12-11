export const initialState = {
  user: null,
};
export const reducer = (state, action) => {
  switch (action.type) {
    case "USER":
      return initialState;
    case "LOGGED_IN":
      return {
        user: action.payload.user,
      };
    case "LOGGED_OUT":
      return {  user :null };

    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload.user,
      };
    default:
      return state; 
  }
};
