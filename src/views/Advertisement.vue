<template>
    <div id="advertisement-info" v-if="adv">
        <h3>Route ID: {{ $route.params.id }}</h3>
        <p>ID: {{ adv.id }}</p>
        <p>Заголовок: {{ adv.title }}</p>
        <p>Объявление: {{ adv.description }}</p>
        <p>Дата добавления: {{ adv.addDateTime | formatTimestamp }}</p>
        <p>ID категории: {{ adv.categoryId }}</p>
        <p><a href="http://localhost:3000/advertisements/">Назад</a></p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Advertisement',
    data: function() {
        return { adv: null }
    },
    methods: {
        getAdvertisements: function() {
            axios.get('http://localhost:8080/advertisement/' + this.$route.params.id).then(response => (this.adv = response.data));
        }
    },
    filters: {
        formatTimestamp: function(value) {
            return value.substring(0, 10) + " " + value.substring(11, 19);
        }
    },
    mounted: function(){
        this.getAdvertisements();
    }
}
</script>