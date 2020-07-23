<template>
        <div id="advertisements" class="container">
            <div class="flex-centered flex-column">
                <h4 class="centered-header">Список объявлений</h4>
                <div class="filter-list flex-space-between">
                    <div>
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
                    </div>
                    <div>
                        <label>Категория: </label>
                        <select v-model="filters.category" v-on:change="isNewFilters=true;updateOnEvent();">
                            <option v-for="elem in categories" :key="elem.id" :value="elem.id">{{ elem.name }}</option>
                        </select>
                        <button v-on:click="filters.category = 0;updateOnEvent();">Сбросить</button>
                    </div>
                    <div>
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
                    </div>
                </div>
            </div>
            <div class="advertisements" v-if="sort">
                <div class="inline-multiple">
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
                <div style="display: flex; justify-content: space-evenly">
                    <span v-for="(value, property) in sort" :key="property">
                        <a v-on:click="setSort(property)">{{ value.name }}</a>
                        <span v-if="!value.isSort">▴▾</span>
                        <span v-else-if="!value.isDesc">▴</span>
                        <span v-else>▾</span>
                        <span v-if="value.isSort">({{ value.number }})</span>
                    </span>
                </div>
                <div class="advert-list">
                    <template v-for="adv in advs">
                        <div class="advert-item" v-bind:key="adv.id">
                            <h3 class="title"><router-link :to="getAdvRoute(adv.id)">{{ adv.title }}</router-link></h3>
                            <p class="description">{{ adv.description }}</p>
                            <div class="footer">
                                <p class="category">{{ adv.categoryName }}</p>
                                <p class="date">{{ adv.addDateTime | formatTimestamp }}</p>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
</template>

<script>
import axios from 'axios';
import { RouteName } from '../router/index.js';

export default {
    name: 'AdvertisementList',
    data: function() {
            return { 
                advs: null,
                isNewFilters: false,
                pageSizeSelector: 'Все',
                pageNumber: 1,
                totalPages: 1,
                isPaging: false,
                filters: {
                    title: '',
                    description: '',
                    category: 0,
                    startDate: null,
                    endDate: null
                },
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
                sortNumber: 0,
                categories: []
            };
    },
    methods: {
        updateList: function() {
            let request = 'http://localhost:8080/advertisement/list';

            let sortParams = this.getSort();
            if (sortParams != false) {
                request += '?sort=' + encodeURI(JSON.stringify(sortParams));
            }
            
            axios.get(request, {
                params: {
                    title: this.filters.title === '' ? null : this.filters.title,
                    description: this.filters.description === '' ? null : this.filters.description,
                    category: this.filters.category === 0 ? null : this.filters.category,
                    start_date: this.filters.startDate === null ? null : this.filters.startDate + ' 00:00:00',
                    end_date: this.filters.endDate === null ? null : this.filters.endDate + ' 23:59:59',
                    page_size: this.pageSizeSelector === 'Все' ? null : this.pageSizeSelector,
                    page_number: this.pageSizeSelector === 'Все' ? null : this.pageNumber
                }
            }).then(response => {
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
            this.updateList();
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

            this.updateList();
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

            this.updateList();
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
            
            return sortParams;
        },
        loadCategories: function() {
            axios.get('http://localhost:8080/category/list').then(response => this.categories = [{id: 0, name: 'Все'}, ...response.data]);
        },
        getAdvRoute: function(advId) { 
            return { name: RouteName.ADVERTISEMENT, params: { id: advId } } ;
        },
    },
    filters: {
        formatTimestamp: function(value) {
            return value.substring(0, 10) + " " + value.substring(11, 19);
        }
    },
    mounted: function() {
        this.loadCategories();
        this.updateList();
    }
}
</script>


<style scoped>
.advertisements > div {
    margin: 0.5rem 0;
}
.page-selector {
    display: flex;
    justify-content: center;
}
.page-selector > * {
    margin: 0 0.5rem;
}
.advert-item {
    background-color: white;
    box-shadow:  0 0 0.4rem rgba(0, 0, 0, 0.2);
    padding: 0.5rem;
    margin: 0.75rem 0;
}
.advert-item p, .advert-item .title {
    margin: 0 0 0.5rem 0;
}
.advert-item .footer {
    display: flex;
    justify-content: space-between;
}
.advert-item .date, .advert-item .category {
    color: #666666;
}
.inline-multiple {
    display: flex;
}
.inline-multiple div:first-child {
    flex-grow: 0;
    display: flex;
}
.inline-multiple div:last-child {
    flex-grow: 1;
}
</style>
