<template>
        <div id="advertisements">
            <div class="">
                <div>
                    <label>Искать в заголовке: </label>
                    <input type="text" v-model="filters.title" @keyup.enter="updateOnEvent" />
                    <button v-on:click="filters.title = '';updateOnEvent();">Сбросить</button>
                </div>
                <div>
                    <label>Искать в описании: </label>
                    <input type="text" v-model="filters.description" @keyup.enter="updateOnEvent" />
                    <button v-on:click="filters.description = '';updateOnEvent();">Сбросить</button>
                </div>
                <div>
                    <label>Категория: </label>
                    <select v-model="filters.category" v-on:change="updateOnEvent">
                        <option v-for="elem in categories" :key="elem">{{ elem }}</option>
                    </select>
                    <button v-on:click="filters.category = 'Все';updateOnEvent();">Сбросить</button>
                </div>
                <div>
                    <label>От: </label>
                    <input type="date" v-model="filters.startDate" v-on:input="updateOnEvent" />
                    <button v-on:click="filters.startDate = null;updateOnEvent();">Сбросить</button>
                </div>
                <div>
                    <label>До: </label>
                    <input type="date" v-model="filters.endDate" v-on:input="updateOnEvent" />
                    <button v-on:click="filters.endDate = null;updateOnEvent();">Сбросить</button>
                </div>
                <div>
                    <label>Размер страницы: </label>
                    <select v-model="pageSizeSelector" v-on:change="setPaging">
                        <option>Все</option>
                        <option>10</option>
                        <option>20</option>
                        <option>50</option>
                        <option>100</option>
                    </select>
                </div>
                <div v-if="isPaging === true" class="page-selector">
                    <a v-on:click="toPage(1)">Первая</a>
                    <a v-on:click="toPage(pageNumber - 1)">Предыдущая</a>
                    <select v-on:change="toPage(pageNumber)" v-model="pageNumber">
                        <option v-for="i in totalPages" :key="i">{{ i }}</option>
                    </select>
                    <a v-on:click="toPage(+pageNumber + 1)">Следующая</a>
                    <a v-on:click="toPage(totalPages)">Последняя</a>
                </div>
            </div>
            <div>
                <table border="1">
                    <tr>
                        <th>ID</th>
                        <th><a>Заголовок</a></th>
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
                            <td>{{ categories[adv.categoryId] }}</td>
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
                pageSizeSelector: '',
                pageNumber: 1,
                totalPages: 1,
                isPaging: false,
                filters: {
                    title: '',
                    description: '',
                    category: 'Все',
                    startDate: null,
                    endDate: null
                },
                sortColumns: 0,
                sort: null,
                lastFilters: null,
                categories: [
                    'Все',
                    'Недвижимость',
                    'Личный транспорт',
                    'Бытовая техника',
                    'Персональная электроника',
                    'Одежда и обувь',
                    'Спорт и отдых',
                    'Прочее'
                ]
            };
    },
    methods: {
        refreshList: function() {
            let request = 'http://localhost:8080/advertisement/list?';

            if (this.pageSizeSelector !== 'Все') {
                request += `page_size=${this.pageSizeSelector}`;
                request += `&page_number=${this.pageNumber}&`;
            }
            if (this.filters.title !== '') {
                request += `title=${this.filters.title}&`;
            }
            if (this.filters.description !== '') {
                request += `description=${this.filters.description}&`;
            }
            if (this.filters.category !== 'Все') {
                request += `category_id=${this.categories.indexOf(this.filters.category)}&`;
            }
            if (this.filters.startDate !== null) {
                request += `start_timestamp=${this.filters.startDate} 00:00:00&`;
            }
            if (this.filters.endDate !== null) {
                request += `end_timestamp=${this.filters.endDate} 23:59:59&`;
            }

            axios.get(request).then(response => {
                console.log(request);

                if (this.pageSizeSelector === 'Все') {
                    this.advs = response.data;
                }
                else {
                    this.advs = response.data.content;
                    this.totalPages = response.data.totalPages;
                }
            });
        },
        updateOnEvent: function() {
            this.pageNumber = 1;
            this.refreshList();
            this.lastFilters = Object.assign({}, this.filters);
        },
        setPaging: function() {
            if (this.pageSizeSelector === 'Все') {
                this.isPaging = false;
            }
            else {
                this.isPaging = true;
            }

            this.toPage(1);
        },
        toPage: function(i) {
            console.log(i);
            if (i < 1) i = 1;
            if (i > this.totalPages) i = this.totalPages;

            this.pageNumber = i;
            this.filters = Object.assign({}, this.lastFilters);
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
        this.pageSizeSelector = 'Все';
        this.lastFilters = Object.assign({}, this.filters)
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
  color: blue;
}
table a {
    margin: 0 0.25rem;
}
table a:hover {
    text-decoration: underline;
    cursor: pointer;
}
</style>
