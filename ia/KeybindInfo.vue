<template>
	<div class="absolute px-6 py-2 top-0 right-0 bg-gradient-to-br from-gray-500 to-gray-300 hover:bg-gradient-to-bl rounded-bl-lg shadow-lg">
		<label class="flex cursor-pointer">
			<span class="-ml-1">AZ</span>
			<input type="checkbox" v-model="state_layout" class="sr-only peer">
			<div class="relative w-11 h-6 -right-2 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
			<span class="ml-3">QW</span>
		</label>
		<h2 class="flex justify-center items-center my-1 mb-2"><i class="fa-solid fa-arrow-down mr-2"></i>{{$t("Player1")}}<i class="fa-solid fa-arrow-down ml-2"></i></h2>
		<img v-if="GetLayoutState" class="absolute left-2 w-6 h-6" src="../../assets/img/key_w.png" alt="Touche haut joueur 1"/>
		<img v-if="!GetLayoutState" class="absolute left-2 w-6 h-6" src="../../assets/img/key_z.png" alt="Touche haut joueur 1"/>
		<h2 class="my-1 ml-4">Test touche</h2>
		<img class="absolute left-2 w-6 h-6" src="../../assets/img/key_s.png" alt="Touche bas joueur 1"/>
		<h2 class="my-1 ml-4">Test touche</h2>
		<h2 class="flex justify-center items-center my-1 mb-2"><i class="fa-solid fa-arrow-down mr-2"></i>{{$t("Player2")}}<i class="fa-solid fa-arrow-down ml-2"></i></h2>
		<img class="absolute left-2 w-6 h-6" src="../../assets/img/key_up.png" alt="Touche haut joueur 1"/>
		<h2 class="my-1 ml-4">Test touche</h2>
		<img class="absolute left-2 w-6 h-6" src="../../assets/img/key_down.png" alt="Touche bas joueur 1"/>
		<h2 class="my-1 ml-4">Test touche</h2>
	</div>
</template>

<script>
	import {mapGetters, mapMutations} from 'vuex';

	export default {
		name: "KeybindInfo",
        data() {
            return {
                state_layout: false,
            };
        },
		computed: {
			...mapGetters(['GetLayoutState']),
		},
		methods: {
            ...mapMutations(['SetLayoutState']),
			change_layout() {
				this.SetLayoutState(this.state_layout);
			},
		},
		watch: {
			state_layout(newVal) {
				this.SetLayoutState(newVal);
			}
		},
		mounted() {
			this.state_layout = this.GetLayoutState;
		},
	};
</script>

<style scoped>
	@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
</style>
