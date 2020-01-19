import axios from 'axios';
import {toast} from 'react-toastify';
/**
 * We have hidden axios behind an importable module, if we need to use a different library instead of axios,
 * we can simply just edit this module and export it. The rest of the application won't be affected
 */
axios.interceptors.response.use(null, error => {
    const isExpected = error.response && 
      error.response.status >= 400 && 
      error.response.status < 500;
  
      if(!isExpected){   //Unexpected error, network crash, bugs, db down?
        console.log("Logging the error", error);
        toast.error("An unexpected error occurred)")
      }
        
    //console.log("Interceptor Called")
    return Promise.reject(error) //Passes control back to catch 
  });

  export default{
      get: axios.get,
      post: axios.post,
      put: axios.put,
      delete: axios.delete,
  }