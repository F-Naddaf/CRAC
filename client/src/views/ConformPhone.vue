<template>
  <div class="container">
    <div class="card">
      <h1 class="phonePageHeader">Phone</h1>
      <div class="w-full flex flex-col items-center mb-8">
        <div class="inputContainer" id="phone-number">
          <input
            :id="phoneInput.id"
            :type="phoneInput.type"
            :pattern="phoneInput.pattern"
            v-model="phone"
            @input="phoneInputValue = $event.target.value"
            class="text-sm font-medium p-1 m-3 w-full border border-secondary-100 focus:outline-none peer"
            ref="input"
            :class="{ invalid: invalid }"
          />
          <label
            :for="phoneInput.id"
            class="absolute text-sm left-1 top-4 text-gray-400 cursor-text transition-all peer-focus:-top-2 peer-focus:text-primary-200 peer-focus:font-semibold peer-focus:left-1 peer-focus:text-sm"
            :class="{ active: phoneInputValue !== '' }"
            >Phone</label
          >
          <button class="info" @click="phoneToggleInfo">
            <i id="phone-icon" class="fa-solid fa-circle-question"></i>
            <div class="input-info-container" v-show="showPhoneInfo">
              <div class="input-popup-info">
                <p class="infoMessage">
                  Enter your phone number preceded by +31 and without any spaces
                  or other characters. Example: +31612345678
                </p>
              </div>
            </div>
          </button>
        </div>
        <button
          v-if="!send"
          @click="handelPhone"
          :class="[isPhoneValid ? 'enabledButton' : 'disabledButton']"
          :disabled="!isPhoneValid"
        >
          Send
        </button>
        <button v-else class="disabledButton">Done</button>
      </div>
      <span class="lineDivider"></span>
      <div class="w-full flex flex-col items-center mb-2">
        <h1 class="phonePageHeader">Code</h1>
        <div class="inputContainer" id="sms-code">
          <input
            :id="codeInput.id"
            :type="codeInput.type"
            :pattern="codeInput.pattern"
            v-model="code"
            @input="codeInputValue = $event.target.value"
            class="text-sm font-medium p-1 m-3 w-full border border-secondary-100 focus:outline-none peer"
            ref="input"
            :class="{ invalid: invalid }"
          />
          <label
            :for="codeInput.id"
            class="absolute text-sm left-1 top-4 text-gray-400 cursor-text transition-all peer-focus:-top-2 peer-focus:text-primary-200 peer-focus:font-semibold peer-focus:left-1 peer-focus:text-sm"
            :class="{ active: codeInputValue !== '' }"
            >Code</label
          >
          <button class="info" @click="codeToggleInfo">
            <i id="code-icon" class="fa-solid fa-circle-question"></i>
            <div class="input-info-container" v-show="showCodeInfo">
              <div class="input-popup-info">
                <p class="infoMessage">
                  Enter the code you have received via SMS
                </p>
              </div>
            </div>
          </button>
        </div>
        <button
          @click="handelVerify"
          :class="[isCodeValid ? 'enabledButton' : 'disabledButton']"
          :disabled="!isCodeValid"
        >
          Verify
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref, computed, inject, onMounted } from "vue";

export default {
  name: "ConformPhone",
  setup(props) {
    const store = inject("store");
    const userEmail = computed(() => store.state.userData?.email);
    const invalid = false;
    const videoId = ref("");
    const phoneInputValue = "";
    const codeInputValue = "";
    const phoneInput = {
      id: "num1",
      name: "phone",
      type: "text",
      placeholder: "Enter your phone number +31 number",
      pattern: "^[0-9]{12}$",
    };
    const codeInput = {
      id: "num2",
      name: "code",
      type: "text",
      placeholder: "Enter the code you received via SMS ",
      pattern: "^[0-9]{5}$",
    };

    const phone = ref("");
    const code = ref("");
    const showPhoneInfo = ref(false);
    const showCodeInfo = ref(false);
    const send = ref(false);

    const phoneToggleInfo = () => {
      showPhoneInfo.value = !showPhoneInfo.value;
    };

    const codeToggleInfo = () => {
      showCodeInfo.value = !showCodeInfo.value;
    };

    onMounted(() => {
      store.methods.load();
    });

    const closeInfoPopup = (e) => {
      const target = e.target;
      const infoContainer = document.querySelector(".input-popup-info");
      const phone = document.querySelector("#phone-icon");
      const code = document.querySelector("#code-icon");
      if (target !== infoContainer && target !== phone) {
        if (showPhoneInfo.value !== false) {
          showPhoneInfo.value = false;
        }
      }
      if (target !== infoContainer && target !== code) {
        if (showCodeInfo.value !== false) {
          showCodeInfo.value = false;
        }
      }
    };

    onMounted(() => {
      window.addEventListener("click", closeInfoPopup);
    });

    const handelPhone = async () => {
      const token = localStorage.getItem("accessToken");
      if (!send.value) {
        try {
          const response = await fetch(
            "https://crac-server.onrender.com/api/users/phone",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                phone: phone.value,
                email: userEmail.value,
              }),
            }
          );
          const json = await response.json();
          if (json.success) {
            send.value = true;
            localStorage.setItem("serviceId", json.service);
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        return;
      }
    };
    const router = useRouter();
    const handelVerify = async () => {
      const token = localStorage.getItem("accessToken");
      const serviceId = localStorage.getItem("serviceId");
      try {
        const response = await fetch(
          "https://crac-server.onrender.com/api/users/phone/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              code: code.value,
              phone: phone.value,
              serviceSid: serviceId,
            }),
          }
        );
        const json = await response.json();
        if (json.success) {
          localStorage.removeItem("serviceId");
          videoId.value = json.videoId;
          router.push({ name: "HomePage", params: { id: videoId.value } });
        }
      } catch (error) {
        console.error(error);
      }
    };

    const isPhoneValid = computed(() => phone.value.length === 12);
    const isCodeValid = computed(() => code.value.length === 5);

    return {
      phoneInput,
      phoneInputValue,
      codeInputValue,
      invalid,
      codeInput,
      phone,
      code,
      userEmail,
      send,
      videoId,
      handelPhone,
      handelVerify,
      isPhoneValid,
      isCodeValid,
      showPhoneInfo,
      showCodeInfo,
      phoneToggleInfo,
      codeToggleInfo,
      // closeInfoPopup,
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.input-info-container {
  position: absolute;
  width: 90%;
  right: 5px;
  bottom: 48px;
}

.input-popup-info {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: fit-content;
  position: relative;
  background-color: rgb(243, 247, 149);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

.input-popup-info::before {
  content: "";
  position: absolute;
  right: 10px;
  bottom: -6px;
  width: 0;
  height: 0;
  border-right: 12px solid rgb(243, 247, 149);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

.active {
  top: -0.5rem;
  font-size: 0.88rem;
  font-weight: 600;
  left: 0.25rem;
  color: rgb(243 244 246);
}

.info {
  cursor: pointer;
}

.fa-solid {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 18px;
  right: 4px;
  font-size: 16px;
  color: rgb(189, 189, 189);
}
</style>
