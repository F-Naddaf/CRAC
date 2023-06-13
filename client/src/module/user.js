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

  async logout() {
    const token = localStorage.getItem("accessToken");
    const id = state.userData._id;
    try {
      const response = await fetch(
        `http://localhost:6500/api/users/${id}/logout`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActivate: false, id: id }),
        }
      );
      const json = await response.json();
      if (json.success) {
        state.userData = null;
        localStorage.clear();
      }
    } catch (error) {
      state.error = error.message;
    }
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
