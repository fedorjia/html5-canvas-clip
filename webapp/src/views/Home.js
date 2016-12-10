import Component from './generic/Component';
import template from './tpls/home.html';

class HomeView extends Component {

    constructor() {
        super({
            className: 'home-view',
            events: {

            }
        });
    }

    /**
     * view did appear lifecycle
     */
    viewDidAppear() {

    }

    /**
     * mount ui
     */
    render() {
        super.render();
        // render view
        this.$el.html(template());
        this.setup();
        return this;
    }

    setup() {
        const $dim = this.$el.find('.dim');
        const $clip = this.$el.find('.clip');
        const $watch = $clip.find('img');

        // add gesture events

    }
}

export default HomeView;
