<template>
        <div id="advertisements">
            <div>
                <table border="1">
                    <tr>
                        <th>ID</th>
                        <th>Заголовок</th>
                        <th>Описание</th>
                        <th>Дата добавления</th>
                        <th>ID категории</th>
                    </tr>
                    <template v-for="adv in advs">
                        <tr v-bind:key="adv.id">
                            <td>{{ adv.id }}</td>
                            <td>{{ adv.title }}</td>
                            <td>{{ adv.description }}</td>
                            <td>{{ adv.addDateTime }}</td>
                            <td>{{ adv.categoryId }}</td>
                        </tr>
                    </template>
                </table>
            </div>
            <button v-on:click="getAdvertisements()">Get</button>
        </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'AdvertisementList',
    data: function() {
            return { advs: null };
    },
    methods: {
        getAdvertisements: function() {
            axios.get('http://localhost:8080/advertisement/list').then(response => (this.advs = response.data));
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
