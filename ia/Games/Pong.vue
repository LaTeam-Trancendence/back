<script setup>
	import LoopVideo from '../LoopVideo.vue'
	import KeybindInfo from './KeybindInfo.vue'
</script>

<template>
	<div class="fixed inset-0 flex flex-col items-center justify-center">
		<LoopVideo/>
		<div v-if="isMobile && (!isLandscape && !isWidth)" class="fixed inset-0 flex flex-col items-center justify-center bg-gray-900">
			<h2 class="text-white text-2xl mx-8">{{$t("Phone_Size")}}</h2>
			<router-link
				to="/"
				class="absolute top-0 md:left-0 justify-center text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] bg-gradient-to-br from-sky-800 to-sky-500 hover:bg-gradient-to-bl text-xl text-center px-5 py-3 rounded-b-lg md:rounded-none md:rounded-br-lg shadow-lg"
			><i class="fa-solid fa-left-long mr-3"></i> {{$t('Back')}}
			</router-link>
		</div>
		<div v-else class="w-11.5/12 h-11/12 max-w-screen max-h-screen flex justify-center items-center bg-gray-900">
			<canvas ref="PongCanvas" :style="{borderColor: GetColor2State}" class="relative w-11.5/12 h-11/12 border-4 rounded-lg shadow-lg"></canvas>
			<router-link
				to="/"
				class="z-50 absolute top-0 md:left-0 justify-center text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] bg-gradient-to-br from-sky-800 to-sky-500 hover:bg-gradient-to-bl text-xl text-center px-5 py-3 rounded-b-lg md:rounded-none md:rounded-br-lg shadow-lg"
			><i class="fa-solid fa-left-long mr-3"></i> {{$t('Back')}}
			</router-link>
			<!-- Score & Touches -->
			<KeybindInfo class="hidden md:block"/>
			<h2 class="absolute mr-52 justify-center top-24 text-4xl" :style="{color: GetColor1State}">{{score_player1}}</h2>
			<h2 class="absolute ml-52 justify-center top-24 text-4xl" :style="{color: GetColor1State}">{{score_player2}}</h2>
			<!-- Paddle lantern -->
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
			<!-- Tactile si mobile -->
			<div class="absolute inset-0 grid grid-cols-2 grid-rows-2">
				<!-- Paddle gauche : Haut -->
				<button
					class="opacity-50 hover:opacity-75"
					@touchstart="handleTouch('left', 'up')"
					@touchend="handleTouchEnd('left')"
				></button>
				<!-- Paddle droit : Haut -->
				<button
					class="opacity-50 hover:opacity-75"
					@touchstart="handleTouch('right', 'up')"
					@touchend="handleTouchEnd('right')"
				></button>
				<!-- Paddle gauche : Bas -->
				<button
					class="opacity-50 hover:opacity-75"
					@touchstart="handleTouch('left', 'down')"
					@touchend="handleTouchEnd('left')"
				></button>
				<!-- Paddle droit : Bas -->
				<button
					class="opacity-50 hover:opacity-75"
					@touchstart="handleTouch('right', 'down')"
					@touchend="handleTouchEnd('right')"
				></button>
			</div>
			<!-- Victoire fin de match -->
			<div v-if="score_player1 >= 5 || score_player2 >= 5" class="absolute justify-center drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] bg-gradient-to-br from-red-800 to-red-500 hover:bg-gradient-to-bl rounded-lg shadow-lg">
				<h2 v-if="score_player1 >= 5" class="relative justify-center text-white text-4xl mx-6 my-8"><i class="fa-solid fa-trophy mr-4"></i>{{$t("Victory_Player1")}}<i class="fa-solid fa-trophy ml-4"></i></h2>
				<h2 v-if="score_player2 >= 5" class="relative justify-center text-white text-4xl mx-6 my-8"><i class="fa-solid fa-trophy mr-4"></i>{{$t("Victory_Player2")}}<i class="fa-solid fa-trophy ml-4"></i></h2>
				<button
					v-if="score_player1 >= 5 || score_player2 >= 5"
					@click="startGameLoop()"
					class="absolute top-32 left-1/2 -translate-x-1/2 justify-center px-4 py-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] bg-gradient-to-br from-sky-800 to-sky-500 hover:bg-gradient-to-bl text-white rounded-lg shadow-lg"
				><i class="fa-solid fa-rotate-right mr-3"></i>{{$t('Reset')}}</button>
			</div>
		</div>
	</div>
