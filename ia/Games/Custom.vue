<script setup>
	import LoopVideo from '../LoopVideo.vue'
</script>

<template>
    <div class="fixed inset-0 flex flex-col items-center justify-center">
        <LoopVideo/>
        <div class="relative w-4/5 md:w-3/5 bg-gray-900 border border-gray-600 hover:border-red-600 hover:outline outline-2 outline-red-600 rounded-lg">
            <!-- <img class="rounded-t-lg relative z-20" src="../../assets/img/lantern_empty.png" alt="Lanterne qui contient TicTacToe"/>
            <img class="absolute -top-24 left-0 w-full h-full object-contain scale-40 z-10" src="../../assets/img/morpion_trans.png" alt="Image du Pong"/> -->
            <div class="p-5 relative z-20">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">{{$t('Preferences_Games')}}</h5>
                <!-- <p class="mb-2 font-normal text-gray-400">{{$t('Descri_TicTacToe')}}</p> -->
                <!-- color 1 -->
                <h2 class="text-white absolute my-2">{{$t("Color1")}}</h2>
                <div v-if="$i18n.locale === 'fr'">
                    <input
                        type="color"
                        v-model="color1"
                        class="absolute w-10 h-10 mx-36 opacity-0 cursor-pointer"
                    />
                    <div
                        class="mb-3 w-10 h-10 mx-36 rounded-full border-2 border-gray-300 cursor-pointer"
                        :style="{backgroundColor: color1}"
                    >
                    </div>
				</div>
				<div v-else-if="$i18n.locale === 'en'">
                    <input
                        type="color"
                        v-model="color1"
                        class="absolute w-10 h-10 mx-24 opacity-0 cursor-pointer"
                    />
                    <div
                        class="mb-3 w-10 h-10 mx-24 rounded-full border-2 border-gray-300 cursor-pointer"
                        :style="{backgroundColor: color1}"
                    >
                    </div>
				</div>
				<div v-else-if="$i18n.locale === 'es'">
                    <input
                        type="color"
                        v-model="color1"
                        class="absolute w-10 h-10 mx-30 opacity-0 cursor-pointer"
                    />
                    <div
                        class="mb-3 w-10 h-10 mx-30 rounded-full border-2 border-gray-300 cursor-pointer"
                        :style="{backgroundColor: color1}"
                    >
                    </div>
				</div>
                <!-- color 2 -->
                <h2 class="text-white absolute my-2">{{$t("Color2")}}</h2>
                <div v-if="$i18n.locale === 'fr'">
                    <input
                        type="color"
                        v-model="color2"
                        class="absolute w-10 h-10 mx-38 opacity-0 cursor-pointer"
                    />
                    <div
                        class="mb-8 w-10 h-10 mx-38 rounded-full border-2 border-gray-300 cursor-pointer"
                        :style="{backgroundColor: color2}"
                    >
                    </div>
				</div>
				<div v-else-if="$i18n.locale === 'en'">
                    <input
                        type="color"
                        v-model="color2"
                        class="absolute w-10 h-10 mx-34 opacity-0 cursor-pointer"
                    />
                    <div
                        class="mb-8 w-10 h-10 mx-34 rounded-full border-2 border-gray-300 cursor-pointer"
                        :style="{backgroundColor: color2}"
                    >
                    </div>
				</div>
				<div v-else-if="$i18n.locale === 'es'">
                    <input
                        type="color"
                        v-model="color2"
                        class="absolute w-10 h-10 mx-34 opacity-0 cursor-pointer"
                    />
                    <div
                        class="mb-8 w-10 h-10 mx-34 rounded-full border-2 border-gray-300 cursor-pointer"
                        :style="{backgroundColor: color2}"
                    >
                    </div>
				</div>
                <!-- end color -->
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">Pong</h5>
                <!-- ball speed with time -->
                <label class="mb-3 md:inline-flex items-center cursor-pointer">
                    <span class="text-white">{{$t("Ball_Speed_Time")}} </span>
                    <input type="checkbox" v-model="state_ball_time" class="sr-only peer">
                    <div class="relative w-11 h-6 mt-1 md:-mt-0 md:-right-3 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                </label>

                <!-- ball speed manual -->
                <h2 class="text-white relative sm:absolute my-2">{{$t("Ball_Speed_Manual")}}</h2>
                <div class="relative mb-12 top-2 sm:left-38">
                    <label for="price-range-input" class="sr-only">Default range</label>
                    <input id="price-range-input" type="range" v-model="ball_speed_value" min="0" max="10" class="w-3/5 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer">
                    <span class="text-sm text-gray-400 absolute start-0 -bottom-6">x0.5</span>
                    <span class="text-sm text-gray-400 absolute w-3/5 transform -translate-x-1/2 -bottom-6">x5</span>
                    <span class="text-sm text-gray-400 absolute w-2/5 end-6 -bottom-6">x10</span>
                    <div class="relative mt-2">
                        <span id="range-indicator" class="text-sm text-gray-400 absolute x-1/2 -top-14 left-0 sm:left-4 lg:left-8 xl:left-14 bg-gray-800 px-2 py-1 rounded-md">
                            x1
                        </span>
                    </div>
                </div>

                <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">{{$t('TicTacToe')}}</h5>
                <!-- remove hit-->
                <label class="mb-8 md:inline-flex items-center cursor-pointer">
                    <span class="text-white">{{$t("Remove_Hit")}} </span>
                    <input type="checkbox" v-model="state_remove_hit" class="sr-only peer">
                    <div class="relative w-11 h-6 mb-8 md:mb-0 mt-1 md:mt-0 md:-right-3 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                </label>
  
                <div class="flex justify-between items-center flex-col md:flex-row space-y-4 md:space-y-0">
                    <router-link
                        to="/"
                        class="text-white bg-gradient-to-br from-red-800 to-red-500 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-3 py-2 text-center"
                    ><i class="fa-solid fa-xmark"></i> {{$t('Cancel')}}
                    </router-link>
                    <router-link
                        to="/"
                        @click="change_preferences()"
                        class="text-white bg-gradient-to-br from-green-800 to-green-500 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-3 py-2 text-center"
                    ><i class="fa-solid fa-check"></i> {{$t('Apply')}}
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        name: "CustomPong",
        data() {
            return {
                color1: '#ff0000',
                color2: '#ffd200',
                state_ball_time: false,
                ball_speed_value: 1,
                state_remove_hit: false,
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
            ...mapMutations(['SetColor1State']),
            ...mapMutations(['SetColor2State']),
            ...mapMutations(['SetBallSpeedTimeState']),
            ...mapMutations(['SetBallSpeedManualState']),
            ...mapMutations(['SetRemoveHitState']),

            change_preferences() {
                this.SetColor1State(this.color1);
                this.SetColor2State(this.color2);
                this.SetBallSpeedTimeState(this.state_ball_time);
                if (this.ball_speed_value == 0)
                {
                    this.ball_speed_value = 0.5;
                }
                this.SetBallSpeedManualState(this.ball_speed_value);
				this.SetRemoveHitState(this.state_remove_hit);
			},
        },
        mounted() {
			this.color1 = this.GetColor1State;
			this.color2 = this.GetColor2State;
			this.state_ball_time = this.GetBallSpeedTimeState;
			this.ball_speed_value = this.GetBallSpeedManualState;
			this.state_remove_hit = this.GetRemoveHitState;

            const rangeInput = document.getElementById('price-range-input');
            const rangeIndicator = document.getElementById('range-indicator');

            rangeInput.addEventListener('input', (event) => {
                const value = event.target.value;

                // Récupérer la largeur totale de la barre de progression
                const rangeWidth = rangeInput.offsetWidth;

                // Calculer le pourcentage de la progression (entre 0 et 100)
                const percent = (value - rangeInput.min) / (rangeInput.max - rangeInput.min);

                // Calculer la position en pixels en fonction du pourcentage
                const indicatorPosition = percent * rangeWidth;

                // Ajuster la position de l'indicateur pour le centrer
                const offset = rangeIndicator.offsetWidth / 2;
                rangeIndicator.style.left = `calc(${indicatorPosition}px - ${offset}px)`;

                // Mettre à jour le texte de l'indicateur
                rangeIndicator.textContent = `x${value}`;
            });
        },
    };
</script>

<style scoped>
	@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
</style>
