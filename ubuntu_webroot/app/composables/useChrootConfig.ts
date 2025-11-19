// SPDX-License-Identifier: MIT
export const useChrootConfig = () => {
	const CHROOT_DIR = '/data/local/ubuntu-chroot'
	const PATH_CHROOT_SH = `${CHROOT_DIR}/chroot.sh`
	const CHROOT_PATH_UI = `${CHROOT_DIR}/rootfs`
	const BOOT_FILE = `${CHROOT_DIR}/boot-service`
	const POST_EXEC_SCRIPT = `${CHROOT_DIR}/post_exec.sh`
	const HOTSPOT_SCRIPT = `${CHROOT_DIR}/start-hotspot`
	const FORWARD_NAT_SCRIPT = `${CHROOT_DIR}/forward-nat.sh`
	const OTA_UPDATER = `${CHROOT_DIR}/ota/updater.sh`
	const LOG_DIR = `${CHROOT_DIR}/logs`

	const HOTSPOT_CONFIG = {
		PASSWORD_MIN_LENGTH: 8,
		DEFAULT_BAND: '2',
		DEFAULT_CHANNEL_2_4GHZ: '6',
		DEFAULT_CHANNEL_5GHZ: '36',
		CHANNELS_2_4GHZ: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
		CHANNELS_5GHZ: [
			36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140,
			149, 153, 157, 161, 165,
		],
	}

	const SPARSE_IMAGE_CONFIG = {
		SIZE_BASE: 1000,
		DEFAULT_SIZE_GB: 8,
		AVAILABLE_SIZES: [4, 8, 16, 32, 64, 128, 256, 512],
	}

	const ANIMATION_DELAYS = {
		POPUP_CLOSE: 450,
		UI_UPDATE: 50,
		STATUS_REFRESH: 500,
		BUTTON_ANIMATION: 120,
	}

	return {
		CHROOT_DIR,
		PATH_CHROOT_SH,
		CHROOT_PATH_UI,
		BOOT_FILE,
		POST_EXEC_SCRIPT,
		HOTSPOT_SCRIPT,
		FORWARD_NAT_SCRIPT,
		OTA_UPDATER,
		LOG_DIR,
		HOTSPOT_CONFIG,
		SPARSE_IMAGE_CONFIG,
		ANIMATION_DELAYS,
	}
}
