<template>
    <div class="public-page">
        <div class="public-page__header">
            <Logo></Logo>
        </div>
        <div class="public-cocktail-recipe">
            <div class="public-cocktail-recipe__image" :style="{'background-image': 'url(' + mainImage.url + ')'}">
                <div class="public-cocktail-recipe__image__copyright" v-if="mainImage.copyright">Image &copy; {{ mainImage.copyright }}</div>
            </div>
            <div class="public-cocktail-recipe__summary">
                <h2>{{ cocktail.name }}</h2>
                <div v-show="!!cocktail.description" class="public-cocktail-recipe__content" v-html="parsedDescription"></div>
                <div class="public-cocktail-recipe__units">
                    <button type="button" class="button button--public" :class="{'button--active': currentUnit == 'ml'}" @click="currentUnit = 'ml'">ml</button>
                    <button type="button" class="button button--public" :class="{'button--active': currentUnit == 'oz'}" @click="currentUnit = 'oz'">oz</button>
                    <button type="button" class="button button--public" :class="{'button--active': currentUnit == 'cl'}" @click="currentUnit = 'cl'">cl</button>
                </div>
                <div class="public-cocktail-recipe__summary__section">
                    <h3>Ingredients</h3>
                    <ul>
                        <li v-for="ing in cocktail.ingredients">
                            <span>{{ ing.name }}</span><span class="spacer"></span><span class="amount-units">{{ parseIngredientAmount(ing) }}</span>
                        </li>
                    </ul>
                </div>
                <div class="public-cocktail-recipe__summary__section">
                    <h3>Instructions</h3>
                    <div class="public-cocktail-recipe__content" v-html="parsedInstructions"></div>
                </div>
                <div class="public-cocktail-recipe__summary__section" v-show="!!cocktail.garnish">
                    <h3>Garnish</h3>
                    <div class="public-cocktail-recipe__content" v-html="parsedGarnish"></div>
                </div>
            </div>
        </div>
        <div class="public-footer">
            Powered by <a href="https://github.com/karlomikus/bar-assistant">Bar Assistant</a>
        </div>
    </div>
</template>

<script>
import ApiRequests from '@/ApiRequests';
import { marked } from 'marked';
import Utils from '@/Utils';
import Logo from '@/components/Logo.vue'

export default {
    components: {
        Logo
    },
    data() {
        return {
            isLoading: false,
            cocktail: {},
            currentUnit: 'ml'
        }
    },
    watch: {
        cocktail(val) {
            document.title = `${val.name} \u22C5 Salt Rim`
        }
    },
    computed: {
        mainImage() {
            if (this.cocktail && this.cocktail.images) {
                return this.cocktail.images[0]
            }

            return {};
        },
        parsedDescription() {
            if (!this.cocktail.description) {
                return null;
            }

            return marked.parse(this.cocktail.description)
        },
        parsedInstructions() {
            if (!this.cocktail.instructions) {
                return null;
            }

            return marked.parse(this.cocktail.instructions)
        },
        parsedGarnish() {
            if (!this.cocktail.garnish) {
                return null;
            }

            return marked.parse(this.cocktail.garnish)
        },
    },
    created() {
        document.title = `Cocktail \u22C5 Salt Rim`
        this.$watch(
            () => this.$route.params,
            () => {
                if (this.$route.name == 'e.cocktail') {
                    this.getCocktail(this.$route.params.ulid)
                }
            },
            { immediate: true }
        )
    },
    mounted() {
        document.body.classList.add('public-body')
    },
    unmounted() {
        document.body.classList.remove('public-body')
    },
    methods: {
        getCocktail(ulid) {
            this.isLoading = true
            ApiRequests.fetchCocktailByPublicId(ulid).then(data => {
                this.cocktail = data
                this.isLoading = false
            }).catch(e => {
                this.$toast.error(e.message);
                this.isLoading = false
            })
        },
        parseIngredientAmount(ingredient) {
            return Utils.printIngredientAmount(ingredient, this.currentUnit);
        },
    }
}
</script>

