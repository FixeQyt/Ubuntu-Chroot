<template>
  <svg
    v-if="iconData"
    :width="size"
    :height="size"
    :viewBox="iconData.viewBox"
    :class="iconClass"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      v-if="iconData.group"
      :fill="iconData.group.fill"
      :stroke="iconData.group.stroke"
      :stroke-width="iconData.group.strokeWidth"
      :stroke-linecap="iconData.group.strokeLinecap"
      :stroke-linejoin="iconData.group.strokeLinejoin"
    >
      <path v-for="path in iconData.group.paths" :key="path" :d="path" />
      <circle
        v-if="iconData.group.circle"
        :cx="iconData.group.circle.cx"
        :cy="iconData.group.circle.cy"
        :r="iconData.group.circle.r"
      />
    </g>
    <path v-else :d="iconData.path" />
  </svg>
</template>

<script setup lang="ts">
interface IconData {
  viewBox: string;
  path?: string;
  group?: {
    fill?: string;
    stroke?: string;
    strokeWidth?: string;
    strokeLinecap?: string;
    strokeLinejoin?: string;
    paths?: string[];
    circle?: { cx: string; cy: string; r: string };
  };
}

interface Props {
  name: string;
  size?: number;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 18,
});

const iconClass = computed(() => props.class || "");

const icons: Record<string, IconData> = {
  "forward-nat": {
    viewBox: "0 0 24 24",
    path: "M7.77 6.76L6.23 5.48L.82 12l5.41 6.52l1.54-1.28L3.42 12l4.35-5.24zM7 13h2v-2H7v2zm10-2h-2v2h2v-2zm-6 2h2v-2h-2v2zm6.77-7.52l-1.54 1.28L20.58 12l-4.35 5.24l1.54 1.28L23.18 12l-5.41-6.52z",
  },
  hotspot: {
    viewBox: "0 0 24 24",
    group: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      paths: [
        "M4 20.001A9.96 9.96 0 0 1 2 14C2 8.477 6.477 4 12 4s10 4.477 10 10c0 2.252-.744 4.33-2 6.001",
        "M7.528 18a6 6 0 1 1 8.944 0",
      ],
      circle: { cx: "12", cy: "14", r: "2" },
    },
  },
  settings: {
    viewBox: "0 0 24 24",
    group: {
      fill: "currentColor",
      paths: [
        "M5 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4z",
        "M12 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4z",
        "M19 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4z",
      ],
    },
  },
  sun: {
    viewBox: "0 0 24 24",
    group: {
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      paths: [
        "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41",
      ],
      circle: { cx: "12", cy: "12", r: "4" },
    },
  },
  moon: {
    viewBox: "0 0 24 24",
    path: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
    group: {
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      paths: ["M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"],
    },
  },
  warning: {
    viewBox: "0 0 16 16",
    path: "M8.429 2.746a.5.5 0 0 0-.858 0L1.58 12.743a.5.5 0 0 0 .429.757h11.984a.5.5 0 0 0 .43-.757L8.428 2.746Zm-2.144-.77C7.06.68 8.939.68 9.715 1.975l5.993 9.996c.799 1.333-.161 3.028-1.716 3.028H2.008C.453 15-.507 13.305.292 11.972l5.993-9.997ZM9 11.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0Zm-.25-5.75a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0v-3Z",
  },
  eye: {
    viewBox: "0 0 24 24",
    group: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      paths: [
        "M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z",
      ],
      circle: { cx: "12", cy: "12", r: "3" },
    },
  },
  github: {
    viewBox: "0 0 432 416",
    path: "M213.5 0q88.5 0 151 62.5T427 213q0 70-41 125.5T281 416q-14 2-14-11v-58q0-27-15-40q44-5 70.5-27t26.5-77q0-34-22-58q11-26-2-57q-18-5-58 22q-26-7-54-7t-53 7q-18-12-32.5-17.5T107 88h-6q-12 31-2 57q-22 24-22 58q0 55 27 77t70 27q-11 10-13 29q-42 18-62-18q-12-20-33-22q-2 0-4.5.5t-5 3.5t8.5 9q14 7 23 31q1 2 2 4.5t6.5 9.5t13 10.5T130 371t30-2v36q0 13-14 11q-64-22-105-77.5T0 213q0-88 62.5-150.5T213.5 0z",
  },
  copy: {
    viewBox: "0 0 24 24",
    group: {
      fill: "none",
      stroke: "var(--muted)",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      paths: [
        "M8 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z",
        "M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2",
      ],
    },
  },
};

const iconData = computed(() => icons[props.name]);
</script>

<style scoped>
/* Styles are global */
</style>
