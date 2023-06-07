import { reactive } from "vue";

const state = reactive({
  error: null,
  userData: null,
});
const methods = {
  async load() {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const userResponse = await fetch("http://localhost:6500/api/users", {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (userResponse.ok) {
          const result = await userResponse.json();
          state.userData = result.user;
        } else {
          throw new Error("Failed to retrieve user data");
        }
      } catch (error) {
        state.error = error.msg;
      }
    }
  },
  logout() {
    state.userData = null;
    localStorage.clear();
  },
  login(data) {
    state.userData = data;
  },
  updateUser(data) {
    state.userData = data;
  },
};
export default {
  state,
  methods,
};
