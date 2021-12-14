import type { ContactMaterial, Material } from "cannon-es";
import { writable } from "svelte/store";

interface MaterialStore {
	materials: Material[]
	contactMaterials: ContactMaterial[]
}

export const materialStore = writable<MaterialStore>({
	materials: [],
	contactMaterials: []
})