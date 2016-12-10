import router from './libs/router';
import Home from './views/Home';

const routers = {

	routes: {
		'': 'toHome'
	},

	/*********************************************
	 * router handler
	 * ********************************************/
	toHome() {
		router.fly(Home);
	}
};

export default routers;
