<template>
  <div id="hotspot-popup" class="popup-overlay" ref="popupRef">
    <div class="popup-content">
      <div class="popup-header">
        <h3>Hotspot Configuration</h3>
        <button
          id="close-hotspot-popup"
          class="close-btn"
          title="Close"
          @click="$emit('close')"
        >
          ×
        </button>
      </div>
      <div class="popup-body">
        <div
          id="hotspot-warning"
          class="warning-banner"
          v-if="hotspotWarningVisible"
        >
          <div class="warning-content">
            <Icon name="warning" size="20" />
            <div class="warning-text">
              <strong>Note:</strong> 5GHz hotspot may not work on all devices -
              try 2.4GHz if needed.
            </div>
          </div>
          <button
            id="dismiss-hotspot-warning"
            class="warning-close"
            title="Dismiss warning"
            @click="$emit('dismissHotspotWarning')"
          >
            ×
          </button>
        </div>

        <div class="setting-section">
          <form id="hotspot-form" @submit.prevent>
            <div class="form-group">
              <label for="hotspot-iface">Upstream Interface:</label>
              <select
                id="hotspot-iface"
                :value="hotspotIface"
                @change="$emit('update:hotspotIface', $event.target.value)"
              >
                <option value="">Loading interfaces...</option>
                <option
                  v-for="iface in hotspotIfaces"
                  :key="iface.value"
                  :value="iface.value"
                >
                  {{ iface.label }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="hotspot-ssid">SSID (Hotspot Name):</label>
              <input
                id="hotspot-ssid"
                type="text"
                :value="hotspotSsid"
                @input="$emit('update:hotspotSsid', $event.target.value)"
                placeholder="MyHotspot"
                required
              />
            </div>

            <div class="form-group">
              <label for="hotspot-password">Password:</label>
              <div class="password-input-container">
                <input
                  id="hotspot-password"
                  type="password"
                  :value="hotspotPassword"
                  @input="$emit('update:hotspotPassword', $event.target.value)"
                  placeholder="Min 8 characters"
                  minlength="8"
                  required
                />
                <button
                  type="button"
                  id="toggle-password"
                  class="password-toggle"
                  title="Toggle password visibility"
                  @click="$emit('toggleHotspotPassword')"
                >
                  <Icon name="eye" size="20" />
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="hotspot-band">Band:</label>
              <select
                id="hotspot-band"
                :value="hotspotBand"
                @change="$emit('update:hotspotBand', $event.target.value)"
              >
                <option value="2">2.4GHz</option>
                <option value="5">5GHz</option>
              </select>
            </div>

            <div class="form-group">
              <label for="hotspot-channel">Channel:</label>
              <select
                id="hotspot-channel"
                :value="hotspotChannel"
                @change="$emit('update:hotspotChannel', $event.target.value)"
                required
              >
                <option
                  v-for="c in hotspotChannels"
                  :key="c"
                  :value="String(c)"
                >
                  {{ c }}
                </option>
              </select>
            </div>
          </form>

          <div class="script-actions">
            <button
              id="start-hotspot-btn"
              class="btn"
              @click="$emit('startHotspot')"
            >
              Start Hotspot
            </button>
            <button
              id="stop-hotspot-btn"
              class="btn danger"
              @click="$emit('stopHotspot')"
            >
              Stop Hotspot
            </button>
          </div>

          <p class="hotspot-note">
            * If your interface is not listed, press the Refresh button to
            update the interface list.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Icon from "@/components/Icon.vue";

interface Props {
  hotspotWarningVisible: boolean;
  hotspotIfaces: Array<{ value: string; label: string }>;
  hotspotIface: string;
  hotspotSsid: string;
  hotspotPassword: string;
  hotspotBand: string;
  hotspotChannel: string;
  hotspotChannels: number[];
}

const props = defineProps<Props>();

const popupRef = ref<HTMLElement | null>(null);

defineEmits<{
  close: [];
  dismissHotspotWarning: [];
  "update:hotspotIface": [value: string];
  "update:hotspotSsid": [value: string];
  "update:hotspotPassword": [value: string];
  "update:hotspotBand": [value: string];
  "update:hotspotChannel": [value: string];
  toggleHotspotPassword: [];
  startHotspot: [];
  stopHotspot: [];
}>();
</script>

<style scoped></style>
