<template>
  <div 
    class="flex flex-col justify-center items-center text-center bg-base-200 p-4"
    data-testid="404-container"
  >
    <img
      v-if="gifs[currentIndex]"
      :src="gifs[currentIndex]"
      alt="A funny gif representing a 404 error"
      class="w-full max-w-xs sm:max-w-md rounded-lg shadow-lg mb-4"
    />
    <h1 class="text-2xl sm:text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <p class="text-base sm:text-lg mb-6">{{ messages[currentIndex] }}</p>
    <div class="flex flex-col sm:flex-row gap-4 w-full justify-center">
      <router-link to="/" class="btn btn-primary w-full sm:w-auto" aria-label="Return to the homepage">
        Go back Home
      </router-link>
      <button class="btn btn-secondary w-full sm:w-auto" @click="handleNextMeme" aria-label="Show next meme">
        Next Meme
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Props {
  initialIndex?: number;
}

const props = defineProps<Props>();

const messages = [
  "Looks like the code broke... again.",
  "This is not the page you're looking for.",
  "Headshot! Try another page.",
  "Follow the white rabbit... to the right page.",
  "Did I stutter? The page is not here.",
  "Carjacked by a bird. Try another page.",
  "Your power level is way too low to find this page.",
  "Your mobile suit is out of commission. Try again later.",
  "You can't find the page if you're always out of fuel, cowboy.",
  "Looks like your Pokédex didn't have this page in it.",
  "You failed to bring balance to the page.",
  "You can't hide in the vents forever. Try another page.",
  "Let's just pretend you're on a different page.",
  "Thanos snapped... and so did this page.",
  "You took a wrong turn. Maybe try a magic carpet ride back?",
  "Bad boys, bad boys, whatcha gonna do? Not find this page, apparently.",
  "This feels like the basement circle... you're going nowhere.",
  "Survey says... Nope! This page doesn't exist.",
  "You have failed me for the last time, page.",
  "Meme failed to load. Please refresh the joke.",
  "Oops, did you forget your semicolon?",
  "Your lightsaber can't cut through this error.",
  "That wasn't a clutch move. No page here.",
  "Never gonna give you up, never gonna let you down... but this page will.",
  "Open sesame! Open... says a me? No, that's not right.",
  "Five stars? You're still not getting in."
];

const gifs = [
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGZmamRkbmkzM292OHdramZ4eHhhdjdvajN4NHMwdzRiMGtwMnFzNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bGgsc5mWoryfgKBx1u/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3Z4aXp1anhqcWE2YWZwcHExenZ0Zzgxamgxczh1bnp5aXdtcWszYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l2JJKs3I69qfaQleE/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjg1NGprbWkzb3hueWg1NXNrZm9ocGJ3NGp0NXJkdTh6YThlOXpjZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3N2ML3tw4c4uc/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGJ1MWpua2dkZzVjczNiM29oOWVqZXd1dnpsbm5uZDlhNWxxNWtteiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WoD6JZnwap6s8/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHZhZjhhYzNuZjBucml6emhrbmxtcTJ5dm9tZzdtajYza3JhN2FoOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/O1oJ840fg6uOVCqdzJ/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXFweGJpYnIzMXNsb3I3dmkweXk1bnUxODV1dGdqd2c3OGtnYXZpMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEduGzkdvam26MrXG/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWY2YjQxdXduOTM5NW1idTl3YzBrbHM0c2RyaHI0bnQ5dGMzaGdvcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3bCcznICb8rls1gXbI/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnBsamJvaHk5YXE2MjNpYXM4Z2ZodmY0Mno5bmRzYTl1YnUzaHhqbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Scbrh2Q1Iyby8/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3hid3A0em43Z3I1eXp6Z3J3djRubTNianVkZzh0cWp3cHNibmViaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/10VjiVoa9rWC4M/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnk2azYwcGprbjA0amUzeDl1MDhsYnVoaGFzNXdtNGU3NHByaDNlcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/U2nN0ridM4lXy/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeTRqdWwwZThrZ21mb2dvN3hiZzg5cWU5aWl0MjExN2g5YTdyamlyYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d2W7eZX5z62ziqdi/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHpqNHJkMGtid2htdmFhNnUwYXh2NHl2dWExYXlmMmNkMmJxOTBpZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/piXntYKCU1PNu/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXVqeGRscWc3Y2IwMGkwaXhpZjZzM2NsZzd4YmNvdWplNnk5bm5icSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/a93jwI0wkWTQs/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExemV0NjQ4bnJyb2loZzBhcjkwNDkzcTlpMXRydjNwcmo1NDVnZms2NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LOoaJ2lbqmduxOaZpS/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDBtOXhmbnp2aXVjcXNhcjBzNDR5Zm9vZXY4YXJkcDliMHFtNWo2aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/rE7A6JKy0H1Yc/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDRmc28yYmlveG84aHQ3MmlrZHh6aXd6Zm1xbnh6NGo2MjlieGI4OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26gsgWH4lnurglMWY/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDNybGU4ZjB3djBxOGFydXpuZXgzOGdhNmg1b2poZzNhcG43NWJwbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qyMkaC3zF16lOd0oxI/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3M4MzhsMDhwZHQzdnYyZnllZGszdGQ0Y2MyN3doNXUwa2h0ZWJ6bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QRgmRWkb274nn1mSIz/giphy-downsized-large.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXN1MnkxeDZoeHdubG9nZHQzd2dwMnVuN242Y2VheTM2Z2lucmI3OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohuPwtVfPsxaMp0QM/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExampzdm1nb2V3ajIwYWVmMDk2NjkyN2Z2aml3bml4YmVnZWJtYzMyaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UNA84TjetG9eML5uiM/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXB0ZzYwa245d2sweDY2eWxnbTJvMzdpOHU0cWJ6c3Rud3ZpejRucSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/rl2eCbijibzoY/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnpid2w1a29rZnhoeG5tNHVtOWxyNDdhOTF5cW11b243a2QwZjhibiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JozEVGrpVUoOB3r4cD/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2MxYjhobTZkZHMwOG53MXJmeWdxa2ltZG5ydmV6YzQ0dHMyYjM5ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26FmQBWmin4uIYUak/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM29sdWlqb2E0ZnV1azJkcnVtaW9wdHE3czN2dmp0NGsxaXR4Z3EyNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ju7l5y9osyymQ/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2g1Mm5kcnk0bGFoNnNzdWlqYmFxaW53YmhpN2w5NDM2bmlpczg3ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/owRSsSHHoVYFa/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnc3ODkybTNhZGo0NDNldms0N2F5YjY2cjZjOTRmN2YyamYyMXZqMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/48LX0GTHQc68oIFEIY/giphy.gif'
];

const currentIndex = ref(props.initialIndex ?? Math.floor(Math.random() * messages.length));

onMounted(() => {
  const randomIndex = Math.floor(Math.random() * messages.length);
  currentIndex.value = randomIndex;
});

const handleNextMeme = () => {
  currentIndex.value = (currentIndex.value + 1) % messages.length;
};
</script>

