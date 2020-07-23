<template>
    <div class="container">
        <div id="advertisement-info" v-if="adv">
            <h4 class="centered-text">ID объявления: {{ $route.params.id }}</h4>
            <div class="info-line">
                <p class="text"><b>Заголовок:</b></p>
                <div class="delimeter"></div>
                <p class="text">{{ adv.title }}</p>
            </div>
            <div class="info-line">
                <p class="text"><b>Объявление:</b></p>
                <div class="delimeter"></div>
                <p class="text">{{ adv.description }}</p>
            </div>
            <div class="info-line">
                <p class="text"><b>Дата добавления:</b></p>
                <div class="delimeter"></div>
                <p class="text">{{ adv.addDateTime | formatTimestamp }}</p>
            </div>
            <div class="info-line">
                <p class="text"><b>Категория:</b></p>
                <div class="delimeter"></div>
                <p class="text">{{ adv.categoryName }}</p>
            </div>
            <h4 class="centered-text"><router-link :to="advListRoute">Назад</router-link></h4>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { RouteName } from '../router/index.js';

export default {
    name: 'Advertisement',
    data: function() {
        return { 
            adv: null, 
            advListRoute: { name: RouteName.ADVERTISEMENT_LIST }
        }
    },
    methods: {
        getAdvertisement: function() {
            axios.get('http://localhost:8080/advertisement/' + this.$route.params.id).then(response => (this.adv = response.data));
        }
    },
    filters: {
        formatTimestamp: function(value) {
            return value.substring(0, 10) + " " + value.substring(11, 19);
        }
    },
    mounted: function(){
        this.getAdvertisement();
    }
}
</script>

<style scoped>
.info-line {
    display: flex;
    margin: 1rem 0;
}
.info-line p {
    margin: 0;
}
.info-line .text {
    flex-grow: 0
}
.info-line .delimeter {
    flex-grow: 1;
    border-bottom: 2px dotted black;
    align-items: baseline;
    margin: 0 0.5rem;
}
</style>