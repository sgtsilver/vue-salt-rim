class ApiRequests
{
    static getUrl() {
        return window.srConfig.API_URL;
    }

    static getHeaders() {
        const defaultHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        if (localStorage.getItem('user_token')) {
            defaultHeaders['Authorization'] = 'Bearer ' + localStorage.getItem('user_token');
        }

        return new Headers(defaultHeaders);
    }

    static async handleResponseErrors(response) {
        if (!response.ok) {
            return Promise.reject(await response.json())
        }

        return response;
    }

    static parseResponse(resp) {
        if ('data' in resp) {
            return resp.data;
        }

        return resp
    }

    static async getRequest(path, queryParams = {}) {
        let url = `${this.getUrl()}${path}`
        const queryString = new URLSearchParams(queryParams).toString()
        if (queryString != '') {
            url += `?${queryString}`;
        }

        const f = fetch(url, {
            headers: this.getHeaders(),
        }).then(this.handleResponseErrors)

        return await (await f).json();
    }

    static async postRequest(path, data = {}, type = 'POST') {
        const url = `${this.getUrl()}${path}`

        return await (await fetch(url, {
            method: type,
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        }).then(this.handleResponseErrors)).json();
    }

    static async deleteRequest(path) {
        const url = `${this.getUrl()}${path}`

        return await (await fetch(url, {
            method: 'DELETE',
            headers: this.getHeaders()
        }).then(this.handleResponseErrors));
    }

    /**
     * =============================
     * Cocktails
     * =============================
     */

    static async fetchCocktails(queryParams = {}) {
        let jsonResp = await this.getRequest(`/api/cocktails`, queryParams);

        return this.parseResponse(jsonResp);
    }

    static async fetchUserCocktails(userId) {
        let jsonResp = await this.getRequest(`/api/cocktails?user_id=${userId}`);

        return this.parseResponse(jsonResp);
    }

    static async fetchUserFavoriteCocktails(limit = null) {
        let url = `/api/cocktails/user-favorites`;
        if (limit) {
            url += `?limit=${limit}`;
        }
        let jsonResp = await this.getRequest(url);

        return this.parseResponse(jsonResp);
    }

    static async fetchCocktail(id) {
        let jsonResp = await this.getRequest(`/api/cocktails/${id}`);

        return this.parseResponse(jsonResp);
    }

    static async randomCocktail() {
        let jsonResp = await this.getRequest(`/api/cocktails/random`);

        return this.parseResponse(jsonResp);
    }

    static async deleteCocktail(id) {
        return await this.deleteRequest(`/api/cocktails/${id}`);
    }

    static async fetchShelfCocktails(onlyIds = false, limit = null) {
        let query = {};
        if (onlyIds) {
            query['format'] = 'ids';
        }

        if (limit) {
            query['limit'] = limit;
        }

        const params = new URLSearchParams(query);
        const url = `/api/cocktails/user-shelf?${params.toString()}`;

        let jsonResp = await this.getRequest(url);

        return this.parseResponse(jsonResp);
    }

    static async favoriteCocktail(id) {
        let jsonResp = await this.postRequest(`/api/cocktails/${id}/toggle-favorite`);

        return this.parseResponse(jsonResp);
    }

    static async saveCocktail(data) {
        let jsonResp = await this.postRequest(`/api/cocktails`, data);

        return this.parseResponse(jsonResp);
    }

    static async updateCocktail(id, data) {
        let jsonResp = await this.postRequest(`/api/cocktails/${id}`, data, 'PUT');

        return this.parseResponse(jsonResp);
    }

    static async scrapeCocktail(data) {
        let jsonResp = await this.postRequest(`/api/scrape/cocktail`, data);

        return this.parseResponse(jsonResp);
    }

    static async createPublicLink(id) {
        let jsonResp = await this.postRequest(`/api/cocktails/${id}/public-link`);

        return this.parseResponse(jsonResp);
    }

    static async deletePublicLink(id) {
        return await this.deleteRequest(`/api/cocktails/${id}/public-link`);
    }

    static async fetchCocktailByPublicId(ulid) {
        let jsonResp = await this.getRequest(`/api/explore/cocktails/${ulid}`);

        return this.parseResponse(jsonResp);
    }

    /**
     * =============================
     * Ingredient Categories
     * =============================
     */

    static async fetchIngredientCategories() {
        let jsonResp = await this.getRequest(`/api/ingredient-categories`);

        return this.parseResponse(jsonResp);
    }

    static async fetchIngredientCategory(id) {
        let jsonResp = await this.getRequest(`/api/ingredient-categories/${id}`);

        return this.parseResponse(jsonResp);
    }

    static async saveIngredientCategory(data) {
        let jsonResp = await this.postRequest(`/api/ingredient-categories`, data);

        return this.parseResponse(jsonResp);
    }

    static async updateIngredientCategory(id, data) {
        let jsonResp = await this.postRequest(`/api/ingredient-categories/${id}`, data, 'PUT');

        return this.parseResponse(jsonResp);
    }

    static async deleteIngredientCategory(id) {
        return await this.deleteRequest(`/api/ingredient-categories/${id}`);
    }

    /**
     * =============================
     * Ingredients
     * =============================
     */

    static async fetchIngredients() {
        let jsonResp = await this.getRequest(`/api/ingredients`);

        return this.parseResponse(jsonResp);
    }

    static async fetchIngredientsOnShoppingList(limit = null) {
        let url = `/api/ingredients?on_shopping_list=true`;
        if (limit) {
            url += `&limit=${limit}`
        }
        let jsonResp = await this.getRequest(url);

        return this.parseResponse(jsonResp);
    }

    static async fetchIngredient(id) {
        let jsonResp = await this.getRequest(`/api/ingredients/${id}`);

        return this.parseResponse(jsonResp);
    }

    static async saveIngredient(data) {
        let jsonResp = await this.postRequest(`/api/ingredients`, data);

        return this.parseResponse(jsonResp);
    }

    static async updateIngredient(id, data) {
        let jsonResp = await this.postRequest(`/api/ingredients/${id}`, data, 'PUT');

        return this.parseResponse(jsonResp);
    }

    static async deleteIngredient(id) {
        return await this.deleteRequest(`/api/ingredients/${id}`);
    }

    static async findIngredient(query) {
        let jsonResp = await this.getRequest(`/api/ingredients/find`, query);

        return this.parseResponse(jsonResp);
    }

    /**
     * =============================
     * Shelf
     * =============================
     */

    static async fetchMyShelf() {
        let jsonResp = await this.getRequest(`/api/shelf`);

        return this.parseResponse(jsonResp);
    }

    static async addIngredientToShelf(id) {
        let jsonResp = await this.postRequest(`/api/shelf/${id}`);

        return this.parseResponse(jsonResp);
    }

    static async removeIngredientFromShelf(id) {
        return await this.deleteRequest(`/api/shelf/${id}`);
    }

    /**
     * =============================
     * Users
     * =============================
     */

    static async fetchUser() {
        let jsonResp = await this.getRequest(`/api/user`);

        return this.parseResponse(jsonResp);
    }

    static async updateUser(data) {
        let jsonResp = await this.postRequest(`/api/user`, data);

        return this.parseResponse(jsonResp);
    }

    static async registerNewUser(data) {
        let jsonResp = await this.postRequest(`/api/register`, data);

        return this.parseResponse(jsonResp);
    }

    /**
     * =============================
     * Server
     * =============================
     */

    static async fetchApiVersion() {
        let jsonResp = await this.getRequest(`/api/server/version`);

        return this.parseResponse(jsonResp);
    }

    /**
     * =============================
     * Shopping lists
     * =============================
     */

    static async addIngredientsToShoppingList(data) {
        let jsonResp = await this.postRequest(`/api/shopping-list/batch-store`, data);

        return this.parseResponse(jsonResp);
    }

    static async removeIngredientsFromShoppingList(data) {
        let jsonResp = await this.postRequest(`/api/shopping-list/batch-delete`, data);

        return this.parseResponse(jsonResp);
    }

    /**
     * =============================
     * Auth
     * =============================
     */

     static async fetchLoginToken(email, password) {
        const jsonResp = await this.postRequest(`/api/login`, {
            email: email,
            password: password
        });

        return jsonResp.token;
    }

    static async logout() {
        let jsonResp = await this.postRequest(`/api/logout`);

        return this.parseResponse(jsonResp);
    }

    /**
     * =============================
     * Images
     * =============================
     */

    static async deleteImage(id) {
        return await this.deleteRequest(`/api/images/${id}`);
    }

    static async uploadImages(formData) {
        const jsonResp = await (await fetch(`${this.getUrl()}/api/images`, {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + localStorage.getItem('user_token'),
            }),
            body: formData
        }).then(this.handleResponseErrors)).json();

        return this.parseResponse(jsonResp);
    }

    static async patchImage(id, formData) {
        const jsonResp = await (await fetch(`${this.getUrl()}/api/images/${id}`, {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + localStorage.getItem('user_token'),
            }),
            body: formData
        }).then(this.handleResponseErrors)).json();

        return this.parseResponse(jsonResp);
    }

    static imageThumbUrl(id) {
        return `${this.getUrl()}/api/images/${id}/thumb`;
    }

    /**
     * =============================
     * Glasses
     * =============================
     */

    static async fetchGlasses() {
        let jsonResp = await this.getRequest(`/api/glasses`);

        return this.parseResponse(jsonResp);
    }

    static async fetchGlass(id) {
        let jsonResp = await this.getRequest(`/api/glasses/${id}`);

        return this.parseResponse(jsonResp);
    }

    static async saveGlass(data) {
        let jsonResp = await this.postRequest(`/api/glasses`, data);

        return this.parseResponse(jsonResp);
    }

    static async updateGlass(id, data) {
        let jsonResp = await this.postRequest(`/api/glasses/${id}`, data, 'PUT');

        return this.parseResponse(jsonResp);
    }

    static async deleteGlass(id) {
        return await this.deleteRequest(`/api/glasses/${id}`);
    }

    static async findGlass(query) {
        let jsonResp = await this.getRequest(`/api/glasses/find`, query);

        return this.parseResponse(jsonResp);
    }

    /**
     * =============================
     * Ratings
     * =============================
     */

    static async rateCocktail(id, data) {
        let jsonResp = await this.postRequest(`/api/ratings/cocktails/${id}`, data);

        return this.parseResponse(jsonResp);
    }

    static async deleteCocktailUserRating(id) {
        return await this.deleteRequest(`/api/ratings/cocktails/${id}`);
    }

    /**
     * =============================
     * Users
     * =============================
     */

    static async fetchUsers() {
        let jsonResp = await this.getRequest(`/api/users`);

        return this.parseResponse(jsonResp);
    }

    static async fetchUserById(id) {
        let jsonResp = await this.getRequest(`/api/users/${id}`);

        return this.parseResponse(jsonResp);
    }

    static async saveUser(data) {
        let jsonResp = await this.postRequest(`/api/users`, data);

        return this.parseResponse(jsonResp);
    }

    static async updateUserById(id, data) {
        let jsonResp = await this.postRequest(`/api/users/${id}`, data, 'PUT');

        return this.parseResponse(jsonResp);
    }

    static async deleteUser(id) {
        return await this.deleteRequest(`/api/users/${id}`);
    }

    /**
     * =============================
     * Stats
     * =============================
     */

    static async fetchStats() {
        let jsonResp = await this.getRequest(`/api/stats`);

        return this.parseResponse(jsonResp);
    }

    /**
     * =============================
     * Tags
     * =============================
     */

    static async fetchTags() {
        let jsonResp = await this.getRequest(`/api/tags`);

        return this.parseResponse(jsonResp);
    }

    static async fetchTag(id) {
        let jsonResp = await this.getRequest(`/api/tags/${id}`);

        return this.parseResponse(jsonResp);
    }

    static async saveTag(data) {
        let jsonResp = await this.postRequest(`/api/tags`, data);

        return this.parseResponse(jsonResp);
    }

    static async updateTag(id, data) {
        let jsonResp = await this.postRequest(`/api/tags/${id}`, data, 'PUT');

        return this.parseResponse(jsonResp);
    }

    static async deleteTag(id) {
        return await this.deleteRequest(`/api/tags/${id}`);
    }

    /**
     * =============================
     * Cocktail methods
     * =============================
     */

    static async fetchCocktailMethods() {
        let jsonResp = await this.getRequest(`/api/cocktail-methods`);

        return this.parseResponse(jsonResp);
    }

    static async fetchCocktailMethod(id) {
        let jsonResp = await this.getRequest(`/api/cocktail-methods/${id}`);

        return this.parseResponse(jsonResp);
    }

    static async saveCocktailMethod(data) {
        let jsonResp = await this.postRequest(`/api/cocktail-methods`, data);

        return this.parseResponse(jsonResp);
    }

    static async updateCocktailMethod(id, data) {
        let jsonResp = await this.postRequest(`/api/cocktail-methods/${id}`, data, 'PUT');

        return this.parseResponse(jsonResp);
    }

    static async deleteCocktailMethod(id) {
        return await this.deleteRequest(`/api/cocktail-methods/${id}`);
    }

    static async checkVersions() {
        // https://api.github.com/repos/karlomikus/bar-assistant/releases/latest
        // https://api.github.com/repos/karlomikus/vue-salt-rim/releases/latest
    }

    static async checkMeilisearchStatus(meiliHost) {
        const f = fetch(`${meiliHost}/health`, {
        }).then(this.handleResponseErrors)

        return await (await f).json();
    }

    /**
     * =============================
     * Notes
     * =============================
     */

    static async saveNote(data) {
        let jsonResp = await this.postRequest(`/api/notes`, data);

        return this.parseResponse(jsonResp);
    }

    static async deleteNote(id) {
        return await this.deleteRequest(`/api/notes/${id}`);
    }
}

export default ApiRequests;
