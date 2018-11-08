import Cookies from "js-cookie";

const app = {
  state: {
    device: "desktop",
    language: Cookies.get("language") || "en",
    size: Cookies.get("size") || "medium",
    token:"",
    
  },
  mutations: {
    TOGGLE_DEVICE: (state, device) => {
      state.device = device;
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language;
      Cookies.set("language", language);
    },
    SET_SIZE: (state, size) => {
      state.size = size;
      Cookies.set("size", size);
    },
    SET_TOKEN: (state, payload) => {
      state.token = payload;
    },

  },
  actions: {
    toggleDevice({ commit }, device) {
      commit("TOGGLE_DEVICE", device);
    },
    setLanguage({ commit }, language) {
      commit("SET_LANGUAGE", language);
    },
    setSize({ commit }, size) {
      commit("SET_SIZE", size);
    }
  }
};

export default app;
