<template>
  <div id="settings-popup" class="popup-overlay" ref="popupRef">
    <div class="popup-content">
      <div class="popup-header">
        <h3>Options</h3>
        <button
          id="close-popup"
          class="close-btn"
          title="Close"
          @click="$emit('close')"
        >
          ×
        </button>
      </div>
      <div class="popup-body">
        <div class="setting-section">
          <h4>Post-exec Script</h4>
          <p class="setting-desc">Commands to run after chroot starts</p>
          <textarea
            id="post-exec-script"
            class="script-editor"
            :value="postExecScript"
            :readonly="disabled"
            @input="$emit('update:postExecScript', $event.target.value)"
            placeholder="echo 'Chroot started successfully'\n# Add your commands here"
            rows="6"
          ></textarea>
          <div class="script-actions">
            <button
              id="save-script"
              class="btn small"
              :disabled="disabled"
              @click="$emit('savePostExecScript')"
            >
              Save
            </button>
            <button
              id="clear-script"
              class="btn outline small"
              :disabled="disabled"
              @click="$emit('clearPostExecScript')"
            >
              Clear
            </button>
          </div>
        </div>

        <div class="setting-section">
          <h4>Update Chroot</h4>
          <p class="setting-desc">
            Apply incremental updates to the chroot environment
          </p>
          <button
            id="update-btn"
            class="btn"
            :disabled="disabled"
            @click="$emit('updateChroot')"
          >
            Update Chroot
          </button>
        </div>

        <div class="setting-section">
          <h4>Backup & Restore</h4>
          <p class="setting-desc">
            Create backups of your chroot environment or restore from previous
            backups
          </p>
          <div class="script-actions">
            <button
              id="backup-btn"
              class="btn"
              :disabled="disabled"
              @click="$emit('backupChroot')"
            >
              Backup Chroot
            </button>
            <button
              id="restore-btn"
              class="btn danger"
              :disabled="disabled"
              @click="$emit('restoreChroot')"
            >
              Restore Chroot
            </button>
          </div>
        </div>

        <div class="setting-section danger-zone-section" tabindex="0">
          <h4>Danger Zone</h4>
          <p class="setting-desc">Permanently remove the chroot environment</p>
          <button
            id="uninstall-btn"
            class="btn danger"
            :disabled="disabled"
            @click="$emit('uninstallChroot')"
          >
            Uninstall Chroot
          </button>
        </div>

        <details class="setting-section optional-section" tabindex="0">
          <summary class="optional-toggle">
            <h4>Optional</h4>
          </summary>
          <p class="setting-desc">
            <br />Additional options for advanced users
          </p>

          <div class="setting-subsection">
            <h5>Debug Mode</h5>
            <p class="setting-desc">
              Enable detailed logging for troubleshooting. Logs will be saved to
              /data/logs/ubuntu-chroot/logs
            </p>
            <p class="setting-desc debug-warning-text">
              <Icon name="warning" size="16" class="icon-inline-right" />
              ENABLE THIS ONLY WHEN ABSOLUTE NECESSARY. MAY CAUSE ISSUES IN SOME
              TOOLS LIKE DOCKER
            </p>
            <div class="form-row">
              <label class="row-label row-label-no-margin"
                >Enable debug logging:</label
              >
              <label class="toggle-inline">
                <input
                  id="debug-toggle"
                  type="checkbox"
                  :checked="debugMode"
                  :disabled="disabled"
                  @change="
                    $emit(
                      'update:debugMode',
                      ($event.target as HTMLInputElement).checked,
                    )
                  "
                />
                <span>Enable</span>
              </label>
            </div>
          </div>

          <div class="setting-subsection">
            <h5>Optimize Android for Chroot</h5>
            <p class="setting-desc">
              Disable Android Doze and phantom process killing to keep chroot
              processes alive in the background
            </p>
            <div class="form-row">
              <label class="row-label row-label-no-margin"
                >Optimize Android for Chroot by disabling doze and phantom
                process killing:</label
              >
              <label class="toggle-inline">
                <input
                  id="android-optimize-toggle"
                  type="checkbox"
                  :checked="androidOptimize"
                  :disabled="disabled"
                  @change="
                    $emit(
                      'update:androidOptimize',
                      ($event.target as HTMLInputElement).checked,
                    )
                  "
                />
                <span>Enable</span>
              </label>
            </div>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Icon from "@/components/Icon.vue";

