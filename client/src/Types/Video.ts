declare module VideoModule {

	export interface Thumbnail2 {
		 url: string;
		 width: number;
		 height: number;
	}

	export interface Thumbnail {
		 thumbnails: Thumbnail2[];
	}

	export interface WebCommandMetadata {
		 url: string;
		 webPageType: string;
		 rootVe: number;
		 apiUrl: string;
	}

	export interface CommandMetadata {
		 webCommandMetadata: WebCommandMetadata;
	}

	export interface BrowseEndpoint {
		 browseId: string;
		 canonicalBaseUrl: string;
	}

	export interface NavigationEndpoint {
		 clickTrackingParams: string;
		 commandMetadata: CommandMetadata;
		 browseEndpoint: BrowseEndpoint;
	}

	export interface Run {
		 text: string;
		 navigationEndpoint: NavigationEndpoint;
	}

	export interface ShortBylineText {
		 runs: Run[];
	}

	export interface AccessibilityData {
		 label: string;
	}

	export interface Accessibility {
		 accessibilityData: AccessibilityData;
	}

	export interface Length {
		 accessibility: Accessibility;
		 simpleText: string;
	}

	export interface Item {
		 id: string;
		 type: string;
		 thumbnail: Thumbnail;
		 title: string;
		 channelTitle: string;
		 shortBylineText: ShortBylineText;
		 length: Length;
		 isLive: boolean;
		 downloaded: boolean;
	}

	export interface ConfigInfo {
		 appInstallData: string;
	}

	export interface Client {
		 hl: string;
		 gl: string;
		 remoteHost: string;
		 deviceMake: string;
		 deviceModel: string;
		 visitorData: string;
		 userAgent: string;
		 clientName: string;
		 clientVersion: string;
		 osName: string;
		 osVersion: string;
		 originalUrl: string;
		 platform: string;
		 clientFormFactor: string;
		 configInfo: ConfigInfo;
		 acceptHeader: string;
		 deviceExperimentId: string;
	}

	export interface User {
		 lockedSafetyMode: boolean;
	}

	export interface Request {
		 useSsl: boolean;
	}

	export interface ClickTracking {
		 clickTrackingParams: string;
	}

	export interface Context {
		 client: Client;
		 user: User;
		 request: Request;
		 clickTracking: ClickTracking;
	}

	export interface NextPageContext {
		 context: Context;
		 continuation: string;
	}

	export interface NextPage {
		 nextPageToken: string;
		 nextPageContext: NextPageContext;
	}

	export interface Video {
		 items: Item[];
		 nextPage: NextPage;
	}

}