<script setup>
	import LoopVideo from '../LoopVideo.vue'
	import KeybindInfo from './KeybindInfo.vue'
</script>

<template>
	<div class="fixed inset-0 flex flex-col items-center justify-center">
		<LoopVideo/>
		<div class="w-11.5/12 h-11/12 max-w-screen max-h-screen flex justify-center items-center bg-gray-900">
			<canvas ref="PongCanvas" :style="{borderColor: GetColor2State}" class="relative w-11.5/12 h-11/12 border-4 rounded-lg shadow-lg"></canvas>
			<router-link
				to="/"
				class="absolute top-0 md:left-0 justify-center text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] bg-gradient-to-br from-sky-800 to-sky-500 hover:bg-gradient-to-bl text-xl text-center px-5 py-3 rounded-b-lg md:rounded-none md:rounded-br-lg shadow-lg"
			><i class="fa-solid fa-left-long mr-3"></i> {{$t('Back')}}
			</router-link>
			<KeybindInfo class="hidden md:block"/>
			<h2 class="absolute mr-52 justify-center top-24 text-4xl" :style="{color: GetColor1State}">{{score_player1}}</h2>
			<h2 class="absolute ml-52 justify-center top-24 text-4xl" :style="{color: GetColor1State}">{{score_player2}}</h2>
			<div v-if="score_player1 >= 5 || score_player2 >= 5" class="absolute justify-center drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] bg-gradient-to-br from-red-800 to-red-500 hover:bg-gradient-to-bl rounded-lg shadow-lg">
				<h2 v-if="score_player1 >= 5" class="relative justify-center text-white text-4xl mx-6 my-8"><i class="fa-solid fa-trophy mr-4"></i>{{$t("Victory_Player1")}}<i class="fa-solid fa-trophy ml-4"></i></h2>
				<h2 v-if="score_player2 >= 5" class="relative justify-center text-white text-4xl mx-6 my-8"><i class="fa-solid fa-trophy mr-4"></i>{{$t("Victory_Player2")}}<i class="fa-solid fa-trophy ml-4"></i></h2>
				<button
					v-if="score_player1 >= 5 || score_player2 >= 5"
					@click="startGameLoop()"
					class="absolute top-32 left-1/2 -translate-x-1/2 justify-center px-4 py-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] bg-gradient-to-br from-sky-800 to-sky-500 hover:bg-gradient-to-bl text-white rounded-lg shadow-lg"
				><i class="fa-solid fa-rotate-right mr-3"></i>{{$t('Reset')}}</button>
			</div>
			<img
				class="absolute"
				src="../../assets/img/lantern_rectangle.png"
				alt="Lanterne Joueur Gauche"
				:style="{
					filter: `drop-shadow(0px 0px 20px ${GetColor1State})`,
					top: `${leftPaddleY}px`,
					left: `${leftPaddleX}px`,
					height: `${lanternHeight}px`,
				}"
			/>
			<img
				class="absolute"
				src="../../assets/img/lantern_rectangle.png"
				alt="Lanterne Joueur Droite"
				:style="{
					filter: `drop-shadow(0px 0px 20px ${GetColor1State})`,
					top: `${rightPaddleY}px`,
					right: `${rightPaddleX}px`,
					height: `${lanternHeight}px`,
				}"
			/>		  
		</div>
	</div>
</template>

<script>
	import {ref} from 'vue';
	import {mapGetters} from 'vuex';
	import startPongGame, {stopPongGame} from "./pong.js";

	export default {
		name: "Pong",
		data() {
			return {
				canvasHeight: 0,
				lanternHeight: 0,
				leftPaddleY: 0,
				rightPaddleY: 0,
				leftPaddleX: 0,
				rightPaddleX: 0,
				isLandscape: false,
				gameLoopId: null,
				score_player1: 0,
				score_player2: 0,
			};
		},
		computed: {
			...mapGetters(['GetColor1State']),
			...mapGetters(['GetColor2State']),
			...mapGetters(['GetBallSpeedTimeState']),
			...mapGetters(['GetBallSpeedManualState']),
			...mapGetters(['GetRemoveHitState']),
		},
		methods: {
			updateLanternHeight() {
				const canvas = this.$refs.PongCanvas;
				if (canvas) {
					this.canvasHeight = canvas.offsetHeight;
					this.lanternHeight = this.canvasHeight * 0.2;
				}
			},
			UpdatePaddlePositions(positions) {
				const lanternOffset = this.lanternHeight * -0.5;
				this.leftPaddleY = positions.leftPaddleY - lanternOffset;
				this.rightPaddleY = positions.rightPaddleY - lanternOffset;
				this.leftPaddleX = positions.paddleOffset * 2.5;
				this.rightPaddleX = positions.paddleOffset * 2.5;
			},
			UpdateScore(recup_score) {
				this.score_player1 = recup_score.player1;
				this.score_player2 = recup_score.player2;
			},
			checkOrientation() {
				this.isLandscape = window.innerWidth > window.innerHeight;
				if (!this.isLandscape) {
					alert(this.$t("Phone_Size"));
				}
			},
			startGameLoop() {
				// Lancer le jeu Pong et calculer les dimensions
				this.score_player1 = 0;
				this.score_player2 = 0;
				const canvas = this.$refs.PongCanvas;
				this.gameLoopId = startPongGame(canvas, this.UpdatePaddlePositions, this.UpdateScore);
			},
			stopGameLoop() {
				if (this.gameLoopId) {
					stopPongGame(this.gameLoopId);
					this.gameLoopId = null;
				}
			},
		},
		mounted() {
			// orientation
			window.addEventListener('orientationchange', this.checkOrientation);
			this.checkOrientation();

			// Lancer le jeu Pong et calculer les dimensions
			const canvas = this.$refs.PongCanvas;
			this.gameLoopId = startPongGame(canvas, this.UpdatePaddlePositions, this.UpdateScore);

			// Calcul initial et écoute des redimensionnements
			this.updateLanternHeight();
			window.addEventListener('resize', this.updateLanternHeight);
		},
		beforeUnmount() {
			window.removeEventListener('resize', this.updateLanternHeight);
			window.removeEventListener('orientationchange', this.checkOrientation);
			this.stopGameLoop();
		},
	};
</script>


<style scoped>
	@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
</style>

<style>
	body {
		overflow-x: hidden;
	}
	.hidden-scrollbar {
		overflow: auto;
		scrollbar-width: none;
	}
	.hidden-scrollbar::-webkit-scrollbar {
		display: none;
	}
</style>
