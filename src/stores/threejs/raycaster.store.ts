import type { RaycasterController } from "../../controllers/threejs/raycaster.controller";
import { writable } from "svelte/store";

export const raycaster = writable<RaycasterController>()