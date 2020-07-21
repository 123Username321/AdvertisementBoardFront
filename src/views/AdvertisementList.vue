<template>
        <div id="advertisements">
            <div class="">
                <div>
                    <label>Искать в заголовке: </label>
                    <input type="text" v-model="titleInputValue"/>
                </div>
                <div>
                    <label>Искать в описании: </label>
                    <input type="text" v-model="descriptionInputValue"/>
                </div>
                <div>
                    <label>Размер страницы: </label>
                    <select v-model="pageSizeSelector">
                        <option>Все</option>
                        <option>10</option>
                        <option>20</option>
                        <option>50</option>
                        <option>100</option>
                    </select>
                </div>
                <div>
                    <button v-on:click="refreshList">Обновить</button>
                </div>
                <div v-if="isPaging === true" class="page-selector">
                    <a v-on:click="toFirstPage">First</a>
                    <a v-on:click="toPrevPage">Prev</a>
                    <a v-for="i in totalPages" :key="i" v-on:click="toPage(i)">{{ i }}</a>
                    <a v-on:click="toNextPage">Next</a>
                    <a v-on:click="toLastPage">Last</a>
                </div>
            </div>
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
                            <td><a :href="'http://localhost:3000/advertisements/' + adv.id">{{ adv.id }}</a></td>
                            <td>{{ adv.title }}</td>
                            <td>{{ adv.description }}</td>
                            <td>{{ adv.addDateTime | formatTimestamp }}</td>
                            <td>{{ adv.categoryId }}</td>
                        </tr>
                    </template>
                </table>
            </div>
        </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'AdvertisementList',
    data: function() {
            return { 
                advs: null,
                titleInputValue: '',
                descriptionInputValue: '',
                pageSizeSelector: '',
                pageNumber: 1,
                totalPages: 1,
                isPaging: false
            };
    },
    methods: {
        refreshList: function() {
            let isHasParam = false;
            let request = 'http://localhost:8080/advertisement/list';

            if (this.titleInputValue !== '') {
                request += `${isHasParam === true ? '&' : '?'}title=${this.titleInputValue}`;
                isHasParam = true;
            }
            if (this.descriptionInputValue !== '') {
                request += `${isHasParam === true ? '&' : '?'}description=${this.descriptionInputValue}`;
                isHasParam = true;
            }
            if (this.pageSizeSelector !== 'Все') {
                request += `${isHasParam === true ? '&' : '?'}page_size=${this.pageSizeSelector}`;
                request += `&page_number=${this.pageNumber}`;
                isHasParam = true;
            }
            console.log(request);
            axios.get(request).then(response => {
                if (this.pageSizeSelector === 'Все') {
                    this.advs = response.data;
                    this.isPaging = false;
                }
                else {
                    this.advs = response.data.content;
                    this.totalPages = response.data.totalPages;
                    this.isPaging = true;
                }

                console.log(this.totalPages);
            });
        },
        toFirstPage: function() {
            this.pageNumber = 1;
            this.refreshList();
        },
        toPrevPage: function() {
            this.pageNumber = this.pageNumber - 1;
            if (this.pageNumber < 1) this.pageNumber = 1;
            this.refreshList();
        },
        toPage: function(i) {
            this.pageNumber = i;
            this.refreshList();
        },
        toNextPage: function() {
            this.pageNumber = this.pageNumber + 1;
            if (this.pageNumber > this.totalPages) this.pageNumber = this.totalPages;
            this.refreshList();
        },
        toLastPage: function() {
            this.pageNumber = this.totalPages;
            this.refreshList();
        },
        getAdvertisements: function() {
            axios.get('http://localhost:8080/advertisement/list').then(response => (this.advs = response.data));
        }
    },
    filters: {
        formatTimestamp: function(value) {
            return value.substring(0, 10) + " " + value.substring(11, 19);
        }
    },
    mounted: function() {
        this.getAdvertisements();
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
.page-selector a {
    margin: 0 0.25rem;
}
.page-selector a:hover {
    text-decoration: underline;
    cursor: pointer;
}
</style>
