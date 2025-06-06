<template>
  <footer
    class="max-w-2xl mx-auto text-gray-400 dark:text-gray-600 text-sm text-center pb-8"
  >
    <div class="flex justify-center space-x-6 mb-4">
      <a
        v-for="link in socialLinks"
        :key="link.name"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="link.name"
        :class="link.colorClass"
      >
        <Icon :name="link.icon" />
      </a>
    </div>
    <p>© 2025 Jongtable. All rights reserved.</p>
  </footer>
</template>


<script lang="ts" setup>

interface SocialLink {
  name: string;
  url: string;
  icon: string| typeof LogoLine;
  colorClass: string;
}

const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    url: "https://www.facebook.com",
    icon: "fa-brands:facebook-f",
    colorClass: "hover:text-blue-500",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com",
    icon: "fa-brands:instagram",
    colorClass: "hover:text-pink-500",
  },

];
</script>
