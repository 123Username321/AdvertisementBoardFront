<template>
        <div id="advertisements">
            <div class="">
                <h4>Список объявлений</h4>
                <div>
                    <label>Искать в заголовке: </label>
                    <input type="text" v-model="filters.title" v-on:change="isNewFilters=true;" @keyup.enter="updateOnEvent" />
                    <button v-on:click="filters.title = '';updateOnEvent();">Сбросить</button>
                </div>
                <div>
                    <label>Искать в описании: </label>
                    <input type="text" v-model="filters.description" v-on:change="isNewFilters=true;" @keyup.enter="updateOnEvent" />
                    <button v-on:click="filters.description = '';updateOnEvent();">Сбросить</button>
                </div>
                <div>
                    <label>Категория: </label>
                    <select v-model="filters.category" v-on:change="isNewFilters=true;updateOnEvent();">
                        <option v-for="elem in categories" :key="elem">{{ elem }}</option>
                    </select>
                    <button v-on:click="filters.category = 'Все';updateOnEvent();">Сбросить</button>
                </div>
                <div>
                    <label>От: </label>
                    <input type="date" v-model="filters.startDate" v-on:input="isNewFilters=true;updateOnEvent();" />
                    <button v-on:click="filters.startDate = null;updateOnEvent();">Сбросить</button>
                </div>
                <div>
                    <label>До: </label>
                    <input type="date" v-model="filters.endDate" v-on:input="isNewFilters=true;updateOnEvent();" />
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
            <div v-if="sort">
                <table border="1">
                    <tr>
                        <th v-for="(value, property) in sort" :key="property">
                            <a v-on:click="setSort(property)">{{ value.name }}</a>
                            <span v-if="!value.isSort">▴▾</span>
                            <span v-else-if="!value.isDesc">▴</span>
                            <span v-else>▾</span>
                            <span v-if="value.isSort">({{ value.number }})</span>
                        </th>
                    </tr>
                    <template v-for="adv in advs">
                        <tr v-bind:key="adv.id">
                            <td><a :href="'http://localhost:3000/advertisements/' + adv.id">{{ adv.title }}</a></td>
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
                isNewFilters: false,
                pageSizeSelector: '',
                pageNumber: 1,
                totalPages: 1,
                isPaging: false,
                sortNumber: 0,
                sort: {
                    title: {
                        name: 'Заголовок',
                        isSort: false,
                        isDesc: false,
                        number: 0
                    },
                    description: {
                        name: 'Описание',
                        isSort: false,
                        isDesc: false,
                        number: 0
                    },
                    addDateTime: {
                        name: 'Дата добавления',
                        isSort: false,
                        isDesc: false,
                        number: 0
                    },
                    'c.name': {
                        name: 'Категория',
                        isSort: false,
                        isDesc: false,
                        number: 0
                    }
                },
                filters: {
                    title: '',
                    description: '',
                    category: 'Все',
                    startDate: null,
                    endDate: null
                },
                sortColumns: 0,
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
            if (this.filters.category !== 'Все') {
                request += `category=${this.categories.indexOf(this.filters.category)}&`;
            }

            let sortParams = this.getSort();
            if (sortParams !== []) {
                request += 'sort=' + encodeURI(JSON.stringify(sortParams));
            }
            console.log(request);
            axios.get(request, {
                params: {
                    title: this.filters.title,
                    description: this.filters.description,
                    start_date: this.filters.startDate === null ? null : this.filters.startDate + ' 00:00:00',
                    end_date: this.filters.endDate === null ? null : this.filters.endDate + ' 23:59:59'
                }
            }).then(response => {
                //console.log(request);

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
            if (this.isNewFilters === true) {
                this.pageNumber = 1;
                this.isNewFilters = false;
            }
            else {
                if (i < 1) i = 1;
                if (i > this.totalPages) i = this.totalPages;
                this.pageNumber = i;
            }

            this.refreshList();
        },
        setSort: function(name) {
            if (this.sort[name].isSort === false) {
                this.sort[name].isSort = true;
                this.sort[name].number = ++this.sortNumber;
            }
            else {
                if (this.sort[name].isDesc === false) {
                    this.sort[name].isDesc = true;
                }
                else {
                    this.sort[name].isSort = false;
                    this.sort[name].isDesc = false;

                    for (let value in this.sort) {
                        if (this.sort[value].number > this.sort[name].number) {
                            this.sort[value].number--;
                        }
                    }

                    this.sort[name].number = 0;
                    this.sortNumber--;
                }
            }

            console.log(this.sort);
            this.refreshList();
        },
        getSort: function() {
            let sortParams = [];

            for (let i = 1; i < Object.keys(this.sort).length + 1; i++) {
                for (let value in this.sort) {
                    if (this.sort[value].number === i) {
                        sortParams.push({
                            columnName: value,
                            isDesc: this.sort[value].isDesc
                        });
                    }
                }
            }
            console.log(sortParams);
            return sortParams;
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
a:hover {
    text-decoration: underline;
    cursor: pointer;
}
table td a {
    margin: 0 0.25rem;
    color: green;
}
</style>
