<template>

</template>

<script lang="ts" setup>
const { data: articles } = await useAsyncData("articles-home", () =>
  queryContent("/articles")
    .sort({ published: -1 })
    .limit(3)
    .only(["title", "description", "published", "slug", "_path"])
    .find()
);
</script>
