import axios from "axios";

/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
*/

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  withCredentials: true,

  timeout: 30000,

  headers: {
    "Content-Type": "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
  (config) => {
    console.log(
      `[API] ${config.method?.toUpperCase()} ${config.url}`,
    );

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    /*
    --------------------------------------------------------------------------
    | No Response (Network Error)
    --------------------------------------------------------------------------
    */

    if (!error.response) {
      console.error("Network Error:", error.message);

      return Promise.reject(
        new Error(
          "Unable to reach server. Please check your internet connection.",
        ),
      );
    }

    /*
    --------------------------------------------------------------------------
    | Authentication
    --------------------------------------------------------------------------
    */

    if (error.response.status === 401) {
      console.error("Unauthorized");

      window.location.href = "/login";
    }

    /*
    --------------------------------------------------------------------------
    | Forbidden
    --------------------------------------------------------------------------
    */

    if (error.response.status === 403) {
      console.error("Access denied");
    }

    /*
    --------------------------------------------------------------------------
    | Server Error
    --------------------------------------------------------------------------
    */

    if (error.response.status >= 500) {
      console.error("Server Error");
    }

    return Promise.reject(error);
  },
);