<style scoped>
.public-page__header {
    padding: 2rem 0;
}

.public-page {
    align-items: center;
    justify-content: center;
    flex-direction: column;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 0 0.5rem;
}

.public-cocktail-recipe {
    --clr-content-bg: var(--clr-gray-50);
    --clr-content: var(--clr-gray-600);
    --clr-marker: var(--clr-red-800);
    --shadow-color: 239deg 26% 22%;
    --shadow-elevation-medium:
        0px 0.8px 0.9px hsl(var(--shadow-color) / 0.28),
        -0.1px 2.6px 3.1px -0.7px hsl(var(--shadow-color) / 0.3),
        -0.1px 6.3px 7.4px -1.4px hsl(var(--shadow-color) / 0.32),
        -0.3px 14.9px 17.5px -2.1px hsl(var(--shadow-color) / 0.35);
    display: grid;
    grid-template-columns: 1fr 1fr;
    place-content: center;
    margin-inline: auto;
    background: var(--clr-content-bg);
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: var(--shadow-elevation-medium);
    align-items: start;
}

.dark-theme .public-cocktail-recipe {
    --clr-content-bg: linear-gradient(160deg, var(--clr-dark-main-900) -15%, var(--clr-dark-main-950) 80%);
    --clr-content: var(--clr-gray-200);
    --shadow-color: 239deg 15% 5%;
    --clr-marker: var(--clr-red-400);
    border-top: 1px solid var(--clr-dark-main-800);
}

@media (max-width: 700px) {
    .public-cocktail-recipe {
        grid-template-columns: 1fr;
    }
}

.public-cocktail-recipe__image {
    position: relative;
    background-position: center;
    background-size: cover;
    height: 100%;
    min-height: 600px;
}

.public-cocktail-recipe__image__copyright {
    position: absolute;
    top: 1rem;
    left: 1rem;
    display: inline-block;
    background-color: rgba(0, 0, 0, .4);
    color: #fff;
    border-radius: 15px;
    padding: 2px 7px;
    font-size: 0.7rem;
    z-index: 2;
}

.public-cocktail-recipe h2 {
    font-size: 3rem;
    line-height: 1.2;
    font-family: var(--font-heading);
}

.public-cocktail-recipe h3 {
    font-size: 0.75rem;
    letter-spacing: 1px;
    font-weight: var(--fw-bold);
    color: var(--clr-gray-400);
    text-transform: uppercase;
    flex-basis: 120px;
    flex-shrink: 0;
    line-height: 2;
}

.public-cocktail-recipe__summary {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.public-cocktail-recipe__summary__section {
    display: flex;
    flex-direction: row;
}

@media (max-width: 450px) {
    .public-cocktail-recipe h3 {
        flex-basis: 100%;
    }
    .public-cocktail-recipe__summary__section {
        flex-direction: column;
    }
}

.public-cocktail-recipe__content {
    color: var(--clr-content);
}

:deep(.public-cocktail-recipe__summary ol) {
    padding-left: 18px;
    color: var(--clr-content);
    width: 100%;
}

:deep(.public-cocktail-recipe__summary ol li::marker) {
    color: var(--clr-marker);
}

.public-cocktail-recipe__summary ul {
    padding: 0;
    width: 100%;
}

.public-cocktail-recipe__summary ul li {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}

.public-cocktail-recipe__summary ul li .spacer {
    flex-grow: 1;
    border-bottom: 1px dotted var(--clr-gray-300);
    margin: 0 0.5rem;
}

.public-cocktail-recipe__summary ul li .amount-units {
    font-weight: var(--fw-bold);
}

.public-footer {
    padding: 1rem 0;
    font-size: 0.85rem;
    color: var(--clr-gray-300);
}

.public-footer a {
    color: var(--clr-gray-200);
}

.public-cocktail-recipe__units {
    text-align: right;
}
</style>