</template>

<script>
	import {ref} from 'vue';
	import {mapGetters, mapActions} from 'vuex';
	import apiClient from '@/axios';
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
				isWidth: false,
				isMobile: false,
				pong_instance: null,
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
			...mapGetters(['GetUserState']),
		},
		methods: {
			// Update size & position
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
				console.log("score");
				if (this.score_player1 >= 5 || this.score_player2 >= 5) {
					// appel api
					this.post_pong(this.score_player1);
				}
			},
			async post_pong(score_player1) {
				console.log("post end pong api");
				try {
					const userState = this.GetUserState;
					let state;
					console.log(score_player1);
					if (score_player1 >= 5) {
						state = "win_pong";
					}
					else {
						state = "lose_pong";
					}
					const response = await apiClient.post('player/', {user: userState, stat_type: state});
					console.log('Données envoyées avec succès :', response.data);
				} catch (error) {;
					console.error('Erreur lors de l\'envoi des données :', error.response ? error.response.data : error.message);
				}
			},
			// Check for phone
			checkIsLandscape() {
				if (window.matchMedia("(orientation: landscape)").matches) {
					this.isLandscape = true;
				}
				else {
					this.isLandscape = false;
				}
			},
			checkWidth() {
				
				if (window.innerWidth > window.innerHeight) {
					this.isWidth = true;
				}
				else {
					this.isWidth = false;
				}
			},
			checkIsMobile() {
				const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
				if (mobileRegex.test(navigator.userAgent)) {
					this.isMobile = true;
				}
				else {
					this.isMobile = false;
				}
			},
			// Game start & stop
			startGameLoop() {
				this.score_player1 = 0;
				this.score_player2 = 0;
				const canvas = this.$refs.PongCanvas;
				console.log("start gane loop");
				this.pong_instance = startPongGame(canvas, this.UpdatePaddlePositions, this.UpdateScore);
			},
			stopGameLoop() {
				if (this.pong_instance.animationFrameId) {
					console.log("stop pong game");
					stopPongGame(this.pong_instance.animationFrameId);
					this.pong_instance = null;
				}
			},

			handleTouch(side, direction) {
				this.pong_instance.handleTouch(side, direction);
			},
			handleTouchEnd(side) {
				this.pong_instance.handleTouchEnd(side);
			},
		},
		mounted() {
			// Check mobile
			window.addEventListener("resize", () => {
				this.checkIsLandscape();
				this.checkWidth();
			});
			window.addEventListener("orientationchange", () => {
				this.checkIsLandscape();
			});
			this.checkIsLandscape();
			this.checkWidth();
			this.checkIsMobile();

			// Lancer le jeu Pong et calculer les dimensions
			if (this.isMobile == true && this.isLandscape == true || this.isWidth == true) {
				const canvas = this.$refs.PongCanvas;
				this.pong_instance = startPongGame(canvas, this.UpdatePaddlePositions, this.UpdateScore);
			}
			if (this.isMobile == false) {
				const canvas = this.$refs.PongCanvas;
				this.pong_instance = startPongGame(canvas, this.UpdatePaddlePositions, this.UpdateScore);
			}

			// Calcul initial et écoute des redimensionnements
			window.addEventListener('resize', this.updateLanternHeight);
			this.updateLanternHeight();
		},
		beforeUnmount() {
			window.removeEventListener("resize", this.checkIsLandscape);
			window.removeEventListener("resize", this.checkWidth);
			window.removeEventListener("resize", this.updateLanternHeight);
			window.removeEventListener("orientationchange", this.checkIsLandscape);
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
