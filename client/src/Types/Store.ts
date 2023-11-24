export type MP3sStore = {
	downloaded: Record<string, boolean>;
	downloading: Record<string, boolean>;
};