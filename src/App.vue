<script setup lang="ts">
import { ref } from "vue";
import NextLaunch from "./components/NextLaunch.vue";
import LaunchList from "./components/LaunchList.vue";
import LaunchModal from "./components/LaunchModal.vue";
import type { Launch } from "./types/Launch";

const selectedLaunch = ref<Launch | null>(null);

const handleLaunchSelected = (launch: Launch) => {
  console.log('Launch selected:', launch);
  selectedLaunch.value = launch;
};

const closeModal = () => {
  selectedLaunch.value = null;
};
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white w-full max-w-full pb-0">
    <h1 class="text-4xl font-bold text-center py-8">SpaceX Dashboard</h1>
    
    <div class="container mx-auto px-4 w-full max-w-full pb-0">
      <section class="mb-8">
        <NextLaunch />
      </section>

      <section class="mb-0">
        <LaunchList @launch-selected="handleLaunchSelected" />
      </section>
    </div>

    <LaunchModal 
      v-if="selectedLaunch" 
      :launch="selectedLaunch" 
      @close="closeModal" 
    />
  </div>
</template>