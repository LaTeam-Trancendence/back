import {createStore} from 'vuex';

export default createStore({
	state: {
		user: null,
		connect_state: false,
		color1: "#ff0000",
		color2: "#ffd200",
		ball_speed_time: false,
		ball_speed_manual: 1,
		remove_hit: false,
		layout: false,
	},
	getters: {
		GetUserState(state) {
			return state.user
		},
		GetConnectState(state) {
			return state.connect_state
		},
		GetColor1State(state) {
			return state.color1
		},
		GetColor2State(state) {
			return state.color2
		},
		GetBallSpeedTimeState(state) {
			return state.ball_speed_time
		},
		GetBallSpeedManualState(state) {
			return state.ball_speed_manual
		},
		GetRemoveHitState(state) {
			return state.remove_hit
		},
		GetLayoutState(state) {
			return state.layout
		},
	},
	mutations: {
		SetUser(state, user) {
			state.user = user;
		},
		ClearUser(state) {
			state.user = null;
		},
		SetConnectState(state, value) {
			state.connect_state = value;
		},
		SetColor1State(state, value) {
			state.color1 = value;
		},
		SetColor2State(state, value) {
			state.color2 = value;
		},
		SetBallSpeedTimeState(state, value) {
			state.ball_speed_time = value;
		},
		SetBallSpeedManualState(state, value) {
			state.ball_speed_manual = value;
		},
		SetRemoveHitState(state, value) {
			state.remove_hit = value;
		},
		SetLayoutState(state, value) {
			state.layout = value;
		},
	},
	actions: {
		Login({commit}, userData) {
			commit('SetUser', userData);
			localStorage.setItem('user', JSON.stringify(userData));
		},
		Logout({commit}) {
			commit('ClearUser');
			localStorage.removeItem('user');
		},
		InitializeStore({commit}) {
			const user = localStorage.getItem('user');
			if (user) {
				commit('SetUser', JSON.parse(user));
				commit('SetConnectState', true);
			}
		},
		OpenConnect({commit}) {
			commit('SetConnectState', true);
		},
		CloseConnect({commit}) {
			commit('SetConnectState', false);
		},
	},
});