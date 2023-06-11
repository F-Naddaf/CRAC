<template>
  <div class="w-full h-screen relative overflow-hidden">
    <HomeHeader @video-id="searchedVideoId = $event" />
    <div class="video-wrapper">
      <VideoSection
        @shareClicked="toggleSocialMedia"
        @video-id="handleVideoId"
        :searchedVideoId="searchedVideoId"
        @video-clicked="handleVideoClicked"
      />
    </div>
    <NavBar />
    <div v-if="showSocialMedia">
      <SocialMedia
        :show="showSocialMedia"
        :videoId="currentVideoId"
        @closeClicked="closeSocialMedia"
      />
    </div>
  </div>
</template>

<script>
export default {
name: "SearchPage"
}
</script>

<style>

</style>