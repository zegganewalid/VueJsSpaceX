<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { SpaceXService } from '../services/spacexService';
import type { Launch } from '../types/Launch';

const nextLaunch = ref<Launch | null>(null);
const countdown = ref('');
const error = ref<string | null>(null);
let countdownInterval: number | null = null;

const fetchNextLaunch = async () => {
  try {
    error.value = null;
    nextLaunch.value = await SpaceXService.getNextLaunch();
    if (nextLaunch.value) {
      updateCountdown();
    }
  } catch (err) {
    error.value = "Impossible de charger le prochain lancement";
    console.error("Erreur lors du chargement du lancement :", err);
  }
};

const calculateTimeDifference = (targetDate: Date, currentDate: Date) => {
  const difference = targetDate.getTime() - currentDate.getTime();
  const isNegative = difference < 0;
  const absDifference = Math.abs(difference);

  const seconds = Math.floor(absDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(months / 12);

  return {
    years: years,
    months: months % 12,
    days: days % 30,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
    isNegative
  };
};

const formatTimeDifference = (difference: ReturnType<typeof calculateTimeDifference>) => {
  const parts = [];
  const { years, months, days, hours, minutes, seconds, isNegative } = difference;

  if (years > 0) parts.push(`${years}a`);
  if (months > 0) parts.push(`${months}m`);
  if (days > 0) parts.push(`${days}j`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}min`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  const timeString = parts.join(' ');
  return isNegative ? `- ${timeString}` : timeString;
};

const updateCountdown = () => {
  if (!nextLaunch.value?.date_utc) return;

  const launchDate = new Date(nextLaunch.value.date_utc);
  const currentDate = new Date();
  const timeDifference = calculateTimeDifference(launchDate, currentDate);
  
  countdown.value = formatTimeDifference(timeDifference);
};

onMounted(() => {
  fetchNextLaunch();
  countdownInterval = window.setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});

const formattedDate = (date: string) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<template>
  <div class="p-0 bg-gray-800 text-white rounded-lg shadow-lg">
    <div class="flex flex-col items-center justify-center text-center py-4">
      <h2 class="text-3xl font-bold mb-4">Prochain lancement</h2>
      
      <div v-if="nextLaunch" class="mb-4">
        <p class="text-lg text-gray-400 mb-2">
          {{ countdown.startsWith('-') ? 'Temps écoulé depuis le lancement :' : 'Temps restant :' }}
        </p>
        <p class="text-3xl font-bold" :class="countdown.startsWith('-') ? 'text-yellow-400' : 'text-green-400'">
          {{ countdown }}
        </p>
      </div>
    </div>
    
    <div v-if="error" class="text-red-400 my-4 text-center text-xl">
      {{ error }}
    </div>

    <div v-else-if="nextLaunch" class="my-4 flex flex-col items-center space-y-4">
      <div class="space-y-2 text-center">
        <div>
          <h3 class="text-2xl font-semibold text-blue-400">
            {{ nextLaunch.name }}
          </h3>
        </div>

        <div class="text-gray-300 text-lg">
          Date prévue : {{ formattedDate(nextLaunch.date_utc) }}
        </div>
      </div>

      <div v-if="nextLaunch.details" class="mt-4 text-base text-gray-300 text-center px-8 max-w-2xl">
        {{ nextLaunch.details }}
      </div>
    </div>

    <div v-else class="animate-pulse my-4 flex flex-col items-center">
      <div class="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
      <div class="h-6 bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
</template>