interface Props {
  postExecScript: string;
  debugMode: boolean;
  androidOptimize: boolean;
  disabled: boolean;
}

const props = defineProps<Props>();

const popupRef = ref<HTMLElement | null>(null);

defineEmits<{
  close: [];
  "update:postExecScript": [value: string];
  "update:debugMode": [value: boolean];
  "update:androidOptimize": [value: boolean];
  savePostExecScript: [];
  clearPostExecScript: [];
  updateChroot: [];
  backupChroot: [];
  restoreChroot: [];
  uninstallChroot: [];
}>();
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
}

.popup-overlay.active {
  opacity: 1;
  visibility: visible;
}

.popup-content {
  background: var(--card);
  border-radius: var(--surface-radius);
  box-shadow: 0 6px 20px rgba(6, 8, 14, 0.06);
  width: 95%;
  max-width: 600px;
  max-height: 85vh;
  overflow-y: auto;
  transform: scale(0.95) translateY(-10px);
  transition: transform 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

[data-theme="dark"] .popup-content {
  border-color: rgba(255, 255, 255, 0.08);
}

.popup-overlay.active .popup-content {
  transform: scale(1) translateY(0);
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: var(--surface-radius) var(--surface-radius) 0 0;
}

[data-theme="dark"] .popup-header {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.popup-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
}

.close-btn {
  background: transparent;
  border: 1px solid rgba(15, 23, 32, 0.08);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: var(--text);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 18px;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

[data-theme="dark"] .close-btn {
  border-color: rgba(255, 255, 255, 0.08);
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: rotate(90deg);
}

[data-theme="dark"] .close-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.popup-body {
  padding: 24px;
}

.setting-section {
  margin-bottom: 24px;
  padding: 20px;
  background: var(--card);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: var(--surface-radius);
  transition: border-color 0.2s ease;
}

[data-theme="dark"] .setting-section {
  border-color: rgba(255, 255, 255, 0.08);
}

.setting-section:hover {
  border-color: var(--accent);
}

.setting-section:last-child {
  margin-bottom: 0;
  border-color: rgba(220, 38, 38, 0.2);
}

.danger-zone-section {
  border-color: rgba(220, 38, 38, 0.2) !important;
}

.danger-zone-section:hover {
  border-color: var(--danger) !important;
}

.danger-zone-section:focus,
.danger-zone-section:focus-within {
  outline: none;
  border-color: var(--danger) !important;
}

[data-theme="dark"] .danger-zone-section {
  border-color: rgba(251, 113, 133, 0.2) !important;
}

[data-theme="dark"] .danger-zone-section:hover {
  border-color: var(--danger) !important;
}

[data-theme="dark"] .danger-zone-section:focus,
[data-theme="dark"] .danger-zone-section:focus-within {
  outline: none;
  border-color: var(--danger) !important;
}

.setting-section h4 {
  margin: 0 0 6px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}

.setting-desc {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: var(--muted);
  line-height: 1.5;
}

.script-editor {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background: var(--card);
  color: var(--text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  font-size: 13px;
  line-height: 1.5;
  resize: none;
  transition: border-color 0.2s ease;
  min-height: 120px;
}

[data-theme="dark"] .script-editor {
  background: var(--card);
  border-color: rgba(255, 255, 255, 0.08);
}

.script-editor:focus {
  outline: none;
  border-color: var(--accent);
}

.script-editor::placeholder {
  color: var(--muted);
  font-style: normal;
}

.script-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.script-actions .btn {
  flex: 1;
  min-width: 0;
}

.script-actions .btn.danger {
  background: var(--danger) !important;
  color: white !important;
  border: 1px solid var(--danger) !important;
}

.setting-section > .btn {
  width: 50%;
  box-sizing: border-box;
}

.btn.danger {
  background: var(--danger);
  color: white;
  border: 1px solid var(--danger);
  box-shadow: none !important;
}

.btn.danger:hover:not([disabled]):not(.btn-pressed):not(.btn-released) {
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3) !important;
  background: #b91c1c;
  border-color: #b91c1c;
}

.btn.danger:not(:hover):not(.btn-pressed):not(.btn-released) {
  box-shadow: none !important;
}

[data-theme="dark"] .btn.danger {
  background: var(--danger);
  border-color: var(--danger);
  box-shadow: none !important;
}

[data-theme="dark"]
  .btn.danger:hover:not([disabled]):not(.btn-pressed):not(.btn-released) {
  background: #dc2626;
  border-color: #dc2626;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3) !important;
}

[data-theme="dark"]
  .btn.danger:not(:hover):not(.btn-pressed):not(.btn-released) {
  box-shadow: none !important;
}

.optional-section {
  border-color: rgba(220, 38, 38, 0.2) !important;
}

.optional-section:hover {
  border-color: var(--danger) !important;
}

.optional-section:focus,
.optional-section:focus-within {
  outline: none;
  border-color: var(--danger) !important;
}

[data-theme="dark"] .optional-section {
  border-color: rgba(251, 113, 133, 0.2) !important;
}

[data-theme="dark"] .optional-section:hover {
  border-color: var(--danger) !important;
}

[data-theme="dark"] .optional-section:focus,
[data-theme="dark"] .optional-section:focus-within {
  outline: none;
  border-color: var(--danger) !important;
}

.optional-toggle {
  cursor: pointer;
  list-style: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.optional-toggle::-webkit-details-marker {
  display: none;
}

.optional-toggle::after {
  content: "▶";
  float: right;
  transform: rotate(0deg);
  transition: transform 0.2s ease;
  font-size: 14px;
  color: var(--muted);
}

.optional-section[open] .optional-toggle::after {
  transform: rotate(90deg);
}

.optional-toggle h4 {
  display: inline;
  margin-right: 8px;
}

.setting-subsection {
  margin-top: 16px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

[data-theme="dark"] .setting-subsection {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.06);
}

.setting-subsection h5 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.debug-warning-text {
  color: #ff6b6b;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.85em;
  margin-top: 8px;
}

[data-theme="dark"] .debug-warning-text {
  color: #fb7185;
}

.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.row-label {
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
}

.row-label-no-margin {
  margin: 0;
}

.toggle-inline {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
}

.icon-inline-right {
  vertical-align: middle;
  margin-right: 6px;
}

.btn {
  background: var(--accent);
  color: white;
  border: 0;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  box-shadow: none;
}

.btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn {
  transition:
    transform 0.12s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.12s cubic-bezier(0.4, 0, 0.2, 1),
    background 0.15s ease,
    border-color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  box-shadow: none;
  transform: none;
  will-change: transform, box-shadow;
}

.btn:active,
.btn:focus {
  transform: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.btn:active {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

.btn:not(:focus):not(.btn-pressed):not(.btn-released) {
  -webkit-tap-highlight-color: transparent;
}

.btn[disabled] {
  box-shadow: none !important;
  transform: none !important;
  cursor: not-allowed;
}

.btn[disabled]:hover {
  box-shadow: none !important;
  transform: none !important;
}

.btn.btn-pressed {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
  transform: scale(0.97) !important;
}

.btn.btn-released {
  box-shadow: none !important;
  transform: none !important;
}

.btn:hover:not([disabled]):not(.btn-pressed):not(.btn-released) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-1px) !important;
}

.btn:not(.btn-pressed):not(.btn-released):not(:hover):not([disabled]) {
  box-shadow: none !important;
  transform: none !important;
}

.btn.warning {
  background: #f59e0b !important;
  color: #92400e !important;
  border: 1px solid #f59e0b !important;
  font-weight: 600 !important;
  box-shadow: none !important;
}

.btn.warning:hover:not([disabled]):not(.btn-pressed):not(.btn-released) {
  background: #d97706 !important;
  border-color: #d97706 !important;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4) !important;
  transform: translateY(-1px) !important;
}

.btn.warning:not(:hover):not(.btn-pressed):not(.btn-released) {
  box-shadow: none !important;
}

[data-theme="dark"] .btn.warning {
  background: #f59e0b;
  border-color: #f59e0b;
  color: #92400e;
}

[data-theme="dark"] .btn.warning:hover {
  background: #d97706;
  border-color: #d97706;
}

.experimental-section {
  border-color: rgba(245, 158, 11, 0.3) !important;
  background: linear-gradient(
    135deg,
    rgba(245, 158, 11, 0.05),
    rgba(245, 158, 11, 0.02)
  );
}

.experimental-section:hover {
  border-color: rgba(245, 158, 11, 0.5) !important;
}

.experimental-section:focus,
.experimental-section:focus-within {
  outline: none;
  border-color: #f59e0b !important;
}

[data-theme="dark"] .experimental-section {
  border-color: rgba(251, 191, 36, 0.3) !important;
}

[data-theme="dark"] .experimental-section:hover {
  border-color: rgba(251, 191, 36, 0.5) !important;
}

[data-theme="dark"] .experimental-section:focus,
[data-theme="dark"] .experimental-section:focus-within {
  outline: none;
  border-color: #fbbf24 !important;
}

.experimental-toggle {
  cursor: pointer;
  list-style: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.experimental-toggle::-webkit-details-marker {
  display: none;
}

.experimental-toggle::after {
  content: "▶";
  float: right;
  transform: rotate(0deg);
  transition: transform 0.2s ease;
  font-size: 14px;
  color: var(--muted);
}

.experimental-section[open] .experimental-toggle::after {
  transform: rotate(90deg);
}

.experimental-toggle h4 {
  display: inline;
  margin-right: 8px;
}

.warning-banner {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: var(--surface-radius);
  padding: 16px;
  margin-bottom: 20px;
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

[data-theme="dark"] .warning-banner {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
}

.warning-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex: 1;
}

.warning-content svg {
  color: #f59e0b;
  flex-shrink: 0;
  margin-top: 1px;
}

.warning-text {
  font-size: 14px;
  line-height: 1.5;
  color: #92400e;
  margin: 0;
}

[data-theme="dark"] .warning-text {
  color: #fbbf24;
}

.warning-close {
  background: transparent;
  border: 1px solid rgba(146, 64, 14, 0.3);
  width: 24px;
  height: 24px;
  border-radius: 4px;
  color: #92400e;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s ease;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  user-select: none;
}

[data-theme="dark"] .warning-close {
  border-color: rgba(251, 191, 36, 0.3);
  color: #fbbf24;
}

.warning-close:hover {
  background: rgba(146, 64, 14, 0.1);
  transform: scale(1.1);
}

[data-theme="dark"] .warning-close:hover {
  background: rgba(251, 191, 36, 0.1);
}

.warning-banner.hidden {
  display: none;
}

.storage-info-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  background: transparent;
}

.storage-info-table tbody tr {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

[data-theme="dark"] .storage-info-table tbody tr {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.storage-info-table tbody tr:last-child {
  border-bottom: none;
}

.storage-info-table td {
  padding: 12px 16px;
  vertical-align: middle;
  font-size: 14px;
  line-height: 1.4;
}

.storage-label {
  font-weight: 500;
  color: var(--text);
  width: 60%;
  padding-right: 12px;
}

.storage-value {
  color: var(--muted);
  text-align: right;
  font-weight: 600;
  width: 40%;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: var(--text);
}

.form-group input,
.form-group select {
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background: var(--card);
  color: var(--text);
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

[data-theme="dark"] .form-group input,
[data-theme="dark"] .form-group select {
  border-color: rgba(255, 255, 255, 0.08);
}

[data-theme="dark"] .form-group input:focus,
[data-theme="dark"] .form-group select:focus {
  border-color: #60a5fa;
}

.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-container input {
  padding-right: 44px;
}

.password-toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  color: var(--muted);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  user-select: none;
}

.password-toggle:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text);
}

[data-theme="dark"] .password-toggle:hover {
  background: rgba(255, 255, 255, 0.05);
}

.password-toggle:active {
  transform: translateY(-50%) scale(0.95);
}

.user-select {
  padding: 6px 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  background: var(--card);
  color: var(--text);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.user-select:focus {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.user-select:hover:not(:disabled) {
  border-color: rgba(0, 0, 0, 0.15);
}

.user-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(0, 0, 0, 0.03);
}

[data-theme="dark"] .user-select {
  border-color: rgba(255, 255, 255, 0.08);
  background: var(--card);
}

[data-theme="dark"] .user-select:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .user-select:disabled {
  background: rgba(255, 255, 255, 0.03);
}

.hotspot-note {
  margin-top: 16px;
  margin-bottom: 0;
  font-size: 0.75em;
  font-style: italic;
  color: var(--muted, #666);
  text-align: center;
  opacity: 0.8;
}

.flex-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.form-group-spaced {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-row-inline {
  display: flex;
  align-items: center;
  gap: 8px;
}

.experimental-section-hidden {
  display: none;
}

.sparse-settings-btn-hidden {
  display: none;
}

.sparse-settings-btn-icon {
  width: 36px;
  height: 36px;
  padding: 6px;
  aspect-ratio: 1;
  min-height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sparse-settings-btn-icon svg {
  width: 18px;
  height: 18px;
  opacity: 0.8;
}
</style>
