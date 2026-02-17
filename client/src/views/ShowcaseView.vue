<template>
  <section class="relative overflow-hidden">
    <div class="absolute inset-x-0 top-0 h-72 bg-gradient-to-r from-primary via-primary/90 to-secondary"></div>
    <div class="absolute -right-16 -top-14 h-56 w-56 rounded-full bg-white/20 blur-3xl"></div>
    <div class="absolute left-10 top-20 h-24 w-24 rounded-full border border-white/30"></div>

    <div class="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pt-14">
      <div class="grid items-start gap-10 lg:grid-cols-2">
        <div class="text-white">
          <p class="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-1 text-xs tracking-[0.2em]">
            <i class="bi bi-stars"></i>
            THEME SHOWCASE
          </p>
          <h1 class="mt-5 max-w-xl text-4xl leading-tight text-white sm:text-5xl">
            FoodPlanner Tailwind Theme Starter
          </h1>
          <p class="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
            Primary and secondary colors are extracted from your reference screenshot. This page showcases Swiper,
            Headless UI, Bootstrap Icons, and Flowbite-style floating labels.
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <button class="btn-primary border border-white/40 bg-white text-primary hover:bg-white/90">
              <i class="bi bi-palette2 mr-2"></i>
              Use This Theme
            </button>
            <button class="btn-secondary border-white/60 bg-transparent text-white hover:bg-white/10">
              <i class="bi bi-sliders mr-2"></i>
              Customize Styles
            </button>
          </div>
        </div>

        <div class="rounded-3xl bg-white/95 p-5 shadow-soft backdrop-blur sm:p-6">
          <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">Swiper quick preview</p>
          <Swiper
            :modules="modules"
            :slides-per-view="1"
            :space-between="14"
            :autoplay="{ delay: 2400, disableOnInteraction: false }"
            :pagination="{ clickable: true }"
            class="showcase-swiper"
          >
            <SwiperSlide v-for="slide in marketingSlides" :key="slide.title">
              <div class="rounded-2xl border border-primary/10 bg-surface p-6">
                <i :class="`bi ${slide.icon}`" class="text-2xl text-primary"></i>
                <h3 class="mt-4 text-2xl">{{ slide.title }}</h3>
                <p class="mt-2 text-sm text-ink/70">{{ slide.caption }}</p>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      <div class="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div class="rounded-3xl bg-white p-6 shadow-soft sm:p-8">
          <div class="mb-8 flex items-center justify-between gap-3">
            <h2 class="text-3xl">Floating Label Form</h2>
            <span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Flowbite style</span>
          </div>

          <form class="space-y-6">
            <div class="relative z-0">
              <input
                id="full_name"
                type="text"
                placeholder=" "
                class="peer block w-full appearance-none border-0 border-b-2 border-primary/25 bg-transparent px-0 pb-2.5 pt-4 text-sm text-ink focus:border-primary focus:outline-none focus:ring-0"
              />
              <label
                for="full_name"
                class="absolute top-3 origin-[0] -translate-y-4 scale-75 transform text-sm text-ink/60 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary"
              >
                Full name
              </label>
            </div>

            <div class="relative z-0">
              <input
                id="email"
                type="email"
                placeholder=" "
                class="peer block w-full appearance-none border-0 border-b-2 border-primary/25 bg-transparent px-0 pb-2.5 pt-4 text-sm text-ink focus:border-primary focus:outline-none focus:ring-0"
              />
              <label
                for="email"
                class="absolute top-3 origin-[0] -translate-y-4 scale-75 transform text-sm text-ink/60 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary"
              >
                Email address
              </label>
            </div>

            <div class="relative z-0">
              <textarea
                id="notes"
                rows="3"
                placeholder=" "
                class="peer block w-full appearance-none border-0 border-b-2 border-primary/25 bg-transparent px-0 pb-2.5 pt-4 text-sm text-ink focus:border-primary focus:outline-none focus:ring-0"
              ></textarea>
              <label
                for="notes"
                class="absolute top-3 origin-[0] -translate-y-4 scale-75 transform text-sm text-ink/60 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary"
              >
                Any meal preferences?
              </label>
            </div>

            <div class="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div>
                <p class="text-sm font-semibold text-ink">Receive weekly planning emails</p>
                <p class="text-xs text-ink/60">Powered by Headless UI switch</p>
              </div>
              <Switch
                v-model="weeklyEmails"
                :class="weeklyEmails ? 'bg-primary' : 'bg-gray-300'"
                class="relative inline-flex h-7 w-12 items-center rounded-full transition"
              >
                <span
                  :class="weeklyEmails ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-5 w-5 transform rounded-full bg-white transition"
                />
              </Switch>
            </div>

            <button type="submit" class="btn-primary w-full sm:w-auto">
              <i class="bi bi-send-check mr-2"></i>
              Submit Sample
            </button>
          </form>
        </div>

        <aside class="space-y-4 rounded-3xl bg-white p-6 shadow-soft sm:p-8">
          <h3 class="text-2xl">Theme Tokens</h3>
          <div class="space-y-3 text-sm text-ink/70">
            <p class="flex items-center gap-3">
              <span class="h-3.5 w-3.5 rounded-full bg-primary"></span>
              Primary: #f83f6b
            </p>
            <p class="flex items-center gap-3">
              <span class="h-3.5 w-3.5 rounded-full bg-secondary"></span>
              Secondary: #f7a083
            </p>
            <p class="flex items-center gap-3">
              <i class="bi bi-type text-primary"></i>
              Body font: Roboto
            </p>
            <p class="flex items-center gap-3">
              <i class="bi bi-fonts text-primary"></i>
              Heading font: Croissant One
            </p>
          </div>

          <div class="rounded-2xl border border-primary/15 bg-surface p-4 text-sm text-ink/75">
            <p class="font-semibold text-ink">Installed extras</p>
            <ul class="mt-3 space-y-2">
              <li><i class="bi bi-check-circle-fill mr-2 text-primary"></i>@headlessui/vue</li>
              <li><i class="bi bi-check-circle-fill mr-2 text-primary"></i>swiper</li>
              <li><i class="bi bi-check-circle-fill mr-2 text-primary"></i>bootstrap-icons</li>
              <li><i class="bi bi-check-circle-fill mr-2 text-primary"></i>flowbite + @tailwindcss/forms</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from '@headlessui/vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const modules = [Autoplay, Pagination]

const weeklyEmails = ref(true)

const marketingSlides = [
  {
    title: 'Plan Meals Faster',
    caption: 'Swipe through structured sections and quickly compose a healthy weekly schedule.',
    icon: 'bi-calendar-week'
  },
  {
    title: 'Save Favorite Recipes',
    caption: 'Use concise cards and visual tags to keep your recipe list clean and easy to scan.',
    icon: 'bi-bookmark-heart'
  },
  {
    title: 'Share With Family',
    caption: 'The same palette and typography scale nicely from desktop to phone-sized screens.',
    icon: 'bi-people'
  }
]
</script>

<style scoped>
:deep(.showcase-swiper .swiper-pagination) {
  position: static;
  margin-top: 1rem;
}

:deep(.showcase-swiper .swiper-pagination-bullet-active) {
  background: #f83f6b;
}
</style>
