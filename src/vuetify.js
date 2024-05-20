import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { createVuetify } from "vuetify";


const chatAppTheme = {
	dark: true,
	colors: {
		background: "#141218",
		surface: "#141218",
		"on-surface": "#e6e0e9",
		"surface-container": "#211f26",
		"surface-container-high": "#2b2930",
		"surface-container-highest": "#36343b",
		"surface-container-low": "#1d1b20",
		primary: "#d0bcff",
		"on-primary": "#381e72",
		secondary: "#1E1F20",
		"secondary-container": "#4a4458",
		accent: "#282A2C",
		error: "#f2b8b5",
		"error-container": "#8c1d18",
	},
}

export default createVuetify({
	components,
	directives,
	theme: {
		defaultTheme: "chatAppTheme",
		themes: {
			chatAppTheme,
		},
	}
});