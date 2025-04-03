export const initialStore = () => {
  return {
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ],

    auth: {
      token: sessionStorage.getItem('token') || null,
      user: sessionStorage.getItem('user_email') ? {
        id: sessionStorage.getItem('user_id'),
        email: sessionStorage.getItem('user_email')
      } : null,
      isAuthenticated: !!sessionStorage.getItem('token')
    }
  }
}

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    case 'add_task':
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
      
    case 'login':

      sessionStorage.setItem('token', action.payload.token);
      sessionStorage.setItem('user_id', action.payload.user.id);
      sessionStorage.setItem('user_email', action.payload.user.email);
      
      return {
        ...store,
        auth: {
          token: action.payload.token,
          user: action.payload.user,
          isAuthenticated: true
        }
      };
      
    case 'logout':

      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user_id');
      sessionStorage.removeItem('user_email');
      
      return {
        ...store,
        auth: {
          token: null,
          user: null,
          isAuthenticated: false
        }
      };

    default:
      throw Error('Unknown action.');
  }
}