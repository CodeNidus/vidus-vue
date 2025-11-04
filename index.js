

import vidus from 'vidus-core'

import Rooms from './components/Rooms.vue'
import RoomJoin from './components/RoomJoin.vue'
import Dialog from "./components/helpers/Dialog.vue";



const vidusVue = {
    configs: {},
    actions: {},
    themes: {},
    overrides: {},

    async install(app, options) {
        vidus.initial(this.configs, this.actions, this.themes, this.overrides)

        app.provide('webrtc', vidus)
            .component('VCRooms', Rooms)
            .component('VCRoomJoin', RoomJoin)
            .component('VCDialog', Dialog)
    }
}

export function VidusCreator(options = {}) {

    vidusVue.configs = options?.configs || {}
    vidusVue.actions = options?.actions || {}
    vidusVue.themes = options?.themes || {}
    vidusVue.overrides = options?.overrides || {}

    return vidusVue;
}

export default vidusVue;

