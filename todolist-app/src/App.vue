<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Header from './header.vue';

const todos = ref([]);
const name = ref('');

const input_content = ref('');
const input_category= ref(null);

const todos_asc = computed(() => todos.value.sort((a, b) => {
    return b.createdAt - a.createdAt
}))

const addTodo = () => {
    if ( input_content.value.trim() === '' || input_category.value === null ) {
        return
    }

    todos.value.push({
        content: input_content.value,
        category: input_category.value,
        done: false,
        createdAt: new Date().getTime()
    })

    input_content.value = '';
    input_category.value = null;
};

const removeTodo = todo => {
    todos.value = todos.value.filter(t => t !== todo)
};

watch(todos, newVal => {
    localStorage.setItem('todos', JSON.stringify(newVal))
}, {
    deep: true
}) 

watch(name, (newVal) => {
    localStorage.setItem('name', newVal)
})

onMounted(() => {
    name.value = localStorage.getItem('name') || '';
    todos.value = JSON.parse( localStorage.getItem('todos') ) || [];
})



</script>

<template>
    <main class="app">
        <Header></Header>
        <section class="greeting">
            <h2 class="title">
                Ehilà, <input type="text" placeholder="Utente" v-model="name" />
            </h2>
        </section>
        <div class="divider"></div>
        <section class="create-todo">
            <h3>INSERISCI UN'ATTIVITÀ</h3>
            <form @submit.prevent="addTodo">
                <h4>La tua attività.</h4>
                <input
                    type="text"
                    placeholder="es. Portare fuori il cane..."
                    v-model="input_content"
                />

                <h4>Scegli categoria.</h4>
                <div class="options">
                    <label>
                        <input 
                            type="radio"
                            name="category"
                            value="business"
                            v-model="input_category"
                        />
                        <span class="bubble business"></span>
                        <div>Aziendale</div>
                    </label>
                    <label>
                        <input 
                            type="radio"
                            name="category"
                            value="personal"
                            v-model="input_category"
                        />
                        <span class="bubble personal"></span>
                        <div>Personale</div>
                    </label>
                </div>

                <input type="submit" value="Aggiungi Attività" />
            </form>
        </section>
        <div class="divider"></div>
        <section class="todo-list">
            <h3>LISTA ATTIVITÀ</h3>
            <div class="list">
                <div v-for="todo in todos_asc" :class="`todo-item ${todo.done && 'done'}`">
                    <label>
                        <input type="checkbox" v-model="todo.done" />
                        <span :class="`bubble ${todo.category}`"></span>
                    </label>

                    <div class="todo-content">
                        <input type="text" v-model="todo.content" />
                    </div>

                    <div class="actions">
                        <button class="delete" @click="removeTodo(todo)"><i class="fas fa-times"></i></button>
                    </div>
                </div>
            </div>
        </section>
        <div class="divider"></div>
    </main>
</template>
