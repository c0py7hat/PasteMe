<template>
    <transition name="component-fade" mode="out-in">
        <component :is="view"></component>
    </transition>
</template>

<script>
    import Form from '../components/Form'
    import Success from '../components/Success'
    import PasswordAuth from '../components/PasswordAuth'
    import PasteView from '../components/PasteView'
    import Loading from '../components/Loading'
    export default {
        name: "Index",
        data() {
            return {
                view: 'loading',
                type: null,
                content: null,
                placeholder: null,
            }
        },
        watch: {
            '$route.params.keyword': function () {
                this.init();
            }
        },
        mounted() {
            if (this.$cookie.get('pasteme_lang') === null) {
                this.$cookie.set('pasteme_lang', 'zh-CN', 30);
            }
            this.$i18n.locale = this.$cookie.get('pasteme_lang');
            this.init();
        },
        methods: {
            init() {
                this.$store.commit('updateMode', {
                    read_once: false,
                });
                if (this.$route.params.keyword === '') {
                    this.view = 'home';
                } else {
                    this.view = 'loading';
                    this.axios.get(this.pasteme.config.api + 'get.php?browser=&token=' + this.$route.params.keyword).then(response => {
                        let code = response.data.status;
                        if (code === 200) {
                            this.view = 'paste_view';
                            this.content = response.data.content;
                            this.type = response.data.type;
                        } else if (code === 403) {
                            this.view = 'password_auth';
                        } else if (code === 404 && this.$route.params.keyword.search('[a-zA-Z]{1}') !== -1) {
                            this.$store.commit('updateMode', {
                                read_once: true,
                            });
                            this.view = 'home';
                        } else {
                            this.$router.push('What_are_you_nong_sha_lei');
                        }
                    }).then(function() {
                        window.Prism.highlightAll();
                    }).catch(error => {
                        alert(JSON.stringify(error) + '\n' + this.$t('lang.error.text'));
                    });
                }
            },
        },
        components: {
            'home': Form,
            'success': Success,
            'password_auth': PasswordAuth,
            'paste_view': PasteView,
            'loading': Loading,
        }
    }
</script>

<style scoped>
    .component-fade-enter-active, .component-fade-leave-active {
        transition: opacity .6s ease;
    }

    .component-fade-enter, .component-fade-leave-to {
        opacity: 0;
    }
</style>