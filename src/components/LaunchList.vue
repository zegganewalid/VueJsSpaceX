<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import type { Launch } from '../types/Launch';
const launches = ref<Launch[]>([]);
const filter = ref<"all" | "success" | "failed">("all");
const emits = defineEmits(['launch-selected']);
const fetchLaunches = async () => {
  try {
    const response = await axios.get("https://api.spacexdata.com/v5/launches/past");
    launches.value = response.data;
    console.log('Launches fetched:', launches.value);
  } catch (error) {
    console.error("Erreur lors du chargement des lancements :", error);
  }
};
const filteredLaunches = computed(() => {
  const filtered = launches.value.filter(launch => {
    if (filter.value === "success") return launch.success;
    if (filter.value === "failed") return !launch.success;
    return true;
  });
 
  filtered.sort((a, b) =>
    new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime()
  );
 
  return filtered.slice(0, 10);
});
onMounted(fetchLaunches);
</script>
<template>
  <div class="p-8 bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-full">
    <h2 class="text-3xl font-bold mb-6">Derniers lancements</h2>
   
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between">
      <select v-model="filter" class="p-3 bg-gray-700 text-white rounded-md w-full md:w-64 text-lg">
        <option value="all">Tous les lancements</option>
        <option value="success">Lancements réussis</option>
        <option value="failed">Lancements échoués</option>
      </select>
      <p class="mt-3 md:mt-0 md:ml-4 text-gray-400 text-base">
        Affichage des 10 derniers lancements {{ filter === 'all' ? '' : filter === 'success' ? 'réussis' : 'échoués' }}
      </p>
    </div>

    <ul class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
      <li v-for="launch in filteredLaunches"
          :key="launch.id"
          class="p-6 bg-gray-700 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl shadow-lg h-full hover:z-10">
        <div class="flex flex-col h-full">
          <div class="flex flex-col mb-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-semibold text-blue-300 truncate max-w-3/4" :title="launch.name">{{ launch.name }}</h3>
              <span 
                :class="[
                  'px-3 py-1 text-sm font-medium rounded-full ml-2',
                  launch.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                ]"
              >
                {{ launch.success ? "Succès" : "Échec" }}
              </span>
            </div>
            <div class="text-base text-gray-400 flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ new Date(launch.date_utc).toLocaleDateString('fr-FR') }}
            </div>
            <p class="text-base text-gray-300 line-clamp-3 mb-6" v-if="launch.details">
              {{ launch.details || "Aucun détail disponible" }}
            </p>
            <p class="text-base text-gray-300 line-clamp-3 mb-6" v-else>
              Lancement de la mission {{ launch.name }} par SpaceX.
            </p>
          </div>
          <div class="mt-auto">
            <button
              @click="emits('launch-selected', launch)"
              class="w-full p-4 bg-blue-900 hover:bg-blue-800 transition-colors rounded-md text-white text-base font-medium flex items-center justify-center gap-2"
              style="background-color: #1e3a8a !important; color: white !important;"
            >
              <span>Plus d'informations</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </li>
    </ul>
   
    <p v-if="filteredLaunches.length === 0" class="mt-6 text-gray-400 text-center text-lg">
      Aucun lancement trouvé pour ce filtre
    </p>
  </div>
</template>