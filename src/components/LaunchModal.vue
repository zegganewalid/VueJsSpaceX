<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Launch } from '../types/Launch';

const props = defineProps<{
  launch: Launch | null
}>();

const showVideo = ref(false);

const getYoutubeId = (url: string) => {
  if (!url) return null;
  
  if (url.length === 11) return url;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11)
    ? match[2]
    : null;
};

const videoUrl = computed(() => {
  if (!props.launch?.links.webcast) return null;
  const videoId = getYoutubeId(props.launch.links.webcast);
  const url = videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  console.log('Video URL:', url);
  return url;
});

watch(() => props.launch, (newValue) => {
  if (newValue) {
    console.log('Webcast URL:', newValue.links.webcast);
  }
}, { immediate: true });

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });
};

defineEmits(['close']);
</script>

<template>
  <div v-if="launch" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
    <div class="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">

      <div class="p-6 border-b border-gray-700 relative">
        <h2 class="text-2xl font-bold text-white text-center">{{ launch.name }}</h2>
        <button 
          @click="$emit('close')"
          class="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-700/50 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-6 flex flex-col items-center">
        <div v-if="launch.links.patch.small" class="flex justify-center w-full">
          <img 
            :src="launch.links.patch.small" 
            :alt="launch.name"
            class="rounded-lg max-w-[300px]"
          >
        </div>

        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-400">Date de lancement</h3>
          <p class="mt-1 text-white text-lg">{{ formatDate(launch.date_utc) }}</p>
        </div>

        <div v-if="launch.details" class="text-center max-w-2xl">
          <h3 class="text-lg font-medium text-gray-400">Détails de la mission</h3>
          <p class="mt-1 text-white text-lg">{{ launch.details }}</p>
        </div>

        <div v-if="launch.links.article" class="text-center">
          <h3 class="text-lg font-medium text-gray-400">Article de présentation</h3>
          <a 
            :href="launch.links.article"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-1 text-blue-400 hover:text-blue-300 inline-flex items-center text-lg"
          >
            Lire l'article
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
              />
            </svg>
          </a>
        </div>

        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-400">Lieu de lancement</h3>
          <p class="mt-1 text-white text-lg">{{ launch.launchpad }}</p>
        </div>

        <div v-if="launch.payloads && launch.payloads.length > 0" class="text-center">
          <h3 class="text-lg font-medium text-gray-400">Chargements (Payloads)</h3>
          <ul class="mt-1 list-none text-white text-lg">
            <li v-for="payload in launch.payloads" :key="payload">
              {{ payload }}
            </li>
          </ul>
        </div>

        <div v-if="launch.customers && launch.customers.length > 0" class="text-center">
          <h3 class="text-lg font-medium text-gray-400">Clients</h3>
          <ul class="mt-1 list-none text-white text-lg">
            <li v-for="customer in launch.customers" :key="customer">
              {{ customer }}
            </li>
          </ul>
        </div>
      </div>

      <div v-if="videoUrl" class="px-6 pb-6">
        <label class="flex items-center">
          <input 
            type="checkbox"
            v-model="showVideo"
            class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
          >
          <span class="ml-2 text-white text-lg">Afficher la vidéo de la mission</span>
        </label>
        
        <div v-if="showVideo" class="mt-4 w-full">
          <iframe
            :src="videoUrl"
            class="w-full aspect-video rounded-lg"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>

      <div class="p-6 border-t border-gray-700">
        <button 
          @click="$emit('close')"
          class="w-full px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
          style="background-color: #991b1b !important; color: white !important;"
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>
