<template>
  <div class="w-full flex flex-col items-center">
    <div class="image-container">
      <label for="image-input"
        >Upload your image

        <input
          type="file"
          id="image-input"
          accept="image/png, image/jpg"
          class="bg-secondary-100"
          @change="handleFileName"
        />
      </label>
      <span id="imageName"
        ><p>{{ imageName }}</p></span
      >
    </div>
    <div id="display-image">
      <img
        v-if="displayImage"
        class="uploaded-image"
        ref="image"
        :src="displayImage"
        alt="Selected Image"
      />
    </div>
    <div class="w-60 flex justify-end mt-2 mb-8">
      <button
        class="flex items-center justify-center w-12 py-1 text-xs font-semibold text-gray-300 bg-primary-100 rounded-md"
        type="button"
        @click="handleCrop"
      >
        Crop
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onUnmounted, nextTick, watch, onMounted } from "vue";
import Cropper from "cropperjs";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../firebase.js";
import "firebase/storage";

export default {
  name: "CroppedImage",
  props: {
    id: {
      type: String,
      required: true,
    },
    isCropped: Boolean,
  },
  setup(props, { emit }) {
    const displayImage = ref("");
    const imageName = ref("");
    const croppedImage = ref("");
    const userId = ref("");
    const croppedImageDataURL = ref(null);
    const blob = ref(null);

    let cropperInstance = null;

    const handleFileName = (e) => {
      const inputImage = e.target.files[0];
      imageName.value = `${userId.value}.${inputImage.name.split(".").pop()}`;

      const reader = new FileReader();
      reader.onload = (e) => {
        displayImage.value = reader.result;
        initializeCropper();
      };
      reader.readAsDataURL(inputImage);
    };

    const initializeCropper = () => {
      nextTick(() => {
        const imageElement = document.querySelector(".uploaded-image");
        if (imageElement) {
          imageElement.onload = () => {
            cropperInstance = new Cropper(imageElement, {
              aspectRatio: 1,
              minCropBoxHeight: 120,
              minCropBoxWidth: 120,
              maxCropBoxHeight: 240,
              maxCropBoxWidth: 240,
              viewMode: 1,
              background: false,
              scalable: true,
              zoomable: true,
              cropBoxMovable: true,
              cropBoxResizable: true,
              autoCropArea: 1,
              ready() {
                const cropperFaceElement =
                  this.cropper.cropper.querySelector(".cropper-face");
                const cropperViewBox =
                  this.cropper.cropper.querySelector(".cropper-view-box");
                if (cropperFaceElement && cropperViewBox) {
                  cropperFaceElement.style.borderRadius = "50%";
                  cropperViewBox.style.borderRadius = "50%";
                }
              },
            });
          };
          imageElement.onerror = (error) => {
            console.error("Failed to load image:", error);
          };
        }
      });
    };

    const handleCrop = async () => {
      if (cropperInstance && cropperInstance.cropper) {
        const displayImageContainer = document.querySelector("#display-image");
        const croppedCanvas = cropperInstance.getCroppedCanvas({
          width: 240,
          height: 240,
        });
        if (croppedCanvas) {
          const blob = await new Promise((resolve) => {
            croppedCanvas.toBlob((blob) => {
              resolve(blob);
            }, "image/jpeg");
          });
          const storageReference = storageRef(
            storage,
            `profile/${imageName.value}`
          );
          try {
            await uploadBytes(storageReference, blob);
            const downloadURL = await getDownloadURL(storageReference);
            emit("image-cropped-url", downloadURL);
            displayImageContainer.innerHTML = `<img class="uploaded-image" src="${downloadURL}" alt="Cropped Image">`;
            displayImageContainer.style.overflow = "hidden";
            displayImageContainer.style.display = "block";
            props.isCropped = true;
            emit("image-cropped");
          } catch (error) {
            console.error("Failed to upload image:", error);
          }
        } else {
          console.error("Failed to crop image. Cropped canvas is null.");
        }
      } else {
        console.error("Cropper instance is not initialized.");
      }
    };

    onUnmounted(() => {
      cropperInstance?.destroy();
    });

    watch(displayImage, () => {
      if (displayImage.value) {
        initializeCropper();
      }
    });

    watch(
      () => props.id,
      (newValue) => {
        userId.value = newValue;
      }
    );

    return {
      displayImage,
      userId,
      blob,
      imageName,
      croppedImage,
      handleFileName,
      handleCrop,
    };
  },
};
</script>

<style scoped>
@import "cropperjs/dist/cropper.css";

.image-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 15px;
}

input {
  display: none;
}

label {
  font-size: 14px;
  cursor: pointer;
  justify-self: left;
  background-color: #ba2f74;
  color: #d1d5db;
  padding: 5px 10px;
  border-radius: 6px;
}

#imageName {
  width: 40%;
  overflow: scroll;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#imageName::-webkit-scrollbar {
  width: 0;
}

#imageName p {
  font-size: 14px;
  color: #e67cb1;
  padding-top: 14px;
}

#display-image {
  width: 240px;
  height: 240px;
  border: 1px solid #51555e;
  margin-top: 20px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cropper-container {
  width: 100%;
  height: 100%;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
